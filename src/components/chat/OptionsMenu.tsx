import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Volume2, VolumeX, RotateCcw, Zap, Eye, Settings2, Activity } from 'lucide-react';
import { READING_SPEEDS } from '../../constants/books';
import { useDismissOnEscape } from '../../hooks/useDismissOnEscape';

interface OptionsMenuProps {
    isOpen: boolean;
    isMuted: boolean;
    currentSpeed: number;
    onToggleMute: () => void;
    onSetSpeed: (speed: number) => void;
    onShowInfo: () => void;
    onRestart: () => void;
    onClose: () => void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
    isOpen, isMuted, currentSpeed, onToggleMute, onSetSpeed, onShowInfo, onRestart, onClose
}) => {
    useDismissOnEscape(isOpen, onClose);
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    role="dialog"
                    aria-label="Ajustes de Revelación"
                    className="absolute top-[120%] right-0 w-72 bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1] border-2 border-[#141413] dark:border-[#EDE9E1] shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] z-[100] overflow-hidden"
                >
                    {/* Header del Menú */}
                    <div className="bg-black dark:bg-[#0A0A0A] text-[#EDE9E1] p-3 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-[#FFD600]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ajustes de Revelación</span>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {/* Opción: Info del Grupo */}
                        <MenuButton onClick={onShowInfo} icon={<Info className="w-4 h-4" />} autoFocus>
                            Información del Grupo
                        </MenuButton>

                        {/* Opción: Silenciar */}
                        <MenuButton onClick={onToggleMute} icon={isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}>
                            <div className="flex items-center justify-between w-full">
                                <span>{isMuted ? 'Sonido: Desactivado' : 'Sonido: Activado'}</span>
                                <div className={`w-10 h-5 border-2 border-[#141413] dark:border-[#EDE9E1] relative transition-colors ${isMuted ? 'bg-[#EFE9DE] dark:bg-black' : 'bg-[#FFD600]'}`}>
                                    <div className={`absolute top-[1px] bottom-[1px] w-4 bg-[#141413] transition-all dark:bg-[#EDE9E1] ${isMuted ? 'left-[1px]' : 'left-[calc(100%-17px)]'}`} />
                                </div>
                            </div>
                        </MenuButton>

                        {/* Selector de Velocidad */}
                        <div className="mt-2 mb-1 border-t-2 border-[#141413] dark:border-[#EDE9E1] pt-3 px-1">
                            <span className="text-[9px] font-black text-[#57534E] block mb-3 tracking-widest uppercase flex items-center gap-2 dark:text-[#A8A29E]">
                                <Zap className="w-3 h-3" /> Motor de Lectura
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                                {READING_SPEEDS.map(s => {
                                    const Icon = s.label === 'Zen' ? Eye : s.label === 'Norm' ? Activity : Zap;
                                    return (
                                        <button
                                            key={s.label}
                                            onClick={() => onSetSpeed(s.multiplier)}
                                            className={`
                                                flex flex-col items-center justify-center p-2 border-2 transition-all font-black text-[9px] uppercase tracking-tight
                                                ${currentSpeed === s.multiplier
                                                    ? 'bg-[#FFD600] border-[#141413] dark:border-[#EDE9E1] text-[#141413] shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#000] -translate-y-0.5'
                                                    : 'border-transparent hover:border-[#141413] bg-[#EFE9DE] dark:bg-black text-[#57534E] dark:text-[#A8A29E] dark:hover:border-[#EDE9E1]'
                                                }
                                            `}
                                        >
                                            <Icon className="w-4 h-4 mb-1" />
                                            {s.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Zona de Peligro */}
                        <div className="mt-2 border-t-2 border-[#141413] dark:border-[#EDE9E1] pb-1">
                            <button
                                onClick={onRestart}
                                className="w-full mt-2 p-3 flex items-center gap-3 hover:bg-black hover:text-[#EDE9E1] dark:hover:bg-[#EDE9E1] dark:hover:text-black text-red-600 dark:text-red-400 font-black text-[10px] uppercase tracking-widest transition-all active:translate-y-0.5"
                            >
                                <RotateCcw className="w-4 h-4" /> REINICIAR CAPÍTULO
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const MenuButton: React.FC<{ onClick: () => void, icon: React.ReactNode, children: React.ReactNode, autoFocus?: boolean }> = ({ onClick, icon, children, autoFocus }) => (
    <button
        onClick={onClick}
        autoFocus={autoFocus}
        className="w-full p-3 flex items-center gap-4 hover:bg-[#F5F0E8] dark:hover:bg-[#252320] font-black text-[11px] uppercase tracking-wider transition-colors active:bg-[#FFD600] active:text-black border-2 border-transparent hover:border-[#141413] dark:hover:border-[#EDE9E1] dark:active:text-black"
    >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 text-left">{children}</span>
    </button>
);
