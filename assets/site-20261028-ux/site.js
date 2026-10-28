(() => {
  'use strict';
  let language = 'pt';
  try { language = localStorage.getItem('danhausch-language') === 'en' ? 'en' : 'pt'; } catch {}
  const requestedLanguage=new URLSearchParams(location.search).get('lang');
  if(requestedLanguage==='pt'||requestedLanguage==='en')language=requestedLanguage;
  const toggle = document.getElementById('languageSwitch');
  const menu = document.getElementById('menuToggle');
  const header = document.querySelector('.dh-header');
  const page = document.body.dataset.page;
  const titles = {
    workshop:['Workshop de Business Analysis — Danhausch','Business Analysis Workshop — Danhausch'],
    home:['Danhausch — Inteligência em movimento','Danhausch — Intelligence in motion'],
    about:['Sobre — Danhausch','About — Danhausch'], privacy:['Privacidade — Danhausch','Privacy — Danhausch'],
    products:['Produtos — Danhausch','Products — Danhausch'],
    professionals:['Para profissionais — Danhausch','For professionals — Danhausch'],
    business:['Para empresas — Danhausch','For businesses — Danhausch']
  };
  // Keep text-node references so translating a heading never replaces links or emphasis.
  const translatedNodes = [];
  const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
  while(walker.nextNode()) {
    const node=walker.currentNode, original=node.textContent;
    const translation=window.DANHAUSCH_CATALOG_COPY?.[original.trim()];
    if(translation) translatedNodes.push({node,original,translation});
  }
  function closeMenu(restoreFocus=false) {
    header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');
    if(restoreFocus)menu.focus();
  }
  menu.addEventListener('click',()=>{
    const open=menu.getAttribute('aria-expanded')!=='true';
    header.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.classList.contains('menu-open'))closeMenu(true);});
  document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu();});
  header.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
  matchMedia('(max-width:760px)').addEventListener('change',()=>closeMenu());
  function apply(next) {
    language=next;window.danhauschLanguage=language;
    try {localStorage.setItem('danhausch-language',language);} catch {}
    document.documentElement.lang=language==='pt'?'pt-BR':'en';
    document.querySelectorAll('[data-i18n]').forEach(node=>{
      const value=window.DANHAUSCH_COPY[node.dataset.i18n];if(value)node.innerHTML=value[language];
    });
    translatedNodes.forEach(({node,original,translation})=>{
      node.textContent=language==='pt'?original:original.replace(original.trim(),translation);
    });
    document.querySelectorAll('img[data-alt-en]').forEach(image=>{
      image.dataset.altPt ||= image.alt;image.alt=language==='pt'?image.dataset.altPt:image.dataset.altEn;
    });
    header.querySelector('.dh-brand').setAttribute('aria-label',language==='pt'?'Danhausch, início':'Danhausch, home');
    toggle.setAttribute('aria-checked',String(language==='en'));
    toggle.setAttribute('aria-label',language==='pt'?'Idioma: português. Mudar para inglês.':'Language: English. Switch to Portuguese.');
    menu.setAttribute('aria-label',language==='pt'?'Abrir ou fechar menu':'Open or close menu');
    header.querySelector('nav').setAttribute('aria-label',language==='pt'?'Navegação principal':'Main navigation');
    document.querySelector('.footer-nav').setAttribute('aria-label',language==='pt'?'Empresa':'Company');
    document.querySelectorAll('a[href]').forEach(link=>{
      const target=new URL(link.href);
      if(['danhausch.com','lp.danhausch.com'].includes(target.hostname)&&target.origin!==location.origin){target.searchParams.set('lang',language);link.href=target.href;}
    });
    const title=titles[page];if(title)document.title=title[language==='pt'?0:1];
    const description=document.querySelector('meta[name="description"]');
    if(description){description.dataset.pt ||= description.content;description.content=language==='pt'?description.dataset.pt:page==='workshop'?'A practical 3-hour Business Analysis workshop. Join the interest list for the next confirmed session.':page==='products'?'Workshops, BA career mentoring and consulting products from Danhausch.':'Danhausch: management consulting, process automation, training and systems integration.';}
    window.dispatchEvent(new CustomEvent('danhausch:language',{detail:language}));
  }
  toggle.addEventListener('click',()=>apply(language==='pt'?'en':'pt'));
  toggle.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();apply(event.key==='ArrowLeft'?'pt':'en');}
  });
  header.querySelectorAll('nav a').forEach(link=>{
    const target=new URL(link.href);
    if(!target.hash && target.pathname===location.pathname)link.setAttribute('aria-current','page');
  });
  apply(language);
})();
