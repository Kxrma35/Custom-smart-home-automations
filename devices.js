// Device on/off state
const deviceOn = {
  light1: true,  light2: false, klight: true,
  thermo1: true, thermo2: true, fan1: false,
  lock1: true,   lock2: false,
  cam1: true,
  tv1: false,    speaker: true, coffee: false
};

const lockState = { lock1: true, lock2: false };
const temps     = { thermo1: 22, thermo2: 20 };
let activeFilter = 'all';

// Toast 
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// Update active count in header
function updateCount() {
  const on = Object.values(deviceOn).filter(Boolean).length;
  document.getElementById('active-count').textContent = on;
}

// Toggle generic device card 
function toggleDevice(card) {
  const id   = card.dataset.id;
  const name = card.dataset.name;
  deviceOn[id] = !deviceOn[id];
  const on  = deviceOn[id];
  const dot = document.getElementById('dot-' + id);
  const st  = card.querySelector('.dev-status');
  const nm  = card.querySelector('.dev-name');

   if (on) {
    card.classList.remove('off');
    dot.className = 'dot dot-on';
    if (st) { st.style.color = '#4ade80'; st.textContent = '● ON'; }
    if (nm) nm.style.color = 'white';
    showToast(`${name} turned ON ✓`);
  } else {
    card.classList.add('off');
    dot.className = 'dot dot-off';
    if (st) { st.style.color = '#4b5563'; st.textContent = '● OFF'; }
    if (nm) nm.style.color = 'rgba(255,255,255,.5)';
    showToast(`${name} turned OFF`);
  }
  updateCount();
}

// ── Toggle lock card ──────────────────────────────────────
function toggleLockCard(card, name) {
  const id = card.dataset.id;
  lockState[id] = !lockState[id];
  const locked = lockState[id];
  const dot = document.getElementById('dot-' + id);
  const st  = card.querySelector('.dev-status');

  if (locked) {
    dot.className = 'dot dot-on';
    if (st) { st.style.color = '#4ade80'; st.textContent = '● LOCKED'; }
    showToast(`${name} LOCKED `);
  } else {
    dot.className = 'dot dot-yellow';
    if (st) { st.style.color = '#facc15'; st.textContent = '● UNLOCKED'; }
    showToast(`${name} UNLOCKED `);
  }
}

// ── Adjust thermostat temperature ─────────────────────────
function adjTemp(e, id, delta) {
  e.stopPropagation();
  temps[id] = Math.min(30, Math.max(10, temps[id] + delta));
  document.getElementById('temp-' + id).textContent = temps[id] + '°C';
  showToast(`Thermostat set to ${temps[id]}°C`);
}
