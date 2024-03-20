import { useState, useEffect } from 'react';
import { Pitch } from './types';

const frequencyToNote = (frequency: number) => {
    const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return noteStrings[Math.round(noteNum) % 12] || '';
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
                    const spectrum = fourierTransform(buffer);
                    const peak = Math.max(...spectrum);
                    const peakIndex = spectrum.indexOf(peak);
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