import { useState, useEffect } from 'react';
import { Pitch } from './types';

const frequencyToNote = (frequency: number) => {
    const noteStrings = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const index = Math.round(noteNum) % 12;
    return noteStrings[index];
}

const fourierTransform = (buffer: Float32Array) => {
    const n = buffer.length;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    const spectrum = new Float32Array(n);

    for (let k = 0; k < n; k++) {
        for (let t = 0; t < n; t++) {
            real[k] += buffer[t] * Math.cos(2 * Math.PI * t * k / n);
            imag[k] -= buffer[t] * Math.sin(2 * Math.PI * t * k / n);
        }
        spectrum[k] = Math.sqrt(real[k] * real[k] + imag[k] * imag[k]);
    }

    return spectrum;
}

const applyWindowFunction = (buffer: Float32Array) => {
    const n = buffer.length;
    const windowedBuffer = new Float32Array(n);

    for (let i = 0; i < n; i++) {
        // Hann window function
        windowedBuffer[i] = buffer[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1)));
    }

    return windowedBuffer;
};

const applyNoiseGate = (spectrum: Float32Array, threshold: number) => {
    return spectrum.map(amplitude => amplitude > threshold ? amplitude : 0);
};

const usePitchRecognition = (): Pitch => {
    const [note, setNote] = useState<string>('');
    const [frequency, setFrequency] = useState<number>(0);

    const pitch: Pitch = {
        frequency,
        note,
    };

    useEffect(() => {
        let interval: Timer;
        const getAudioInput = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new window.AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                source.connect(analyser);
                
                const detectPitch = () => {
                    const buffer = new Float32Array(analyser.fftSize);
                    analyser.getFloatTimeDomainData(buffer);
                    const bufferWithWindow = applyWindowFunction(buffer);

                    const spectrum = fourierTransform(bufferWithWindow);
                    const threshold = 2;
                    const spectrumWithNoiseGate = applyNoiseGate(spectrum, threshold);

                    const peak = Math.max(...spectrumWithNoiseGate);
                    const peakIndex = spectrumWithNoiseGate.indexOf(peak);
                    const frequency = audioContext.sampleRate * peakIndex / analyser.fftSize;

                    setFrequency(frequency);
                    setNote(frequencyToNote(frequency));
                }
                interval = setInterval(detectPitch, 100);
            } catch (error) {
                console.error('Error accessing the microphone', error);
            }
        }

        getAudioInput();

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, []);

    return pitch;
};

export default usePitchRecognition;