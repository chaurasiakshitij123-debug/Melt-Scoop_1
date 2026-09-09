/* Melt & Scoop™ - Shop Catalog & Product Controller */

const PRODUCTS_DATA = [
  // --- 1. VANILLA CATEGORY (4 Products) ---
  {
    id: 'prod-van-tahitian',
    name: 'Tahitian Vanilla Bean',
    category: 'Vanilla',
    flavorTag: 'vanilla',
    price: 189,
    rating: 4.9,
    reviewsCount: 310,
    isNew: false,
    image: 'assets/images/vanilla.png',
    tastingNotes: 'Floral orchid vanilla · Golden sweet butter · Real bean specks',
    description: 'Our signature staple. Churned with real Madagascar and Tahitian vanilla bean caviar and unpasteurized organic sweet cream.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '220 kcal', fat: '12g', sugar: '17g', protein: '4g' }
  },
  {
    id: 'prod-van-honeycomb',
    name: 'Madagascar Honeycomb Crunch',
    category: 'Vanilla',
    flavorTag: 'vanilla',
    price: 219,
    rating: 4.9,
    reviewsCount: 195,
    isNew: true,
    image: 'assets/images/vanilla.png',
    tastingNotes: 'Wildflower honey toffee · Crunchy honeycomb · Creamy vanilla',
    description: 'Golden honeycomb sponge toffee folded generously into double-fold Bourbon vanilla bean cream.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '235 kcal', fat: '13g', sugar: '21g', protein: '4g' }
  },
  {
    id: 'prod-van-bourbon',
    name: 'Smoked Bourbon Vanilla',
    category: 'Vanilla',
    flavorTag: 'vanilla',
    price: 239,
    rating: 4.8,
    reviewsCount: 142,
    isNew: false,
    image: 'assets/images/vanilla.png',
    tastingNotes: 'Charred oak essence · Kentucky bourbon aroma · Velvety cream',
    description: 'Aged Kentucky bourbon extract with a hint of toasted French oak smoked cream and real vanilla bean.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '230 kcal', fat: '12g', sugar: '18g', protein: '4g' }
  },
  {
    id: 'prod-van-chai',
    name: 'Cardamom Spiced Vanilla Silk',
    category: 'Vanilla',
    flavorTag: 'vanilla',
    price: 209,
    rating: 4.9,
    reviewsCount: 118,
    isNew: true,
    image: 'assets/images/vanilla.png',
    tastingNotes: 'Green cardamom pods · Cinnamon bark hint · Silky vanilla whole milk',
    description: 'Whole green cardamom seeds crushed and slow-steeped in whole cream, accented with pure Tahitian vanilla pods.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '215 kcal', fat: '11g', sugar: '16g', protein: '4g' }
  },

  // --- 2. STRAWBERRY CATEGORY (4 Products) ---
  {
    id: 'prod-straw-bliss',
    name: 'Strawberry Bliss',
    category: 'Strawberry',
    flavorTag: 'strawberry',
    price: 199,
    rating: 5.0,
    reviewsCount: 280,
    isNew: false,
    image: 'assets/images/strawberry.png',
    tastingNotes: 'Fresh alpine strawberry · Sweet cream · Real berry ribbons',
    description: 'Bursting with hand-picked alpine strawberries folded into freshly churned whole cream, with sweet glazed berry chunks in every spoonful.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '210 kcal', fat: '11g', sugar: '18g', protein: '4g' }
  },
  {
    id: 'prod-straw-balsamic',
    name: 'Roasted Strawberry Balsamic',
    category: 'Strawberry',
    flavorTag: 'strawberry',
    price: 239,
    rating: 4.9,
    reviewsCount: 164,
    isNew: false,
    image: 'assets/images/strawberry.png',
    tastingNotes: 'Slow-roasted berries · 12-year Modena balsamic drizzle · Black pepper hint',
    description: 'Oven-roasted ripe strawberries glazed with aged Italian balsamic vinegar to create a rich sweet-tart gourmet masterpiece.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '205 kcal', fat: '10g', sugar: '19g', protein: '3g' }
  },
  {
    id: 'prod-straw-cheesecake',
    name: 'Wild Strawberry Cheesecake',
    category: 'Strawberry',
    flavorTag: 'strawberry',
    price: 249,
    rating: 4.9,
    reviewsCount: 220,
    isNew: true,
    image: 'assets/images/strawberry.png',
    tastingNotes: 'Graham crust crunch · Tangy mascarpone cream · Wild berry compote',
    description: 'Rich cultured cream cheese and mascarpone gelato laced with wild strawberry compote and buttery graham crumble.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '255 kcal', fat: '14g', sugar: '20g', protein: '5g' }
  },
  {
    id: 'prod-straw-sorbet',
    name: 'Strawberry Hibiscus Rose Sorbet',
    category: 'Strawberry',
    flavorTag: 'strawberry',
    price: 199,
    rating: 4.8,
    reviewsCount: 135,
    isNew: true,
    image: 'assets/images/strawberry.png',
    tastingNotes: 'Red hibiscus brew · Hand-mashed berries · Delicate rose finish',
    description: 'A dairy-free, vibrant crimson sorbet brewed from Egyptian red hibiscus petals and fresh crushed strawberries.',
    dietary: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
    nutrition: { calories: '160 kcal', fat: '0.2g', sugar: '21g', protein: '1g' }
  },

  // --- 3. CHOCOLATE CATEGORY (4 Products) ---
  {
    id: 'prod-choc-truffle',
    name: 'Belgian Dark Truffle',
    category: 'Chocolate',
    flavorTag: 'chocolate',
    price: 249,
    rating: 5.0,
    reviewsCount: 340,
    isNew: false,
    image: 'assets/images/chocolate.png',
    tastingNotes: 'Decadent 70% dark cocoa · Chocolate shavings · Molten ganache fudge',
    description: 'An unapologetically intense dark chocolate experience crafted with single-origin Callebaut Belgian cocoa and ribbons of molten ganache.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '260 kcal', fat: '15g', sugar: '19g', protein: '5g' }
  },
  {
    id: 'prod-choc-caramel',
    name: 'Salted Caramel Cocoa Fudge',
    category: 'Chocolate',
    flavorTag: 'chocolate',
    price: 259,
    rating: 4.9,
    reviewsCount: 275,
    isNew: false,
    image: 'assets/images/chocolate.png',
    tastingNotes: 'Fleur de sel caramel · Dutch processed chocolate · Molten fudge swirl',
    description: 'Buttery sea-salt caramel sauce swirled into dark Dutch cocoa ice cream with chewy dark chocolate fudge clusters.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '270 kcal', fat: '16g', sugar: '22g', protein: '5g' }
  },
  {
    id: 'prod-choc-brownie',
    name: 'Midnight Cocoa Brownie Chunk',
    category: 'Chocolate',
    flavorTag: 'chocolate',
    price: 269,
    rating: 4.9,
    reviewsCount: 210,
    isNew: true,
    image: 'assets/images/chocolate.png',
    tastingNotes: '80% Valrhona black cocoa · Fudgy baked brownie squares · Dark chocolate chunks',
    description: 'Deep, bittersweet midnight black cocoa gelato packed with house-baked dark fudge brownie bites.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '280 kcal', fat: '17g', sugar: '23g', protein: '6g' }
  },
  {
    id: 'prod-choc-gianduja',
    name: 'Roasted Hazelnut Gianduja',
    category: 'Chocolate',
    flavorTag: 'chocolate',
    price: 259,
    rating: 4.8,
    reviewsCount: 188,
    isNew: false,
    image: 'assets/images/chocolate.png',
    tastingNotes: 'Piedmont roasted hazelnuts · Milk chocolate cream · Praline crunch',
    description: 'Authentic Italian Gianduja pairing stone-ground Piedmontese hazelnut paste with silky Swiss milk chocolate.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '265 kcal', fat: '16g', sugar: '20g', protein: '5g' }
  },

  // --- 4. PISTACHIO CATEGORY (4 Products) ---
  {
    id: 'prod-pist-sicilian',
    name: 'Sicilian Pistachio Crunch',
    category: 'Pistachio',
    flavorTag: 'pistachio',
    price: 269,
    rating: 5.0,
    reviewsCount: 290,
    isNew: false,
    image: 'assets/images/pistachio.png',
    tastingNotes: 'Roasted Bronte pistachios · Sea salt cream · Velvety gelato',
    description: 'Authentic Sicilian gelato made from roasted emerald Bronte pistachios, folded into rich grass-fed cream with roasted nutty bits.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '240 kcal', fat: '14g', sugar: '16g', protein: '6g' }
  },
  {
    id: 'prod-pist-kulfi',
    name: 'Rosewater Pistachio Kulfi',
    category: 'Pistachio',
    flavorTag: 'pistachio',
    price: 249,
    rating: 4.9,
    reviewsCount: 172,
    isNew: true,
    image: 'assets/images/pistachio.png',
    tastingNotes: 'Damascus rosewater · Crushed green pistachios · Saffron milk reduction',
    description: 'Traditional slow-simmered rabri kulfi modernized into gelato, with pure saffron strands and rosewater.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '230 kcal', fat: '13g', sugar: '18g', protein: '5g' }
  },
  {
    id: 'prod-pist-whitechoc',
    name: 'White Chocolate Pistachio Cloud',
    category: 'Pistachio',
    flavorTag: 'pistachio',
    price: 259,
    rating: 4.8,
    reviewsCount: 145,
    isNew: false,
    image: 'assets/images/pistachio.png',
    tastingNotes: 'Ivory cocoa butter · Roasted pistachio swirl · Creamy sweetness',
    description: 'Melted Belgian white chocolate folded into pistachio butter with fine crushed pistachio praline.',
    dietary: ['Vegetarian'],
    nutrition: { calories: '255 kcal', fat: '15g', sugar: '20g', protein: '5g' }
  },
  {
    id: 'prod-pist-praline',
    name: 'Salted Pistachio Praline Gelato',
    category: 'Pistachio',
    flavorTag: 'pistachio',
    price: 269,
    rating: 4.9,
    reviewsCount: 198,
    isNew: true,
    image: 'assets/images/pistachio.png',
    tastingNotes: 'Crunchy pistachio brittle · Maldon sea salt · Dark caramel swirls',
    description: 'Crushed pistachio praline brittle tossed in caramel ripples through rich roasted pistachio cream.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '250 kcal', fat: '15g', sugar: '19g', protein: '6g' }
  },

  // --- 5. MANGO CATEGORY (4 Products) ---
  {
    id: 'prod-mango-velvet',
    name: 'Alphonso Mango Velvet',
    category: 'Mango',
    flavorTag: 'mango',
    price: 219,
    rating: 4.9,
    reviewsCount: 260,
    isNew: false,
    image: 'assets/images/mango.png',
    tastingNotes: 'Ratnagiri Alphonso pulp · Silky sorbet · Sun-drenched nectar',
    description: '100% pure Ratnagiri Alphonso mangoes turned into a refreshing, silky dairy-free sorbet. Like biting into a chilled, ripe summer mango.',
    dietary: ['Dairy-Free', 'Vegan', 'Gluten-Free'],
    nutrition: { calories: '170 kcal', fat: '0.5g', sugar: '22g', protein: '1g' }
  },
  {
    id: 'prod-mango-chili',
    name: 'Spiced Alphonso Mango Chili',
    category: 'Mango',
    flavorTag: 'mango',
    price: 209,
    rating: 4.8,
    reviewsCount: 130,
    isNew: true,
    image: 'assets/images/mango.png',
    tastingNotes: 'Golden mango nectar · Kashmiri red chili sparkle · Fresh lime zest',
    description: 'Juicy mango sorbet with a lively touch of sun-dried Kashmiri chili flakes and freshly squeezed lime.',
    dietary: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
    nutrition: { calories: '165 kcal', fat: '0.3g', sugar: '21g', protein: '1g' }
  },
  {
    id: 'prod-mango-passion',
    name: 'Mango Passionfruit Swirl',
    category: 'Mango',
    flavorTag: 'mango',
    price: 229,
    rating: 4.9,
    reviewsCount: 185,
    isNew: false,
    image: 'assets/images/mango.png',
    tastingNotes: 'Tart yellow passionfruit · Sweet mango puree · Tropical sorbet twist',
    description: 'Tangy passionfruit coulis twisted through creamy Alphonso mango gelato for a sunny, refreshing tropical escape.',
    dietary: ['Dairy-Free', 'Vegan', 'Gluten-Free'],
    nutrition: { calories: '175 kcal', fat: '0.4g', sugar: '23g', protein: '1g' }
  },
  {
    id: 'prod-mango-cardamom',
    name: 'Alphonso Cream Cloud & Cardamom',
    category: 'Mango',
    flavorTag: 'mango',
    price: 239,
    rating: 5.0,
    reviewsCount: 215,
    isNew: true,
    image: 'assets/images/mango.png',
    tastingNotes: 'Sweet whole cream · Alphonso nectar glaze · Aromatic cardamom essence',
    description: 'The royal combination of sweet Ratnagiri mango puree gently churned into grass-fed double cream with green cardamom.',
    dietary: ['Gluten-Free', 'Vegetarian'],
    nutrition: { calories: '225 kcal', fat: '12g', sugar: '20g', protein: '4g' }
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

    // Filter by flavor tag
    if (this.activeFilter && this.activeFilter !== 'all') {
      items = items.filter(p => p.flavorTag === this.activeFilter);
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
              <span class="product-cat-tag">${product.category}</span>
              ${product.isNew ? '<span class="badge-new-tag">✨ New</span>' : ''}
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
            <div class="badge badge-pink" style="margin-bottom:10px;">${p.category}</div>
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
