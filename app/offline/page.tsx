import type { Metadata } from 'next';
import Link from 'next/link';
import { WifiOff, House } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Sin conexión',
    robots: { index: false, follow: false },
};

/** Fallback offline del service worker: página estática, sin JS ni datos. */
export default function OfflinePage() {
    return (
        <main className="min-h-full flex flex-col items-center justify-center gap-4 p-8 text-center bg-[#FAF9F5] dark:bg-[#181715] dark:text-[#EDE9E1] font-sans">
            <div className="bg-black dark:bg-[#0A0A0A] p-4 border-2 border-black dark:border-[#EDE9E1] shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#000]">
                <WifiOff className="w-10 h-10 text-[#FFD600]" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight dark:text-[#EDE9E1]">Sin conexión</h1>
            <p className="text-sm font-medium text-[#57534E] max-w-xs dark:text-[#A8A29E]">
                Este capítulo aún no está guardado en tu dispositivo. Vuelve al inicio:
                todo lo que ya visitaste sigue disponible sin internet.
            </p>
            <Link
                href="/"
                className="mt-2 px-6 py-3 bg-[#FFD600] text-black border-2 border-[#141413] dark:border-[#EDE9E1] font-black uppercase text-sm tracking-widest shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
            >
                <House className="w-4 h-4" strokeWidth={2.5} /> Volver al inicio
            </Link>
        </main>
    );
}
