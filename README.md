# Dan Hausch - Business Analyst Career Mentor

A modern, bilingual landing page with light/dark mode support, showcasing Daniel Hauschild de Aragão's Business Analyst career mentorship brand, helping professionals start and succeed in their BA careers.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### 🎨 Theme Support
- **Dark Mode** 🌙 - Professional, modern (Default)
- **Light Mode** ☀️ - Clean, bright alternative
- Automatic system preference detection
- Smooth transitions between modes

### 🌐 Bilingual Support
- **English (EN)** - Default
- **Portuguese (PT-BR)**
- Complete translations for all content
- Persistent language preference

### 📱 Fully Responsive
- Desktop, tablet, and mobile optimized
- Touch-friendly interactions
- Hamburger menu for mobile
- Adaptive layouts

### ✨ Interactive Elements
- Smooth scrolling navigation
- Animated floating cards
- 3D hover effects
- Contact form with validation
- Beautiful transitions

## 🚀 Pages

### Main Landing Page (`index.html`)
Complete professional landing page with:
- Hero section with animated cards focused on BA skills
- About section highlighting BA mentorship experience
- Services showcase (1-on-1 Coaching, Career Transition Program, BA Skills Training)
- Core principles section for BA career success
- Contact form
- Social media links

### Links Page (`links.html`)
Linktree-style page featuring:
- Icon-only social media buttons (LinkedIn, Instagram, YouTube)
- BA career resources and links
- Coaching and mentorship offerings
- Quick access to main site services

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables
- **Vanilla JavaScript** - No dependencies
- **CSS Grid & Flexbox** - Responsive layouts
- **localStorage API** - Preference persistence

## 📁 Project Structure

```
danhausch-branding/
├── index.html              # Main landing page
├── links.html              # Links page
├── styles.css              # Main site styles
├── links-styles.css        # Links page styles
├── theme.js                # Theme management
├── i18n.js                 # Main site translations
├── links-i18n.js           # Links page translations
├── script.js               # Main site interactions
├── links-script.js         # Links page interactions
└── docs/                   # Documentation files
    ├── README.md
    ├── THEME_GUIDE.md
    ├── LANGUAGE_TOGGLE_GUIDE.md
    ├── LINKS_PAGE_GUIDE.md
    ├── PROJECT_STRUCTURE.md
    └── FEATURES_SUMMARY.md
```

## 🎯 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/danielharagao/danhausch-branding.git
cd danhausch-branding
```

2. **Open in browser**
```bash
# Simply open index.html in your browser
# No build process required!
```

3. **Customize**
- Update content in HTML files
- Modify colors in CSS variables
- Add translations in i18n files
- Update links and social media URLs

## 🎨 Customization

### Colors (Dark Mode)
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
    --dark-bg: #0a0f1c;
    --text-primary: #ffffff;
}
```

### Colors (Light Mode)
```css
body[data-theme="light"] {
    --dark-bg: #f7fafc;
    --text-primary: #1a202c;
}
```

### Adding Translations
Edit `i18n.js` or `links-i18n.js`:
```javascript
const translations = {
    en: { /* English */ },
    pt: { /* Portuguese */ }
};
```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## ♿ Accessibility

- WCAG AA compliant
- Keyboard navigation support
- ARIA labels on interactive elements
- Screen reader friendly
- High contrast in both themes

## 🌐 Live Demo

Visit: [danhausch.com](https://danhausch.com) *(update with your URL)*

## 📧 Contact

**Daniel Hauschild de Aragão - Business Analyst Career Mentor**
- LinkedIn: [danielharagao](https://www.linkedin.com/in/danielharagao/)
- Instagram: [@danhausch](https://www.instagram.com/danhausch/)
- YouTube: [@danielharagao](https://www.youtube.com/@danielharagao)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with care and attention to detail. Focused on:
- Clean, maintainable code
- Performance optimization
- User experience
- Accessibility

---

**"Your Path to BA Success"** 🎯

© 2025 Daniel Hauschild de Aragão. All rights reserved.
