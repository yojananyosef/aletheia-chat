import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-20 px-6 text-center bg-[#FAF9F5] dark:bg-[#181715] dark:text-[#EDE9E1]">
            <h1 className="font-black uppercase text-2xl tracking-widest mb-2 dark:text-[#EDE9E1]">Página no encontrada</h1>
            <p className="text-sm text-[#57534E] mb-8 max-w-md dark:text-[#A8A29E]">
                La página que buscas no existe o ha sido movida.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#FFD600] text-black border-2 border-[#141413] dark:border-[#EDE9E1] font-black uppercase text-xs shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] active:scale-95 transition-all"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
