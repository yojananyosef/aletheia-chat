'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { ShareSheet, type ShareTarget } from './ShareSheet';
import type { ShareCardMessage } from '../../utils/shareCard';

interface ShareButtonProps {
    bookId: string;
    bookName: string;
    chapter: number;
    /** Mensajes ya leidos: lo unico que la hoja puede dejar seleccionar. */
    messages: ShareCardMessage[];
}

/**
 * Botón del header: abre la hoja de compartir (enlace o imagen). Antes
 * compartía el enlace directo con un solo toque; con la card de versículo hay
 * dos destinos posibles y un único botón adivinaría por el usuario cuál quiere.
 */
export const ShareButton: React.FC<ShareButtonProps> = ({ bookId, bookName, chapter, messages }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const target: ShareTarget = React.useMemo(
        () => ({ bookId, bookName, chapter, messages }),
        [bookId, bookName, chapter, messages],
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Compartir capítulo"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                title="Compartir"
                className="p-2 border-2 border-[#141413] dark:border-[#EDE9E1] bg-[#FAF9F5] dark:bg-[#1F1E1B] transition-all outline-none h-fit shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#EDE9E1] hover:bg-[#F5F0E8] dark:hover:bg-[#252320] active:translate-y-0.5 active:shadow-none"
            >
                <Share2 className="w-6 h-6" strokeWidth={2.5} />
            </button>
            <ShareSheet isOpen={isOpen} target={target} onClose={() => setIsOpen(false)} />
        </>
    );
};
