/* Melt & Scoop™ - Secret Live Visual Studio, CMS & Animation Engine */

(function() {
  const SECRET_PIN = "4321";
  let editorUnlocked = false;
  let currentMode = 'text'; // 'text' | 'animate' | 'media' | 'transform'
  let selectedElement = null;
  let hoveredElement = null;
  let selectedTransformElement = null;
  let isTransformCanvasDragging = false;
  let canvasDragStartX = 0;
  let canvasDragStartY = 0;
  let canvasInitX = 0;
  let canvasInitY = 0;
  let clickTimestamps = [];
  let targetImageEl = null;

  // Universal Multi-Viewer Sync & Auto-Save State
  let autoSaveTimer = null;
  let isAutoSaving = false;
  let lastLocalPublishTimestamp = 0;
  let lastKnownDocHash = 0;
  let isSyncChecking = false;

  // Fast hash calculator for document synchronization
  function calculateHash(str) {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + code;
      hash |= 0;
    }
    return hash;
  }

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

    // Admin access removed - Secret Left/Right drag gesture directly toggles the Studio Dock

    // B. Floating Studio Dock (with Cursor FX & Section Entrance Selectors)
    const dock = document.createElement('div');
    dock.id = 'visualEditorDock';
    dock.className = 'editor-dock';
    dock.innerHTML = `
      <div class="editor-dock-brand">
        <span class="editor-dock-status-dot"></span>
        <span>STUDIO LIVE</span>
        <span id="editorAutoSaveBadge" class="editor-save-status is-saved">✓ Live</span>
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
      <button type="button" class="editor-tool-btn" id="toolBtnTransform" data-mode="transform" title="Select any item to Move, Rotate, or Scale">
        📐 Move & Scale
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
          <option value="scooper">🥄 Ice Cream Scoop</option>
          <option value="sparkles">⭐ Golden Stardust</option>
          <option value="bubbles">🫧 Soda Bubbles</option>
          <option value="berries">🍓 Berry Blast</option>
          <option value="chocolate">🍫 Molten Ganache</option>
          <option value="sakura">🌸 Cherry Blossom</option>
          <option value="waffle">🧇 Waffle Crunch</option>
          <option value="swirl">🍦 Soft Serve Ribbon</option>
          <option value="confetti">🎉 Party Confetti</option>
          <option value="frost">❄️ Sub-Zero Frost</option>
          <option value="hearts">💖 Sweet Hearts</option>
          <option value="caramel">🔥 Toffee Caramel</option>
          <option value="galaxy">🌌 Cosmic Nebula</option>
          <option value="neon">⚡ Neon Electric</option>
          <option value="magic">🪄 Pixie Dust Wand</option>
          <option value="none">⚪ Default Minimal</option>
        </select>
      </div>
      <div class="editor-dock-divider"></div>
      <button type="button" class="editor-tool-export-btn" id="editorExportBtn" title="Download updated index.html for all viewers">
        💾 Export HTML
      </button>
      <button type="button" class="editor-tool-publish-btn" id="editorPublishBtn" title="Publish live so all viewers see changes">
        🚀 Publish Live
      </button>
      <button type="button" class="editor-tool-close-btn" id="editorCloseBtn" title="Exit Studio Mode">
        ✕
      </button>
    `;
    document.body.appendChild(dock);

    // Floating Quick Toggle for Every Viewer (Universal Access)
    if (!document.getElementById('floatingEditToggleBtn')) {
      const quickToggle = document.createElement('button');
      quickToggle.id = 'floatingEditToggleBtn';
      quickToggle.className = 'editor-quick-toggle';
      quickToggle.type = 'button';
      quickToggle.title = 'Edit Website Live (Accessible to all viewers)';
      quickToggle.setAttribute('aria-label', 'Open Live Website Studio');
      quickToggle.innerHTML = `
        <span class="toggle-icon">⚡</span>
        <span id="quickToggleText">Edit Website</span>
      `;
      quickToggle.addEventListener('click', () => {
        editorUnlocked = true;
        toggleEditorDock();
      });
      document.body.appendChild(quickToggle);
    }

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

    // C2. Transform Controls Panel
    const transformPanel = document.createElement('div');
    transformPanel.id = 'editorTransformPanel';
    transformPanel.className = 'editor-transform-panel';
    transformPanel.innerHTML = `
      <div class="editor-transform-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.1rem;">📐</span>
          <div>
            <div style="font-weight:800; font-size:0.9rem; color:#FFFFFF;">Transform Studio</div>
            <span class="editor-transform-target-tag" id="transformTargetTag">Select an element</span>
          </div>
        </div>
        <button type="button" class="editor-tool-close-btn" id="closeTransformPanel" style="width:24px; height:24px; font-size:0.75rem;">✕</button>
      </div>

      <div class="editor-transform-tip">
        <span>💡 Tip:</span> Click & drag any element on the page, or fine-tune with sliders below!
      </div>

      <!-- Position X & Y -->
      <div class="editor-transform-section">
        <div class="editor-transform-row-header">
          <span>📍 Position (Move)</span>
          <span class="editor-transform-val" id="transformPosVal">X: 0px, Y: 0px</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
          <div>
            <label style="font-size:0.7rem; color:rgba(255,255,255,0.6); display:block; margin-bottom:2px;">X Offset</label>
            <input type="range" min="-300" max="300" value="0" class="editor-anim-slider" id="transformPosXSlider">
          </div>
          <div>
            <label style="font-size:0.7rem; color:rgba(255,255,255,0.6); display:block; margin-bottom:2px;">Y Offset</label>
            <input type="range" min="-300" max="300" value="0" class="editor-anim-slider" id="transformPosYSlider">
          </div>
        </div>
        <div style="display:flex; justify-content:center; gap:5px;">
          <button type="button" class="editor-nudge-btn" id="nudgeLeft">← 5px</button>
          <button type="button" class="editor-nudge-btn" id="nudgeUp">↑ 5px</button>
          <button type="button" class="editor-nudge-btn" id="nudgeDown">↓ 5px</button>
          <button type="button" class="editor-nudge-btn" id="nudgeRight">→ 5px</button>
          <button type="button" class="editor-nudge-btn" id="resetPosBtn">Center</button>
        </div>
      </div>

      <!-- Rotation -->
      <div class="editor-transform-section">
        <div class="editor-transform-row-header">
          <span>🔄 Rotation</span>
          <span class="editor-transform-val" id="transformRotVal">0°</span>
        </div>
        <input type="range" min="-180" max="180" value="0" class="editor-anim-slider" id="transformRotSlider">
        <div style="display:flex; justify-content:space-between; gap:4px; margin-top:8px;">
          <button type="button" class="editor-nudge-btn" id="rotMinus15">-15°</button>
          <button type="button" class="editor-nudge-btn" id="rotPlus15">+15°</button>
          <button type="button" class="editor-nudge-btn" id="rotZero">0° Flat</button>
          <button type="button" class="editor-nudge-btn" id="rot90">90°</button>
          <button type="button" class="editor-nudge-btn" id="rot180">180°</button>
        </div>
      </div>

      <!-- Scale / Resize -->
      <div class="editor-transform-section">
        <div class="editor-transform-row-header">
          <span>🔍 Scale (Resize)</span>
          <span class="editor-transform-val" id="transformScaleVal">1.00x</span>
        </div>
        <input type="range" min="0.2" max="3.0" step="0.05" value="1.0" class="editor-anim-slider" id="transformScaleSlider">
        <div style="display:flex; justify-content:space-between; gap:4px; margin-top:8px;">
          <button type="button" class="editor-nudge-btn" id="scaleHalf">0.5x</button>
          <button type="button" class="editor-nudge-btn" id="scaleNormal">1.0x</button>
          <button type="button" class="editor-nudge-btn" id="scale125">1.25x</button>
          <button type="button" class="editor-nudge-btn" id="scale15">1.5x</button>
          <button type="button" class="editor-nudge-btn" id="scaleDouble">2.0x</button>
        </div>
      </div>

      <!-- Layering / Z-Index -->
      <div class="editor-transform-section">
        <div class="editor-transform-row-header">
          <span>📑 Layer Order (Z-Index)</span>
          <span class="editor-transform-val" id="transformZVal">Auto</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="editor-nudge-btn" style="flex:1;" id="layerForward">Bring Forward ⬆</button>
          <button type="button" class="editor-nudge-btn" style="flex:1;" id="layerBackward">Send Backward ⬇</button>
        </div>
      </div>

      <!-- Footer Actions -->
      <div style="display:flex; gap:8px; margin-top:4px;">
        <button type="button" class="editor-transform-reset-btn" id="resetTransformBtn">↺ Reset</button>
        <button type="button" class="editor-transform-done-btn" id="doneTransformBtn">✓ Done</button>
      </div>
    `;
    document.body.appendChild(transformPanel);

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
  // 2. SECRET LOGO TRIGGER (5 RAPID CLICKS - NO ADMIN PIN REQUIRED)
  // ==========================================================================
  function setupLogoClickTrigger() {
    const logos = document.querySelectorAll('.header-left-logo, .mobile-drawer-logo');
    logos.forEach(logo => {
      let clickTimes = [];
      let lastPointerUpTime = 0;

      logo.style.cursor = 'pointer';
      logo.style.touchAction = 'manipulation';
      logo.style.userSelect = 'none';
      logo.style.webkitUserSelect = 'none';

      const handleLogoTap = (e) => {
        const now = Date.now();

        // Prevent duplicate synthetic click event immediately following pointerup
        if (e.type === 'click' && (now - lastPointerUpTime < 450)) return;
        if (e.type === 'pointerup') lastPointerUpTime = now;

        clickTimes.push(now);

        // Keep clicks occurring within the last 3000ms (generous window)
        clickTimes = clickTimes.filter(t => now - t < 3000);

        // Prevent anchor navigation jump on rapid multi-clicks
        if (clickTimes.length > 1 && e.cancelable) {
          e.preventDefault();
        }

        // Subtle micro-pulse on intermediate clicks (2, 3, 4)
        if (clickTimes.length >= 2 && clickTimes.length < 5) {
          logo.classList.add('logo-pulse');
          setTimeout(() => logo.classList.remove('logo-pulse'), 180);
          if (navigator.vibrate) navigator.vibrate(15);
        }

        // 5th tap unlocks and opens Studio Mode directly!
        if (clickTimes.length >= 5) {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          clickTimes = [];

          // Gold celebratory shimmer
          logo.classList.add('logo-unlocked');
          setTimeout(() => logo.classList.remove('logo-unlocked'), 1200);

          if (navigator.vibrate) navigator.vibrate([25, 45, 25]);

          // NO ADMIN ACCESS / PIN REQUIRED! Works for anyone who knows the 5-tap secret
          editorUnlocked = true;
          showEditorToast("✨ 5 Taps Detected! Studio Mode Active.", "🍨");
          openEditorDock();
        }
      };

      logo.addEventListener('pointerup', handleLogoTap);
      logo.addEventListener('click', handleLogoTap);
    });
  }

  const setupLogoGestureTrigger = setupLogoClickTrigger;

  // ==========================================================================
  // 3. ADMIN ACCESS / PIN BYPASS
  // ==========================================================================
  function openPinModal() {
    // Admin access removed - open editor dock directly
    editorUnlocked = true;
    openEditorDock();
  }

  function closePinModal() {
    const modal = document.getElementById('editorPinModal');
    if (modal) modal.classList.remove('is-active');
    document.body.classList.remove('pin-modal-open');
  }

  function checkPin() {
    editorUnlocked = true;
    openEditorDock();
  }

  // ==========================================================================
  // REAL-TIME AUTO-SAVE & SERVER BROADCAST ENGINE
  // ==========================================================================
  function triggerAutoSave() {
    // Disabled background auto-save while editing to prevent losing focus or interrupting the editor.
    // Changes are published cleanly to disk when the user clicks 'Publish Live'.
  }

  async function performAutoSave() {
    // Explicit publish via publishLive() is used for clean, intentional saves
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

    // Sync floating toggle button state
    const quickToggle = document.getElementById('floatingEditToggleBtn');
    if (quickToggle) {
      quickToggle.classList.add('is-dock-open');
      const txt = quickToggle.querySelector('#quickToggleText');
      if (txt) txt.textContent = '✕ Close Studio';
    }

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
    if (!dock) return;
    dock.classList.remove('is-open');
    document.body.classList.remove('editor-active');
    document.body.classList.remove('mode-media');
    document.body.classList.remove('mode-transform');
    editorUnlocked = false;

    // Sync floating toggle button state - always ready to edit again
    const quickToggle = document.getElementById('floatingEditToggleBtn');
    if (quickToggle) {
      quickToggle.classList.remove('is-dock-open');
      const txt = quickToggle.querySelector('#quickToggleText');
      if (txt) txt.textContent = 'Edit Website';
    }

    disableInlineEditing();
    clearInspector();
    closeAnimPanel();
    closeTransformPanel();
    closeImgModal();
    showEditorToast("Returned to Normal Mode · Website is Always Editable", "✨");
  }

  function setMode(mode) {
    currentMode = mode;
    clearInspector();

    document.querySelectorAll('.editor-tool-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
    });

    document.body.classList.toggle('mode-media', mode === 'media');
    document.body.classList.toggle('mode-transform', mode === 'transform');

    if (mode === 'text') {
      enableInlineEditing();
      closeAnimPanel();
      closeTransformPanel();
      showEditorToast("Text Mode: Click any headline, tab, or price to edit!", "✏️");
    } else if (mode === 'animate') {
      disableInlineEditing();
      closeTransformPanel();
      showEditorToast("Animation Mode: Click any element to add/test animations!", "✨");
    } else if (mode === 'media') {
      disableInlineEditing();
      closeAnimPanel();
      closeTransformPanel();
      showEditorToast("Media Mode: Click on any image to replace it!", "🖼️");
    } else if (mode === 'transform') {
      disableInlineEditing();
      closeAnimPanel();
      showEditorToast("Transform Mode: Click and drag any item to Move, Rotate, or Scale!", "📐");
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
      if (el.closest('.editor-dock') || el.closest('.editor-pin-overlay') || el.closest('.editor-anim-panel') || el.closest('.editor-img-modal') || el.closest('.editor-add-prod-modal') || el.closest('#floatingEditToggleBtn')) return;
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');

      if (!el.dataset.hasEditorSaveListener) {
        el.dataset.hasEditorSaveListener = 'true';
        el.addEventListener('input', () => {
          triggerAutoSave('text-input', 1200);
        });
        el.addEventListener('blur', () => {
          triggerAutoSave('text-blur', 200);
        });
      }
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
      showEditorToast(`Removed "${title}"! Saving live...`, "🗑️");
      triggerAutoSave('del-product', 100);
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
    showEditorToast(`Added "${name}" to shop! Saving live...`, "🎉");
    triggerAutoSave('add-product', 100);

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
          showEditorToast("Category removed! Saving live...", "🗑️");
          triggerAutoSave('del-category', 100);
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
            showEditorToast("Category removed! Saving live...", "🗑️");
            triggerAutoSave('del-category', 100);
          });
          newTab.appendChild(del);

          newTab.addEventListener('click', function() {
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            newTab.classList.add('active');
            filterCatalogBy(filterSlug);
          });

          tabsContainer.insertBefore(newTab, addCatBtn);
          showEditorToast(`Category "${catName}" added! Saving live...`, "✨");
          triggerAutoSave('add-category', 100);
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
  // 9. INTERACTIVE MOUSE CURSOR FX ENGINE (19 TOTAL ARTISANAL OPTIONS)
  // ==========================================================================
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let prevMouseX = mouseX;
  let prevMouseY = mouseY;
  let followerX = mouseX;
  let followerY = mouseY;
  let cursorBlobEl = null;
  let cursorGlowEl = null;
  let cursorFollowerEl = null;
  let lastParticleTime = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;

  function initMouseFxEngine() {
    setCursorFx(activeCursorFx);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseVelX = mouseX - prevMouseX;
      mouseVelY = mouseY - prevMouseY;
      const speed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);

      const now = Date.now();
      const interval = speed > 20 ? 25 : 45;

      if (now - lastParticleTime > interval && speed > 1.2) {
        lastParticleTime = now;
        spawnCursorParticle(activeCursorFx, mouseX, mouseY, mouseVelX, mouseVelY);
      }

      if (activeCursorFx === 'glow' && cursorGlowEl) {
        cursorGlowEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }

      if (cursorFollowerEl) {
        if (activeCursorFx === 'scooper') {
          const angle = Math.atan2(mouseVelY, mouseVelX) * (180 / Math.PI);
          cursorFollowerEl.style.setProperty('--scoop-rot', `${angle - 45}deg`);
          cursorFollowerEl.style.transform = `translate(${mouseX}px, ${mouseY}px) rotate(${angle - 45}deg)`;
        } else if (activeCursorFx === 'magic') {
          cursorFollowerEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        } else if (activeCursorFx === 'neon') {
          cursorFollowerEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    }, { passive: true });

    // Interactive Click Bursts
    window.addEventListener('click', (e) => {
      const cx = e.clientX;
      const cy = e.clientY;

      if (activeCursorFx === 'scooper') {
        if (cursorFollowerEl) {
          cursorFollowerEl.classList.add('is-scooping');
          setTimeout(() => cursorFollowerEl && cursorFollowerEl.classList.remove('is-scooping'), 260);
        }
        for (let i = 0; i < 4; i++) {
          const drop = document.createElement('div');
          drop.className = 'cursor-scoop-drop';
          drop.style.left = `${cx + (Math.random() - 0.5) * 26}px`;
          drop.style.top = `${cy + (Math.random() - 0.5) * 26}px`;
          document.body.appendChild(drop);
          setTimeout(() => drop.remove(), 900);
        }
      } else if (activeCursorFx === 'sparkles' || activeCursorFx === 'magic') {
        for (let i = 0; i < 8; i++) {
          spawnCursorParticle(activeCursorFx, cx, cy, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
        }
      } else if (activeCursorFx === 'confetti') {
        for (let i = 0; i < 12; i++) {
          spawnCursorParticle('confetti', cx, cy, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60);
        }
      } else if (activeCursorFx === 'hearts') {
        for (let i = 0; i < 6; i++) {
          spawnCursorParticle('hearts', cx, cy, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35);
        }
      } else if (activeCursorFx === 'bubbles') {
        for (let i = 0; i < 6; i++) {
          spawnCursorParticle('bubbles', cx, cy, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
        }
      }
    });

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
    if (cursorFollowerEl) { cursorFollowerEl.remove(); cursorFollowerEl = null; }

    if (fxMode === 'blob') {
      cursorBlobEl = document.createElement('div');
      cursorBlobEl.className = 'cursor-blob-follower';
      document.body.appendChild(cursorBlobEl);
    } else if (fxMode === 'glow') {
      cursorGlowEl = document.createElement('div');
      cursorGlowEl.className = 'cursor-glow-spotlight';
      document.body.appendChild(cursorGlowEl);
    } else if (fxMode === 'scooper') {
      cursorFollowerEl = document.createElement('div');
      cursorFollowerEl.className = 'cursor-scooper-follower';
      cursorFollowerEl.innerHTML = '🥄';
      document.body.appendChild(cursorFollowerEl);
    } else if (fxMode === 'magic') {
      cursorFollowerEl = document.createElement('div');
      cursorFollowerEl.className = 'cursor-magic-follower';
      cursorFollowerEl.innerHTML = '🪄';
      document.body.appendChild(cursorFollowerEl);
    } else if (fxMode === 'neon') {
      cursorFollowerEl = document.createElement('div');
      cursorFollowerEl.className = 'cursor-neon-follower';
      document.body.appendChild(cursorFollowerEl);
    }
  }

  function spawnCursorParticle(type, x, y, vx, vy) {
    let p = null;
    let lifetime = 800;

    switch(type) {
      case 'sprinkles': {
        const colors = ['#FF5E7E', '#E5A823', '#6E9E53', '#321D17', '#F59E0B', '#3B82F6', '#EC4899'];
        p = document.createElement('div');
        p.className = 'sprinkle-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.setProperty('--rot', `${Math.floor(Math.random() * 360)}deg`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
        p.style.setProperty('--dy', `${20 + Math.random() * 35}px`);
        lifetime = 800;
        break;
      }
      case 'sparkles': {
        p = document.createElement('div');
        p.className = 'cursor-sparkle-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.textContent = ['✦', '★', '✧', '✨'][Math.floor(Math.random() * 4)];
        p.style.setProperty('--sz', `${Math.random() * 8 + 14}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 35}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 35}px`);
        lifetime = 750;
        break;
      }
      case 'bubbles': {
        p = document.createElement('div');
        p.className = 'cursor-bubble-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--sz', `${Math.random() * 12 + 10}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 30}px`);
        lifetime = 850;
        break;
      }
      case 'berries': {
        const berries = ['🍓', '🍒', '🫐', '🌸', '✨'];
        p = document.createElement('div');
        p.className = 'cursor-berry-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.textContent = berries[Math.floor(Math.random() * berries.length)];
        p.style.setProperty('--sz', `${Math.random() * 8 + 14}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 30}px`);
        p.style.setProperty('--rot', `${Math.floor(Math.random() * 180)}deg`);
        lifetime = 800;
        break;
      }
      case 'chocolate': {
        p = document.createElement('div');
        p.className = 'cursor-choc-particle';
        p.style.left = `${x + (Math.random() - 0.5) * 12}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--w', `${Math.random() * 4 + 8}px`);
        p.style.setProperty('--h', `${Math.random() * 8 + 14}px`);
        lifetime = 850;
        break;
      }
      case 'sakura': {
        p = document.createElement('div');
        p.className = 'cursor-sakura-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--sz', `${Math.random() * 6 + 10}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 45}px`);
        p.style.setProperty('--rot', `${Math.floor(Math.random() * 360)}deg`);
        lifetime = 950;
        break;
      }
      case 'waffle': {
        p = document.createElement('div');
        p.className = 'cursor-waffle-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--sz', `${Math.random() * 6 + 8}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 35}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 35}px`);
        lifetime = 850;
        break;
      }
      case 'swirl': {
        p = document.createElement('div');
        p.className = 'cursor-swirl-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--sz', `${Math.random() * 8 + 16}px`);
        lifetime = 650;
        break;
      }
      case 'confetti': {
        const colors = ['#FF5E7E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#FFE4E9'];
        p = document.createElement('div');
        p.className = 'cursor-confetti-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--bg-col', colors[Math.floor(Math.random() * colors.length)]);
        p.style.setProperty('--w', `${Math.random() * 5 + 6}px`);
        p.style.setProperty('--h', `${Math.random() * 6 + 9}px`);
        p.style.setProperty('--rad', Math.random() > 0.5 ? '50%' : '2px');
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 45}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 35}px`);
        lifetime = 900;
        break;
      }
      case 'frost': {
        const flakes = ['❄', '❅', '❆', '✧'];
        p = document.createElement('div');
        p.className = 'cursor-frost-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.textContent = flakes[Math.floor(Math.random() * flakes.length)];
        p.style.setProperty('--sz', `${Math.random() * 8 + 14}px`);
        lifetime = 850;
        break;
      }
      case 'hearts': {
        const hearts = ['💖', '💕', '💗', '🍓', '🌸'];
        p = document.createElement('div');
        p.className = 'cursor-heart-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        p.style.setProperty('--sz', `${Math.random() * 6 + 14}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 35}px`);
        lifetime = 950;
        break;
      }
      case 'caramel': {
        p = document.createElement('div');
        p.className = 'cursor-caramel-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--sz', `${Math.random() * 6 + 6}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 35}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 35}px`);
        lifetime = 750;
        break;
      }
      case 'galaxy': {
        const cols = ['#A855F7', '#EC4899', '#06B6D4', '#3B82F6', '#8B5CF6'];
        p = document.createElement('div');
        p.className = 'cursor-galaxy-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--sz', `${Math.random() * 6 + 8}px`);
        p.style.setProperty('--col', cols[Math.floor(Math.random() * cols.length)]);
        p.style.setProperty('--col2', cols[Math.floor(Math.random() * cols.length)]);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 30}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 30}px`);
        lifetime = 850;
        break;
      }
      case 'neon': {
        const cols = ['#06B6D4', '#F43F5E', '#10B981', '#A855F7'];
        p = document.createElement('div');
        p.className = 'cursor-neon-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--col', cols[Math.floor(Math.random() * cols.length)]);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 16}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 16}px`);
        lifetime = 600;
        break;
      }
      case 'magic': {
        const cols = ['#F472B6', '#FBBF24', '#60A5FA', '#34D399', '#C084FC'];
        p = document.createElement('div');
        p.className = 'cursor-magic-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.textContent = ['✦', '✧', '⋆', '★'][Math.floor(Math.random() * 4)];
        p.style.setProperty('--col', cols[Math.floor(Math.random() * cols.length)]);
        p.style.setProperty('--sz', `${Math.random() * 6 + 12}px`);
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 35}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 35}px`);
        lifetime = 750;
        break;
      }
      case 'scooper': {
        if (Math.random() > 0.4) {
          p = document.createElement('div');
          p.className = 'cursor-sparkle-particle';
          p.style.left = `${x + (Math.random() - 0.5) * 15}px`;
          p.style.top = `${y + (Math.random() - 0.5) * 15}px`;
          p.textContent = '🍦';
          p.style.setProperty('--sz', '12px');
          p.style.setProperty('--dx', `${(Math.random() - 0.5) * 20}px`);
          p.style.setProperty('--dy', `15px`);
          lifetime = 600;
        }
        break;
      }
    }

    if (p) {
      document.body.appendChild(p);
      setTimeout(() => p && p.remove(), lifetime);
    }
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
    if (selectedTransformElement) {
      selectedTransformElement.classList.remove('editor-transform-selected');
      selectedTransformElement = null;
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
  // 11. TRANSFORM STUDIO (POSITION, ROTATION & SCALE OF EVERYTHING)
  // ==========================================================================
  function openTransformPanel() {
    const panel = document.getElementById('editorTransformPanel');
    if (panel) panel.classList.add('is-active');
  }

  function closeTransformPanel() {
    const panel = document.getElementById('editorTransformPanel');
    if (panel) panel.classList.remove('is-active');
    if (selectedTransformElement) {
      selectedTransformElement.classList.remove('editor-transform-selected');
      selectedTransformElement = null;
    }
  }

  function selectElementForTransform(el) {
    if (selectedTransformElement) {
      selectedTransformElement.classList.remove('editor-transform-selected');
    }
    selectedTransformElement = el;
    selectedTransformElement.classList.add('editor-transform-selected');

    // Parse current transform values
    let x = 0;
    let y = 0;
    let rot = 0;
    let scale = 1;

    if (el.dataset.transformX !== undefined) {
      x = parseInt(el.dataset.transformX, 10) || 0;
      y = parseInt(el.dataset.transformY, 10) || 0;
      rot = parseFloat(el.dataset.transformRot) || 0;
      scale = parseFloat(el.dataset.transformScale) || 1;
    } else if (el.style.transform) {
      const trMatch = el.style.transform.match(/translate\(\s*(-?\d+)px\s*,\s*(-?\d+)px\s*\)/);
      if (trMatch) {
        x = parseInt(trMatch[1], 10) || 0;
        y = parseInt(trMatch[2], 10) || 0;
      }
      const rotMatch = el.style.transform.match(/rotate\(\s*(-?\d+(?:\.\d+)?)deg\s*\)/);
      if (rotMatch) {
        rot = parseFloat(rotMatch[1]) || 0;
      }
      const scMatch = el.style.transform.match(/scale\(\s*(-?\d+(?:\.\d+)?)\s*\)/);
      if (scMatch) {
        scale = parseFloat(scMatch[1]) || 1;
      }
    }

    const xSlider = document.getElementById('transformPosXSlider');
    const ySlider = document.getElementById('transformPosYSlider');
    const rotSlider = document.getElementById('transformRotSlider');
    const scaleSlider = document.getElementById('transformScaleSlider');

    if (xSlider) xSlider.value = x;
    if (ySlider) ySlider.value = y;
    if (rotSlider) rotSlider.value = rot;
    if (scaleSlider) scaleSlider.value = scale;

    const posVal = document.getElementById('transformPosVal');
    if (posVal) posVal.textContent = `X: ${x}px, Y: ${y}px`;
    const rotVal = document.getElementById('transformRotVal');
    if (rotVal) rotVal.textContent = `${rot}°`;
    const scaleVal = document.getElementById('transformScaleVal');
    if (scaleVal) scaleVal.textContent = `${scale.toFixed(2)}x`;
    const zVal = document.getElementById('transformZVal');
    if (zVal) zVal.textContent = el.style.zIndex || 'Auto';

    const tagLabel = el.tagName.toLowerCase() + (el.id ? '#' + el.id : (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''));
    const tagEl = document.getElementById('transformTargetTag');
    if (tagEl) tagEl.textContent = tagLabel.slice(0, 24);

    openTransformPanel();
    showEditorToast(`Selected: ${tagLabel}. Drag on canvas or use sliders!`, "📐");
  }

  function updateSelectedTransform() {
    if (!selectedTransformElement) return;

    const x = parseInt(document.getElementById('transformPosXSlider').value, 10) || 0;
    const y = parseInt(document.getElementById('transformPosYSlider').value, 10) || 0;
    const rot = parseFloat(document.getElementById('transformRotSlider').value) || 0;
    const scale = parseFloat(document.getElementById('transformScaleSlider').value) || 1;

    selectedTransformElement.dataset.transformX = x;
    selectedTransformElement.dataset.transformY = y;
    selectedTransformElement.dataset.transformRot = rot;
    selectedTransformElement.dataset.transformScale = scale;

    const computedPos = window.getComputedStyle(selectedTransformElement).position;
    if (computedPos === 'static') {
      selectedTransformElement.style.position = 'relative';
    }

    selectedTransformElement.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
    selectedTransformElement.style.transformOrigin = 'center center';

    const posVal = document.getElementById('transformPosVal');
    if (posVal) posVal.textContent = `X: ${x}px, Y: ${y}px`;
    const rotVal = document.getElementById('transformRotVal');
    if (rotVal) rotVal.textContent = `${rot}°`;
    const scaleVal = document.getElementById('transformScaleVal');
    if (scaleVal) scaleVal.textContent = `${scale.toFixed(2)}x`;
    triggerAutoSave('transform-scrub', 800);
  }

  function resetSelectedTransform() {
    if (!selectedTransformElement) return;
    delete selectedTransformElement.dataset.transformX;
    delete selectedTransformElement.dataset.transformY;
    delete selectedTransformElement.dataset.transformRot;
    delete selectedTransformElement.dataset.transformScale;
    delete selectedTransformElement.dataset.transformZ;

    selectedTransformElement.style.transform = '';
    selectedTransformElement.style.transformOrigin = '';
    selectedTransformElement.style.zIndex = '';
    selectedTransformElement.style.position = '';

    const xSlider = document.getElementById('transformPosXSlider');
    const ySlider = document.getElementById('transformPosYSlider');
    const rotSlider = document.getElementById('transformRotSlider');
    const scaleSlider = document.getElementById('transformScaleSlider');

    if (xSlider) xSlider.value = 0;
    if (ySlider) ySlider.value = 0;
    if (rotSlider) rotSlider.value = 0;
    if (scaleSlider) scaleSlider.value = 1;

    const posVal = document.getElementById('transformPosVal');
    if (posVal) posVal.textContent = `X: 0px, Y: 0px`;
    const rotVal = document.getElementById('transformRotVal');
    if (rotVal) rotVal.textContent = `0°`;
    const scaleVal = document.getElementById('transformScaleVal');
    if (scaleVal) scaleVal.textContent = `1.00x`;
    const zVal = document.getElementById('transformZVal');
    if (zVal) zVal.textContent = `Auto`;

    showEditorToast("Reset element to original layout", "↺");
    triggerAutoSave('transform-reset', 200);
  }

  function nudgePosition(dx, dy) {
    if (!selectedTransformElement) return;
    const xSlider = document.getElementById('transformPosXSlider');
    const ySlider = document.getElementById('transformPosYSlider');
    if (!xSlider || !ySlider) return;

    xSlider.value = Math.max(-300, Math.min(300, parseInt(xSlider.value, 10) + dx));
    ySlider.value = Math.max(-300, Math.min(300, parseInt(ySlider.value, 10) + dy));
    updateSelectedTransform();
  }

  function setRotationAngle(deg) {
    if (!selectedTransformElement) return;
    const rotSlider = document.getElementById('transformRotSlider');
    if (!rotSlider) return;
    rotSlider.value = deg;
    updateSelectedTransform();
  }

  function setTransformScale(s) {
    if (!selectedTransformElement) return;
    const scSlider = document.getElementById('transformScaleSlider');
    if (!scSlider) return;
    scSlider.value = s;
    updateSelectedTransform();
  }

  function changeLayerOrder(delta) {
    if (!selectedTransformElement) return;
    let curZ = parseInt(window.getComputedStyle(selectedTransformElement).zIndex, 10);
    if (isNaN(curZ)) curZ = 1;
    const newZ = Math.max(0, curZ + delta);
    selectedTransformElement.style.zIndex = newZ;
    selectedTransformElement.dataset.transformZ = newZ;

    const computedPos = window.getComputedStyle(selectedTransformElement).position;
    if (computedPos === 'static') selectedTransformElement.style.position = 'relative';

    const zVal = document.getElementById('transformZVal');
    if (zVal) zVal.textContent = newZ;
    showEditorToast(`Layer order: Z-Index ${newZ}`, "📑");
    triggerAutoSave('layer-order', 300);
  }

  // ==========================================================================
  // 12. PUBLISH LIVE & UNIVERSAL VIEWER AVAILABILITY
  // ==========================================================================
  function getCleanHtml() {
    disableInlineEditing();
    clearInspector();

    const docClone = document.documentElement.cloneNode(true);

    // Remove all injected editor UI elements
    const editorIds = [
      'editorPinModal', 'visualEditorDock', 'editorAnimPanel', 'editorTransformPanel', 'editorImgModal',
      'editorAddProdModal', 'editorToastBanner', 'catalogAddScoopBtn', 'editorAddCatBtn', 'floatingEditToggleBtn'
    ];
    editorIds.forEach(id => {
      const el = docClone.querySelector('#' + id);
      if (el) el.remove();
    });

    // Remove card delete buttons, category delete crosses, quick toggle, sync toasts, and live cursor followers & particles
    docClone.querySelectorAll('.editor-card-del-btn, .editor-cat-del-btn, .editor-quick-toggle, .editor-sync-toast, .sprinkle-particle, .cursor-blob-follower, .cursor-glow-spotlight, .cursor-scooper-follower, .cursor-magic-follower, .cursor-neon-follower, .cursor-scoop-drop, [class*="cursor-"][class*="-particle"]').forEach(el => el.remove());

    // Clean selection and highlight classes from cloned elements
    docClone.querySelectorAll('.editor-transform-selected, .editor-inspect-highlight, .editor-inspect-selected').forEach(el => {
      el.classList.remove('editor-transform-selected', 'editor-inspect-highlight', 'editor-inspect-selected');
    });

    // Clean auto-save event tracking attributes
    docClone.querySelectorAll('[data-has-editor-save-listener]').forEach(el => el.removeAttribute('data-has-editor-save-listener'));

    // Strip Dark Reader & third-party extension styles, scripts, and attributes
    docClone.querySelectorAll('style.darkreader, link.darkreader, meta[name*="darkreader"]').forEach(el => el.remove());
    ['data-darkreader-mode', 'data-darkreader-scheme', 'data-darkreader-proxy'].forEach(attr => {
      docClone.removeAttribute(attr);
    });
    docClone.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('data-darkreader')) el.removeAttribute(attr.name);
      });
    });

    const bodyClone = docClone.querySelector('body');
    if (bodyClone) {
      bodyClone.classList.remove('editor-active');
      bodyClone.classList.remove('mode-media');
      bodyClone.classList.remove('mode-transform');
      bodyClone.classList.remove('pin-modal-open');
      bodyClone.classList.remove('editor-modal-open');
      bodyClone.dataset.cursorFx = activeCursorFx;
      bodyClone.dataset.sectionAnim = activeSectionAnim;
    }

    if (currentMode === 'text') enableInlineEditing();

    return '<!DOCTYPE html>\n' + docClone.outerHTML;
  }

  function downloadUpdatedHtml(htmlContent) {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  function exportCleanHtml() {
    const cleanHtml = getCleanHtml();
    downloadUpdatedHtml(cleanHtml);
    showEditorToast("💾 Exported updated index.html! Ready to push or upload.", "📥");
  }

  async function publishLive() {
    const publishBtn = document.getElementById('editorPublishBtn');
    const badge = document.getElementById('editorAutoSaveBadge');
    if (publishBtn) {
      publishBtn.disabled = true;
      publishBtn.innerHTML = `⏳ Publishing...`;
    }
    if (badge) {
      badge.className = 'editor-save-status is-saving';
      badge.textContent = '⏳ Saving...';
    }

    try {
      const cleanHtml = getCleanHtml();
      lastLocalPublishTimestamp = Date.now();
      lastKnownDocHash = calculateHash(cleanHtml);

      // Persist to local browser storage so current device always retains latest version
      try {
        localStorage.setItem('melt_scoop_published_html', cleanHtml);
      } catch (e) {}

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
        showEditorToast(data.message || "🚀 Published Live! Changes saved to index.html and live for all viewers.", "🎉");
        // Exit admin mode and return to normal mode as requested by user
        setTimeout(() => {
          closeEditorDock();
        }, 600);
      } else {
        showEditorToast(`Publish note: ${data.error || 'Saved locally'}`, "⚠️");
      }
    } catch (err) {
      // Offline / static hosting fallback: Download updated HTML automatically
      const cleanHtml = getCleanHtml();
      downloadUpdatedHtml(cleanHtml);
      showEditorToast("💾 Saved locally & downloaded index.html! Upload to repository for all viewers.", "📥");
      setTimeout(() => {
        closeEditorDock();
      }, 600);
    } finally {
      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.innerHTML = `🚀 Publish Live`;
      }
    }
  }

  // ==========================================================================
  // MULTI-VIEWER REAL-TIME LIVE SYNCHRONIZATION ENGINE
  // ==========================================================================
  function initMultiViewerSync() {
    lastKnownDocHash = calculateHash(document.documentElement.innerHTML);

    // If coming from auto-sync reload, show polite confirmation toast
    try {
      const synced = sessionStorage.getItem('melt_scoop_just_synced');
      if (synced) {
        sessionStorage.removeItem('melt_scoop_just_synced');
        const syncNotice = document.createElement('div');
        syncNotice.className = 'editor-sync-toast is-visible';
        syncNotice.innerHTML = `<span>🍨</span><span>Site updated with latest live edits!</span>`;
        document.body.appendChild(syncNotice);
        setTimeout(() => {
          syncNotice.classList.remove('is-visible');
          setTimeout(() => syncNotice.remove(), 400);
        }, 2800);
      }
    } catch (e) {}

    // Background polling every 4 seconds
    setInterval(async () => {
      if (isSyncChecking) return;
      if (document.hidden) return;

      // CRITICAL: NEVER autorefresh when in admin mode!
      // Let the editor edit the website completely without any autorefresh or interference.
      const dock = document.getElementById('visualEditorDock');
      const isDockOpen = dock && dock.classList.contains('is-open');
      if (isDockOpen || editorUnlocked || document.body.classList.contains('editor-active')) {
        return; // Absolute block - never refresh while editor is in admin mode!
      }

      // Skip if local client just published within the last 8 seconds
      if (Date.now() - lastLocalPublishTimestamp < 8000) return;
      // Skip if user is actively typing in a contenteditable element
      if (document.activeElement && document.activeElement.isContentEditable) return;
      // Skip if currently dragging on canvas
      if (isTransformCanvasDragging) return;

      isSyncChecking = true;
      try {
        let hasChanged = false;

        // Check /api/version for ultra-fast tick check
        try {
          const verRes = await fetch('/api/version', { method: 'GET', cache: 'no-store' });
          if (verRes.status === 200) {
            const verData = await verRes.json();
            if (verData && verData.version) {
              const currentTicks = sessionStorage.getItem('melt_scoop_server_version');
              if (currentTicks && currentTicks !== verData.version) {
                hasChanged = true;
              }
              sessionStorage.setItem('melt_scoop_server_version', verData.version);
            }
          }
        } catch (e) {}

        // Fallback: Check index.html directly
        if (!hasChanged) {
          const res = await fetch('/index.html?syncCheck=' + Date.now(), {
            method: 'GET',
            cache: 'no-store'
          });

          if (res.status === 200) {
            const remoteHtml = await res.text();
            const remoteHash = calculateHash(remoteHtml);
            if (lastKnownDocHash !== 0 && remoteHash !== lastKnownDocHash) {
              hasChanged = true;
              lastKnownDocHash = remoteHash;
            }
          }
        }

        // Only reload for viewers who are in NORMAL MODE (NOT in admin mode!)
        if (hasChanged) {
          const currentDock = document.getElementById('visualEditorDock');
          if (currentDock && currentDock.classList.contains('is-open')) return;
          if (editorUnlocked || document.body.classList.contains('editor-active')) return;

          try {
            sessionStorage.setItem('melt_scoop_just_synced', 'true');
          } catch(e) {}

          setTimeout(() => {
            window.location.reload();
          }, 600);
        }
      } catch (err) {
      } finally {
        isSyncChecking = false;
      }
    }, 4000);
  }

  // ==========================================================================
  // 13. EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // PIN Modal input navigation (if modal present)
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

    const pinCancel = document.getElementById('editorPinCancel');
    if (pinCancel) pinCancel.addEventListener('click', closePinModal);
    const pinSubmit = document.getElementById('editorPinSubmit');
    if (pinSubmit) pinSubmit.addEventListener('click', checkPin);

    // Dock Mode Buttons
    document.getElementById('toolBtnText').addEventListener('click', () => setMode('text'));
    document.getElementById('toolBtnAnimate').addEventListener('click', () => setMode('animate'));
    document.getElementById('toolBtnMedia').addEventListener('click', () => setMode('media'));
    const trToolBtn = document.getElementById('toolBtnTransform');
    if (trToolBtn) trToolBtn.addEventListener('click', () => setMode('transform'));
    document.getElementById('editorPublishBtn').addEventListener('click', publishLive);
    const exportBtn = document.getElementById('editorExportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportCleanHtml);
    document.getElementById('editorCloseBtn').addEventListener('click', closeEditorDock);

    // Section Animation Selector
    const secSelect = document.getElementById('editorSectionAnimSelect');
    if (secSelect) {
      secSelect.addEventListener('change', () => {
        setSectionAnimationPreset(secSelect.value);
        triggerAutoSave('section-anim', 300);
      });
    }

    // Cursor FX Selector
    const curSelect = document.getElementById('editorCursorFxSelect');
    if (curSelect) {
      curSelect.addEventListener('change', () => {
        setCursorFx(curSelect.value);
        showEditorToast(`Mouse cursor set to: ${curSelect.options[curSelect.selectedIndex].text}!`, "🖱️");
        triggerAutoSave('cursor-fx', 300);
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
      if (e.target.closest('#visualEditorDock, #editorAnimPanel, #editorTransformPanel, #editorImgModal, #editorPinModal, #editorAddProdModal, #editorToastBanner, #floatingEditToggleBtn')) return;

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
      } else if (currentMode === 'transform') {
        if (hoveredElement && hoveredElement !== e.target) {
          hoveredElement.classList.remove('editor-inspect-highlight');
        }
        hoveredElement = e.target;
        hoveredElement.classList.add('editor-inspect-highlight');
      }
    });

    document.addEventListener('click', (e) => {
      if (!editorUnlocked || !document.body.classList.contains('editor-active')) return;
      if (e.target.closest('#visualEditorDock, #editorAnimPanel, #editorTransformPanel, #editorImgModal, #editorPinModal, #editorAddProdModal, #editorToastBanner, #floatingEditToggleBtn')) return;

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
      } else if (currentMode === 'transform') {
        e.preventDefault();
        e.stopPropagation();
        selectElementForTransform(e.target);
      }
    }, true);

    // Animation Controls
    document.querySelectorAll('.editor-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyAnimation(btn.getAttribute('data-anim'));
        triggerAutoSave('anim-preset', 300);
      });
    });

    const durSlider = document.getElementById('animDurationSlider');
    const durVal = document.getElementById('animDurationVal');
    durSlider.addEventListener('input', () => {
      durVal.textContent = `${durSlider.value}s`;
      if (selectedElement) selectedElement.style.setProperty('--anim-duration', `${durSlider.value}s`);
    });
    durSlider.addEventListener('change', () => triggerAutoSave('anim-duration', 300));

    const delaySlider = document.getElementById('animDelaySlider');
    const delayVal = document.getElementById('animDelayVal');
    delaySlider.addEventListener('input', () => {
      delayVal.textContent = `${delaySlider.value}s`;
      if (selectedElement) selectedElement.style.setProperty('--anim-delay', `${delaySlider.value}s`);
    });
    delaySlider.addEventListener('change', () => triggerAutoSave('anim-delay', 300));

    document.getElementById('animPlayBtn').addEventListener('click', replayAnimation);
    document.getElementById('animClearBtn').addEventListener('click', () => {
      removeAnimation();
      triggerAutoSave('anim-clear', 300);
    });

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
        showEditorToast("Image replaced successfully! Saving live...", "🖼️");
        triggerAutoSave('image-replace', 100);
      }
    });

    // Transform Panel Controls
    const closeTrBtn = document.getElementById('closeTransformPanel');
    if (closeTrBtn) closeTrBtn.addEventListener('click', closeTransformPanel);

    const xSlider = document.getElementById('transformPosXSlider');
    const ySlider = document.getElementById('transformPosYSlider');
    const rotSlider = document.getElementById('transformRotSlider');
    const scaleSlider = document.getElementById('transformScaleSlider');

    if (xSlider) {
      xSlider.addEventListener('input', updateSelectedTransform);
      xSlider.addEventListener('change', () => triggerAutoSave('transform-x', 200));
    }
    if (ySlider) {
      ySlider.addEventListener('input', updateSelectedTransform);
      ySlider.addEventListener('change', () => triggerAutoSave('transform-y', 200));
    }
    if (rotSlider) {
      rotSlider.addEventListener('input', updateSelectedTransform);
      rotSlider.addEventListener('change', () => triggerAutoSave('transform-rot', 200));
    }
    if (scaleSlider) {
      scaleSlider.addEventListener('input', updateSelectedTransform);
      scaleSlider.addEventListener('change', () => triggerAutoSave('transform-scale', 200));
    }

    // Nudge buttons
    const btnNudgeL = document.getElementById('nudgeLeft');
    if (btnNudgeL) btnNudgeL.addEventListener('click', () => { nudgePosition(-5, 0); triggerAutoSave('nudge', 300); });
    const btnNudgeR = document.getElementById('nudgeRight');
    if (btnNudgeR) btnNudgeR.addEventListener('click', () => { nudgePosition(5, 0); triggerAutoSave('nudge', 300); });
    const btnNudgeU = document.getElementById('nudgeUp');
    if (btnNudgeU) btnNudgeU.addEventListener('click', () => { nudgePosition(0, -5); triggerAutoSave('nudge', 300); });
    const btnNudgeD = document.getElementById('nudgeDown');
    if (btnNudgeD) btnNudgeD.addEventListener('click', () => { nudgePosition(0, 5); triggerAutoSave('nudge', 300); });
    const btnResetPos = document.getElementById('resetPosBtn');
    if (btnResetPos) btnResetPos.addEventListener('click', () => {
      if (xSlider) xSlider.value = 0;
      if (ySlider) ySlider.value = 0;
      updateSelectedTransform();
      triggerAutoSave('reset-pos', 200);
    });

    // Rotation preset buttons
    const rM15 = document.getElementById('rotMinus15');
    if (rM15) rM15.addEventListener('click', () => {
      if (rotSlider) { rotSlider.value = Math.max(-180, parseInt(rotSlider.value, 10) - 15); updateSelectedTransform(); triggerAutoSave('rot', 300); }
    });
    const rP15 = document.getElementById('rotPlus15');
    if (rP15) rP15.addEventListener('click', () => {
      if (rotSlider) { rotSlider.value = Math.min(180, parseInt(rotSlider.value, 10) + 15); updateSelectedTransform(); triggerAutoSave('rot', 300); }
    });
    const rZero = document.getElementById('rotZero');
    if (rZero) rZero.addEventListener('click', () => { setRotationAngle(0); triggerAutoSave('rot', 300); });
    const r90 = document.getElementById('rot90');
    if (r90) r90.addEventListener('click', () => { setRotationAngle(90); triggerAutoSave('rot', 300); });
    const r180 = document.getElementById('rot180');
    if (r180) r180.addEventListener('click', () => { setRotationAngle(180); triggerAutoSave('rot', 300); });

    // Scale preset buttons
    const sHalf = document.getElementById('scaleHalf');
    if (sHalf) sHalf.addEventListener('click', () => { setTransformScale(0.5); triggerAutoSave('scale', 300); });
    const sNorm = document.getElementById('scaleNormal');
    if (sNorm) sNorm.addEventListener('click', () => { setTransformScale(1.0); triggerAutoSave('scale', 300); });
    const s125 = document.getElementById('scale125');
    if (s125) s125.addEventListener('click', () => { setTransformScale(1.25); triggerAutoSave('scale', 300); });
    const s15 = document.getElementById('scale15');
    if (s15) s15.addEventListener('click', () => { setTransformScale(1.5); triggerAutoSave('scale', 300); });
    const sDbl = document.getElementById('scaleDouble');
    if (sDbl) sDbl.addEventListener('click', () => { setTransformScale(2.0); triggerAutoSave('scale', 300); });

    // Layer buttons
    const lFwd = document.getElementById('layerForward');
    if (lFwd) lFwd.addEventListener('click', () => changeLayerOrder(1));
    const lBwd = document.getElementById('layerBackward');
    if (lBwd) lBwd.addEventListener('click', () => changeLayerOrder(-1));

    // Reset & Done buttons
    const btnResetTr = document.getElementById('resetTransformBtn');
    if (btnResetTr) btnResetTr.addEventListener('click', resetSelectedTransform);
    const btnDoneTr = document.getElementById('doneTransformBtn');
    if (btnDoneTr) btnDoneTr.addEventListener('click', closeTransformPanel);

    // Direct On-Canvas Drag-to-Move
    document.addEventListener('pointerdown', (e) => {
      if (currentMode !== 'transform' || !selectedTransformElement) return;
      if (e.target.closest('#visualEditorDock, #editorTransformPanel, #editorAnimPanel, #editorToastBanner, .shop-toolbar, .editor-catalog-add-btn')) return;

      if (e.target === selectedTransformElement || selectedTransformElement.contains(e.target)) {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        isTransformCanvasDragging = true;
        canvasDragStartX = e.clientX;
        canvasDragStartY = e.clientY;
        canvasInitX = parseInt(document.getElementById('transformPosXSlider')?.value || 0, 10);
        canvasInitY = parseInt(document.getElementById('transformPosYSlider')?.value || 0, 10);
        try {
          if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
        } catch(err) {}
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('pointermove', (e) => {
      if (!isTransformCanvasDragging || !selectedTransformElement) return;
      if (e.cancelable) e.preventDefault();
      const deltaX = Math.round(e.clientX - canvasDragStartX);
      const deltaY = Math.round(e.clientY - canvasDragStartY);
      const newX = Math.max(-300, Math.min(300, canvasInitX + deltaX));
      const newY = Math.max(-300, Math.min(300, canvasInitY + deltaY));

      const xSl = document.getElementById('transformPosXSlider');
      const ySl = document.getElementById('transformPosYSlider');
      if (xSl && ySl) {
        xSl.value = newX;
        ySl.value = newY;
        updateSelectedTransform();
      }
    }, { passive: false });

    const stopCanvasDrag = (e) => {
      if (isTransformCanvasDragging) {
        isTransformCanvasDragging = false;
        try {
          if (e && e.target && e.target.releasePointerCapture && e.pointerId) {
            e.target.releasePointerCapture(e.pointerId);
          }
        } catch(err) {}
        showEditorToast("Position updated on canvas! Saving live...", "📍");
        triggerAutoSave('canvas-drag', 200);
      }
    };
    document.addEventListener('pointerup', stopCanvasDrag);
    document.addEventListener('pointercancel', stopCanvasDrag);

    // Escape Key to Close Modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePinModal();
        closeImgModal();
        closeAnimPanel();
        closeTransformPanel();
        closeAddProductModal();
      }
    });
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initEditorUI();
      setupLogoClickTrigger();
      initMultiViewerSync();
    });
  } else {
    initEditorUI();
    setupLogoClickTrigger();
    initMultiViewerSync();
  }

  // Export globals for testing or console access
  window.openStudio = openEditorDock;
  window.toggleStudio = toggleEditorDock;
  window.MeltEditor = {
    open: openEditorDock,
    toggle: toggleEditorDock,
    openPinModal,
    unlock: () => {
      editorUnlocked = true;
      closePinModal();
      openEditorDock();
    },
    close: closeEditorDock,
    publish: publishLive,
    autoSave: performAutoSave,
    sync: initMultiViewerSync,
    exportHtml: exportCleanHtml,
    setCursorFx,
    setSectionAnimationPreset,
    openAddProductModal
  };
})();

