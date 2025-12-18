import { useCallback, useRef } from 'react';

export function useRaceSound() {
    const audioCtx = useRef<AudioContext | null>(null);

    const initContext = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx.current.state === 'suspended') {
            audioCtx.current.resume();
        }
    };

    const playBeep = useCallback((freq = 880, duration = 0.1) => {
        initContext();
        if (!audioCtx.current) return;

        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);

        gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.current.destination);

        osc.start();
        osc.stop(audioCtx.current.currentTime + duration);
    }, []);

    const playStart = useCallback(() => {
        initContext();
        if (!audioCtx.current) return;

        const duration = 0.5;
        const osc = audioCtx.current.createOscillator();
        const osc2 = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, audioCtx.current.currentTime + duration);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(225, audioCtx.current.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(112, audioCtx.current.currentTime + duration);

        gain.gain.setValueAtTime(0.15, audioCtx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + duration);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.current.destination);

        osc.start();
        osc2.start();
        osc.stop(audioCtx.current.currentTime + duration);
        osc2.stop(audioCtx.current.currentTime + duration);
    }, []);

    const playVictory = useCallback(() => {
        initContext();
        if (!audioCtx.current) return;

        const now = audioCtx.current.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = audioCtx.current!.createOscillator();
            const gain = audioCtx.current!.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);

            osc.connect(gain);
            gain.connect(audioCtx.current!.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.4);
        });
    }, []);

    return { playBeep, playStart, playVictory };
}
