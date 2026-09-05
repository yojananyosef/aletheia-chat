import { RefreshCw } from 'lucide-react';

export default function Loading() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-20 opacity-40">
            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
            <p className="font-black uppercase text-xs tracking-[0.2em]">Abriendo capítulo...</p>
        </div>
    );
}
