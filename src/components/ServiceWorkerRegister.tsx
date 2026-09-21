'use client';

import { useEffect } from 'react';

/** Registra /sw.js una sola vez. En dev solo con NEXT_PUBLIC_SW=1 (e2e). */
export function ServiceWorkerRegister() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_SW !== '1') return;
        navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.warn('[pwa] registro del service worker falló:', err);
        });
    }, []);
    return null;
}
