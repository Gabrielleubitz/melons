# Melons Logistics Website

A clean, modern, and fully responsive multi-page website for Melons Logistics - a U.S.-based logistics company specializing in transportation, storage, and delivery services.

## Key Features

### Design & Aesthetics
- **Modern Multi-Page Architecture**: Separate pages with dedicated URLs for better SEO and navigation
- **Expressive Typography**: Poppins font family with varied weights for professional, dynamic headings
- **Enhanced Color Palette**: Brand green (#009345) with complementary charcoal and neutral tones
- **Visual Rhythm**: Alternating left/right image-text layouts create engaging flow

### Animations & Interactions
- **Directional Scroll Animations**: Text slides in from left, images from right, alternating per section
- **Parallax Scrolling**: Background images move at different speeds for depth
- **Hover Effects**:
  - Team cards reveal bios on hover with gradient overlay
  - Images zoom subtly when hovered
  - Buttons scale and lift with shadow effects
- **Staggered Card Animations**: Elements fade in with configurable delays

### Navigation & UX
- **Sticky Navigation**: Nav bar shrinks on scroll with smooth transitions
- **Active Page Highlighting**: Current page indicated with green underline
- **Mobile-Responsive Menu**: Hamburger menu for tablets and phones
- **Back-to-Top Button**: Appears after scrolling down 500px
- **Smooth Scrolling**: Butter-smooth page transitions

### Professional Features
- **Contact Form**: Validated fields with real-time error messaging
- **Service Hours Section**: Clear availability information
- **Stats Section**: Animated statistics with gradient background
- **Social Media Integration**: Modern icon buttons for Facebook, LinkedIn, Instagram
- **Accessibility**: Keyboard navigation support with focus indicators

## Site Structure

### Pages

1. **Home** (`index.html`)
   - Full-screen hero with dual CTAs
   - Company introduction (text left, image right)
   - Services overview with icons (image left, text right)
   - Fleet information with checklist (text left, image right)
   - Why Choose Us section with 3 cards
   - Call-to-action section

2. **About Us** (`about.html`)
   - Page hero with overlay
   - Company history (text left, image right)
   - Mission & Vision (image left, text right)
   - Core Values section (text left, image right)
   - Statistics section with animated numbers

3. **Team** (`team.html`)
   - Page hero
   - Team introduction
   - Team grid with 4 members (hover to reveal bios)
   - Careers section (text left, image right)

4. **Contact** (`contact.html`)
   - Page hero
   - Contact form with validation (right side)
   - Contact information cards with icons (left side)
   - Service hours grid
   - Social media links

## Setup Instructions

### 1. Run Locally

The project is already configured with npm scripts. Simply run:

```bash
npm start
```

This will start a live development server at `http://localhost:3000` with auto-reload.

### 2. Add Logo Images

Place your logo images in the `assets/` folder:
- `Melons Logistics Calendar logo_PHNumber-01.png` - Main logo for light backgrounds
- `Melons Logistics Calendar logo_White-01.png` - White logo for dark backgrounds (optional)

### 3. Replace Placeholder Images

Update these placeholder URLs in the HTML files with real images:

**Home Page (index.html):**
- `IMAGE_URL_TRUCKS` - Hero background (trucks in motion)
- `IMAGE_URL_CONTAINERS` - Intro section (containers at port)
- `IMAGE_URL_PORTS` - Services section (port operations)
- `IMAGE_URL_TRUCKS2` - Fleet section (truck fleet)
- `IMAGE_URL_WAREHOUSE` - Why section background

**About Page (about.html):**
- `IMAGE_URL_MAP` - Hero background (logistics map/routes)
- `IMAGE_URL_WAREHOUSE` - History section
- `IMAGE_URL_TRUCKS2` - Mission section
- `IMAGE_URL_CONTAINERS` - Values section

**Team Page (team.html):**
- `IMAGE_URL_WAREHOUSE` - Hero background
- `IMAGE_URL_PROFILE_PLACEHOLDER` - Team member photos (4 instances)
- `IMAGE_URL_TRUCKS` - Careers section

**Contact Page (contact.html):**
- `IMAGE_URL_TRUCK_ROAD` - Hero background (truck on highway)

**Image Recommendations:**
- Use high-quality, authentic photos showing real logistics operations
- Choose images that show motion and activity
- Ensure images are optimized for web (compressed, proper dimensions)
- Recommended size: Hero images 1920x1080px, section images 800x600px minimum

### 4. Customize Content

**Team Members:**
Edit `team.html` (lines 38-138) to update:
- Names, roles, and bios
- Email addresses
- Profile photos

**Contact Information:**
Update in `contact.html`:
- Email address (line 52)
- Physical address if available (line 67)
- Social media links (lines 80-108)

**Services:**
Modify services in `index.html` (lines 78-100) to match your offerings.

### 5. Configure Form Backend

The contact form currently shows success messages. To enable email sending:

1. Choose a form service:
   - **Formspree** (easiest): Add `action="https://formspree.io/f/YOUR_ID"` to form
   - **EmailJS** (free tier): Integrate via JavaScript
   - **Custom backend**: Set up your own API endpoint

2. Update form handler in `script.js` (lines 175-248)

3. Uncomment the fetch API code and add your endpoint

## File Structure

```
melons/
├── index.html          # Home page
├── about.html          # About Us page
├── team.html           # Meet the Team page
├── contact.html        # Contact Us page
├── styles.css          # Complete styling (1,293 lines)
├── script.js           # Interactive features (497 lines)
├── package.json        # NPM configuration
├── assets/             # Logo and image files
│   └── (your logos here)
└── README.md           # This file
```

## Customization Guide

### Colors

The website uses CSS variables for easy customization. Edit `styles.css` (lines 11-29):

```css
:root {
    /* Brand Colors */
    --primary-green: #009345;
    --dark-green: #007535;
    --light-green: #00b357;

    /* Neutral Palette */
    --charcoal: #2c3e50;
    --dark-gray: #34495e;
    --medium-gray: #7f8c8d;
    --light-gray: #f8f9fa;
    --off-white: #fafbfc;
    --white: #ffffff;
}
```

### Typography

Using Poppins font family. To change:

1. Update Google Fonts link in each HTML file header
2. Update font-family in `styles.css` line 47

### Animation Timing

Adjust animation speeds in `styles.css` lines 36-39:

```css
--transition-fast: 0.2s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.5s ease;
```

### Section Spacing

Modify padding for all content sections in `styles.css` line 450:

```css
.content-section {
    padding: 6rem 0;  /* Adjust as needed */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari (latest)
- Android Chrome (latest)

## Performance Features

- **Intersection Observer API**: Efficient scroll animations
- **Lazy Loading**: Images load as they enter viewport
- **Debounced Scrolling**: Optimized scroll event handling
- **CSS Animations**: Hardware-accelerated transforms
- **Minimal Dependencies**: Pure vanilla JavaScript

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators for Tab navigation
- Alt text for images (add when replacing placeholders)
- High contrast text for readability

## Responsive Breakpoints

- **Desktop**: 1024px and above (full layout)
- **Tablet**: 768px - 1023px (stacked two-column layouts)
- **Mobile**: Below 768px (single-column, hamburger menu)
- **Small Mobile**: Below 480px (optimized touch targets)

## Launch Checklist

Before going live:

- [ ] Add all logo images to `assets/` folder
- [ ] Replace all `IMAGE_URL_*` placeholders with real images
- [ ] Optimize all images for web (compress, resize)
- [ ] Update team member information and photos
- [ ] Add actual contact information (email, address)
- [ ] Link social media accounts to real URLs
- [ ] Configure contact form backend
- [ ] Test form submission end-to-end
- [ ] Test on multiple devices and browsers
- [ ] Check all navigation links work correctly
- [ ] Verify all animations function smoothly
- [ ] Add favicon (`favicon.ico` in root directory)
- [ ] Set up domain and hosting
- [ ] Configure DNS settings
- [ ] Add Google Analytics (optional)
- [ ] Test page load speeds
- [ ] Run accessibility audit
- [ ] Verify mobile responsiveness

## Hosting Options

This is a static website and can be hosted on:

- **Netlify** (recommended): Drag & drop deployment, free SSL, custom domain
- **GitHub Pages**: Free hosting with version control
- **Vercel**: Fast deployment, automatic HTTPS
- **AWS S3 + CloudFront**: Scalable, professional hosting
- **Traditional Hosting**: Any web host (Bluehost, SiteGround, etc.)

## Development Commands

```bash
npm start    # Start development server on port 3000
npm run dev  # Alternative command (same as npm start)
```

## SEO Recommendations

1. **Add Meta Tags**: Include description, keywords, Open Graph tags in each HTML `<head>`
2. **Create sitemap.xml**: List all pages for search engines
3. **Add robots.txt**: Control search engine crawling
4. **Optimize Images**: Use descriptive file names and alt text
5. **Add Schema Markup**: Structured data for business information
6. **Google My Business**: Claim your business listing
7. **Page Titles**: Unique, descriptive titles for each page

## Support & Contact

For questions or issues with Melons Logistics:
- **Phone**: 800.977.7275
- **Email**: info@melonslogistics.com

For website technical support:
- Review this README
- Check browser console for errors
- Verify all file paths are correct

## Credits

**Design & Development**: Custom-built responsive website
**Typography**: Poppins by Google Fonts
**Icons**: SVG icons for contact and social media

## License

© 2025 Melons Logistics. All Rights Reserved.
