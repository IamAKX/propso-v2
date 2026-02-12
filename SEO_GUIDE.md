# SEO Guide for Propso.in

## Quick Wins (Implement These First)

### 1. Register with Google Search Console
```
1. Go to https://search.google.com/search-console
2. Add property: https://propso.in
3. Verify ownership (DNS or HTML file method)
4. Submit your sitemap: https://propso.in/sitemap.xml
```

### 2. Register with Google Business Profile
```
1. Go to https://business.google.com
2. Create a business profile for "Propso"
3. Add business details, location, photos
4. Verify your business
5. This helps with local searches and Google Maps
```

### 3. Submit Sitemap to Search Engines
- Google: Search Console → Sitemaps → Add sitemap URL
- Bing: https://www.bing.com/webmasters
- Submit: https://propso.in/sitemap.xml

---

## Technical SEO Checklist

### ✅ Completed
- [x] Meta tags added (title, description, keywords)
- [x] Open Graph tags for social sharing
- [x] robots.txt file created
- [x] sitemap.xml created
- [x] HTTPS enabled
- [x] Canonical URLs set

### 🔲 To Do

#### 1. Add Structured Data (Schema.org)
Add structured data for real estate listings to help Google understand your content better.

Create a new file: `src/components/PropertySchema.js`

```javascript
import { Helmet } from 'react-helmet';

export const PropertySchema = ({ property }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://propso.in/properties/${property.id}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "addressCountry": "IN"
    },
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "INR"
    },
    "image": property.images
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
```

Install react-helmet:
```bash
npm install react-helmet
```

Use it in your property detail pages.

#### 2. Improve Page Speed
```bash
# Run PageSpeed Insights
# https://pagespeed.web.dev/
# Enter: https://propso.in

# Optimize images (use WebP format)
# Enable compression in nginx (already done in AWS_DEPLOYMENT_GUIDE.md)
# Lazy load images
```

#### 3. Create Content Pages
Add more content-rich pages:
- About Us page
- Blog (property tips, market trends)
- Location guides (Properties in Mumbai, Delhi, etc.)
- FAQs page
- Contact page

#### 4. Mobile Optimization
Ensure your site is fully responsive and mobile-friendly.
Test at: https://search.google.com/test/mobile-friendly

---

## Content Strategy

### Keyword Research
Target these keywords:
- **Brand:** "propso", "propso.in"
- **Generic:** "property for sale in [city]", "rent apartment [city]"
- **Long-tail:** "2BHK apartment for rent in Mumbai", "commercial property for sale"

### Content Ideas
1. **Blog Posts:**
   - "Top 10 Areas to Buy Property in Mumbai"
   - "First-time Home Buyer's Guide"
   - "How to List Your Property on Propso"

2. **Location Pages:**
   - Create separate pages for each major city
   - Example: propso.in/properties/mumbai
   - Add local content, market trends, popular areas

3. **Property Descriptions:**
   - Write detailed, unique descriptions for each property
   - Include location benefits, nearby amenities
   - Use relevant keywords naturally

---

## Off-Page SEO

### 1. Backlinks
Get links from other websites:
- List on property directories (99acres, MagicBricks, Housing.com)
- Submit to business directories
- Partner with real estate agents/blogs
- Write guest posts on real estate blogs

### 2. Social Media
- Create Facebook, Instagram, LinkedIn pages
- Share property listings regularly
- Use hashtags: #propso #realestate #property
- Engage with followers

### 3. Local Directories
- Google Business Profile (most important!)
- Justdial
- Sulekha
- IndiaMART
- Local business directories

---

## Google Search Console Setup

### After Verification:
1. **Submit Sitemap**
   - Go to Sitemaps section
   - Add URL: https://propso.in/sitemap.xml

2. **Request Indexing**
   - Go to URL Inspection
   - Enter: https://propso.in
   - Click "Request Indexing"
   - Do this for important pages

3. **Monitor Performance**
   - Check "Performance" tab weekly
   - See which keywords bring traffic
   - Identify opportunities

---

## Google Analytics Setup

```html
<!-- Add to public/index.html before </head> -->
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Get your tracking ID from: https://analytics.google.com

---

## Expected Timeline

- **Week 1-2:** Google indexes your site
- **Month 1:** Start appearing for "propso" brand searches
- **Month 2-3:** Appear for low-competition keywords
- **Month 3-6:** Build authority, rank for competitive keywords
- **Month 6+:** Consistent growth with content strategy

---

## Quick Commands

### Test Your SEO
```bash
# Check if Google has indexed your site
# Search on Google: site:propso.in

# Check robots.txt
curl https://propso.in/robots.txt

# Check sitemap
curl https://propso.in/sitemap.xml

# Check meta tags
curl -s https://propso.in | grep -i "<meta"
```

### Monitor Rankings
- Use tools like:
  - Ubersuggest (free)
  - Google Search Console (free)
  - SEMrush (paid)
  - Ahrefs (paid)

---

## Priority Actions (Do These TODAY)

1. ✅ Rebuild frontend with updated meta tags
2. ⬜ Register Google Search Console
3. ⬜ Submit sitemap to Google
4. ⬜ Create Google Business Profile
5. ⬜ Request indexing for homepage
6. ⬜ Set up Google Analytics

---

## Important Notes

- **SEO takes time:** Don't expect immediate results
- **Content is king:** Regularly add quality content
- **User experience matters:** Fast, mobile-friendly site ranks better
- **Avoid black-hat SEO:** No keyword stuffing, paid links, or spam
- **Monitor and adapt:** Check Search Console regularly and adjust strategy

For the brand name "Propso", you should rank #1 within 2-4 weeks once indexed by Google.
