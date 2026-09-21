'use client';

import React from 'react';
import { useHasMounted } from '../../hooks/useHasMounted';

/**
 * Puerta del bloque SEO: lo renderiza en el HTML (server / sin JS) y lo
 * desmonta vía React tras hidratar, cuando la isla interactiva toma el relevo.
 * Sin manipulación imperativa del DOM: si hay re-render, el estado persiste.
 */
export function ChapterPrerenderGate({ children }: { children: React.ReactNode }) {
    const mounted = useHasMounted();
    if (mounted) return null;
    return <>{children}</>;
}
