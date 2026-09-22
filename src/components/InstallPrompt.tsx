'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
}

/** Banner "Instalar app": aparece cuando el navegador dispara beforeinstallprompt. */
export function InstallPrompt() {
    const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (window.matchMedia?.('(display-mode: standalone)').matches) return;
        const onPrompt = (e: Event) => {
            e.preventDefault();
            setDeferred(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', onPrompt);
        return () => window.removeEventListener('beforeinstallprompt', onPrompt);
    }, []);

    if (!deferred || dismissed) return null;

    const handleInstall = async () => {
        await deferred.prompt();
        setDeferred(null);
    };

    return (
        <div
            role="dialog"
            aria-label="Instalar aplicación"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs z-[250] bg-black text-white border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.3)] p-4 flex items-center gap-3"
        >
            <div className="bg-[#FFD600] p-2 shrink-0" aria-hidden="true">
                <Download className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-black uppercase text-[11px] tracking-widest">Instalar app</p>
                <p className="text-[11px] opacity-80">Lectura offline en tu pantalla principal</p>
            </div>
            <button
                onClick={handleInstall}
                className="bg-[#FFD600] text-black font-black uppercase text-[11px] tracking-widest px-3 py-2 border-2 border-[#FFD600] active:scale-95 transition-transform shrink-0"
            >
                Instalar
            </button>
            <button
                onClick={() => setDismissed(true)}
                aria-label="Descartar instalación"
                className="p-1 opacity-70 hover:opacity-100 shrink-0"
            >
                <X className="w-4 h-4" strokeWidth={3} />
            </button>
        </div>
    );
}
