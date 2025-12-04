import React, { useState, useEffect } from 'react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Mic, Square, Edit2 } from 'lucide-react';

export const VoiceInput = ({ onTicketsDetected }) => {
    const [showModal, setShowModal] = useState(false);
    const [detectedData, setDetectedData] = useState(null);
    const [editedRestaurant, setEditedRestaurant] = useState('');

    const handleVoiceResult = (result) => {
        setDetectedData(result);
        setEditedRestaurant(result.restaurant);
        setShowModal(true);
    };

    const { isRecording, toggleRecording, error } = useVoiceRecognition(handleVoiceResult);

    const handleConfirm = () => {
        if (detectedData) {
            // Aplicar el nombre del restaurante editado a todos los items
            const finalItems = detectedData.items.map(item => ({
                ...item,
                restaurant: editedRestaurant
            }));
            onTicketsDetected(finalItems, editedRestaurant);
            setShowModal(false);
            setDetectedData(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Dictado por Voz</h2>

            <Button
                onClick={toggleRecording}
                fullWidth
                className={`py-6 text-base gap-3 mb-4 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''}`}
            >
                {isRecording ? <Square size={24} /> : <Mic size={24} />}
                {isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
            </Button>

            {isRecording && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                        GRABANDO
                    </p>
                    <p className="text-xs text-red-600 mt-1">Dicta la factura completa. Pulsa el botón para detener.</p>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                    {error}
                </div>
            )}

            <div className="text-xs text-slate-500 leading-relaxed space-y-2">
                <p className="font-semibold text-slate-700">Instrucciones:</p>
                <p>1. Pulsa "Iniciar Grabación"</p>
                <p>2. Dicta toda la factura</p>
                <p>3. Pulsa "Detener" cuando termines</p>
                <p className="pt-2 text-slate-700"><strong>Ejemplo:</strong></p>
                <p className="italic">"Restaurante La Bodega, coca cola seis euros, arroz doce euros..."</p>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Confirmar Tickets Detectados"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Restaurante Detectado</label>
                        <div className="flex gap-2">
                            <Input
                                value={editedRestaurant}
                                onChange={(e) => setEditedRestaurant(e.target.value)}
                                placeholder="Nombre del restaurante"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Puedes corregir el nombre si es incorrecto.</p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-semibold text-slate-700">Items ({detectedData?.items.length})</h4>
                            <button
                                onClick={() => {
                                    setDetectedData(prev => ({
                                        ...prev,
                                        items: [...prev.items, { concept: '', amount: '' }]
                                    }));
                                }}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition"
                            >
                                + Añadir Item
                            </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 bg-slate-50 p-2 rounded">
                            {detectedData?.items.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={item.concept}
                                        onChange={(e) => {
                                            const newItems = [...detectedData.items];
                                            newItems[idx].concept = e.target.value;
                                            setDetectedData({ ...detectedData, items: newItems });
                                        }}
                                        placeholder="Concepto"
                                        className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.amount}
                                        onChange={(e) => {
                                            const newItems = [...detectedData.items];
                                            newItems[idx].amount = e.target.value;
                                            setDetectedData({ ...detectedData, items: newItems });
                                        }}
                                        placeholder="€"
                                        className="w-20 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-400 text-right font-bold"
                                    />
                                    <button
                                        onClick={() => {
                                            const newItems = detectedData.items.filter((_, i) => i !== idx);
                                            setDetectedData({ ...detectedData, items: newItems });
                                        }}
                                        className="text-red-400 hover:text-red-600 p-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button onClick={() => setShowModal(false)} variant="secondary" fullWidth>Cancelar</Button>
                        <Button onClick={handleConfirm} variant="success" fullWidth>Confirmar y Guardar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
