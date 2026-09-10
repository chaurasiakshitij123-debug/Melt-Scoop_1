/* Melt & Scoop™ - Secret Live Visual Studio, CMS & Animation Engine */

(function() {
  const SECRET_PIN = "4321";
  let editorUnlocked = false;
  let currentMode = 'text'; // 'text' | 'animate' | 'media'
  let selectedElement = null;
  let hoveredElement = null;
  let clickTimestamps = [];
  let targetImageEl = null;

  // Active Site Settings
  let activeCursorFx = document.body.dataset.cursorFx || 'sprinkles'; // 'sprinkles' | 'blob' | 'glow' | 'none'
  let activeSectionAnim = document.body.dataset.sectionAnim || 'blur-in'; // 'slide-up' | 'blur-in' | 'zoom-in' | 'float'

  // ==========================================================================
  // 1. INITIALIZE & INJECT EDITOR DOM
  // ==========================================================================
  function initEditorUI() {
    if (document.getElementById('visualEditorDock')) return;

    // Apply initial cursor & section engines
    initMouseFxEngine();
    initSectionScrollObserver();

    // A. PIN Modal
    const pinOverlay = document.createElement('div');
    pinOverlay.id = 'editorPinModal';
    pinOverlay.className = 'editor-pin-overlay';
    pinOverlay.innerHTML = `
      <div class="editor-pin-card" id="editorPinCard">
        <div class="editor-pin-badge">🔒 Secret Admin</div>
        <h2 class="editor-pin-title">Studio Mode</h2>
        <p class="editor-pin-desc">Enter the 4-digit PIN to unlock the live visual website editor.</p>
        <div class="editor-pin-input-group">
          <input type="password" maxlength="1" class="editor-pin-digit" data-index="0" autofocus>
          <input type="password" maxlength="1" class="editor-pin-digit" data-index="1">
          <input type="password" maxlength="1" class="editor-pin-digit" data-index="2">
          <input type="password" maxlength="1" class="editor-pin-digit" data-index="3">
        </div>
        <div class="editor-pin-actions">
          <button type="button" class="editor-pin-btn editor-pin-btn-cancel" id="editorPinCancel">Cancel</button>
          <button type="button" class="editor-pin-btn editor-pin-btn-unlock" id="editorPinSubmit">Unlock Studio</button>
        </div>
      </div>
    `;
    document.body.appendChild(pinOverlay);

    // B. Floating Studio Dock (with Cursor FX & Section Entrance Selectors)
    const dock = document.createElement('div');
    dock.id = 'visualEditorDock';
    dock.className = 'editor-dock';
    dock.innerHTML = `
      <div class="editor-dock-brand">
        <span class="editor-dock-status-dot"></span>
        <span>STUDIO LIVE</span>
      </div>
      <div class="editor-dock-divider"></div>
      <button type="button" class="editor-tool-btn is-active" id="toolBtnText" data-mode="text" title="Click any headline, price, or text to edit">
        ✏️ Edit Text
      </button>
      <button type="button" class="editor-tool-btn" id="toolBtnAnimate" data-mode="animate" title="Click any element to add/test animations">
        ✨ Animate
      </button>
      <button type="button" class="editor-tool-btn" id="toolBtnMedia" data-mode="media" title="Click any image to upload or replace">
        🖼️ Replace Images
      </button>
      <div class="editor-dock-divider"></div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">🎬 Section:</span>
        <select class="editor-dock-select" id="editorSectionAnimSelect" title="Scroll entrance animation for sections">
          <option value="blur-in">Dreamy Blur In</option>
          <option value="slide-up">Slide Up Spring</option>
          <option value="zoom-in">Zoom Cascade</option>
          <option value="float">Buoyant Float</option>
        </select>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">🖱️ Cursor:</span>
        <select class="editor-dock-select" id="editorCursorFxSelect" title="Interactive mouse cursor effect">
          <option value="sprinkles">✨ Sprinkles Trail</option>
          <option value="blob">🍨 Melting Blob</option>
          <option value="glow">💡 Ambient Glow</option>
          <option value="none">⚪ Default</option>
        </select>
      </div>
      <div class="editor-dock-divider"></div>
      <button type="button" class="editor-tool-publish-btn" id="editorPublishBtn">
        🚀 Publish Live
      </button>
      <button type="button" class="editor-tool-close-btn" id="editorCloseBtn" title="Exit Studio Mode">
        ✕
      </button>
    `;
    document.body.appendChild(dock);

    // C. Animation Controls Panel
    const animPanel = document.createElement('div');
    animPanel.id = 'editorAnimPanel';
    animPanel.className = 'editor-anim-panel';
    animPanel.innerHTML = `
      <div class="editor-anim-header">
        <div class="editor-anim-title">✨ Animation Studio</div>
        <span class="editor-anim-target-tag" id="animTargetTag">None</span>
      </div>
      <div class="editor-anim-presets-grid">
        <button type="button" class="editor-preset-btn" data-anim="anim-fade-in">Fade In</button>
        <button type="button" class="editor-preset-btn" data-anim="anim-blur-in">Blur In</button>
        <button type="button" class="editor-preset-btn" data-anim="anim-float-up">Float Up</button>
        <button type="button" class="editor-preset-btn" data-anim="anim-slide-up">Slide Up</button>
        <button type="button" class="editor-preset-btn" data-anim="anim-pop-in">Pop In</button>
        <button type="button" class="editor-preset-btn" data-anim="anim-wobble">Wobble</button>
      </div>
      <div class="editor-anim-slider-group">
        <div class="editor-anim-slider-row">
          <span>Speed (Duration)</span>
          <span id="animDurationVal">0.8s</span>
        </div>
        <input type="range" min="0.2" max="2.5" step="0.05" value="0.8" class="editor-anim-slider" id="animDurationSlider">
      </div>
      <div class="editor-anim-slider-group">
        <div class="editor-anim-slider-row">
          <span>Delay</span>
          <span id="animDelayVal">0s</span>
        </div>
        <input type="range" min="0" max="1.5" step="0.05" value="0" class="editor-anim-slider" id="animDelaySlider">
      </div>
      <div class="editor-anim-actions">
        <button type="button" class="editor-anim-play-btn" id="animPlayBtn">
          ▶ Replay Animation
        </button>
        <button type="button" class="editor-anim-clear-btn" id="animClearBtn">
          Remove
        </button>
      </div>
    `;
    document.body.appendChild(animPanel);

    // D. Image Replacer Modal
    const imgModal = document.createElement('div');
    imgModal.id = 'editorImgModal';
    imgModal.className = 'editor-img-modal';
    imgModal.innerHTML = `
      <div class="editor-img-card">
        <h3 style="font-family: 'Fraunces', serif; margin-bottom: 8px; font-size: 1.35rem; color: #321D17;">Replace Image</h3>
        <p style="font-size: 0.86rem; color: #78645E; margin-bottom: 16px;">Upload a new image file or paste a web URL.</p>
        <div class="editor-img-preview-box">
          <img src="" alt="Preview" class="editor-img-preview-thumb" id="editorImgPreview">
        </div>
        <label class="editor-upload-dropzone" id="editorDropzone">
          <input type="file" accept="image/*" id="editorFileInput" style="display: none;">
          <p>📁 Click to Browse or Drag Image Here</p>
          <span style="font-size: 0.75rem; color: #9B8883;">PNG, JPG, WEBP, or SVG</span>
        </label>
        <input type="text" placeholder="Or paste image URL (https://...)" class="editor-img-url-input" id="editorImgUrlInput">
        <div class="editor-img-actions">
          <button type="button" class="editor-pin-btn editor-pin-btn-cancel" id="editorImgCancel">Cancel</button>
          <button type="button" class="editor-pin-btn editor-pin-btn-unlock" id="editorImgApply">Apply Image</button>
        </div>
      </div>
    `;
    document.body.appendChild(imgModal);

    // E. Add New Product Modal
    const addProdModal = document.createElement('div');
    addProdModal.id = 'editorAddProdModal';
    addProdModal.className = 'editor-add-prod-modal';
    addProdModal.innerHTML = `
      <div class="editor-add-prod-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-family:'Fraunces',serif; font-size:1.4rem; color:#321D17; margin:0;">🍨 Add New Scoop Product</h3>
          <button type="button" class="editor-tool-close-btn" id="closeAddProdModal" style="background:#F2E5D5; color:#543329;">✕</button>
        </div>
        <p style="font-size:0.86rem; color:#78645E; margin-bottom:20px;">Create a new artisanal ice cream flavor for your live shop catalog.</p>

        <div class="editor-form-group">
          <label>Flavor Name</label>
          <input type="text" class="editor-form-input" id="newProdName" placeholder="e.g. Wild Blueberry Cheesecake" required>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="editor-form-group">
            <label>Price (₹)</label>
            <input type="number" class="editor-form-input" id="newProdPrice" placeholder="229" value="229" required>
          </div>
          <div class="editor-form-group">
            <label>Category</label>
            <select class="editor-form-select" id="newProdCategory">
              <option value="Vanilla">Vanilla</option>
              <option value="Strawberry">Strawberry</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Pistachio">Pistachio</option>
              <option value="Mango">Mango</option>
              <option value="Seasonal">Seasonal Special</option>
            </select>
          </div>
        </div>

        <div class="editor-form-group">
          <label>Tasting Notes</label>
          <input type="text" class="editor-form-input" id="newProdNotes" placeholder="e.g. Maine blueberries · Cream cheese swirl · Graham crust">
        </div>

        <div class="editor-form-group">
          <label>Ice Cream Image (File or URL)</label>
          <div style="display:flex; gap:8px;">
            <input type="text" class="editor-form-input" id="newProdImgUrl" placeholder="assets/images/vanilla.png or URL" value="assets/images/vanilla.png">
            <label class="btn btn-secondary" style="padding:8px 14px; font-size:0.8rem; cursor:pointer; flex-shrink:0;">
              Browse
              <input type="file" accept="image/*" id="newProdFileInput" style="display:none;">
            </label>
          </div>
        </div>

        <div class="editor-img-actions" style="margin-top:24px;">
          <button type="button" class="editor-pin-btn editor-pin-btn-cancel" id="cancelAddProdBtn">Cancel</button>
          <button type="button" class="editor-pin-btn editor-pin-btn-unlock" id="submitAddProdBtn">➕ Add to Catalog</button>
        </div>
      </div>
    `;
    document.body.appendChild(addProdModal);

    // F. Toast Banner
    const toastBanner = document.createElement('div');
    toastBanner.id = 'editorToastBanner';
    toastBanner.className = 'editor-toast-banner';
    toastBanner.innerHTML = `<span id="editorToastIcon">🍦</span> <span id="editorToastMsg">Message</span>`;
    document.body.appendChild(toastBanner);

    setupEventListeners();
    setupProductControls();
    setupCategoryControls();
  }

  // Toast System
  function showEditorToast(msg, icon = '✨') {
    const banner = document.getElementById('editorToastBanner');
    const msgEl = document.getElementById('editorToastMsg');
    const iconEl = document.getElementById('editorToastIcon');
    if (!banner || !msgEl) return;
    msgEl.textContent = msg;
    iconEl.textContent = icon;
    banner.classList.add('is-visible');
    setTimeout(() => {
      banner.classList.remove('is-visible');
    }, 3500);
  }

  // ==========================================================================
  // 2. TRIPLE-CLICK DETECTION
  // ==========================================================================
  function setupTripleClickTrigger() {
    const logos = document.querySelectorAll('.header-left-logo, .mobile-drawer-logo');
    logos.forEach(logo => {
      logo.addEventListener('click', (e) => {
        const now = Date.now();
        clickTimestamps.push(now);

        // Keep only clicks within the last 700ms
        clickTimestamps = clickTimestamps.filter(t => now - t < 700);

        if (clickTimestamps.length >= 3) {
          e.preventDefault();
          clickTimestamps = [];
          if (editorUnlocked) {
            toggleEditorDock();
          } else {
            openPinModal();
          }
        }
      });
    });
  }

  // ==========================================================================
  // 3. PIN VERIFICATION
  // ==========================================================================
  function openPinModal() {
    const modal = document.getElementById('editorPinModal');
    if (!modal) return;
    document.body.classList.add('pin-modal-open');
    modal.classList.add('is-active');
    const digits = modal.querySelectorAll('.editor-pin-digit');
    digits.forEach(d => d.value = '');
    digits[0].focus();
  }

  function closePinModal() {
    const modal = document.getElementById('editorPinModal');
    if (modal) modal.classList.remove('is-active');
    document.body.classList.remove('pin-modal-open');
  }

  function checkPin() {
    const digits = document.querySelectorAll('.editor-pin-digit');
    let pin = '';
    digits.forEach(d => pin += d.value.trim());

    if (pin === SECRET_PIN) {
      editorUnlocked = true;
      closePinModal();
      showEditorToast("Studio Mode Unlocked! Welcome, Creator.", "🔓");
      openEditorDock();
    } else {
      const card = document.getElementById('editorPinCard');
      if (card) {
        card.classList.add('is-shaking');
        setTimeout(() => card.classList.remove('is-shaking'), 400);
      }
      showEditorToast("Invalid PIN. Please try again.", "⚠️");
      digits.forEach(d => d.value = '');
      digits[0].focus();
    }
  }

  // ==========================================================================
  // 4. EDITOR DOCK & MODE HANDLING
  // ==========================================================================
  function openEditorDock() {
    const dock = document.getElementById('visualEditorDock');
    if (!dock) return;
    dock.classList.add('is-open');
    document.body.classList.add('editor-active');
    setupProductControls();
    setupCategoryControls();

    // Sync active selects
    const secSelect = document.getElementById('editorSectionAnimSelect');
    if (secSelect) secSelect.value = activeSectionAnim;
    const curSelect = document.getElementById('editorCursorFxSelect');
    if (curSelect) curSelect.value = activeCursorFx;

    setMode('text');
  }

  function toggleEditorDock() {
    const dock = document.getElementById('visualEditorDock');
    if (dock && dock.classList.contains('is-open')) {
      closeEditorDock();
    } else {
      openEditorDock();
    }
  }

  function closeEditorDock() {
    const dock = document.getElementById('visualEditorDock');
    if (dock) dock.classList.remove('is-open');
    document.body.classList.remove('editor-active');
    document.body.classList.remove('mode-media');
    disableInlineEditing();
    clearInspector();
    closeAnimPanel();
    closeImgModal();
    showEditorToast("Studio Mode Paused", "👋");
  }

  function setMode(mode) {
    currentMode = mode;
    clearInspector();

    document.querySelectorAll('.editor-tool-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
    });

    document.body.classList.toggle('mode-media', mode === 'media');

    if (mode === 'text') {
      enableInlineEditing();
      closeAnimPanel();
      showEditorToast("Text Mode: Click any headline, tab, or price to edit!", "✏️");
    } else if (mode === 'animate') {
      disableInlineEditing();
      showEditorToast("Animation Mode: Click any element to add/test animations!", "✨");
    } else if (mode === 'media') {
      disableInlineEditing();
      closeAnimPanel();
      showEditorToast("Media Mode: Click on any image to replace it!", "🖼️");
    }
  }

  // ==========================================================================
  // 5. INLINE TEXT EDITING
  // ==========================================================================
  function enableInlineEditing() {
    const textElements = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, .section-eyebrow, .badge, .product-title, .product-tasting-notes, .product-price, .product-cat-tag, .hero-editorial-title, .hero-subtitle, .footer-playful-title, .footer-playful-subtitle, .flavor-pill, .shop-tab, .city-tab, .btn'
    );
    textElements.forEach(el => {
      if (el.closest('.editor-dock') || el.closest('.editor-pin-overlay') || el.closest('.editor-anim-panel') || el.closest('.editor-img-modal') || el.closest('.editor-add-prod-modal')) return;
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    });
  }

  function disableInlineEditing() {
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
    });
  }

  // ==========================================================================
  // 6. PRODUCT MANAGEMENT (ADD / DELETE)
  // ==========================================================================
  function setupProductControls() {
    const catalogToolbar = document.querySelector('.shop-toolbar');
    if (catalogToolbar && !document.getElementById('catalogAddScoopBtn')) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.id = 'catalogAddScoopBtn';
      addBtn.className = 'editor-catalog-add-btn';
      addBtn.innerHTML = `<span>➕</span><span>Add New Scoop</span>`;
      addBtn.addEventListener('click', () => openAddProductModal());
      catalogToolbar.parentElement.insertBefore(addBtn, catalogToolbar.nextElementSibling);
    }

    // Attach delete button to all product cards
    document.querySelectorAll('.product-card').forEach(card => {
      if (!card.querySelector('.editor-card-del-btn')) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'editor-card-del-btn';
        delBtn.innerHTML = `✕`;
        delBtn.title = "Delete this product";
        delBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteProductCard(card);
        });
        card.appendChild(delBtn);
      }
    });
  }

  function deleteProductCard(card) {
    const title = card.querySelector('.product-title')?.textContent || 'this product';
    card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8) translateY(-20px)';
    setTimeout(() => {
      card.remove();
      updateCatalogCounters();
      showEditorToast(`Removed "${title}"! Click Publish Live to save.`, "🗑️");
    }, 350);
  }

  function openAddProductModal() {
    const modal = document.getElementById('editorAddProdModal');
    if (!modal) return;
    document.body.classList.add('editor-modal-open');
    modal.classList.add('is-active');

    // Populate category dropdown with current shop tabs
    const catSelect = document.getElementById('newProdCategory');
    if (catSelect) {
      const activeTabs = Array.from(document.querySelectorAll('.shop-tab'))
        .map(t => t.textContent.replace(/^[^\w]+/, '').trim())
        .filter(t => !t.toLowerCase().includes('all flavors'));
      if (activeTabs.length > 0) {
        catSelect.innerHTML = activeTabs.map(c => `<option value="${c}">${c}</option>`).join('') + `<option value="Special">Special Edition</option>`;
      }
    }
  }

  function closeAddProductModal() {
    const modal = document.getElementById('editorAddProdModal');
    if (modal) modal.classList.remove('is-active');
    document.body.classList.remove('editor-modal-open');
  }

  function addNewProductFromForm() {
    const name = document.getElementById('newProdName').value.trim();
    const price = document.getElementById('newProdPrice').value.trim() || '229';
    const category = document.getElementById('newProdCategory').value.trim() || 'Vanilla';
    const notes = document.getElementById('newProdNotes').value.trim() || 'Fresh slow-churned sweet cream with premium artisanal toppings.';
    const imgUrl = document.getElementById('newProdImgUrl').value.trim() || 'assets/images/vanilla.png';

    if (!name) {
      showEditorToast("Please enter a product name", "⚠️");
      return;
    }

    const grid = document.getElementById('bestsellersGrid');
    if (!grid) return;

    const prodId = 'prod-custom-' + Date.now();
    const card = document.createElement('div');
    card.className = 'product-card reveal-slide-up stagger-1 is-revealed anim-pop-in';
    card.id = 'card-' + prodId;
    card.setAttribute('data-category', category.toLowerCase());

    card.innerHTML = `
      <button class="editor-card-del-btn" title="Delete this product">✕</button>
      <button class="product-wishlist-btn" title="Save to favorites">♡</button>
      <div class="product-image-container">
        <img src="${imgUrl}" alt="${name}" class="product-image" id="img-${prodId}">
      </div>
      <div class="product-card-body">
        <div class="product-badge-row">
          <span class="product-cat-tag">${category}</span>
          <span class="product-new-tag">NEW ✨</span>
        </div>
        <div class="product-header-row">
          <h3 class="product-title">${name}</h3>
          <div class="product-rating">★ 5.0</div>
        </div>
        <p class="product-tasting-notes">${notes}</p>
        <div class="product-card-footer">
          <div class="product-price">₹${price}</div>
          <div class="product-card-actions">
            <div class="qty-stepper">
              <button class="qty-btn">−</button>
              <span class="qty-number">1</span>
              <button class="qty-btn">+</button>
            </div>
            <button class="btn btn-dark btn-card-add">ADD +</button>
          </div>
        </div>
      </div>
    `;

    // Attach delete button handler
    card.querySelector('.editor-card-del-btn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteProductCard(card);
    });

    // Attach stepper & add to cart
    const minusBtn = card.querySelector('.qty-btn:first-child');
    const plusBtn = card.querySelector('.qty-btn:last-child');
    const qtyVal = card.querySelector('.qty-number');
    let qty = 1;
    minusBtn.addEventListener('click', () => { if (qty > 1) { qty--; qtyVal.textContent = qty; } });
    plusBtn.addEventListener('click', () => { if (qty < 20) { qty++; qtyVal.textContent = qty; } });
    card.querySelector('.btn-card-add').addEventListener('click', () => {
      if (window.Cart) {
        window.Cart.addItem({
          id: prodId,
          name: name,
          price: parseInt(price, 10),
          image: imgUrl,
          category: category
        }, qty, card.querySelector('.product-image'));
      }
    });

    grid.insertBefore(card, grid.firstChild);
    updateCatalogCounters();
    closeAddProductModal();
    showEditorToast(`Added "${name}" to shop! Click Publish Live to save.`, "🎉");

    // Clear form
    document.getElementById('newProdName').value = '';
    document.getElementById('newProdNotes').value = '';
  }

  function updateCatalogCounters() {
    const allCards = document.querySelectorAll('.product-card');
    const allTab = document.querySelector('.shop-tab[data-filter="all"]');
    if (allTab) {
      allTab.textContent = `All Flavors (${allCards.length})`;
    }
  }

  // ==========================================================================
  // 7. CATEGORY MANAGEMENT
  // ==========================================================================
  function setupCategoryControls() {
    const tabsContainer = document.getElementById('shopFilterTabs');
    if (!tabsContainer) return;

    // Attach delete cross to non-all tabs
    tabsContainer.querySelectorAll('.shop-tab').forEach(tab => {
      if (tab.getAttribute('data-filter') !== 'all' && !tab.querySelector('.editor-cat-del-btn')) {
        const delBtn = document.createElement('span');
        delBtn.className = 'editor-cat-del-btn';
        delBtn.textContent = '✕';
        delBtn.title = 'Delete category';
        delBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          tab.remove();
          showEditorToast("Category removed!", "🗑️");
        });
        tab.appendChild(delBtn);
      }
    });

    // Add Category button
    if (!document.getElementById('editorAddCatBtn')) {
      const addCatBtn = document.createElement('button');
      addCatBtn.type = 'button';
      addCatBtn.id = 'editorAddCatBtn';
      addCatBtn.className = 'editor-cat-add-btn';
      addCatBtn.innerHTML = `<span>➕ Add Category</span>`;
      addCatBtn.addEventListener('click', () => {
        const catName = prompt("Enter new category name (e.g. 'Vegan Sorbet' or '🍫 Truffles'):");
        if (catName && catName.trim()) {
          const filterSlug = catName.toLowerCase().replace(/[^a-z0-9]/g, '');
          const newTab = document.createElement('button');
          newTab.className = 'shop-tab';
          newTab.setAttribute('data-filter', filterSlug);
          newTab.textContent = catName.trim();

          const del = document.createElement('span');
          del.className = 'editor-cat-del-btn';
          del.textContent = '✕';
          del.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            newTab.remove();
          });
          newTab.appendChild(del);

          newTab.addEventListener('click', function() {
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            newTab.classList.add('active');
            filterCatalogBy(filterSlug);
          });

          tabsContainer.insertBefore(newTab, addCatBtn);
          showEditorToast(`Category "${catName}" added!`, "✨");
        }
      });
      tabsContainer.appendChild(addCatBtn);
    }
  }

  function filterCatalogBy(slug) {
    document.querySelectorAll('.product-card').forEach(card => {
      if (slug === 'all') {
        card.style.display = '';
      } else {
        const tag = card.querySelector('.product-cat-tag')?.textContent.toLowerCase() || '';
        const dataCat = (card.getAttribute('data-category') || '').toLowerCase();
        if (tag.includes(slug) || dataCat.includes(slug)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      }
    });
  }

  // ==========================================================================
  // 8. SECTION SCROLL ENTRANCE OBSERVER
  // ==========================================================================
  function initSectionScrollObserver() {
    const sections = document.querySelectorAll(
      '#heroSection, #bestsellersSection, #boxBuilderSection, #storySection, #reviewsSection, #storeSection, #footerContact'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animStyle = document.body.dataset.sectionAnim || activeSectionAnim;
          entry.target.classList.add('sec-animated');
          entry.target.classList.add('anim-sec-' + animStyle);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    sections.forEach(sec => {
      sec.classList.add('sec-animate-ready');
      observer.observe(sec);
    });
  }

  function setSectionAnimationPreset(preset) {
    activeSectionAnim = preset;
    document.body.dataset.sectionAnim = preset;
    const sections = document.querySelectorAll('.sec-animate-ready');
    const classes = ['anim-sec-slide-up', 'anim-sec-blur-in', 'anim-sec-zoom-in', 'anim-sec-float'];
    sections.forEach(sec => {
      classes.forEach(c => sec.classList.remove(c));
      sec.classList.add('anim-sec-' + preset);
    });
    showEditorToast(`Section scroll effect set to: ${preset}!`, "🎬");
  }

  // ==========================================================================
  // 9. INTERACTIVE MOUSE CURSOR FX ENGINE
  // ==========================================================================
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let cursorBlobEl = null;
  let cursorGlowEl = null;
  let lastSprinkleTime = 0;

  function initMouseFxEngine() {
    setCursorFx(activeCursorFx);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (activeCursorFx === 'sprinkles') {
        const now = Date.now();
        if (now - lastSprinkleTime > 40) {
          lastSprinkleTime = now;
          spawnSprinkleParticle(mouseX, mouseY);
        }
      } else if (activeCursorFx === 'glow' && cursorGlowEl) {
        cursorGlowEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    }, { passive: true });

    // Blob physics loop
    function updateBlobPhysics() {
      if (activeCursorFx === 'blob' && cursorBlobEl) {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        followerX += dx * 0.18;
        followerY += dy * 0.18;
        const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 30);
        const stretch = 1 + speed * 0.015;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        cursorBlobEl.style.transform = `translate(${followerX}px, ${followerY}px) rotate(${angle}deg) scale(${stretch}, ${2 - stretch})`;
      }
      requestAnimationFrame(updateBlobPhysics);
    }
    requestAnimationFrame(updateBlobPhysics);

    // Hover detection for blob expansion
    document.addEventListener('mouseover', (e) => {
      if (cursorBlobEl && e.target.closest('button, a, input, .product-card, .shop-tab, .flavor-pill')) {
        cursorBlobEl.classList.add('is-hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (cursorBlobEl && e.target.closest('button, a, input, .product-card, .shop-tab, .flavor-pill')) {
        cursorBlobEl.classList.remove('is-hovering');
      }
    });
  }

  function setCursorFx(fxMode) {
    activeCursorFx = fxMode;
    document.body.dataset.cursorFx = fxMode;

    // Clean up existing elements
    if (cursorBlobEl) { cursorBlobEl.remove(); cursorBlobEl = null; }
    if (cursorGlowEl) { cursorGlowEl.remove(); cursorGlowEl = null; }

    if (fxMode === 'blob') {
      cursorBlobEl = document.createElement('div');
      cursorBlobEl.className = 'cursor-blob-follower';
      document.body.appendChild(cursorBlobEl);
    } else if (fxMode === 'glow') {
      cursorGlowEl = document.createElement('div');
      cursorGlowEl.className = 'cursor-glow-spotlight';
      document.body.appendChild(cursorGlowEl);
    }
  }

  function spawnSprinkleParticle(x, y) {
    const colors = ['#FF5E7E', '#E5A823', '#6E9E53', '#321D17', '#F59E0B', '#3B82F6', '#EC4899'];
    const p = document.createElement('div');
    p.className = 'sprinkle-particle';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty('--rot', `${Math.floor(Math.random() * 360)}deg`);
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
    p.style.setProperty('--dy', `${20 + Math.random() * 35}px`);
    document.body.appendChild(p);

    setTimeout(() => p.remove(), 800);
  }

  // ==========================================================================
  // 10. ANIMATION INSPECTOR
  // ==========================================================================
  function clearInspector() {
    if (hoveredElement) {
      hoveredElement.classList.remove('editor-inspect-highlight');
      hoveredElement = null;
    }
    if (selectedElement) {
      selectedElement.classList.remove('editor-inspect-selected');
      selectedElement = null;
    }
  }

  function selectElementForAnimation(el) {
    if (selectedElement) {
      selectedElement.classList.remove('editor-inspect-selected');
    }
    selectedElement = el;
    selectedElement.classList.add('editor-inspect-selected');

    const panel = document.getElementById('editorAnimPanel');
    const tagEl = document.getElementById('animTargetTag');
    if (panel && tagEl) {
      panel.classList.add('is-active');
      const cls = typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '';
      tagEl.textContent = `${el.tagName.toLowerCase()}${cls}`.slice(0, 20);
      updateAnimButtonsState();
    }
  }

  function updateAnimButtonsState() {
    if (!selectedElement) return;
    const presets = ['anim-fade-in', 'anim-blur-in', 'anim-float-up', 'anim-slide-up', 'anim-pop-in', 'anim-wobble'];
    document.querySelectorAll('.editor-preset-btn').forEach(btn => {
      const animName = btn.getAttribute('data-anim');
      btn.classList.toggle('is-selected', selectedElement.classList.contains(animName));
    });
  }

  function applyAnimation(animName) {
    if (!selectedElement) return;
    const presets = ['anim-fade-in', 'anim-blur-in', 'anim-float-up', 'anim-slide-up', 'anim-pop-in', 'anim-wobble'];
    presets.forEach(p => selectedElement.classList.remove(p));

    selectedElement.classList.add(animName);

    const dur = document.getElementById('animDurationSlider').value;
    const delay = document.getElementById('animDelaySlider').value;
    selectedElement.style.setProperty('--anim-duration', `${dur}s`);
    selectedElement.style.setProperty('--anim-delay', `${delay}s`);

    void selectedElement.offsetWidth;
    updateAnimButtonsState();
    showEditorToast(`Applied ${animName.replace('anim-', '')}!`, "🎬");
  }

  function replayAnimation() {
    if (!selectedElement) return;
    const presets = ['anim-fade-in', 'anim-blur-in', 'anim-float-up', 'anim-slide-up', 'anim-pop-in', 'anim-wobble'];
    const activeAnim = presets.find(p => selectedElement.classList.contains(p));
    if (!activeAnim) {
      applyAnimation('anim-blur-in');
      return;
    }
    selectedElement.classList.remove(activeAnim);
    void selectedElement.offsetWidth;
    selectedElement.classList.add(activeAnim);
  }

  function removeAnimation() {
    if (!selectedElement) return;
    const presets = ['anim-fade-in', 'anim-blur-in', 'anim-float-up', 'anim-slide-up', 'anim-pop-in', 'anim-wobble'];
    presets.forEach(p => selectedElement.classList.remove(p));
    selectedElement.style.removeProperty('--anim-duration');
    selectedElement.style.removeProperty('--anim-delay');
    updateAnimButtonsState();
    showEditorToast("Animation removed", "🗑️");
  }

  function closeAnimPanel() {
    const panel = document.getElementById('editorAnimPanel');
    if (panel) panel.classList.remove('is-active');
  }

  // ==========================================================================
  // 11. IMAGE REPLACER
  // ==========================================================================
  function openImageReplacer(imgEl) {
    targetImageEl = imgEl;
    const modal = document.getElementById('editorImgModal');
    const preview = document.getElementById('editorImgPreview');
    const urlInput = document.getElementById('editorImgUrlInput');

    if (!modal || !targetImageEl) return;

    document.body.classList.add('editor-modal-open');
    preview.src = targetImageEl.src;
    urlInput.value = targetImageEl.src.startsWith('data:') ? '' : targetImageEl.src;
    modal.classList.add('is-active');
  }

  function closeImgModal() {
    const modal = document.getElementById('editorImgModal');
    if (modal) modal.classList.remove('is-active');
    document.body.classList.remove('editor-modal-open');
    targetImageEl = null;
  }

  async function handleImageUpload(file) {
    if (!file || !targetImageEl) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
      const base64Data = e.target.result;
      const preview = document.getElementById('editorImgPreview');
      if (preview) preview.src = base64Data;

      showEditorToast("Uploading image to server...", "⏳");
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64Data,
            filename: file.name,
            pin: SECRET_PIN
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          targetImageEl.src = data.url;
          targetImageEl.removeAttribute('srcset');
          closeImgModal();
          showEditorToast("Image replaced & saved!", "🎉");
        } else {
          targetImageEl.src = base64Data;
          closeImgModal();
          showEditorToast("Image applied locally", "🖼️");
        }
      } catch (err) {
        targetImageEl.src = base64Data;
        closeImgModal();
        showEditorToast("Image applied locally", "🖼️");
      }
    };
    reader.readAsDataURL(file);
  }

  // ==========================================================================
  // 12. PUBLISH LIVE TO SERVER
  // ==========================================================================
  async function publishLive() {
    const publishBtn = document.getElementById('editorPublishBtn');
    if (publishBtn) {
      publishBtn.disabled = true;
      publishBtn.innerHTML = `⏳ Publishing...`;
    }

    try {
      disableInlineEditing();
      clearInspector();

      const docClone = document.documentElement.cloneNode(true);

      // Remove all injected editor UI elements
      const editorIds = [
        'editorPinModal', 'visualEditorDock', 'editorAnimPanel', 'editorImgModal',
        'editorAddProdModal', 'editorToastBanner', 'catalogAddScoopBtn', 'editorAddCatBtn'
      ];
      editorIds.forEach(id => {
        const el = docClone.querySelector('#' + id);
        if (el) el.remove();
      });

      // Remove card delete buttons and category delete crosses
      docClone.querySelectorAll('.editor-card-del-btn, .editor-cat-del-btn, .sprinkle-particle, .cursor-blob-follower, .cursor-glow-spotlight').forEach(el => el.remove());

      const bodyClone = docClone.querySelector('body');
      if (bodyClone) {
        bodyClone.classList.remove('editor-active');
        bodyClone.classList.remove('mode-media');
        bodyClone.classList.remove('pin-modal-open');
        bodyClone.classList.remove('editor-modal-open');
        bodyClone.dataset.cursorFx = activeCursorFx;
        bodyClone.dataset.sectionAnim = activeSectionAnim;
      }

      const cleanHtml = '<!DOCTYPE html>\n' + docClone.outerHTML;

      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: cleanHtml,
          pin: SECRET_PIN
        })
      });

      const data = await res.json();
      if (data.success) {
        showEditorToast("🚀 Published Live! Visible to all visitors.", "🎉");
      } else {
        showEditorToast(`Publish failed: ${data.error || 'Server error'}`, "⚠️");
      }
    } catch (err) {
      showEditorToast(`Publish error: ${err.message}`, "⚠️");
    } finally {
      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.innerHTML = `🚀 Publish Live`;
      }
      if (currentMode === 'text') enableInlineEditing();
    }
  }

  // ==========================================================================
  // 13. EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // PIN Modal input navigation
    const digits = document.querySelectorAll('.editor-pin-digit');
    digits.forEach((digit, idx) => {
      digit.addEventListener('input', () => {
        if (digit.value && idx < digits.length - 1) {
          digits[idx + 1].focus();
        }
        if (Array.from(digits).every(d => d.value.length === 1)) {
          checkPin();
        }
      });

      digit.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !digit.value && idx > 0) {
          digits[idx - 1].focus();
        }
        if (e.key === 'Enter') {
          checkPin();
        }
      });
    });

    document.getElementById('editorPinCancel').addEventListener('click', closePinModal);
    document.getElementById('editorPinSubmit').addEventListener('click', checkPin);

    // Dock Mode Buttons
    document.getElementById('toolBtnText').addEventListener('click', () => setMode('text'));
    document.getElementById('toolBtnAnimate').addEventListener('click', () => setMode('animate'));
    document.getElementById('toolBtnMedia').addEventListener('click', () => setMode('media'));
    document.getElementById('editorPublishBtn').addEventListener('click', publishLive);
    document.getElementById('editorCloseBtn').addEventListener('click', closeEditorDock);

    // Section Animation Selector
    const secSelect = document.getElementById('editorSectionAnimSelect');
    if (secSelect) {
      secSelect.addEventListener('change', () => setSectionAnimationPreset(secSelect.value));
    }

    // Cursor FX Selector
    const curSelect = document.getElementById('editorCursorFxSelect');
    if (curSelect) {
      curSelect.addEventListener('change', () => {
        setCursorFx(curSelect.value);
        showEditorToast(`Mouse cursor set to: ${curSelect.options[curSelect.selectedIndex].text}!`, "🖱️");
      });
    }

    // Add Product Modal Form Handlers
    document.getElementById('cancelAddProdBtn').addEventListener('click', closeAddProductModal);
    document.getElementById('closeAddProdModal').addEventListener('click', closeAddProductModal);
    document.getElementById('submitAddProdBtn').addEventListener('click', addNewProductFromForm);
    const newProdFileInput = document.getElementById('newProdFileInput');
    if (newProdFileInput) {
      newProdFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const r = new FileReader();
          r.onload = (ev) => {
            document.getElementById('newProdImgUrl').value = ev.target.result;
            showEditorToast("Image selected for new product", "📷");
          };
          r.readAsDataURL(e.target.files[0]);
        }
      });
    }

    // Global Inspector Clicks & Hovers
    document.addEventListener('mouseover', (e) => {
      if (!editorUnlocked || !document.body.classList.contains('editor-active')) return;
      if (e.target.closest('#visualEditorDock, #editorAnimPanel, #editorImgModal, #editorPinModal, #editorAddProdModal, #editorToastBanner')) return;

      if (currentMode === 'animate') {
        if (hoveredElement && hoveredElement !== e.target) {
          hoveredElement.classList.remove('editor-inspect-highlight');
        }
        hoveredElement = e.target;
        hoveredElement.classList.add('editor-inspect-highlight');
      } else if (currentMode === 'media') {
        const img = e.target.tagName === 'IMG' ? e.target : e.target.querySelector('img');
        if (img) {
          if (hoveredElement && hoveredElement !== img) hoveredElement.classList.remove('editor-inspect-highlight');
          hoveredElement = img;
          hoveredElement.classList.add('editor-inspect-highlight');
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!editorUnlocked || !document.body.classList.contains('editor-active')) return;
      if (e.target.closest('#visualEditorDock, #editorAnimPanel, #editorImgModal, #editorPinModal, #editorAddProdModal, #editorToastBanner')) return;

      if (currentMode === 'animate') {
        e.preventDefault();
        e.stopPropagation();
        selectElementForAnimation(e.target);
      } else if (currentMode === 'media') {
        const img = e.target.tagName === 'IMG' ? e.target : e.target.querySelector('img');
        if (img) {
          e.preventDefault();
          e.stopPropagation();
          openImageReplacer(img);
        }
      }
    }, true);

    // Animation Controls
    document.querySelectorAll('.editor-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyAnimation(btn.getAttribute('data-anim'));
      });
    });

    const durSlider = document.getElementById('animDurationSlider');
    const durVal = document.getElementById('animDurationVal');
    durSlider.addEventListener('input', () => {
      durVal.textContent = `${durSlider.value}s`;
      if (selectedElement) selectedElement.style.setProperty('--anim-duration', `${durSlider.value}s`);
    });

    const delaySlider = document.getElementById('animDelaySlider');
    const delayVal = document.getElementById('animDelayVal');
    delaySlider.addEventListener('input', () => {
      delayVal.textContent = `${delaySlider.value}s`;
      if (selectedElement) selectedElement.style.setProperty('--anim-delay', `${delaySlider.value}s`);
    });

    document.getElementById('animPlayBtn').addEventListener('click', replayAnimation);
    document.getElementById('animClearBtn').addEventListener('click', removeAnimation);

    // Image Replacer controls
    const fileInput = document.getElementById('editorFileInput');
    const dropzone = document.getElementById('editorDropzone');
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleImageUpload(e.target.files[0]);
    });

    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.background = '#FFD9E4'; });
    dropzone.addEventListener('dragleave', () => { dropzone.style.background = '#FFEBF0'; });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.background = '#FFEBF0';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
    });

    document.getElementById('editorImgCancel').addEventListener('click', closeImgModal);
    document.getElementById('editorImgApply').addEventListener('click', () => {
      const url = document.getElementById('editorImgUrlInput').value.trim();
      if (url && targetImageEl) {
        targetImageEl.src = url;
        targetImageEl.removeAttribute('srcset');
        closeImgModal();
        showEditorToast("Image replaced successfully!", "🖼️");
      }
    });

    // Escape Key to Close Modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePinModal();
        closeImgModal();
        closeAnimPanel();
        closeAddProductModal();
      }
    });
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initEditorUI();
      setupTripleClickTrigger();
    });
  } else {
    initEditorUI();
    setupTripleClickTrigger();
  }

  // Export globals for testing or console access
  window.MeltEditor = {
    openPinModal,
    unlock: (pin = SECRET_PIN) => {
      if (pin === SECRET_PIN) {
        editorUnlocked = true;
        closePinModal();
        openEditorDock();
      }
    },
    close: closeEditorDock,
    publish: publishLive,
    setCursorFx,
    setSectionAnimationPreset,
    openAddProductModal
  };
})();
