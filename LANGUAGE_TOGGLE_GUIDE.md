# Language Toggle Feature Guide

## 🌍 Overview

The landing page now supports **bilingual content** with an elegant toggle switch in the navigation bar.

## 📍 Location

The language toggle is positioned in the **top-right corner** of the navigation bar, next to the hamburger menu (on mobile).

```
┌─────────────────────────────────────────────────────┐
│  Dan Hausch    Home About Products Principles  [EN][PT] ☰ │
└─────────────────────────────────────────────────────┘
```

## 🎨 Design

### Desktop View
```
┌────────────────────────────────────────────────────────────┐
│  Dan Hausch          Navigation Links...         [EN][PT] │
└────────────────────────────────────────────────────────────┘
```

### Toggle Appearance
- **Container**: Dark card background with subtle border
- **Buttons**: Two buttons side-by-side (EN | PT)
- **Active State**: Gradient background (purple-blue)
- **Inactive State**: Transparent with secondary text color
- **Hover Effect**: Text brightens on hover

### Visual Style
```
┌──────────┐
│ EN │ PT │  ← Inactive button (gray)
└──────────┘

┌──────────┐
│ EN │ PT │  ← Active button (gradient purple-blue)
└──────────┘
```

## 🔧 Functionality

### Features
1. **Instant switching**: Click any language button to change
2. **Visual feedback**: Active language is highlighted
3. **Persistent**: Saves preference in browser localStorage
4. **Automatic loading**: Remembers your choice on next visit
5. **Complete translation**: All text updates instantly

### What Gets Translated
- ✅ Navigation menu items
- ✅ Hero section (title, subtitle, CTAs)
- ✅ All section headings and descriptions
- ✅ Product descriptions and tags
- ✅ Principles section
- ✅ Contact form labels
- ✅ Footer text
- ✅ Success notifications
- ✅ Page title

## 💬 Translations

### English (EN) - Default
- Professional, international tone
- Technical vocabulary
- Direct and clear

### Portuguese (PT-BR)
- Professional Brazilian Portuguese
- Natural phrasing
- Maintains brand voice
- Uses "Clareza através da Construção" for tagline

## 🎯 Key Translations

| English | Portuguese |
|---------|------------|
| Clarity through Construction | Clareza através da Construção |
| Get in Touch | Entre em Contato |
| Building solutions that matter | Construindo soluções que importam |
| Structure Before Scale | Estrutura antes da Escala |
| Clarity Before Speed | Clareza antes da Velocidade |
| Automation with Purpose | Automação com Propósito |

## 📱 Responsive Behavior

### Desktop (> 968px)
- Toggle appears in top-right
- Full-size buttons with comfortable padding

### Tablet/Mobile (< 968px)
- Slightly smaller buttons
- Positioned next to hamburger menu
- Still easily accessible

### Mobile Menu
- Language toggle remains in navbar (not in mobile menu)
- Always visible for easy switching

## 🔄 How It Works

### Technical Flow
1. User clicks language button
2. JavaScript updates `currentLang` variable
3. All elements with `data-i18n` attributes are updated
4. Page title changes
5. Preference saved to localStorage
6. Active button styling updates

### Code Example
```html
<!-- HTML element with translation -->
<h2 class="section-title" data-i18n="about.title">About</h2>

<!-- JavaScript updates it to -->
<h2 class="section-title" data-i18n="about.title">Sobre</h2>
```

## 🎨 Customization

### Changing Toggle Position
Edit CSS in `styles.css`:
```css
.nav-right {
    display: flex;
    align-items: center;
    gap: 1.5rem; /* Adjust spacing */
}
```

### Changing Toggle Colors
```css
.lang-btn.active {
    background: var(--primary-gradient); /* Change gradient */
    color: var(--text-primary);
}
```

### Adding More Languages
1. Add button in HTML:
```html
<button class="lang-btn" data-lang="es">ES</button>
```

2. Add translations in `i18n.js`:
```javascript
es: {
    nav: {
        home: "Inicio",
        // ... more translations
    }
}
```

## ✨ User Experience

### First Visit
- Page loads in English (default)
- User can switch to Portuguese anytime
- Choice is saved

### Return Visit
- Page automatically loads in user's preferred language
- No need to switch again

### Switching
- Instant, no page reload
- Smooth transition
- All content updates simultaneously

## 🎯 Best Practices

1. **Keep translations consistent** - Maintain the same tone
2. **Test both languages** - Ensure all content fits properly
3. **Update together** - When adding new content, translate immediately
4. **Professional tone** - Both languages use professional vocabulary
5. **Cultural awareness** - Portuguese version uses BR conventions

---

**Note**: The language toggle is fully functional and ready to use. Simply open `index.html` in a browser and click the EN or PT buttons to see it in action!


