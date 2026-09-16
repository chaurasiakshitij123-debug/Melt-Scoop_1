/* Melt & Scoop™ - Shop Catalog & Product Controller */

const PRODUCTS_DATA = [
  {
    id: 'prod-choc-truffle',
    name: 'Belgian Dark Truffle',
    price: 249,
    rating: 5.0,
    reviewsCount: 340,
    badge: '👑 Bestseller',
    image: 'assets/images/chocolate.png',
    tastingNotes: 'Decadent 70% dark cocoa · Chocolate shavings · Molten ganache fudge',
    description: 'An unapologetically intense dark chocolate experience crafted with single-origin Callebaut Belgian cocoa and ribbons of molten ganache.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '260 kcal', fat: '15g', sugar: '19g', protein: '5g' }
  },
  {
    id: 'prod-van-tahitian',
    name: 'Tahitian Vanilla Bean',
    price: 189,
    rating: 4.9,
    reviewsCount: 310,
    badge: '✨ Classic',
    image: 'assets/images/vanilla.png',
    tastingNotes: 'Floral orchid vanilla · Golden sweet butter · Real bean specks',
    description: 'Our signature staple. Churned with real Madagascar and Tahitian vanilla bean caviar and unpasteurized organic sweet cream.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '220 kcal', fat: '12g', sugar: '17g', protein: '4g' }
  },
  {
    id: 'prod-straw-bliss',
    name: 'Strawberry Bliss',
    price: 199,
    rating: 5.0,
    reviewsCount: 280,
    badge: '🍓 Pure Fruit',
    image: 'assets/images/strawberry.png',
    tastingNotes: 'Fresh alpine strawberry · Sweet cream · Real berry ribbons',
    description: 'Bursting with hand-picked alpine strawberries folded into freshly churned whole cream, with sweet glazed berry chunks in every spoonful.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '210 kcal', fat: '11g', sugar: '18g', protein: '4g' }
  },
  {
    id: 'prod-pist-sicilian',
    name: 'Sicilian Pistachio Crunch',
    price: 269,
    rating: 5.0,
    reviewsCount: 290,
    badge: '⭐ Chef Pick',
    image: 'assets/images/pistachio.png',
    tastingNotes: 'Roasted Bronte pistachios · Sea salt cream · Velvety gelato',
    description: 'Authentic Sicilian gelato made from roasted emerald Bronte pistachios, folded into rich grass-fed cream with roasted nutty bits.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '240 kcal', fat: '14g', sugar: '16g', protein: '6g' }
  },
  {
    id: 'prod-mango-velvet',
    name: 'Alphonso Mango Velvet',
    price: 219,
    rating: 4.9,
    reviewsCount: 260,
    badge: '🥭 Seasonal',
    image: 'assets/images/mango.png',
    tastingNotes: 'Ratnagiri Alphonso pulp · Silky sorbet · Sun-drenched nectar',
    description: '100% pure Ratnagiri Alphonso mangoes turned into a refreshing, silky dairy-free sorbet. Like biting into a chilled, ripe summer mango.',
    dietary: ['Dairy-Free', 'Vegan', 'Gluten-Free'],
    nutrition: { calories: '170 kcal', fat: '0.5g', sugar: '22g', protein: '1g' }
  },
  {
    id: 'prod-choc-caramel',
    name: 'Salted Caramel Cocoa Fudge',
    price: 259,
    rating: 4.9,
    reviewsCount: 275,
    badge: '🔥 Fan Fav',
    image: 'assets/images/chocolate.png',
    tastingNotes: 'Fleur de sel caramel · Dutch processed chocolate · Molten fudge swirl',
    description: 'Buttery sea-salt caramel sauce swirled into dark Dutch cocoa ice cream with chewy dark chocolate fudge clusters.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '270 kcal', fat: '16g', sugar: '22g', protein: '5g' }
  },
  {
    id: 'prod-straw-cheesecake',
    name: 'Wild Strawberry Cheesecake',
    category: 'strawberry',
    price: 249,
    rating: 4.9,
    reviewsCount: 220,
    badge: '✨ New',
    image: 'assets/images/strawberry.png',
    tastingNotes: 'Graham crust crunch · Tangy mascarpone cream · Wild berry compote',
    description: 'Rich cultured cream cheese and mascarpone gelato laced with wild strawberry compote and buttery graham crumble.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '255 kcal', fat: '14g', sugar: '20g', protein: '5g' }
  },
  {
    id: 'waffle-liege-classic',
    name: 'The Classic Belgian Liège',
    category: 'waffle',
    price: 279,
    rating: 5.0,
    reviewsCount: 388,
    badge: '✨ Signature',
    image: 'assets/images/waffle-liege.jpg',
    tastingNotes: 'Caramelized pearl sugar · Yeasted brioche crumb · Vanilla clotted cream',
    description: 'Authentic Liège waffle crafted with rich yeasted brioche dough and Belgian pearl sugar that caramelizes into a glass-like crunch on the cast iron. Served piping hot with clotted Tahitian vanilla cream and pure maple syrup.',
    dietary: ['Vegetarian', 'Warm Baked'],
    nutrition: { calories: '340 kcal', fat: '16g', sugar: '22g', protein: '6g' }
  },
  {
    id: 'waffle-valrhona-ganache',
    name: 'Valrhona Molten Ganache Waffle',
    category: 'waffle',
    price: 329,
    rating: 5.0,
    reviewsCount: 342,
    badge: '🍫 Dark Truffle',
    image: 'assets/images/waffle-chocolate.jpg',
    tastingNotes: 'Deep Valrhona cocoa · Molten Belgian ganache · 70% dark chocolate curls',
    description: 'An indulgent dark cocoa waffle drenched in steaming hot Belgian fudge, crowned with a generous scoop of 70% dark chocolate truffle gelato and cocoa dusted shavings.',
    dietary: ['Vegetarian', 'Warm Baked'],
    nutrition: { calories: '410 kcal', fat: '22g', sugar: '28g', protein: '8g' }
  },
  {
    id: 'waffle-bubble-sunshine',
    name: 'Alphonso Sunshine Bubble Waffle',
    category: 'waffle',
    price: 329,
    rating: 4.9,
    reviewsCount: 295,
    badge: '🥭 Hong Kong Crisp',
    image: 'assets/images/waffle-bubble.jpg',
    tastingNotes: 'Crispy golden egg bubbles · Alphonso mango silk · Passionfruit coulis',
    description: 'Crisp, airy Hong Kong egg bubble waffle folded warm into a handheld cone, loaded with Alphonso mango velvet gelato, wild berry compote, passionfruit drizzle, and fresh edible blooms.',
    dietary: ['Vegetarian', 'Warm Baked'],
    nutrition: { calories: '320 kcal', fat: '12g', sugar: '25g', protein: '7g' }
  },
  {
    id: 'waffle-sicilian-pistachio',
    name: 'Sicilian Pistachio Praline Waffle',
    category: 'waffle',
    price: 349,
    rating: 5.0,
    reviewsCount: 312,
    badge: '⭐ Bronte Pistachio',
    image: 'assets/images/waffle-liege.jpg',
    tastingNotes: 'Roasted Bronte pistachios · White chocolate cream · Emerald praline crunch',
    description: 'Warm caramelized Liège waffle smothered in silky roasted Bronte pistachio spread, crushed caramelized pistachios, white chocolate ganache drizzle, and Sicilian pistachio gelato.',
    dietary: ['Vegetarian', 'Warm Baked'],
    nutrition: { calories: '380 kcal', fat: '20g', sugar: '24g', protein: '9g' }
  },
  {
    id: 'waffle-wild-strawberry',
    name: 'Wild Strawberry Short-Waffle',
    category: 'waffle',
    price: 299,
    rating: 4.9,
    reviewsCount: 278,
    badge: '🍓 Alpine Berries',
    image: 'assets/images/waffle-bubble.jpg',
    tastingNotes: 'Macerated wild strawberries · Whipped chantilly · Strawberry bliss scoop',
    description: 'Crisp golden waffle layered with fresh macerated alpine strawberries, whipped Tahitian vanilla chantilly cream, pure berry coulis, and our Strawberry Bliss artisan gelato.',
    dietary: ['Vegetarian', 'Warm Baked'],
    nutrition: { calories: '310 kcal', fat: '14g', sugar: '23g', protein: '5g' }
  },
  {
    id: 'waffle-butterscotch-toffee',
    name: 'Salted Butterscotch Toffee Waffle',
    category: 'waffle',
    price: 319,
    rating: 4.9,
    reviewsCount: 264,
    badge: '🔥 Fleur De Sel',
    image: 'assets/images/waffle-chocolate.jpg',
    tastingNotes: 'Kettle-cooked butterscotch · Smoked sea salt · Toasted Georgia pecans',
    description: 'Hot caramelized waffle blanketed in copper kettle-cooked salted butterscotch, smoked sea salt flakes, toasted buttered pecans, and sweet Tahitian vanilla bean gelato.',
    dietary: ['Vegetarian', 'Warm Baked'],
    nutrition: { calories: '390 kcal', fat: '19g', sugar: '27g', protein: '6g' }
  }
];

class ShopManager {
  constructor() {
    this.products = PRODUCTS_DATA;
    this.activeFilter = 'all';
    this.activeSort = 'popular';
    this.wishlistKey = 'melt_scoop_wishlist';
    this.wishlist = this.loadWishlist();

    this.bestsellersGrid = document.getElementById('bestsellersGrid');
    this.quickViewModal = document.getElementById('quickViewModal');
    this.sortSelect = document.getElementById('shopSortSelect');

    this.init();
  }

  syncProductsFromDom() {
    if (!this.bestsellersGrid) return;
    const cards = this.bestsellersGrid.querySelectorAll('.product-card');
    if (!cards || cards.length === 0) return;

    const domProducts = [];
    cards.forEach(card => {
      const id = card.id ? card.id.replace('card-', '') : ('prod-' + Math.random().toString(36).substr(2, 6));
      const name = card.querySelector('.product-title')?.textContent?.trim() || 'Artisanal Scoop';
      const priceText = card.querySelector('.product-price')?.textContent || '219';
      const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 219;
      const img = card.querySelector('.product-image');
      const image = img ? (img.getAttribute('src') || img.src) : 'assets/images/vanilla.png';
      const tastingNotes = card.querySelector('.product-tasting-notes')?.textContent?.trim() || '';
      const badge = card.querySelector('.badge-signature-tag, .product-cat-tag, .badge')?.textContent?.trim() || '✨ Artisanal';
      const category = card.getAttribute('data-category') || 'all';

      const existing = this.products.find(p => p.id === id);
      domProducts.push({
        id,
        name,
        price,
        rating: existing ? existing.rating : 5.0,
        reviewsCount: existing ? existing.reviewsCount : 250,
        badge,
        image,
        tastingNotes,
        description: existing ? existing.description : (tastingNotes || name),
        category: existing ? existing.category : category,
        dietary: existing ? existing.dietary : ['Vegetarian'],
        nutrition: existing ? existing.nutrition : { calories: '220 kcal', fat: '12g', sugar: '18g', protein: '4g' }
      });
    });

    if (domProducts.length > 0) {
      const waffles = this.products.filter(p => p.category === 'waffle');
      this.products = [...domProducts, ...waffles.filter(w => !domProducts.some(d => d.id === w.id))];
    }
  }

  init() {
    this.syncProductsFromDom();
    // Do not wipe out bestsellersGrid if it already has products from index.html!
    if (!this.bestsellersGrid || this.bestsellersGrid.children.length === 0) {
      this.renderBestsellers();
    }
    this.attachFilterTabs();
    this.attachSortEvents();
    this.attachFlavorBubbleLinks();
    this.attachSearchEvents();
  }

  loadWishlist() {
    try {
      const raw = localStorage.getItem(this.wishlistKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist));
  }

  toggleWishlist(productId, btnEl) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      if (btnEl) {
        btnEl.classList.remove('heart-active');
        btnEl.innerHTML = '♡';
      }
      if (window.showToast) window.showToast('Removed from favorites', 'heart');
    } else {
      this.wishlist.push(productId);
      if (btnEl) {
        btnEl.classList.add('heart-active');
        btnEl.innerHTML = '♥';
      }
      if (window.showToast) window.showToast('Saved to your sweet wishlist! ❤️', 'heart');
    }
    this.saveWishlist();
  }

  attachFilterTabs() {
    const tabs = document.querySelectorAll('.shop-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeFilter = filter;
        this.renderBestsellers();
      });
    });
  }

  attachSortEvents() {
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.renderBestsellers();
      });
    }
  }

  getFilteredAndSortedProducts() {
    let items = [...this.products];

    if (this.activeFilter === 'waffle') {
      items = items.filter(p => p.category === 'waffle');
    } else if (this.activeFilter !== 'all') {
      items = items.filter(p => p.category === this.activeFilter);
    } else {
      // By default in scoops bestsellers, show artisan scoops
      items = items.filter(p => p.category !== 'waffle');
    }

    // Sort items
    if (this.activeSort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (this.activeSort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (this.activeSort === 'newest') {
      items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // Default: popular (weighted by rating and reviews)
      items.sort((a, b) => (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount));
    }

    return items;
  }

  renderBestsellers() {
    if (!this.bestsellersGrid) return;

    const items = this.getFilteredAndSortedProducts();

    if (items.length === 0) {
      this.bestsellersGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 40px;">
          <p style="font-size:1.1rem; color:var(--text-muted);">No flavors found for this craving. Try another category!</p>
          <button class="btn btn-secondary" style="margin-top:16px;" onclick="window.ShopInstance.setCategory('all')">View All Flavors</button>
        </div>
      `;
      return;
    }

    this.bestsellersGrid.innerHTML = items.map((product, idx) => {
      const isWishlisted = this.wishlist.includes(product.id);
      const staggerIndex = (idx % 4) + 1;
      return `
        <div class="product-card reveal-slide-up stagger-${staggerIndex}" id="card-${product.id}">
          <button class="product-wishlist-btn ${isWishlisted ? 'heart-active' : ''}" 
                  onclick="window.ShopInstance.toggleWishlist('${product.id}', this)" 
                  title="Save to favorites" aria-label="Save to favorites">
            ${isWishlisted ? '♥' : '♡'}
          </button>

          <div class="product-image-container" onclick="window.ShopInstance.openQuickView('${product.id}')" style="cursor:pointer;" title="Click to view details">
            <img src="${product.image}" alt="${product.name}" class="product-image" id="img-${product.id}">
          </div>

          <div class="product-card-body">
            <div class="product-badge-row">
              <span class="badge-signature-tag">${product.badge || '✨ Artisanal'}</span>
            </div>

            <div class="product-header-row">
              <h3 class="product-title" onclick="window.ShopInstance.openQuickView('${product.id}')" style="cursor:pointer;">${product.name}</h3>
              <div class="product-rating">★ ${product.rating.toFixed(1)}</div>
            </div>

            <p class="product-tasting-notes">${product.tastingNotes}</p>

            <div class="product-card-footer">
              <div class="product-price">₹${product.price}</div>
              <div class="product-card-actions">
                <div class="qty-stepper" id="stepper-${product.id}">
                  <button class="qty-btn" onclick="window.ShopInstance.stepCardQty('${product.id}', -1)" aria-label="Decrease quantity">−</button>
                  <span class="qty-number" id="qty-val-${product.id}">1</span>
                  <button class="qty-btn" onclick="window.ShopInstance.stepCardQty('${product.id}', 1)" aria-label="Increase quantity">+</button>
                </div>
                <button class="btn btn-dark btn-card-add" onclick="window.ShopInstance.addCardToCart('${product.id}')">
                  ADD +
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.observeNewElements) {
      window.observeNewElements(this.bestsellersGrid);
    }
  }

  setCategory(flavorTag) {
    this.activeFilter = flavorTag;
    const tabs = document.querySelectorAll('.shop-tab');
    tabs.forEach(t => {
      if (t.getAttribute('data-filter') === flavorTag) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    this.renderBestsellers();
  }

  stepCardQty(productId, delta) {
    const qtyEl = document.getElementById(`qty-val-${productId}`);
    if (!qtyEl) return;
    let val = parseInt(qtyEl.textContent) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > 15) val = 15;
    qtyEl.textContent = val;
  }

  addCardToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const qtyEl = document.getElementById(`qty-val-${productId}`);
    const qty = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;
    const imgEl = document.getElementById(`img-${productId}`);

    if (window.Cart) {
      window.Cart.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        subtext: 'Single Tub Pint'
      }, qty, imgEl);
    }
  }

  attachFlavorBubbleLinks() {
    document.querySelectorAll('.flavor-bubble-card').forEach(bubble => {
      bubble.addEventListener('click', () => {
        const flavor = bubble.getAttribute('data-flavor');
        const bestsellersSec = document.getElementById('bestsellersSection');
        if (bestsellersSec) {
          bestsellersSec.scrollIntoView({ behavior: 'smooth' });
          this.setCategory(flavor);
          if (window.showToast) {
            window.showToast(`Showing our best ${flavor} scoops! 🍦`);
          }
        }
      });
    });
  }

  openQuickView(productId) {
    const p = this.products.find(item => item.id === productId);
    if (!p || !this.quickViewModal) return;

    const contentEl = document.getElementById('quickViewContent');
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="quick-view-grid">
          <div class="quick-view-img-wrap">
            <img src="${p.image}" alt="${p.name}" class="quick-view-img">
          </div>
          <div class="quick-view-info">
            <div class="badge badge-pink" style="margin-bottom:10px;">${p.badge || '✨ Artisanal Scoop'}</div>
            <h2 class="quick-view-title">${p.name}</h2>
            <div class="quick-view-rating-row">
              <span style="color:#F59E0B;">★★★★★</span>
              <span>${p.rating}</span>
              <span style="color:var(--text-muted);">(${p.reviewsCount} customer reviews)</span>
            </div>
            <p class="quick-view-desc">${p.description}</p>
            
            <div class="quick-view-dietary-row">
              ${p.dietary.map(d => `<span class="quick-view-diet-pill">${d}</span>`).join('')}
            </div>

            <div class="quick-view-nutrition">
              <div class="quick-nutri-item"><strong>Calories:</strong> <span>${p.nutrition.calories}</span></div>
              <div class="quick-nutri-item"><strong>Fat:</strong> <span>${p.nutrition.fat}</span></div>
              <div class="quick-nutri-item"><strong>Sugar:</strong> <span>${p.nutrition.sugar}</span></div>
              <div class="quick-nutri-item"><strong>Protein:</strong> <span>${p.nutrition.protein}</span></div>
            </div>

            <div class="quick-view-footer">
              <div class="quick-view-price">₹${p.price}</div>
              <button class="btn btn-primary" onclick="window.ShopInstance.addCardToCart('${p.id}'); window.ShopInstance.closeQuickView();">
                Add to Cart 🛒
              </button>
            </div>
          </div>
        </div>
      `;
    }

    this.quickViewModal.classList.add('open');
  }

  closeQuickView() {
    if (this.quickViewModal) {
      this.quickViewModal.classList.remove('open');
    }
  }

  attachSearchEvents() {
    const searchTrigger = document.getElementById('headerSearchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const closeSearch = document.getElementById('closeSearchBtn');

    if (searchTrigger && searchModal) {
      searchTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('open');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 150);
        }
      });
    }

    if (closeSearch && searchModal) {
      closeSearch.addEventListener('click', () => {
        searchModal.classList.remove('open');
      });
    }

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          searchResults.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px;">Search by flavor (e.g. Pistachio, Chocolate, Strawberry)...</p>';
          return;
        }

        const matches = this.products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.tastingNotes.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          searchResults.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px;">No scoops match your craving. Try another word!</p>';
          return;
        }

        searchResults.innerHTML = matches.map(p => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-subtle);">
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="${p.image}" alt="${p.name}" style="width:48px; height:48px; object-fit:contain;">
              <div>
                <div style="font-weight:800; font-size:0.95rem;">${p.name}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">₹${p.price} · ${p.tastingNotes}</div>
              </div>
            </div>
            <button class="btn btn-primary" style="padding:8px 16px; font-size:0.8rem;" onclick="window.ShopInstance.addCardToCart('${p.id}'); searchModal.classList.remove('open');">
              + ADD
            </button>
          </div>
        `).join('');
      });
    }
  }
}

// ============================================================================
// CUSTOM WAFFLE PAIRING BUILDER
// ============================================================================
function initWaffleCustomizer() {
  const baseRadios = document.querySelectorAll('input[name="waffleBase"]');
  const scoopRadios = document.querySelectorAll('input[name="waffleScoop"]');
  const drizzleRadios = document.querySelectorAll('input[name="waffleDrizzle"]');
  const priceDisplay = document.getElementById('waffleCustomPrice');
  const summaryDisplay = document.getElementById('waffleCustomSummary');
  const addBtn = document.getElementById('addCustomWaffleBtn');

  if (!baseRadios.length) return;

  function calculateCustomWaffle() {
    let basePrice = 249;
    let baseName = 'Belgian Liège';
    baseRadios.forEach(r => {
      if (r.checked) {
        basePrice = parseInt(r.dataset.price) || 249;
        baseName = r.dataset.name || 'Belgian Liège';
      }
    });

    let scoopPrice = 0;
    let scoopName = 'Tahitian Vanilla Bean';
    scoopRadios.forEach(r => {
      if (r.checked) {
        scoopPrice = parseInt(r.dataset.extra) || 0;
        scoopName = r.dataset.name || 'Tahitian Vanilla Bean';
      }
    });

    let drizzlePrice = 0;
    let drizzleName = 'Molten Valrhona Fudge';
    drizzleRadios.forEach(r => {
      if (r.checked) {
        drizzlePrice = parseInt(r.dataset.extra) || 0;
        drizzleName = r.dataset.name || 'Molten Valrhona Fudge';
      }
    });

    const total = basePrice + scoopPrice + drizzlePrice;
    if (priceDisplay) priceDisplay.textContent = `₹${total}`;
    if (summaryDisplay) {
      summaryDisplay.textContent = `${baseName} Waffle + ${scoopName} Scoop + ${drizzleName}`;
    }

    return { total, baseName, scoopName, drizzleName };
  }

  [...baseRadios, ...scoopRadios, ...drizzleRadios].forEach(input => {
    input.addEventListener('change', calculateCustomWaffle);
  });

  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const config = calculateCustomWaffle();
      if (window.Cart) {
        window.Cart.addItem({
          id: `custom-waffle-${Date.now()}`,
          name: `Custom ${config.baseName} Waffle`,
          price: config.total,
          image: 'assets/images/waffle-liege.jpg',
          category: 'Waffle House',
          subtext: `${config.scoopName} Scoop & ${config.drizzleName}`
        }, 1, addBtn);
        if (window.showToast) {
          window.showToast(`✨ Custom ${config.baseName} Waffle added to your cart! 🧇`);
        }
      }
    });
  }

  calculateCustomWaffle();
}

window.initWaffleCustomizer = initWaffleCustomizer;
window.ShopManager = ShopManager;

document.addEventListener('DOMContentLoaded', () => {
  initWaffleCustomizer();
});
