/* Melt & Scoop™ - Hero Showcase Controller */

const HERO_FLAVORS = {
  vanilla: {
    id: 'hero-vanilla',
    name: 'TAHITIAN VANILLA BEAN',
    price: 189,
    formattedPrice: '₹189',
    description: 'Floral Madagascar & Tahitian vanilla with rich, slow-churned buttery creaminess.',
    color: '#E5A823',
    bgColor: '#FFFDF8',
    glowColor: 'rgba(229, 168, 35, 0.28)',
    blobColor: '#FEF7DA',
    ingredientEmoji: '🌼',
    image: 'assets/images/vanilla.png'
  },
  strawberry: {
    id: 'hero-strawberry',
    name: 'STRAWBERRY BLISS',
    price: 199,
    formattedPrice: '₹199',
    description: 'Fresh hand-picked strawberries folded into velvety whipped cream.',
    color: '#FF5E7E',
    bgColor: '#FFF0F4',
    glowColor: 'rgba(255, 94, 126, 0.32)',
    blobColor: '#FFE4EC',
    ingredientEmoji: '🍓',
    image: 'assets/images/strawberry.png'
  },
  chocolate: {
    id: 'hero-chocolate',
    name: 'BELGIAN DARK TRUFFLE',
    price: 249,
    formattedPrice: '₹249',
    description: 'Decadent 70% dark cocoa fudge with glossy ribbons of melted chocolate ganache.',
    color: '#48271F',
    bgColor: '#FAF3F0',
    glowColor: 'rgba(72, 39, 31, 0.26)',
    blobColor: '#F3E5DF',
    ingredientEmoji: '🍫',
    image: 'assets/images/chocolate.png'
  },
  pistachio: {
    id: 'hero-pistachio',
    name: 'PISTACHIO DREAM',
    price: 249,
    formattedPrice: '₹249',
    description: 'Creamy Sicilian pistachio gelato crafted with slow-roasted nutty goodness.',
    color: '#6E9E53',
    bgColor: '#F6FAF4',
    glowColor: 'rgba(110, 158, 83, 0.30)',
    blobColor: '#E8F4E1',
    ingredientEmoji: '🌰',
    image: 'assets/images/pistachio.png'
  },
  mango: {
    id: 'hero-mango',
    name: 'ALPHONSO MANGO VELVET',
    price: 219,
    formattedPrice: '₹219',
    description: 'Pure sun-ripened Alphonso mango nectar swirled into frozen fruit silk.',
    color: '#F59E0B',
    bgColor: '#FFFBF0',
    glowColor: 'rgba(245, 158, 11, 0.30)',
    blobColor: '#FEF3C7',
    ingredientEmoji: '🥭',
    image: 'assets/images/mango.png'
  }
};

class HeroShowcase {
  constructor() {
    this.currentFlavorKey = 'chocolate';
    this.heroQty = 1;
    this.isTransitioning = false;

    this.heroSection = document.getElementById('heroSection');
    this.ambientGlow = document.getElementById('heroAmbientGlow');
    this.heroImg = document.getElementById('heroIcecreamImg');
    this.displayFrame = document.getElementById('heroDisplayFrame');
    this.productNameEl = document.getElementById('heroProductName');
    this.productPriceEl = document.getElementById('heroProductPrice');
    this.productDescEl = document.getElementById('heroProductDesc');
    this.flavorPills = document.querySelectorAll('.flavor-pill');
    this.qtyNumberEl = document.getElementById('heroQtyNumber');
    this.qtyMinusBtn = document.getElementById('heroQtyMinus');
    this.qtyPlusBtn = document.getElementById('heroQtyPlus');
    this.addToCartBtn = document.getElementById('heroAddToCartBtn');

    // Dual-layer crossfade engine for buttery smooth background & glow fading
    this.activeLayerIdx = 1;
    this.bgLayer1 = document.getElementById('heroBgLayer1');
    this.bgLayer2 = document.getElementById('heroBgLayer2');
    this.glow1 = document.getElementById('heroAmbientGlow1') || document.getElementById('heroAmbientGlow');
    this.glow2 = document.getElementById('heroAmbientGlow2');

    // Flanking arrows and flavor cycle list
    this.flavorKeys = ['vanilla', 'strawberry', 'chocolate', 'pistachio', 'mango'];
    this.prevBtn = document.getElementById('heroPrevFlavorBtn');
    this.nextBtn = document.getElementById('heroNextFlavorBtn');

    this.init();
  }

  ensureBgLayers() {
    if (!this.heroSection) return;
    if (!this.bgLayer1) {
      this.bgLayer1 = document.getElementById('heroBgLayer1');
      if (!this.bgLayer1) {
        this.bgLayer1 = document.createElement('div');
        this.bgLayer1.id = 'heroBgLayer1';
        this.bgLayer1.className = 'hero-bg-layer is-active';
        this.heroSection.insertBefore(this.bgLayer1, this.heroSection.firstChild);
      }
    }
    if (!this.bgLayer2) {
      this.bgLayer2 = document.getElementById('heroBgLayer2');
      if (!this.bgLayer2) {
        this.bgLayer2 = document.createElement('div');
        this.bgLayer2.id = 'heroBgLayer2';
        this.bgLayer2.className = 'hero-bg-layer';
        this.heroSection.insertBefore(this.bgLayer2, this.bgLayer1.nextSibling);
      }
    }
    if (!this.glow1) {
      this.glow1 = document.getElementById('heroAmbientGlow1') || document.getElementById('heroAmbientGlow');
    }
    if (this.glow1 && !this.glow2) {
      this.glow2 = document.getElementById('heroAmbientGlow2');
      if (!this.glow2) {
        this.glow2 = document.createElement('div');
        this.glow2.id = 'heroAmbientGlow2';
        this.glow2.className = 'hero-ambient-glow';
        this.glow1.parentNode.insertBefore(this.glow2, this.glow1.nextSibling);
      }
    }
  }

  init() {
    if (!this.heroSection) return;

    this.ensureBgLayers();

    // Re-query flavor pills in case DOM was updated
    this.flavorPills = document.querySelectorAll('.flavor-pill');

    // Attach flavor buttons
    this.flavorPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const flavorKey = pill.getAttribute('data-flavor');
        if (flavorKey && flavorKey !== this.currentFlavorKey) {
          this.switchFlavor(flavorKey);
        }
      });
    });

    // Attach Left & Right Flanking Arrow Buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevFlavor();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextFlavor();
      });
    }

    // Keyboard Arrow Left/Right Navigation
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      if (e.key === 'ArrowLeft') {
        const rect = this.heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this.prevFlavor();
        }
      } else if (e.key === 'ArrowRight') {
        const rect = this.heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this.nextFlavor();
        }
      }
    });

    // Quantity Stepper
    if (this.qtyMinusBtn && this.qtyPlusBtn) {
      this.qtyMinusBtn.addEventListener('click', () => {
        if (this.heroQty > 1) {
          this.heroQty--;
          this.qtyNumberEl.textContent = this.heroQty;
        }
      });
      this.qtyPlusBtn.addEventListener('click', () => {
        if (this.heroQty < 20) {
          this.heroQty++;
          this.qtyNumberEl.textContent = this.heroQty;
        }
      });
    }

    // Add to Cart
    if (this.addToCartBtn) {
      this.addToCartBtn.addEventListener('click', () => {
        const flavor = HERO_FLAVORS[this.currentFlavorKey];
        if (window.Cart) {
          window.Cart.addItem({
            id: flavor.id,
            name: flavor.name,
            price: flavor.price,
            image: flavor.image,
            category: 'Scoops',
            subtext: 'Single Serving Pint'
          }, this.heroQty, this.heroImg);
        }
      });
    }

    // 3D Parallax Tilt with Mouse
    this.initParallaxTilt();

    // Scroll Rotation
    this.initScrollRotation();

    // Initial state set
    this.applyFlavorStyles(HERO_FLAVORS[this.currentFlavorKey], false);
  }

  prevFlavor() {
    if (this.isTransitioning) return;
    const currentIdx = this.flavorKeys.indexOf(this.currentFlavorKey);
    const prevIdx = (currentIdx - 1 + this.flavorKeys.length) % this.flavorKeys.length;
    this.switchFlavor(this.flavorKeys[prevIdx], 'prev');
  }

  nextFlavor() {
    if (this.isTransitioning) return;
    const currentIdx = this.flavorKeys.indexOf(this.currentFlavorKey);
    const nextIdx = (currentIdx + 1) % this.flavorKeys.length;
    this.switchFlavor(this.flavorKeys[nextIdx], 'next');
  }

  switchFlavor(flavorKey, direction = 'next') {
    if (this.isTransitioning || !HERO_FLAVORS[flavorKey]) return;
    this.isTransitioning = true;
    this.currentFlavorKey = flavorKey;
    const flavor = HERO_FLAVORS[flavorKey];

    // Trigger smooth background and glow fade immediately
    this.applyFlavorStyles(flavor, true);

    // Remove any previous transition classes
    const animClasses = [
      'flavor-enter', 'flavor-exit',
      'cone-rise-up', 'cone-dip-down',
      'slide-out-left', 'slide-out-right',
      'slide-in-right', 'slide-in-left'
    ];
    this.heroImg.classList.remove(...animClasses);

    // SLIDE OUT: Direction-aware horizontal slide
    if (direction === 'prev') {
      // Prev was clicked: slide out to right
      this.heroImg.classList.add('slide-out-right');
    } else {
      // Next was clicked: slide out to left
      this.heroImg.classList.add('slide-out-left');
    }

    setTimeout(() => {
      this.heroImg.src = flavor.image;
      this.productNameEl.textContent = flavor.name;
      this.productPriceEl.textContent = flavor.formattedPrice;
      this.productDescEl.textContent = flavor.description;

      // SLIDE IN: Direction-aware horizontal slide in for new flavor
      this.heroImg.classList.remove('slide-out-left', 'slide-out-right');
      if (direction === 'prev') {
        // Incoming from left
        this.heroImg.classList.add('slide-in-left');
      } else {
        // Incoming from right
        this.heroImg.classList.add('slide-in-right');
      }

      // Trigger particle sprinkle burst
      if (window.particleEngine) {
        window.particleEngine.setFlavorColor(flavor.color);
      }

      setTimeout(() => {
        this.isTransitioning = false;
      }, 520);
    }, 280);
  }

  applyFlavorStyles(flavor, animated = true) {
    this.ensureBgLayers();

    const bgGradient = `radial-gradient(circle at 50% 45%, ${flavor.bgColor} 0%, #FFF9F2 75%)`;
    const glowGradient = `radial-gradient(circle, ${flavor.glowColor} 0%, rgba(255, 240, 244, 0) 70%)`;

    if (!animated) {
      // Immediate set on initial load without animation
      if (this.bgLayer1) {
        this.bgLayer1.style.background = bgGradient;
        this.bgLayer1.classList.add('is-active');
      }
      if (this.bgLayer2) {
        this.bgLayer2.style.background = bgGradient;
        this.bgLayer2.classList.remove('is-active');
      }
      if (this.glow1) {
        this.glow1.style.background = glowGradient;
        this.glow1.classList.add('is-active');
      }
      if (this.glow2) {
        this.glow2.style.background = glowGradient;
        this.glow2.classList.remove('is-active');
      }
      this.activeLayerIdx = 1;
    } else {
      // Smooth fade crossfade between layers
      const incomingLayer = this.activeLayerIdx === 1 ? this.bgLayer2 : this.bgLayer1;
      const outgoingLayer = this.activeLayerIdx === 1 ? this.bgLayer1 : this.bgLayer2;

      const incomingGlow = this.activeLayerIdx === 1 ? this.glow2 : this.glow1;
      const outgoingGlow = this.activeLayerIdx === 1 ? this.glow1 : this.glow2;

      if (incomingLayer) {
        incomingLayer.style.background = bgGradient;
      }
      if (incomingGlow) {
        incomingGlow.style.background = glowGradient;
      }

      requestAnimationFrame(() => {
        if (incomingLayer) incomingLayer.classList.add('is-active');
        if (outgoingLayer) outgoingLayer.classList.remove('is-active');

        if (incomingGlow) incomingGlow.classList.add('is-active');
        if (outgoingGlow) outgoingGlow.classList.remove('is-active');
      });

      this.activeLayerIdx = this.activeLayerIdx === 1 ? 2 : 1;
    }

    if (this.heroSection) {
      this.heroSection.style.backgroundColor = flavor.bgColor;
    }

    const meltBlob = document.getElementById('heroMeltBlob');
    if (meltBlob) {
      meltBlob.style.background = `radial-gradient(circle, ${flavor.blobColor} 0%, rgba(255, 235, 240, 0.4) 60%, rgba(255, 255, 255, 0) 100%)`;
    }
    // Update floating ingredient elements
    const ingredientEls = document.querySelectorAll('.floating-strawberry');
    ingredientEls.forEach(el => {
      if (flavor.id === 'hero-strawberry') {
        el.style.opacity = '1';
        el.style.filter = '';
      } else {
        el.style.opacity = '0.35';
      }
    });
  }

  initParallaxTilt() {
    if (!this.displayFrame) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = this.heroSection.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (e.clientX - centerX) / (rect.width / 2);
      const normY = (e.clientY - centerY) / (rect.height / 2);

      targetRotY = normX * 14; // degrees
      targetRotX = -normY * 14;
    });

    const updateTilt = () => {
      curRotX += (targetRotX - curRotX) * 0.08;
      curRotY += (targetRotY - curRotY) * 0.08;

      if (this.displayFrame) {
        this.displayFrame.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
      }
      requestAnimationFrame(updateTilt);
    };
    updateTilt();
  }

  initScrollRotation() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 800 && this.heroImg) {
        const rot = (scrollY * 0.025).toFixed(2);
        this.heroImg.style.filter = `drop-shadow(0 ${25 + scrollY * 0.02}px 35px rgba(50, 29, 23, 0.18))`;
      }
    }, { passive: true });
  }
}

window.HeroShowcase = HeroShowcase;
