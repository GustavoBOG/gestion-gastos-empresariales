import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const ManualInput = ({ onAddTicket }) => {
    const [restaurant, setRestaurant] = useState('');
    const [concept, setConcept] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!concept || !amount) return;

        onAddTicket({
            restaurant: restaurant.trim(),
            concept: concept.trim(),
            amount: parseFloat(amount).toFixed(2)
        });

        // Limpiar campos excepto restaurante (opcional, pero a veces útil mantenerlo)
        // Para seguir comportamiento original, limpiamos todo o mantenemos restaurante si se desea.
        // El original limpiaba todo.
        setRestaurant('');
        setConcept('');
        setAmount('');

        // Foco al concepto (simulado, React lo maneja diferente pero el usuario lo espera)
        document.getElementById('conceptInput')?.focus();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Entrada Manual</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    placeholder="Restaurante"
                />
                <Input
                    id="conceptInput"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="Concepto"
                />
                <div className="flex gap-2">
                    <Input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Precio €"
                        className="flex-1 font-bold"
                    />
                    <Button type="submit" variant="primary">Añadir</Button>
                </div>
            </form>
        </div>
    );
};
