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

    this.init();
  }

  init() {
    if (!this.heroSection) return;

    // Attach flavor buttons
    this.flavorPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const flavorKey = pill.getAttribute('data-flavor');
        if (flavorKey && flavorKey !== this.currentFlavorKey) {
          this.switchFlavor(flavorKey);
        }
      });
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

  switchFlavor(flavorKey) {
    if (this.isTransitioning || !HERO_FLAVORS[flavorKey]) return;
    this.isTransitioning = true;
    this.currentFlavorKey = flavorKey;
    const flavor = HERO_FLAVORS[flavorKey];

    // Update active pill
    this.flavorPills.forEach(p => {
      if (p.getAttribute('data-flavor') === flavorKey) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Liquid Transition Animation on Image
    this.heroImg.classList.remove('flavor-enter');
    this.heroImg.classList.add('flavor-exit');

    setTimeout(() => {
      this.heroImg.src = flavor.image;
      this.productNameEl.textContent = flavor.name;
      this.productPriceEl.textContent = flavor.formattedPrice;
      this.productDescEl.textContent = flavor.description;
      this.applyFlavorStyles(flavor, true);

      this.heroImg.classList.remove('flavor-exit');
      this.heroImg.classList.add('flavor-enter');

      // Trigger particle sprinkle burst
      if (window.particleEngine) {
        window.particleEngine.setFlavorColor(flavor.color);
      }

      setTimeout(() => {
        this.isTransitioning = false;
      }, 400);
    }, 280);
  }

  applyFlavorStyles(flavor, animated = true) {
    if (this.heroSection) {
      this.heroSection.style.background = `radial-gradient(circle at 50% 45%, ${flavor.bgColor} 0%, #FFF9F2 75%)`;
    }
    if (this.ambientGlow) {
      this.ambientGlow.style.background = `radial-gradient(circle, ${flavor.glowColor} 0%, rgba(255, 240, 244, 0) 70%)`;
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
