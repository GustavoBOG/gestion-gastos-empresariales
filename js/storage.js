// Gestión de localStorage
class StorageManager {
    static get(key, defaultValue = null) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getAllWorkers() {
        return this.get(STORAGE_KEYS.ALL_WORKERS, [...DEFAULT_WORKERS]);
    }

    static setAllWorkers(workers) {
        this.set(STORAGE_KEYS.ALL_WORKERS, workers);
    }

    static getSelectedWorkers() {
        return this.get(STORAGE_KEYS.SELECTED_WORKERS, []);
    }

    static setSelectedWorkers(workers) {
        this.set(STORAGE_KEYS.SELECTED_WORKERS, workers);
    }

    static getTickets() {
        return this.get(STORAGE_KEYS.TICKETS, []);
    }

    static setTickets(tickets) {
        this.set(STORAGE_KEYS.TICKETS, tickets);
    }
}
