// Funciones de exportación (CSV y WhatsApp)
class Exporter {
    constructor(ticketManager) {
        this.ticketManager = ticketManager;
    }

    downloadCSV() {
        const tickets = this.ticketManager.getAll();

        if (tickets.length === 0) {
            alert('No hay tickets para exportar');
            return;
        }

        let csv = 'Fecha,Trabajador,Restaurante,Concepto,Importe\n';
        tickets.forEach(t => {
            const date = this.formatDate(t.date);
            csv += `${date},${t.worker},"${t.restaurant}","${t.concept}",${t.amount}€\n`;
        });

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const currentDate = document.getElementById(DOM_IDS.CURRENT_DATE).value;
        a.download = `gastos_${currentDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        showNotification('CSV descargado correctamente');
    }

    copyWhatsapp() {
        const tickets = this.ticketManager.getAll();

        if (tickets.length === 0) {
            alert('No hay tickets para copiar');
            return;
        }

        const grouped = {};
        let total = 0;

        tickets.forEach(t => {
            const key = `${t.worker}|${t.restaurant}`;
            if (!grouped[key]) {
                grouped[key] = { worker: t.worker, restaurant: t.restaurant, items: [] };
            }
            grouped[key].items.push(t);
            total += parseFloat(t.amount);
        });

        let msg = '*RESUMEN DE GASTOS*\n━━━━━━━━━━━━━━━━\n\n';

        for (const group of Object.values(grouped)) {
            let subtotal = 0;
            msg += `👤 *${group.worker}* - ${group.restaurant}\n`;
            group.items.forEach(item => {
                msg += `   • ${item.concept}: ${item.amount}€\n`;
                subtotal += parseFloat(item.amount);
            });
            msg += `   Subtotal: *${subtotal.toFixed(2)}€*\n\n`;
        }

        msg += '━━━━━━━━━━━━━━━━\n';
        msg += `*TOTAL: ${total.toFixed(2)}€*\n`;
        const currentDate = document.getElementById(DOM_IDS.CURRENT_DATE).value;
        msg += `📅 ${this.formatDate(currentDate)}`;

        navigator.clipboard.writeText(msg).then(() => {
            showNotification('Resumen copiado al portapapeles');
        }).catch(() => {
            prompt('Copia este texto:', msg);
        });
    }

    formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
}
