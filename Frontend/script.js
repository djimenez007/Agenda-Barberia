const state = {
  currentStep: 1,
  currentUser: JSON.parse(localStorage.getItem('barber_current_user')) || null,
  services: [
    { id: 's1', name: 'Corte Tradicional', duration: '30 min', price: 25, icon: '✂', desc: 'Lavado, corte y peinado con pomada.' },
    { id: 's2', name: 'Perfilado de Barba', duration: '30 min', price: 20, icon: '🪒', desc: 'Delineado a navaja con toalla caliente.' },
    { id: 's3', name: 'Combo Imperial', duration: '60 min', price: 40, icon: '👑', desc: 'Corte completo y ritual de barba.' }
  ],
  barbers: [
    { id: 'b1', name: 'Marco "Blade" Silva', role: 'Maestro Barbero', avatar: 'MS' },
    { id: 'b2', name: 'Gabriel Rossi', role: 'Estilista Senior', avatar: 'GR' },
    { id: 'b3', name: 'Daniel Ramos', role: 'Especialista en Barba', avatar: 'DR' }
  ],
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  userData: { name: '', phone: '', email: '' },
  currentCalendarDate: new Date()
};

document.addEventListener('DOMContentLoaded', () => {
  renderLandingData();
  setupCalendar();
  setupEventListeners();
  updateAuthStatusUI();
});

function renderLandingData() {
  const servicesGrid = document.getElementById('landing-services-grid');
  if (servicesGrid) {
    servicesGrid.innerHTML = state.services.map(s => `
      <div class="service-card">
        <div style="font-size:2rem; margin-bottom:0.5rem;">${s.icon}</div>
        <h3>${s.name}</h3>
        <p style="color:var(--text-muted); font-size:0.85rem;">${s.desc}</p>
        <div style="margin-top:1rem; font-weight:700; color:var(--accent);">$${s.price}</div>
      </div>
    `).join('');
  }

  const barbersGrid = document.getElementById('landing-barbers-grid');
  if (barbersGrid) {
    barbersGrid.innerHTML = state.barbers.map(b => `
      <div class="barber-card" style="text-align:center;">
        <div class="barber-avatar">${b.avatar}</div>
        <h3>${b.name}</h3>
        <small style="color:var(--accent);">${b.role}</small>
      </div>
    `).join('');
  }
}

function updateAuthStatusUI() {
  const authBtns = document.getElementById('auth-buttons');
  const userBadge = document.getElementById('user-profile-badge');

  if (state.currentUser) {
    authBtns.classList.add('hidden');
    userBadge.classList.remove('hidden');
    document.getElementById('user-display-name').textContent = `Hola, ${state.currentUser.name.split(' ')[0]}`;
  } else {
    authBtns.classList.remove('hidden');
    userBadge.classList.add('hidden');
  }
}

function setupCalendar() {
  renderCalendar();
  document.getElementById('cal-prev').onclick = () => { state.currentCalendarDate.setMonth(state.currentCalendarDate.getMonth() - 1); renderCalendar(); };
  document.getElementById('cal-next').onclick = () => { state.currentCalendarDate.setMonth(state.currentCalendarDate.getMonth() + 1); renderCalendar(); };
}

function renderCalendar() {
  const year = state.currentCalendarDate.getFullYear();
  const month = state.currentCalendarDate.getMonth();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  document.getElementById('cal-month-year').textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const container = document.getElementById('calendar-days');
  container.innerHTML = '';

  for (let i = 0; i < firstDay; i++) container.innerHTML += `<div></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const isPast = dateObj < today;
    const isSelected = state.selectedDate && dateObj.toDateString() === state.selectedDate.toDateString();

    const btn = document.createElement('button');
    btn.className = `day-btn ${isSelected ? 'selected' : ''}`;
    btn.textContent = day;
    btn.disabled = isPast;
    btn.onclick = () => {
      state.selectedDate = dateObj;
      state.selectedTime = null;
      renderCalendar();
      renderTimeSlots();
      validateStep();
    };
    container.appendChild(btn);
  }
}

function renderTimeSlots() {
  const container = document.getElementById('slots-grid');
  if (!state.selectedDate) return;

  document.getElementById('selected-date-label').textContent = `Horarios para ${state.selectedDate.toLocaleDateString('es-ES')}`;
  const slots = ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  container.innerHTML = slots.map(time => `
    <button class="slot-btn ${state.selectedTime === time ? 'selected' : ''}">${time}</button>
  `).join('');

  container.querySelectorAll('.slot-btn').forEach(btn => {
    btn.onclick = () => {
      state.selectedTime = btn.textContent;
      renderTimeSlots();
      validateStep();
    };
  });
}

function updateWizardUI() {
  document.querySelectorAll('.step-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(`step-pane-${state.currentStep}`).classList.add('active');

  document.querySelectorAll('.stepper .step').forEach(s => {
    const num = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed');
    if (num === state.currentStep) s.classList.add('active');
    else if (num < state.currentStep) s.classList.add('completed');
  });

  document.getElementById('wizard-footer').style.display = state.currentStep === 5 ? 'none' : 'flex';
  document.getElementById('btn-prev-step').disabled = state.currentStep === 1;
  validateStep();
}

function validateStep() {
  let valid = false;
  if (state.currentStep === 1) valid = !!state.selectedService;
  else if (state.currentStep === 2) valid = !!state.selectedBarber;
  else if (state.currentStep === 3) valid = !!state.selectedDate && !!state.selectedTime;
  else if (state.currentStep === 4) {
    const name = document.getElementById('user-name').value.trim();
    const phone = document.getElementById('user-phone').value.trim();
    valid = name.length > 2 && phone.length > 6;
  }
  document.getElementById('btn-next-step').disabled = !valid;
}

function renderSummaryAndSave() {
  state.userData = {
    name: document.getElementById('user-name').value,
    phone: document.getElementById('user-phone').value,
    email: document.getElementById('user-email').value
  };

  const app = {
    id: Date.now(),
    service: state.selectedService.name,
    price: state.selectedService.price,
    barberId: state.selectedBarber.id,
    barber: state.selectedBarber.name,
    date: state.selectedDate.toLocaleDateString('es-ES'),
    isoDate: state.selectedDate.toISOString().split('T')[0],
    time: state.selectedTime,
    user: state.userData,
    status: 'Confirmada'
  };

  document.getElementById('summary-card').innerHTML = `
    <div class="summary-row"><span>Servicio:</span><strong>${app.service} ($${app.price})</strong></div>
    <div class="summary-row"><span>Barbero:</span><strong>${app.barber}</strong></div>
    <div class="summary-row"><span>Fecha:</span><strong>${app.date} - ${app.time}</strong></div>
    <div class="summary-row"><span>Cliente:</span><strong>${app.user.name}</strong></div>
  `;

  const current = JSON.parse(localStorage.getItem('barber_appointments') || '[]');
  current.push(app);
  localStorage.setItem('barber_appointments', JSON.stringify(current));
}

function setupEventListeners() {
  const navLinks = document.getElementById('nav-links');
  
  // Toggle Menú Móvil
  document.getElementById('btn-menu').onclick = () => {
    navLinks.classList.toggle('active');
  };

  // Cerrar menú al hacer click en opción
  document.querySelectorAll('.nav-item').forEach(item => {
    item.onclick = () => navLinks.classList.remove('active');
  });

  document.getElementById('btn-hero-booking').onclick = () => {
    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('booking-view').classList.add('active');
    state.currentStep = 1;
    
    if (state.currentUser) {
      document.getElementById('user-name').value = state.currentUser.name;
      document.getElementById('user-phone').value = state.currentUser.phone;
      document.getElementById('user-email').value = state.currentUser.email;
    }

    renderBookingServices();
    renderBookingBarbers();
    updateWizardUI();
  };

  document.getElementById('btn-cancel-booking').onclick = () => {
    document.getElementById('booking-view').classList.remove('active');
    document.getElementById('landing-view').style.display = 'block';
  };

  document.getElementById('btn-next-step').onclick = () => {
    if (state.currentStep < 5) {
      state.currentStep++;
      if (state.currentStep === 5) renderSummaryAndSave();
      updateWizardUI();
    }
  };

  document.getElementById('btn-prev-step').onclick = () => {
    if (state.currentStep > 1) { state.currentStep--; updateWizardUI(); }
  };

  const authModal = document.getElementById('auth-modal');
  document.getElementById('btn-open-login').onclick = () => {
    navLinks.classList.remove('active');
    authModal.classList.add('active');
  };
  document.getElementById('btn-close-auth').onclick = () => authModal.classList.remove('active');

  document.getElementById('link-to-register').onclick = (e) => {
    e.preventDefault();
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('form-register').classList.remove('hidden');
    document.getElementById('auth-modal-title').textContent = 'Crear Cuenta';
  };

  document.getElementById('link-to-login').onclick = (e) => {
    e.preventDefault();
    document.getElementById('form-register').classList.add('hidden');
    document.getElementById('form-login').classList.remove('hidden');
    document.getElementById('auth-modal-title').textContent = 'Iniciar Sesión';
  };

  document.getElementById('form-register').onsubmit = (e) => {
    e.preventDefault();
    const user = {
      name: document.getElementById('reg-name').value,
      phone: document.getElementById('reg-phone').value,
      email: document.getElementById('reg-email').value
    };
    state.currentUser = user;
    localStorage.setItem('barber_current_user', JSON.stringify(user));
    updateAuthStatusUI();
    authModal.classList.remove('active');
  };

  document.getElementById('form-login').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const user = { name: email.split('@')[0], email: email, phone: '+506 8888-8888' };
    state.currentUser = user;
    localStorage.setItem('barber_current_user', JSON.stringify(user));
    updateAuthStatusUI();
    authModal.classList.remove('active');
  };

  document.getElementById('btn-logout').onclick = () => {
    state.currentUser = null;
    localStorage.removeItem('barber_current_user');
    updateAuthStatusUI();
  };

  const appModal = document.getElementById('appointments-modal');
  document.getElementById('btn-open-my-appointments').onclick = () => {
    navLinks.classList.remove('active');
    appModal.classList.add('active');
    renderMyAppointments();
  };
  document.getElementById('btn-close-appointments').onclick = () => appModal.classList.remove('active');
  
  document.getElementById('btn-finish-booking').onclick = () => {
    document.getElementById('booking-view').classList.remove('active');
    document.getElementById('landing-view').style.display = 'block';
  };

  document.getElementById('user-name').oninput = validateStep;
  document.getElementById('user-phone').oninput = validateStep;
}

function renderBookingServices() {
  const container = document.getElementById('booking-services-grid');
  container.innerHTML = state.services.map(s => `
    <div class="selectable-card ${state.selectedService?.id === s.id ? 'selected' : ''}" data-id="${s.id}">
      <div style="font-weight:700;">${s.name}</div>
      <div style="color:var(--accent); font-weight:700;">$${s.price}</div>
    </div>
  `).join('');
  container.querySelectorAll('.selectable-card').forEach(c => {
    c.onclick = () => {
      state.selectedService = state.services.find(s => s.id === c.dataset.id);
      renderBookingServices();
      validateStep();
    };
  });
}

function renderBookingBarbers() {
  const container = document.getElementById('booking-barbers-grid');
  container.innerHTML = state.barbers.map(b => `
    <div class="selectable-card ${state.selectedBarber?.id === b.id ? 'selected' : ''}" data-id="${b.id}" style="text-align:center;">
      <div class="barber-avatar" style="width:45px; height:45px; font-size:1rem;">${b.avatar}</div>
      <div style="font-weight:700;">${b.name}</div>
    </div>
  `).join('');
  container.querySelectorAll('.selectable-card').forEach(c => {
    c.onclick = () => {
      state.selectedBarber = state.barbers.find(b => b.id === c.dataset.id);
      renderBookingBarbers();
      validateStep();
    };
  });
}

function renderMyAppointments() {
  const container = document.getElementById('modal-appointments-list');
  const all = JSON.parse(localStorage.getItem('barber_appointments') || '[]');
  
  const myApps = state.currentUser 
    ? all.filter(a => a.user.email === state.currentUser.email)
    : all;

  if (myApps.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No hay citas registradas.</p>';
    return;
  }

  container.innerHTML = myApps.map(a => `
    <div style="background:var(--bg-dark); border:1px solid var(--border-color); padding:0.75rem; border-radius:0.5rem; margin-bottom:0.5rem;">
      <strong>${a.service}</strong><br>
      <small>Barbero: ${a.barber}</small><br>
      <small style="color:var(--accent);">📅 ${a.date} - ${a.time}</small> - 
      <strong style="font-size:0.8rem;">${a.status}</strong>
    </div>
  `).join('');
}