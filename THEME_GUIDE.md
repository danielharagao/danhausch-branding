# Theme System Guide - Light & Dark Mode

## 🎨 Overview

The landing page now supports **both Light and Dark modes** with a beautiful toggle button in the navigation bar.

## 📍 Location

The theme toggle is positioned in the **top-right corner**, left of the language selector:

```
┌─────────────────────────────────────────────────────────┐
│  Dan Hausch    Navigation...    🌙 [EN][PT] ☰          │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Visual Design

### Theme Toggle Button
- **Icon**: 🌙 Moon (Dark mode) | ☀️ Sun (Light mode)
- **Style**: Clean, minimal button with hover effect
- **Size**: 40px × 40px (36px on mobile)
- **Background**: Matches card background
- **Hover**: Subtle purple tint

### Dark Mode (Default)
```css
Background:   #0a0f1c (Navy blue)
Cards:        #1a1f35 (Darker blue)
Text:         #ffffff (White)
Secondary:    #a0aec0 (Light gray)
Borders:      rgba(255, 255, 255, 0.1)
Shadows:      rgba(0, 0, 0, 0.3)
```

### Light Mode
```css
Background:   #f7fafc (Light gray)
Cards:        #ffffff (White)
Text:         #1a202c (Dark gray)
Secondary:    #4a5568 (Medium gray)
Borders:      rgba(0, 0, 0, 0.1)
Shadows:      rgba(0, 0, 0, 0.1)
```

## ✨ Features

### 1. Smart Persistence
- **localStorage**: Saves user preference
- **Automatic loading**: Remembers choice on return visits
- **Manual override**: User choice takes precedence

### 2. System Integration
- **Respects OS preference**: Uses `prefers-color-scheme`
- **Auto-detection**: If no saved preference, follows system
- **Dynamic updates**: Responds to system theme changes

### 3. Smooth Transitions
- **Instant switching**: No page reload
- **Smooth animations**: CSS transitions on all elements
- **No flash**: Theme applies before page renders

### 4. Complete Coverage
All elements adapt to the theme:
- ✅ Navigation bar
- ✅ Hero section
- ✅ All cards and containers
- ✅ Form inputs
- ✅ Buttons and links
- ✅ Shadows and borders
- ✅ Text colors
- ✅ Background gradients

## 🔧 Technical Implementation

### CSS Variables System
```css
:root {
    /* Dark mode (default) */
    --dark-bg: #0a0f1c;
    --text-primary: #ffffff;
    /* ... more variables */
}

body[data-theme="light"] {
    /* Light mode overrides */
    --dark-bg: #f7fafc;
    --text-primary: #1a202c;
    /* ... more overrides */
}
```

### JavaScript API
```javascript
// Access theme manager
window.themeManager.getCurrentTheme()  // Returns 'dark' or 'light'
window.themeManager.setTheme('light')  // Set specific theme
window.themeManager.toggleTheme()      // Toggle between modes
```

## 📱 Responsive Behavior

### Desktop (> 968px)
- Full-size toggle button (40px)
- Clear icon display
- Positioned left of language toggle

### Mobile (< 968px)
- Slightly smaller (36px)
- Still easily accessible
- Maintains position and functionality

## 🎯 User Flow

### First Visit
1. Page loads with **system preference** (or dark by default)
2. User can click toggle to switch
3. Preference is saved

### Return Visit
1. Page loads with **saved preference**
2. No flash or theme switch
3. User can toggle anytime

### Manual vs. Auto
- **Manual**: User clicked toggle → saved permanently
- **Auto**: Following system → updates if system changes

## 🎨 Theme Comparison

### Dark Mode Benefits
- 💡 Reduced eye strain in low light
- 🔋 Battery savings on OLED screens
- 🎯 Professional, modern appearance
- ✨ Better for showcasing gradients

### Light Mode Benefits
- ☀️ Better for bright environments
- 📖 Higher contrast for reading
- 🎨 Clean, minimalist look
- ✅ Familiar to many users

## 🔄 How Switching Works

### Visual Change
```
Click 🌙 → ☀️
Dark blue backgrounds → White
White text → Dark gray text
Subtle shadows → Stronger shadows
```

### Technical Flow
1. User clicks toggle button
2. `toggleTheme()` function called
3. `data-theme="light"` added to body
4. CSS variables update instantly
5. Icons swap (show/hide)
6. Preference saved to localStorage

## 🎨 Customization

### Changing Dark Mode Colors
Edit in `styles.css`:
```css
:root {
    --dark-bg: #0a0f1c;        /* Main background */
    --card-bg: #1a1f35;        /* Card backgrounds */
    --text-primary: #ffffff;    /* Main text */
}
```

### Changing Light Mode Colors
```css
body[data-theme="light"] {
    --dark-bg: #f7fafc;        /* Main background */
    --card-bg: #ffffff;        /* Card backgrounds */
    --text-primary: #1a202c;   /* Main text */
}
```

### Changing Icons
Replace emoji icons in HTML:
```html
<span class="theme-icon active" id="darkIcon">🌙</span>
<span class="theme-icon" id="lightIcon">☀️</span>
```

Try alternatives:
- 🌙 / ☀️ (current)
- 🌑 / 🌕
- 🌃 / 🌅
- ⚫ / ⚪

Or use SVG icons for more control.

## 🚀 Advanced Features

### Force Theme Programmatically
```javascript
// Force dark mode
window.themeManager.setTheme('dark');

// Force light mode
window.themeManager.setTheme('light');
```

### Check Current Theme
```javascript
const theme = window.themeManager.getCurrentTheme();
console.log(`Current theme: ${theme}`);
```

### Listen to System Changes
The theme automatically responds to OS theme changes unless the user has manually selected a preference.

## 📊 Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Mobile browsers (full support)
- ✅ System preference detection (modern browsers)

## 🎯 Best Practices

### Design Tips
1. **Test both modes** - Ensure all content is readable
2. **Keep gradients** - They work well in both modes
3. **Adjust shadows** - Lighter in light mode
4. **Check contrast** - WCAG accessibility standards

### Development Tips
1. **Use CSS variables** - Easy to maintain
2. **Test system preference** - Change OS theme
3. **Check localStorage** - Verify persistence
4. **Mobile testing** - Button size and position

## 🔍 Accessibility

### WCAG Compliance
- ✅ Sufficient color contrast in both modes
- ✅ Keyboard accessible (can tab to toggle)
- ✅ ARIA label on button
- ✅ Visual feedback on interaction

### Keyboard Navigation
- **Tab**: Navigate to toggle button
- **Enter/Space**: Activate toggle
- **Works**: With screen readers

## 📝 Files Modified

### New Files
- `theme.js` - Theme management system

### Modified Files
- `index.html` - Added theme toggle button
- `styles.css` - Added light mode variables and styles

### Load Order
```
1. theme.js     → Applies theme immediately (prevents flash)
2. i18n.js      → Translation system
3. script.js    → General functionality
```

## 💡 Tips & Tricks

### Reset Theme
Clear localStorage to reset:
```javascript
localStorage.removeItem('theme');
localStorage.removeItem('theme-manual');
location.reload();
```

### Default to Light Mode
Change in `theme.js`:
```javascript
let currentTheme = localStorage.getItem('theme') || 'light';  // Changed from 'dark'
```

### Disable System Preference
Remove the system preference detection code in `theme.js` if you want users to always default to a specific theme.

---

**The theme toggle provides a professional, accessible way for users to customize their viewing experience while maintaining your brand's visual identity in both modes!** 🎨✨


