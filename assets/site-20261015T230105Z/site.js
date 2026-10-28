(() => {
  'use strict';
  let language = 'pt';
  try { language = localStorage.getItem('danhausch-language') === 'en' ? 'en' : 'pt'; } catch {}
  const toggle = document.getElementById('languageSwitch');
  const page = document.body.dataset.page;
  const titles = {home:['Danhausch — Inteligência em movimento','Danhausch — Intelligence in motion'],about:['Sobre — Danhausch','About — Danhausch'],privacy:['Privacidade — Danhausch','Privacy — Danhausch']};
  function apply(next) {
    language = next;
    window.danhauschLanguage = language;
    try { localStorage.setItem('danhausch-language', language); } catch {}
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.innerHTML = window.DANHAUSCH_COPY[node.dataset.i18n][language]; });
    toggle.setAttribute('aria-checked', String(language === 'en'));
    toggle.setAttribute('aria-label', language === 'pt' ? 'Idioma: português. Mudar para inglês.' : 'Language: English. Switch to Portuguese.');
    toggle.title = language === 'pt' ? 'Português / English' : 'English / Português';
    document.querySelector('header nav').setAttribute('aria-label', language === 'pt' ? 'Navegação principal' : 'Main navigation');
    document.querySelector('.footer-nav').setAttribute('aria-label', language === 'pt' ? 'Empresa' : 'Company');
    document.title = titles[page][language === 'pt' ? 0 : 1];
    document.querySelector('meta[name="description"]').content = language === 'pt' ? 'Danhausch: consultoria em gestão, automação de processos e integração de sistemas.' : 'Danhausch: management consulting, process automation and systems integration.';
    window.dispatchEvent(new CustomEvent('danhausch:language', {detail:language}));
  }
  toggle.addEventListener('click', () => apply(language === 'pt' ? 'en' : 'pt'));
  toggle.addEventListener('keydown', event => {
    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault();apply(event.key === 'ArrowLeft' ? 'pt' : 'en');}
  });
  document.querySelectorAll('header nav a').forEach(link => {
    if ((page === 'about' && link.getAttribute('href') === 'sobre.html')) link.setAttribute('aria-current','page');
  });
  apply(language);
})();
