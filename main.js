
//  * Shared across home.html, rooms.html, devices.html, settings.html
//  *
//  * Connects to the backend via Socket.io (served automatically by the server).
//  * Handles: Pi CPU temp display, device state sync, thermostat, mode buttons.
//  */

const socket = io(); // Connects to same host — no URL needed

// Pi CPU Temperature
// Listens for 'pi-temp-update' from the server,updates #pi-temp on whichever page has it
socket.on('pi-temp-update', (temp) => {
  const el = document.getElementById('pi-temp');
  if (!el) return;

  if (temp === null) {
    el.textContent = '--';
    el.style.color = 'rgba(255,255,255,0.4)';
    return;
  }

  el.textContent = parseFloat(temp).toFixed(1);

  if (temp >= 80)      el.style.color = '#f87171'; // red  — critical
  else if (temp >= 65) el.style.color = '#fb923c'; // orange — warm
  else                 el.style.color = '#4ade80'; // green  — normal
});

// Full device state sync
// Server emits 'state-update' whenever anything changes
socket.on('state-update', (devices) => {
  // Lights
  syncLight('light1', devices.lights.living_room);
  syncLight('light2', devices.lights.bedroom);
  syncLight('light3', devices.lights.hallway);

  // Lock
  syncLock('lock1', devices.locks.front_door);

  // Thermostats — update badge text
  syncThermostat('thermo1', devices.thermostats.living_room);
  syncThermostat('thermo2', devices.thermostats.bedroom);
});

// Live sensor updates (motion + room temp)
socket.on('sensor-update', (data) => {
  // Room temperature display (if page has it)
  const roomTempEl = document.getElementById('room-temp');
  if (roomTempEl) roomTempEl.textContent = data.temperature.toFixed(1);

  // Motion indicator (if page has it)
  const motionEl = document.getElementById('motion-status');
  if (motionEl) {
    motionEl.textContent   = data.motion ? '● ACTIVE' : '● CLEAR';
    motionEl.style.color   = data.motion ? '#60a5fa' : '#4b5563';
  }
});


// Automation log updates
socket.on('log-update', (entries) => {
  const logEl = document.getElementById('automation-log');
  if (!logEl) return;
  logEl.innerHTML = entries.map(e => {
    const t = new Date(e.time).toTimeString().slice(0, 8);
    return `<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:12px;">
      <span style="color:rgba(255,255,255,.35);margin-right:8px;">${t}</span>
      <span style="color:rgba(255,255,255,.75);">${e.message}</span>
    </div>`;
  }).join('');
});


// Mode badge update
socket.on('mode-update', (mode) => {
  const badge = document.getElementById('mode-badge');
  if (badge) badge.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

  document.querySelectorAll('.qa-btn').forEach(btn => btn.classList.remove('active-mode'));
  const activeBtn = document.getElementById(`qa-${mode}`);
  if (activeBtn) activeBtn.classList.add('active-mode');
});

// Thermostat +/- echo back
socket.on('temp-update', (data) => {
  const el = document.getElementById(`temp-${data.id}`);
  if (el) el.textContent = `${data.value}°C`;
});

// UI sync helpers
function syncLight(id, isOn) {
  const card      = document.getElementById(`card-${id}`);
  const statusEl  = document.getElementById(`status-${id}`);
  if (!statusEl) return;

  statusEl.textContent = isOn ? '● ON' : '● OFF';
  statusEl.style.color  = isOn ? '#4ade80' : '#4b5563';

  if (card) {
    if (isOn) card.classList.remove('off');
    else      card.classList.add('off');
  }
}

function syncLock(id, isLocked) {
  const statusEl = document.getElementById(`status-${id}`);
  const iconEl   = document.getElementById(`icon-${id}`);
  if (!statusEl) return;

  statusEl.textContent = isLocked ? '● LOCKED' : '● UNLOCKED';
  statusEl.style.color  = isLocked ? '#4ade80' : '#f87171';
  if (iconEl) iconEl.setAttribute('name', isLocked ? 'lock-closed' : 'lock-open');
}

function syncThermostat(id, temp) {
  const el = document.getElementById(`temp-${id}`);
  if (el) el.textContent = `${temp}°C`;
}


// Controls — called from onclick in HTML files

// Maps card IDs from home.html to device room names in mockDevices.js
const LIGHT_ROOM_MAP = {
  light1: 'living_room',
  light2: 'bedroom',
  light3: 'hallway',
};

window.toggleDevice = function(id, label) {
  const room = LIGHT_ROOM_MAP[id];
  if (!room) return;
  socket.emit('toggle-relay', { room });
};

window.toggleLock = function(id, label) {
  // Read current lock state from status element to decide action
  const statusEl = document.getElementById(`status-${id}`);
  const isLocked = statusEl && statusEl.textContent.includes('LOCKED');
  const door = 'front_door';
  fetch(`/api/lock/${door}/${isLocked ? 'unlock' : 'lock'}`, { method: 'POST' })
    .catch(err => console.warn('Lock API error:', err));
};

window.adjustTemp = function(event, id, delta) {
  event.stopPropagation();
  const el = document.getElementById(`temp-${id}`);
  if (!el) return;
  const current = parseFloat(el.textContent) || 21;
  const next    = Math.max(10, Math.min(35, current + delta));
  socket.emit('temp-adjust', { id, value: next });
};

window.setMode = function(mode) {
  socket.emit('mode-change', mode);
};


// Connection status
socket.on('connect',    () => console.log('[SmartHome] Connected to backend'));
socket.on('disconnect', () => console.warn('[SmartHome] Disconnected — retrying...'));