# 🤝 Contributing to DriveGo

Thank you for your interest in contributing to DriveGo! We're excited to have you join our community of developers and driving enthusiasts. This guide will help you get started with contributing to the project.

## 🌟 Ways to Contribute

### 🐛 Bug Reports

Help us improve DriveGo by reporting bugs:

- Use clear, descriptive titles
- Provide step-by-step reproduction instructions
- Include screenshots or videos when helpful
- Specify browser, device, and version information

### ✨ Feature Requests

Share your ideas for new features:

- Explain the problem your feature would solve
- Describe the proposed solution
- Consider implementation complexity and user impact
- Provide mockups or examples when possible

### 📝 Documentation

Improve our documentation:

- Fix typos and grammatical errors
- Add missing information
- Improve clarity and readability
- Create tutorials and guides

### 💻 Code Contributions

Submit code improvements:

- Bug fixes
- New features
- Performance optimizations
- Code quality improvements

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript
- Git for version control

### Development Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/yourusername/drivego.git
   cd drivego
   ```

2. **Set up the upstream remote**

   ```bash
   git remote add upstream https://github.com/original-owner/drivego.git
   ```

3. **Start a local server**

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Open http://localhost:8000
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

#### HTML

- Use semantic HTML5 elements
- Include proper ARIA attributes for accessibility
- Use meaningful class names following BEM methodology
- Validate HTML with W3C validator

```html
<!-- Good -->
<section class="hero-section">
  <h1 class="hero-section__title">Welcome to DriveGo</h1>
  <button class="hero-section__cta-button" aria-label="Explore routes">
    Explore Routes
  </button>
</section>

<!-- Avoid -->
<div class="hero">
  <div class="title">Welcome to DriveGo</div>
  <div class="button">Explore Routes</div>
</div>
```

#### CSS

- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Use meaningful class names with BEM methodology
- Group related properties together
- Comment complex CSS logic

```css
/* Good */
.route-card {
  /* Layout */
  display: flex;
  flex-direction: column;

  /* Appearance */
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;

  /* Interaction */
  transition: transform 0.3s ease;
  cursor: pointer;
}

.route-card:hover {
  transform: translateY(-4px);
}

/* Responsive design */
@media (min-width: 768px) {
  .route-card {
    flex-direction: row;
  }
}
```

#### JavaScript

- Use vanilla JavaScript (no frameworks)
- Write clean, readable, well-commented code
- Use modern ES6+ features appropriately
- Handle errors gracefully
- Follow consistent naming conventions

```javascript
// Good
class ThemeManager {
  constructor() {
    this.currentTheme = this.getCurrentTheme();
    this.initializeThemeButtons();
  }

  /**
   * Gets the current theme from localStorage or returns default
   * @returns {string} The current theme name
   */
  getCurrentTheme() {
    return localStorage.getItem("theme") || "midnight";
  }

  /**
   * Safely applies a theme with error handling
   * @param {string} themeName - The theme to apply
   */
  setTheme(themeName) {
    try {
      if (!this.isValidTheme(themeName)) {
        console.warn(`Invalid theme: ${themeName}`);
        return;
      }

      // Apply theme logic here
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  }
}
```

### File Organization

```
assets/
├── css/
│   ├── components/          # Component-specific styles
│   ├── themes/             # Theme definitions
│   ├── utilities/          # Utility classes
│   └── base/              # Base styles, resets
├── js/
│   ├── modules/           # JavaScript modules
│   ├── components/        # Component JavaScript
│   └── utils/            # Utility functions
└── images/
    ├── icons/            # Icon assets
    ├── gallery/          # Photo gallery
    └── ui/               # UI graphics
```

### Accessibility Guidelines

- Ensure keyboard navigation works properly
- Use proper ARIA attributes
- Maintain color contrast ratios (WCAG AA)
- Test with screen readers
- Provide alternative text for images

```html
<!-- Good accessibility example -->
<button
  class="theme-toggle-btn"
  aria-label="Switch to next theme"
  aria-expanded="false"
  id="theme-toggle"
>
  <i class="fas fa-palette" aria-hidden="true"></i>
  <span class="sr-only">Change Theme</span>
</button>
```

## 🧪 Testing

### Browser Testing

Test your changes across different browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Device Testing

Ensure responsive design works on:

- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

### Manual Testing Checklist

- [ ] All links work correctly
- [ ] Forms submit properly
- [ ] Animations run smoothly
- [ ] Theme switching works
- [ ] Mobile navigation functions
- [ ] Images load correctly
- [ ] Performance is acceptable

## 📤 Submitting Changes

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: add Nordic theme with aurora-inspired colors"
git commit -m "fix: resolve mobile navigation overlay issue"
git commit -m "docs: update installation instructions"

# Use conventional commit format
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting, no code change
# refactor: code restructuring
# test: adding tests
# chore: maintenance
```

### Pull Request Process

1. **Update your branch**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a pull request**

   - Use a descriptive title
   - Provide detailed description of changes
   - Reference any related issues
   - Include screenshots for UI changes

3. **Pull request template**

   ```markdown
   ## Description

   Brief description of what this PR does.

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement

   ## Testing

   - [ ] Tested on Chrome
   - [ ] Tested on Firefox
   - [ ] Tested on mobile
   - [ ] No console errors

   ## Screenshots

   (Include screenshots for UI changes)

   ## Related Issues

   Fixes #123
   ```

## 🎨 Theme Development

### Adding New Themes

Want to contribute a new theme? Here's how:

1. **Create theme variables** in `enhanced-themes.css`:

   ```css
   [data-theme="your-theme"] {
     --bg-color: #your-bg;
     --text-color: #your-text;
     --accent-color: #your-accent;
     /* ... other variables */
   }
   ```

2. **Add theme to JavaScript** in `simple-theme-toggle.js`:

   ```javascript
   const THEMES = {
     // ... existing themes
     yourtheme: { name: "Your Theme", cssName: "your-theme" },
   };
   ```

3. **Test thoroughly** across all pages
4. **Submit with screenshots** showing the theme in action

### Theme Guidelines

- Ensure sufficient contrast for accessibility
- Test with all UI components
- Consider dark environment usage
- Provide meaningful theme names
- Document color choices

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- Changelog for releases
- Special contributor badges
- Community showcases

## 📞 Getting Help

Need help with contributing?

- 💬 **Discord**: [Join our community](https://discord.gg/drivego)
- 📧 **Email**: developers@drivego.com
- 📱 **GitHub Discussions**: Ask questions and share ideas
- 📖 **Wiki**: Check out our detailed guides

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behaviors include:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards community members

**Unacceptable behaviors include:**

- Harassment, trolling, or discriminatory language
- Personal attacks or political arguments
- Publishing private information without permission
- Any conduct that could reasonably be considered inappropriate

### Enforcement

Report any behavior that violates our code of conduct to developers@drivego.com. All reports will be handled confidentially.

---

## 🎉 Thank You!

Your contributions make DriveGo better for everyone. Whether you're fixing a typo, adding a feature, or helping other contributors, every contribution matters.

**Happy coding, and happy driving! 🚗💨**
