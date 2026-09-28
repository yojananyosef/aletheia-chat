import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Node >= 22 expone un `localStorage` experimental global que solo existe si se
 * pasa `--localstorage-file`. Vitest lo copia a `window` y su versión
 * indefinida TAPA la de jsdom, así que `window.localStorage` acaba siendo
 * `undefined` y toda la suite que toca StorageService revienta. Se instala un
 * shim en memoria solo cuando el entorno no trae ninguno.
 */
if (typeof window !== 'undefined' && !window.localStorage) {
    const store = new Map<string, string>();
    const shim: Storage = {
        get length() { return store.size; },
        key: (i: number) => [...store.keys()][i] ?? null,
        getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
        setItem: (k: string, v: string) => { store.set(k, String(v)); },
        removeItem: (k: string) => { store.delete(k); },
        clear: () => { store.clear(); },
    };
    Object.defineProperty(window, 'localStorage', { value: shim, configurable: true, writable: true });
    Object.defineProperty(globalThis, 'localStorage', { value: shim, configurable: true, writable: true });
}

afterEach(() => {
    cleanup();
    window.localStorage.clear();
});
