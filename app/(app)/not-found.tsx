import Link from 'next/link';
import { BookX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-20 px-6 text-center bg-[#FAF9F5] dark:bg-[#181715] dark:text-[#EDE9E1]">
            <BookX className="w-10 h-10 mb-4 opacity-40 dark:text-[#EDE9E1]" />
            <p className="font-black uppercase text-sm tracking-widest mb-2 dark:text-[#EDE9E1]">Capítulo no encontrado</p>
            <p className="text-xs text-[#57534E] mb-8 max-w-md dark:text-[#A8A29E]">
                Este libro o capítulo aún no forma parte del canon disponible.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#FFD600] text-black border-2 border-[#141413] dark:border-[#EDE9E1] font-black uppercase text-xs shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] active:scale-95 transition-all"
            >
                Volver a la selección
            </Link>
        </div>
    );
}
