# Smart Home Dashboard 

> **Real-Time Smart Home Monitoring & Control Interface**

Smart Home Dashboard is a browser-based smart home management platform that allows users to monitor and control connected home devices across multiple rooms in real time. The project simulates a live smart home environment, integrating sensor data, camera motion detection, device state management, and an automation event log — all from a clean, responsive web interface.

---

##  Description

This project is built primarily around **JavaScript**, using a combination of supporting technologies to deliver a dynamic, real-time smart home experience.

| Technology | Role |
|---|---|
| **HTML** | Page structure and DOM skeleton across all views |
| **CSS & Tailwind CSS** | Custom styling, layout, dark theme, and responsive design |
| **JavaScript** | Core logic for interactivity, real-time updates, and device control |
| **Socket.io** | Real-time bidirectional communication for live sensor and device data |
| **JSON** | Data formatting for device states and automation events |

---

##  Pages

| Page | Description |
|---|---|
| `home.html` | Dashboard overview and summary of active devices |
| `rooms.html` | Room-by-room device management with collapsible sections |
| `devices.html` | Full list of all connected smart devices |
| `settings.html` | App configuration and user preferences |

---

##  Features

###  Rooms Page
- Collapsible room sections with animated chevron toggle
- Device cards per room showing live status indicators (active/inactive)
- Rooms include: **Living Room, Bedroom, Kitchen, Entrance, Front Yard**
- Device types include lights, thermostats, smart TVs, and more
- Temperature badges showing real-time room conditions

###  Sensor Status Bar
- **Hallway Motion Sensor** — detects and displays motion state (CLEAR / DETECTED)
- **Room Temperature** — live °C reading from a physical/simulated sensor
- **Raspberry Pi CPU Temperature** — monitors the host device running the system

###  Camera Motion Detection Widget
- Start/stop camera toggle button
- Real-time **motion level bar** showing intensity as a percentage
- Flash indicator when motion is detected
- Adjustable sensitivity: **Low / Medium / High**
- Live status dot and label reflecting camera state

###  Automation Log
- Scrollable log of recent automation events
- Live-updating feed of system events as they happen in real time

###  Responsive Design
- Full **sidebar navigation** on desktop (Home, Rooms, Devices, Settings)
- **Bottom navigation bar** on mobile screens
- Layout adapts cleanly across all screen sizes using Tailwind and custom CSS breakpoints
- Dark theme throughout with purple accent colors

---

##  JavaScript Features

- **DOM Manipulation** — dynamic rendering of device cards, sensor values, and log entries
- **Event Handling** — user interactions including toggles, button clicks, and sensitivity controls
- **Socket.io (Real-Time)** — live data streaming for sensor readings and device state changes
- **Asynchronous Programming** — non-blocking updates, animation delays, and live polling
- **Camera Motion API** — modular `CameraMotion` object handling stream, detection, and UI state
- **Chevron Toggle Logic** — `toggleRoom()` animating room expand/collapse with CSS transforms
- **Error Handling** — graceful fallbacks for failed socket connections and missing sensor data

---

##  Repository

```
https://github.com/Kxrma35/Custom-smart-home-automations.git
```

---

##  Technologies Used

- HTML
- CSS
- Tailwind CSS
- JavaScript
- Socket.io
- JSON
- Git & GitHub
- Raspberry Pi 5 4gb model

---

##  Known Bugs

- The hallway camera still does not work because of bugs within the server.js in the raspberry pi

- In the automation log on the homepage and rooms page, it should read the timestamps but it reads invalid only

---

##  Support & Contact

**Karma Kioko**

- **Email:** karmanjeruh5@gmail.com
- **Phone:** 0793960550