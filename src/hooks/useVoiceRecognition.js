import { useState, useEffect, useRef } from 'react';
import { parseVoiceTranscript } from '../utils/voiceParser';

export const useVoiceRecognition = (onResult) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    const transcriptRef = useRef('');
    const onResultRef = useRef(onResult);

    // Actualizar ref si cambia la función callback
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.continuous = true;
            recognition.interimResults = true; // Cambiado a true para ver progreso

            recognition.onstart = () => {
                setIsRecording(true);
                setError(null);
            };

            recognition.onend = () => {
                setIsRecording(false);
                // Procesar el resultado final acumulado cuando se detiene
                if (transcriptRef.current.trim() && onResultRef.current) {
                    const result = parseVoiceTranscript(transcriptRef.current);
                    onResultRef.current(result);
                }
            };

            recognition.onerror = (event) => {
                console.error('Voice error:', event.error);
                // Ignorar error 'no-speech' si es solo silencio momentáneo, pero aquí paramos
                if (event.error !== 'no-speech') {
                    setError(event.error);
                }
                setIsRecording(false);
            };

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscriptChunk = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscriptChunk += result[0].transcript + ' ';
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }

                if (finalTranscriptChunk) {
                    const newTotal = transcriptRef.current + finalTranscriptChunk;
                    transcriptRef.current = newTotal;
                    setTranscript(newTotal);
                } else if (interimTranscript) {
                    // Mostrar interim en UI pero no guardar en ref final todavía
                    // Opcional: podríamos mostrarlo
                }
            };

            recognitionRef.current = recognition;
        } else {
            setError('Navegador no soportado');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const startRecording = () => {
        setTranscript('');
        transcriptRef.current = '';
        setError(null);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting:", e);
            }
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            // El procesamiento ocurrirá en onend
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return {
        isRecording,
        transcript,
        error,
        toggleRecording,
        isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    };
};
