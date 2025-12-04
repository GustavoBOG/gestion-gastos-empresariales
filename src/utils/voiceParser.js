const NUMBER_WORDS = {
    'uno': 1, 'una': 1, 'un': 1,
    'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
    'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
    'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14, 'quince': 15,
    'dieciseis': 16, 'dieciséis': 16, 'diecisiete': 17, 'dieciocho': 18, 'diecinueve': 19,
    'veinte': 20, 'veintiuno': 21, 'veintiún': 21, 'veintidos': 22, 'veintidós': 22,
    'veintitres': 23, 'veintitrés': 23, 'veinticuatro': 24, 'veinticinco': 25,
    'veintiseis': 26, 'veintiséis': 26, 'veintisiete': 27, 'veintiocho': 28, 'veintinueve': 29,
    'treinta': 30, 'cuarenta': 40, 'cincuenta': 50,
    'sesenta': 60, 'setenta': 70, 'ochenta': 80, 'noventa': 90,
    'cien': 100
};

const RESTAURANT_KEYWORDS = ['restaurante', 'cafeteria', 'cafetería', 'bar', 'tasca', 'meson', 'mesón', 'asador', 'venta', 'bistro', 'cerveceria', 'cervecería'];

const COMMON_ITEMS = [
    'coca cola', 'coca-cola', 'papas fritas', 'patatas fritas',
    'cafe con leche', 'café con leche', 'vino tinto', 'vino blanco',
    'agua mineral', 'agua con gas', 'agua sin gas', 'tarta de queso',
    'ensaladilla rusa', 'bocadillo de', 'sandwich de', 'hamburguesa',
    'pizza', 'pasta', 'ensalada', 'sopa', 'filete', 'pollo', 'pescado',
    'cerveza', 'refresco', 'zumo', 'postre', 'helado', 'cafe', 'café',
    'te', 'té', 'infusion', 'infusión', 'copa', 'licor', 'menu', 'menú'
];

export const parseVoiceTranscript = (text) => {
    // 1. Normalización básica
    let cleanText = text.toLowerCase();

    // 2. Reemplazo de palabras numéricas
    Object.keys(NUMBER_WORDS).forEach(word => {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        cleanText = cleanText.replace(regex, NUMBER_WORDS[word]);
    });

    // 3. Manejo inteligente de decimales ("5 con 50", "5 coma 50")
    cleanText = cleanText.replace(/(\d+)\s+(?:con|coma)\s+(\d+)/g, '$1.$2');

    // 4. Sumar números compuestos
    cleanText = cleanText.replace(/(\d+)\s*y\s*(\d+)/g, (match, tens, units) => {
        return parseInt(tens) + parseInt(units);
    });

    // 5. Limpieza de ruido (euros, moneda)
    cleanText = cleanText.replace(/\s+(?:euros?|€)/g, '');

    // 6. Extracción inicial de items usando regex estricta (no permite números en concepto)
    // Esto separará "Restaurante X 2" de "Coca cola 6"
    const itemPattern = /(?:(\d+)\s+)?([^\d]+)\s+(\d+(?:[.,]\d{1,2})?)/gi;

    let rawItems = [];
    let match;

    while ((match = itemPattern.exec(cleanText)) !== null) {
        const quantity = match[1];
        let concept = match[2].trim();
        const price = parseFloat(match[3].replace(',', '.'));

        // Limpieza básica del concepto
        concept = concept.replace(/^[,.\s]+|[,.\s]+$/g, '');
        concept = concept.replace(/^(?:y|e)\s+/i, '');

        if (price > 0 && price < 10000) {
            rawItems.push({
                quantity: quantity,
                concept: concept,
                amount: price
            });
        }
    }

    let restaurant = '';
    let finalItems = [...rawItems];

    if (finalItems.length > 0) {
        // --- FASE 1: Detección de Restaurante + Cantidad "suelta" ---
        // Caso: "Restaurante Pepe 2" (Item 0) ... "Coca colas 6" (Item 1)
        // La regex capturó "Restaurante Pepe" como concepto y "2" como precio.
        const firstItem = finalItems[0];

        // Criterio: El "precio" es un entero pequeño (cantidad) y hay un siguiente item
        const isQuantityMisinterpreted = Number.isInteger(firstItem.amount) && firstItem.amount < 50;
        const hasNextItem = finalItems.length > 1;

        // Criterio extra: El concepto parece un restaurante (tiene keyword o es el primero)
        const hasRestaurantKeyword = RESTAURANT_KEYWORDS.some(kw => firstItem.concept.includes(kw));

        if (isQuantityMisinterpreted && hasNextItem && (hasRestaurantKeyword || finalItems.length >= 2)) {
            // FUSIONAR: Item 0 es el restaurante y su "precio" es la cantidad del Item 1
            restaurant = firstItem.concept;
            const quantity = firstItem.amount; // El "precio" era la cantidad

            // Actualizar el siguiente item
            finalItems[1].quantity = quantity; // Sobrescribir o combinar? Asumimos que es la cantidad principal

            // Eliminar el primer item (que era el restaurante)
            finalItems.shift();
        }
        else {
            // --- FASE 2: Separación de Restaurante dentro del primer item ---
            // Caso: "Restaurante Pepe Coca colas 6" (Item 0)
            // La regex capturó todo junto.

            let concept = firstItem.concept;
            let splitPoint = -1;

            // A. Buscar keyword en el medio (ej: "La Alemana Restaurante papas")
            for (const kw of RESTAURANT_KEYWORDS) {
                const regex = new RegExp(`(.+)\\s+(${kw})\\s+(.+)`, 'i');
                const match = concept.match(regex);
                if (match) {
                    // match[1] = "La Alemana", match[2] = "Restaurante", match[3] = "papas"
                    // Restaurante = "La Alemana Restaurante"
                    restaurant = `${match[1]} ${match[2]}`;
                    firstItem.concept = match[3];
                    splitPoint = 999; // Marcado como split realizado
                    break;
                }
            }

            // B. Si no se separó, y empieza con keyword (ej: "Restaurante La Alemana papas")
            if (splitPoint === -1) {
                const startsWithKeyword = RESTAURANT_KEYWORDS.some(kw => concept.startsWith(kw));

                if (startsWithKeyword) {
                    // Intentar separar usando items comunes al final
                    for (const item of COMMON_ITEMS) {
                        if (concept.toLowerCase().endsWith(item)) {
                            splitPoint = concept.length - item.length;
                            break;
                        }
                    }

                    // Fallback: Si no hay item común, asumir que el item son las últimas 1-2 palabras
                    if (splitPoint === -1) {
                        const words = concept.split(/\s+/);
                        if (words.length > 2) { // Mínimo 3 palabras para separar (Restaurante X Item)
                            // Tomamos la última palabra como item
                            const lastWord = words.pop();
                            splitPoint = concept.lastIndexOf(lastWord);
                        }
                    }

                    if (splitPoint !== -1) {
                        restaurant = concept.substring(0, splitPoint).trim();
                        firstItem.concept = concept.substring(splitPoint).trim();
                    }
                }
            }

            // Si detectamos restaurante en Fase 2, lo limpiamos del concepto
            if (restaurant) {
                // Ya actualizamos firstItem.concept arriba
            } else if (finalItems.length > 0 && RESTAURANT_KEYWORDS.some(kw => finalItems[0].concept.includes(kw))) {
                // Caso residual: El concepto tiene "Restaurante" pero no pudimos separar bien.
                // Asumimos que TODO es restaurante si no hay precio razonable? No, ya filtramos por precio.
                // Dejamos que el usuario edite si falló la heurística.
            }
        }
    }

    // Limpieza final de restaurante
    if (restaurant) {
        // Opcional: quitar "Restaurante" del inicio si se desea, pero el usuario parece querer el nombre completo
        // restaurant = restaurant.replace(/^(?:en|el|restaurante|bar|cafeteria)\s+/i, '');
        restaurant = restaurant.replace(/[,.]/g, '').trim();
        restaurant = restaurant.charAt(0).toUpperCase() + restaurant.slice(1);
    }

    // Formateo final de items
    const formattedItems = finalItems.map(item => {
        let finalConcept = item.concept.charAt(0).toUpperCase() + item.concept.slice(1);
        if (item.quantity) {
            finalConcept = `${item.quantity} ${finalConcept}`;
        }
        return {
            concept: finalConcept,
            amount: item.amount.toFixed(2)
        };
    });

    return { restaurant, items: formattedItems };
};
