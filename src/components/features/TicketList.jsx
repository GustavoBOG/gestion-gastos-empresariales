import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const TicketList = ({ tickets, onUpdateTicket, onUpdateGroup, onDeleteTicket, onDeleteGroup, onAddTicketToGroup, onClearAll }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [newItem, setNewItem] = useState({ concept: '', amount: '' });

    // Agrupar tickets por ticketGroup
    const groupedTickets = tickets.reduce((acc, ticket) => {
        const group = ticket.ticketGroup || 'manual';
        if (!acc[group]) acc[group] = [];
        acc[group].push(ticket);
        return acc;
    }, {});

    // Ordenar grupos (asumiendo ticketGroup es timestamp, los más recientes primero)
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

    const openAddModal = (groupId) => {
        setSelectedGroupId(groupId);
        setNewItem({ concept: '', amount: '' });
        setShowAddModal(true);
    };

    const handleAddItem = () => {
        if (selectedGroupId && newItem.concept && newItem.amount) {
            onAddTicketToGroup(selectedGroupId, newItem);
            setShowAddModal(false);
        }
    };

    const confirmDeleteGroup = (groupId) => {
        setSelectedGroupId(groupId);
        setShowDeleteGroupModal(true);
    };

    const handleDeleteGroupConfirmed = () => {
        if (selectedGroupId) {
            onDeleteGroup(selectedGroupId);
            setShowDeleteGroupModal(false);
            setSelectedGroupId(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Tickets Registrados (<span id="count">{sortedGroups.length}</span>)
                </h2>
                {tickets.length > 0 && (
                    <button
                        onClick={() => setShowDeleteAllModal(true)}
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
                            const groupId = firstItem.ticketGroup || 'manual';

                            return (
                                <div key={groupIdx} className="p-4 hover:bg-slate-50 transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap flex-1">
                                                <input
                                                    type="text"
                                                    value={firstItem.restaurant || ''}
                                                    onChange={(e) => onUpdateGroup(groupId, { restaurant: e.target.value })}
                                                    className="text-sm font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-slate-300 rounded px-1 py-0.5 transition border-none p-0 w-full sm:w-auto"
                                                    placeholder="Nombre del Restaurante"
                                                />
                                                <span className="text-xs text-slate-500">• {firstItem.worker}</span>
                                                <span className="text-xs text-slate-500">• {formatDate(firstItem.date)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openAddModal(groupId)}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                                            >
                                                <Plus size={14} /> Añadir Item
                                            </button>
                                            <button
                                                onClick={() => confirmDeleteGroup(groupId)}
                                                className="text-xs text-red-600 hover:text-red-800 font-semibold ml-2"
                                            >
                                                Borrar Ticket
                                            </button>
                                        </div>
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

            {/* Modal Añadir Item */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Añadir Item al Ticket"
            >
                <div className="space-y-4">
                    <Input
                        label="Concepto"
                        value={newItem.concept}
                        onChange={(e) => setNewItem({ ...newItem, concept: e.target.value })}
                        placeholder="Ej: Café"
                    />
                    <Input
                        label="Importe (€)"
                        type="number"
                        step="0.01"
                        value={newItem.amount}
                        onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                        placeholder="0.00"
                    />
                    <div className="flex gap-3 pt-2">
                        <Button onClick={() => setShowAddModal(false)} variant="secondary" fullWidth>Cancelar</Button>
                        <Button onClick={handleAddItem} disabled={!newItem.concept || !newItem.amount} fullWidth>Añadir</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal Confirmar Borrar Ticket (Grupo) */}
            <Modal
                isOpen={showDeleteGroupModal}
                onClose={() => setShowDeleteGroupModal(false)}
                title="¿Borrar Ticket?"
            >
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trash2 className="text-red-600" size={24} />
                    </div>
                    <p className="text-slate-700 mb-4">
                        ¿Estás seguro de que quieres eliminar este ticket completo?
                        <br />
                        Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-3">
                        <Button onClick={() => setShowDeleteGroupModal(false)} variant="secondary" fullWidth>Cancelar</Button>
                        <Button onClick={handleDeleteGroupConfirmed} variant="danger" fullWidth>Eliminar</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal Confirmar Borrar Todo */}
            <Modal
                isOpen={showDeleteAllModal}
                onClose={() => setShowDeleteAllModal(false)}
                title="¿Borrar Todo?"
            >
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trash2 className="text-red-600" size={24} />
                    </div>
                    <p className="text-slate-700 mb-4">
                        ¿Estás seguro de que quieres eliminar <strong>TODOS</strong> los tickets registrados?
                        <br />
                        Esta acción es irreversible.
                    </p>
                    <div className="flex gap-3">
                        <Button onClick={() => setShowDeleteAllModal(false)} variant="secondary" fullWidth>Cancelar</Button>
                        <Button onClick={() => { onClearAll(); setShowDeleteAllModal(false); }} variant="danger" fullWidth>Eliminar Todo</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
