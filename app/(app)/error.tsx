'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error en ruta /(app):', error);
    }, [error]);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-20 px-6 text-center">
            <TriangleAlert className="w-10 h-10 mb-4 text-red-600" />
            <p className="font-black uppercase text-sm tracking-widest mb-2">No se pudo abrir esta revelación</p>
            <p className="text-xs text-gray-500 mb-8 max-w-md">
                El capítulo no existe o su contenido es inválido. Vuelve a intentarlo o regresa a la selección.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-[#FFD600] border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0_#0A0A0A] active:scale-95 transition-all"
                >
                    Reintentar
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 bg-white border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0_#0A0A0A] active:scale-95 transition-all"
                >
                    Regresar
                </Link>
            </div>
        </div>
    );
}
