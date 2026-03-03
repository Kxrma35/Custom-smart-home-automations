# Smart Home Automation System

## Overview
This project is a custom smart home automation platform that allows users to control and automate household devices (lights, thermostat, locks, sensors) through a web dashboard.  
It uses **HTML, Tailwind CSS, JavaScript, Raspberry Pi 4, and Ubuntu** to create an affordable, open-source solution.

---

## Problem It Solves
Smart devices today are often:
- Controlled through different apps (fragmented experience).
- Expensive and tied to proprietary ecosystems.
- Limited in customisation for personal automation needs.

**This project solves these issues by:**
- Providing a single dashboard for all devices.
- Allowing users to define their own automation rules.
- Running on open-source hardware/software (Raspberry Pi + Ubuntu).

---

## How It Works
1. **Frontend Dashboard**
   - Built with HTML and styled using Tailwind CSS.
   - Displays device tiles (lights, thermostat, locks).
   - Provides controls (on/off, adjust temperature, lock/unlock).

2. **Automation Logic**
   - JavaScript handles DOM interactions, button clicks, and localStorage.
   - Defines automation rules (e.g., “If motion detected after 10 PM - turn on hallway light”).
   - Communicates with backend APIs via `fetch()`.

3. **Backend & Raspberry Pi**
   - Raspberry Pi 4 runs Node.js on Ubuntu.
   - Exposes REST endpoints (`/api/light/on`, `/api/lock/unlock`).
   - Controls GPIO pins to interact with physical devices (relays, sensors).
   - Ubuntu provides a stable environment to host the web app and backend services.

---

## Languages & Their Roles
- **HTML** - Structures the dashboard (buttons, device tiles).
- **Tailwind CSS** - Provides clean, responsive styling.
- **JavaScript (Frontend)** - Handles DOM manipulation, events, localStorage, and API calls.
- **JavaScript - (Backend on Raspberry Pi 4)** - Exposes APIs and controls GPIO pins.
- **Ubuntu** - Hosts the app and ensures remote access.

---

## Example Use Case
**Scenario:** Hallway lights turn on automatically if motion is detected after 10 PM.  
**Flow:**
1. Motion sensor connected to Raspberry Pi detects movement.
2. Raspberry Pi backend triggers automation script.
3. GPIO pin activates relay → hallway light turns on.
4. Dashboard updates device state via JavaScript DOM manipulation.

---

## Benefits
- Unified control in one dashboard.
- Custom automations tailored to user needs.
- Affordable and open-source.
- Scalable to more devices and sensors.
