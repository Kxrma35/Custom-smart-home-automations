// Toast
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// Modals
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Toggle switches
const toggleState = { notifications: true, darkmode: false, sounds: true };

function toggleSetting(key) {
  toggleState[key] = !toggleState[key];
  document.getElementById('toggle-' + key).classList.toggle('on', toggleState[key]);

  const labels = {
    notifications: toggleState.notifications ? 'Notifications ON ' : 'Notifications OFF ',
    darkmode:       toggleState.darkmode      ? 'Dark Mode ON '     : 'Dark Mode OFF ',
    sounds:         toggleState.sounds        ? 'Sound Effects ON ' : 'Sound Effects OFF ',
  };
  showToast(labels[key]);
}

// Save profile 
function saveProfile() {
  const name = document.getElementById('input-name').value.trim() || 'John Doe';
  document.getElementById('display-name').textContent = name;
  document.getElementById('sidebar-name').textContent = name;
  closeModal('modal-profile');
  showToast(`✓ Profile updated — Hello, ${name}!`);
}

// Save location
function saveLocation() {
  const loc   = document.getElementById('input-location').value.trim() || '123 Main Street';
  const short = loc.length > 18 ? loc.slice(0, 16) + '…' : loc;
  document.getElementById('display-location').textContent = short;
  closeModal('modal-location');
  showToast('✓ Location saved');
}

//  Save network 
function saveNetwork() {
  const ssid = document.getElementById('input-ssid').value.trim() || 'Home WiFi';
  document.getElementById('display-network').textContent = ssid;
  closeModal('modal-network');
  showToast(`✓ Connected to "${ssid}"`);
}