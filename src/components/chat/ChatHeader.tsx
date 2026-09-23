import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ChevronDown, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookInfo } from '../../types/bible';
import { OptionsMenu } from './OptionsMenu';
import { ShareButton } from './ShareButton';
import { useDismissOnEscape } from '../../hooks/useDismissOnEscape';

interface ChatHeaderProps {
    book: BookInfo | undefined;
    chapter: number;
    subtitle: string;
    onBack: () => void;
    onToggleSelector: () => void;
    onCloseSelector: () => void;
    isSelectorOpen: boolean;
    onSelectChapter: (chap: number) => void;
    isMuted: boolean;
    currentSpeed: number;
    onToggleMute: () => void;
    onSetSpeed: (speed: number) => void;
    onShowInfo: () => void;
    onRestart: () => void;
    isOptionsOpen: boolean;
    onToggleOptions: () => void;
    onCloseOptions: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = (props) => {
    useDismissOnEscape(props.isSelectorOpen, props.onCloseSelector);

    // Al cerrar el menú de opciones se devuelve el foco al botón que lo abrió.
    const optionsBtnRef = useRef<HTMLButtonElement>(null);
    const wasOptionsOpen = useRef(false);
    useEffect(() => {
        if (wasOptionsOpen.current && !props.isOptionsOpen) optionsBtnRef.current?.focus();
        wasOptionsOpen.current = props.isOptionsOpen;
    }, [props.isOptionsOpen]);
    return (
        <header className="border-b-[3px] border-[#141413] dark:border-[#EDE9E1] bg-[#FAF9F5] dark:bg-[#1F1E1B] px-4 py-2 safe-top sticky top-0 z-50 flex items-center justify-between shrink-0 h-auto sm:h-24 md:h-24 transition-all overflow-visible select-none">
            <div className="flex items-center gap-3 min-w-0 h-full py-2">
                <button onClick={props.onBack} aria-label="Volver a la selección de libros" className="p-2 border-2 border-[#141413] dark:border-[#EDE9E1] hover:bg-[#F5F0E8] dark:hover:bg-[#252320] transition-all shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#EDE9E1] active:translate-y-0.5 active:shadow-none shrink-0 bg-[#FAF9F5] dark:bg-[#1F1E1B]">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#141413] dark:text-[#EDE9E1]" strokeWidth={2.5} />
                </button>
                <div className="min-w-0 text-left flex flex-col justify-center relative">
                    <button onClick={props.onToggleSelector} aria-label="Seleccionar capítulo" aria-expanded={props.isSelectorOpen} className="flex items-center gap-2 group max-w-full outline-none">
                        <h1 className="text-xl md:text-2xl font-black leading-none uppercase truncate dark:text-[#EDE9E1]">{props.book?.name} • Cap {props.chapter}</h1>
                        <ChevronDown className={`w-5 h-5 transition-transform shrink-0 ${props.isSelectorOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                    </button>
                    <span className="text-[10px] md:text-xs font-black text-[#57534E] uppercase tracking-[0.2em] block truncate mt-1 dark:text-[#A8A29E]">{props.subtitle}</span>

                    {/* Selector de Capítulos — positioned below the title */}
                    <AnimatePresence>
                        {props.isSelectorOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                    className="absolute top-full left-0 mt-2 w-[80vw] sm:w-64 bg-[#FAF9F5] dark:bg-[#1F1E1B] border-2 border-[#141413] dark:border-[#EDE9E1] z-[100] p-4 shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] grid grid-cols-4 gap-2 max-h-64 overflow-y-auto"
                                >
                                    {props.book?.availableChapters.map(chap => (
                                        <button
                                            key={chap}
                                            onClick={() => props.onSelectChapter(chap)}
                                            className={`p-2 border-2 border-[#141413] dark:border-[#EDE9E1] font-black text-sm transition-all ${props.chapter === chap ? 'bg-[#FFD600] text-[#141413]' : 'hover:bg-[#F5F0E8] shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#EDE9E1] dark:hover:bg-[#252320]'}`}
                                        >
                                            {chap}
                                        </button>
                                    ))}
                                </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center gap-2 relative">
                {props.book && (
                    <ShareButton bookId={props.book.id} bookName={props.book.name} chapter={props.chapter} />
                )}
                <div className="relative">
                    <button
                        ref={optionsBtnRef}
                        onClick={props.onToggleOptions}
                        aria-label="Opciones de lectura"
                        aria-haspopup="dialog"
                        aria-expanded={props.isOptionsOpen}
                        className={`p-2 border-2 border-[#141413] dark:border-[#EDE9E1] transition-all outline-none h-fit shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#EDE9E1] active:translate-y-0.5 active:shadow-none ${props.isOptionsOpen ? 'bg-[#FFD600] text-black' : 'bg-[#FAF9F5] dark:bg-[#1F1E1B] hover:bg-[#F5F0E8] dark:hover:bg-[#252320]'}`}
                    >
                        <MoreVertical className="w-6 h-6" strokeWidth={2.5} />
                    </button>

                    <OptionsMenu
                        isOpen={props.isOptionsOpen}
                        isMuted={props.isMuted}
                        currentSpeed={props.currentSpeed}
                        onToggleMute={props.onToggleMute}
                        onSetSpeed={props.onSetSpeed}
                        onShowInfo={props.onShowInfo}
                        onRestart={props.onRestart}
                        onClose={props.onCloseOptions}
                    />
                </div>
            </div>
        </header>
    );
};
