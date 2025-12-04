import React, { useState } from 'react';
import { useWorkers } from '../../hooks/useWorkers';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Trash2 } from 'lucide-react';

export const WorkerSetup = ({ onContinue }) => {
    const { workers, selectedWorkers, addWorker, removeWorker, toggleWorkerSelection, hasSelected } = useWorkers();
    const [newWorkerName, setNewWorkerName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAddWorker = (e) => {
        e.preventDefault();
        if (addWorker(newWorkerName)) {
            setNewWorkerName('');
        }
    };

    const handleContinue = () => {
        if (hasSelected) {
            onContinue({ date });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card title="Configuración Inicial" className="overflow-hidden">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de los Gastos</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Seleccionar Trabajadores</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto bg-slate-50 p-4 rounded-md border border-slate-200">
                            {workers.map(worker => (
                                <div key={worker} className="flex items-center justify-between p-3 bg-white rounded-md border border-slate-200 hover:border-slate-400 transition group">
                                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedWorkers.includes(worker)}
                                            onChange={() => toggleWorkerSelection(worker)}
                                            className="w-4 h-4 text-slate-800 rounded focus:ring-slate-500"
                                        />
                                        <span className="text-sm font-medium text-slate-800">{worker}</span>
                                    </label>
                                    <button
                                        onClick={() => removeWorker(worker)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                                        title="Eliminar trabajador"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Agregar Trabajador Personalizado</label>
                        <form onSubmit={handleAddWorker} className="flex gap-2">
                            <Input
                                value={newWorkerName}
                                onChange={(e) => setNewWorkerName(e.target.value)}
                                placeholder="Nombre del trabajador"
                                className="flex-1"
                            />
                            <Button type="submit" variant="primary">Agregar</Button>
                        </form>
                    </div>

                    <Button
                        onClick={handleContinue}
                        fullWidth
                        disabled={!hasSelected}
                        className="py-4 text-lg"
                    >
                        Continuar al Registro
                    </Button>
                </div>
            </Card>
        </div>
    );
};
