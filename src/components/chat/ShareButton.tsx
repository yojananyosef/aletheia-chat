'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { SITE_URL } from '../../constants/site';

interface ShareButtonProps {
    bookId: string;
    bookName: string;
    chapter: number;
}

/** Comparte el capítulo: Web Share API si existe, si no copia el enlace. */
export const ShareButton: React.FC<ShareButtonProps> = ({ bookId, bookName, chapter }) => {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const url = `${SITE_URL}/${bookId}/${chapter}`;
    const title = `${bookName} ${chapter} | Aletheia Chat`;

    const flashCopied = () => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
        if (typeof nav.share === 'function') {
            try {
                await nav.share({ title, text: title, url });
            } catch {
                // Cancelado por el usuario: sin feedback.
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            flashCopied();
        } catch {
            // Portapapeles no disponible: sin feedback.
        }
    };

    return (
        <button
            onClick={handleShare}
            aria-label={copied ? '¡Enlace copiado!' : 'Compartir capítulo'}
            title={copied ? '¡Enlace copiado!' : 'Compartir capítulo'}
            className={`p-2 border-2 border-black transition-all outline-none h-fit shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none ${copied ? 'bg-[#FFD600]' : 'hover:bg-gray-100'}`}
        >
            {copied
                ? <Check className="w-6 h-6" strokeWidth={2.5} />
                : <Share2 className="w-6 h-6" strokeWidth={2.5} />}
        </button>
    );
};
