import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, BookOpen } from 'lucide-react';
import { FavoriteMessage } from '../../types/bible';
import { useDismissOnEscape } from '../../hooks/useDismissOnEscape';

interface FavoritesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    favorites: FavoriteMessage[];
    onToggleLike: (fav: FavoriteMessage) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ isOpen, onClose, favorites, onToggleLike }) => {
    useDismissOnEscape(isOpen, onClose);
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 40 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 40 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Versículos favoritos"
                        className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1] border-[3px] border-[#141413] dark:border-[#EDE9E1] shadow-[8px_8px_0_#141413] dark:shadow-[8px_8px_0_#000] overflow-hidden h-[85vh] flex flex-col"
                    >
                        <div className="bg-[#FFD600] border-b-[3px] border-[#141413] dark:border-[#EDE9E1] p-6 flex items-center justify-between text-black">
                            <div className="flex items-center gap-4">
                                <Heart className="w-6 h-6 fill-black" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Tesoros en el Corazón</h3>
                            </div>
                            <button onClick={onClose} autoFocus aria-label="Cerrar favoritos" className="p-2 border-2 border-black bg-[#FAF9F5] text-black hover:bg-black hover:text-[#EDE9E1] transition-all shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none font-black text-xs">
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#F5F0E8] dark:bg-[#181715]">
                            {favorites.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10">
                                    <div className="text-6xl mb-6">📜</div>
                                    <p className="font-black uppercase text-sm tracking-[0.2em]">Aún no has guardado ninguna palabra</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {favorites.map(fav => (
                                        <div key={`${fav.bookId}_${fav.id}`} className="bg-[#FAF9F5] dark:bg-[#252320] dark:text-[#EDE9E1] border-2 border-[#141413] dark:border-white/20 p-5 shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#000] relative group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-3 h-3 text-[#FFD600]" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{fav.bookName} • CAP {fav.chapter}</span>
                                                    </div>
                                                    <div className="text-[9px] font-bold text-[#57534E] dark:text-[#A8A29E]">Speaker: {fav.speaker} • Versículo {fav.verse}</div>
                                                </div>
                                                <button
                                                    onClick={() => onToggleLike(fav)}
                                                    aria-label="Quitar de favoritos"
                                                    className="p-1.5 bg-red-50 text-red-600 border-2 border-transparent hover:border-red-600 transition-all rounded-sm"
                                                >
                                                    <Heart className="w-4 h-4 fill-current" />
                                                </button>
                                            </div>
                                            <p className="text-sm md:text-base font-medium italic text-[#3D3D3A] dark:text-[#D8D5CD] leading-relaxed border-l-4 border-[#FFD600] pl-4">
                                                &ldquo;{fav.text}&rdquo;
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
