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
        <main className="min-h-full flex flex-col items-center justify-center gap-4 p-8 text-center bg-white font-sans dark:bg-[#0A0A0A]">
            <div className="bg-black p-4 border-2 border-black shadow-[4px_4px_0_#0A0A0A] dark:border-white">
                <WifiOff className="w-10 h-10 text-[#FFD600]" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Sin conexión</h1>
            <p className="text-sm font-medium text-gray-600 max-w-xs dark:text-gray-300">
                Este capítulo aún no está guardado en tu dispositivo. Vuelve al inicio:
                todo lo que ya visitaste sigue disponible sin internet.
            </p>
            <Link
                href="/"
                className="mt-2 px-6 py-3 bg-[#FFD600] border-2 border-black font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
            >
                <House className="w-4 h-4" strokeWidth={2.5} /> Volver al inicio
            </Link>
        </main>
    );
}
