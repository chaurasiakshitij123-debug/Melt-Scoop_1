/* Melt & Scoop™ - Main Application Bootstrap */

const STORE_LOCATIONS = {
  ahmedabad: {
    city: 'Ahmedabad',
    storeName: 'Bodakdev Flagship Scoop Bar',
    address: 'Shop 4, Ground Floor, Sindhu Bhavan Road, Bodakdev, Ahmedabad - 380054',
    hours: 'Open Daily: 11:00 AM – 11:30 PM',
    phone: '+91 79 4892 1100',
    exclusiveFlavor: '✨ Ahmedabad Special: Saffron Kesar Pista Crunch',
    mapsUrl: 'https://maps.google.com'
  },
  mumbai: {
    city: 'Mumbai',
    storeName: 'Bandra West Creamery',
    address: '14 Linking Road, Near KFC Junction, Bandra West, Mumbai - 400050',
    hours: 'Open Daily: 11:30 AM – 12:30 AM (Midnight Craving Hours)',
    phone: '+91 22 2640 5522',
    exclusiveFlavor: '✨ Mumbai Special: Sea Salt Caramel Sea Breeze',
    mapsUrl: 'https://maps.google.com'
  },
  delhi: {
    city: 'Delhi NCR',
    storeName: 'Khan Market Boutique',
    address: 'Shop 28-A, Middle Lane, Khan Market, New Delhi - 110003',
    hours: 'Open Daily: 11:00 AM – 11:00 PM',
    phone: '+91 11 4105 8899',
    exclusiveFlavor: '✨ Delhi Special: Kashmiri Shahi Gulab & Pistachio',
    mapsUrl: 'https://maps.google.com'
  },
  bangalore: {
    city: 'Bangalore',
    storeName: 'Indiranagar 100ft Scoop Shop',
    address: '612, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    hours: 'Open Daily: 11:00 AM – 11:45 PM',
    phone: '+91 80 4120 7744',
    exclusiveFlavor: '✨ Bangalore Special: Chikmagalur Roast Coffee Crunch',
    mapsUrl: 'https://maps.google.com'
  }
};

// Global Toast System
window.showToast = function(message, icon = '🍦') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.9)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Engines
  window.particleEngine = new ParticleEngine('sprinklesCanvas');
  window.Cart = new CartManager();
  window.HeroShowcaseInstance = new HeroShowcase();
  window.BoxBuilderInstance = new BoxBuilder();
  window.ShopInstance = new ShopManager();

  // 2. Header Scroll Compression
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 45) {
      siteHeader.classList.add('is-compact');
    } else {
      siteHeader.classList.remove('is-compact');
    }
  }, { passive: true });

  // 3. Store Location City Switcher
  const cityTabs = document.querySelectorAll('.city-tab');
  const storeTitleEl = document.getElementById('storeDetailTitle');
  const storeAddressEl = document.getElementById('storeDetailAddress');
  const storeHoursEl = document.getElementById('storeDetailHours');
  const storeExclusiveEl = document.getElementById('storeDetailExclusive');
  const storePhoneEl = document.getElementById('storeDetailPhone');

  cityTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cityKey = tab.getAttribute('data-city');
      const data = STORE_LOCATIONS[cityKey];
      if (!data) return;

      cityTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (storeTitleEl) storeTitleEl.textContent = data.storeName;
      if (storeAddressEl) storeAddressEl.textContent = data.address;
      if (storeHoursEl) storeHoursEl.textContent = data.hours;
      if (storeExclusiveEl) storeExclusiveEl.textContent = data.exclusiveFlavor;
      if (storePhoneEl) storePhoneEl.textContent = data.phone;
    });
  });

  // 4. Newsletter Subscription Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        window.showToast(`Welcome to the Melt Club! Use code SWEET10 for 10% off 🍦`, '🎉');
        if (window.triggerConfetti) window.triggerConfetti();
        input.value = '';
      }
    });
  });

  // 5. Contact Form Handler
  const contactForm = document.getElementById('contactUsForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.showToast(`Thank you! Our creamery team will get back to you shortly 🍨`, '💌');
      contactForm.reset();
      const contactModal = document.getElementById('contactModal');
      if (contactModal) contactModal.classList.remove('open');
    });
  }

  // 6. Mobile Navigation Drawer Controller
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  window.openMobileMenu = function() {
    if (mobileMenuDrawer && mobileNavBackdrop) {
      mobileMenuDrawer.classList.add('open');
      mobileNavBackdrop.classList.add('open');
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.add('is-active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeMobileMenu = function() {
    if (mobileMenuDrawer && mobileNavBackdrop) {
      mobileMenuDrawer.classList.remove('open');
      mobileNavBackdrop.classList.remove('open');
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('is-active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  };

  window.toggleMobileMenu = function() {
    if (mobileMenuDrawer && mobileMenuDrawer.classList.contains('open')) {
      window.closeMobileMenu();
    } else {
      window.openMobileMenu();
    }
  };

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleMobileMenu();
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', () => window.closeMobileMenu());
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', () => window.closeMobileMenu());
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeMobileMenu();
    }
  });

  // 7. Navigation Smooth Scrolling & Active State
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          window.closeMobileMenu();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 7. Early-Trigger Reveal On Scroll Observer (Triggers BEFORE reaching section)
  const revealElements = document.querySelectorAll('.reveal-slide-up, .reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px 180px 0px', // Slide up triggers 180px before reaching the section
      threshold: 0
    });

    revealElements.forEach(el => observer.observe(el));

    // Global observer helper for dynamically injected content (e.g. products)
    window.observeNewElements = function(container) {
      if (!container) return;
      const newItems = container.querySelectorAll('.reveal-slide-up, .reveal-on-scroll');
      newItems.forEach(el => observer.observe(el));
    };
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
});
