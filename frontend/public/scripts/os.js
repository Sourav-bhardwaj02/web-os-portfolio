// ===== BOOT SEQUENCE =====
const bootLines = [
  '[ OK ] Starting kernel v5.15.0-sourav...',
  '[ OK ] Loading initramfs...',
  '[ OK ] Mounting root filesystem...',
  '[ OK ] Initializing network interfaces...',
  '[ OK ] Starting portfolio services...',
  '[ OK ] Loading user profile: sourav',
  '[ OK ] Applying display settings...',
  '[ OK ] All systems online. Welcome!'
];

let zTop = 300;
window.openWindows = {};

// ===== MOBILE DETECTION =====
window.isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);

function boot() {
  const screen = document.getElementById('boot-screen');
  const linesEl = document.getElementById('boot-lines');
  const progress = document.getElementById('boot-progress');
  const label = document.getElementById('boot-bar-label');
  let i = 0;
  const interval = setInterval(() => {
    if (i < bootLines.length) {
      const d = document.createElement('div');
      d.textContent = bootLines[i];
      d.style.opacity = '0';
      d.style.transition = 'opacity 0.3s';
      linesEl.appendChild(d);
      setTimeout(() => d.style.opacity = '1', 50);
      progress.style.width = ((i + 1) / bootLines.length * 100) + '%';
      label.textContent = bootLines[i];
      i++;
    } else {
      clearInterval(interval);
      document.removeEventListener('keydown', skipBoot);
      document.removeEventListener('click', skipBoot);
      setTimeout(showLogin, 600);
    }
  }, 320);

  function skipBoot() {
    clearInterval(interval);
    document.removeEventListener('keydown', skipBoot);
    document.removeEventListener('click', skipBoot);
    setTimeout(showLogin, 100);
  }
  document.addEventListener('keydown', skipBoot, { once: true });
  document.addEventListener('click', skipBoot, { once: true });
}

function showLogin() {
  document.getElementById('boot-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  setTimeout(() => document.getElementById('login-btn').focus(), 300);
}

function showDesktop() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('desktop').style.display = 'block';
  updateClock();
  setInterval(updateClock, 1000);
  if (window.isMobile) {
    buildAndroidUI();
  } else {
    setTimeout(() => openApp('terminal'), 800);
  }
}

// ===== ANDROID UI BUILDER =====
function buildAndroidUI() {
  const desktop = document.getElementById('desktop');

  // --- Status Bar ---
  const sb = document.createElement('div');
  sb.id = 'android-statusbar';
  sb.innerHTML = `
    <div id="android-statusbar-left">
      <span class="sb-icon">📶</span>
      <span class="sb-icon">🔵</span>
    </div>
    <div id="android-statusbar-center" id="sb-time"></div>
    <div id="android-statusbar-right">
      <span id="sb-battery">🔋</span>
      <span id="sb-time-right"></span>
    </div>`;
  desktop.appendChild(sb);
  updateAndroidClock();
  setInterval(updateAndroidClock, 1000);

  // --- Android Home Screen ---
  const home = document.createElement('div');
  home.id = 'android-home';
  const mobileApps = [
    { id: 'about', emoji: '👤', label: 'About' },
    { id: 'projects', emoji: '📁', label: 'Projects' },
    { id: 'skills', emoji: '⚙️', label: 'Skills' },
    { id: 'experience', emoji: '💼', label: 'Experience' },
    { id: 'resume', emoji: '📄', label: 'Resume' },
    { id: 'contact', emoji: '📬', label: 'Contact' },
    { id: 'timeline', emoji: '📅', label: 'Timeline' },
    { id: 'radar', emoji: '📊', label: 'Radar' },
    { id: 'tetris', emoji: '🎮', label: 'Tetris' },
    { id: 'snake', emoji: '🐍', label: 'Snake' },
    { id: 'display', emoji: '🖥️', label: 'Display' },
  ];

  home.innerHTML = `
    <div id="android-home-greeting">
      <div class="ah-time" id="ah-clock">00:00</div>
      <div class="ah-date" id="ah-date"></div>
    </div>
    <div id="android-icon-grid">
      ${mobileApps.map(a => `
        <div class="android-icon" onclick="openMobileSheet('${a.id}')">
          <div class="android-icon-bg">${a.emoji}</div>
          <div class="android-icon-label">${a.label}</div>
        </div>`).join('')}
    </div>`;
  desktop.appendChild(home);
  updateAndroidClock();

  // --- App Drawer ---
  const drawer = document.createElement('div');
  drawer.id = 'android-app-drawer';
  drawer.innerHTML = `
    <div id="android-drawer-handle"></div>
    <div id="android-drawer-title">ALL APPS</div>
    <div id="android-drawer-grid">
      ${mobileApps.map(a => `
        <div class="android-icon" onclick="openMobileSheet('${a.id}'); closeAppDrawer();">
          <div class="android-icon-bg">${a.emoji}</div>
          <div class="android-icon-label">${a.label}</div>
        </div>`).join('')}
    </div>`;
  desktop.appendChild(drawer);

  // --- Recents Screen ---
  const recents = document.createElement('div');
  recents.id = 'android-recents';
  recents.innerHTML = `
    <div id="android-recents-title">RECENT APPS</div>
    <div class="recents-card-list" id="recents-list"></div>
    <div style="font-size:11px;color:#555;margin-top:8px">Tap to reopen · ✕ to close</div>`;
  desktop.appendChild(recents);

  // --- Nav Bar ---
  const nav = document.createElement('div');
  nav.id = 'android-navbar';
  nav.innerHTML = `
    <div class="android-nav-btn" id="nav-back" title="Back" onclick="androidBack()">‹</div>
    <div class="android-nav-btn" id="nav-home" title="Home" onclick="androidHome()">⬤</div>
    <div class="android-nav-btn" id="nav-recents" title="Recents" onclick="androidRecents()">▣</div>`;
  desktop.appendChild(nav);

  // Swipe up from bottom to open app drawer
  let touchStartY = 0;
  desktop.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  desktop.addEventListener('touchend', e => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (dy > 60 && !document.getElementById('android-app-drawer').classList.contains('open')) {
      openAppDrawer();
    }
  }, { passive: true });
}

function updateAndroidClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const timeStr = h + ':' + m;
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
  const sbCenter = document.getElementById('android-statusbar-center');
  if (sbCenter) sbCenter.textContent = timeStr;
  const sbTime = document.getElementById('sb-time-right');
  if (sbTime) sbTime.textContent = timeStr;
  const ahClock = document.getElementById('ah-clock');
  if (ahClock) ahClock.textContent = timeStr;
  const ahDate = document.getElementById('ah-date');
  if (ahDate) ahDate.textContent = dateStr;
}

// ===== ANDROID APP SHEETS =====
const mobileSheets = {};

function openMobileSheet(name) {
  if (name === 'terminal') { return; } // Terminal disabled on mobile
  document.getElementById('android-app-drawer')?.classList.remove('open');
  document.getElementById('android-recents')?.classList.remove('open');

  if (mobileSheets[name]) {
    mobileSheets[name].classList.add('open');
    return;
  }

  const appTitles = {
    about: '👤 About Me', projects: '📁 Projects', skills: '⚙️ Skills',
    experience: '💼 Experience', resume: '📄 Resume', contact: '📬 Contact',
    timeline: '📅 Timeline', radar: '📊 Skill Radar', tetris: '🎮 Tetris',
    snake: '🐍 Snake', display: '🖥️ Display',
  };
  const appContent = {
    radar: getRadarHTML, tetris: getTetrisHTML,
    snake: getSnakeHTML, display: getDisplayHTML,
  };

  const isReact = ['about', 'projects', 'skills', 'experience', 'resume', 'contact', 'timeline'].includes(name);
  if (!isReact && !appContent[name]) return;

  const sheet = document.createElement('div');
  sheet.className = 'mobile-sheet';
  sheet.id = 'msheet-' + name;
  sheet.innerHTML = `
    <div class="mobile-sheet-drag"></div>
    <div class="mobile-sheet-header">
      <div class="mobile-sheet-title">${appTitles[name] || name}</div>
      <div class="mobile-sheet-close" onclick="closeMobileSheet('${name}')">✕</div>
    </div>
    <div class="mobile-sheet-body" id="msbody-${name}">${isReact ? '' : appContent[name]()}</div>`;
  document.getElementById('desktop').appendChild(sheet);
  mobileSheets[name] = sheet;

  if (isReact && window.mountReactApp) {
    window.mountReactApp(name, 'msbody-' + name);
  }

  // animate in
  requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));

  // init games/charts
  if (name === 'radar') setTimeout(drawRadar, 200);
  if (name === 'tetris') setTimeout(initTetris, 100);
  if (name === 'snake') setTimeout(initSnake, 100);

  // track recents
  addToRecents(name, appTitles[name]);
}

function closeMobileSheet(name) {
  const sheet = mobileSheets[name];
  if (!sheet) return;
  sheet.classList.remove('open');
  setTimeout(() => { sheet.remove(); delete mobileSheets[name]; }, 360);
  if (name === 'tetris') stopTetris();
  if (name === 'snake') stopSnake();
}

// ===== ANDROID NAV BUTTONS =====
function androidBack() {
  // Close topmost sheet, or close drawer, or close recents
  const recents = document.getElementById('android-recents');
  if (recents?.classList.contains('open')) { recents.classList.remove('open'); return; }
  const drawer = document.getElementById('android-app-drawer');
  if (drawer?.classList.contains('open')) { drawer.classList.remove('open'); return; }
  // Close the most recently opened sheet
  const keys = Object.keys(mobileSheets);
  if (keys.length > 0) closeMobileSheet(keys[keys.length - 1]);
}

function androidHome() {
  document.getElementById('android-app-drawer')?.classList.remove('open');
  document.getElementById('android-recents')?.classList.remove('open');
  // Close all sheets
  Object.keys(mobileSheets).forEach(k => closeMobileSheet(k));
}

function androidRecents() {
  const drawer = document.getElementById('android-app-drawer');
  if (drawer?.classList.contains('open')) drawer.classList.remove('open');
  const recents = document.getElementById('android-recents');
  if (recents) {
    const isOpen = recents.classList.contains('open');
    recents.classList.toggle('open', !isOpen);
    if (!isOpen) renderRecents();
  }
}

function openAppDrawer() {
  document.getElementById('android-app-drawer')?.classList.add('open');
}

function closeAppDrawer() {
  document.getElementById('android-app-drawer')?.classList.remove('open');
}

// ===== RECENTS TRACKING =====
const recentsList = [];
function addToRecents(id, title) {
  const idx = recentsList.findIndex(r => r.id === id);
  if (idx !== -1) recentsList.splice(idx, 1);
  recentsList.unshift({ id, title });
  if (recentsList.length > 8) recentsList.pop();
}

function renderRecents() {
  const list = document.getElementById('recents-list');
  if (!list) return;
  const appEmojis = {
    about: '👤', projects: '📁', skills: '⚙️', experience: '💼',
    resume: '📄', contact: '📬', timeline: '📅', radar: '📊',
    tetris: '🎮', snake: '🐍', display: '🖥️',
  };
  if (recentsList.length === 0) {
    list.innerHTML = '<div style="color:#555;font-size:12px;text-align:center">No recent apps</div>';
    return;
  }
  list.innerHTML = recentsList.map(r => `
    <div class="recents-card">
      <div class="recents-card-emoji">${appEmojis[r.id] || '📄'}</div>
      <div class="recents-card-info" onclick="openMobileSheet('${r.id}'); document.getElementById('android-recents').classList.remove('open');">
        <div class="recents-card-title">${r.title}</div>
      </div>
      <div class="recents-close" onclick="closeMobileSheet('${r.id}'); this.closest('.recents-card').remove();">✕</div>
    </div>`).join('');
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('taskbar-clock').textContent = h + ':' + m;
  document.getElementById('taskbar-date').textContent =
    now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ===== WINDOW MANAGER =====
function createWindow(id, title, width, height, content) {
  if (document.getElementById('win-' + id)) {
    focusWindow(id); return;
  }
  const w = document.createElement('div');
  w.className = 'window focused';
  w.id = 'win-' + id;
  const x = 60 + Math.random() * 120;
  const y = 40 + Math.random() * 60;
  w.style.cssText = `left:${x}px;top:${y}px;width:${width}px;height:${height}px;`;
  w.innerHTML = `
    <div class="window-titlebar" data-id="${id}">
      <div class="window-title">${title}</div>
      <button class="win-close-btn" onclick="closeWindow('${id}')" title="Close">✕</button>
    </div>
    <div class="window-body" id="wbody-${id}">${content === 'REACT' ? '' : content}</div>
    <div class="window-resize" data-id="${id}">◢</div>`;
  document.getElementById('windows-container').appendChild(w);
  
  if (content === 'REACT' && window.mountReactApp) {
    window.mountReactApp(id, 'wbody-' + id);
  }

  makeDraggable(w, w.querySelector('.window-titlebar'));
  makeResizable(w, w.querySelector('.window-resize'));
  w.addEventListener('mousedown', () => focusWindow(id));
  openWindows[id] = { minimized: false };
  focusWindow(id);
  if (id === 'radar') drawRadar();
  if (id === 'tetris') initTetris();
  if (id === 'snake') initSnake();
}

function focusWindow(id) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  const w = document.getElementById('win-' + id);
  if (w) { w.classList.add('focused'); w.style.zIndex = ++zTop; }
}

function closeWindow(id) {
  const w = document.getElementById('win-' + id);
  if (w) { w.style.animation = 'windowOpen 0.2s reverse'; setTimeout(() => w.remove(), 200); }
  delete openWindows[id];
  if (id === 'tetris') stopTetris();
  if (id === 'snake') stopSnake();
}

function minimizeWindow(id) {
  const w = document.getElementById('win-' + id);
  if (w) w.style.display = 'none';
  if (openWindows[id]) openWindows[id].minimized = true;
}

function maximizeWindow(id) {
  const w = document.getElementById('win-' + id);
  if (!w) return;
  if (w.dataset.maximized) {
    w.style.cssText = w.dataset.prev;
    delete w.dataset.maximized;
  } else {
    w.dataset.prev = w.style.cssText;
    w.dataset.maximized = '1';
    w.style.cssText = `left:0;top:0;width:100vw;height:calc(100vh - 42px);z-index:${++zTop};`;
  }
}

function makeDraggable(win, handle) {
  let ox, oy;
  handle.addEventListener('mousedown', e => {
    if (e.target.classList.contains('win-btn')) return;
    ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop;
    const mv = e2 => { win.style.left = (e2.clientX - ox) + 'px'; win.style.top = (e2.clientY - oy) + 'px'; };
    const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
  });
}

function makeResizable(win, handle) {
  handle.addEventListener('mousedown', e => {
    e.stopPropagation();
    const ox = e.clientX, oy = e.clientY, ow = win.offsetWidth, oh = win.offsetHeight;
    const mv = e2 => {
      win.style.width = Math.max(320, ow + e2.clientX - ox) + 'px';
      win.style.height = Math.max(200, oh + e2.clientY - oy) + 'px';
    };
    const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
  });
}

// ===== APP LAUNCHER =====
function openApp(name) {
  // Route mobile to Android sheets
  if (window.isMobile) { openMobileSheet(name); return; }
  document.getElementById('app-menu').style.display = 'none';
  const apps = {
    about: () => createWindow('about', '👤 about.txt', 520, 480, 'REACT'),
    projects: () => createWindow('projects', '📁 ~/projects', 580, 520, 'REACT'),
    skills: () => createWindow('skills', '⚙️ skills.sh', 480, 500, 'REACT'),
    experience: () => createWindow('experience', '💼 experience.log', 520, 460, 'REACT'),
    resume: () => createWindow('resume', '📄 resume.pdf', 520, 560, 'REACT'),
    contact: () => createWindow('contact', '📬 contact.cfg', 440, 380, 'REACT'),
    timeline: () => createWindow('timeline', '📅 timeline.json', 480, 500, 'REACT'),
    radar: () => createWindow('radar', '📊 skill_radar.png', 460, 440, getRadarHTML()),
    terminal: () => createWindow('terminal', '⬛ TERMINAL_V1.0', 620, 420, getTerminalHTML()),
    tetris: () => createWindow('tetris', '🎮 tetris.exe', 380, 480, getTetrisHTML()),
    snake: () => createWindow('snake', '🐍 snake.py', 420, 460, getSnakeHTML()),
    display: () => createWindow('display', '🖥️ display.cfg', 440, 360, getDisplayHTML()),
  };
  if (apps[name]) apps[name]();
  if (name === 'terminal') setTimeout(initTerminal, 100);
}

// ===== APP HTMLS =====

function getRadarHTML() {
  return `<div class="app-content">
    <div class="app-title">📊 SKILL RADAR</div>
    <canvas id="radar-canvas" width="380" height="300"></canvas>
  </div>`;
}

function drawRadar() {
  setTimeout(() => {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, R = 120;
    const skills = [
      { label: 'Frontend', val: 0.9 }, { label: 'Backend', val: 0.82 },
      { label: 'DevOps', val: 0.65 }, { label: 'Database', val: 0.75 },
      { label: 'UI/UX', val: 0.72 }, { label: 'Open Source', val: 0.85 },
    ];
    const n = skills.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Grid
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * R * r / 4;
        const y = cy + Math.sin(a) * R * r / 4;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,255,65,0.15)';
      ctx.stroke();
    }
    // Spokes
    skills.forEach((_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = 'rgba(0,255,65,0.2)';
      ctx.stroke();
    });
    // Data polygon
    ctx.beginPath();
    skills.forEach((s, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * R * s.val;
      const y = cy + Math.sin(a) * R * s.val;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,255,65,0.15)';
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    // Labels
    ctx.fillStyle = '#00ffff';
    ctx.font = '11px Share Tech Mono';
    ctx.textAlign = 'center';
    skills.forEach((s, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * (R + 20);
      const y = cy + Math.sin(a) * (R + 20) + 4;
      ctx.fillText(s.label, x, y);
    });
  }, 200);
}

function getDisplayHTML() {
  return `<div class="app-content">
    <div class="app-title">🖥️ DISPLAY</div>
    <div class="app-section">
      <div class="app-section-title">Wallpaper Theme</div>
      <div class="theme-btns">
        <button class="theme-btn" style="background:linear-gradient(135deg,#0d1f3c,#1e3a7e);color:#00ff41;border-color:#00ff41" onclick="setTheme('blue')">🔵 Classic Blue</button>
        <button class="theme-btn" style="background:linear-gradient(135deg,#0d200d,#1a4a1a);color:#00ff41;border-color:#00ff41" onclick="setTheme('green')">🟢 Matrix Green</button>
        <button class="theme-btn" style="background:linear-gradient(135deg,#200d1a,#4a1a3a);color:#ff69b4;border-color:#ff69b4" onclick="setTheme('purple')">🟣 Cyber Purple</button>
        <button class="theme-btn" style="background:linear-gradient(135deg,#201000,#4a2a00);color:#ffa500;border-color:#ffa500" onclick="setTheme('amber')">🟡 Amber Retro</button>
        <button class="theme-btn" style="background:linear-gradient(135deg,#000,#111);color:#fff;border-color:#444" onclick="setTheme('dark')">⚫ Pure Dark</button>
      </div>
    </div>
    <div class="app-section" style="margin-top:20px">
      <div class="app-section-title">Resolution</div>
      <div style="font-size:12px;color:#aaa">${window.innerWidth} × ${window.innerHeight}px</div>
    </div>
  </div>`;
}

function setTheme(t) {
  const themes = {
    blue: 'linear-gradient(135deg, #0a0e1a 0%, #0d1a2f 20%, #0f1028 40%, #121430 60%, #0a0e1a 100%)',
    green: 'linear-gradient(135deg, #050f05 0%, #0a1f0a 20%, #0d2a10 40%, #061408 60%, #050f05 100%)',
    purple: 'linear-gradient(135deg, #0d050f 0%, #1a0e2a 20%, #2a1040 40%, #150830 60%, #0d050f 100%)',
    amber: 'linear-gradient(135deg, #0f0800 0%, #1a1005 20%, #2a1800 40%, #140c02 60%, #0f0800 100%)',
    dark: 'linear-gradient(135deg, #060608 0%, #0a0a0e 20%, #08080c 40%, #0c0c12 60%, #060608 100%)',
  };
  document.getElementById('desktop').style.backgroundImage = themes[t] || themes.blue;

  // Accent color palettes per theme
  const accentMap = {
    blue:   { accent: '#00ff41', dim: '#00cc33', glow: 'rgba(0,255,65,0.4)',  subtle: 'rgba(0,255,65,0.1)',  border: 'rgba(0,255,65,0.3)' },
    green:  { accent: '#00ff41', dim: '#00cc33', glow: 'rgba(0,255,65,0.4)',  subtle: 'rgba(0,255,65,0.1)',  border: 'rgba(0,255,65,0.3)' },
    purple: { accent: '#c084fc', dim: '#a855f7', glow: 'rgba(192,132,252,0.35)', subtle: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
    amber:  { accent: '#fbbf24', dim: '#f59e0b', glow: 'rgba(251,191,36,0.35)',  subtle: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)' },
    dark:   { accent: '#a0a0b0', dim: '#808090', glow: 'rgba(160,160,176,0.25)', subtle: 'rgba(160,160,176,0.08)', border: 'rgba(160,160,176,0.2)' },
  };
  const a = accentMap[t] || accentMap.blue;
  const root = document.documentElement.style;
  root.setProperty('--accent', a.accent);
  root.setProperty('--accent-dim', a.dim);
  root.setProperty('--accent-glow', a.glow);
  root.setProperty('--accent-subtle', a.subtle);
  root.setProperty('--accent-border', a.border);

  window.dispatchEvent(new CustomEvent('themeColorChange', {
    detail: { color: a.accent }
  }));
}

// ===== TERMINAL =====
function getTerminalHTML() {
  return `<div class="terminal-body" id="term-body">
    <div id="term-output"></div>
    <div class="term-input-line">
      <span class="term-prompt" id="term-prompt">root@sourav:~$</span>
      <input class="term-input" id="term-input" type="text" autocomplete="off" spellcheck="false" />
    </div>
  </div>`;
}

let termHistory = [], termHistIdx = -1;

function initTerminal() {
  const input = document.getElementById('term-input');
  if (!input) return;
  // Welcome banner
  printTerm([
    { cls: 'term-header', txt: 'SOURAV-OS' },
    { cls: 'term-ascii', txt: '┌─────────────────────────────────────┐' },
    { cls: 'term-ascii', txt: '│  Welcome to SOURAV-OS [v1.0.2026]   │' },
    { cls: 'term-ascii', txt: '│ (c) Sourav Corp. All rights reserved│' },
    { cls: 'term-ascii', txt: '└─────────────────────────────────────┘' },
    { cls: 'term-info', txt: '' },
    { cls: 'term-success', txt: 'System Status: ONLINE' },
    { cls: 'term-output-line', txt: 'Role: Full Stack Web Developer (Fresher)' },
    { cls: 'term-output-line', txt: 'Location: Najafgarh, Delhi' },
    { cls: 'term-info', txt: '' },
    { cls: 'term-warn', txt: "Type 'help' for available commands." },
    { cls: 'term-info', txt: '' },
  ]);
  input.addEventListener('keydown', handleTermKey);
  document.getElementById('term-body').addEventListener('click', () => input.focus());
  input.focus();
}

function printTerm(lines) {
  const out = document.getElementById('term-output');
  if (!out) return;
  const block = document.createElement('div');
  block.className = 'term-output-block';
  lines.forEach(l => {
    const d = document.createElement('div');
    d.className = 'term-line ' + (l.cls || 'term-output-line');
    d.innerHTML = l.txt;
    block.appendChild(d);
  });
  out.appendChild(block);
  out.scrollTop = out.scrollHeight;
  const body = document.getElementById('term-body');
  if (body) body.scrollTop = body.scrollHeight;
}

function handleTermKey(e) {
  const input = document.getElementById('term-input');
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) { termHistory.unshift(cmd); termHistIdx = -1; }
    printTerm([{ cls: 'term-command', txt: 'root@sourav:~$ ' + cmd }]);
    input.value = '';
    runCommand(cmd);
  } else if (e.key === 'ArrowUp') {
    if (termHistIdx < termHistory.length - 1) input.value = termHistory[++termHistIdx];
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (termHistIdx > 0) input.value = termHistory[--termHistIdx];
    else { termHistIdx = -1; input.value = ''; }
    e.preventDefault();
  } else if (e.ctrlKey && e.key === 'l') {
    document.getElementById('term-output').innerHTML = ''; e.preventDefault();
  }
}

function runCommand(cmd) {
  const c = cmd.toLowerCase().trim();
  const args = c.split(' ');
  switch (args[0]) {
    case 'help': showHelp(); break;
    case 'about': openApp('about'); printTerm([{ cls: 'term-success', txt: 'Opening About...' }]); break;
    case 'projects': openApp('projects'); printTerm([{ cls: 'term-success', txt: 'Opening Projects...' }]); break;
    case 'skills': openApp('skills'); printTerm([{ cls: 'term-success', txt: 'Opening Skills...' }]); break;
    case 'experience': openApp('experience'); printTerm([{ cls: 'term-success', txt: 'Opening Experience...' }]); break;
    case 'resume': openApp('resume'); printTerm([{ cls: 'term-success', txt: 'Opening Resume...' }]); break;
    case 'contact': openApp('contact'); printTerm([{ cls: 'term-success', txt: 'Opening Contact...' }]); break;
    case 'timeline': openApp('timeline'); printTerm([{ cls: 'term-success', txt: 'Opening Timeline...' }]); break;
    case 'radar': openApp('radar'); printTerm([{ cls: 'term-success', txt: 'Opening Skill Radar...' }]); break;
    case 'display': openApp('display'); printTerm([{ cls: 'term-success', txt: 'Opening Display Settings...' }]); break;
    case 'tetris': openApp('tetris'); printTerm([{ cls: 'term-success', txt: 'Starting Tetris... use arrow keys!' }]); break;
    case 'snake': openApp('snake'); printTerm([{ cls: 'term-success', txt: 'Starting Snake... use WASD or arrow keys!' }]); break;
    case 'clear': document.getElementById('term-output').innerHTML = ''; break;
    case 'whoami': printTerm([{ cls: 'term-output-line', txt: 'sourav — Full Stack Developer, CS Student, Linux Enthusiast' }]); break;
    case 'ls': printTerm([{ cls: 'term-info', txt: 'about/  projects/  skills/  experience/  resume  contact  timeline  tetris  snake  display' }]); break;
    case 'pwd': printTerm([{ cls: 'term-output-line', txt: '/home/sourav' }]); break;
    case 'echo': printTerm([{ cls: 'term-output-line', txt: cmd.slice(5) }]); break;
    case 'date': printTerm([{ cls: 'term-output-line', txt: new Date().toString() }]); break;
    case 'neofetch': showNeofetch(); break;
    case 'exit': closeWindow('terminal'); break;
    case 'cowsay': printTerm([{ cls: 'term-ascii', txt: ' ________\n< Moo! 🐄 >\n --------\n      \\   ^__^\n       \\  (oo)\\_______\n          (__)\\       )\\/\\\n              ||----w |\n              ||     ||' }]); break;
    case 'fortune': showFortune(); break;
    case 'coffee': printTerm([{ cls: 'term-warn', txt: '☕ Brewing coffee...' }, { cls: 'term-success', txt: 'Done! Enjoy your coffee. You deserve it 💪' }]); break;
    case 'cat': printTerm([{ cls: 'term-ascii', txt: ' /\\_____/\\\n(  o   o  )\n (  =^=  ) \n  (-----) \n  Hello! 😸' }]); break;
    case 'sudo': printTerm([{ cls: 'term-success', txt: 'Thank you! If you are still here, it means you like my work. I would be grateful if you could hire me or share my profile!' }]); break;
    case 'hack': printTerm([{ cls: 'term-warn', txt: '⚠ Initiating hack sequence...' }, { cls: 'term-error', txt: 'ERROR: Skill level too low. Try: skills' }, { cls: 'term-success', txt: 'Just kidding 😄 Check out my projects instead!' }]); break;
    case 'matrix': startMatrix(); break;
    case '': break;
    default: printTerm([{ cls: 'term-error', txt: `Command not found: ${args[0]}. Type 'help' for commands.` }]);
  }
}

function showHelp() {
  printTerm([
    { cls: 'term-info', txt: '┌────────────── AVAILABLE COMMANDS ──────────────┐' },
    { cls: 'term-output-line', txt: '  about        — Open About Me' },
    { cls: 'term-output-line', txt: '  projects      — Open Projects' },
    { cls: 'term-output-line', txt: '  skills        — Open Tech Stack' },
    { cls: 'term-output-line', txt: '  experience    — Open Experience Logs' },
    { cls: 'term-output-line', txt: '  resume        — Open Resume' },
    { cls: 'term-output-line', txt: '  contact       — Show Contact Info' },
    { cls: 'term-output-line', txt: '  timeline      — Career Timeline' },
    { cls: 'term-output-line', txt: '  radar         — Skills Radar Chart' },
    { cls: 'term-output-line', txt: '  display       — Display Settings / Themes' },
    { cls: 'term-output-line', txt: '  tetris        — Play Tetris 🎮' },
    { cls: 'term-output-line', txt: '  snake         — Play Snake 🐍' },
    { cls: 'term-output-line', txt: '  neofetch      — System Info' },
    { cls: 'term-output-line', txt: '  whoami        — Who Am I?' },
    { cls: 'term-output-line', txt: '  ls            — List commands' },
    { cls: 'term-output-line', txt: '  pwd           — Print working directory' },
    { cls: 'term-output-line', txt: '  echo [text]   — Echo text' },
    { cls: 'term-output-line', txt: '  date          — Show current date' },
    { cls: 'term-output-line', txt: '  clear         — Clear terminal' },
    { cls: 'term-output-line', txt: '  exit          — Close terminal' },
    { cls: 'term-warn', txt: '  🥚 Easter eggs:' },
    { cls: 'term-output-line', txt: '  cowsay · fortune · coffee · cat · sudo · hack · matrix' },
    { cls: 'term-info', txt: '└────────────────────────────────────────────────┘' },
  ]);
}

function showNeofetch() {
  const now = new Date();
  printTerm([
    { cls: 'term-success', txt: '       .--.        sourav@portfolio-os' },
    { cls: 'term-success', txt: '      |o_o |       ──────────────────' },
    { cls: 'term-success', txt: '      |:_/ |       OS: Sourav-OS v1.0.2026' },
    { cls: 'term-success', txt: '     //   \\ \\      Shell: /bin/bash' },
    { cls: 'term-success', txt: '    (|     | )     Resolution: ' + window.innerWidth + 'x' + window.innerHeight },
    { cls: 'term-success', txt: '   /\'\\_   _/`\\     Theme: Cyber Blue' },
    { cls: 'term-success', txt: '   \\___)=(___/     Role: Full Stack Developer' },
    { cls: 'term-info', txt: '                   Status: ONLINE ✓' },
    { cls: 'term-output-line', txt: '                   Uptime: Always 💪' },
  ]);
}

function showFortune() {
  const fortunes = [
    '"Any sufficiently advanced technology is indistinguishable from magic." — Clarke',
    '"First, solve the problem. Then, write the code." — Johnson',
    '"Programs must be written for people to read." — Abelson',
    '"Talk is cheap. Show me the code." — Torvalds',
    '"The best code is no code at all." — Atwood',
    '"Simplicity is the ultimate sophistication." — da Vinci',
  ];
  printTerm([{ cls: 'term-warn', txt: '🔮 ' + fortunes[Math.floor(Math.random() * fortunes.length)] }]);
}

function startMatrix() {
  printTerm([{ cls: 'term-success', txt: '🔴 You took the red pill... Welcome to the matrix!' }]);
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;pointer-events:none';
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const cols = Math.floor(canvas.width / 14);
  const drops = Array(cols).fill(0);
  const chars = 'アイウエオカキクケコ0123456789ABCDEF';
  let frame = 0;
  const run = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = '13px monospace';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
      if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    if (++frame > 200) { clearInterval(run); canvas.remove(); }
  }, 50);
  printTerm([{ cls: 'term-info', txt: '(Matrix effect playing for 10s...)' }]);
}

// ===== TETRIS =====
function getTetrisHTML() {
  return `<div id="tetris-wrap">
    <div>
      <canvas id="tetris-canvas" width="200" height="400"></canvas>
    </div>
    <div id="tetris-panel">
      <div class="tetris-label">SCORE</div>
      <div class="tetris-value" id="tet-score">0</div>
      <div class="tetris-label">LEVEL</div>
      <div class="tetris-value" id="tet-level">1</div>
      <div class="tetris-label">NEXT</div>
      <canvas id="tetris-next-canvas" width="80" height="80"></canvas>
      <button class="game-btn" id="tet-btn" onclick="toggleTetris()">▶ START</button>
      <div style="font-size:10px;color:#666;margin-top:10px">← → move<br>↑ rotate<br>↓ drop<br>Space: hard drop</div>
    </div>
  </div>`;
}

let tetState = null;

function initTetris() {
  setTimeout(() => {
    const canvas = document.getElementById('tetris-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 200, 400);
    ctx.fillStyle = 'rgba(0,255,65,0.3)';
    ctx.font = '14px Share Tech Mono';
    ctx.textAlign = 'center';
    ctx.fillText('Press START', 100, 200);
  }, 150);
}

function stopTetris() { if (tetState?.interval) clearInterval(tetState.interval); tetState = null; }

function toggleTetris() {
  if (tetState?.running) { stopTetris(); document.getElementById('tet-btn').textContent = '▶ START'; }
  else startTetris();
}

function startTetris() {
  stopTetris();
  const COLS = 10, ROWS = 20, BLOCK = 20;
  const PIECES = [
    { shape: [[1, 1, 1, 1]], color: '#00ffff' },
    { shape: [[1, 1], [1, 1]], color: '#ffd700' },
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#aa00ff' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#ff8800' },
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#0066ff' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0066' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff41' },
  ];
  const canvas = document.getElementById('tetris-canvas');
  const ctx = canvas.getContext('2d');
  const nextCtx = document.getElementById('tetris-next-canvas').getContext('2d');
  let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  let score = 0, level = 1, lines = 0;
  let cur = null, next = null, gameOver = false;

  function rnd() { return PIECES[Math.floor(Math.random() * PIECES.length)]; }
  function newPiece() { cur = next || rnd(); cur.x = 3; cur.y = 0; next = rnd(); drawNext(); }
  function collide(dx = 0, dy = 0, rot = null) {
    const shape = rot || cur.shape;
    return shape.some((row, r) => row.some((v, c) => {
      if (!v) return false;
      const nx = cur.x + c + dx, ny = cur.y + r + dy;
      return nx < 0 || nx >= COLS || ny >= ROWS || board[ny]?.[nx];
    }));
  }
  function rotate(s) { return s[0].map((_, i) => s.map(r => r[i]).reverse()); }
  function merge() { cur.shape.forEach((row, r) => row.forEach((v, c) => { if (v) board[cur.y + r][cur.x + c] = cur.color; })); }
  function clearLines() {
    let cleared = 0;
    board = board.filter(row => { if (row.every(v => v)) { cleared++; return false; } return true; });
    while (board.length < ROWS) board.unshift(Array(COLS).fill(0));
    lines += cleared;
    score += [0, 100, 300, 500, 800][cleared] * level;
    level = Math.floor(lines / 10) + 1;
    document.getElementById('tet-score').textContent = score;
    document.getElementById('tet-level').textContent = level;
  }
  function draw() {
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 200, 400);
    board.forEach((row, r) => row.forEach((v, c) => {
      if (v) { ctx.fillStyle = v; ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2); }
    }));
    if (cur) { ctx.fillStyle = cur.color; cur.shape.forEach((row, r) => row.forEach((v, c) => { if (v) ctx.fillRect((cur.x + c) * BLOCK + 1, (cur.y + r) * BLOCK + 1, BLOCK - 2, BLOCK - 2); })); }
    ctx.strokeStyle = 'rgba(0,255,65,0.1)';
    for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i * BLOCK, 0); ctx.lineTo(i * BLOCK, 400); ctx.stroke(); }
    for (let i = 0; i <= ROWS; i++) { ctx.beginPath(); ctx.moveTo(0, i * BLOCK); ctx.lineTo(200, i * BLOCK); ctx.stroke(); }
    if (gameOver) { ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, 200, 400); ctx.fillStyle = '#ff4444'; ctx.font = 'bold 20px Share Tech Mono'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', 100, 190); ctx.fillStyle = '#aaa'; ctx.font = '13px Share Tech Mono'; ctx.fillText('Score: ' + score, 100, 215); }
  }
  function drawNext() {
    nextCtx.fillStyle = '#0a0a0a'; nextCtx.fillRect(0, 0, 80, 80);
    if (!next) return;
    const s = 12, ox = (80 - next.shape[0].length * s) / 2, oy = (80 - next.shape.length * s) / 2;
    nextCtx.fillStyle = next.color;
    next.shape.forEach((row, r) => row.forEach((v, c) => { if (v) nextCtx.fillRect(ox + c * s + 1, oy + r * s + 1, s - 2, s - 2); }));
  }
  function step() {
    if (!collide(0, 1)) { cur.y++; }
    else { merge(); clearLines(); newPiece(); if (collide()) { gameOver = true; clearInterval(tetState.interval); } }
    draw();
  }

  newPiece(); draw();
  tetState = { running: true, interval: setInterval(step, Math.max(100, 500 - level * 40)) };
  document.getElementById('tet-btn').textContent = '⏸ PAUSE';

  document.addEventListener('keydown', tetKey);
  function tetKey(e) {
    if (!cur || gameOver || !tetState?.running) return;
    if (e.key === 'ArrowLeft' && !collide(-1, 0)) cur.x--;
    else if (e.key === 'ArrowRight' && !collide(1, 0)) cur.x++;
    else if (e.key === 'ArrowDown') { if (!collide(0, 1)) cur.y++; }
    else if (e.key === 'ArrowUp') { const rot = rotate(cur.shape); if (!collide(0, 0, rot)) cur.shape = rot; }
    else if (e.key === ' ') { while (!collide(0, 1)) cur.y++; step(); }
    else return;
    e.preventDefault(); draw();
  }
  tetState.keyFn = tetKey;
}

// ===== SNAKE =====
function getSnakeHTML() {
  return `<div id="snake-wrap">
    <div>
      <canvas id="snake-canvas" width="300" height="300"></canvas>
    </div>
    <div id="snake-panel">
      <div class="tetris-label">SCORE</div>
      <div class="tetris-value" id="snake-score">0</div>
      <div class="tetris-label">HIGH</div>
      <div class="tetris-value" id="snake-high">0</div>
      <button class="game-btn" id="snake-btn" onclick="startSnake()">▶ START</button>
      <div style="font-size:10px;color:#666;margin-top:10px">WASD or Arrow keys</div>
    </div>
  </div>`;
}

let snakeState = null;
function stopSnake() { if (snakeState?.interval) clearInterval(snakeState.interval); snakeState = null; }

function initSnake() {
  setTimeout(() => {
    const canvas = document.getElementById('snake-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = 'rgba(0,255,65,0.3)'; ctx.font = '14px Share Tech Mono'; ctx.textAlign = 'center';
    ctx.fillText('Press START', 150, 150);
  }, 150);
}

function startSnake() {
  stopSnake();
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const SZ = 15, COLS = 20, ROWS = 20;
  let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }], dir = { x: 1, y: 0 }, nextDir = { x: 1, y: 0 };
  let food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  let score = 0, high = parseInt(localStorage.getItem('snakeHigh') || '0');
  document.getElementById('snake-high').textContent = high;
  let gameOver = false;

  function placeFood() { food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  function draw() {
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 300, 300);
    // Food
    ctx.fillStyle = '#ff4444'; ctx.fillRect(food.x * SZ + 1, food.y * SZ + 1, SZ - 2, SZ - 2);
    // Snake
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#00ff41' : '#00cc33';
      ctx.fillRect(s.x * SZ + 1, s.y * SZ + 1, SZ - 2, SZ - 2);
    });
    if (gameOver) { ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, 300, 300); ctx.fillStyle = '#ff4444'; ctx.font = 'bold 18px Share Tech Mono'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', 150, 140); ctx.fillStyle = '#aaa'; ctx.font = '13px Share Tech Mono'; ctx.fillText('Score: ' + score, 150, 165); }
  }
  function step() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOver = true; clearInterval(snakeState.interval);
      if (score > high) { high = score; localStorage.setItem('snakeHigh', high); document.getElementById('snake-high').textContent = high; }
      draw(); return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { score += 10; document.getElementById('snake-score').textContent = score; placeFood(); }
    else snake.pop();
    draw();
  }
  draw();
  snakeState = { interval: setInterval(step, 150) };
  document.getElementById('snake-btn').textContent = '⏹ STOP';

  document.addEventListener('keydown', snakeKey);
  function snakeKey(e) {
    const map = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
    };
    const nd = map[e.key];
    if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) { nextDir = nd; e.preventDefault(); }
  }
  snakeState.keyFn = snakeKey;
}

// ===== EVENT LISTENERS =====
document.getElementById('login-btn').addEventListener('click', showDesktop);
// Using global enter key handler for login screen explicitly
document.addEventListener('keypress', e => {
  if (e.key === 'Enter' && document.getElementById('login-screen').style.display === 'flex') {
    showDesktop();
  }
});

if (!window.isMobile) {
  document.getElementById('taskbar-menu-btn').addEventListener('click', () => {
    const m = document.getElementById('app-menu');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#app-menu') && !e.target.closest('#taskbar-menu-btn')) {
      document.getElementById('app-menu').style.display = 'none';
    }
  });

  // Keyboard shortcuts (desktop only)
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 't') { openApp('terminal'); e.preventDefault(); }
    if (e.ctrlKey && e.key === 'e') { openApp('tetris'); e.preventDefault(); }
    if (e.key === 'Escape') { document.getElementById('app-menu').style.display = 'none'; }
  });
}

function handleShutdown() {
  if (window.isMobile) {
    document.getElementById('shutdown-screen').style.display = 'flex';
    return;
  }
  document.getElementById('app-menu').style.display = 'none';
  document.getElementById('shutdown-screen').style.display = 'flex';
}

// Resize handler to keep isMobile in sync if user rotates device
window.addEventListener('resize', () => {
  window.isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
});

// Start everything
boot();
