const socket = io();

// This function can be called from any button on any page
function sendToggle(deviceName) {
    // We check the current state (you can store this in a data-attribute on the button)
    const element = document.getElementById(deviceName);
    const currentState = element.dataset.state === 'true';

    socket.emit('device-toggle', { 
        device: deviceName, 
        status: !currentState 
    });
}

// Every page listens for updates
socket.on('status-update', (data) => {
    const element = document.getElementById(data.device);
    if (element) {
        // Update the UI only if the device exists on the current page
        element.dataset.state = data.status;
        updateUI(element, data.status); 
    }
});
// At the top of server.js
let deviceStates = {
    'living-room-light': false,
    'kitchen-light': false
};

io.on('connection', (socket) => {
    // Send the current states to the user as soon as they open any page
    socket.emit('init-states', deviceStates);

    socket.on('device-toggle', (data) => {
        deviceStates[data.device] = data.status; // Save the state
        io.emit('status-update', data); // Tell everyone
    });
});
// server.js updates
let homeState = {
    "living-room-light": false,
    "kitchen-light": false,
    "security-system": true
};

io.on('connection', (socket) => {
    // 1. Immediately send the current state to the newly connected page
    socket.emit('sync-state', homeState);

    socket.on('device-toggle', (data) => {
        // 2. Update the "memory"
        homeState[data.device] = data.status;
        
        // 3. Tell EVERYONE the new state
        io.emit('status-update', data);
    });
});

function adjustTemp(event, id, delta) {
    event.stopPropagation(); // Prevents the card toggle from firing
    const tempElement = document.getElementById(`temp-${id}`);
    let currentTemp = parseInt(tempElement.innerText);
    let newTemp = currentTemp + delta;

    // Send to Pi
    socket.emit('temp-adjust', { id: id, value: newTemp });
}

// Listen for temperature updates from the Pi
socket.on('temp-update', (data) => {
    const tempElement = document.getElementById(`temp-${data.id}`);
    if (tempElement) {
        tempElement.innerText = `${data.value}°C`;
    }
});

function setMode(modeName) {
    socket.emit('mode-change', modeName);
}

socket.on('mode-update', (mode) => {
    const badge = document.getElementById('mode-badge');
    if (badge) badge.innerText = mode.charAt(0).toUpperCase() + mode.slice(1);
    
    // Visual feedback on the buttons
    document.querySelectorAll('.qa-btn').forEach(btn => {
        btn.classList.remove('active-mode'); // Add a CSS class for the active one
    });
    document.getElementById(`qa-${mode}`).classList.add('active-mode');
});

socket.on('pi-temp-update', (temp) => {
    const tempDisplay = document.getElementById('pi-temp');
    if (tempDisplay) {
        tempDisplay.innerText = temp;
        
        // Change color if it gets too hot (Presentation flare!)
        if (parseFloat(temp) > 60) {
            tempDisplay.style.color = '#f87171'; // Red
        } else {
            tempDisplay.style.color = 'white';
        }
    }
});