/* ── i18n ── */
const I18N = {
  en: {
    grey: 'Grey', ready: 'Ready', onCd: 'On CD', inRoute: 'In route',
    all: 'All', nightmare: 'Nightmare', routeOnly: 'Route only',
    footer: 'TBH Chest Tracker · Data saved locally in your browser',
    drop: 'DROPPED!', greyLabel: 'Grey chest', blueLabel: 'Blue chest',
    hint: 'Click only when the blue chest drops', ready_msg: 'READY',
    cancel: 'cancel', resetConfirm: 'Reset all timers and checkboxes?',
    toast_ready: '🔵 Blue chest ready!', toast_reset: '♻ Reset complete',
    noTimer: 'Not triggered yet',
  },
  es: {
    grey: 'Gris', ready: 'Listo', onCd: 'En CD', inRoute: 'En ruta',
    all: 'Todos', nightmare: 'Pesadilla', routeOnly: 'Solo ruta',
    footer: 'TBH Chest Tracker · Datos guardados localmente en tu navegador',
    drop: '¡DROPÓ!', greyLabel: 'Baúl gris', blueLabel: 'Baúl azul',
    hint: 'Haz clic solo cuando dropee el baúl azul', ready_msg: 'LISTO',
    cancel: 'cancelar', resetConfirm: '¿Reiniciar todos los timers y checkboxes?',
    toast_ready: '🔵 ¡Baúl azul listo!', toast_reset: '♻ Reinicio completo',
    noTimer: 'No activado aún',
  },
  pt: {
    grey: 'Cinza', ready: 'Pronto', onCd: 'Em CD', inRoute: 'Na rota',
    all: 'Todas', nightmare: 'Pesadelo', routeOnly: 'Só rota',
    footer: 'TBH Chest Tracker · Dados salvos localmente no seu navegador',
    drop: 'DROPOU!', greyLabel: 'Baú cinza', blueLabel: 'Baú azul',
    hint: 'Clique somente quando o baú azul dropar', ready_msg: 'PRONTO',
    cancel: 'cancelar', resetConfirm: 'Resetar todos os timers e checkboxes?',
    toast_ready: '🔵 Baú azul pronto!', toast_reset: '♻ Reset completo',
    noTimer: 'Não acionado ainda',
  },
};

/* ── Phase data ── */
const DIFFICULTIES = ['Normal', 'Nightmare', 'Inferno', 'Torment'];
const PHASES_PER_DIFF = 10;
const CD_MS = 12 * 60 * 1000;

function buildPhases() {
  const phases = [];
  DIFFICULTIES.forEach(diff => {
    for (let i = 1; i <= PHASES_PER_DIFF; i++) {
      phases.push({ id: `${diff}-${i}`, name: `Phase ${i}`, diff });
    }
  });
  return phases;
}

const PHASES = buildPhases();

/* ── State ── */
let lang = localStorage.getItem('tbh-lang') || 'en';
let soundOn = localStorage.getItem('tbh-sound') !== 'false';
let activeDiff = 'all';
let routeOnly = false;
let state = {};
let timerHandles = {};
let notified = {};

function loadState() {
  try { state = JSON.parse(localStorage.getItem('tbh-state') || '{}'); }
  catch { state = {}; }
  PHASES.forEach(p => {
    if (!state[p.id]) state[p.id] = { grey: false, blueDropAt: null, inRoute: false };
  });
}

function saveState() {
  localStorage.setItem('tbh-state', JSON.stringify(state));
}

/* ── Sound (Web Audio retro beeps) ── */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playAlert() {
  if (!soundOn) return;
  try {
    const ctx = getAudioCtx();
    [523, 659, 784, 1046].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = 'square';
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.12 + 0.15);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.2);
    });
  } catch {}
}

/* ── Toast ── */
let toastContainer;
function showToast(msg, isAlert = false) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (isAlert ? ' alert-toast' : '');
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 4100);
}

/* ── i18n ── */
function t(key) { return (I18N[lang] || I18N.en)[key] || key; }

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('.drop-btn').forEach(b => { b.textContent = t('drop'); });
  document.querySelectorAll('.chest-label.grey-lbl').forEach(el => { el.textContent = t('greyLabel'); });
  document.querySelectorAll('.chest-label.blue-lbl').forEach(el => { el.textContent = t('blueLabel'); });
  document.querySelectorAll('.hint-text').forEach(el => { el.textContent = t('hint'); });
  document.querySelectorAll('.cancel-btn').forEach(el => { el.textContent = t('cancel'); });
  document.querySelectorAll('.no-timer').forEach(el => { el.textContent = t('noTimer'); });
  document.querySelectorAll('.lang-btn').forEach(b => { b.classList.toggle('active', b.dataset.lang === lang); });
  localStorage.setItem('tbh-lang', lang);
}

/* ── Animated stat counter ── */
function animateStat(el, newVal) {
  const prev = parseInt(el.textContent) || 0;
  if (prev === newVal) return;
  el.textContent = newVal;
  el.classList.remove('stat-pop');
  void el.offsetWidth; // reflow to restart animation
  el.classList.add('stat-pop');
  el.addEventListener('animationend', () => el.classList.remove('stat-pop'), { once: true });
}

/* ── Stats update ── */
function updateStats() {
  let grey = 0, blueReady = 0, blueOnCd = 0, route = 0;
  const now = Date.now();
  PHASES.forEach(p => {
    const s = state[p.id];
    if (s.grey) grey++;
    if (s.inRoute) route++;
    if (s.blueDropAt !== null) {
      if (now - s.blueDropAt >= CD_MS) blueReady++;
      else blueOnCd++;
    }
  });
  animateStat(document.getElementById('greyCount'), grey);
  document.getElementById('greyTotal').textContent = PHASES.length;
  animateStat(document.getElementById('blueReady'), blueReady);
  animateStat(document.getElementById('blueOnCd'), blueOnCd);
  animateStat(document.getElementById('routeCount'), route);
}

/* ── Timer formatting ── */
function fmtTime(ms) {
  if (ms <= 0) return t('ready_msg');
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ── Update single card's timer UI ── */
function updateCardTimer(phaseId) {
  const s = state[phaseId];
  const card = document.querySelector(`[data-phase="${phaseId}"]`);
  const timerDisplay = card?.querySelector('.timer-display');
  const progressFill = card?.querySelector('.progress-bar-fill');
  const dropBtn = card?.querySelector('.drop-btn');
  const noTimer = card?.querySelector('.no-timer');
  const timerWrap = card?.querySelector('.timer-wrap');
  if (!timerDisplay) return;

  if (s.blueDropAt === null) {
    timerWrap.style.display = 'none';
    noTimer.style.display = 'block';
    dropBtn.disabled = false;
    card.classList.remove('timer-active');
    return;
  }

  timerWrap.style.display = 'flex';
  noTimer.style.display = 'none';

  const elapsed = Date.now() - s.blueDropAt;
  const remaining = CD_MS - elapsed;
  const pct = Math.min(100, (elapsed / CD_MS) * 100);

  if (remaining <= 0) {
    const readyText = t('ready_msg');
    timerDisplay.textContent = readyText;
    timerDisplay.setAttribute('data-text', readyText); // for glitch ::before
    timerDisplay.className = 'timer-display ready';
    progressFill.style.width = '100%';
    progressFill.className = 'progress-bar-fill ready-fill';
    dropBtn.disabled = false;
    card.classList.remove('timer-active');
    if (!notified[phaseId]) {
      notified[phaseId] = true;
      playAlert();
      const phaseName = card.querySelector('.phase-name')?.textContent || phaseId;
      showToast(`${t('toast_ready')} — ${phaseName}`, true);
    }
  } else {
    notified[phaseId] = false;
    timerDisplay.textContent = fmtTime(remaining);
    timerDisplay.removeAttribute('data-text');
    timerDisplay.className = 'timer-display' + (remaining < 60000 ? ' urgent' : '');
    progressFill.style.width = pct + '%';
    progressFill.className = 'progress-bar-fill' + (remaining < 60000 ? ' urgent-fill' : '');
    dropBtn.disabled = true;
    card.classList.add('timer-active');
  }

  updateStats();
}

/* ── Timers ── */
function startTimer(phaseId) {
  if (timerHandles[phaseId]) clearInterval(timerHandles[phaseId]);
  updateCardTimer(phaseId);
  timerHandles[phaseId] = setInterval(() => updateCardTimer(phaseId), 1000);
}
function stopTimer(phaseId) {
  clearInterval(timerHandles[phaseId]);
  delete timerHandles[phaseId];
}

/* ── Ripple effect ── */
function addRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

/* ── Spotlight cursor on cards ── */
function initCardSpotlight(card) {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--spotlight-x', x + '%');
    card.style.setProperty('--spotlight-y', y + '%');
    card.style.setProperty('--spotlight-opacity', '1');
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--spotlight-opacity', '0');
  });
}

/* ── Build DOM ── */
function renderPhases() {
  const grid = document.getElementById('phasesGrid');
  grid.innerHTML = '';

  PHASES.forEach((p, index) => {
    const s = state[p.id];
    const card = document.createElement('div');
    card.className = 'phase-card'
      + (s.inRoute ? ' in-route' : '')
      + (s.blueDropAt !== null && Date.now() - s.blueDropAt < CD_MS ? ' timer-active' : '');
    card.dataset.phase = p.id;
    card.dataset.diff = p.diff;
    // Stagger entrance delay
    card.style.animationDelay = `${index * 30}ms`;

    card.innerHTML = `
      <div class="card-header">
        <span class="phase-name">${p.name} <span style="color:var(--text-secondary);font-size:11px">#${p.id.split('-')[1]}</span> · ${p.diff}</span>
        <div class="phase-badges">
          <span class="diff-badge ${p.diff}">${p.diff.toUpperCase().slice(0,3)}</span>
          <button class="route-toggle ${s.inRoute ? 'active' : ''}" title="Add to route">🗺</button>
        </div>
      </div>
      <div class="card-body">
        <div class="grey-row">
          <input type="checkbox" class="grey-check" ${s.grey ? 'checked' : ''} />
          <span class="chest-label grey-lbl">${t('greyLabel')}</span>
          <span style="color:var(--text-dim);font-size:11px;margin-left:auto" class="grey-indicator">${s.grey ? '✓' : '—'}</span>
        </div>
        <div class="blue-section">
          <div class="blue-header">
            <span class="chest-label blue-lbl">${t('blueLabel')}</span>
            <button class="drop-btn" ${s.blueDropAt !== null && (Date.now() - s.blueDropAt) < CD_MS ? 'disabled' : ''}>${t('drop')}</button>
          </div>
          <div style="font-size:10px;color:var(--text-dim)" class="hint-text">${t('hint')}</div>
          <div class="timer-wrap" style="display:${s.blueDropAt !== null ? 'flex' : 'none'};flex-direction:column;gap:4px">
            <div class="timer-row">
              <span class="timer-display">--:--</span>
              <button class="cancel-btn">${t('cancel')}</button>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:0%"></div>
            </div>
          </div>
          <div class="no-timer" style="display:${s.blueDropAt === null ? 'block' : 'none'}">${t('noTimer')}</div>
        </div>
      </div>
    `;

    // Grey checkbox
    card.querySelector('.grey-check').addEventListener('change', e => {
      state[p.id].grey = e.target.checked;
      card.querySelector('.grey-indicator').textContent = e.target.checked ? '✓' : '—';
      saveState();
      updateStats();
    });

    // Route toggle
    card.querySelector('.route-toggle').addEventListener('click', e => {
      addRipple(e.currentTarget, e);
      state[p.id].inRoute = !state[p.id].inRoute;
      e.currentTarget.classList.toggle('active', state[p.id].inRoute);
      card.classList.toggle('in-route', state[p.id].inRoute);
      saveState();
      updateStats();
      applyFilters();
    });

    // Drop button — ripple + timer
    const dropBtn = card.querySelector('.drop-btn');
    dropBtn.addEventListener('click', e => {
      if (dropBtn.disabled) return;
      addRipple(dropBtn, e);
      state[p.id].blueDropAt = Date.now();
      notified[p.id] = false;
      saveState();
      startTimer(p.id);
    });

    // Cancel button
    card.querySelector('.cancel-btn').addEventListener('click', e => {
      addRipple(e.currentTarget, e);
      state[p.id].blueDropAt = null;
      stopTimer(p.id);
      saveState();
      updateCardTimer(p.id);
      updateStats();
    });

    // Spotlight
    initCardSpotlight(card);

    grid.appendChild(card);

    if (s.blueDropAt !== null) startTimer(p.id);
  });

  updateStats();
  applyFilters();
}

/* ── Filtering ── */
function applyFilters() {
  document.querySelectorAll('.phase-card').forEach(card => {
    const passDiff = activeDiff === 'all' || card.dataset.diff === activeDiff;
    const passRoute = !routeOnly || state[card.dataset.phase]?.inRoute;
    card.classList.toggle('hidden', !(passDiff && passRoute));
  });
}

/* ── Reset ── */
function resetAll() {
  if (!confirm(t('resetConfirm'))) return;
  Object.keys(timerHandles).forEach(id => clearInterval(timerHandles[id]));
  timerHandles = {}; notified = {};
  PHASES.forEach(p => { state[p.id].grey = false; state[p.id].blueDropAt = null; });
  saveState();
  renderPhases();
  showToast(t('toast_reset'));
}

/* ── Init ── */
function init() {
  loadState();

  document.getElementById('langSwitcher').addEventListener('click', e => {
    if (!e.target.dataset.lang) return;
    lang = e.target.dataset.lang;
    applyLang();
    renderPhases();
  });

  const soundBtn = document.getElementById('soundBtn');
  const soundIcon = document.getElementById('soundIcon');
  const SOUND_ON_PATH  = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>';
  const SOUND_OFF_PATH = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';

  function updateSoundUI() {
    soundBtn.classList.toggle('muted', !soundOn);
    soundIcon.innerHTML = soundOn ? SOUND_ON_PATH : SOUND_OFF_PATH;
  }

  soundBtn.addEventListener('click', e => {
    addRipple(soundBtn, e);
    soundOn = !soundOn;
    localStorage.setItem('tbh-sound', soundOn);
    updateSoundUI();
  });
  updateSoundUI();

  document.getElementById('diffTabs').addEventListener('click', e => {
    const tab = e.target.closest('.diff-tab');
    if (!tab) return;
    activeDiff = tab.dataset.diff;
    document.querySelectorAll('.diff-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    applyFilters();
  });

  document.getElementById('showRouteOnly').addEventListener('change', e => {
    routeOnly = e.target.checked;
    applyFilters();
  });

  document.getElementById('resetBtn').addEventListener('click', e => {
    addRipple(e.currentTarget, e);
    resetAll();
  });

  renderPhases();
  applyLang();
}

document.addEventListener('DOMContentLoaded', init);
