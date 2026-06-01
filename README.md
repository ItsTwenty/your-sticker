# ✦ Your Sticker — Premium Custom Stickers Maroc 🇲🇦

Welcome to the documentation for **Your Sticker**, a premium streetwear-inspired, modern editorial landing page and shop for custom stickers in Morocco. This codebase is built with vanilla technologies (HTML5, CSS3, ES6 JavaScript) and focuses on rich interactive user experiences, stunning brutalist aesthetics, and seamless integrations.

---

## 📖 Table of Contents
1. [Overview & Design Language](#-overview--design-language)
2. [Key Features](#-key-features)
3. [Architecture & Project Structure](#-architecture--project-structure)
4. [Third-Party Integrations](#-third-party-integrations)
5. [Admin Dashboard & Product Management](#-admin-dashboard--product-management)
6. [Getting Started & Local Development](#-getting-started--local-development)
7. [SEO & Best Practices](#-seo--best-practices)

---

## 🎨 Overview & Design Language

**Your Sticker** is designed to capture the attention of a young, creative audience (designers, developers, car enthusiasts, anime fans). It features a dark-themed Brutalist aesthetic with high-contrast accents:
- **Primary Color:** `#000000` (Deep Black)
- **Secondary Accent:** `#1D1D1F` (Charcoal Slate / Dark Gray)
- **Background Color:** `#FFFFFF` (Clean Contrast White)
- **Accent Elements:** Holographic gradients, flat brutalist edges, and editorial text spacing.
- **Typography:**
  - `Outfit` for large cinematic headers.
  - `Space Grotesk` for section headers and brutalist blocks.
  - `Inter` for clean body text and description readability.

---

## ✨ Key Features

### 1. Interactive Landing Page (`stick.html`)
- **Cinematic Hero Section:** Features a background video overlay with slow zoom animation, a HUD style grid, floating sticker mockups, and a typewriter text introduction.
- **Live Sticker Customizer & Price Calculator:**
  - Drag-and-drop or browse interface to upload custom stickers.
  - **Dynamic Preview:** Users can clip their uploaded image into *Original*, *Round*, or *Square* sticker formats in real-time.
  - **Pricing Engine:** Automatically calculates total cost based on dimensions (5x5 cm, 10x10 cm, 15x15 cm, Custom), material multiplier (Vinyle, Holographique, Transparent), and quantity.
  - **Quantity Discounts:** Built-in volume discounts (-10% for orders of 100+ units, -20% for 250+ units).
- **Shopping Cart Sidebar:** A fully-featured slide-out shopping cart stored in `localStorage` that manages quantities, updates the nav badge count, and calculates order totals.
- **WhatsApp Checkout:** Integrates checkout by building a pre-formatted message listing itemized quantities and totals, opening a direct WhatsApp chat window with the merchant.
- **Interactive UI Extras:** Smooth 3D tilt effects on cards, marquee banners, scroll progress bar, custom page preloader, dynamic FAQ accordion, and animated counters.

### 2. Custom Admin Portal (`admin.html`)
A private dashboard to update catalog items and manage asset uploads.
- **Access Control:** Secured client-side via session-based credential verification.
- **Cloudinary Image Uploader:** Directly upload product assets or sticker previews to Cloudinary. Includes an auto-generated direct link copier.
- **Product CRUD Editor:** Add, modify, or delete products stored in local state (`localStorage`).
- **Code Exporter:** A helper tool that outputs clean JavaScript data blocks to copy and paste directly into `products.js` to update the public catalog.

---

## 📁 Architecture & Project Structure

The project has a modular, flat structure suitable for rapid hosting on static web servers (such as GitHub Pages, Netlify, or Vercel).

```markdown
your-sticker/
├── index.html -> Not present, stick.html is the main entrypoint
├── stick.html            # Main customer landing page & interactive checkout
├── admin.html            # Admin dashboard for uploads & catalog updates
├── products.js           # Static database of active sticker packs
├── style.css             # Main styling system, variables, & animations
├── robots.txt            # Search engine crawl rules
├── sitemap.xml           # XML sitemap for Google SEO indexing
└── [images]              # High-definition showcase assets (.png, .jpg, .jpeg)
```

---

## 🔌 Third-Party Integrations

The site requires no backend hosting, utilizing lightweight serverless APIs:

| Integration | Purpose | Implementation Details |
| :--- | :--- | :--- |
| **Cloudinary API** | Media upload & CDN hosting | Upload preset `your_sticker_preset` / Cloud name `dznktn0es` |
| **Web3Forms** | Contact form submission | Form API key `82ae3939-9c9e-4372-86c7-678c26933822` |
| **WhatsApp Link API** | Order dispatch & checkout | Directs order detail payloads to `+212 600000000` |
| **FontAwesome** | Vector icons | Loaded via CDNJS version 6.5.0 |

---

## 🔐 Admin Dashboard & Product Management

To access the admin dashboard:
1. Navigate to the footer of the site and click on the **`[ Admin ]`** link or open [admin.html](file:///c:/Users/User/Desktop/your%20sticker/admin.html) directly.
2. Enter the following credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

### Adding/Editing Products:
1. Drag or select an image in the **Ajouter une nouvelle photo** section to upload it to Cloudinary.
2. Click **Copier le lien** on the uploaded image.
3. Fill out the **Ajouter un Produit** form and paste the copied URL into the *Image URL* field.
4. Click **Ajouter au catalogue** to save it locally.
5. Once your catalog is updated, scroll down to **Catalogue Actuel**, click **Exporter pour le Site (Code)**, copy the generated code, and paste it to overwrite the contents of [products.js](file:///c:/Users/User/Desktop/your%20sticker/products.js).

---

## 🚀 Getting Started & Local Development

Since the project is built with static HTML, CSS, and JS, no local compiler or complex setup is needed.

### Running Locally
- Simply double-click [stick.html](file:///c:/Users/User/Desktop/your%20sticker/stick.html) to open the page directly in your browser.
- Alternatively, serve the project using a local server extension (e.g., Live Server in VS Code, Python's `http.server`, or Node's `http-server`):
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Node.js
  npx http-server .
  ```

---

## 📈 SEO & Best Practices

The codebase incorporates modern SEO standards automatically:
- **Meta Tags:** Complete Open Graph (Facebook/LinkedIn) and Twitter Cards tags are implemented in `stick.html`.
- **Sitemap & Crawlability:** Search bots are guided via `robots.txt` and `sitemap.xml`.
- **Structured Data:** Schema.org `LocalBusiness` JSON-LD configuration is embedded to optimize search engine rich snippet results.
- **Semantic Structure:** Follows standard HTML5 layouts (`<header>`, `<section>`, `<nav>`, `<footer>`) with structured heading hierarchies.
