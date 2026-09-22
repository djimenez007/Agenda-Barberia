// CONFIGURACIÓN DE EMPLEADOS Y DATOS (PIN por defecto: 1234)
const EMPLOYEES_DATA = [
  { id: 'b1', name: 'Marco "Blade" Silva', role: 'Maestro Barbero', pin: '1234' },
  { id: 'b2', name: 'Gabriel Rossi', role: 'Estilista Senior', pin: '1234' },
  { id: 'b3', name: 'Daniel Ramos', role: 'Especialista en Barba', pin: '1234' }
];

let activeEmployee = null;

// ELEMENTOS DOM
document.addEventListener('DOMContentLoaded', () => {
  initLoginOptions();
  setupInitialDateFilter();
  setupEventListeners();
  checkSession();
});

// 1. Cargar la lista de barberos en el select del Login
function initLoginOptions() {
  const selectLogin = document.getElementById('emp-barber-select');
  selectLogin.innerHTML = '<option value="" disabled selected>Selecciona tu usuario...</option>';
  
  EMPLOYEES_DATA.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = `${emp.name} (${emp.role})`;
    selectLogin.appendChild(opt);
  });
}

// 2. Establecer la fecha actual de Costa Rica en el filtro por defecto
function setupInitialDateFilter() {
  const dateInput = document.getElementById('filter-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
}

// 3. Verificar si hay sesión activa guardada
function checkSession() {
  const savedSession = sessionStorage.getItem('vtb_employee_session');
  if (savedSession) {
    activeEmployee = JSON.parse(savedSession);
    showDashboard();
  } else {
    showLogin();
  }
}

// 4. Mostrar Login o Dashboard
function showLogin() {
  document.getElementById('login-overlay').classList.remove('hidden');
}

function showDashboard() {
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('active-barber-name').textContent = activeEmployee.name;
  document.getElementById('active-barber-role').textContent = activeEmployee.role;
  
  // Cargar citas filtradas exclusivamente por el barbero logueado
  loadAppointments();
}

// 5. Cargar y Filtrar Citas (ESTRICTAMENTE SOLO LAS DEL BARBERO LOGUEADO)
function loadAppointments() {
  if (!activeEmployee) return;

  const allAppointments = JSON.parse(localStorage.getItem('barber_appointments') || '[]');
  
  const filterDate = document.getElementById('filter-date').value;
  const filterStatus = document.getElementById('filter-status').value;

  // Filtrado Estricto por Barbero + Fecha + Estado
  const filtered = allAppointments.filter(app => {
    // 1. OBLIGATORIO: La cita debe ser de este barbero (coincidencia de ID o de Nombre)
    const isMyAppointment = app.barberId === activeEmployee.id || app.barber === activeEmployee.name;
    
    // 2. Filtro por Fecha
    const matchDate = !filterDate || app.isoDate === filterDate;

    // 3. Filtro por Estado
    const matchStatus = filterStatus === 'ALL' || app.status === filterStatus;

    return isMyAppointment && matchDate && matchStatus;
  });

  renderTable(filtered);
  updateMetrics(filtered);
}

// 6. Renderizar Tabla HTML
function renderTable(appointments) {
  const tbody = document.getElementById('appointments-tbody');
  const emptyState = document.getElementById('empty-state');
  tbody.innerHTML = '';

  if (appointments.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  appointments.forEach(app => {
    const tr = document.createElement('tr');
    const statusClass = app.status ? app.status.toLowerCase() : 'confirmada';

    tr.innerHTML = `
      <td><strong>${app.time || 'N/A'}</strong></td>
      <td>
        <div style="font-weight: 600;">${app.user.name}</div>
      </td>
      <td>
        <div>${app.user.phone}</div>
        <small style="color:var(--text-muted);">${app.user.email || 'Sin correo'}</small>
      </td>
      <td>
        <div>${app.service}</div>
        <small style="color:var(--accent); font-weight:700;">$${app.price || 0}</small>
      </td>
      <td>
        <span class="badge-status ${statusClass}">${app.status || 'Confirmada'}</span>
      </td>
      <td class="actions-cell">
        ${app.status !== 'Completada' ? `
          <button class="btn btn-success btn-sm" onclick="changeStatus(${app.id}, 'Completada')">✓ Completar</button>
        ` : ''}
        ${app.status !== 'Cancelada' ? `
          <button class="btn btn-danger btn-sm" onclick="changeStatus(${app.id}, 'Cancelada')">✕ Cancelar</button>
        ` : ''}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// 7. Actualizar Métricas Solo del Barbero Activo
function updateMetrics(myAppointments) {
  const total = myAppointments.length;
  const confirmadas = myAppointments.filter(a => a.status === 'Confirmada' || !a.status).length;
  const completadas = myAppointments.filter(a => a.status === 'Completada').length;
  
  const ingresoTotal = myAppointments
    .filter(a => a.status !== 'Cancelada')
    .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  document.getElementById('stat-total-citas').textContent = total;
  document.getElementById('stat-confirmadas').textContent = confirmadas;
  document.getElementById('stat-completadas').textContent = completadas;
  document.getElementById('stat-ingreso').textContent = `$${ingresoTotal}`;
}

// 8. Cambiar Estado de una Cita
window.changeStatus = function(appointmentId, newStatus) {
  let appointments = JSON.parse(localStorage.getItem('barber_appointments') || '[]');
  
  appointments = appointments.map(app => {
    if (app.id === appointmentId) {
      return { ...app, status: newStatus };
    }
    return app;
  });

  localStorage.setItem('barber_appointments', JSON.stringify(appointments));
  loadAppointments();
};

// 9. Configuración de Eventos (Listeners)
function setupEventListeners() {
  // Submit Formulario de Login
  document.getElementById('form-employee-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const barberId = document.getElementById('emp-barber-select').value;
    const pinEntered = document.getElementById('emp-pin').value;
    const errorBox = document.getElementById('login-error');

    const emp = EMPLOYEES_DATA.find(e => e.id === barberId);

    if (emp && emp.pin === pinEntered) {
      activeEmployee = emp;
      sessionStorage.setItem('vtb_employee_session', JSON.stringify(emp));
      errorBox.classList.add('hidden');
      document.getElementById('emp-pin').value = '';
      showDashboard();
    } else {
      errorBox.classList.remove('hidden');
    }
  });

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    activeEmployee = null;
    sessionStorage.removeItem('vtb_employee_session');
    showLogin();
  });

  // Filtros
  document.getElementById('filter-date').addEventListener('change', loadAppointments);
  document.getElementById('filter-status').addEventListener('change', loadAppointments);

  // Botón Actualizar
  document.getElementById('btn-refresh').addEventListener('click', loadAppointments);
}