import { useEffect } from 'react';

/** Cierra con Escape cuando está abierto (drawers, menús). SSR-safe. */
export function useDismissOnEscape(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);
}
