// ===========================
// Internationalization (i18n)
// ===========================

const translations = {
    en: {
        nav: {
            home: "Home",
            about: "About",
            products: "Products",
            principles: "Principles",
            contact: "Contact",
            links: "Links"
        },
        hero: {
            title: "Clarity through Creation",
            subtitle: "Transforming complex ideas into intelligent, sustainable products through the intersection of engineering, management, and innovation.",
            cta1: "Get in Touch",
            cta2: "Learn More",
            card1: "Innovation",
            card2: "Engineering",
            card3: "Strategy"
        },
        about: {
            title: "About",
            subtitle: "Bridging Technical Excellence with Business Strategy",
            lead: "Technology only has value when it solves something real and gives time back to people.",
            p1: "With 9 years of experience in technology, including 5 years at Instituto Eldorado, I've led and contributed to multi-million dollar projects for companies like Ambev, Lenovo, and Zoom. My work spans from complex corporate projects to bootstrapped SaaS products.",
            p2: "I hold a foundation in Mathematics (logical reasoning), Administration (systemic vision), an MBA in Innovation from UFSCar, and postgraduate studies at MIT in AI Products. This multidisciplinary background allows me to transform complexity into clarity.",
            cred1: "Years Experience",
            cred2: "Major Projects",
            cred3: "AI Products",
            badge: "International Experience"
        },
        products: {
            title: "Products & Projects",
            subtitle: "Building solutions that matter",
            product1: "Advanced prospecting and automation platform designed to amplify sales teams' efficiency through intelligent automation.",
            product2: "Intelligent navigation and workflow optimization system that brings clarity to complex operational processes.",
            product3title: "Meditation Courses",
            product3: "Structured meditation programs combining ancient wisdom with modern learning methodologies for sustainable practice.",
            tag1: "Automation",
            tag2: "Sales",
            tag3: "Workflow",
            tag4: "Education",
            tag5: "Wellness"
        },
        principles: {
            title: "Core Principles",
            subtitle: "Guiding philosophy for building meaningful technology",
            principle1title: "Structure Before Scale",
            principle1: "Build solid foundations before growing. Sustainable success requires strong architecture and clear processes.",
            principle2title: "Clarity Before Speed",
            principle2: "Deeply understand the problem before acting. Clarity eliminates waste and accelerates real progress.",
            principle3title: "Automation with Purpose",
            principle3: "Simplify repetitive tasks to amplify creative work. Technology should multiply human potential, not replace it."
        },
        value: {
            quote: "Technology should be a strategic asset, transforming complexity into operational clarity for professionals, technical leaders, and entrepreneurs."
        },
        contact: {
            title: "Get in Touch",
            subtitle: "Let's discuss how we can transform complexity into clarity",
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            submit: "Send Message",
            connect: "Connect",
            basedin: "Based in",
            international: "Open to international collaboration"
        },
        footer: {
            rights: "All rights reserved.",
            tagline: "Clarity through Creation"
        },
        notifications: {
            success: "Message sent successfully! I'll get back to you soon."
        }
    },
    pt: {
        nav: {
            home: "Início",
            about: "Sobre",
            products: "Produtos",
            principles: "Princípios",
            contact: "Contato",
            links: "Links"
        },
        hero: {
            title: "Clareza através da Criação",
            subtitle: "Transformando ideias complexas em produtos inteligentes e sustentáveis através da intersecção entre engenharia, gestão e inovação.",
            cta1: "Entre em Contato",
            cta2: "Saiba Mais",
            card1: "Inovação",
            card2: "Engenharia",
            card3: "Estratégia"
        },
        about: {
            title: "Sobre",
            subtitle: "Unindo Excelência Técnica com Estratégia de Negócios",
            lead: "Tecnologia só tem valor quando resolve algo real e devolve tempo às pessoas.",
            p1: "Com 9 anos de experiência em tecnologia, incluindo 5 anos no Instituto Eldorado, liderei e contribuí para projetos milionários para empresas como Ambev, Lenovo e Zoom. Meu trabalho abrange desde projetos corporativos complexos até produtos SaaS bootstrapped.",
            p2: "Tenho formação em Matemática (raciocínio lógico), Administração (visão sistêmica), MBA em Inovação pela UFSCar e pós-graduação no MIT em Produtos de IA. Essa base multidisciplinar me permite transformar complexidade em clareza.",
            cred1: "Anos de Experiência",
            cred2: "Grandes Projetos",
            cred3: "Produtos de IA",
            badge: "Experiência Internacional"
        },
        products: {
            title: "Produtos & Projetos",
            subtitle: "Construindo soluções que importam",
            product1: "Plataforma avançada de prospecção e automação projetada para amplificar a eficiência de equipes de vendas através de automação inteligente.",
            product2: "Sistema inteligente de navegação e otimização de workflow que traz clareza para processos operacionais complexos.",
            product3title: "Cursos de Meditação",
            product3: "Programas estruturados de meditação combinando sabedoria ancestral com metodologias modernas de aprendizagem para prática sustentável.",
            tag1: "Automação",
            tag2: "Vendas",
            tag3: "Workflow",
            tag4: "Educação",
            tag5: "Bem-estar"
        },
        principles: {
            title: "Princípios Fundamentais",
            subtitle: "Filosofia orientadora para construir tecnologia com propósito",
            principle1title: "Estrutura antes da Escala",
            principle1: "Construir bases sólidas antes de crescer. Sucesso sustentável requer arquitetura forte e processos claros.",
            principle2title: "Clareza antes da Velocidade",
            principle2: "Compreender profundamente o problema antes de agir. Clareza elimina desperdício e acelera o progresso real.",
            principle3title: "Automação com Propósito",
            principle3: "Simplificar tarefas repetitivas para amplificar o trabalho criativo. Tecnologia deve multiplicar o potencial humano, não substituí-lo."
        },
        value: {
            quote: "Tecnologia deve ser um ativo estratégico, transformando complexidade em clareza operacional para profissionais, líderes técnicos e empreendedores."
        },
        contact: {
            title: "Entre em Contato",
            subtitle: "Vamos discutir como podemos transformar complexidade em clareza",
            name: "Nome",
            email: "E-mail",
            subject: "Assunto",
            message: "Mensagem",
            submit: "Enviar Mensagem",
            connect: "Conecte-se",
            basedin: "Baseado em",
            international: "Aberto para colaboração internacional"
        },
        footer: {
            rights: "Todos os direitos reservados.",
            tagline: "Clareza através da Criação"
        },
        notifications: {
            success: "Mensagem enviada com sucesso! Retornarei em breve."
        }
    }
};

// Current language
let currentLang = localStorage.getItem('language') || 'en';

// Get translation for a key
function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return key; // Return key if translation not found
        }
    }
    
    return value;
}

// Update all elements with translations
function updatePageLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        
        // Update text content
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Update body data-lang attribute
    document.body.setAttribute('data-lang', currentLang);
    
    // Update page title
    if (currentLang === 'pt') {
        document.title = 'Daniel Hauschild de Aragão | Engenharia, Gestão & Inovação';
    } else {
        document.title = 'Daniel Hauschild de Aragão | Engineering, Management & Innovation';
    }
    
    // Store preference
    localStorage.setItem('language', currentLang);
}

// Switch language
function switchLanguage(lang) {
    if (lang !== currentLang && (lang === 'en' || lang === 'pt')) {
        currentLang = lang;
        updatePageLanguage();
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
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
    updatePageLanguage();
    
    // Set active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        // Add click event
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
});

// Export for use in other scripts
window.i18n = {
    getTranslation,
    switchLanguage,
    getCurrentLang: () => currentLang
};


