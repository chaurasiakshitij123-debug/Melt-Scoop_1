/* Melt & Scoop™ - Main Application Bootstrap */

const STORE_LOCATIONS = {
  ahmedabad: {
    city: 'Ahmedabad',
    storeName: 'Bodakdev Flagship Scoop Bar',
    address: 'Shop 4, Ground Floor, Sindhu Bhavan Road, Bodakdev, Ahmedabad - 380054',
    hours: 'Open Daily: 11:00 AM – 11:30 PM',
    status: 'Scooping Now · Open till 11:30 PM',
    badge: '🟢 Open Now',
    phone: '+91 79 4892 1100',
    tel: '+917948921100',
    exclusiveTitle: 'Saffron Kesar Pista Crunch',
    exclusiveDesc: 'Handcrafted with Kashmiri Mongra saffron & roasted Iranian pistachios',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Melt+and+Scoop+Sindhu+Bhavan+Road+Bodakdev+Ahmedabad'
  },
  mumbai: {
    city: 'Mumbai',
    storeName: 'Bandra West Creamery',
    address: '14 Linking Road, Near KFC Junction, Bandra West, Mumbai - 400050',
    hours: 'Open Daily: 11:30 AM – 12:30 AM (Midnight Cravings)',
    status: 'Scooping Now · Open till 12:30 AM',
    badge: '🟢 Open Till 12:30 AM',
    phone: '+91 22 2640 5522',
    tel: '+912226405522',
    exclusiveTitle: 'Sea Salt Caramel Sea Breeze',
    exclusiveDesc: 'Slow-cooked golden butter caramel with Arabian sea salt crystals',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Melt+and+Scoop+Linking+Road+Bandra+West+Mumbai'
  },
  delhi: {
    city: 'Delhi NCR',
    storeName: 'Khan Market Boutique',
    address: 'Shop 28-A, Middle Lane, Khan Market, New Delhi - 110003',
    hours: 'Open Daily: 11:00 AM – 11:00 PM',
    status: 'Scooping Now · Open till 11:00 PM',
    badge: '🟢 Open Now',
    phone: '+91 11 4105 8899',
    tel: '+911141058899',
    exclusiveTitle: 'Kashmiri Shahi Gulab & Pistachio',
    exclusiveDesc: 'Damascus rose water infused cream folded with slivered green pistachios',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Melt+and+Scoop+Khan+Market+New+Delhi'
  },
  bangalore: {
    city: 'Bangalore',
    storeName: 'Indiranagar 100ft Scoop Shop',
    address: '612, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    hours: 'Open Daily: 11:00 AM – 11:45 PM',
    status: 'Scooping Now · Open till 11:45 PM',
    badge: '🟢 Open Now',
    phone: '+91 80 4120 7744',
    tel: '+918041207744',
    exclusiveTitle: 'Chikmagalur Roast Coffee Crunch',
    exclusiveDesc: 'Single-estate arabica espresso churn with dark cacao nib crunch',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Melt+and+Scoop+100+Feet+Rd+Indiranagar+Bengaluru'
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

  // 3. Store Location City Switcher with Dynamic Links & Smooth Crossfade
  const cityTabs = document.querySelectorAll('.city-tab');
  const storeTitleEl = document.getElementById('storeDetailTitle');
  const storeCityLabelEl = document.getElementById('storeCityLabel');
  const storeCityOverlayEl = document.getElementById('storeCityOverlay');
  const storeAddressEl = document.getElementById('storeDetailAddress');
  const storeHoursEl = document.getElementById('storeDetailHours');
  const storeHoursBadgeEl = document.getElementById('storeHoursBadge');
  const storeLiveStatusEl = document.getElementById('storeLiveStatus');
  const storeExclusiveTitleEl = document.getElementById('storeDetailExclusiveTitle');
  const storeExclusiveDescEl = document.getElementById('storeDetailExclusiveDesc');
  const storePhoneEl = document.getElementById('storeDetailPhone');
  const storeDirectionsBtn = document.getElementById('storeDetailDirections');
  const storeCallBtn = document.getElementById('storeDetailCallBtn');
  const storeCardEl = document.getElementById('storeDetailCard');

  cityTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cityKey = tab.getAttribute('data-city');
      const data = STORE_LOCATIONS[cityKey];
      if (!data) return;

      cityTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (storeCardEl) {
        storeCardEl.style.opacity = '0.35';
        storeCardEl.style.transform = 'translateY(4px)';
      }

      setTimeout(() => {
        if (storeTitleEl) storeTitleEl.textContent = data.storeName;
        if (storeCityLabelEl) storeCityLabelEl.textContent = `${data.city} Flagship`;
        if (storeCityOverlayEl) storeCityOverlayEl.textContent = `📍 ${data.city} Flagship`;
        if (storeAddressEl) storeAddressEl.textContent = data.address;
        if (storeHoursEl) storeHoursEl.textContent = data.hours;
        if (storeHoursBadgeEl) storeHoursBadgeEl.textContent = data.badge;
        if (storeLiveStatusEl) storeLiveStatusEl.textContent = data.status;
        if (storeExclusiveTitleEl) storeExclusiveTitleEl.textContent = data.exclusiveTitle;
        if (storeExclusiveDescEl) storeExclusiveDescEl.textContent = data.exclusiveDesc;

        if (storePhoneEl) {
          storePhoneEl.innerHTML = `${data.phone} <span class="store-call-hint">(Tap to Call)</span>`;
          storePhoneEl.setAttribute('href', `tel:${data.tel}`);
        }

        if (storeDirectionsBtn) {
          storeDirectionsBtn.setAttribute('href', data.mapsUrl);
        }

        if (storeCallBtn) {
          storeCallBtn.setAttribute('href', `tel:${data.tel}`);
        }

        if (storeCardEl) {
          storeCardEl.style.opacity = '1';
          storeCardEl.style.transform = 'translateY(0)';
          storeCardEl.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
        }
      }, 100);
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

  // 8. Store Image Gallery Filter Tabs & Lightbox
  const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeLightboxBtn = document.getElementById('closeGalleryLightboxBtn');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-gallery-filter');
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  window.openGalleryLightbox = function(imgSrc, title, desc) {
    if (!lightboxModal) return;
    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    lightboxModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  window.closeGalleryLightbox = function() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', window.closeGalleryLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        window.closeGalleryLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeGalleryLightbox();
    }
  });

  // 9. Active Navigation Link Scrollspy
  const sectionsToSpy = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-nav-link');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120;
    sectionsToSpy.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });
});
