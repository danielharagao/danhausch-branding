// ===========================
// Links Page Internationalization
// ===========================

const linksTranslations = {
    en: {
        links: {
            subtitle: "Business Analyst Career Mentor",
            tagline: "Your Path to BA Success",
            social: "Connect with me",
            linkedin: "Professional network",
            instagram: "Behind the scenes",
            youtube: "Videos & tutorials",
            resources: "BA Career Resources",
            coaching: "1-on-1 Coaching",
            coachingdesc: "Personalized mentorship for your BA career journey",
            contact: "Get Started",
            contactdesc: "Start your Business Analyst career journey today",
            videotitle: "BA Career Tips",
            video: "Learn essential skills and strategies for your Business Analyst career",
            whatsapp: "Talk with me",
            back: "Back to Main Site",
            footer: "Your Path to BA Success"
        }
    },
    pt: {
        links: {
            subtitle: "Mentor de Carreira em Análise de Negócios",
            tagline: "Seu Caminho para o Sucesso como BA",
            social: "Conecte-se comigo",
            linkedin: "Rede profissional",
            instagram: "Bastidores",
            youtube: "Vídeos e tutoriais",
            resources: "Recursos de Carreira BA",
            coaching: "Mentoria 1-on-1",
            coachingdesc: "Mentoria personalizada para sua jornada de carreira de BA",
            contact: "Comece Agora",
            contactdesc: "Inicie sua jornada de carreira como Analista de Negócios hoje",
            videotitle: "Dicas de Carreira BA",
            video: "Aprenda habilidades e estratégias essenciais para sua carreira de Analista de Negócios",
            whatsapp: "Fale comigo",
            back: "Voltar ao Site Principal",
            footer: "Seu Caminho para o Sucesso como BA"
        }
    }
};

// Current language
let currentLangLinks = localStorage.getItem('language') || 'en';

// Get translation for a key
function getTranslationLinks(key) {
    const keys = key.split('.');
    let value = linksTranslations[currentLangLinks];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return key;
        }
    }
    
    return value;
}

// Update all elements with translations
function updatePageLanguageLinks() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslationLinks(key);
        element.textContent = translation;
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLangLinks === 'pt' ? 'pt-BR' : 'en';
    
    // Update body data-lang attribute
    document.body.setAttribute('data-lang', currentLangLinks);
    
    // Update page title
    if (currentLangLinks === 'pt') {
        document.title = 'Dan Hausch - Recursos de Carreira BA';
    } else {
        document.title = 'Dan Hausch - Business Analyst Career Resources';
    }
    
    // Store preference
    localStorage.setItem('language', currentLangLinks);
}

// Switch language
function switchLanguageLinks(lang) {
    if (lang !== currentLangLinks && (lang === 'en' || lang === 'pt')) {
        currentLangLinks = lang;
        updatePageLanguageLinks();
        
        // Update active button
        document.querySelectorAll('.lang-btn-fab').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    updatePageLanguageLinks();
    
    // Set active button
    document.querySelectorAll('.lang-btn-fab').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLangLinks) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        // Add click event
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguageLinks(lang);
        });
    });
});

// Export for use in other scripts
window.i18nLinks = {
    getTranslation: getTranslationLinks,
    switchLanguage: switchLanguageLinks,
    getCurrentLang: () => currentLangLinks
};

