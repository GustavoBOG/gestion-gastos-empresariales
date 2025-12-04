import React, { useState } from 'react';
import { useTickets } from '../../hooks/useTickets';
import { useWorkers } from '../../hooks/useWorkers';
import { VoiceInput } from './VoiceInput';
import { ManualInput } from './ManualInput';
import { TicketList } from './TicketList';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { downloadCSV, generateWhatsappText } from '../../utils/export';

export const ExpenseTracker = ({ config, onBack }) => {
    const { tickets, addTicket, addMultipleTickets, updateTicket, updateGroup, deleteTicket, deleteGroup, clearTickets } = useTickets();
    const { workers } = useWorkers();

    const [currentWorker, setCurrentWorker] = useState(config.selectedWorkers[0] || '');
    const [currentDate, setCurrentDate] = useState(config.date);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleAddManualTicket = (ticketData) => {
        addTicket({
            ...ticketData,
            worker: currentWorker,
            date: currentDate,
            ticketGroup: Date.now()
        });
    };

    const handleVoiceTickets = (items, restaurantName) => {
        const ticketGroup = Date.now();
        const ticketsToAdd = items.map((item) => ({
            ...item,
            restaurant: restaurantName,
            worker: currentWorker,
            date: currentDate,
            ticketGroup: ticketGroup
        }));
        addMultipleTickets(ticketsToAdd);
    };

    const handleDeleteGroup = (groupId) => {
        deleteGroup(groupId);
    };

    const handleAddTicketToGroup = (groupId, ticketData) => {
        // Encontrar un ticket del grupo para copiar metadatos (restaurante, worker, date)
        const groupTicket = tickets.find(t => t.ticketGroup == groupId);
        if (groupTicket) {
            addTicket({
                ...ticketData,
                restaurant: groupTicket.restaurant,
                worker: groupTicket.worker,
                date: groupTicket.date,
                ticketGroup: groupId
            });
        }
    };

    const handleDownloadCSV = () => {
        downloadCSV(tickets);
    };

    const handleCopyWhatsapp = () => {
        const text = generateWhatsappText(tickets);
        if (!text) {
            alert('No hay tickets para copiar');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            setShowSuccessModal(true);
        }, (err) => {
            console.error('Error al copiar: ', err);
            alert('Error al copiar al portapapeles');
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Gestión de Gastos Empresariales</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Sistema de registro por voz y manual</p>
                    </div>
                    <Button onClick={onBack} variant="secondary">
                        ⚙️ Configuración
                    </Button>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex gap-4 flex-col md:flex-row">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Fecha</label>
                        <input
                            type="date"
                            value={currentDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Trabajador</label>
                        <select
                            value={currentWorker}
                            onChange={(e) => setCurrentWorker(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                            {config.selectedWorkers.map(w => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <VoiceInput onTicketsDetected={handleVoiceTickets} />
                    <ManualInput onAddTicket={handleAddManualTicket} />
                </div>

                <div className="lg:col-span-2">
                    <TicketList
                        tickets={tickets}
                        onUpdateTicket={updateTicket}
                        onDeleteTicket={deleteTicket}
                        onDeleteGroup={handleDeleteGroup}
                        onAddTicketToGroup={handleAddTicketToGroup}
                        onClearAll={clearTickets}
                    />

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button onClick={handleDownloadCSV} className="py-3">
                            📥 Descargar CSV
                        </Button>
                        <Button onClick={handleCopyWhatsapp} variant="success" className="py-3">
                            💬 Copiar WhatsApp
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="¡Copiado con éxito!"
            >
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-slate-700 mb-4">
                        El resumen de gastos se ha copiado al portapapeles.
                        <br />
                        Ya puedes pegarlo en WhatsApp.
                    </p>
                    <Button onClick={() => setShowSuccessModal(false)} fullWidth>
                        Entendido
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
