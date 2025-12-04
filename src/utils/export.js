export const downloadCSV = (tickets) => {
    if (tickets.length === 0) {
        alert('No hay tickets para exportar');
        return;
    }

    // Agrupar por ticketGroup para mantener el orden lógico
    const grouped = tickets.reduce((acc, t) => {
        const group = t.ticketGroup || t.id;
        if (!acc[group]) acc[group] = [];
        acc[group].push(t);
        return acc;
    }, {});

    // Ordenar grupos por fecha/id descendente
    const sortedGroups = Object.values(grouped).sort((a, b) => {
        const timeA = a[0].ticketGroup || a[0].id;
        const timeB = b[0].ticketGroup || b[0].id;
        return timeB - timeA;
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Fecha,Trabajador,Restaurante,Concepto,Importe\n";

    sortedGroups.forEach(group => {
        group.forEach(ticket => {
            const row = [
                ticket.date,
                `"${ticket.worker}"`, // Comillas por si tiene espacios o comas
                `"${ticket.restaurant}"`,
                `"${ticket.concept}"`,
                ticket.amount.replace('.', ',') // Formato español
            ].join(",");
            csvContent += row + "\n";
        });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `gastos_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generateWhatsappText = (tickets) => {
    if (tickets.length === 0) {
        return null;
    }

    // Agrupar por ticketGroup
    const grouped = tickets.reduce((acc, t) => {
        const group = t.ticketGroup || t.id;
        if (!acc[group]) acc[group] = [];
        acc[group].push(t);
        return acc;
    }, {});

    const sortedGroups = Object.values(grouped).sort((a, b) => {
        const timeA = a[0].ticketGroup || a[0].id;
        const timeB = b[0].ticketGroup || b[0].id;
        return timeB - timeA;
    });

    let text = "*REPORTE DE GASTOS*\n\n";
    let totalGlobal = 0;

    sortedGroups.forEach(group => {
        const first = group[0];
        const groupTotal = group.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        totalGlobal += groupTotal;

        text += `📅 ${first.date} - 👤 ${first.worker}\n`;
        text += `📍 *${first.restaurant}*\n`;

        group.forEach(t => {
            text += `- ${t.concept}: ${t.amount}€\n`;
        });
        text += `💰 Total Ticket: ${groupTotal.toFixed(2)}€\n\n`;
    });

    text += `-------------------\n`;
    text += `*TOTAL ACUMULADO: ${totalGlobal.toFixed(2)}€*`;

    return text;
};
