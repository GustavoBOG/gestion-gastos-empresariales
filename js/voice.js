// Reconocimiento de voz
class VoiceRecognition {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.fullTranscript = '';
    }

    isSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    start() {
        if (!this.isSupported()) {
            alert('Tu navegador no soporta reconocimiento de voz.\n\nUsa Chrome, Safari o Edge.');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'es-ES';
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.fullTranscript = '';

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.updateUI(true);
        };

        this.recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    this.fullTranscript += event.results[i][0].transcript + ' ';
                }
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Error:', event.error);
            if (event.error !== 'no-speech') {
                showNotification('Error en el reconocimiento de voz', 'error');
            }
        };

        this.recognition.onend = () => {
            if (this.isRecording) {
                this.recognition.start();
            } else {
                if (this.fullTranscript.trim()) {
                    this.processTranscript(this.fullTranscript.trim());
                }
            }
        };

        this.recognition.start();
        return true;
    }

    stop() {
        this.isRecording = false;
        if (this.recognition) {
            this.recognition.stop();
        }
        this.updateUI(false);
    }

    toggle() {
        if (this.isRecording) {
            this.stop();
        } else {
            this.start();
        }
    }

    updateUI(recording) {
        const btn = document.getElementById(DOM_IDS.MIC_BTN);
        const icon = document.getElementById(DOM_IDS.MIC_ICON);
        const text = document.getElementById(DOM_IDS.MIC_TEXT);
        const status = document.getElementById(DOM_IDS.RECORDING_STATUS);

        if (recording) {
            btn.classList.add('recording-active');
            icon.textContent = '⏹️';
            text.textContent = 'Detener Grabación';
            status.classList.remove('hidden');
        } else {
            btn.classList.remove('recording-active');
            icon.textContent = '🎤';
            text.textContent = 'Iniciar Grabación';
            status.classList.add('hidden');
        }
    }

    processTranscript(text) {
        const worker = document.getElementById(DOM_IDS.WORKER_SELECT).value;
        const date = document.getElementById(DOM_IDS.CURRENT_DATE).value;

        let cleanText = text.toLowerCase().replace(/ con /gi, '.').replace(/ coma /gi, '.');

        Object.keys(NUMBER_WORDS).forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            cleanText = cleanText.replace(regex, NUMBER_WORDS[word]);
        });

        cleanText = cleanText.replace(/(\d+)\s*y\s*(\d+)/g, (match, tens, units) => {
            return parseInt(tens) + parseInt(units);
        });

        let restaurant = '';
        const restaurantMatch = cleanText.match(/(?:restaurante|en|bar)\s+([a-záéíóúñ\s]+?)(?:\s*,|\s+coca|\s+menu|\s+arroz|\s+plato|\s+total)/i);
        if (restaurantMatch) {
            restaurant = restaurantMatch[1].trim();
            restaurant = restaurant.charAt(0).toUpperCase() + restaurant.slice(1);
        }

        const items = [];
        const itemPattern = /([a-záéíóúñ\s]+?)\s+(\d+(?:[.,]\d{1,2})?)\s*(?:euros?|€)?/gi;
        let match;

        while ((match = itemPattern.exec(cleanText)) !== null) {
            const itemName = match[1].trim().replace(/^\s*,\s*/, '');
            const price = parseFloat(match[2].replace(',', '.'));

            if (!itemName.match(/^(total|restaurante|bar|en)$/i) && price > 0 && price < 500) {
                items.push({
                    name: itemName.charAt(0).toUpperCase() + itemName.slice(1),
                    price: price
                });
            }
        }

        if (items.length > 0) {
            const ticketId = Date.now();
            const newTickets = items.map((item, index) => ({
                id: `${ticketId}_${index}`,
                ticketGroup: ticketId,
                date,
                worker,
                restaurant: restaurant || '-',
                concept: item.name,
                amount: item.price.toFixed(2)
            }));

            window.ticketManager.addMultiple(newTickets);
            showNotification(`✓ Factura registrada: ${items.length} item(s) de ${restaurant || 'sin nombre'}`);
        } else {
            showNotification('No se detectaron items válidos. Intenta de nuevo.', 'error');
        }
    }
}
