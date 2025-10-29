# Dan Hausch - Personal Landing Page

A modern, bilingual landing page with light/dark mode support, showcasing Daniel Hauschild de Aragão's professional brand, combining engineering, management, and innovation.

## 🎨 Theme Support

The site supports **Light and Dark modes** with an elegant toggle:
- **Dark Mode** 🌙 - Professional, modern (Default)
- **Light Mode** ☀️ - Clean, bright alternative

Theme preference is saved and automatically detected from your system settings.

## 🌐 Languages

The site supports **two languages** with a toggle in the top-right corner:
- **English (EN)** - Default
- **Portuguese (PT-BR)**

Language preference is saved in the browser's localStorage and persists across sessions.

## ✨ Features

### Design
- **Light & Dark modes** with smooth transitions
- **Dark modern theme** with gradient accents (default)
- **Light clean theme** for bright environments
- **Fully responsive** - works on desktop, tablet, and mobile
- **Smooth animations** and transitions
- **Interactive elements** with hover effects

### Sections
1. **Hero** - Main tagline with floating cards
2. **About** - Professional background and credentials
3. **Products** - ProspectaPro, Navi, and Meditation Courses
4. **Principles** - Core values (Structure Before Scale, Clarity Before Speed, Automation with Purpose)
5. **Value Proposition** - Key message
6. **Contact** - Form and social media links
7. **Footer** - Copyright and tagline

### Internationalization (i18n)
- Complete translations for EN and PT
- Automatic detection and persistence
- Easy to add more languages
- Clean translation system using `data-i18n` attributes

## 📁 Files

- `index.html` - Main HTML file with bilingual support and theme toggle
- `styles.css` - All styling including light/dark modes
- `theme.js` - Theme management system
- `i18n.js` - Internationalization system
- `script.js` - Interactive functionality

## 🚀 Usage

Simply open `index.html` in a web browser. No build process required!

### Local Development
1. Open the folder in your code editor
2. Use a local server (e.g., Live Server in VS Code) or simply open `index.html`
3. Edit translations in `i18n.js`
4. Edit styles in `styles.css`
5. Edit functionality in `script.js`

## 🎨 Customization

### Adding New Translations
Edit the `translations` object in `i18n.js`:

```javascript
const translations = {
    en: {
        nav: {
            home: "Home"
            // ... add more
        }
    },
    pt: {
        nav: {
            home: "Início"
            // ... add more
        }
    }
};
```

### Adding New Languages
1. Add a new language object in `i18n.js`
2. Add a new button in the HTML navigation
3. Update the `switchLanguage` function if needed

### Changing Colors

**Dark Mode** - Edit in `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
    --dark-bg: #0a0f1c;
    --text-primary: #ffffff;
    /* ... more variables */
}
```

**Light Mode** - Edit in `styles.css`:
```css
body[data-theme="light"] {
    --dark-bg: #f7fafc;
    --text-primary: #1a202c;
    /* ... more variables */
}
```

## 🔗 Social Links

Update the social media links in `index.html` (Contact section) to point to the actual profiles.

## 📱 Responsive Breakpoints

- **Desktop**: > 968px
- **Tablet**: 640px - 968px  
- **Mobile**: < 640px

## 🎯 Brand Positioning

**Tagline**: "Clarity through Construction"

**Core Principles**:
1. Structure Before Scale
2. Clarity Before Speed
3. Automation with Purpose

---

**Version**: 1.0  
**Last Updated**: October 2025  
**Author**: Daniel Hauschild de Aragão

