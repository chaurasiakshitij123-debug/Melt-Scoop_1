/* Melt & Scoop™ - Build Your Box Controller (18 Artisanal Flavors) */

const BOX_TIERS = {
  4: { count: 4, price: 549, name: '4 Scoops Petite Box' },
  6: { count: 6, price: 799, name: '6 Scoops Party Box' },
  8: { count: 8, price: 999, name: '8 Scoops Ultimate Box' }
};

const BOX_FLAVORS = [
  { id: 'box-straw', name: 'Strawberry Bliss', category: 'fruity', emoji: '🍓', color: '#FF5E7E', note: 'Mahabaleshwar hand-picked berries & sweet cream', badge: 'Bestseller' },
  { id: 'box-choc', name: 'Belgian Dark Truffle', category: 'chocolate', emoji: '🍫', color: '#48271F', note: '70% Callebaut dark chocolate & cocoa nibs', badge: 'Must Try' },
  { id: 'box-van', name: 'Madagascar Vanilla Bean', category: 'classics', emoji: '🍦', color: '#E5A823', note: 'Slow-cured bourbon vanilla bean caviar', badge: 'Classic' },
  { id: 'box-pist', name: 'Sicilian Pistachio Cream', category: 'nuts', emoji: '🌰', color: '#6E9E53', note: 'Bronte roasted emerald nut paste & fleur de sel', badge: "Chef's Pick" },
  { id: 'box-mang', name: 'Alphonso Golden Mango', category: 'fruity', emoji: '🥭', color: '#F59E0B', note: 'Pure Ratnagiri seasonal Alphonso nectar', badge: 'Seasonal' },
  { id: 'box-coff', name: 'Hazelnut Espresso Mocha', category: 'chocolate', emoji: '☕', color: '#764A38', note: 'Chikmagalur cold brew & roasted hazelnut crunch', badge: 'Rich' },
  { id: 'box-cherry', name: 'Wild Amarena Cherry', category: 'fruity', emoji: '🍒', color: '#B91C1C', note: 'Italian candied wild cherries & cream swirl', badge: 'Artisanal' },
  { id: 'box-caramel', name: 'Salted Butter Caramel', category: 'classics', emoji: '🍮', color: '#D97706', note: 'Slow-simmered caramel with Guerande fleur de sel', badge: 'Popular' },
  { id: 'box-cookies', name: 'Cookies & Sweet Cream', category: 'classics', emoji: '🍪', color: '#475569', note: 'Velvety cream with crumbled dark cocoa wafers', badge: 'Fan Fav' },
  { id: 'box-berry', name: 'Wild Blueberry Lavender', category: 'fruity', emoji: '🫐', color: '#6366F1', note: 'Himalayan wild berries & French culinary buds', badge: 'Floral' },
  { id: 'box-coconut', name: 'Toasted Coconut Malai', category: 'classics', emoji: '🥥', color: '#78716C', note: 'Tender coconut flesh with slow-toasted flakes', badge: 'Vegan' },
  { id: 'box-mint', name: 'Fresh Mint Dark Choc Chip', category: 'chocolate', emoji: '🌿', color: '#10B981', note: 'Garden peppermint with Belgian dark chocolate chips', badge: 'Crisp' },
  { id: 'box-honey', name: 'Honeycomb Almond Crunch', category: 'nuts', emoji: '🍯', color: '#FBBF24', note: 'Golden spun honeycomb toffee & roasted almonds', badge: 'Crunchy' },
  { id: 'box-matcha', name: 'Kyoto Ceremonial Matcha', category: 'nuts', emoji: '🍵', color: '#4D7C0F', note: 'Stoneground first-harvest Uji matcha green tea', badge: 'Imported' },
  { id: 'box-lemon', name: 'Amalfi Lemon Basil Sorbet', category: 'fruity', emoji: '🍋', color: '#EAB308', note: 'Zesty Italian sun-soaked lemons & sweet basil', badge: 'Sorbet' },
  { id: 'box-rose', name: 'Kashmiri Shahi Gulab', category: 'nuts', emoji: '🌹', color: '#E11D48', note: 'Damascus rose petals, saffron & pistachios', badge: 'Heritage' },
  { id: 'box-pb', name: 'Peanut Butter Fudge Swirl', category: 'chocolate', emoji: '🥜', color: '#92400E', note: 'Slow-roasted peanut butter & molten ganache', badge: 'Decadent' },
  { id: 'box-brownie', name: 'Fudge Brownie Batter', category: 'chocolate', emoji: '🧁', color: '#3E2723', note: 'Warm gooey homemade brownie bites folded in cream', badge: 'Indulgent' }
];

class BoxBuilder {
  constructor() {
    this.selectedTier = 6;
    this.selectedFlavors = []; // array of flavor objects in order
    this.flavorCounts = {};
    this.activeCategory = 'all';
    this.searchQuery = '';

    BOX_FLAVORS.forEach(f => {
      this.flavorCounts[f.id] = 0;
    });

    this.slotsContainer = document.getElementById('boxSlotsGrid');
    this.paletteContainer = document.getElementById('flavorPaletteGrid');
    this.summaryStatus = document.getElementById('boxSummaryStatus');
    this.summaryPrice = document.getElementById('boxSummaryPrice');
    this.summaryTitle = document.getElementById('boxSummaryTitle');
    this.trayCounter = document.getElementById('boxTrayCounter');
    this.addBoxBtn = document.getElementById('addBoxToCartBtn');
    this.tierButtons = document.querySelectorAll('.box-size-btn');
    this.catButtons = document.querySelectorAll('.box-cat-btn');
    this.searchInput = document.getElementById('boxFlavorSearch');

    this.init();
  }

  syncFlavorsFromDom() {
    if (!this.paletteContainer) return;
    const cards = this.paletteContainer.querySelectorAll('.flavor-pick-card');
    if (!cards || cards.length === 0) return;
    cards.forEach(card => {
      const id = card.id ? card.id.replace('flavor-card-', '') : '';
      const name = card.querySelector('.flavor-pick-name')?.textContent?.trim();
      const note = card.querySelector('.flavor-pick-note')?.textContent?.trim();
      const badge = card.querySelector('.flavor-pick-badge')?.textContent?.trim();
      if (id && name) {
        const f = BOX_FLAVORS.find(item => item.id === id);
        if (f) {
          f.name = name;
          if (note) f.note = note;
          if (badge) f.badge = badge;
        }
      }
    });
  }

  init() {
    if (!this.slotsContainer) return;

    this.syncFlavorsFromDom();

    // Attach Tier selection (4, 6, 8)
    this.tierButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const size = parseInt(btn.getAttribute('data-size'));
        if (size && size !== this.selectedTier) {
          this.setTier(size);
        }
      });
    });

    // Category Tabs
    if (this.catButtons.length) {
      this.catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.catButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeCategory = btn.getAttribute('data-cat') || 'all';
          this.renderPalette();
        });
      });
    }

    // Search Input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderPalette();
      });
    }

    // Add Box to Cart
    if (this.addBoxBtn) {
      this.addBoxBtn.addEventListener('click', () => {
        this.addBoxToCart();
      });
    }

    // Render initial
    this.renderPalette();
    this.renderSlots();
    this.updateSummary();
  }

  setTier(size) {
    this.selectedTier = size;
    // Trim flavors if current exceeds new size
    if (this.selectedFlavors.length > size) {
      const removed = this.selectedFlavors.slice(size);
      removed.forEach(f => {
        this.flavorCounts[f.id] = Math.max(0, this.flavorCounts[f.id] - 1);
      });
      this.selectedFlavors = this.selectedFlavors.slice(0, size);
    }

    this.tierButtons.forEach(b => {
      if (parseInt(b.getAttribute('data-size')) === size) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    this.renderPalette();
    this.renderSlots();
    this.updateSummary();
  }

  addFlavor(flavorId) {
    if (this.selectedFlavors.length >= this.selectedTier) {
      if (window.showToast) {
        window.showToast(`Your box is full (${this.selectedTier} scoops)! Click a scoop in tray to swap 🍧`, '📦');
      }
      return;
    }

    const flavor = BOX_FLAVORS.find(f => f.id === flavorId);
    if (!flavor) return;

    this.selectedFlavors.push(flavor);
    this.flavorCounts[flavorId]++;

    this.renderPalette();
    this.renderSlots();
    this.updateSummary();
  }

  removeFlavorAt(index) {
    if (index >= 0 && index < this.selectedFlavors.length) {
      const removed = this.selectedFlavors.splice(index, 1)[0];
      this.flavorCounts[removed.id] = Math.max(0, this.flavorCounts[removed.id] - 1);

      this.renderPalette();
      this.renderSlots();
      this.updateSummary();
    }
  }

  decrementFlavor(flavorId) {
    const idx = this.selectedFlavors.map(f => f.id).lastIndexOf(flavorId);
    if (idx !== -1) {
      this.removeFlavorAt(idx);
    }
  }

  renderPalette() {
    if (!this.paletteContainer) return;

    let flavors = BOX_FLAVORS;
    if (this.activeCategory !== 'all') {
      flavors = flavors.filter(f => f.category === this.activeCategory);
    }
    if (this.searchQuery) {
      flavors = flavors.filter(f => 
        f.name.toLowerCase().includes(this.searchQuery) || 
        f.note.toLowerCase().includes(this.searchQuery) ||
        f.category.toLowerCase().includes(this.searchQuery)
      );
    }

    if (flavors.length === 0) {
      this.paletteContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">
          <p>No flavors match "${this.searchQuery}". Try another sweet craving!</p>
        </div>
      `;
      return;
    }

    this.paletteContainer.innerHTML = flavors.map(flavor => {
      const count = this.flavorCounts[flavor.id] || 0;
      const isSelected = count > 0;
      return `
        <div class="flavor-pick-card ${isSelected ? 'is-selected' : ''}" id="flavor-card-${flavor.id}">
          <div class="flavor-pick-top">
            <span class="flavor-pick-emoji" style="background:${flavor.color}15">${flavor.emoji}</span>
            <span class="flavor-pick-badge" style="background:${flavor.color}20; color:${flavor.color === '#E5A823' ? '#B45309' : flavor.color}">${flavor.badge}</span>
          </div>
          <div class="flavor-pick-details">
            <h4 class="flavor-pick-name">${flavor.name}</h4>
            <p class="flavor-pick-note">${flavor.note}</p>
          </div>
          <div class="flavor-pick-bottom">
            <div class="flavor-pick-ctrls">
              <button class="flavor-pick-btn minus" onclick="window.BoxBuilderInstance.decrementFlavor('${flavor.id}')" ${count === 0 ? 'disabled' : ''} aria-label="Decrease ${flavor.name}">−</button>
              <span class="flavor-pick-count ${count > 0 ? 'active' : ''}">${count}</span>
              <button class="flavor-pick-btn plus" onclick="window.BoxBuilderInstance.addFlavor('${flavor.id}')" aria-label="Add ${flavor.name}">+</button>
            </div>
            ${count > 0 ? `<span class="flavor-in-box-tag">In Box (${count})</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  renderSlots() {
    if (!this.slotsContainer) return;

    let slotsHTML = '';
    for (let i = 0; i < this.selectedTier; i++) {
      const flavor = this.selectedFlavors[i];
      if (flavor) {
        slotsHTML += `
          <div class="box-slot filled animate-slot-pop" title="${flavor.name} (Click to remove)" onclick="window.BoxBuilderInstance.removeFlavorAt(${i})">
            <span class="box-slot-emoji">${flavor.emoji}</span>
            <span class="box-slot-name">${flavor.name.split(' ')[0]}</span>
            <span class="box-slot-remove" aria-label="Remove scoop">✕</span>
          </div>
        `;
      } else {
        slotsHTML += `
          <div class="box-slot empty" title="Empty Slot ${i + 1}">
            <span class="box-slot-plus">+</span>
            <span class="box-slot-num">Scoop ${i + 1}</span>
          </div>
        `;
      }
    }

    this.slotsContainer.innerHTML = slotsHTML;
  }

  updateSummary() {
    const tier = BOX_TIERS[this.selectedTier];
    const filledCount = this.selectedFlavors.length;
    const isFull = filledCount === this.selectedTier;

    if (this.trayCounter) {
      this.trayCounter.textContent = `${filledCount} / ${this.selectedTier} Scoops`;
      if (isFull) {
        this.trayCounter.classList.add('ready');
      } else {
        this.trayCounter.classList.remove('ready');
      }
    }

    if (this.summaryTitle) {
      this.summaryTitle.textContent = tier.name;
    }

    if (this.summaryPrice) {
      this.summaryPrice.textContent = `₹${tier.price}`;
    }

    if (this.summaryStatus) {
      if (isFull) {
        this.summaryStatus.innerHTML = `✨ <strong>Box Complete!</strong> All ${this.selectedTier} scoops packed and ready.`;
        this.summaryStatus.style.color = '#86EFAC';
      } else {
        const remaining = this.selectedTier - filledCount;
        this.summaryStatus.innerHTML = `<strong>${filledCount} of ${this.selectedTier}</strong> scoops chosen (${remaining} more to go)`;
        this.summaryStatus.style.color = 'rgba(255, 255, 255, 0.82)';
      }
    }

    if (this.addBoxBtn) {
      if (isFull) {
        this.addBoxBtn.disabled = false;
        this.addBoxBtn.innerHTML = `ADD BOX TO CART (₹${tier.price}) 🍨`;
      } else {
        this.addBoxBtn.disabled = true;
        this.addBoxBtn.innerHTML = `CHOOSE ${this.selectedTier - filledCount} MORE SCOOPS`;
      }
    }
  }

  addBoxToCart() {
    if (this.selectedFlavors.length < this.selectedTier) return;

    const tier = BOX_TIERS[this.selectedTier];
    const flavorBreakdown = [];
    BOX_FLAVORS.forEach(f => {
      const count = this.flavorCounts[f.id];
      if (count > 0) {
        flavorBreakdown.push({
          name: f.name,
          emoji: f.emoji,
          count: count
        });
      }
    });

    const boxItem = {
      id: `box-bundle-${Date.now()}`,
      name: tier.name,
      price: tier.price,
      image: 'assets/images/party-box.jpg',
      category: 'Box Bundle',
      subtext: `${this.selectedTier} Assorted Artisanal Scoops`,
      customBox: flavorBreakdown
    };

    if (window.Cart) {
      window.Cart.addItem(boxItem, 1, this.slotsContainer);
      if (window.triggerConfetti) {
        window.triggerConfetti();
      }
      if (window.showToast) {
        window.showToast(`Packed your ${tier.name} with love! 🍦`, '🎉');
      }
    }

    // Reset Box Builder for next customization
    this.selectedFlavors = [];
    BOX_FLAVORS.forEach(f => {
      this.flavorCounts[f.id] = 0;
    });
    this.renderPalette();
    this.renderSlots();
    this.updateSummary();
  }
}

window.BoxBuilder = BoxBuilder;
