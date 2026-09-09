/* Melt & Scoop™ - Cart & Checkout Controller */

class CartManager {
  constructor() {
    this.storageKey = 'melt_scoop_cart_v1';
    this.items = [];
    this.promoCode = null;
    this.discountPercent = 0;
    this.freeShippingThreshold = 699;
    this.baseShipping = 80;

    this.cartDrawer = document.getElementById('cartDrawer');
    this.cartBackdrop = document.getElementById('cartBackdrop');
    this.cartCountBadges = document.querySelectorAll('.cart-count');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.subtotalEl = document.getElementById('cartSubtotal');
    this.discountRow = document.getElementById('cartDiscountRow');
    this.discountValEl = document.getElementById('cartDiscountVal');
    this.shippingEl = document.getElementById('cartShipping');
    this.totalEl = document.getElementById('cartTotal');
    this.freeShippingText = document.getElementById('freeShippingText');
    this.freeShippingFill = document.getElementById('freeShippingFill');

    this.init();
  }

  init() {
    this.loadState();
    this.attachEvents();
    this.render();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.items = parsed.items || [];
        this.promoCode = parsed.promoCode || null;
        this.discountPercent = parsed.discountPercent || 0;
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      items: this.items,
      promoCode: this.promoCode,
      discountPercent: this.discountPercent
    }));
  }

  attachEvents() {
    // Open cart drawer triggers
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    });

    // Close cart drawer triggers
    const closeBtn = document.getElementById('closeCartBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeCart());
    if (this.cartBackdrop) this.cartBackdrop.addEventListener('click', () => this.closeCart());

    // Promo code apply
    const promoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoCodeInput');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        this.applyPromo(promoInput.value.trim());
      });
    }

    // Checkout modal triggers
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          if (window.showToast) window.showToast('Your cart is empty! Pick some delicious scoops first 🍦');
          return;
        }
        this.closeCart();
        this.openCheckoutModal();
      });
    }

    // Checkout Form Submit
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processCheckout();
      });
    }
  }

  openCart() {
    if (this.cartDrawer && this.cartBackdrop) {
      this.cartDrawer.classList.add('open');
      this.cartBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCart() {
    if (this.cartDrawer && this.cartBackdrop) {
      this.cartDrawer.classList.remove('open');
      this.cartBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  addItem(product, quantity = 1, sourceElement = null) {
    const existingIndex = this.items.findIndex(item => item.id === product.id && !item.customBox);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || 'Scoops',
        subtext: product.subtext || '',
        quantity: quantity,
        customBox: product.customBox || null
      });
    }

    this.saveState();
    this.render();

    // Trigger Fly to Cart Animation
    if (sourceElement) {
      this.flyToCart(sourceElement, product.image);
    } else {
      this.animateCartBadge();
    }

    if (window.showToast) {
      window.showToast(`Added ${product.name} to your cart! 🍦`, 'check');
    }
  }

  updateQuantity(itemId, delta) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    this.saveState();
    this.render();
  }

  removeItem(itemId) {
    this.items = this.items.filter(i => i.id !== itemId);
    this.saveState();
    this.render();
    if (window.showToast) {
      window.showToast('Item removed from cart', 'trash');
    }
  }

  applyPromo(code) {
    const upper = code.toUpperCase();
    if (upper === 'SWEET20') {
      this.promoCode = upper;
      this.discountPercent = 20;
      this.saveState();
      this.render();
      if (window.showToast) window.showToast('Promo code SWEET20 applied: 20% OFF! 🎉');
      if (window.triggerConfetti) window.triggerConfetti();
    } else if (upper === 'SWEET10') {
      this.promoCode = upper;
      this.discountPercent = 10;
      this.saveState();
      this.render();
      if (window.showToast) window.showToast('Promo code SWEET10 applied: 10% OFF! 🍦');
    } else {
      if (window.showToast) window.showToast('Invalid promo code. Try SWEET20! 🍧');
    }
  }

  flyToCart(sourceEl, imageUrl) {
    const targetEl = document.getElementById('headerCartBtn');
    if (!targetEl || !sourceEl) {
      this.animateCartBadge();
      return;
    }

    const srcRect = sourceEl.getBoundingClientRect();
    const tgtRect = targetEl.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'flying-scoop';
    flyer.style.backgroundImage = `url(${imageUrl})`;
    flyer.style.left = (srcRect.left + srcRect.width / 2 - 25) + 'px';
    flyer.style.top = (srcRect.top + srcRect.height / 2 - 25) + 'px';
    document.body.appendChild(flyer);

    // Force layout
    flyer.getBoundingClientRect();

    // Animate to target
    const targetX = tgtRect.left + tgtRect.width / 2 - 25;
    const targetY = tgtRect.top + tgtRect.height / 2 - 25;

    flyer.style.transform = `translate3d(${targetX - (srcRect.left + srcRect.width / 2 - 25)}px, ${targetY - (srcRect.top + srcRect.height / 2 - 25)}px, 0) scale(0.35) rotate(720deg)`;
    flyer.style.opacity = '0.9';

    setTimeout(() => {
      flyer.remove();
      this.animateCartBadge();
    }, 750);
  }

  animateCartBadge() {
    this.cartCountBadges.forEach(badge => {
      badge.classList.remove('badge-pop');
      void badge.offsetWidth;
      badge.classList.add('badge-pop');
    });
  }

  render() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountBadges.forEach(b => b.textContent = totalCount);

    if (!this.cartItemsList) return;

    if (this.items.length === 0) {
      this.cartItemsList.innerHTML = `
        <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 3.5rem; margin-bottom: 16px;">🍦</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: var(--text-main);">Your Cart is Empty</h3>
          <p style="font-size: 0.9rem; margin-bottom: 24px;">Your cart deserves something sweet and creamy.</p>
          <a href="#shopFlavors" class="btn btn-primary" onclick="window.Cart.closeCart()">Shop Flavors →</a>
        </div>
      `;
      if (this.subtotalEl) this.subtotalEl.textContent = '₹0';
      if (this.totalEl) this.totalEl.textContent = '₹0';
      if (this.shippingEl) this.shippingEl.textContent = '₹0';
      if (this.discountRow) this.discountRow.style.display = 'none';
      if (this.freeShippingText) this.freeShippingText.textContent = 'Add ₹699 for FREE Sub-Zero Delivery!';
      if (this.freeShippingFill) this.freeShippingFill.style.width = '0%';
      return;
    }

    let subtotal = 0;
    this.cartItemsList.innerHTML = this.items.map(item => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;

      let customFlavorsHTML = '';
      if (item.customBox && item.customBox.length) {
        customFlavorsHTML = `
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
            ${item.customBox.map(f => `<span style="font-size:0.75rem; background:#FFFFFF; border:1px solid #E6D7C9; padding:2px 6px; border-radius:12px;">${f.emoji} ${f.name} (x${f.count})</span>`).join('')}
          </div>
        `;
      }

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            ${item.subtext ? `<div class="cart-item-subtext">${item.subtext}</div>` : ''}
            ${customFlavorsHTML}
            <div style="display:flex; align-items:center; justify-content:space-between; margin-top:8px;">
              <span class="cart-item-price">₹${item.price}</span>
              <div class="qty-stepper" style="padding: 2px;">
                <button class="qty-btn" onclick="window.Cart.updateQuantity('${item.id}', -1)">−</button>
                <span class="qty-number" style="min-width: 20px;">${item.quantity}</span>
                <button class="qty-btn" onclick="window.Cart.updateQuantity('${item.id}', 1)">+</button>
              </div>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.Cart.removeItem('${item.id}')" title="Remove item">✕</button>
        </div>
      `;
    }).join('');

    // Calculations
    const discountAmount = Math.round((subtotal * this.discountPercent) / 100);
    const isFreeShipping = subtotal >= this.freeShippingThreshold;
    const shipping = isFreeShipping ? 0 : this.baseShipping;
    const grandTotal = subtotal - discountAmount + shipping;

    if (this.subtotalEl) this.subtotalEl.textContent = `₹${subtotal}`;
    if (this.discountRow) {
      if (this.discountPercent > 0) {
        this.discountRow.style.display = 'flex';
        this.discountValEl.textContent = `-₹${discountAmount} (${this.discountPercent}% OFF)`;
      } else {
        this.discountRow.style.display = 'none';
      }
    }
    if (this.shippingEl) this.shippingEl.textContent = isFreeShipping ? 'FREE' : `₹${shipping}`;
    if (this.totalEl) this.totalEl.textContent = `₹${grandTotal}`;

    // Free delivery progress bar
    if (this.freeShippingText && this.freeShippingFill) {
      if (isFreeShipping) {
        this.freeShippingText.innerHTML = '🎉 You unlocked <strong>FREE Sub-Zero Dry Ice Delivery</strong>!';
        this.freeShippingFill.style.width = '100%';
        this.freeShippingFill.style.backgroundColor = '#10B981';
      } else {
        const remaining = this.freeShippingThreshold - subtotal;
        const pct = Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));
        this.freeShippingText.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE Sub-Zero Delivery</strong>!`;
        this.freeShippingFill.style.width = `${pct}%`;
        this.freeShippingFill.style.backgroundColor = 'var(--brand-pink)';
      }
    }
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
      modal.classList.add('open');
      const orderSummaryEl = document.getElementById('checkoutSummaryTotal');
      if (orderSummaryEl && this.totalEl) {
        orderSummaryEl.textContent = this.totalEl.textContent;
      }
    }
  }

  processCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    const successView = document.getElementById('checkoutSuccessView');
    const formView = document.getElementById('checkoutFormView');

    if (formView && successView) {
      formView.style.display = 'none';
      successView.style.display = 'block';

      // Generate random order ID
      const orderIdEl = document.getElementById('orderConfirmationId');
      if (orderIdEl) {
        orderIdEl.textContent = '#MS-' + Math.floor(100000 + Math.random() * 900000);
      }

      // Trigger celebration
      if (window.triggerConfetti) {
        window.triggerConfetti();
      }

      // Empty cart
      this.items = [];
      this.promoCode = null;
      this.discountPercent = 0;
      this.saveState();
      this.render();
    }
  }
}

window.CartManager = CartManager;
