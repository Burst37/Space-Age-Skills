---

## name: maily-to-email-builder description: "SA-enhanced skill for building and rendering cinematic, production-grade HTML emails using the Maily.to open-source editor and render engine (@maily-to/core, @maily-to/render). Use when any task involves email template creation, email editor integration, transactional email HTML generation, email campaign design, newsletter production, or programmatic email rendering from JSON content. Covers the full Maily architecture: TipTap-based editor, slash-command block system, JSON-to-HTML renderer, theme customization, variable substitution, and React embed. Adds Space Age extensions: VL-01 dark theme emails, Space Age brand email tokens, Record Exec in a Box artist email templates, cinematic email layout patterns, and Resend/SendGrid/Nodemailer render integration. Trigger on: any mention of email template, newsletter, transactional email, email HTML, email editor, maily, @maily-to, email campaign, or 'build an email'."

# Maily.to Email Builder — SA-Enhanced Edition

## WHAT IS MAILY.TO

Open-source email editor and render engine built on TipTap. Two packages:

- **`@maily-to/core`** — React-based WYSIWYG editor component with slash commands, bubble menus, and JSON output  
- **`@maily-to/render`** — Server-side renderer that converts TipTap JSON → production-ready HTML email string

Repo: `https://github.com/arikchakma/maily.to` Web app: `https://maily.to`

---

## QUICK START

### Install

\# Editor (React)

pnpm add @maily-to/core

pnpm add \-D @tiptap/core

\# Renderer (server-side, any runtime)

pnpm add @maily-to/render

### Editor Embed

import '@maily-to/core/style.css';

import { useState } from 'react';

import { Editor } from '@maily-to/core';

import type { Editor as TiptapEditor, JSONContent } from '@tiptap/core';

function MailyEditor({ defaultContent }: { defaultContent: JSONContent }) {

  const \[editor, setEditor\] \= useState\<TiptapEditor\>();

  return (

    \<Editor

      contentJson={defaultContent}

      onCreate={setEditor}

      onUpdate={setEditor}

    /\>

  );

}

### Render JSON → HTML

import { render } from '@maily-to/render';

const html \= await render(contentJson, {

  preview: 'Your email preview text here',

  theme: {

    colors: {

      heading: '\#111827',

      paragraph: '\#374151',

    },

    container: {

      maxWidth: '600px',

      backgroundColor: '\#ffffff',

    }

  }

});

---

## ARCHITECTURE

### Content Format

Maily stores email content as TipTap JSON (`JSONContent`). The editor outputs this JSON; the renderer consumes it.

{

  "type": "doc",

  "content": \[

    {

      "type": "paragraph",

      "content": \[{ "type": "text", "text": "Hello world" }\]

    }

  \]

}

### Block System (Slash Commands)

All blocks available via `/` command in editor:

**Typography:** `text`, `heading1`, `heading2`, `heading3`, `bulletList`, `orderedList`, `blockquote`, `footer`, `hardBreak`, `clearLine`

**Layout:** `columns`, `section`, `repeat`, `divider`, `spacer`

**Media:** `image`, `logo`, `inlineImage`

**Interactive:** `button`, `linkCard`

**Pre-built Components:**

- Headers: `headerLogoWithTextVertical`, `headerLogoWithTextHorizontal`, `headerLogoWithCoverImage`  
- Footers: `footerCopyrightText`, `footerCommunityFeedbackCta`, `footerCompanySignature`

### Variable System

Maily supports dynamic variables using `{{variable_name}}` syntax in content. Variables are resolved at render time.

const html \= await render(contentJson, {

  variables: {

    firstName: "Marcus",

    companyName: "Space Age AI Solutions",

    ctaUrl: "https://spaceage.ai/dashboard"

  }

});

---

## THEME SYSTEM

### Full Theme Options Interface

interface RendererThemeOptions {

  container?: {

    backgroundColor?: string;

    maxWidth?: string;        // Default: '600px'

    minWidth?: string;        // Default: '300px'

    paddingTop?: string;

    paddingRight?: string;

    paddingBottom?: string;

    paddingLeft?: string;

    borderRadius?: string;

    borderWidth?: string;

    borderColor?: string;

  };

  body?: {

    backgroundColor?: string;

    paddingTop?: string; paddingRight?: string;

    paddingBottom?: string; paddingLeft?: string;

  };

  button?: {

    backgroundColor?: string;

    color?: string;

    paddingTop?: string; paddingRight?: string;

    paddingBottom?: string; paddingLeft?: string;

  };

  link?: { color?: string };

  font?: {

    fontFamily: string;

    fallbackFontFamily: 'Arial' | 'Helvetica' | 'Verdana' | 'Georgia' | 'Times New Roman' | 'serif' | 'sans-serif' | 'monospace';

    webFont?: { url: string; format: 'woff' | 'woff2' | 'truetype' | 'opentype' };

    fontStyle?: string;

    fontWeight?: number | string;

  } | null;

  colors?: {

    heading?: string;

    paragraph?: string;

    horizontal?: string;

    footer?: string;

    blockquoteBorder?: string;

    codeBackground?: string;

    codeText?: string;

    linkCardTitle?: string;

    linkCardDescription?: string;

    linkCardBadgeText?: string;

    linkCardBadgeBackground?: string;

    linkCardSubTitle?: string;

  };

  fontSize?: {

    paragraph?: { size?: string; lineHeight?: string };

    footer?: { size?: string; lineHeight?: string };

  };

}

### Default Theme (Maily baseline)

const DEFAULT\_RENDERER\_THEME \= {

  colors: {

    heading: '\#111827',

    paragraph: '\#374151',

    horizontal: '\#EAEAEA',

    footer: '\#64748B',

    blockquoteBorder: '\#D1D5DB',

    codeBackground: '\#EFEFEF',

    codeText: '\#111827',

  },

  fontSize: {

    paragraph: { size: '15px', lineHeight: '26.25px' },

    footer: { size: '14px', lineHeight: '24px' },

  },

  container: {

    backgroundColor: '\#ffffff',

    maxWidth: '600px',

    minWidth: '300px',

    paddingTop: '0.5rem',

    paddingRight: '0.5rem',

    paddingBottom: '0.5rem',

    paddingLeft: '0.5rem',

    borderRadius: '0px',

    borderWidth: '0px',

    borderColor: 'transparent',

  },

  button: {

    backgroundColor: '\#000000',

    color: '\#ffffff',

    paddingTop: '10px',

    paddingRight: '32px',

    paddingBottom: '10px',

    paddingLeft: '32px',

  },

  font: {

    fallbackFontFamily: 'sans-serif',

    fontFamily: 'Inter',

    webFont: {

      url: 'https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19',

      format: 'woff2',

    },

  },

};

---

## SPACE AGE EMAIL THEMES

### SA-01: Dark OLED Cinematic (Space Age Brand)

For outreach emails from Space Age AI Solutions pipeline.

const SA\_DARK\_THEME \= {

  container: {

    backgroundColor: '\#050508',

    maxWidth: '600px',

    paddingTop: '32px',

    paddingRight: '24px',

    paddingBottom: '32px',

    paddingLeft: '24px',

    borderRadius: '0px',

    borderWidth: '1px',

    borderColor: 'rgba(255,255,255,0.07)',

  },

  body: {

    backgroundColor: '\#050508',

  },

  colors: {

    heading: 'rgba(255,255,255,0.92)',

    paragraph: 'rgba(255,255,255,0.65)',

    horizontal: 'rgba(255,255,255,0.10)',

    footer: 'rgba(255,255,255,0.35)',

    blockquoteBorder: '\#FF6B00',

    codeBackground: 'rgba(255,255,255,0.04)',

    codeText: '\#A8FF3E',

    linkCardTitle: 'rgba(255,255,255,0.92)',

    linkCardDescription: 'rgba(255,255,255,0.55)',

    linkCardBadgeText: '\#050508',

    linkCardBadgeBackground: '\#FF6B00',

  },

  button: {

    backgroundColor: '\#FF6B00',

    color: '\#ffffff',

    paddingTop: '12px',

    paddingRight: '32px',

    paddingBottom: '12px',

    paddingLeft: '32px',

  },

  link: { color: '\#FF6B00' },

  font: {

    fontFamily: 'DM Sans',

    fallbackFontFamily: 'sans-serif',

    webFont: {

      url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2Fp2ywxg089UriCZOIHTWEBlwu8Q.woff2',

      format: 'woff2',

    },

  },

  fontSize: {

    paragraph: { size: '15px', lineHeight: '26px' },

    footer: { size: '13px', lineHeight: '22px' },

  },

};

### SA-02: Light Cinematic (Client-Facing / Outreach)

For cold outreach emails to local business leads. Builds trust with clean professional aesthetic.

const SA\_LIGHT\_OUTREACH\_THEME \= {

  container: {

    backgroundColor: '\#FAFAFA',

    maxWidth: '580px',

    paddingTop: '40px',

    paddingRight: '40px',

    paddingBottom: '40px',

    paddingLeft: '40px',

    borderRadius: '4px',

    borderWidth: '1px',

    borderColor: '\#E5E5E5',

  },

  body: { backgroundColor: '\#F0F0F0' },

  colors: {

    heading: '\#0A0A0A',

    paragraph: '\#3D3D3D',

    horizontal: '\#E5E5E5',

    footer: '\#888888',

    blockquoteBorder: '\#FF6B00',

    codeBackground: '\#F0F0F0',

    codeText: '\#0A0A0A',

    linkCardTitle: '\#0A0A0A',

    linkCardDescription: '\#6B6B6B',

    linkCardBadgeText: '\#ffffff',

    linkCardBadgeBackground: '\#0A0A0A',

  },

  button: {

    backgroundColor: '\#0A0A0A',

    color: '\#ffffff',

    paddingTop: '12px',

    paddingRight: '28px',

    paddingBottom: '12px',

    paddingLeft: '28px',

  },

  link: { color: '\#FF6B00' },

  font: {

    fontFamily: 'DM Sans',

    fallbackFontFamily: 'sans-serif',

    webFont: {

      url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2Fp2ywxg089UriCZOIHTWEBlwu8Q.woff2',

      format: 'woff2',

    },

  },

};

### SA-03: Record Exec in a Box Artist Email

For Chosen Legend, artist clients, music promo emails.

const SA\_ARTIST\_THEME \= {

  container: {

    backgroundColor: '\#0D0D0D',

    maxWidth: '600px',

    paddingTop: '0px',

    paddingRight: '0px',

    paddingBottom: '32px',

    paddingLeft: '0px',

    borderRadius: '0px',

    borderWidth: '0px',

    borderColor: 'transparent',

  },

  body: { backgroundColor: '\#000000' },

  colors: {

    heading: '\#FFFFFF',

    paragraph: 'rgba(255,255,255,0.75)',

    horizontal: 'rgba(255,255,255,0.12)',

    footer: 'rgba(255,255,255,0.40)',

    blockquoteBorder: '\#A8FF3E',

    linkCardTitle: '\#FFFFFF',

    linkCardBadgeBackground: '\#A8FF3E',

    linkCardBadgeText: '\#000000',

  },

  button: {

    backgroundColor: '\#A8FF3E',

    color: '\#000000',

    paddingTop: '14px',

    paddingRight: '36px',

    paddingBottom: '14px',

    paddingLeft: '36px',

  },

  link: { color: '\#A8FF3E' },

  font: {

    fontFamily: 'DM Sans',

    fallbackFontFamily: 'sans-serif',

    webFont: {

      url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2Fp2ywxg089UriCZOIHTWEBlwu8Q.woff2',

      format: 'woff2',

    },

  },

};

---

## CINEMATIC EMAIL CONTENT PATTERNS

### Pattern 1: Lead Gen Outreach (Space Age Pipeline)

JSON structure for cold outreach to local businesses:

const leadOutreachEmail: JSONContent \= {

  type: "doc",

  content: \[

    {

      type: "logo",

      attrs: { url: "https://spaceage.ai/logo.png", alt: "Space Age AI Solutions", size: 48, alignment: "left" }

    },

    { type: "spacer", attrs: { height: 24 } },

    {

      type: "heading",

      attrs: { level: 1 },

      content: \[{ type: "text", text: "I built your website." }\]

    },

    {

      type: "paragraph",

      content: \[{ type: "text", text: "Hi {{firstName}}, I noticed {{businessName}} doesn't have a strong online presence — so I built a demo for you. No strings. Take a look." }\]

    },

    { type: "spacer", attrs: { height: 8 } },

    {

      type: "button",

      attrs: { text: "View Your Site Demo", url: "{{demoUrl}}", alignment: "left", variant: "filled" }

    },

    { type: "divider" },

    {

      type: "paragraph",

      content: \[{ type: "text", text: "Sites start at $300. If you like what you see, we can have you live in 48 hours." }\]

    },

    {

      type: "footer",

      content: \[{ type: "text", text: "Space Age AI Solutions · {{senderName}} · Reply to this email to claim your site" }\]

    }

  \]

};

### Pattern 2: Artist New Release Announcement

const artistReleaseEmail: JSONContent \= {

  type: "doc",

  content: \[

    {

      type: "image",

      attrs: { src: "{{coverArtUrl}}", alt: "{{trackTitle}} — {{artistName}}", width: "100%" }

    },

    { type: "spacer", attrs: { height: 32 } },

    {

      type: "heading",

      attrs: { level: 1 },

      content: \[{ type: "text", text: "{{trackTitle}} — Out Now" }\]

    },

    {

      type: "paragraph",

      content: \[{ type: "text", text: "{{artistName}} drops the new {{releaseType}}. Stream it everywhere." }\]

    },

    { type: "spacer", attrs: { height: 16 } },

    {

      type: "columns",

      content: \[

        {

          type: "column",

          content: \[{

            type: "button",

            attrs: { text: "Stream on Spotify", url: "{{spotifyUrl}}", alignment: "center" }

          }\]

        },

        {

          type: "column",

          content: \[{

            type: "button",

            attrs: { text: "Apple Music", url: "{{appleUrl}}", alignment: "center" }

          }\]

        }

      \]

    }

  \]

};

---

## INTEGRATION PATTERNS

### Send with Resend

import { render } from '@maily-to/render';

import { Resend } from 'resend';

const resend \= new Resend(process.env.RESEND\_API\_KEY);

async function sendMailyEmail(

  to: string,

  subject: string,

  contentJson: JSONContent,

  variables: Record\<string, string\>,

  theme \= SA\_LIGHT\_OUTREACH\_THEME

) {

  const html \= await render(contentJson, { theme, variables });

  return resend.emails.send({

    from: 'Space Age AI Solutions \<noreply@spaceage.ai\>',

    to, subject, html,

  });

}

### Send with Nodemailer

import { render } from '@maily-to/render';

import nodemailer from 'nodemailer';

const transporter \= nodemailer.createTransport({

  host: process.env.SMTP\_HOST,

  port: 587,

  auth: { user: process.env.SMTP\_USER, pass: process.env.SMTP\_PASS },

});

async function sendCampaignEmail(to: string, contentJson: JSONContent, vars: Record\<string, string\>) {

  const html \= await render(contentJson, {

    theme: SA\_DARK\_THEME,

    variables: vars,

    preview: vars.previewText,

  });

  return transporter.sendMail({ from: '"Space Age AI" \<hello@spaceage.ai\>', to, subject: vars.subject, html });

}

### Bulk Outreach via n8n / Pipeline

// In the Space Age lead gen pipeline — after outreach-copywriter generates the JSON

async function processLeadBatch(leads: Lead\[\]) {

  for (const lead of leads) {

    const emailJson \= buildOutreachJson(lead); // from outreach-copywriter skill

    const html \= await render(emailJson, {

      theme: SA\_LIGHT\_OUTREACH\_THEME,

      variables: {

        firstName: lead.ownerFirstName,

        businessName: lead.businessName,

        demoUrl: \`https://spaceage.ai/demos/${lead.slug}\`,

        senderName: 'The Space Age Team'

      }

    });

    await queueEmail({ to: lead.email, subject: \`I built a site for ${lead.businessName}\`, html });

  }

}

---

## LOCAL SELF-HOSTED SETUP

### Web App (Full Editor with Auth)

git clone https://github.com/arikchakma/maily.to.git

cd maily.to

pnpm install

cp apps/web/.env.example apps/web/.env

\# Fill in: DATABASE\_URL (Supabase), GITHUB\_CLIENT\_ID, GOOGLE\_CLIENT\_ID, etc.

pnpm dev

### Embed Editor Only (No Auth Required)

\# Playground mode — no auth, local state only

pnpm dev  \# then visit /playground

### Render-Only (API Microservice)

// Lightweight render API — no editor needed

import { render } from '@maily-to/render';

import express from 'express';

const app \= express();

app.use(express.json());

app.post('/render', async (req, res) \=\> {

  const { content, theme, variables } \= req.body;

  const html \= await render(content, { theme, variables });

  res.json({ html });

});

app.listen(3001);

---

## EMAIL BEST PRACTICES (CLIENT COMPATIBILITY)

### What Maily Handles Automatically

- Table-based layouts for Outlook compatibility  
- Inline CSS for Gmail  
- Preview text injection  
- Web font fallbacks  
- Responsive max-width containers

### What You Must Ensure

1. **Images**: Use absolute URLs only. No relative paths.  
2. **Max width**: Keep container ≤ 600px for Outlook  
3. **Fonts**: Always provide `fallbackFontFamily`. Not all clients support web fonts.  
4. **Dark mode**: Email dark mode is client-controlled, NOT CSS `prefers-color-scheme`. Design with sufficient contrast on both light and dark.  
5. **CTA buttons**: Use the built-in `button` block — do NOT create `<a>` tags styled as buttons (breaks in Outlook).  
6. **Background colors**: Set on both `container` AND `body` for Outlook/Gmail compatibility.

### Email Client Support Matrix

| Feature | Gmail | Outlook | Apple Mail | iOS Mail |
| :---- | :---- | :---- | :---- | :---- |
| Web fonts | ❌ (use fallback) | ❌ | ✅ | ✅ |
| `backdrop-filter` | ❌ | ❌ | ✅ | ✅ |
| CSS Grid | ❌ | ❌ | ✅ | ✅ |
| `@media` queries | ✅ | Partial | ✅ | ✅ |
| `border-radius` | ✅ | ❌ | ✅ | ✅ |

**Rule**: Design for Gmail \+ Outlook as the lowest common denominator. Maily's table-based renderer handles most of this automatically.

---

## CUSTOM BLOCK EXTENSION

Add custom slash command blocks to the editor:

import type { BlockGroupItem } from '@maily-to/core';

const saBlock \= {

  id: 'sa-cinematic-header',

  title: 'SA Cinematic Header',

  description: 'Space Age brand header with orange accent',

  searchTerms: \['space age', 'sa', 'cinematic', 'header'\],

  icon: \<StarIcon className="h-4 w-4" /\>,

  content: {

    type: 'section',

    attrs: { backgroundColor: '\#050508', paddingTop: '32px', paddingBottom: '32px' },

    content: \[

      {

        type: 'logo',

        attrs: { url: 'https://spaceage.ai/logo-white.png', size: 40, alignment: 'left' }

      },

      {

        type: 'heading',

        attrs: { level: 1 },

        content: \[{ type: 'text', marks: \[{ type: 'textStyle', attrs: { color: '\#FFFFFF' } }\], text: 'Email Title' }\]

      }

    \]

  }

};

// Pass to Editor

\<Editor

  contentJson={defaultContent}

  additionalSlashCommands={\[{ title: 'Space Age', commands: \[saBlock\] }\]}

/\>

---

## PIPELINE INTEGRATION

### Lead Gen Pipeline Position

Google Maps Scrape

  → lead-to-brief (build\_brief)

  → outreach-copywriter (email JSON \+ variables)

  → \[THIS SKILL\] render() → production HTML

  → Resend / SMTP bulk send

  → Vapi voice follow-up

### Record Exec in a Box Position

Artist onboarding

  → artist brief \+ track data

  → \[THIS SKILL\] build artist email JSON

  → render() with SA\_ARTIST\_THEME

  → Schedule via campaign tool

  → Track open rate / click rate

---

## COMMON ERRORS & FIXES

| Error | Cause | Fix |
| :---- | :---- | :---- |
| `Cannot render: contentJson is undefined` | Missing JSON | Pass default `{ type: "doc", content: [] }` |
| Images not showing in Gmail | Relative URL | Use absolute HTTPS URL |
| Font not loading | Invalid webFont URL | Check URL is public, format matches file |
| Button background not showing in Outlook | CSS background | Maily handles this — ensure using `button` block not custom HTML |
| Variables not substituted | Wrong syntax | Use `{{variableName}}` not `${variableName}` |
| Theme not applying | Missing keys | Check theme object structure against `RendererThemeOptions` |
| Preview text not showing | Missing preview option | Pass `preview: 'text'` to `render()` config |

---

## API REFERENCE QUICK CARDS

### `render(content, config)`

// Returns: Promise\<string\> (HTML)

await render(json, {

  preview?: string,              // Email preview/preheader text

  theme?: RendererThemeOptions,  // Visual theme

  variables?: Record\<string, string\>  // {{variable}} substitutions

})

### `<Editor />` Props

\<Editor

  contentJson={JSONContent}       // Required: initial content

  onCreate={(editor) \=\> void}     // Called when editor mounts

  onUpdate={(editor) \=\> void}     // Called on content change

  config={{ hasMenuBar: true }}   // Optional UI config

/\>

### Get JSON from Editor

editor.getJSON() // → JSONContent

editor.getHTML() // → Raw HTML (not email-safe — use renderer instead)  
