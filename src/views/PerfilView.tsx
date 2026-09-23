'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Flame, Heart, BookOpenCheck, Library, ChevronRight } from 'lucide-react';
import { usePersistentState } from '../hooks/usePersistentState';
import { useHasMounted } from '../hooks/useHasMounted';
import { getSpiritualLevel } from '../hooks/useSpiritualLevel';
import { StorageService } from '../core/services/StorageService';
import { computeUnlocked } from '../utils/unlock';
import { BIBLE_BOOKS } from '../constants/books';

/** Perfil: identidad espiritual, racha y stats de lectura. Solo cliente. */
export const PerfilView: React.FC = () => {
    const router = useRouter();
    const hasMounted = useHasMounted();
    const { favorites } = usePersistentState();
    const level = getSpiritualLevel(favorites.length);

    const stats = useMemo(() => {
        if (!hasMounted) return { streak: 0, completed: 0, open: 1 };
        let completed = 0;
        for (const b of BIBLE_BOOKS) {
            for (const c of b.availableChapters) {
                if (StorageService.isChapterComplete(b.id, c)) completed++;
            }
        }
        const open = computeUnlocked(
            BIBLE_BOOKS,
            (b, c) => StorageService.isChapterComplete(b, c),
            (b) => StorageService.getLastChapter(b) !== null || StorageService.getLastMessage(b) !== null,
        ).size;
        return { streak: StorageService.getStreak(), completed, open };
    }, [hasMounted]);

    const recentFavs = useMemo(() => favorites.slice(-6).reverse(), [favorites]);

    return (
        <div className="h-full w-full bg-[#FAF9F5] dark:bg-[#181715] dark:text-[#EDE9E1] overflow-hidden font-sans">
            <main className="w-full flex flex-col h-full overflow-hidden">
                <header className="border-b-[3px] border-[#141413] dark:border-[#EDE9E1] bg-[#FFD600] shrink-0 z-50">
                    <div className="safe-top" />
                    <div className="px-4 py-3 flex items-center gap-3 text-black">
                        <button
                            onClick={() => router.push('/')}
                            aria-label="Volver al inicio"
                            className="p-2 border-2 border-black bg-[#FAF9F5] hover:bg-[#F5F0E8] transition-all shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none shrink-0"
                        >
                            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                        <h1 className="text-2xl font-black uppercase tracking-tight leading-none">Perfil</h1>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-4 pb-8">
                    {/* Identidad */}
                    <div className="bg-[#FAF9F5] dark:bg-[#1F1E1B] border-[3px] border-[#141413] dark:border-[#EDE9E1] p-6 shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] flex items-center gap-4">
                        <div
                            className="w-14 h-14 shrink-0 border-[3px] border-[#141413] dark:border-[#EDE9E1] flex items-center justify-center text-3xl font-black"
                            style={{ backgroundColor: level.color, color: level.textColor === 'text-white' ? '#EDE9E1' : '#141413' }}
                            aria-hidden="true"
                        >
                            {level.icon}
                        </div>
                        <div className="min-w-0">
                            <div className="text-xl font-black uppercase tracking-tight leading-tight">{level.title}</div>
                            <div className="text-[10px] font-bold text-[#57534E] dark:text-[#A8A29E] uppercase tracking-[0.2em]">{level.rank}</div>
                            {level.nextTitle && (
                                <div className="text-[10px] font-bold text-[#57534E] dark:text-[#A8A29E] uppercase mt-1">
                                    Siguiente: {level.nextTitle} ({favorites.length} ❤️)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black dark:bg-[#0A0A0A] text-[#EDE9E1] border-[3px] border-black dark:border-[#EDE9E1] p-4 shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000]">
                            <Flame className="w-5 h-5 text-[#FFD600] mb-2" strokeWidth={2.5} />
                            <div className="text-3xl font-black leading-none">{stats.streak}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">
                                {stats.streak === 1 ? 'Día de racha' : 'Días de racha'}
                            </div>
                        </div>
                        <div className="bg-[#FAF9F5] dark:bg-[#1F1E1B] border-[3px] border-[#141413] dark:border-white/20 p-4 shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000]">
                            <Heart className="w-5 h-5 text-red-500 mb-2" strokeWidth={2.5} />
                            <div className="text-3xl font-black leading-none">{favorites.length}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest mt-1 text-[#57534E] dark:text-[#A8A29E]">
                                Favoritos
                            </div>
                        </div>
                        <div className="bg-[#FAF9F5] dark:bg-[#1F1E1B] border-[3px] border-[#141413] dark:border-white/20 p-4 shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000]">
                            <BookOpenCheck className="w-5 h-5 mb-2" strokeWidth={2.5} />
                            <div className="text-3xl font-black leading-none">{stats.completed}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest mt-1 text-[#57534E] dark:text-[#A8A29E]">
                                Capítulos completos
                            </div>
                        </div>
                        <div className="bg-[#FFD600] text-black border-[3px] border-[#141413] dark:border-[#EDE9E1] p-4 shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000]">
                            <Library className="w-5 h-5 mb-2" strokeWidth={2.5} />
                            <div className="text-3xl font-black leading-none">{stats.open}<span className="text-lg">/66</span></div>
                            <div className="text-[9px] font-black uppercase tracking-widest mt-1">
                                Libros abiertos
                            </div>
                        </div>
                    </div>

                    {/* Favoritos recientes */}
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest mb-2 dark:text-[#EDE9E1]">Recientes destacados</h2>
                        {recentFavs.length === 0 ? (
                            <p className="text-xs text-[#57534E] dark:text-[#A8A29E] font-medium border-2 border-dashed border-[#E6DFD8] dark:border-[#3A3733] p-4 text-center">
                                Doble toque en una burbuja para guardar tu primer favorito ❤️
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {recentFavs.map((fav) => (
                                    <button
                                        key={`${fav.bookId}-${fav.id}`}
                                        onClick={() => router.push(`/${fav.bookId}/${fav.chapter}`)}
                                        className="w-full text-left bg-[#FAF9F5] dark:bg-[#1F1E1B] border-2 border-[#141413] dark:border-[#EDE9E1] p-3 flex items-center gap-3 active:bg-[#FFD600] active:text-black transition-colors"
                                    >
                                        <span className="flex-1 min-w-0">
                                            <span className="block text-[9px] font-black uppercase tracking-widest text-[#57534E] dark:text-[#A8A29E]">
                                                {fav.bookName} {fav.chapter}:{fav.verse}
                                            </span>
                                            <span className="block text-sm font-medium truncate">{fav.text}</span>
                                        </span>
                                        <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={3} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
