# Dan Hausch Landing Page - Project Structure

## 📁 Complete File Structure

```
danhausch branding/
│
├── index.html                      # Main HTML file with bilingual & theme support
├── styles.css                      # All styles including themes
├── theme.js                        # Theme management (light/dark mode)
├── i18n.js                        # Internationalization system
├── script.js                       # Interactive functionality
│
├── modified_image.png             # Brand image (reference)
├── portifolio.md                  # Portfolio reference
├── strategy.md                    # Brand strategy document
│
├── README.md                      # Project documentation
├── THEME_GUIDE.md                 # Light/Dark mode guide
├── LANGUAGE_TOGGLE_GUIDE.md       # Language feature guide
└── PROJECT_STRUCTURE.md           # This file
```

## 🔍 File Details

### Core Files

#### `index.html` (~19 KB)
- Complete landing page structure
- All sections with `data-i18n` attributes
- Theme toggle button (light/dark mode)
- Language toggle buttons in navigation
- Responsive meta tags
- Semantic HTML5 markup

**Key Sections:**
```html
<body data-lang="en">
  <nav> - Navigation with language toggle
  <section id="home"> - Hero section
  <section id="about"> - About section
  <section id="products"> - Products section
  <section id="principles"> - Principles section
  <section class="value-prop"> - Value proposition
  <section id="contact"> - Contact section
  <footer> - Footer
</body>
```

#### `styles.css` (~20 KB)
- Complete styling system
- CSS variables for easy theming
- Light and Dark mode support
- Responsive design (3 breakpoints)
- Theme and language toggle styling
- Animations and transitions

**Key Sections:**
```css
/* CSS Variables */
:root { ... }

/* Navigation & Language Toggle */
.navbar { ... }
.language-toggle { ... }
.lang-btn { ... }

/* All Sections */
.hero { ... }
.about { ... }
.products { ... }
/* etc */

/* Responsive Design */
@media (max-width: 968px) { ... }
```

#### `script.js` (9.9 KB)
- Navigation functionality
- Mobile menu toggle
- Smooth scrolling
- Form handling
- Animations
- Notification system
- Integration with i18n

**Key Functions:**
```javascript
// Navigation
hamburger.addEventListener('click', ...)

// Smooth scrolling
document.querySelectorAll('a[href^="#"]')...

// Contact form
contactForm.addEventListener('submit', ...)

// Notifications
showNotification(message, type)

// Animations
IntersectionObserver(...)
```

#### `theme.js` (~2 KB)
- Theme management system
- Light/Dark mode switching
- localStorage persistence
- System preference detection
- Smooth transitions
- Public API for theme control

#### `i18n.js` (11 KB)
- Complete translation system
- EN and PT-BR translations
- localStorage persistence
- Automatic language detection
- Dynamic content updates

**Structure:**
```javascript
const translations = {
    en: { /* All English translations */ },
    pt: { /* All Portuguese translations */ }
};

// Core functions
function getTranslation(key)
function updatePageLanguage()
function switchLanguage(lang)

// Public API
window.i18n = { ... }
```

### Documentation Files

#### `README.md` (3.1 KB)
- Project overview
- Features list
- Usage instructions
- Customization guide
- File descriptions

#### `LANGUAGE_TOGGLE_GUIDE.md`
- Complete language feature documentation
- Visual representations
- Technical details
- Customization examples
- Best practices

#### `PROJECT_STRUCTURE.md` (This file)
- Complete file structure
- File descriptions
- Dependencies
- Usage patterns

### Reference Files

#### `strategy.md` (7.6 KB)
- Complete brand strategy
- CREATE framework
- Core principles
- Positioning
- Target audience

#### `portifolio.md` (43 bytes)
- Product list reference
- ProspectaPro
- Navi
- Meditation Courses

#### `modified_image.png` (3.8 MB)
- Brand reference image

## 🔗 Dependencies

### External
- **Google Fonts**: Inter font family
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">
  ```

### Internal
```
index.html
    ├── styles.css       (styling)
    ├── theme.js        (theme - loaded first to prevent flash)
    ├── i18n.js         (translations)
    └── script.js       (functionality)
```

**Load Order (Important!):**
1. `theme.js` - Theme must load first to prevent flash
2. `i18n.js` - Translations
3. `script.js` - Uses i18n API

## 🎯 Key Features by File

### Theme Support
```
theme.js        → Theme management engine
styles.css      → Light/Dark mode variables
index.html      → Theme toggle button
```

### Language Support
```
i18n.js         → Translation engine
index.html      → data-i18n attributes
styles.css      → Toggle styling
script.js       → Form notifications in current language
```

### Responsive Design
```
styles.css      → Media queries & responsive layouts
script.js       → Mobile menu functionality
index.html      → Semantic structure
```

### Animations
```
styles.css      → CSS animations (@keyframes)
script.js       → Intersection Observer, parallax
```

### Contact Form
```
index.html      → Form structure
styles.css      → Form styling
script.js       → Form handling & validation
i18n.js         → Form labels translation
```

## 📊 File Sizes Summary

| File | Size | Purpose |
|------|------|---------|
| index.html | ~19 KB | Structure |
| styles.css | ~20 KB | Styling & themes |
| i18n.js | 11 KB | Translations |
| script.js | 9.9 KB | Functionality |
| theme.js | ~2 KB | Theme management |
| **Total** | **~62 KB** | **Core files** |

## 🚀 Quick Start

1. **Open** `index.html` in a browser
2. **Click** 🌙/☀️ to toggle light/dark mode
3. **Click** EN/PT to switch languages
4. **Scroll** to explore sections
5. **Fill** contact form (test functionality)
6. **Resize** browser to see responsive design

## 🎨 Customization Points

### Colors
- **File**: `styles.css`
- **Location**: `:root` CSS variables
- **Lines**: 10-20

### Translations
- **File**: `i18n.js`
- **Location**: `translations` object
- **Lines**: 5-150

### Content
- **File**: `index.html`
- **Location**: Throughout all sections
- **Note**: Update both HTML and corresponding translation

### Styling
- **File**: `styles.css`
- **Location**: Specific section classes
- **Approach**: Use CSS variables when possible

## 🔧 Development Workflow

### Adding New Content
1. Add HTML structure in `index.html`
2. Add `data-i18n` attribute
3. Add translations in `i18n.js` (both EN and PT)
4. Style in `styles.css`
5. Add functionality in `script.js` (if needed)

### Testing Checklist
- ✅ Both themes (light/dark) display correctly
- ✅ Both languages display correctly
- ✅ Theme persists on reload
- ✅ Language persists on reload
- ✅ Responsive on mobile, tablet, desktop
- ✅ All links work
- ✅ Form submission works
- ✅ Animations are smooth
- ✅ No console errors

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 No Build Process Required

This is a **pure HTML/CSS/JS** project with:
- No npm packages
- No bundlers
- No compilation
- No server required

Just open `index.html` and it works! 🚀

---

**Version**: 2.0  
**Last Updated**: October 28, 2025  
**Total Files**: 12 (8 code + 4 docs)
**New Features**: Light/Dark mode support 🎨

