// Inicialización y coordinación de la aplicación
let workerManager;
let ticketManager;
let voiceRecognition;
let exporter;
let currentDate;

function initializeApp() {
    currentDate = new Date().toISOString().split('T')[0];

    workerManager = new WorkerManager();
    ticketManager = new TicketManager();
    voiceRecognition = new VoiceRecognition();
    exporter = new Exporter(ticketManager);

    window.ticketManager = ticketManager;

    if (workerManager.hasSelected()) {
        document.getElementById(DOM_IDS.SETUP_DATE).value = currentDate;
        workerManager.renderCheckboxes();
        startApp();
    } else {
        document.getElementById(DOM_IDS.SETUP_DATE).value = currentDate;
        workerManager.renderCheckboxes();
    }
}

function addCustomWorker() {
    const input = document.getElementById(DOM_IDS.CUSTOM_WORKER_INPUT);
    const name = input.value.trim();

    if (workerManager.addCustomWorker(name)) {
        input.value = '';
        workerManager.renderCheckboxes();
        showNotification(`${name} agregado correctamente`);
    }
}

function startApp() {
    if (!workerManager.hasSelected()) {
        alert('Selecciona al menos un trabajador');
        return;
    }

    currentDate = document.getElementById(DOM_IDS.SETUP_DATE).value;

    document.getElementById(DOM_IDS.SETUP_SCREEN).classList.add('hidden');
    document.getElementById(DOM_IDS.MAIN_SCREEN).classList.remove('hidden');

    const workerSelect = document.getElementById(DOM_IDS.WORKER_SELECT);
    workerSelect.innerHTML = '';
    workerManager.getSelected().forEach(worker => {
        workerSelect.innerHTML += `<option value="${worker}">${worker}</option>`;
    });

    document.getElementById(DOM_IDS.CURRENT_DATE).value = currentDate;
    ticketManager.render();
}

function backToSetup() {
    document.getElementById(DOM_IDS.SETUP_SCREEN).classList.remove('hidden');
    document.getElementById(DOM_IDS.MAIN_SCREEN).classList.add('hidden');
}

function toggleRecording() {
    voiceRecognition.toggle();
}

function addManualTicket() {
    const restaurant = document.getElementById(DOM_IDS.RESTAURANT).value.trim();
    const concept = document.getElementById(DOM_IDS.CONCEPT).value.trim();
    const amount = document.getElementById(DOM_IDS.AMOUNT).value;

    if (!concept || !amount || parseFloat(amount) <= 0) {
        alert('Introduce concepto y precio válidos');
        return;
    }

    ticketManager.add({ restaurant, concept, amount });

    document.getElementById(DOM_IDS.RESTAURANT).value = '';
    document.getElementById(DOM_IDS.CONCEPT).value = '';
    document.getElementById(DOM_IDS.AMOUNT).value = '';
    document.getElementById(DOM_IDS.CONCEPT).focus();

    showNotification('Ticket añadido correctamente');
}

function updateTicket(id, field, value) {
    if (ticketManager.update(id, field, value)) {
        setTimeout(() => ticketManager.render(), 50);
    }
}

function deleteTicket(id) {
    if (ticketManager.delete(id)) {
        showNotification('Item eliminado');
    }
}

function deleteTicketGroup(groupId) {
    if (confirm('¿Eliminar este ticket completo?')) {
        if (ticketManager.deleteGroup(groupId)) {
            showNotification('Ticket eliminado');
        }
    }
}

function clearAllTickets() {
    if (confirm('¿Borrar TODOS los tickets?\n\nEsta acción no se puede deshacer.')) {
        ticketManager.clear();
        showNotification('Todos los tickets eliminados');
    }
}

function downloadCSV() {
    exporter.downloadCSV();
}

function copyWhatsapp() {
    exporter.copyWhatsapp();
}

function showNotification(message, type = 'success') {
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-slate-900';
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `fixed top-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl z-50 text-sm font-medium`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

document.addEventListener('DOMContentLoaded', initializeApp);

document.addEventListener('keypress', (e) => {
    if (e.target.id === DOM_IDS.CONCEPT && e.key === 'Enter') {
        document.getElementById(DOM_IDS.AMOUNT).focus();
    }
    if (e.target.id === DOM_IDS.AMOUNT && e.key === 'Enter') {
        addManualTicket();
    }
});
