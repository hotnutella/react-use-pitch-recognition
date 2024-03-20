import { useState, useEffect } from 'react';

const usePitchRecognition = () => {
    const [letter, setLetter] = useState<string>('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setLetter(event.key);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return letter.toUpperCase();
};

export default usePitchRecognition;