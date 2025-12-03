// Gestión de tickets (CRUD)
class TicketManager {
    constructor() {
        this.tickets = StorageManager.getTickets();
    }

    add(ticketData) {
        const worker = document.getElementById(DOM_IDS.WORKER_SELECT).value;
        const date = document.getElementById(DOM_IDS.CURRENT_DATE).value;

        const ticket = {
            id: Date.now().toString(),
            ticketGroup: Date.now(),
            date,
            worker,
            restaurant: ticketData.restaurant || '-',
            concept: ticketData.concept,
            amount: parseFloat(ticketData.amount).toFixed(2)
        };

        this.tickets.push(ticket);
        this.save();
        return ticket;
    }

    addMultiple(ticketsArray) {
        this.tickets.push(...ticketsArray);
        this.save();
    }

    update(id, field, value) {
        const index = this.tickets.findIndex(t => String(t.id) === String(id));
        if (index !== -1) {
            if (field === 'amount') {
                this.tickets[index][field] = parseFloat(value).toFixed(2);
            } else {
                this.tickets[index][field] = value;
            }
            this.save();
            return true;
        }
        return false;
    }

    delete(id) {
        const beforeLength = this.tickets.length;
        this.tickets = this.tickets.filter(t => String(t.id) !== String(id));

        if (this.tickets.length < beforeLength) {
            this.save();
            return true;
        }
        return false;
    }

    deleteGroup(groupId) {
        const beforeLength = this.tickets.length;
        this.tickets = this.tickets.filter(t => t.ticketGroup != groupId);

        if (this.tickets.length < beforeLength) {
            this.save();
            return true;
        }
        return false;
    }

    clear() {
        this.tickets = [];
        this.save();
    }

    getAll() {
        return this.tickets;
    }

    getGrouped() {
        const grouped = {};
        this.tickets.forEach(t => {
            if (!grouped[t.ticketGroup]) {
                grouped[t.ticketGroup] = [];
            }
            grouped[t.ticketGroup].push(t);
        });
        return grouped;
    }

    save() {
        StorageManager.setTickets(this.tickets);
        this.render();
    }

    render() {
        const container = document.getElementById(DOM_IDS.TICKETS_CONTAINER);
        container.innerHTML = '';
        let total = 0;

        if (this.tickets.length === 0) {
            container.innerHTML = '<div class="p-12 text-center text-slate-400">No hay tickets registrados</div>';
        } else {
            const grouped = this.getGrouped();

            Object.values(grouped).reverse().forEach(group => {
                const ticketDiv = document.createElement('div');
                ticketDiv.className = 'p-4 hover:bg-slate-50 transition';

                let groupTotal = 0;
                let itemsHtml = '';

                group.forEach(item => {
                    groupTotal += parseFloat(item.amount);
                    total += parseFloat(item.amount);
                    itemsHtml += `
                        <div class="flex justify-between items-center py-2 border-b border-slate-100">
                            <div class="flex-1">
                                <input type="text" value="${item.concept}" 
                                       onchange="updateTicket('${item.id}', 'concept', this.value)"
                                       class="editable-field w-full px-2 py-1 rounded text-sm font-medium text-slate-800">
                            </div>
                            <div class="w-24 ml-4">
                                <input type="number" value="${item.amount}" step="0.01"
                                       onchange="updateTicket('${item.id}', 'amount', this.value)"
                                       class="editable-field w-full px-2 py-1 text-right rounded text-sm font-bold text-slate-800">
                            </div>
                            <button onclick="deleteTicket('${item.id}')" class="ml-3 text-red-500 hover:text-red-700 font-bold text-lg px-2">×</button>
                        </div>
                    `;
                });

                const firstItem = group[0];
                ticketDiv.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-slate-900">${firstItem.restaurant}</span>
                                <span class="text-xs text-slate-500">• ${firstItem.worker}</span>
                                <span class="text-xs text-slate-500">• ${this.formatDate(firstItem.date)}</span>
                            </div>
                        </div>
                        <button onclick="deleteTicketGroup(${firstItem.ticketGroup})" 
                                class="text-xs text-red-600 hover:text-red-800 font-semibold">
                            Borrar Ticket
                        </button>
                    </div>
                    <div class="space-y-1">
                        ${itemsHtml}
                    </div>
                    <div class="mt-3 pt-3 border-t border-slate-200 flex justify-end">
                        <span class="text-sm font-bold text-slate-900">Subtotal: ${groupTotal.toFixed(2)}€</span>
                    </div>
                `;

                container.appendChild(ticketDiv);
            });
        }

        document.getElementById(DOM_IDS.COUNT).textContent = this.tickets.length;
        document.getElementById(DOM_IDS.TOTAL_SUM).textContent = total.toFixed(2);
    }

    formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
}
