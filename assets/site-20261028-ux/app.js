(() => {
  'use strict';
  const pair = (pt, en) => ({pt, en});
  let lang = 'pt', step = 0, editing = false, editSnapshot = null;
  try { lang = localStorage.getItem('danhausch-language') === 'en' ? 'en' : 'pt'; } catch {}
  const answers = {}, contact = {};
  const events = name => window.dispatchEvent(new CustomEvent('danhausch:analytics', {detail: {event: name, step: step + 1, language: lang}}));
  const copy = {
    edit: pair('Editar', 'Edit'), save: pair('Salvar alteração →', 'Save change →'), cancel: pair('Cancelar edição', 'Cancel edit'),
    next: pair('Continuar →', 'Continue →'), back: pair('Voltar', 'Back'), review: pair('Revisar respostas →', 'Review answers →'),
    required: pair('Escolha uma alternativa para continuar.', 'Choose an option to continue.'),
    invalid: pair('Revise os campos indicados e a autorização de contato.', 'Check the highlighted fields and the contact authorization.'),
    contact: pair('Como podemos falar com você?', 'How can we reach you?'),
    contactHint: pair('As informações ficam nesta página até você abrir o WhatsApp e decidir enviar a mensagem.', 'Your details stay on this page until you open WhatsApp and choose to send the message.'),
    name: pair('Nome', 'Name'), company: pair('Empresa', 'Company'), email: pair('E-mail profissional', 'Business email'), whatsapp: pair('WhatsApp com código do país', 'WhatsApp including country code'),
    consent: pair('Autorizo o uso dos dados informados para avaliar minha demanda e entrar em contato sobre esta solicitação.', 'I authorize the use of the details provided to assess my needs and contact me about this request.'),
    privacy: pair('Ler aviso de privacidade', 'Read privacy notice'),
    reviewTitle: pair('Revise suas respostas.', 'Review your answers.'),
    reviewHint: pair('Ao continuar, o WhatsApp abrirá com suas respostas. Revise a mensagem e toque em enviar para iniciar a conversa.', 'Continue to open WhatsApp with your answers. Review the message and press send to start the conversation.'),
    send: pair('Continuar no WhatsApp ↗', 'Continue on WhatsApp ↗'),
    appointment: pair('Agendamento', 'Scheduling'), appointmentHint: pair('O horário será combinado na conversa. Nenhuma reunião foi marcada automaticamente.', 'We will arrange a time during the conversation. No meeting has been booked automatically.'),
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
    back.textContent = tr(editing ? copy.cancel : copy.back); back.hidden = step === 0 && !editing;
    next.textContent = tr(editing ? copy.save : step === 5 ? copy.review : step === 6 ? copy.send : copy.next); next.disabled = false; next.hidden = step === 6;
    const heading = el('h3', step < 5 ? tr(questions[step].title) : tr(step === 5 ? copy.contact : copy.reviewTitle), {id:'stepHeading',tabindex:'-1'}); host.append(heading);
    if (step < 5) {
      const q = questions[step];
      if(q.hint) host.append(el('p',tr(copy[q.hint]),{class:'hint',id:'stepHint'}));
      const fields = el('fieldset',null,{class:'choices'+(['revenue','investment'].includes(q.key)?' dense':''),'aria-labelledby':'stepHeading'});
      if(q.hint) fields.setAttribute('aria-describedby','stepHint');
      q.options.forEach(([value,pt,en]) => {const label = el('label'); const input=el('input',null,{type:'radio',name:q.key,value,required:''}); input.checked = answers[q.key] === value; const full = lang === 'pt' ? pt : en;
        const ranges = {pre_revenue:['Sem faturamento','Pre-revenue'],under_500k:['< R$ 500 mil','< BRL 500k'],'500k_1m':['R$ 500 mil – < 1 mi','BRL 500k – < 1m'],'1m_3m':['R$ 1 mi – < 3 mi','BRL 1m – < 3m'],'3m_10m':['R$ 3 mi – < 10 mi','BRL 3m – < 10m'],'10m_30m':['R$ 10 mi – < 30 mi','BRL 10m – < 30m'],'30m_50m':['R$ 30 mi – < 50 mi','BRL 30m – < 50m'],'50m_100m':['R$ 50 mi – < 100 mi','BRL 50m – < 100m'],'100m_200m':['R$ 100 mi – < 200 mi','BRL 100m – < 200m'], '200m_plus':['R$ 200 mi ou mais','BRL 200m or more']};
        input.setAttribute('aria-label', full);
        const compact = q.key === 'revenue' && ranges[value] ? ranges[value][lang === 'pt' ? 0 : 1] : full;
        label.append(input,el('span',compact)); fields.append(label);}); host.append(fields);
    } else if(step === 5) {
      host.append(el('p',tr(copy.contactHint),{class:'hint'}));
      for(const [key,type,autocomplete] of [['name','text','name'],['company','text','organization'],['email','email','email'],['whatsapp','tel','tel']]) {
        const label=el('label',tr(copy[key]),{class:'field',for:key}); const input=el('input',null,{id:key,name:key,type,autocomplete,required:'',maxlength:key==='whatsapp'?'25':'150'}); input.value=contact[key]||'';
        if(key==='name'||key==='company') input.minLength=2;
        if(key==='whatsapp') {input.pattern='\\+?[0-9 ()-]{10,25}'; input.setAttribute('aria-describedby','phoneHint');}
        label.append(input);host.append(label);
      }
      host.append(el('p',lang==='pt'?'Inclua o código do país (Brasil: +55).':'Include your country code (Brazil: +55).',{class:'hint',id:'phoneHint'}));
      const label=el('label',null,{class:'consent'}), input=el('input',null,{type:'checkbox',name:'consent',required:''}); input.checked=contact.consent||false;label.append(input,el('span',tr(copy.consent)));host.append(label,el('a',tr(copy.privacy),{href:'privacidade.html',target:'_blank',rel:'noopener',class:'hint'}));
    } else {
      host.append(el('p',tr(copy.reviewHint),{class:'hint'})); const summary=el('dl',null,{class:'summary'});
      questions.forEach((q,index)=>{const option=q.options.find(o=>o[0]===answers[q.key]);const row=el('div');row.append(el('dt',tr(q.title)),el('dd',option ? option[lang==='pt'?1:2] : ''));row.append(editButton(index,tr(q.title)));summary.append(row);});
      ['name','company','email','whatsapp'].forEach(key=>{const row=el('div');row.append(el('dt',tr(copy[key])),el('dd',contact[key]),editButton(5,tr(copy[key])));summary.append(row);});host.append(summary,el('h3',tr(copy.appointment)),el('p',tr(copy.appointmentHint),{class:'hint'}));
      const lines = [lang === 'pt' ? 'Olá, Daniel. Quero conversar sobre minha empresa.' : 'Hi Daniel, I would like to discuss my business.'];
      questions.forEach(q => {
        const option = q.options.find(o => o[0] === answers[q.key]);
        lines.push(`${tr(q.title)}: ${option ? option[lang === 'pt' ? 1 : 2] : ''}`);
      });
      ['name','company','email','whatsapp'].forEach(key => lines.push(`${tr(copy[key])}: ${contact[key]}`));
      host.append(el('a',tr(copy.send),{id:'whatsappHandoff',class:'btn darkbtn',href:'https://wa.me/5519976298141?text='+encodeURIComponent(lines.join('\n')),target:'_blank',rel:'noopener noreferrer'}));
    }
    if(focus) revealStep(heading,focus===true);
  }
  function revealStep(heading, focus = true) {
    requestAnimationFrame(()=>{
      const header = document.querySelector('header').getBoundingClientRect().height;
      const top = scrollY + document.querySelector('.funnel').getBoundingClientRect().top - header - 16;
      window.scrollTo({top:Math.max(0,top),behavior:'instant'});
      if(focus) heading.focus({preventScroll:true});
    });
  }
  function editButton(index,label) {
    const button=el('button',tr(copy.edit),{type:'button',class:'edit-answer','data-edit-step':String(index),'aria-label':`${tr(copy.edit)}: ${label}`});
    button.addEventListener('click',()=>{
      editSnapshot={answers:{...answers},contact:{...contact}};editing=true;step=index;render(true);events('answer_edit_started');
    });
    return button;
  }
  window.danhauschScenes = () => lang === 'pt' ? [
    ['01 / COMPLEXIDADE','Processos<br>desconectados.','Dados espalhados e tarefas repetidas dificultam o trabalho.'],
    ['02 / CLAREZA','Uma operação<br>mais clara.','Conectamos informações e definimos como o trabalho deve acontecer.'],
    ['03 / MOVIMENTO','Inteligência<br>em movimento.','Implementamos, testamos com a equipe e acompanhamos o uso.']
  ] : [
    ['01 / COMPLEXITY','Disconnected<br>processes.','Scattered data and repetitive tasks make work harder.'],
    ['02 / CLARITY','Clearer<br>operations.','We connect information and define how work should happen.'],
    ['03 / MOMENTUM','Intelligence<br>in motion.','We implement, test with the team and track use.']
  ];
  function staticScenes() {
    document.querySelector('.static-scenes')?.remove();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(max-width:760px)').matches) return;
    const container=el('div',null,{class:'wrap static-scenes'});
    window.danhauschScenes().slice(1).forEach(scene=>container.append(el('h3',scene[1].replace('<br>',' ')),el('p',scene[2])));
    document.querySelector('.journey').append(container);
  }
  function language(value) {
    const rect=document.querySelector('.funnel').getBoundingClientRect();
    const keepVisible=rect.top<innerHeight&&rect.bottom>document.querySelector('header').getBoundingClientRect().bottom;
    saveContact(); lang=value; document.documentElement.lang=lang==='pt'?'pt-BR':'en';
    try{localStorage.setItem('danhausch-language',lang);}catch{}
    document.querySelector('.journey').setAttribute('aria-label',lang==='pt'?'Complexidade, clareza e movimento':'Complexity, clarity and momentum');
    window.danhauschLanguageChanged=true; render(keepVisible?'scroll':false); staticScenes(); window.dispatchEvent(new Event('scroll'));
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
    events('step_completed');if(editing){step=6;editing=false;editSnapshot=null;}else{step++;}render(true);events(step===6?'review_reached':'step_viewed');
  });
  document.getElementById('back').addEventListener('click',()=>{
    if(editing){Object.assign(answers,editSnapshot.answers);Object.assign(contact,editSnapshot.contact);editing=false;editSnapshot=null;step=6;render(true);return;}
    saveContact();if(step>0){step--;render(true);events('step_viewed');}
  });
  window.addEventListener('danhausch:language', event=>{language(event.detail);events('language_changed');});
  document.querySelectorAll('a[href="#contato"]').forEach(link=>link.addEventListener('click',()=>events('funnel_started')));
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',staticScenes);
  matchMedia('(max-width:760px)').addEventListener('change',staticScenes);
  language(lang);
})();
