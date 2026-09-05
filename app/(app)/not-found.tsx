import Link from 'next/link';
import { BookX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-20 px-6 text-center">
            <BookX className="w-10 h-10 mb-4 opacity-40" />
            <p className="font-black uppercase text-sm tracking-widest mb-2">Capítulo no encontrado</p>
            <p className="text-xs text-gray-500 mb-8 max-w-md">
                Este libro o capítulo aún no forma parte del canon disponible.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#FFD600] border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0_#0A0A0A] active:scale-95 transition-all"
            >
                Volver a la selección
            </Link>
        </div>
    );
}
