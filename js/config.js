// Configuración y constantes globales
const DEFAULT_WORKERS = [
    'Juan', 'Roberto', 'Adolfo', 'María', 'Carlos', 'Ana', 'Pedro', 'Luis',
    'Carmen', 'José', 'Laura', 'Miguel', 'Isabel', 'Antonio', 'Sofía', 'Francisco',
    'Elena', 'Manuel', 'Patricia', 'Javier', 'Raquel', 'Diego', 'Cristina', 'Alberto'
];

const NUMBER_WORDS = {
    'cero': '0', 'uno': '1', 'una': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5',
    'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9', 'diez': '10',
    'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14', 'quince': '15',
    'dieciséis': '16', 'dieciseis': '16', 'diecisiete': '17', 'dieciocho': '18', 'diecinueve': '19',
    'veinte': '20', 'veintiuno': '21', 'veintiuna': '21', 'veintidós': '22', 'veintidos': '22',
    'veintitrés': '23', 'veintitres': '23', 'veinticuatro': '24', 'veinticinco': '25',
    'veintiséis': '26', 'veintiseis': '26', 'veintisiete': '27', 'veintiocho': '28', 'veintinueve': '29',
    'treinta': '30', 'cuarenta': '40', 'cincuenta': '50', 'sesenta': '60',
    'setenta': '70', 'ochenta': '80', 'noventa': '90', 'cien': '100', 'ciento': '100'
};

const STORAGE_KEYS = {
    ALL_WORKERS: 'allWorkers',
    SELECTED_WORKERS: 'selectedWorkers',
    TICKETS: 'tickets_gastos'
};

const DOM_IDS = {
    SETUP_SCREEN: 'setupScreen',
    MAIN_SCREEN: 'mainScreen',
    SETUP_DATE: 'setupDate',
    CURRENT_DATE: 'currentDate',
    WORKER_SELECT: 'worker',
    WORKER_CHECKBOXES: 'workerCheckboxes',
    CUSTOM_WORKER_INPUT: 'customWorkerInput',
    MIC_BTN: 'micBtnFull',
    MIC_ICON: 'micIcon',
    MIC_TEXT: 'micText',
    RECORDING_STATUS: 'recordingStatus',
    RESTAURANT: 'restaurant',
    CONCEPT: 'concept',
    AMOUNT: 'amount',
    TICKETS_CONTAINER: 'ticketsContainer',
    COUNT: 'count',
    TOTAL_SUM: 'totalSum'
};
