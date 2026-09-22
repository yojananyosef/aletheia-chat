'use client';

import { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

/** Aplica `dark` en <html> según el ajuste guardado (clase manual, no sistema). */
export function ThemeApply() {
    const { theme } = useSettings();
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    return null;
}
