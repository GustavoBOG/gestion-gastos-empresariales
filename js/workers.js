// Gestión de trabajadores
class WorkerManager {
    constructor() {
        this.allWorkers = StorageManager.getAllWorkers();
        this.selectedWorkers = StorageManager.getSelectedWorkers();
    }

    renderCheckboxes() {
        const container = document.getElementById(DOM_IDS.WORKER_CHECKBOXES);
        container.innerHTML = '';

        this.allWorkers.forEach(worker => {
            const isChecked = this.selectedWorkers.includes(worker);
            const div = document.createElement('label');
            div.className = 'flex items-center gap-2 p-3 bg-white rounded-md border border-slate-200 hover:border-slate-400 cursor-pointer transition';
            div.innerHTML = `
                <input type="checkbox" value="${worker}" ${isChecked ? 'checked' : ''} 
                       class="w-4 h-4 text-slate-800 rounded focus:ring-slate-500">
                <span class="text-sm font-medium text-slate-800">${worker}</span>
            `;
            div.querySelector('input').addEventListener('change', (e) => this.toggleWorker(worker, e.target.checked));
            container.appendChild(div);
        });
    }

    toggleWorker(worker, checked) {
        if (checked) {
            if (!this.selectedWorkers.includes(worker)) {
                this.selectedWorkers.push(worker);
            }
        } else {
            this.selectedWorkers = this.selectedWorkers.filter(w => w !== worker);
        }
        StorageManager.setSelectedWorkers(this.selectedWorkers);
    }

    addCustomWorker(name) {
        if (!name) {
            alert('Por favor, introduce un nombre');
            return false;
        }

        if (this.allWorkers.includes(name)) {
            alert('Este trabajador ya existe');
            return false;
        }

        this.allWorkers.push(name);
        this.selectedWorkers.push(name);
        StorageManager.setAllWorkers(this.allWorkers);
        StorageManager.setSelectedWorkers(this.selectedWorkers);

        return true;
    }

    getSelected() {
        return this.selectedWorkers;
    }

    hasSelected() {
        return this.selectedWorkers.length > 0;
    }
}
