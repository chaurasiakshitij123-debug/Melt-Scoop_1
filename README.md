# 🍦 MELT & SCOOP™ — Artisanal Creamery Web Experience

> **Creamy by nature. Happy by design.**  
> An award-winning, interactive e-commerce and brand showcase website for artisanal ice cream.

---

## 🌟 Features Overview

### 01 — Header / Navigation
- Floating cream-colored capsule shape with organic melted bottom edge.
- Shrinks into compact sticky mode upon scrolling down.
- Navigation links with smooth scroll to sections.
- Real-time cart trigger with bouncy badge counter, predictive search bar trigger, and wishlist indicator.

### 02 — Hero: Interactive Showcase
- Oversized photorealistic ice cream cone visual with studio lighting.
- Interactive flavor switcher: **Tahitian Vanilla**, **Strawberry Bliss**, **Belgian Chocolate**, **Sicilian Pistachio**, and **Alphonso Mango**.
- **Liquid Flavor Morphing**: Smooth scale-down/glide-out transition followed by an elastic spring-in of the new flavor.
- Atmospheric radial glow and canvas sprinkles auto-tint to match the active flavor.
- Interactive 3D mouse parallax (`perspective(1200px) rotateX(...) rotateY(...)`) and subtle scroll-based cone rotation.
- **Fly-to-Cart Animation**: Adding a scoop to cart launches a mini scoop projectile tracing an organic bezier arc straight into the header cart icon!

### 03 — Organic Wavy Transitions
- Layered organic melted cream SVG wave dividers that fluidly connect every major section across the entire page.

### 04 — Best Sellers
- 6 crowd-favorite artisanal scoops with tasting notes, ratings, pricing, quantity steppers, and wishlist hearts.
- Hover interactions: scoop lifts upward, card background shifts to flavor pastel, and an organic colored blob expands behind the product.

### 05 — Shop By Flavor (Irregular Organic Bubbles)
- Huge statement typography: *"WHAT ARE YOU CRAVING TODAY?"*
- 6 irregular organic morphing blob cards (Strawberry, Chocolate, Mango, Pistachio, Vanilla, Coffee).
- Clicking any bubble automatically filters the Best Sellers section to that flavor family.

### 06 — Made for Real Cravings (Storytelling)
- Editorial split layout: Organic fluid photography container with floating grass-fed dairy badge.
- Three craft pillars: 01 Premium Ingredients, 02 Freshly Made Daily, 03 Delivered With Care (Dry Ice guaranteed).

### 07 — Build Your Box (Interactive Custom Bundle Creator)
- Box size selector: **4 Scoops (₹549)** | **6 Scoops (₹799)** | **8 Scoops (₹999)**.
- Visual box tray with empty slot circles that fill up with colorful scoop graphics as flavors are added.
- Flavor palette with live counters, progress tracker (*"4 of 6 scoops filled"*), and "Add Box to Cart" with confetti!

### 08 — Product / Ice Cream Experience
- Full-bleed editorial spread: *"SCOOP. SMILE. REPEAT."*
- 360° rotating circular typography stamp badge (*"• ARTISANAL CHURNED • FRESH DAILY • 100% REAL MILK •"*).

### 09 — Customer Love
- 3 organic speech-bubble testimonial cards with customer avatars, star ratings, and verified buyer badges.

### 10 — Store / Location IRL
- Boutique scoop parlor photography with live open status indicator (🟢 *Open till 11:30 PM*).
- Interactive city tabs: **Ahmedabad**, **Mumbai**, **Delhi NCR**, and **Bangalore** with addresses, phone numbers, and city-exclusive flavors.

### 11 — Final CTA
- Vibrant boundary-overlapping scoop visual with high-energy typography: *"LIFE'S TOO SHORT FOR BORING ICE CREAM."*

### 12 — Footer
- Dripping melted cream top border, social links, newsletter subscription with instant discount reward, and playful microcopy.

### 🛒 Complete E-Commerce Experience
- **Slide-Over Cart Drawer**: Line items, quantity controls, removal, subtotal, and tax.
- **Sub-Zero Delivery Progress Bar**: Free shipping indicator (threshold ₹699).
- **Promo Coupon System**: Use `SWEET20` for 20% off or `SWEET10` for 10% off.
- **Fast Chilled Checkout Modal**: Address collection, city selection, payment method options (UPI / GPay, Card, Cash on Delivery), and confetti-powered order confirmation!
- **Search Modal**: Live search matching flavor names, ingredients, and categories.
- **Quick View Modal**: In-depth tasting notes, allergen information, and nutrition breakdown.

---

## 🚀 How to Run Locally

You can run the built-in PowerShell static web server directly:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8080
```

Then open your browser to:
[http://localhost:8080](http://localhost:8080) or [http://127.0.0.1:8080](http://127.0.0.1:8080)

You can also double-click or open `index.html` directly in any modern browser.
