const NUMBER_WORDS = {
    'uno': 1, 'una': 1, 'un': 1,
    'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
    'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
    'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14, 'quince': 15,
    'veinte': 20, 'treinta': 30, 'cuarenta': 40, 'cincuenta': 50,
    'sesenta': 60, 'setenta': 70, 'ochenta': 80, 'noventa': 90,
    'cien': 100
};

export const parseVoiceTranscript = (text) => {
    // 1. Normalización básica
    let cleanText = text.toLowerCase();

    // 2. Reemplazo de palabras numéricas
    Object.keys(NUMBER_WORDS).forEach(word => {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        cleanText = cleanText.replace(regex, NUMBER_WORDS[word]);
    });

    // 3. Manejo inteligente de decimales ("5 con 50", "5 coma 50")
    // Solo reemplaza "con" o "coma" si está rodeado de números o seguido de un número
    cleanText = cleanText.replace(/(\d+)\s+(?:con|coma)\s+(\d+)/g, '$1.$2');

    // 4. Sumar números compuestos ("veinte y cinco" -> ya manejado por diccionario, pero "20 y 5" -> 25)
    cleanText = cleanText.replace(/(\d+)\s*y\s*(\d+)/g, (match, tens, units) => {
        return parseInt(tens) + parseInt(units);
    });

    // 5. Estrategia de extracción
    let restaurant = '';
    let itemsText = cleanText;

    // Intentar detectar patrón explícito de restaurante
    const restaurantRegex = /^(?:en|el|restaurante|bar|cafeteria)\s+([^\d]+)/i;
    const startMatch = cleanText.match(restaurantRegex);

    if (startMatch) {
        // Si empieza con "Restaurante X...", tomamos X hasta el primer número
        restaurant = startMatch[1].trim();
        // Limpiamos conectores finales comunes si quedaron atrapados
        restaurant = restaurant.replace(/\s+(?:y|de|el|la|los|las)$/, '');

        // El resto del texto son los items (buscamos donde empieza el primer dígito)
        const firstDigitIndex = cleanText.search(/\d/);
        if (firstDigitIndex !== -1) {
            // Ajustamos el restaurante para que no incluya texto después del inicio de los items si el regex capturó demasiado
            // (aunque el regex [^\d] ya debería haber parado antes del número)
            itemsText = cleanText.slice(firstDigitIndex);
        } else {
            itemsText = ''; // No hay números, no hay items
        }
    } else {
        // Si no hay palabra clave, asumimos que todo lo que hay antes del primer número es el restaurante
        const firstDigitIndex = cleanText.search(/\d/);
        if (firstDigitIndex > 3) { // Mínimo 3 letras para ser un nombre
            restaurant = cleanText.slice(0, firstDigitIndex).trim();
            itemsText = cleanText.slice(firstDigitIndex);
        }
    }

    // Limpieza final del nombre del restaurante
    restaurant = restaurant.replace(/[,.]/g, '').trim();
    if (restaurant) {
        restaurant = restaurant.charAt(0).toUpperCase() + restaurant.slice(1);
    }

    // 6. Extracción de Items (Concepto + Precio)
    const items = [];
    // Patrón: Texto (no dígitos) + Número + (opcional: euros)
    // Usamos 'g' para iterar. El texto puede contener "con" (café con leche) porque ya no lo reemplazamos globalmente
    const itemPattern = /([a-záéíóúñ\s]+?)\s+(\d+(?:[.,]\d{1,2})?)\s*(?:euros?|€)?/gi;

    let match;
    while ((match = itemPattern.exec(itemsText)) !== null) {
        let concept = match[1].trim();
        // Limpiar conectores iniciales/finales del concepto
        concept = concept.replace(/^[,.\s]+|[,.\s]+$/g, '');
        concept = concept.replace(/^(?:y|e)\s+/i, ''); // "y dos cafés" -> "dos cafés"

        const priceStr = match[2].replace(',', '.');
        const price = parseFloat(priceStr);

        // Filtrar palabras clave que no son conceptos
        if (concept && !concept.match(/^(total|restaurante|bar|en)$/i) && price > 0 && price < 10000) {
            items.push({
                concept: concept.charAt(0).toUpperCase() + concept.slice(1),
                amount: price.toFixed(2)
            });
        }
    }

    return { restaurant, items };
};
