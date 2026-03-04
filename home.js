// State
const state = {
  devices: {
    light1: true, thermo1: true, lock1: true,
    cam1: true, light2: false, thermo2: true
  },
  locks: { lock1: true },
  temps: { thermo1: 22, thermo2: 20 },
  mode: 'normal',
  energy: 2.4
};

//  Toast 
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

//  Update active count & energy 
function updateStats() {
  const on = Object.values(state.devices).filter(Boolean).length;
  document.getElementById('active-count').textContent = on;
  const energy = (on * 0.34).toFixed(1);
  document.getElementById('energy-val').textContent = energy;
}

// Toggle device to turn on/off
function toggleDevice(id, name) {
  state.devices[id] = !state.devices[id];
  const on = state.devices[id];
  const card     = document.getElementById('card-'   + id);
  const dot      = document.getElementById('dot-'    + id);
  const statusEl = document.getElementById('status-' + id);

  if (on) {
    card.classList.remove('off');
    dot.className = 'dot dot-on';
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '● ON'; }
    showToast(`${name} turned ON`);
  } else {
    card.classList.add('off');
    dot.className = 'dot dot-off';
    if (statusEl) { statusEl.style.color = '#4b5563'; statusEl.textContent = '● OFF'; }
    showToast(`${name} turned OFF`);
  }
  updateStats();
}

//  Toggle lock 
function toggleLock(id, name) {
  state.locks[id] = !state.locks[id];
  const locked   = state.locks[id];
  const statusEl = document.getElementById('status-' + id);
  if (locked) {
    statusEl.style.color = '#4ade80';
    statusEl.textContent = ' LOCKED';
    showToast(`${name} is now LOCKED `);
  } else {
    statusEl.style.color = '#facc15';
    statusEl.textContent = '● UNLOCKED';
    showToast(`${name} is now UNLOCKED`);
  }
}

//  Adjust thermostat temperature 
function adjustTemp(e, id, delta) {
  e.stopPropagation();
  state.temps[id] = Math.min(30, Math.max(10, state.temps[id] + delta));
  document.getElementById('temp-' + id).textContent = state.temps[id] + '°C';
  showToast(`Temperature set to ${state.temps[id]}°C`);
}

// ── Quick action modes 
const modeConfig = {
  allon:  { label: ' All On',  status: 'All devices activated',       greeting: 'Everything is On',  energy: 4.2, on: ['light1','thermo1','lock1','cam1','light2','thermo2'] },
  sleep:  { label: ' Sleep',  status: 'Sleep mode active',            greeting: 'Good Night',        energy: 0.6, on: ['thermo1','thermo2'] },
  away:   { label: ' Away',   status: 'Away mode — home secured',     greeting: 'See You Soon',      energy: 0.3, on: ['lock1','cam1'] },
  home:   { label: ' Home',   status: 'Welcome home mode active',     greeting: 'Welcome Home',      energy: 2.4, on: ['light1','thermo1','lock1','cam1','thermo2'] },
  normal: { label: ' Normal',  status: 'Your home is running smoothly',greeting: 'Good Morning',      energy: 2.4, on: ['light1','thermo1','lock1','cam1','thermo2'] },
};

function setMode(mode) {
  state.mode = mode;
  const cfg = modeConfig[mode];

  // Reset all qa-btn active states
  ['allon','sleep','away','home'].forEach(m => {
    document.getElementById('qa-' + m).classList.remove('qa-active');
  });
  document.getElementById('qa-' + mode)?.classList.add('qa-active');

  // Update greeting & status
  document.getElementById('greeting').textContent    = cfg.greeting;
  document.getElementById('status-text').textContent = cfg.status;
  document.getElementById('mode-badge').textContent  = cfg.label;

  // Update device states
  const allIds = ['light1','thermo1','lock1','cam1','light2','thermo2'];
  allIds.forEach(id => {
    const shouldBeOn = cfg.on.includes(id);
    if (state.devices[id] !== shouldBeOn) {
      state.devices[id] = shouldBeOn;
      const card     = document.getElementById('card-'   + id);
      const dot      = document.getElementById('dot-'    + id);
      const statusEl = document.getElementById('status-' + id);
      if (shouldBeOn) {
        card.classList.remove('off');
        dot.className = 'dot dot-on';
        if (statusEl && !statusEl.textContent.includes('LOCK') && !statusEl.textContent.includes('RECORD')) {
          statusEl.style.color = '#4ade80'; statusEl.textContent = ' ON';
        }
      } else {
        card.classList.add('off');
        dot.className = 'dot dot-off';
        if (statusEl && !statusEl.textContent.includes('LOCK') && !statusEl.textContent.includes('RECORD')) {
          statusEl.style.color = '#4b5563'; statusEl.textContent = ' OFF';
        }
      }
    }
  });

  document.getElementById('energy-val').textContent    = cfg.energy;
  document.getElementById('active-count').textContent  = cfg.on.length;
  showToast(`${cfg.label} mode activated`);
}

// Init 
document.addEventListener('DOMContentLoaded', updateStats);