import React from 'react';
import { Send, BookOpen } from 'lucide-react';
import { Message } from '../../core/domain/Message';

interface InputBarProps {
    nextMessage: Message | null;
    isAdvancing: boolean;
    isNextUser: boolean;
    isComplete: boolean;
    error: string | null;
    onManualNext: () => void;
    onNextChapter: () => void;
    onPrevChapter: () => void;
    hasPrev: boolean;
    onGoHome: () => void;
}

export const InputBar: React.FC<InputBarProps> = (props) => {
    return (
        <div className="border-t-[3px] border-[#141413] dark:border-[#EDE9E1] bg-[#FAF9F5]/95 dark:bg-[#1F1E1B]/95 backdrop-blur-md px-4 py-4 sm:p-6 flex justify-center z-50 shrink-0 h-auto pb-safe transition-all shadow-[0_-4px_10px_rgba(0,0,0,0.05)] select-none">
            <div className="w-full max-w-4xl flex items-center gap-3 h-full min-h-[60px]">
                {!props.error && !props.isComplete ? (
                    !props.nextMessage ? (
                        <div className="flex-1 h-full flex items-center justify-center font-black text-[#8E8B82] dark:text-[#7D7A72] uppercase tracking-[0.2em] text-[9px]">
                            Esperando Revelación...
                        </div>
                    ) : props.nextMessage.isSectionTitle ? (
                        <button
                            onClick={props.onManualNext}
                            className="w-full bg-[#EFE9DE] dark:bg-[#252320] dark:text-[#EDE9E1] text-[#141413] border-2 border-[#141413] dark:border-[#EDE9E1] font-black uppercase text-[11px] md:text-lg shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#EDE9E1] flex items-center justify-center p-3 text-center active:scale-95 transition-all"
                        >
                            <BookOpen className="w-5 h-5 mr-3 hidden md:block" /> {props.nextMessage?.text}
                        </button>
                    ) : props.isNextUser ? (
                        <>
                            <button
                                onClick={props.onManualNext}
                                className={`flex-1 min-h-[56px] border-2 px-4 text-left font-semibold truncate flex flex-col justify-center transition-all overflow-hidden ${props.nextMessage?.speaker === 'Serpiente'
                                    ? 'bg-[#1A0A0A] border-[#4A0000] text-red-100 active:bg-[#250c0c]'
                                    : 'bg-[#EFE9DE] dark:bg-[#252320] border-[#141413] dark:border-[#EDE9E1] text-[#3D3D3A] dark:text-[#D8D5CD] active:bg-[#F5F0E8] dark:active:bg-[#2E2B27]'
                                    }`}
                            >
                                <span className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${props.nextMessage?.speaker === 'Serpiente' ? 'text-red-400' : 'text-[#57534E] dark:text-[#A8A29E]'}`}>{props.nextMessage?.speaker}</span>
                                <span className={`truncate block leading-tight text-sm sm:text-base ${props.nextMessage?.speaker === 'Serpiente' ? 'italic' : ''}`}>{props.nextMessage?.text}</span>
                            </button>
                                <button
                                    onClick={props.onManualNext}
                                    aria-label={`Enviar mensaje de ${props.nextMessage?.speaker ?? 'personaje'}`}
                                    className="bg-[#FFD600] text-[#141413] w-14 h-14 rounded-none flex items-center justify-center border-2 border-[#141413] dark:border-[#EDE9E1] shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#000] active:scale-90 transition-all outline-none shrink-0"
                                >
                                <Send className="w-6 h-6" />
                            </button>
                        </>
                    ) : (
                        <div className={`flex-1 h-full flex items-center justify-center font-black uppercase tracking-[0.2em] italic animate-pulse text-[9px] md:text-sm ${props.nextMessage?.speaker === 'Serpiente' ? 'text-red-500' : 'text-[#57534E] dark:text-[#A8A29E]'
                            }`}>
                            {props.nextMessage?.speaker} ESCRIBIENDO...
                        </div>
                    )
                ) : props.error ? (
                    <button
                        onClick={props.onGoHome}
                        className="w-full py-4 bg-[#FFD600] text-black border-2 border-[#141413] dark:border-[#EDE9E1] font-black uppercase shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] active:scale-95 transition-all"
                    >
                        Regresar a la Selección
                    </button>
                ) : props.isComplete ? (
                    <div className="w-full flex items-center gap-3">
                        {props.hasPrev && (
                            <button
                                onClick={props.onPrevChapter}
                                aria-label="Capítulo anterior"
                                className="py-4 px-4 bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1] text-[#141413] border-[3px] border-[#141413] dark:border-[#EDE9E1] font-black text-base md:text-2xl uppercase shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] flex items-center justify-center active:scale-95 transition-all shrink-0"
                            >
                                ← <span className="hidden md:inline ml-2">Anterior</span>
                            </button>
                        )}
                        <button
                            onClick={props.onNextChapter}
                            className="flex-1 py-4 bg-[#FFD600] text-[#141413] border-[3px] border-[#141413] dark:border-[#EDE9E1] font-black text-base md:text-2xl uppercase shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] flex items-center justify-center active:scale-95 transition-all"
                        >
                            <BookOpen className="w-6 h-6 mr-3" /> Siguiente Capítulo
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
