

const CameraMotion = (() => {
  // Config
  const SENSITIVITY   = 30;   
  const MOTION_THRESH = 0.02; 
  const COOLDOWN_MS   = 1500;  
  const SAMPLE_RATE   = 100;  

  // State 
  let video, canvas, ctx, prevData = null;
  let running = false, lastAlert = 0, stream = null;
  let motionLevel = 0; // 0-100 for the UI bar

  // Init
  function init() {
    video  = document.createElement('video');
    canvas = document.createElement('canvas');
    ctx    = canvas.getContext('2d');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.display = 'none';
    canvas.style.display = 'none';
    document.body.appendChild(video);
    document.body.appendChild(canvas);
  }

  // Start camera
  async function start() {
    if (running) return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { width:320, height:240 }, audio: false });
      video.srcObject = stream;
      await video.play();
      canvas.width  = 320;
      canvas.height = 240;
      running = true;
      updateUI('active');
      requestAnimationFrame(loop);
      showToast('Camera motion detection active', 'success');
    } catch(err) {
      updateUI('error');
      showToast('Camera access denied or not available', 'error');
      console.error('[CameraMotion]', err);
    }
  }

  // Stop camera 
  function stop() {
    running = false;
    prevData = null;
    if (stream) { stream.getTracks().forEach(t=>t.stop()); stream = null; }
    updateUI('idle');
    showToast('Camera motion detection stopped', 'warning');
  }

  // Frame comparison loop 
  let lastSample = 0;
  function loop(ts) {
    if (!running) return;
    requestAnimationFrame(loop);
    if (ts - lastSample < SAMPLE_RATE) return;
    lastSample = ts;

    if (video.readyState < 2) return;
    ctx.drawImage(video, 0, 0, 320, 240);
    const frame = ctx.getImageData(0, 0, 320, 240);

    if (prevData) {
      let diff = 0;
      const len = frame.data.length;
      for (let i=0; i<len; i+=4) {
        const dr = Math.abs(frame.data[i]   - prevData[i]);
        const dg = Math.abs(frame.data[i+1] - prevData[i+1]);
        const db = Math.abs(frame.data[i+2] - prevData[i+2]);
        if ((dr+dg+db)/3 > SENSITIVITY) diff++;
      }
      const totalPx = (len/4);
      motionLevel = Math.min(100, Math.round(diff/totalPx*100*20));
      updateBar(motionLevel);

      const motionDetected = diff / totalPx > MOTION_THRESH;
      const now = Date.now();

      if (motionDetected && now - lastAlert > COOLDOWN_MS) {
        lastAlert = now;
        // Emit to server — same channel as hallway sensor
        if (typeof socket !== 'undefined') {
          socket.emit('motion-report', { source:'camera', motion: true });
        }
        flashAlert();
        showToast('Motion detected via camera!', 'motion', 2000);
      }
    }

    prevData = new Uint8ClampedArray(frame.data);
  }

  // UI helpers
  function updateUI(state) {
    const btn       = document.getElementById('cam-toggle-btn');
    const statusDot = document.getElementById('cam-status-dot');
    const statusTxt = document.getElementById('cam-status-txt');
    if (!btn) return;
    if (state === 'active') {
      btn.textContent = 'Stop Camera';
      btn.style.background = 'rgba(239,68,68,.15)';
      btn.style.borderColor = 'rgba(239,68,68,.4)';
      btn.style.color = '#f87171';
      if (statusDot) { statusDot.style.background = '#4ade80'; statusDot.style.boxShadow = '0 0 6px #4ade80'; }
      if (statusTxt) statusTxt.textContent = 'Detecting motion…';
    } else if (state === 'error') {
      btn.textContent = 'Retry Camera';
      btn.style.background = 'rgba(251,146,60,.15)';
      btn.style.borderColor = 'rgba(251,146,60,.4)';
      btn.style.color = '#fb923c';
      if (statusDot) { statusDot.style.background = '#fb923c'; statusDot.style.boxShadow = 'none'; }
      if (statusTxt) statusTxt.textContent = 'Camera error';
    } else {
      btn.textContent = 'Start Camera';
      btn.style.background = 'rgba(139,92,246,.15)';
      btn.style.borderColor = 'rgba(139,92,246,.4)';
      btn.style.color = '#a78bfa';
      if (statusDot) { statusDot.style.background = '#374151'; statusDot.style.boxShadow = 'none'; }
      if (statusTxt) statusTxt.textContent = 'Camera off';
    }
  }

  function updateBar(level) {
    const bar  = document.getElementById('motion-level-bar');
    const pct  = document.getElementById('motion-level-pct');
    if (bar) {
      bar.style.width = level + '%';
      bar.style.background = level > 60 ? '#f87171' : level > 25 ? '#fb923c' : '#4ade80';
    }
    if (pct) pct.textContent = level + '%';
  }

  function flashAlert() {
    const indicator = document.getElementById('cam-motion-indicator');
    if (!indicator) return;
    indicator.style.opacity = '1';
    indicator.style.background = 'rgba(239,68,68,.25)';
    setTimeout(() => {
      indicator.style.opacity = '0';
      indicator.style.background = 'transparent';
    }, 800);
  }

  // Sensitivity control
  function setSensitivity(val) {
    const map = { low: 0.05, medium: 0.02, high: 0.008 };
    CameraMotion._thresh = map[val] || 0.02;
    const lbl = document.getElementById('sensitivity-label');
    if (lbl) lbl.textContent = val.charAt(0).toUpperCase()+val.slice(1);
  }

  function toggle() {
    if (running) stop(); else start();
  }

  return { start, stop, toggle, setSensitivity, _thresh: MOTION_THRESH };
})();

// Expose globally
window.CameraMotion = CameraMotion;