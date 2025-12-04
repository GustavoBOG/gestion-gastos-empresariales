import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../config/constants';

export const useTickets = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const storedTickets = storage.get(STORAGE_KEYS.TICKETS, []);
        setTickets(storedTickets);
    }, []);

    const saveTickets = (newTickets) => {
        setTickets(newTickets);
        storage.set(STORAGE_KEYS.TICKETS, newTickets);
    };

    const addTicket = (ticket) => {
        const newTicket = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...ticket
        };
        const newTickets = [newTicket, ...tickets];
        saveTickets(newTickets);
        return newTicket;
    };

    const addMultipleTickets = (ticketsArray) => {
        const newTicketsWithIds = ticketsArray.map((ticket, index) => ({
            id: `${Date.now()}_${index}`,
            timestamp: new Date().toISOString(),
            ...ticket
        }));
        const newTickets = [...newTicketsWithIds, ...tickets];
        saveTickets(newTickets);
        return newTicketsWithIds;
    };

    const updateTicket = (id, updates) => {
        const newTickets = tickets.map(ticket =>
            ticket.id === id ? { ...ticket, ...updates } : ticket
        );
        saveTickets(newTickets);
    };

    const deleteTicket = (id) => {
        const newTickets = tickets.filter(ticket => ticket.id !== id);
        saveTickets(newTickets);
    };

    const clearTickets = () => {
        saveTickets([]);
    };

    const getTotal = () => {
        return tickets.reduce((sum, ticket) => sum + parseFloat(ticket.amount || 0), 0);
    };

    return {
        tickets,
        addTicket,
        addMultipleTickets,
        updateTicket,
        deleteTicket,
        clearTickets,
        getTotal
    };
};
