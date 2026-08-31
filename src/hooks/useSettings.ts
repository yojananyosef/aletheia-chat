'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { StorageService, NaasSettings } from '../core/services/StorageService';

const DEFAULT_SETTINGS: NaasSettings = { isMuted: false, readingSpeed: 1 };

type SettingsListener = () => void;
const listeners = new Set<SettingsListener>();

let settingsCache: NaasSettings | null = null;

function readSettings(): NaasSettings {
    if (settingsCache === null) {
        settingsCache = StorageService.getSettings();
    }
    return settingsCache;
}

function writeSettings(next: NaasSettings): void {
    settingsCache = next;
    StorageService.setSettings(next);
    listeners.forEach(listener => listener());
}

function subscribeSettings(listener: SettingsListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

const popAudioRef: { current: HTMLAudioElement | null } = { current: null };

export const useAudio = (isMuted: boolean) => {
    const playPop = useCallback(() => {
        if (isMuted || typeof window === 'undefined') return;
        if (!popAudioRef.current) {
            popAudioRef.current = new Audio('/sounds/pop.mp3');
            popAudioRef.current.volume = 0.3;
        }
        popAudioRef.current.currentTime = 0;
        popAudioRef.current.play().catch(() => { });
    }, [isMuted]);

    return { playPop };
};

export const useSettings = () => {
    const settings = useSyncExternalStore(
        subscribeSettings,
        readSettings,
        () => DEFAULT_SETTINGS
    );

    const setIsMuted = useCallback((isMuted: boolean) => {
        writeSettings({ ...readSettings(), isMuted });
    }, []);

    const setReadingSpeed = useCallback((readingSpeed: number) => {
        writeSettings({ ...readSettings(), readingSpeed });
    }, []);

    return {
        isMuted: settings.isMuted,
        setIsMuted,
        readingSpeed: settings.readingSpeed,
        setReadingSpeed
    };
};
