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
    notifications: toggleState.notifications ? 'Notifications ON 🔔' : 'Notifications OFF 🔕',
    darkmode:       toggleState.darkmode      ? 'Dark Mode ON 🌙'     : 'Dark Mode OFF ☀️',
    sounds:         toggleState.sounds        ? 'Sound Effects ON 🔊' : 'Sound Effects OFF 🔇',
  };
  showToast(labels[key]);
}