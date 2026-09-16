# 🍨 MELT & SCOOP™ — Luxury Artisanal Creamery, Waffle House & Live Visual Studio CMS

> **"SCOOPS OF HAPPINESS."**  
> A hyper-polished, luxury e-commerce web application combining slow-churned artisanal ice cream, fresh Belgian pearl-sugar waffles, physical parlor discovery, an immersive store image gallery, and a secret in-browser Live Visual Studio CMS.

---

## 🎨 1. Brand Identity, Design System & Tokens

* **Aesthetic Direction**: Artisanal luxury creamery meets high-fashion editorial magazine. Warm, playful, sophisticated, and deeply experiential.
* **Palette**:
  * **Rich Espresso / Chocolate Dark**: `#1E1412`, `#321D17`
  * **Warm Cream / Gelato Silk**: `#FFF9F2`, `#FAF4ED`, `#F2E5D5`
  * **Strawberry Neon Accent**: `#FF5E7E`, `#E84B6B`, `#FF8DA4`
  * **Amber / Caramel Accent**: `#FFB347`, `#E59830`
  * **Pistachio Celadon**: `#A8D5BA`, `#6B9E78`
  * **Frosted Glass Tint**: `rgba(255, 255, 255, 0.65)` with `backdrop-filter: blur(20px)`
* **Typography**:
  * **Display / Editorial Headings**: `Fraunces`, Georgia, serif (weight: 700–900).
  * **Body / Interface / Subtitles**: `Plus Jakarta Sans`, system-ui, sans-serif (weight: 400, 600, 700, 800).
* **Surface Styling**:
  * Soft pillowy border radii: `border-radius: 999px` for pills/buttons, `24px–36px` for cards.
  * Multi-layered soft drop shadows with warm ambient glows: `0 20px 50px rgba(0,0,0,0.08)`, `0 0 30px rgba(255,94,126,0.15)`.
  * Micro-interactions: 60fps spring deceleration, `scale(1.03)` on hover, `scale(0.96)` on tap.

---

## 🏗️ 2. Complete Page Architecture & Features

### 01 — Sticky Frosted Header (`#siteHeader`)
* Compact sticky frosted-glass header (`backdrop-filter: blur(20px)`).
* Left-aligned editorial brand logo: `MELT & SCOOP.` with strawberry accent dot.
* **Secret 5-Tap Gesture Trigger**: Rapidly tapping the logo 5 times unlocks the Live Visual Studio CMS with celebratory gold shimmer, haptic pulse, and zero passwords.
* Navigation links with smooth scrolling and scrollspy active indicators:
  `Home` · `Shop` · `Waffles` · `Build A Box` · `Our Story` · `Locations` · `Contact`.
* Utility suite: Language badge (`ENG`), circular social icon pills (Facebook, Instagram), search trigger modal, and cart pill with pop badge count animation.
* Mobile responsive slide-over drawer navigation for screen widths `≤ 860px`.

### 02 — Hero Showcase Stage (`#heroSection`)
A tiered 3-container stage designed to spotlight 5 signature flavors (**Vanilla**, **Strawberry**, **Chocolate**, **Pistachio**, **Mango**):
* **Top Masthead (Upper Container)**:
  * Floating badge: `✨ 100% ARTISANAL CHURNED`
  * Editorial headline: `SCOOPS OF HAPPINESS.` in warm italicized serif.
  * Subtitle celebrating slow-churned grass-fed dairy and small-batch craftsmanship.
* **Centered Hero Cone Stage (Middle Container)**:
  * **Zoomed Cone**: Displayed 25% larger (`scale(1.25)`), top-anchored (`transform-origin: top center`), inside clean viewport mask (`overflow: hidden`).
  * **Flanking Navigation Arrows**: Circular frosted-glass `←` and `→` with subtle hover bounce.
  * **Direction-Aware Slide Transitions**:
    * Clicking `→`: Current flavor slides out to the left (`coneSlideOutLeft`), new flavor enters from the right (`coneSlideInRight`).
    * Clicking `←`: Current flavor slides out to the right (`coneSlideOutRight`), new flavor enters from the left (`coneSlideInLeft`).
    * Full keyboard arrow support: `ArrowLeft` and `ArrowRight`.
  * Dynamic dual-layer atmospheric radial glow and sprinkles canvas auto-tinting to match active flavor.
* **Product & Action Stage**:
  * Quick-add card with quantity stepper, tasting notes, price, and instant fly-to-cart bezier animation.

### 03 — Artisanal Ice Cream Collection (`#bestsellersSection`)
* Curated catalog of signature slow-churned scoops (Tahitian Vanilla Bean, Strawberry Bliss, Belgian Dark Truffle, Sicilian Pistachio, Alphonso Mango, Salted Caramel Cocoa Fudge, Wild Strawberry Cheesecake).
* Interactive filter tabs (All, Chocolate, Strawberry, Pistachio, Vanilla, Mango) and sort controls (Popular, Price Low to High, Price High to Low).
* Wishlist hearts with local persistence, Quick View modal triggers, and quantity steppers.

### 04 — Dedicated Fresh Waffle Collection (`#wafflesSection`)
* Editorial header: *"GOLDEN, CRISP & WARM FROM THE IRON."*
* **6 Curated Artisanal Waffle Creations**:
  1. **The Classic Belgian Liège** (₹279) — Brioche pearl-sugar dough with caramelized golden crust, clotted Tahitian vanilla cream & pure maple drizzle.
  2. **Valrhona Molten Ganache Waffle** (₹329) — Dark cocoa waffle layered with hot Belgian fudge, dark chocolate curls & Belgian dark truffle scoop.
  3. **Alphonso Sunshine Bubble Waffle** (₹329) — Warm Hong Kong egg bubble waffle wrap cradling Alphonso mango silk gelato, passionfruit coulis & fresh mint.
  4. **Sicilian Pistachio Praline Waffle** (₹349) — Caramelized Liège waffle smothered in roasted Bronte pistachio cream, emerald pralines & white chocolate glaze.
  5. **Wild Strawberry Short-Waffle** (₹299) — Macerated alpine strawberries, whipped Tahitian vanilla chantilly & strawberry bliss scoop.
  6. **Salted Butterscotch Toffee Waffle** (₹319) — Hot waffle drenched in copper kettle-cooked salted butterscotch, smoked fleur de sel & toasted Georgia pecans.
* **Interactive Waffle Customizer Bar**:
  * Step 1: Base (Belgian Liège, Brussels Crisp, Hong Kong Bubble)
  * Step 2: Gelato Scoop Pairing (Vanilla, Strawberry, Chocolate, Pistachio, Mango)
  * Step 3: Luxury Drizzle (Molten Fudge, Salted Butterscotch, Pistachio Glaze, Berry Coulis)
  * Live calculated price & summary with one-click Add to Cart!

### 05 — Interactive Custom Box Builder (`#boxBuilderSection`)
* Custom bundle creator for **4 Scoops (₹549)**, **6 Scoops (₹799)**, and **8 Scoops (₹999)**.
* Visual box tray with circular slot cutouts that dynamically fill with 3D scoop illustrations as flavors are added.
* Flavor picker with live counters, slot removal, sub-zero dry ice guarantee badge, and celebratory confetti burst upon adding box to cart.

### 06 — Our Story & Craftsmanship (`#storySection` & `#editorialExperience`)
* Editorial magazine split layout showcasing small-batch copper churns, 100% pasture-raised dairy, and clean farm-to-cone ethos.
* Full-bleed editorial spread: *"SCOOP. SMILE. REPEAT."* with 360° spinning seal stamp.

### 07 — Customer Love & Reviews (`#testimonialsSection`)
* Organic speech-bubble cards with verified customer testimonials, ratings, and avatars.

### 08 — Physical Parlor Discovery (`#storeSection`)
* Interactive 4-city tabs: **Ahmedabad Flagship**, **Mumbai Bandra**, **Delhi NCR**, **Bangalore Indiranagar**.
* Real-time status indicator (🟢 *Open Now · Closes at 11:45 PM*).
* Parlor address, telephone with one-tap calling, parlor-exclusive flavors, and instant Google Maps directions.

### 09 — Immersive Store Image Gallery (`#storeGallerySection`)
* Curated high-fashion visual gallery showcasing parlor architecture, copper churners, waffle irons, and night ambiance.
* Filter tabs: `All Moments`, `Parlor Architecture`, `Behind The Churn`, `The Waffle Iron`, `Night Atmosphere`.
* Interactive **Full-Screen Lightbox Modal**: High-res photo viewing with architectural notes and keyboard ESC close.

### 10 — Large Editorial Footer (`#footerContact`)
* Melted cream wave border, newsletter subscription with instant discount promo code reward (`SWEET10`), brand values, and legal links.

---

## 🛠️ 3. Secret Live Visual Studio CMS & Engine

* **5-Tap Gesture Unlock**: 5 quick taps on the brand logo (`.header-left-logo`) triggers a golden celebratory shimmer, haptic pulse, and unlocks Studio Mode with zero passwords.
* **Floating Studio Dock**:
  * ✏️ **Edit Text**: Direct inline contentEditable text editing of all headlines, paragraphs, and prices with instant auto-save.
  * ✨ **Animate**: Interactive animation inspector to apply and test presets (`Fade In`, `Blur In`, `Float Up`, `Slide Up`, `Pop In`, `Wobble`) with speed and delay sliders.
  * 🖼️ **Replace Images**: File upload or direct image URL replacement with instant live preview.
  * 📐 **Move & Scale (Live Canvas Transform Engine)**: Click & drag any element on the page in real-time, adjust X/Y offset sliders, fine-tune nudges, rotation slider (-180° to +180°), scale slider (0.2x to 3.0x), and Z-index layer ordering.
  * 🎬 **Section Scroll Entrance Selector**: Switch between `Dreamy Blur In`, `Slide Up Spring`, `Zoom Cascade`, and `Buoyant Float`.
  * 🖱️ **Artisanal Cursor Physics Engine**: 18+ selectable physics-based cursor effects (Sprinkles Trail, Melting Blob, Ambient Glow, Ice Cream Scoop, Golden Stardust, Soda Bubbles, Berry Blast, Molten Ganache, Waffle Crunch, Soft Serve Ribbon, Confetti, Sub-Zero Frost, Sweet Hearts, Toffee Caramel, Cosmic Nebula, Neon Electric, Pixie Dust Wand, Default Minimal) with real-time velocity, gravity, and particle lifespans.
  * 💾 **Export HTML**: Clean client-side single-click export of the DOM.
  * 🚀 **Publish Live**: Atomic disk write to `index.html` via `/api/publish` with timestamped backup and optional git push.

---

## 🛒 4. Complete E-Commerce Flow

* **Slide-Over Cart Drawer**: Line items, quantity increments/decrements, item removal, and subtotal.
* **Sub-Zero Delivery Progress Bar**: Free shipping indicator (threshold ₹699).
* **Promo Coupon System**: Apply `SWEET20` (20% off) or `SWEET10` (10% off).
* **Fast Chilled Checkout Modal**: Address collection, city selection, payment method options (UPI / GPay, Card, Cash on Delivery), and confetti-powered order confirmation!
* **Search Modal**: Instant predictive search matching flavor names, ingredients, waffle creations, and categories.
* **Quick View Modal**: In-depth tasting notes, allergen information, and nutrition breakdown for all scoops and waffles.

---

## 🚀 5. How to Run Locally

Run the built-in PowerShell static web server with Live Publishing API:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8080
```

Then open your browser to:
**[http://localhost:8080](http://localhost:8080)** or **[http://127.0.0.1:8080](http://127.0.0.1:8080)**

Or open `index.html` directly in any modern web browser.
