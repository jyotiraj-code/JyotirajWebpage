/**
 * ARCHIVAL LEDGER INTERACTIVE CONTROLLER
 * Jyotiraj (Raj) Nath - Academic Portfolio & Documentation System
 */

(function () {
  'use strict';

  // --- 1. THEME CONTROLLER ---
  const THEME_STORAGE_KEY = 'jyotiraj_archival_theme';
  const htmlEl = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'phosphor') {
      htmlEl.setAttribute('data-theme', 'phosphor');
      updateThemeButtonLabel('TERMINAL PHOSPHOR');
    } else {
      htmlEl.removeAttribute('data-theme');
      updateThemeButtonLabel('ARCHIVAL PAPER');
    }
  }

  function toggleTheme() {
    const isPhosphor = htmlEl.getAttribute('data-theme') === 'phosphor';
    if (isPhosphor) {
      htmlEl.removeAttribute('data-theme');
      localStorage.setItem(THEME_STORAGE_KEY, 'paper');
      updateThemeButtonLabel('ARCHIVAL PAPER');
    } else {
      htmlEl.setAttribute('data-theme', 'phosphor');
      localStorage.setItem(THEME_STORAGE_KEY, 'phosphor');
      updateThemeButtonLabel('TERMINAL PHOSPHOR');
    }
  }

  function updateThemeButtonLabel(mode) {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.innerHTML = `<span class="opacity-70">MODE:</span> [${mode}]`;
    }
  }

  // --- 2. LIVE NZST TIME TICKER (Pacific/Auckland) ---
  function initClock() {
    const clockEl = document.getElementById('nzstClock');
    if (!clockEl) return;

    function update() {
      try {
        const now = new Date();
        const options = {
          timeZone: 'Pacific/Auckland',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        
        const formatter = new Intl.DateTimeFormat('en-CA', options);
        const parts = formatter.formatToParts(now);
        const get = (type) => parts.find(p => p.type === type)?.value;

        const year = get('year') || now.getFullYear();
        const month = get('month') || String(now.getMonth() + 1).padStart(2, '0');
        const day = get('day') || String(now.getDate()).padStart(2, '0');
        const hour = get('hour') || String(now.getHours()).padStart(2, '0');
        const minute = get('minute') || String(now.getMinutes()).padStart(2, '0');
        const second = get('second') || String(now.getSeconds()).padStart(2, '0');

        clockEl.textContent = `${year}-${month}-${day} ${hour}:${minute}:${second} NZST`;
      } catch (err) {
        // Fallback calculation
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const nzst = new Date(utc + (3600000 * 12));
        const pad = (n) => String(n).padStart(2, '0');
        clockEl.textContent = `${nzst.getFullYear()}-${pad(nzst.getMonth()+1)}-${pad(nzst.getDate())} ${pad(nzst.getHours())}:${pad(nzst.getMinutes())}:${pad(nzst.getSeconds())} NZST`;
      }
    }

    update();
    setInterval(update, 1000);
  }

  // --- 3. SESSION UPTIME COUNTER ---
  function initUptime() {
    const uptimeEl = document.getElementById('sessionUptime');
    if (!uptimeEl) return;

    let startTime = sessionStorage.getItem('jyotiraj_uptime_start');
    if (!startTime) {
      startTime = Date.now();
      sessionStorage.setItem('jyotiraj_uptime_start', startTime);
    } else {
      startTime = parseInt(startTime, 10);
    }

    function update() {
      const diffSec = Math.floor((Date.now() - startTime) / 1000);
      const hrs = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const secs = String(diffSec % 60).padStart(2, '0');
      uptimeEl.textContent = `UPTIME: ${hrs}:${mins}:${secs}`;
    }

    update();
    setInterval(update, 1000);
  }

  // --- 4. COMMAND PALETTE (Cmd+K / Ctrl+K) ---
  let searchIndex = null;
  let selectedIndex = -1;

  async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    
    const repoBase = window.location.pathname.includes('/JyotirajWebpage') ? '/JyotirajWebpage' : '';
    // Try multiple paths to ensure resolution on root, subfolder, or file://
    const possiblePaths = [
      repoBase + '/search-index.json',
      '/search-index.json',
      'search-index.json',
      '../search-index.json'
    ];
    for (const p of possiblePaths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          searchIndex = await res.json();
          return searchIndex;
        }
      } catch (e) {
        // try next path
      }
    }
    return [];
  }

  function initCommandPalette() {
    const backdrop = document.getElementById('cmdPaletteBackdrop');
    const input = document.getElementById('cmdPaletteInput');
    const resultsContainer = document.getElementById('cmdPaletteResults');
    const triggerBtn = document.getElementById('cmdSearchTrigger');

    if (!backdrop || !input || !resultsContainer) return;

    function openPalette() {
      backdrop.classList.remove('hidden');
      input.value = '';
      selectedIndex = -1;
      renderResults('');
      input.focus();
    }

    function closePalette() {
      backdrop.classList.add('hidden');
    }

    if (triggerBtn) {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPalette();
      });
    }

    // Keyboard shortcut Cmd+K / Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.classList.contains('hidden')) {
          openPalette();
        } else {
          closePalette();
        }
      } else if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
        closePalette();
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closePalette();
      }
    });

    input.addEventListener('input', () => {
      renderResults(input.value.trim().toLowerCase());
    });

    input.addEventListener('keydown', (e) => {
      const items = resultsContainer.querySelectorAll('.cmd-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelected(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelected(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          items[selectedIndex].click();
        } else if (items.length > 0) {
          items[0].click();
        }
      }
    });

    async function renderResults(query) {
      const data = await loadSearchIndex();
      resultsContainer.innerHTML = '';

      const filtered = query === '' 
        ? data.slice(0, 8) 
        : data.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.summary.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
          );

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `
          <div class="p-4 text-center text-xs text-paper-margin dark:text-terminal-muted font-mono">
            [NO ARCHIVAL ENTRIES FOUND MATCHING "${query}"]
          </div>
        `;
        return;
      }

      filtered.forEach((item, index) => {
        const itemEl = document.createElement('a');
        const repoBase = window.location.pathname.includes('/JyotirajWebpage') ? '/JyotirajWebpage' : '';
        const targetUrl = (item.url.startsWith('/') && repoBase) ? (repoBase + item.url) : item.url;
        itemEl.href = targetUrl;
        itemEl.className = 'cmd-item';
        itemEl.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs tracking-wider">[${item.category}]</span>
            <span class="text-[11px] opacity-60 font-mono">RETRIEVE ↵</span>
          </div>
          <div class="font-bold text-sm text-paper-carbon dark:text-terminal-fg">${item.title}</div>
          <div class="text-xs text-paper-margin dark:text-terminal-muted">${item.summary}</div>
        `;
        itemEl.addEventListener('click', () => {
          closePalette();
        });
        resultsContainer.appendChild(itemEl);
      });

      selectedIndex = -1;
    }

    function updateSelected(items) {
      items.forEach((item, i) => {
        if (i === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }
  }

  // --- 5. CLIPBOARD COPY FOR BIBTEX ---
  function initBibtexCopy() {
    document.querySelectorAll('.copy-bibtex-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const codeEl = document.getElementById(targetId);
        if (!codeEl) return;

        try {
          await navigator.clipboard.writeText(codeEl.textContent.trim());
          const originalText = btn.textContent;
          btn.textContent = '[COPIED TO CLIPBOARD]';
          btn.classList.add('stamp-verified');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('stamp-verified');
          }, 2000);
        } catch (err) {
          console.error('Clipboard copy failed', err);
        }
      });
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initClock();
    initUptime();
    initCommandPalette();
    initBibtexCopy();

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }
  });
})();
