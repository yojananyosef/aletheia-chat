import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-20 px-6 text-center">
            <h1 className="font-black uppercase text-2xl tracking-widest mb-2">Página no encontrada</h1>
            <p className="text-sm text-gray-500 mb-8 max-w-md">
                La página que buscas no existe o ha sido movida.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#FFD600] border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0_#0A0A0A] active:scale-95 transition-all"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
