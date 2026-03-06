socket.on('temp-update', (data) => {
    const tempEl = document.getElementById('pi-temp');
    if (tempEl) {
        tempEl.innerText = `CPU: ${data.celsius}°C`;
        // Optional: Change color if getting too hot
        tempEl.style.color = data.celsius > 70 ? '#ef4444' : '#4ade80';
    }
});


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

// Toggle lock card 
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

// Adjust thermostat temperature
function adjTemp(e, id, delta) {
  e.stopPropagation();
  temps[id] = Math.min(30, Math.max(10, temps[id] + delta));
  document.getElementById('temp-' + id).textContent = temps[id] + '°C';
  showToast(`Thermostat set to ${temps[id]}°C`);
}

// Set active filter pill
 function setFilter(pill) {
  document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  activeFilter = pill.dataset.filter;
  applyFilters();
}

// Apply search and filter
function applyFilters() {
  const query    = document.getElementById('search-input').value.toLowerCase().trim();
  const clearBtn = document.getElementById('clear-search');
  clearBtn.style.display = query ? 'block' : 'none';

  let visibleCount = 0;
  document.querySelectorAll('.device-card').forEach(card => {
    const cat   = card.dataset.category;
    const name  = card.dataset.name.toLowerCase();
    const matchFilter = activeFilter === 'all' || cat === activeFilter;
    const matchSearch = !query || name.includes(query);
    const show = matchFilter && matchSearch;
    card.classList.toggle('hidden', !show);
    if (show) visibleCount++;
  });

  document.getElementById('empty-state').classList.toggle('show', visibleCount === 0);
}

// clear search input
function clearSearch() {
  document.getElementById('search-input').value = '';
  applyFilters();
}

// Init
document.addEventListener('DOMContentLoaded', updateCount);