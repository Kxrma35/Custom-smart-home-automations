//  Room device state 
const roomDevices = {
  living:    { ids: ['light1','thermo1','tv1'],              total: 3, on: ['light1','thermo1'] },
  bedroom:   { ids: ['light2','thermo2','fan1'],             total: 3, on: ['thermo2'] },
  kitchen:   { ids: ['klight','coffee','backlock','speaker'],total: 4, on: ['klight','speaker'] },
  entrance:  { ids: ['lock1'],                               total: 1, on: ['lock1'] },
  frontyard: { ids: ['cam1'],                                total: 1, on: ['cam1'] },
};

const deviceState = {};
Object.values(roomDevices).forEach(r =>
  r.ids.forEach(id => (deviceState[id] = r.on.includes(id)))
);

// Toast 
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// Toggle room to expand/collapse
function toggleRoom(room) {
  const body = document.getElementById('body-' + room);
  const chev = document.getElementById('chev-' + room);
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  chev.classList.toggle('open', !isOpen);
}

// Update room active count label 
function updateRoomCount(room) {
  const r  = roomDevices[room];
  const on = r.ids.filter(id => deviceState[id]).length;
  document.getElementById(room + '-count').textContent = `${on} of ${r.total} active`;
}

// Toggle a device inside a room 
function toggleRoomDevice(id, name, room) {
  deviceState[id] = !deviceState[id];
  const on   = deviceState[id];
  const card = document.getElementById('rc-'   + id);
  const dot  = document.getElementById('rdot-' + id);
  const st   = document.getElementById('rst-'  + id);

  if (on) {
    card.classList.remove('off');
    dot.className = 'dot dot-on';
    if (st) { st.style.color = '#4ade80'; st.textContent = ' ON'; }
    showToast(`${name} turned ON`);
  } else {
    card.classList.add('off');
    dot.className = 'dot dot-off';
    if (st) { st.style.color = '#4b5563'; st.textContent = ' OFF'; }
    showToast(`${name} turned OFF`);
  }
  updateRoomCount(room);
}

// Toggle rooms expand/collapse sate(by rotating the chevron)
function toggleRoom(header) {
    const chev = header.querySelector('.chev');
    if (chev) chev.style.transform = chev.style.transform === 'rotate(90deg)' ? '' : 'rotate(90deg)';
}

// Init: open living room by default 
document.addEventListener('DOMContentLoaded', () => {
  toggleRoom('living');
});