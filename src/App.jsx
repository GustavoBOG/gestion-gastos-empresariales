import React, { useState } from 'react';
import { WorkerSetup } from './components/features/WorkerSetup';
import { ExpenseTracker } from './components/features/ExpenseTracker';

function App() {
    const [screen, setScreen] = useState('setup'); // 'setup' | 'tracker'
    const [config, setConfig] = useState(null);

    const handleContinue = (setupData) => {
        setConfig({
            date: setupData.date,
            selectedWorkers: JSON.parse(localStorage.getItem('expense_selected_workers') || '[]')
        });
        setScreen('tracker');
    };

    const handleBack = () => {
        setScreen('setup');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {screen === 'setup' ? (
                <WorkerSetup onContinue={handleContinue} />
            ) : (
                <ExpenseTracker config={config} onBack={handleBack} />
            )}
        </div>
    );
}

export default App;
