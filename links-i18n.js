// ===========================
// Links Page Internationalization
// ===========================

const linksTranslations = {
    en: {
        links: {
            subtitle: "Engineering • Management • Innovation",
            tagline: "Clarity through Creation",
            social: "Connect with me",
            linkedin: "Professional network",
            instagram: "Behind the scenes",
            youtube: "Videos & tutorials",
            projects: "Projects & Work",
            navi: "Intelligent navigation & workflow optimization",
            prospecta: "Sales automation & prospecting platform",
            eldorado: "Innovation & technology research",
            videotitle: "AI Multi-Agent Systems",
            video: "What are LLMs and how autonomous agents work",
            whatsapp: "Talk with me",
            back: "Back to Main Site",
            footer: "Clarity through Creation"
        }
    },
    pt: {
        links: {
            subtitle: "Engenharia • Gestão • Inovação",
            tagline: "Clareza através da Criação",
            social: "Conecte-se comigo",
            linkedin: "Rede profissional",
            instagram: "Bastidores",
            youtube: "Vídeos e tutoriais",
            projects: "Projetos & Trabalho",
            navi: "Navegação inteligente e otimização de workflow",
            prospecta: "Automação de vendas e prospecção",
            eldorado: "Pesquisa em inovação e tecnologia",
            videotitle: "Agentes de IA Multiagentes",
            video: "O que são LLMs e como funcionam os agentes autônomos",
            whatsapp: "Fale comigo",
            back: "Voltar ao Site Principal",
            footer: "Clareza através da Criação"
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
        document.title = 'Dan Hausch - Links';
    } else {
        document.title = 'Dan Hausch - Links';
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

