/* ── Stage Database ── */
const STAGES = {
  1: [
    { id: '1-1',  name: 'Pasture' },
    { id: '1-2',  name: 'Shadow Meadow' },
    { id: '1-3',  name: 'Wasteland' },
    { id: '1-4',  name: 'Eerie Canyon' },
    { id: '1-5',  name: 'Burning Village Entrance' },
    { id: '1-6',  name: 'Rumstreet Square' },
    { id: '1-7',  name: 'City Outskirts' },
    { id: '1-8',  name: 'Cemetery' },
    { id: '1-9',  name: 'Cursed Land' },
    { id: '1-10', name: 'Throne of Darkness' },
  ],
  2: [
    { id: '2-1',  name: 'Oasis Road' },
    { id: '2-2',  name: 'Sandstorm Valley' },
    { id: '2-3',  name: 'Desert Underground Cave' },
    { id: '2-4',  name: 'Bug Nest' },
    { id: '2-5',  name: 'Scorching Dunes' },
    { id: '2-6',  name: 'Sunset Ruins' },
    { id: '2-7',  name: 'Midnight Sands' },
    { id: '2-8',  name: 'Sacred Tomb' },
    { id: '2-9',  name: "Pharaoh's Crypt" },
    { id: '2-10', name: "Pharaoh's Underchannel" },
  ],
  3: [
    { id: '3-1',  name: 'Snowbound Outpost' },
    { id: '3-2',  name: 'Frozen Battlefield' },
    { id: '3-3',  name: 'Glacial Cave Entrance' },
    { id: '3-4',  name: 'Frozen Glacier Cavern' },
    { id: '3-5',  name: 'Hell Gate' },
    { id: '3-6',  name: 'Burning Ravine' },
    { id: '3-7',  name: 'Plains of Torment' },
    { id: '3-8',  name: 'Citadel of Ruin' },
    { id: '3-9',  name: 'Core of the Abyss' },
    { id: '3-10', name: 'Hell Command Chamber' },
  ],
};
const DIFFS = ['Normal', 'Nightmare', 'Hell', 'Torment'];
const CD_MS = 12 * 60 * 1000;

const DIFF_LV = {
  Normal:    {'1-1':1,'1-2':2,'1-3':3,'1-4':5,'1-5':6,'1-6':7,'1-7':8,'1-8':10,'1-9':11,'1-10':12,'2-1':13,'2-2':14,'2-3':15,'2-4':16,'2-5':17,'2-6':18,'2-7':19,'2-8':20,'2-9':21,'2-10':22,'3-1':23,'3-2':24,'3-3':25,'3-4':26,'3-5':27,'3-6':28,'3-7':29,'3-8':30,'3-9':31,'3-10':32},
  Nightmare: {'1-1':33,'1-2':34,'1-3':35,'1-4':35,'1-5':36,'1-6':37,'1-7':38,'1-8':39,'1-9':40,'1-10':40,'2-1':41,'2-2':41,'2-3':42,'2-4':42,'2-5':43,'2-6':43,'2-7':44,'2-8':44,'2-9':45,'2-10':45,'3-1':46,'3-2':47,'3-3':48,'3-4':49,'3-5':50,'3-6':50,'3-7':51,'3-8':51,'3-9':52,'3-10':52},
  Hell:      {'1-1':53,'1-2':54,'1-3':55,'1-4':56,'1-5':57,'1-6':58,'1-7':59,'1-8':59,'1-9':60,'1-10':60,'2-1':61,'2-2':62,'2-3':63,'2-4':64,'2-5':65,'2-6':66,'2-7':67,'2-8':68,'2-9':69,'2-10':69,'3-1':70,'3-2':71,'3-3':72,'3-4':73,'3-5':74,'3-6':75,'3-7':76,'3-8':76,'3-9':77,'3-10':77},
  Torment:   {'1-1':78,'1-2':79,'1-3':80,'1-4':81,'1-5':82,'1-6':83,'1-7':84,'1-8':84,'1-9':85,'1-10':85,'2-1':86,'2-2':86,'2-3':87,'2-4':87,'2-5':88,'2-6':88,'2-7':89,'2-8':89,'2-9':90,'2-10':90,'3-1':91,'3-2':91,'3-3':92,'3-4':92,'3-5':93,'3-6':93,'3-7':94,'3-8':94,'3-9':95,'3-10':95},
};
function getLv(stageId, diff) { return (DIFF_LV[diff] || {})[stageId] || '?'; }

// Default optimized route: 1 stage per act level for chest farming
const DEFAULT_ROUTE = [
  { stageId: '1-1',  diff: 'Normal' },
  { stageId: '1-4',  diff: 'Normal' },
  { stageId: '1-8',  diff: 'Normal' },
  { stageId: '2-3',  diff: 'Normal' },
  { stageId: '2-8',  diff: 'Normal' },
  { stageId: '3-8',  diff: 'Normal' },
  { stageId: '1-9',  diff: 'Nightmare' },
  { stageId: '3-5',  diff: 'Nightmare' },
  { stageId: '2-5',  diff: 'Hell' },
  { stageId: '1-3',  diff: 'Torment' },
];

/* ── i18n ── */
const I18N = {
  en: {
    ready: 'Ready', onCd: 'On CD', grey: 'Grey',
    add: 'Add', emptyTitle: 'No stages in your route',
    emptyHint: 'Add stages above or load the default route',
    drop: 'DROPPED!', readyMsg: 'READY', cancel: 'cancel',
    resetAll: 'Reset timers', resetConfirm: 'Reset all timers and checkmarks?',
    loadDefault: 'Load default route', clearRoute: 'Clear route',
    clearConfirm: 'Remove all stages from the route?',
    toastReady: 'Blue chest ready', toastAdded: 'Added',
    toastRemoved: 'Removed', toastExists: 'Already in route',
    toastReset: 'All reset', toastDefault: 'Default route loaded',
    toastCleared: 'Route cleared',
    greyHint: 'Grey chest collected (don\'t open)',
    blueHint: 'Click when blue chest drops',
    howTo: 'How to use',
    howToSteps: [
      'Follow your route in order <strong>(1, 2, 3...)</strong> from left to right, top to bottom.',
      'At each stage, farm until the <strong>common chest</strong> drops. Click the <img class="ht-icon" src="img/Item_910011.png"> to mark it as collected. <strong>Do NOT open it.</strong>',
      'Collecting grey chests without opening them increases the probability of a <strong>blue chest</strong> drop.',
      'When the <strong>blue chest</strong> drops, click <img class="ht-icon" src="img/Item_920011.png"> to start the <strong>12-minute cooldown</strong> timer.',
      'Once the timer finishes, the blue chest is ready to be collected. Move to the next stage and repeat.',
    ],
  },
  es: {
    ready: 'Listo', onCd: 'En CD', grey: 'Gris',
    add: 'Agregar', emptyTitle: 'Sin stages en tu ruta',
    emptyHint: 'Agrega stages arriba o carga la ruta por defecto',
    drop: '¡DROPÓ!', readyMsg: 'LISTO', cancel: 'cancelar',
    resetAll: 'Reiniciar timers', resetConfirm: '¿Reiniciar todos los timers y marcas?',
    loadDefault: 'Ruta por defecto', clearRoute: 'Limpiar ruta',
    clearConfirm: '¿Eliminar todos los stages de la ruta?',
    toastReady: 'Baúl azul listo', toastAdded: 'Agregado',
    toastRemoved: 'Eliminado', toastExists: 'Ya está en la ruta',
    toastReset: 'Todo reiniciado', toastDefault: 'Ruta por defecto cargada',
    toastCleared: 'Ruta limpiada',
    greyHint: 'Cofre gris recogido (no abrir)',
    blueHint: 'Click cuando dropee el cofre azul',
    howTo: 'Como usar',
    howToSteps: [
      'Sigue tu ruta en orden <strong>(1, 2, 3...)</strong> de izquierda a derecha, de arriba hacia abajo.',
      'En cada stage, farmea hasta que dropee el <strong>cofre comun</strong>. Haz click en <img class="ht-icon" src="img/Item_910011.png"> para marcarlo. <strong>NO lo abras.</strong>',
      'Recoger cofres grises sin abrirlos aumenta la probabilidad de que dropee un <strong>cofre azul</strong>.',
      'Cuando dropee el <strong>cofre azul</strong>, haz click en <img class="ht-icon" src="img/Item_920011.png"> para iniciar el <strong>cooldown de 12 minutos</strong>.',
      'Cuando el timer termine, el cofre azul esta listo. Pasa al siguiente stage y repite.',
    ],
  },
  pt: {
    ready: 'Pronto', onCd: 'Em CD', grey: 'Cinza',
    add: 'Adicionar', emptyTitle: 'Sem stages na rota',
    emptyHint: 'Adicione stages acima ou carregue a rota padrão',
    drop: 'DROPOU!', readyMsg: 'PRONTO', cancel: 'cancelar',
    resetAll: 'Resetar timers', resetConfirm: 'Resetar tudo?',
    loadDefault: 'Rota padrão', clearRoute: 'Limpar rota',
    clearConfirm: 'Remover todos os stages da rota?',
    toastReady: 'Baú azul pronto', toastAdded: 'Adicionado',
    toastRemoved: 'Removido', toastExists: 'Já na rota',
    toastReset: 'Tudo resetado', toastDefault: 'Rota padrão carregada',
    toastCleared: 'Rota limpa',
    greyHint: 'Baú cinza coletado (não abrir)',
    blueHint: 'Clique quando o baú azul dropar',
    howTo: 'Como usar',
    howToSteps: [
      'Siga sua rota em ordem <strong>(1, 2, 3...)</strong> da esquerda para a direita, de cima para baixo.',
      'Em cada stage, farme ate o <strong>bau comum</strong> dropar. Clique em <img class="ht-icon" src="img/Item_910011.png"> para marcar. <strong>NAO abra.</strong>',
      'Coletar baus cinzas sem abrir aumenta a probabilidade de dropar um <strong>bau azul</strong>.',
      'Quando o <strong>bau azul</strong> dropar, clique em <img class="ht-icon" src="img/Item_920011.png"> para iniciar o <strong>cooldown de 12 minutos</strong>.',
      'Quando o timer acabar, o bau azul esta pronto. Passe para o proximo stage e repita.',
    ],
  },
};

let lang = localStorage.getItem('tbh-lang') || 'en';
let soundOn = localStorage.getItem('tbh-sound') !== 'false';
let editMode = false;
let route = [];
let timers = {};
let notified = {};

function t(k) { return (I18N[lang] || I18N.en)[k] || k; }
function load() { try { route = JSON.parse(localStorage.getItem('tbh-route') || '[]'); } catch { route = []; } }
function save() { localStorage.setItem('tbh-route', JSON.stringify(route)); }

function findStage(stageId) {
  for (const act of Object.values(STAGES)) {
    const s = act.find(x => x.id === stageId);
    if (s) return s;
  }
  return null;
}

/* ── Sound ── */
let audioCtx;
function playAlert() {
  if (!soundOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784, 1046].forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.value = f; o.type = 'square';
      const t0 = audioCtx.currentTime + i * .12;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(.1, t0 + .02);
      g.gain.linearRampToValueAtTime(0, t0 + .14);
      o.start(t0); o.stop(t0 + .18);
    });
  } catch {}
}

/* ── Toast ── */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

/* ── i18n ── */
function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('.lang-opt').forEach(b => { b.classList.toggle('active', b.dataset.lang === lang); });
  const steps = (I18N[lang] || I18N.en).howToSteps || [];
  const ol = document.getElementById('howToSteps');
  if (ol) ol.innerHTML = steps.map(s => `<li>${s}</li>`).join('');
  localStorage.setItem('tbh-lang', lang);
}

function populateStages() {
  const act = document.getElementById('actSelect').value;
  const sel = document.getElementById('stageSelect');
  sel.innerHTML = '';
  STAGES[act].forEach(s => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = `${s.id} · ${s.name}`;
    sel.appendChild(o);
  });
}

/* ── Edit mode ── */
function toggleEditMode() {
  editMode = !editMode;
  document.getElementById('route').classList.toggle('edit-mode', editMode);
  document.getElementById('editBtn').classList.toggle('edit-active', editMode);
  document.getElementById('addSection').classList.toggle('edit-mode', editMode);
  applyCursorMode(editMode);
}

/* ── Stats ── */
function updateStats() {
  let ready = 0, cd = 0, grey = 0;
  const now = Date.now();
  route.forEach(r => {
    if (r.grey) grey++;
    if (r.blueDropAt != null) {
      if (now - r.blueDropAt >= CD_MS) ready++; else cd++;
    }
  });
  setText('readyCount', ready);
  setText('cdCount', cd);
  setText('greyCount', `${grey}/${route.length}`);
  document.getElementById('footerActions').style.display = route.length ? '' : 'none';
  document.getElementById('emptyState').style.display = route.length ? 'none' : '';
  // Show add bar when route is empty (so user can always add stages)
  const addSection = document.getElementById('addSection');
  if (route.length === 0) { addSection.classList.add('force-show'); }
  else { addSection.classList.remove('force-show'); }
}
function setText(id, val) {
  const el = document.getElementById(id);
  const s = String(val);
  if (el.textContent !== s) {
    el.textContent = s;
    el.style.transform = 'scale(1.25)';
    setTimeout(() => { el.style.transform = ''; }, 180);
  }
}

/* ── Timer ── */
function fmtTime(ms) {
  if (ms <= 0) return t('readyMsg');
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function tickTimer(key) {
  const r = route.find(x => x.key === key);
  const card = document.querySelector(`[data-key="${key}"]`);
  if (!r || !card || r.blueDropAt == null) return;

  const remaining = CD_MS - (Date.now() - r.blueDropAt);
  const pct = Math.min(100, (Date.now() - r.blueDropAt) / CD_MS * 100);

  const timerEl = card.querySelector('.timer');
  const fillEl = card.querySelector('.progress-fill');
  const blueBtn = card.querySelector('.blue-chest');

  if (remaining <= 0) {
    // Timer done: reset blue chest to grey + mark as done, stop timer
    if (!notified[key]) {
      notified[key] = true;
      playAlert();
      toast(`${t('toastReady')} — ${r.stageId}`);
    }
    r.blueDone = true;
    r.blueDropAt = null;
    stopTimer(key);
    save();
    render(true);
    return;
  } else {
    timerEl.textContent = fmtTime(remaining);
    timerEl.className = 'timer ' + (remaining < 60000 ? 'urgent' : 'counting');
    fillEl.style.width = pct + '%';
    fillEl.className = 'progress-fill' + (remaining < 60000 ? ' urgent' : '');
    card.classList.add('timer-active');
    card.classList.remove('timer-ready');
    if (blueBtn) { blueBtn.className = 'chest-btn blue-chest blue-active'; }
  }
  updateStats();
}

function startTimer(key) { stopTimer(key); tickTimer(key); timers[key] = setInterval(() => tickTimer(key), 1000); }
function stopTimer(key) { if (timers[key]) { clearInterval(timers[key]); delete timers[key]; } }

/* ── Drag & drop reorder ── */
let dragKey = null;

function initDrag(card, key) {
  card.setAttribute('draggable', 'true');

  card.addEventListener('dragstart', e => {
    if (!editMode) { e.preventDefault(); return; }
    dragKey = key;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => card.classList.add('dragging'), 0);
  });

  card.addEventListener('dragend', () => {
    dragKey = null;
    card.classList.remove('dragging');
    document.querySelectorAll('.stage-card').forEach(c =>
      c.classList.remove('drag-over-top', 'drag-over-bottom')
    );
  });

  card.addEventListener('dragover', e => {
    e.preventDefault();
    if (!dragKey || dragKey === key) return;
    e.dataTransfer.dropEffect = 'move';
    const mid = card.getBoundingClientRect().top + card.offsetHeight / 2;
    document.querySelectorAll('.stage-card').forEach(c =>
      c.classList.remove('drag-over-top', 'drag-over-bottom')
    );
    card.classList.add(e.clientY < mid ? 'drag-over-top' : 'drag-over-bottom');
  });

  card.addEventListener('dragleave', () =>
    card.classList.remove('drag-over-top', 'drag-over-bottom')
  );

  card.addEventListener('drop', e => {
    e.preventDefault();
    card.classList.remove('drag-over-top', 'drag-over-bottom');
    if (!dragKey || dragKey === key) return;
    const fromIdx = route.findIndex(r => r.key === dragKey);
    const toIdx   = route.findIndex(r => r.key === key);
    if (fromIdx === -1 || toIdx === -1) return;
    const mid = card.getBoundingClientRect().top + card.offsetHeight / 2;
    const before = e.clientY < mid;
    const [moved] = route.splice(fromIdx, 1);
    const newTo   = route.findIndex(r => r.key === key);
    route.splice(before ? newTo : newTo + 1, 0, moved);
    save(); render(true);
  });
}

/* ── Render ── */
function render(skipAnim = false) {
  const container = document.getElementById('route');
  container.querySelectorAll('.stage-card').forEach(c => c.remove());
  const empty = document.getElementById('emptyState');

  route.forEach((r, i) => {
    // If timer was already expired when loading (e.g. after page refresh), auto-resolve
    if (r.blueDropAt != null && Date.now() - r.blueDropAt >= CD_MS) {
      r.blueDone = true;
      r.blueDropAt = null;
    }

    const card = document.createElement('div');
    card.className = 'stage-card';
    card.dataset.key = r.key;
    card.dataset.diff = r.diff;
    if (!skipAnim) card.style.animationDelay = `${i * 30}ms`;
    else card.style.animation = 'none';

    const hasTimer = r.blueDropAt != null; // only true while countdown active
    if (hasTimer) card.classList.add('timer-active');

    const greyState = r.grey ? 'collected' : '';
    const blueState = r.blueDone ? 'blue-done' : (hasTimer ? 'blue-active' : '');

    card.innerHTML = `
      <div class="card-main">
        <span class="drag-handle" title="Drag to reorder">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="2" r="1.2"/><circle cx="7" cy="2" r="1.2"/><circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="3" cy="12" r="1.2"/><circle cx="7" cy="12" r="1.2"/></svg>
        </span>
        <span class="step-num">${i + 1}</span>
        <div class="chests-group">
          <button class="chest-btn grey-chest ${greyState}" title="${t('greyHint')}">
            <img src="img/Item_910011.png" alt="grey" />
          </button>
          <button class="chest-btn blue-chest ${blueState}" title="${t('blueHint')}">
            <img src="img/Item_920011.png" alt="blue" />
          </button>
        </div>
        <div class="stage-info">
          <div class="stage-id">
            ${r.stageId}
            <span class="diff-tag ${r.diff}">${r.diff}</span>
            <span class="lv-tag">Lv ${getLv(r.stageId, r.diff)}</span>
          </div>
          <div class="stage-name">${r.stageName}</div>
        </div>
        <div class="blue-action">
          ${hasTimer
            ? `<div class="timer counting">${fmtTime(CD_MS - (Date.now() - r.blueDropAt))}</div>
               <button class="cancel-timer">${t('cancel')}</button>`
            : ''}
          <button class="remove-btn" title="Remove">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="progress"><div class="progress-fill" style="width:0%"></div></div>
    `;

    card.querySelector('.grey-chest').addEventListener('click', () => {
      r.grey = !r.grey;
      card.querySelector('.grey-chest').classList.toggle('collected', r.grey);
      save(); updateStats();
    });

    const blueBtn = card.querySelector('.blue-chest');
    blueBtn.addEventListener('click', () => {
      if (r.blueDropAt != null) return; // ignore clicks while countdown running
      if (r.blueDone) {
        r.blueDone = false;
      } else {
        r.blueDropAt = Date.now();
        notified[r.key] = false;
      }
      save(); render(true);
    });
    if (hasTimer) {
      card.querySelector('.cancel-timer').addEventListener('click', () => {
        r.blueDropAt = null; r.blueDone = false;
        stopTimer(r.key); notified[r.key] = false;
        save(); render(true);
      });
    }

    card.querySelector('.remove-btn').addEventListener('click', () => {
      stopTimer(r.key);
      route = route.filter(x => x.key !== r.key);
      save(); render(); toast(t('toastRemoved')); // animate after removal
    });

    initDrag(card, r.key);
    container.insertBefore(card, empty);
    if (hasTimer) startTimer(r.key);
  });

  updateStats();
  applyLang();
}

/* ── Actions ── */
function addToRoute() {
  const stageId = document.getElementById('stageSelect').value;
  const diff = document.getElementById('diffSelect').value;
  const key = `${stageId}-${diff}`;
  if (route.some(r => r.key === key)) { toast(t('toastExists')); return; }
  const stage = findStage(stageId);
  route.push({ key, stageId, stageName: stage.name, diff, grey: false, blueDropAt: null });
  save(); render(); toast(t('toastAdded'));
}

function loadDefaultRoute() {
  Object.keys(timers).forEach(k => clearInterval(timers[k]));
  timers = {}; notified = {};
  route = DEFAULT_ROUTE.map(d => {
    const stage = findStage(d.stageId);
    return { key: `${d.stageId}-${d.diff}`, stageId: d.stageId, stageName: stage.name, diff: d.diff, grey: false, blueDropAt: null };
  });
  save(); render(); toast(t('toastDefault'));
}

function resetTimers() {
  if (!confirm(t('resetConfirm'))) return;
  Object.keys(timers).forEach(k => clearInterval(timers[k]));
  timers = {}; notified = {};
  route.forEach(r => { r.grey = false; r.blueDropAt = null; });
  save(); render(); toast(t('toastReset'));
}

function clearRoute() {
  if (!confirm(t('clearConfirm'))) return;
  Object.keys(timers).forEach(k => clearInterval(timers[k]));
  timers = {}; notified = {}; route = [];
  save(); render(); toast(t('toastCleared'));
}

/* ── Custom cursors (soulstones per difficulty) ── */
const _cursors = {};

function makeCursorUrl(img) {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(-1, 1); // espejo vertical (flip left-right)
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
  return canvas.toDataURL('image/png');
}

function applyCursorMode(isEditMode) {
  let s = document.getElementById('cursor-style');
  if (!s) { s = document.createElement('style'); s.id = 'cursor-style'; document.head.appendChild(s); }
  if (isEditMode || !_cursors.Normal) { s.textContent = ''; return; }
  // Normal mode: soulstone cursors, matched to difficulty — no pointer/grab/hand distractions
  s.textContent = `
    * { cursor: url("${_cursors.Normal}") 14 2, auto !important; }
    .stage-card[data-diff="Nightmare"], .stage-card[data-diff="Nightmare"] * { cursor: url("${_cursors.Nightmare}") 14 2, auto !important; }
    .stage-card[data-diff="Hell"],      .stage-card[data-diff="Hell"]      * { cursor: url("${_cursors.Hell}")      14 2, auto !important; }
    .stage-card[data-diff="Torment"],   .stage-card[data-diff="Torment"]   * { cursor: url("${_cursors.Torment}")   14 2, auto !important; }
  `;
}

function initCursor() {
  const items = [
    { diff: 'Normal',    src: 'img/Item_190001.png' },
    { diff: 'Nightmare', src: 'img/Item_190002.png' },
    { diff: 'Hell',      src: 'img/Item_190003.png' },
    { diff: 'Torment',   src: 'img/Item_190004.png' },
  ];
  let loaded = 0;
  items.forEach(({ diff, src }) => {
    const img = new Image();
    img.onload = () => {
      _cursors[diff] = makeCursorUrl(img);
      if (++loaded === items.length) applyCursorMode(false);
    };
    img.src = src;
  });
}

/* ── Init ── */
function init() {
  load();
  if (!route.length) loadDefaultRoute();

  populateStages();
  document.getElementById('actSelect').addEventListener('change', populateStages);
  document.getElementById('addBtn').addEventListener('click', addToRoute);
  document.getElementById('resetBtn').addEventListener('click', resetTimers);
  document.getElementById('clearBtn').addEventListener('click', clearRoute);
  document.getElementById('defaultBtn').addEventListener('click', loadDefaultRoute);

  document.getElementById('editBtn').addEventListener('click', toggleEditMode);
  initCursor();

  document.getElementById('langSwitch').addEventListener('click', e => {
    if (!e.target.dataset.lang) return;
    lang = e.target.dataset.lang;
    applyLang(); render();
  });

  // How-to toggle
  const howToggle = document.getElementById('howToToggle');
  const howContent = document.getElementById('howToContent');
  howToggle.addEventListener('click', () => {
    howToggle.classList.toggle('open');
    howContent.classList.toggle('open');
  });

  const soundBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  function updateSoundUI() {
    soundBtn.classList.toggle('muted', !soundOn);
    soundIcon.innerHTML = soundOn
      ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'
      : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
  }
  soundBtn.addEventListener('click', () => { soundOn = !soundOn; localStorage.setItem('tbh-sound', soundOn); updateSoundUI(); });
  updateSoundUI();

  render();
}

document.addEventListener('DOMContentLoaded', init);
