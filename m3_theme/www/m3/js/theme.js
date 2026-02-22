/**
 * theme.js — M3 Theme Customizer
 * Handles dark/light/system theme, color palette presets,
 * density, font scale. Persists all to localStorage.
 */
(function () {
  'use strict';

  // ── Defaults ────────────────────────────────────────────────────────
  const DEFAULTS = {
    theme: 'light',        // 'light' | 'dark' | 'system'
    colorPreset: 'blue',   // 'blue' | 'teal' | 'violet' | 'rose' | 'amber'
    density: 'comfortable', // 'comfortable' | 'compact' | 'spacious'
    fontScale: '100',       // '90' | '100' | '110'
  };

  const COLOR_PRESETS = [
    { id: 'blue',   label: 'Google Blue',   color: '#1A6EE1' },
    { id: 'teal',   label: 'Teal',          color: '#006874' },
    { id: 'violet', label: 'Violet',        color: '#6750A4' },
    { id: 'rose',   label: 'Rose',          color: '#9C4146' },
    { id: 'amber',  label: 'Amber',         color: '#7A5900' },
  ];

  // ── State ────────────────────────────────────────────────────────────
  let state = Object.assign({}, DEFAULTS);

  // ── Load from localStorage ───────────────────────────────────────────
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('m3_theme_prefs') || '{}');
      state = Object.assign({}, DEFAULTS, saved);
    } catch (e) {
      state = Object.assign({}, DEFAULTS);
    }
  }

  function saveState() {
    try {
      localStorage.setItem('m3_theme_prefs', JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  // ── Apply theme to <html> ────────────────────────────────────────────
  function resolveTheme(pref) {
    if (pref === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return pref;
  }

  function applyTheme(themeValue) {
    const resolved = resolveTheme(themeValue);
    document.documentElement.dataset.theme = resolved;
    // Update toggle button icons / labels in customizer
    document.querySelectorAll('[data-theme-option]').forEach(el => {
      el.classList.toggle('active', el.dataset.themeOption === themeValue);
    });
  }

  function applyColorPreset(preset) {
    document.documentElement.dataset.colorPreset = preset;
    document.querySelectorAll('.color-swatch').forEach(el => {
      el.classList.toggle('active', el.dataset.preset === preset);
    });
  }

  function applyDensity(density) {
    document.documentElement.dataset.density = density === 'comfortable' ? '' : density;
    document.querySelectorAll('.density-option').forEach(el => {
      el.classList.toggle('active', el.dataset.density === density);
    });
  }

  function applyFontScale(scale) {
    document.documentElement.dataset.fontScale = scale === '100' ? '' : scale;
    document.querySelectorAll('[data-font-scale-option]').forEach(el => {
      el.classList.toggle('active', el.dataset.fontScaleOption === scale);
    });
  }

  // ── Apply all stored preferences ─────────────────────────────────────
  function applyAll() {
    applyTheme(state.theme);
    applyColorPreset(state.colorPreset);
    applyDensity(state.density);
    applyFontScale(state.fontScale);
  }

  // ── Event wiring ─────────────────────────────────────────────────────
  function wire() {
    // Theme toggle buttons
    document.querySelectorAll('[data-theme-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.theme = btn.dataset.themeOption;
        applyTheme(state.theme);
        saveState();
      });
    });

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        state.colorPreset = swatch.dataset.preset;
        applyColorPreset(state.colorPreset);
        saveState();
      });
    });

    // Density options
    document.querySelectorAll('.density-option').forEach(opt => {
      opt.addEventListener('click', () => {
        state.density = opt.dataset.density;
        applyDensity(state.density);
        saveState();
      });
    });

    // Font scale options
    document.querySelectorAll('[data-font-scale-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.fontScale = btn.dataset.fontScaleOption;
        applyFontScale(state.fontScale);
        saveState();
      });
    });

    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === 'system') applyTheme('system');
    });
  }

  // ── Build customizer HTML ────────────────────────────────────────────
  function buildCustomizerContent(container) {
    if (!container) return;

    // Theme section
    const themeSection = document.createElement('div');
    themeSection.className = 'customizer-section';
    themeSection.innerHTML = `
      <div class="customizer-section-title">Appearance</div>
      <div class="segmented-button" style="width:100%">
        <button class="segmented-button-item m3-ripple" data-theme-option="light">
          <span class="material-symbols-outlined icon-sm">light_mode</span> Light
        </button>
        <button class="segmented-button-item m3-ripple" data-theme-option="system">
          <span class="material-symbols-outlined icon-sm">brightness_auto</span> System
        </button>
        <button class="segmented-button-item m3-ripple" data-theme-option="dark">
          <span class="material-symbols-outlined icon-sm">dark_mode</span> Dark
        </button>
      </div>
    `;
    container.appendChild(themeSection);

    // Color section
    const colorSection = document.createElement('div');
    colorSection.className = 'customizer-section';
    const swatchHTML = COLOR_PRESETS.map(p =>
      `<div class="color-swatch m3-interactive" data-preset="${p.id}" style="background:${p.color}" title="${p.label}"></div>`
    ).join('');
    colorSection.innerHTML = `
      <div class="customizer-section-title">Color Palette</div>
      <div class="color-swatch-row">${swatchHTML}</div>
    `;
    container.appendChild(colorSection);

    // Density section
    const densitySection = document.createElement('div');
    densitySection.className = 'customizer-section';
    densitySection.innerHTML = `
      <div class="customizer-section-title">Density</div>
      <div class="density-option m3-interactive" data-density="comfortable">
        <span class="material-symbols-outlined">space_bar</span>
        <div>
          <div class="md-label-large">Comfortable</div>
          <div class="md-body-small text-on-surface-variant">Standard spacing</div>
        </div>
      </div>
      <div class="density-option m3-interactive" data-density="compact">
        <span class="material-symbols-outlined">compress</span>
        <div>
          <div class="md-label-large">Compact</div>
          <div class="md-body-small text-on-surface-variant">Tighter spacing for more data</div>
        </div>
      </div>
      <div class="density-option m3-interactive" data-density="spacious">
        <span class="material-symbols-outlined">expand</span>
        <div>
          <div class="md-label-large">Spacious</div>
          <div class="md-body-small text-on-surface-variant">Generous breathing room</div>
        </div>
      </div>
    `;
    container.appendChild(densitySection);

    // Font scale section
    const fontSection = document.createElement('div');
    fontSection.className = 'customizer-section';
    fontSection.innerHTML = `
      <div class="customizer-section-title">Text Size</div>
      <div class="segmented-button" style="width:100%">
        <button class="segmented-button-item m3-ripple" data-font-scale-option="90">Small</button>
        <button class="segmented-button-item m3-ripple" data-font-scale-option="100">Default</button>
        <button class="segmented-button-item m3-ripple" data-font-scale-option="110">Large</button>
      </div>
    `;
    container.appendChild(fontSection);
  }

  // ── Public API ────────────────────────────────────────────────────────
  window.M3Theme = {
    init() {
      loadState();
      applyAll();
    },
    wire,
    buildCustomizerContent,
    toggle() {
      const resolved = resolveTheme(state.theme);
      state.theme = resolved === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
      saveState();
    },
    getState: () => state,
  };

  // Auto-init immediately
  window.M3Theme.init();
})();
