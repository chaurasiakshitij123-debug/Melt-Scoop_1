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
    price: 249,
    rating: 4.9,
    reviewsCount: 220,
    badge: '✨ New',
    image: 'assets/images/strawberry.png',
    tastingNotes: 'Graham crust crunch · Tangy mascarpone cream · Wild berry compote',
    description: 'Rich cultured cream cheese and mascarpone gelato laced with wild strawberry compote and buttery graham crumble.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '255 kcal', fat: '14g', sugar: '20g', protein: '5g' }
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

  init() {
    this.renderBestsellers();
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

window.ShopManager = ShopManager;
