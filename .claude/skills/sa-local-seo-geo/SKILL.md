---
name: sa-local-seo-geo
description: >
  Space Age local SEO + GEO (Generative Engine Optimization) system. Dual optimization for
  Google local search AND AI search engines (ChatGPT, Gemini, Perplexity). LocalBusiness schema,
  FAQ schema, NAP consistency, Tier 1/2/3 citations, robots.txt AI crawler allowlist.
  Always co-loads with cinematic-website-builder for local business builds.
---

# SA Local SEO + GEO OS

## Dual Optimization Strategy

Every local business site must rank in two places:
1. **Google Local Search** — Google Business Profile, Maps, local organic
2. **AI Search Engines** — ChatGPT browsing, Gemini, Perplexity, Claude

These require different strategies but share a foundation: authoritative structured data.

## LocalBusiness Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://[DOMAIN]/#business",
  "name": "[BUSINESS NAME]",
  "image": "https://[DOMAIN]/images/logo.jpg",
  "url": "https://[DOMAIN]",
  "telephone": "+1[PHONE]",
  "email": "[EMAIL]",
  "priceRange": "$$",
  "description": "[150-word description with primary keyword]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[STREET]",
    "addressLocality": "[CITY]",
    "addressRegion": "[STATE]",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": [LAT],
    "longitude": [LON]
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "https://www.google.com/maps?cid=[GBP_CID]",
    "https://www.yelp.com/biz/[SLUG]",
    "https://www.facebook.com/[PAGE]"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "[SERVICE NAME]",
          "description": "[SERVICE DESCRIPTION]"
        }
      }
    ]
  }
}
```

## FAQ Schema Template (GEO-Optimized)

FAQs are how AI search engines pull answers. Write them as complete sentences that include the business name and location.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does [BUSINESS] offer in [CITY]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[BUSINESS NAME] in [CITY], [STATE] offers [LIST SERVICES]. Located at [ADDRESS], they serve [AREA] and surrounding communities. Contact them at [PHONE]."
      }
    },
    {
      "@type": "Question",
      "name": "How much does [PRIMARY SERVICE] cost at [BUSINESS]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[BUSINESS NAME]'s pricing for [SERVICE] starts at [PRICE RANGE]. For an exact quote, contact them at [PHONE] or visit [WEBSITE]."
      }
    },
    {
      "@type": "Question",
      "name": "Is [BUSINESS] accepting new [CLIENTS/PATIENTS/CUSTOMERS]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, [BUSINESS NAME] is currently accepting new [TYPE]. You can schedule an appointment by calling [PHONE] or booking online at [WEBSITE]."
      }
    }
  ]
}
```

## NAP Consistency Rules

Name, Address, Phone must be IDENTICAL across all platforms. One typo kills local SEO.

```
CORRECT: "Space Age AI Solutions"
WRONG:   "SpaceAge AI Solutions" / "Space Age AI" / "Space Age AI Solutions LLC"

CORRECT: "1234 Main St, Atlanta, GA 30303"
WRONG:   "1234 Main Street, Atlanta, GA" / "1234 Main St Atlanta GA 30303"

CORRECT: "(404) 555-0100"
WRONG:   "404-555-0100" / "4045550100" / "404.555.0100"
```

Pick one format. Use it everywhere. Audit all citations after any name/address change.

## Citation Tiers

### Tier 1 — Non-Negotiable (All Local Businesses)
- Google Business Profile (must be verified)
- Apple Maps
- Bing Places
- Facebook Business Page
- Yelp (claim + complete)

### Tier 2 — High Authority (Complete Within 30 Days)
- Better Business Bureau
- Angi (formerly Angie's List)
- Thumbtack
- Foursquare / Factual
- Manta
- Yellow Pages
- Alignable

### Tier 3 — Industry-Specific
```
Healthcare:    Healthgrades, Vitals, ZocDoc, WebMD
Restaurant:    OpenTable, Grubhub listing, TripAdvisor, Zomato
Legal:         Avvo, Martindale-Hubbell, Justia, FindLaw
Fitness:       Mindbody, ClassPass
Home Services: HomeAdvisor, Houzz, Nextdoor Pro
```

## robots.txt — AI Crawler Allowlist

AI search engines need explicit permission. Add this to robots.txt:

```
User-agent: *
Allow: /

# Google
User-agent: Googlebot
Allow: /

# AI Search Engines — explicit allow
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

Sitemap: https://[DOMAIN]/sitemap.xml
```

## GEO Content Requirements

For AI search engines to cite your site, pages need:

1. **Entity clarity** — First paragraph states business name + city + primary service + unique value
2. **Factual anchors** — Years in business, licenses/certifications, service area radius
3. **Quotable sentences** — Short, complete sentences that AI can lift verbatim
4. **Internal linking** — Service pages link to each other with anchor text
5. **Freshness signals** — Blog posts or news section updated at least monthly

## Local Page Template (City + Service)

```
URL: /[city]-[service] (e.g., /atlanta-home-healthcare)

Title: [Service] in [City], [State] | [Business Name]
Meta: [Business Name] provides [service] in [City], [State]. [One-sentence unique value prop]. Call [phone] or book online.

H1: [Service] in [City]

Intro paragraph:
[Business Name] has provided [service] to [City] and surrounding [COUNTY/REGION] since [YEAR]. 
[One sentence about what makes you different]. [One sentence about service area or availability].

Body sections:
- What We Offer (service details)
- Why Choose [Business Name] in [City] (proof + credentials)
- Service Area (neighborhoods, zip codes)
- FAQ (5 questions using FAQ schema)
- Reviews (schema-marked testimonials)
- Contact + Booking CTA

Footer: [Full NAP] + Google Maps embed
```

## On-Page Optimization Checklist

- [ ] Primary keyword in H1 (city + service)
- [ ] NAP in footer (schema-marked)
- [ ] LocalBusiness JSON-LD in <head>
- [ ] FAQ JSON-LD in <head>
- [ ] Google Maps embed (not image — real iframe)
- [ ] Schema.org SiteNavigationElement on nav
- [ ] Meta title < 60 chars, includes city + service + brand
- [ ] Meta description < 160 chars, includes phone or CTA
- [ ] Alt text on all images includes location signal
- [ ] Internal links to service pages from home
- [ ] robots.txt allows all AI crawlers
- [ ] sitemap.xml submitted to Google Search Console
