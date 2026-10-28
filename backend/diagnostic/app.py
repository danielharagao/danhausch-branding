#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import os
import re
import smtplib
import tempfile
import textwrap
import uuid
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request
from PIL import Image, ImageDraw, ImageFont

app = Flask(__name__)

FROM_EMAIL = os.getenv("AGPLACE_FORM_FROM_EMAIL", "daniel@danhausch.cloud")
FROM_NAME = os.getenv("AGPLACE_FORM_FROM_NAME", "Daniel Hausch")
SMTP_HOST = os.getenv("AGPLACE_FORM_SMTP_HOST", "smtp.hostinger.com")
SMTP_PORT = int(os.getenv("AGPLACE_FORM_SMTP_PORT", "465"))
SMTP_USER = os.getenv("AGPLACE_FORM_SMTP_USER", FROM_EMAIL)
SMTP_PASSWORD = os.getenv("AGPLACE_FORM_SMTP_PASSWORD", "")
BCC_EMAIL = os.getenv("AGPLACE_FORM_BCC_EMAIL", "")
OUTPUT_DIR = Path(os.getenv("AGPLACE_FORM_OUTPUT_DIR", "/var/lib/agplace-form/pdfs"))

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def clean(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(clean(v) for v in value if clean(v))
    return re.sub(r"\s+", " ", str(value)).strip()[:1000]


def score_revenue(text: str) -> int:
    checks = [
        ("Até R$ 20", 4), ("20 mil a R$ 50", 10), ("50 mil a R$ 100", 16),
        ("100 mil a R$ 300", 22), ("300 mil a R$ 1 milhão", 28),
        ("1 milhão a R$ 3", 34), ("3 milhões a R$ 10", 38),
        ("10 milhões a R$ 30", 40), ("Acima de R$ 30", 42),
    ]
    return next((points for token, points in checks if token in text), 0)


def score_investment(text: str) -> int:
    if not text or "Não investimos" in text:
        return 2
    checks = [
        ("Até R$ 1", 5), ("1 mil a R$ 3", 8), ("3 mil a R$ 5", 11),
        ("5 mil a R$ 10", 14), ("10 mil a R$ 30", 18),
        ("30 mil a R$ 100", 22), ("Acima de R$ 100", 25),
    ]
    return next((points for token, points in checks if token in text), 10)


def ai_maturity(items: list[str]) -> int:
    level = 0
    joined = " | ".join(items)
    if "Chats de IA" in joined or "Apps de IA" in joined:
        level = max(level, 1)
    if "ferramentas de trabalho" in joined:
        level = max(level, 2)
    if any(x in joined for x in ["Lovable", "Cursor", "Windsurf", "Replit", "Base44"]):
        level = max(level, 3)
    if "Agentes no computador" in joined or "terminal/CLI" in joined:
        level = max(level, 4)
    if "servidor/VPS" in joined or "Sistemas agênticos" in joined:
        level = max(level, 5)
    if len(items) == 1 and "Nenhuma ainda" in items[0]:
        level = 0
    return level


def fit_label(score: int) -> str:
    if score >= 85:
        return "Prioridade alta"
    if score >= 70:
        return "Bom fit"
    if score >= 40:
        return "Médio fit"
    return "Baixo fit agora"


def ai_label(level: int) -> str:
    return [
        "0/5 — Ainda não usa IA", "1/5 — Uso casual", "2/5 — IA em ferramentas",
        "3/5 — Maker/dev assistido por IA", "4/5 — Agentes locais ou CLI",
        "5/5 — Sistemas agênticos em operação",
    ][level]


def commercial_stage(origem: str, investimento: str, gargalo: str) -> tuple[str, str]:
    if ("Indicações" in origem or "Outro" in origem) and "Não investimos" in investimento:
        return "1/4 — Comercial informal", "A aquisição parece depender de relacionamento, indicação ou esforço manual. O risco central é baixa previsibilidade."
    if "Até R$ 1" in investimento or "1 mil a R$ 3" in investimento or "Prospecção ativa" in origem:
        return "2/4 — Aquisição em teste", "Existe movimento comercial, mas o funil provavelmente ainda tem vazamento entre atração, resposta, qualificação e follow-up."
    if any(x in investimento for x in ["5 mil", "10 mil", "30 mil"]) or "CRM" in gargalo or "follow-up" in gargalo:
        return "3/4 — Funil operacional", "A empresa já tem alguma estrutura. O maior ganho tende a vir de organização, automação e visibilidade do processo."
    return "4/4 — Comercial escalável", "O foco deixa de ser criar o funil e passa a ser otimizar velocidade, conversão, integração e ROI."


def intervention(gargalo: str, ai_level: int, investimento: str) -> str:
    if "visitantes" in gargalo:
        return "Página de conversão + CTA/WhatsApp + melhoria de oferta."
    if "Responder" in gargalo:
        return "Agente de primeira resposta no WhatsApp com triagem inicial."
    if "Qualificar" in gargalo:
        return "Agente de qualificação com perguntas, score e encaminhamento."
    if "follow-up" in gargalo:
        return "Cadência automática D+0, D+1, D+3 e D+7 integrada ao CRM."
    if "CRM" in gargalo:
        return "Pipeline comercial simples, critérios de oportunidade e relatório de conversão."
    if "indicação" in gargalo:
        return "Canal previsível de aquisição: landing page + tráfego/prospecção + rotina de follow-up."
    if "Escalar" in gargalo:
        return "Sistema agêntico integrado para automatizar rotinas comerciais e operacionais." if ai_level >= 4 else "Automação gradual dos pontos repetitivos antes de escalar equipe."
    if "Não investimos" in investimento:
        return "Diagnóstico de aquisição e página/oferta antes de mídia paga."
    return "Sistema de Aquisição B2B com IA: página, tráfego, WhatsApp/CRM e follow-up."


def diagnose(data: dict[str, Any]) -> dict[str, Any]:
    fields = {k: clean(v) for k, v in data.items() if not isinstance(v, list)}
    ia_items = [clean(x) for x in data.get("ia", []) if clean(x)]
    modelo = fields.get("modelo", "")
    origem = fields.get("origem", "")
    faturamento = fields.get("faturamento", "")
    equipe = fields.get("equipe", "")
    participacao = fields.get("participacao", "")
    gargalo = fields.get("gargalo", "")
    investimento = fields.get("investimento_marketing_vendas", "")
    ai_level = ai_maturity(ia_items)
    b2b_fit = 14 if re.search(r"outras empresas|software|plataforma|consultoria", modelo, re.I) else 4
    decision_fit = 10 if re.search(r"fundador|dono|sócio|majoritário|50/50", participacao, re.I) else (4 if "funcionário" in participacao.lower() else 2)
    pain_fit = 12 if re.search(r"leads|visitantes|Responder|Qualificar|follow-up|CRM|indicação|Escalar", gargalo, re.I) else 4
    origin_fit = 7 if re.search(r"Indicações|Prospecção ativa|Tráfego pago|Google", origem, re.I) else 3
    score = min(100, score_revenue(faturamento) + score_investment(investimento) + b2b_fit + decision_fit + pain_fit + origin_fit + min(ai_level * 3, 12))
    commercial_level, commercial_text = commercial_stage(origem, investimento, gargalo)
    profile = "operação solo" if "Só eu" in equipe else "operação pequena" if re.search(r"2 a 4|5 a 9", equipe) else "PME em crescimento" if re.search(r"10 a 19|20 a 49", equipe) else "empresa estruturada"
    return {
        "score": score,
        "fit": fit_label(score),
        "perfil": profile,
        "respondente": participacao,
        "maturidade_comercial": commercial_level,
        "maturidade_comercial_texto": commercial_text,
        "maturidade_ia": ai_label(ai_level),
        "principal_risco": gargalo or ("Dependência de indicação" if "Indicações" in origem else "Baixa previsibilidade comercial"),
        "proximo_passo": intervention(gargalo, ai_level, investimento),
        "plano_30_dias": [
            "Escolher uma oferta específica para aquisição.",
            "Criar ou revisar a página de conversão.",
            "Conectar formulário/WhatsApp ao processo comercial.",
            "Implementar triagem, qualificação ou follow-up com IA conforme o gargalo.",
            "Medir leads, respostas, reuniões e oportunidades.",
        ],
    }


def pdf_lines(data: dict[str, Any], diagnosis: dict[str, Any]) -> list[str]:
    lines = [
        "Diagnóstico AgPlace",
        f"Gerado em {datetime.now().strftime('%d/%m/%Y %H:%M')}",
        "",
        f"Score: {diagnosis['score']}/100 — {diagnosis['fit']}",
        f"Perfil provável: {diagnosis['perfil']}",
        f"Maturidade comercial: {diagnosis['maturidade_comercial']}",
        diagnosis["maturidade_comercial_texto"],
        f"Maturidade em IA: {diagnosis['maturidade_ia']}",
        f"Principal risco: {diagnosis['principal_risco']}",
        "",
        "Próximo passo recomendado",
        diagnosis["proximo_passo"],
        "",
        "Plano sugerido para 30 dias",
    ]
    lines += [f"{i}. {item}" for i, item in enumerate(diagnosis["plano_30_dias"], 1)]
    lines += ["", "Respostas informadas"]
    labels = {
        "nome":"Nome", "email":"E-mail", "mercado":"Mercado", "modelo":"Como ganha dinheiro",
        "ia":"Ferramentas de IA", "origem":"Origem dos clientes", "faturamento":"Faturamento mensal",
        "equipe":"Tamanho da equipe", "participacao":"Participação na empresa", "gargalo":"Maior gargalo",
        "investimento_marketing_vendas":"Investimento em marketing/vendas",
    }
    for key, label in labels.items():
        value = data.get(key, "")
        if value:
            lines.append(f"{label}: {clean(value)}")
    return lines


def create_pdf(data: dict[str, Any], diagnosis: dict[str, Any]) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf_path = OUTPUT_DIR / f"diagnostico-agplace-{uuid.uuid4().hex[:12]}.pdf"
    font_regular = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
    page_w, page_h = 1240, 1754  # A4-ish at 150dpi
    margin = 90
    pages = []
    img = Image.new("RGB", (page_w, page_h), "#fffaf1")
    draw = ImageDraw.Draw(img)
    y = margin
    for raw in pdf_lines(data, diagnosis):
        font = font_bold if raw in ["Diagnóstico AgPlace", "Próximo passo recomendado", "Plano sugerido para 30 dias", "Respostas informadas"] else font_regular
        wrapped = []
        for part in str(raw).split("\n"):
            wrapped.extend(textwrap.wrap(part, width=62) or [""])
        for line in wrapped:
            if y > page_h - margin:
                pages.append(img)
                img = Image.new("RGB", (page_w, page_h), "#fffaf1")
                draw = ImageDraw.Draw(img)
                y = margin
            draw.text((margin, y), line, fill="#211b15", font=font)
            y += 58 if font == font_bold else 44
        y += 10 if raw == "" else 6
    pages.append(img)
    first, rest = pages[0], pages[1:]
    first.save(pdf_path, "PDF", resolution=150.0, save_all=True, append_images=rest)
    return pdf_path


def send_email(to_email: str, data: dict[str, Any], diagnosis: dict[str, Any], pdf_path: Path) -> None:
    if not SMTP_PASSWORD:
        raise RuntimeError("SMTP password is not configured")
    msg = EmailMessage()
    name = clean(data.get("nome")) or "Diagnóstico"
    msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
    msg["To"] = to_email
    if BCC_EMAIL:
        msg["Bcc"] = BCC_EMAIL
    msg["Subject"] = "Seu diagnóstico AgPlace"
    msg.set_content(f"""Olá{(' ' + name) if name != 'Diagnóstico' else ''},

Segue em anexo seu diagnóstico AgPlace em PDF.

Resumo: score {diagnosis['score']}/100 — {diagnosis['fit']}.
Próximo passo recomendado: {diagnosis['proximo_passo']}

Daniel Hausch
""")
    msg.add_attachment(pdf_path.read_bytes(), maintype="application", subtype="pdf", filename="diagnostico-agplace.pdf")
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=30) as smtp:
        smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(msg)


@app.post("/diagnostico")
def diagnostico():
    data = request.get_json(silent=True) or {}
    email = clean(data.get("email"))
    if not EMAIL_RE.match(email):
        return jsonify({"ok": False, "error": "Informe um e-mail válido para receber o diagnóstico."}), 400
    diagnosis = diagnose(data)
    pdf_path = create_pdf(data, diagnosis)
    try:
        send_email(email, data, diagnosis, pdf_path)
    except Exception as exc:
        app.logger.exception("diagnostic_email_failed")
        return jsonify({"ok": False, "error": "Diagnóstico gerado, mas o envio por e-mail ainda não está configurado.", "diagnosis": diagnosis}), 503
    return jsonify({"ok": True, "message": "Diagnóstico enviado por e-mail.", "diagnosis": diagnosis})


@app.get("/health")
def health():
    return jsonify({"ok": True, "smtp_configured": bool(SMTP_PASSWORD), "from": FROM_EMAIL})


if __name__ == "__main__":
    app.run("127.0.0.1", int(os.getenv("PORT", "5094")))
