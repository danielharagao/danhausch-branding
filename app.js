(() => {
  'use strict';
  const pair = (pt, en) => ({pt, en});
  let lang = 'pt', step = 0;
  try { lang = localStorage.getItem('avenor-language') === 'en' ? 'en' : 'pt'; } catch {}
  const answers = {}, contact = {};
  const events = name => window.dispatchEvent(new CustomEvent('avenor:analytics', {detail: {event: name, step: step + 1, language: lang}}));
  const copy = {
    next: pair('Continuar →', 'Continue →'), back: pair('Voltar', 'Back'), review: pair('Revisar respostas →', 'Review answers →'),
    required: pair('Escolha uma alternativa para continuar.', 'Choose an option to continue.'),
    invalid: pair('Revise os campos indicados e a autorização de contato.', 'Check the highlighted fields and the contact authorization.'),
    contact: pair('Como podemos falar com você?', 'How can we reach you?'),
    contactHint: pair('Nesta prévia, os campos ficam apenas na memória da página e são apagados ao recarregar.', 'In this preview, fields stay only in page memory and are cleared on reload.'),
    name: pair('Nome', 'Name'), company: pair('Empresa', 'Company'), email: pair('E-mail profissional', 'Business email'), whatsapp: pair('WhatsApp com código do país', 'WhatsApp including country code'),
    consent: pair('Autorizo o uso dos dados informados para avaliar minha demanda e entrar em contato sobre esta solicitação.', 'I authorize the use of the details provided to assess my needs and contact me about this request.'),
    privacy: pair('Ler aviso de privacidade', 'Read privacy notice'),
    reviewTitle: pair('Seu próximo passo está desenhado.', 'Your next move is taking shape.'),
    reviewHint: pair('Revise suas respostas. Na versão conectada, o envio confirmado será seguido pela escolha de um horário. Esta prévia não envia dados nem reserva horários.', 'Review your answers. In the connected version, confirmed submission will be followed by choosing a time. This preview does not send details or reserve appointments.'),
    send: pair('Envio e agenda disponíveis em breve', 'Submission and scheduling coming soon'),
    appointment: pair('Agendamento', 'Scheduling'), appointmentHint: pair('A agenda será conectada após definirmos o serviço. Nenhuma reunião foi marcada.', 'The calendar will be connected once the service is defined. No meeting has been booked.'),
    progress: pair('Etapa', 'Step'), of: pair('de', 'of'), revenueHint: pair('Faturamento bruto anual em reais (BRL). As faixas não se sobrepõem.', 'Annual gross revenue in Brazilian reais (BRL). Ranges do not overlap.'),
    investmentHint: pair('Estimativa em reais (BRL) para a iniciativa. Ainda não é um orçamento ou compromisso.', 'Estimated initiative budget in Brazilian reais (BRL). This is not a quote or commitment.')
  };
  const questions = [
    {key:'goal', title:pair('Qual é seu principal objetivo empresarial?', 'What is your main business objective?'), options:[['revenue','Aumentar faturamento','Increase revenue'],['costs','Reduzir custos','Reduce costs'],['capacity','Ampliar capacidade','Expand capacity'],['management','Melhorar gestão','Improve management'],['risk','Reduzir riscos','Reduce risk']]},
    {key:'revenue', title:pair('Qual é o faturamento anual da empresa?', 'What is your company’s annual revenue?'), hint:'revenueHint', options:[['pre_revenue','Ainda sem faturamento','Pre-revenue'],['under_500k','Até R$ 500 mil (exclusive)','Below BRL 500k'],['500k_1m','R$ 500 mil a menos de R$ 1 milhão','BRL 500k to under 1m'],['1m_3m','R$ 1 milhão a menos de R$ 3 milhões','BRL 1m to under 3m'],['3m_10m','R$ 3 milhões a menos de R$ 10 milhões','BRL 3m to under 10m'],['10m_30m','R$ 10 milhões a menos de R$ 30 milhões','BRL 10m to under 30m'],['30m_50m','R$ 30 milhões a menos de R$ 50 milhões','BRL 30m to under 50m'],['50m_100m','R$ 50 milhões a menos de R$ 100 milhões','BRL 50m to under 100m'],['100m_200m','R$ 100 milhões a menos de R$ 200 milhões','BRL 100m to under 200m'],['200m_plus','R$ 200 milhões ou mais','BRL 200m or more'],['undisclosed','Prefiro conversar sobre isso','I’d rather discuss this']]},
    {key:'timeline',title:pair('Quando você quer começar?', 'When would you like to start?'), options:[['now','Nos próximos 30 dias','Within 30 days'],['1_3_months','Entre 1 e 3 meses','In 1–3 months'],['3_6_months','Entre 3 e 6 meses','In 3–6 months'],['6_plus_months','Depois de 6 meses','After 6 months'],['exploring','Estou explorando possibilidades','I’m exploring possibilities']]},
    {key:'authority',title:pair('Qual é seu papel na decisão?', 'What is your role in the decision?'),options:[['decision_maker','Sou responsável pela decisão','I make the decision'],['shared','Decido junto com outras pessoas','I share the decision'],['recommender','Avalio e recomendo para quem decide','I evaluate and recommend'],['researcher','Estou pesquisando para a empresa','I’m researching for the company']]},
    {key:'investment',title:pair('Qual faixa de investimento você considera?', 'What investment range are you considering?'),hint:'investmentHint',options:[['under_10k','Menos de R$ 10 mil','Below BRL 10k'],['10k_30k','R$ 10 mil a menos de R$ 30 mil','BRL 10k to under 30k'],['30k_60k','R$ 30 mil a menos de R$ 60 mil','BRL 30k to under 60k'],['60k_100k','R$ 60 mil a menos de R$ 100 mil','BRL 60k to under 100k'],['100k_250k','R$ 100 mil a menos de R$ 250 mil','BRL 100k to under 250k'],['250k_plus','R$ 250 mil ou mais','BRL 250k or more'],['undefined','Quero definir com base no escopo','I’d like to define it based on scope']]}
  ];
  questions[1].options[1][1] = 'Menos de R$ 500 mil';
  const tr = value => value[lang];
  const el = (tag, text, attrs = {}) => {const node = document.createElement(tag); if (text != null) node.textContent = text; Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k,v)); return node;};
  const form = document.getElementById('qualification'), host = document.getElementById('formStep'), error = document.getElementById('formError');
  function saveContact() { if(step !== 5) return; ['name','company','email','whatsapp'].forEach(key => contact[key] = form.elements[key].value); contact.consent = form.elements.consent.checked; }
  function render(focus = false) {
    host.replaceChildren(); error.textContent = '';
    document.getElementById('progressText').textContent = `${tr(copy.progress)} ${step+1} ${tr(copy.of)} 7`;
    document.getElementById('progress').value = step + 1;
    const back = document.getElementById('back'), next = document.getElementById('next');
    back.textContent = tr(copy.back); back.hidden = step === 0;
    next.textContent = tr(step === 5 ? copy.review : step === 6 ? copy.send : copy.next); next.disabled = step === 6;
    const heading = el('h3', step < 5 ? tr(questions[step].title) : tr(step === 5 ? copy.contact : copy.reviewTitle), {id:'stepHeading',tabindex:'-1'}); host.append(heading);
    if (step < 5) {
      const q = questions[step];
      if(q.hint) host.append(el('p',tr(copy[q.hint]),{class:'hint',id:'stepHint'}));
      const fields = el('fieldset',null,{class:'choices','aria-labelledby':'stepHeading'});
      if(q.hint) fields.setAttribute('aria-describedby','stepHint');
      q.options.forEach(([value,pt,en]) => {const label = el('label'); const input=el('input',null,{type:'radio',name:q.key,value,required:''}); input.checked = answers[q.key] === value; label.append(input,el('span',lang === 'pt' ? pt : en)); fields.append(label);}); host.append(fields);
    } else if(step === 5) {
      host.append(el('p',tr(copy.contactHint),{class:'hint'}));
      for(const [key,type,autocomplete] of [['name','text','name'],['company','text','organization'],['email','email','email'],['whatsapp','tel','tel']]) {
        const label=el('label',tr(copy[key]),{class:'field',for:key}); const input=el('input',null,{id:key,name:key,type,autocomplete,required:'',maxlength:key==='whatsapp'?'25':'150'}); input.value=contact[key]||'';
        if(key==='name'||key==='company') input.minLength=2;
        if(key==='whatsapp') {input.pattern='\\+?[0-9 ()-]{10,25}'; input.setAttribute('aria-describedby','phoneHint');}
        label.append(input);host.append(label);
      }
      host.append(el('p',lang==='pt'?'Inclua o código do país (Brasil: +55).':'Include your country code (Brazil: +55).',{class:'hint',id:'phoneHint'}));
      const label=el('label',null,{class:'consent'}), input=el('input',null,{type:'checkbox',name:'consent',required:''}); input.checked=contact.consent||false;label.append(input,el('span',tr(copy.consent)));host.append(label,el('a',tr(copy.privacy),{href:'#privacidade',class:'hint'}));
    } else {
      host.append(el('p',tr(copy.reviewHint),{class:'hint'})); const summary=el('dl',null,{class:'summary'});
      questions.forEach(q=>{const option=q.options.find(o=>o[0]===answers[q.key]);const row=el('div');row.append(el('dt',tr(q.title)),el('dd',option ? option[lang==='pt'?1:2] : ''));summary.append(row);});
      ['name','company','email','whatsapp'].forEach(key=>{const row=el('div');row.append(el('dt',tr(copy[key])),el('dd',contact[key]));summary.append(row);});host.append(summary,el('h3',tr(copy.appointment)),el('p',tr(copy.appointmentHint),{class:'hint'}));
    }
    if(focus) heading.focus({preventScroll:true});
  }
  window.avenorScenes = () => lang === 'pt' ? [
    ['01 / COMPLEXIDADE','Ambição encontra<br>complexidade.','Seu objetivo está claro. O desafio é conectar pessoas, processos e recursos para realizá-lo.'],
    ['02 / CLAREZA','Clareza para<br>construir.','Transformamos o objetivo em prioridades, capacidades e um caminho de execução.'],
    ['03 / MOVIMENTO','Capacidade<br>em movimento.','Colocamos soluções em operação e evoluímos com evidências, junto com sua empresa.']
  ] : [
    ['01 / COMPLEXITY','Ambition meets<br>complexity.','Your goal is clear. The challenge is connecting people, processes and resources to achieve it.'],
    ['02 / CLARITY','Clarity to<br>build.','Turn your goal into priorities, capabilities and a path to execution.'],
    ['03 / MOMENTUM','Capacity<br>in motion.','Put solutions to work and evolve with evidence, alongside your business.']
  ];
  function staticScenes() {
    document.querySelector('.static-scenes')?.remove();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container=el('div',null,{class:'wrap static-scenes'});
    window.avenorScenes().slice(1).forEach(scene=>container.append(el('h3',scene[1].replace('<br>',' ')),el('p',scene[2])));
    document.querySelector('.journey').append(container);
  }
  function language(value) {
    saveContact(); lang=value; document.documentElement.lang=lang==='pt'?'pt-BR':'en';
    try{localStorage.setItem('avenor-language',lang);}catch{}
    document.querySelectorAll('[data-i18n]').forEach(node=>{node.innerHTML=window.AVENOR_COPY[node.dataset.i18n][lang];});
    document.querySelectorAll('[data-lang]').forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.lang===lang)));
    document.querySelector('nav').setAttribute('aria-label',lang==='pt'?'Navegação principal':'Main navigation');
    document.querySelector('.journey').setAttribute('aria-label',lang==='pt'?'Complexidade, clareza e movimento':'Complexity, clarity and momentum');
    document.title=lang==='pt'?'Avenor — Capacidade em movimento':'Avenor — Capacity in motion';
    document.querySelector('meta[name="description"]').content=lang==='pt'?'Estratégia, engenharia e inteligência aplicada para ampliar sua capacidade de execução.':'Strategy, engineering and applied intelligence to expand your capacity to execute.';
    window.avenorLanguageChanged=true; render(); staticScenes(); window.dispatchEvent(new Event('scroll'));
  }
  form.addEventListener('change',e=>{if(step<5 && e.target.type==='radio') answers[questions[step].key]=e.target.value;});
  form.addEventListener('submit',e=>{
    e.preventDefault(); if(step===6) return;
    if(step<5 && !answers[questions[step].key]) {error.textContent=tr(copy.required);host.querySelector('input').focus();events('validation_error');return;}
    if(step===5) {
      saveContact(); const inputs=[...host.querySelectorAll('input')];inputs.forEach(input=>input.setCustomValidity(''));
      ['name','company'].forEach(key=>{if(contact[key].trim().length<2) form.elements[key].setCustomValidity(tr(copy.invalid));});
      const digits=contact.whatsapp.replace(/\D/g,'');if(digits.length<10||digits.length>15) form.elements.whatsapp.setCustomValidity(tr(copy.invalid));
      const invalid=inputs.find(input=>!input.checkValidity());inputs.forEach(input=>input.setAttribute('aria-invalid',String(!input.checkValidity())));
      if(invalid){error.textContent=tr(copy.invalid);invalid.focus();events('validation_error');return;}
    }
    events('step_completed');step++;render(true);events(step===6?'review_reached':'step_viewed');
  });
  document.getElementById('back').addEventListener('click',()=>{saveContact();if(step>0){step--;render(true);events('step_viewed');}});
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{language(button.dataset.lang);events('language_changed');}));
  document.querySelectorAll('a[href="#contato"]').forEach(link=>link.addEventListener('click',()=>events('funnel_started')));
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',staticScenes);
  language(lang);
})();
