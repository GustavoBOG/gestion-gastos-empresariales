import React from 'react';
import { Trash2 } from 'lucide-react';

export const TicketList = ({ tickets, onUpdateTicket, onDeleteTicket, onDeleteGroup, onClearAll }) => {

    // Agrupar tickets por ticketGroup
    const groupedTickets = tickets.reduce((acc, ticket) => {
        const group = ticket.ticketGroup || 'manual';
        if (!acc[group]) acc[group] = [];
        acc[group].push(ticket);
        return acc;
    }, {});

    // Ordenar grupos (asumiendo ticketGroup es timestamp, los más recientes primero)
    // Si es manual, usar el timestamp del primer elemento
    const sortedGroups = Object.values(groupedTickets).sort((a, b) => {
        const timeA = a[0].ticketGroup || a[0].id; // Fallback
        const timeB = b[0].ticketGroup || b[0].id;
        return timeB - timeA;
    });

    const totalSum = tickets.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Tickets Registrados (<span id="count">{tickets.length}</span>)
                </h2>
                {tickets.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="text-sm text-red-600 hover:text-red-800 font-semibold"
                    >
                        Borrar Todo
                    </button>
                )}
            </div>

            <div className="max-h-[600px] overflow-y-auto">
                {tickets.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No hay tickets registrados</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {sortedGroups.map((group, groupIdx) => {
                            const firstItem = group[0];
                            const groupTotal = group.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

                            return (
                                <div key={groupIdx} className="p-4 hover:bg-slate-50 transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-slate-900">{firstItem.restaurant || '-'}</span>
                                                <span className="text-xs text-slate-500">• {firstItem.worker}</span>
                                                <span className="text-xs text-slate-500">• {formatDate(firstItem.date)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onDeleteGroup(firstItem.ticketGroup)}
                                            className="text-xs text-red-600 hover:text-red-800 font-semibold"
                                        >
                                            Borrar Ticket
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        {group.map(item => (
                                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={item.concept}
                                                        onChange={(e) => onUpdateTicket(item.id, { concept: e.target.value })}
                                                        className="w-full px-2 py-1 rounded text-sm font-medium text-slate-800 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-slate-300 transition"
                                                    />
                                                </div>
                                                <div className="w-24 ml-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.amount}
                                                        onChange={(e) => onUpdateTicket(item.id, { amount: e.target.value })}
                                                        className="w-full px-2 py-1 text-right rounded text-sm font-bold text-slate-800 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-slate-300 transition"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => onDeleteTicket(item.id)}
                                                    className="ml-3 text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end">
                                        <span className="text-sm font-bold text-slate-900">Subtotal: {groupTotal.toFixed(2)}€</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">Total Acumulado:</span>
                    <span className="text-2xl font-bold text-slate-900">{totalSum.toFixed(2)}€</span>
                </div>
            </div>
        </div>
    );
};
