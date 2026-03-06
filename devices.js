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