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
        <div className="h-full w-full flex flex-col items-center justify-center py-20 px-6 text-center bg-[#FAF9F5] dark:bg-[#181715] dark:text-[#EDE9E1]">
            <TriangleAlert className="w-10 h-10 mb-4 text-red-600 dark:text-red-400" />
            <p className="font-black uppercase text-sm tracking-widest mb-2 dark:text-[#EDE9E1]">No se pudo abrir esta revelación</p>
            <p className="text-xs text-[#57534E] mb-8 max-w-md dark:text-[#A8A29E]">
                El capítulo no existe o su contenido es inválido. Vuelve a intentarlo o regresa a la selección.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-[#FFD600] text-black border-2 border-[#141413] dark:border-[#EDE9E1] font-black uppercase text-xs shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] active:scale-95 transition-all"
                >
                    Reintentar
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1] text-[#141413] border-2 border-[#141413] dark:border-white/20 font-black uppercase text-xs shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] active:scale-95 transition-all"
                >
                    Regresar
                </Link>
            </div>
        </div>
    );
}
