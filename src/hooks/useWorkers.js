import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS, DEFAULT_WORKERS } from '../config/constants';

export const useWorkers = () => {
    const [workers, setWorkers] = useState([]);
    const [selectedWorkers, setSelectedWorkers] = useState([]);

    useEffect(() => {
        const storedWorkers = storage.get(STORAGE_KEYS.WORKERS, DEFAULT_WORKERS);
        setWorkers(storedWorkers);

        const storedSelected = storage.get(STORAGE_KEYS.SELECTED_WORKERS, []);
        setSelectedWorkers(storedSelected);
    }, []);

    const addWorker = (name) => {
        const trimmedName = name.trim();
        if (!trimmedName || workers.includes(trimmedName)) return false;

        const newWorkers = [...workers, trimmedName];
        setWorkers(newWorkers);
        storage.set(STORAGE_KEYS.WORKERS, newWorkers);
        return true;
    };

    const removeWorker = (name) => {
        const newWorkers = workers.filter(w => w !== name);
        setWorkers(newWorkers);
        storage.set(STORAGE_KEYS.WORKERS, newWorkers);

        // También eliminar de seleccionados si estaba ahí
        if (selectedWorkers.includes(name)) {
            const newSelected = selectedWorkers.filter(w => w !== name);
            setSelectedWorkers(newSelected);
            storage.set(STORAGE_KEYS.SELECTED_WORKERS, newSelected);
        }
        return true;
    };

    const toggleWorkerSelection = (name) => {
        let newSelected;
        if (selectedWorkers.includes(name)) {
            newSelected = selectedWorkers.filter(w => w !== name);
        } else {
            newSelected = [...selectedWorkers, name];
        }
        setSelectedWorkers(newSelected);
        storage.set(STORAGE_KEYS.SELECTED_WORKERS, newSelected);
    };

    return {
        workers,
        selectedWorkers,
        addWorker,
        removeWorker,
        toggleWorkerSelection,
        hasSelected: selectedWorkers.length > 0
    };
};
