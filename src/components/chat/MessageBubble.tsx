import React, { useRef } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../../core/domain/Message';
import { Avatar, Surface } from '../ui/Surface';

interface MessageBubbleProps {
    message: Message;
    isLiked: boolean;
    onToggleLike: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLiked, onToggleLike }) => {
    const lastTap = useRef<number>(0);

    const isGod = message.speaker === 'Dios';
    const isNarrator = message.speaker === 'Narrador';
    const isSerpent = message.speaker === 'Serpiente';
    const actorColor = "bg-[#EFE9DE] dark:bg-[#252320]";

    const handleInteraction = (e?: React.MouseEvent) => {
        const now = Date.now();
        const timeSince = now - lastTap.current;

        if (timeSince < 300 && timeSince > 0) {
            onToggleLike(message.id);
            if (e && e.cancelable) e.preventDefault();
        }
        lastTap.current = now;
    };

    if (message.isSectionTitle) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center my-12 overflow-visible">
                <Surface dataAida="attention" dataCta="primary" className="inline-block px-6 py-2 text-xs font-black uppercase tracking-widest overflow-visible">
                    {message.text}
                </Surface>
            </motion.div>
        );
    }

    if (isNarrator) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center overflow-visible"
                onClick={handleInteraction}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInteraction(); } }}
                role="button"
                tabIndex={0}
                aria-pressed={isLiked}
                aria-label={`Versículo ${message.verse}. Doble Enter para ${isLiked ? 'quitar de' : 'añadir a'} favoritos`}
            >
                <div className="group cursor-pointer max-w-2xl bg-[#EFE9DE] dark:bg-[#1F1E1B] border-2 border-dashed border-[#141413] dark:border-white/25 p-6 text-center relative font-medium text-[#3D3D3A] dark:text-[#D8D5CD] leading-relaxed transition-colors hover:bg-[#FAF9F5] dark:hover:bg-[#252320] active:bg-[#FAF9F5] dark:active:bg-[#252320] shadow-[3px_3px_0_rgba(20,20,19,0.08)] dark:shadow-[3px_3px_0_rgba(0,0,0,0.4)] overflow-visible">
                    <span className="text-[10px] font-black text-[#57534E] dark:text-[#A8A29E] block mb-2 uppercase tracking-widest">v.{message.verse} NARRADOR</span>
                    {message.text}
                    <LikeBadge isLiked={isLiked} position="bottom-right" />
                </div>
            </motion.div>
        );
    }

    // ── Serpiente: inversa de Dios — solid, matte ──
    if (isSerpent) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-end w-full overflow-visible"
            >
                <div className="flex items-end gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] flex-row-reverse overflow-visible">
                    <Avatar
                        letter="🐍"
                        color="bg-[#1A0A0A]"
                        size="md"
                        borderColor="border-[#4A0000]"
                    />
                    <div
                        onClick={handleInteraction}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInteraction(); } }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isLiked}
                        aria-label={`Mensaje de ${message.speaker}, versículo ${message.verse}. Doble Enter para ${isLiked ? 'quitar de' : 'añadir a'} favoritos`}
                        className="p-5 md:p-7 relative border-2 border-[#4A0000] rounded-l-lg rounded-tr-lg overflow-visible bg-[#1A0A0A] shadow-[5px_5px_0_#4A0000] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <div className="flex justify-between gap-8 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">
                                {message.speaker}
                            </span>
                            <span className="text-[10px] font-bold text-red-900">v.{message.verse}</span>
                        </div>
                        <p className="text-base md:text-xl lg:text-2xl leading-relaxed font-medium text-red-100 italic">
                            {message.text}
                        </p>
                        <LikeBadge isLiked={isLiked} position="bottom-left" />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: isGod ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex flex-col ${isGod ? 'items-start' : 'items-end'} w-full overflow-visible`}
        >
            <div className={`flex items-end gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] overflow-visible ${isGod ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar
                    letter={message.speaker?.[0] || '?'}
                    color={isGod ? "bg-[#FFD600]" : actorColor}
                    size="md"
                />
                <Surface
                    onClick={handleInteraction}
                    pressed={isLiked}
                    ariaLabel={`Mensaje de ${message.speaker}, versículo ${message.verse}. Doble Enter para ${isLiked ? 'quitar de' : 'añadir a'} favoritos`}
                    className={`p-5 md:p-7 relative border-2 border-[#141413] dark:border-white/20 shadow-[5px_5px_0_#141413] dark:shadow-[5px_5px_0_#000] overflow-visible ${isGod
                        ? 'bg-[#FAF9F5] dark:bg-[#252320] rounded-r-lg rounded-tl-lg'
                        : `${actorColor} rounded-l-lg rounded-tr-lg`
                        }`}
                >
                    <div className="flex justify-between gap-8 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${isGod ? 'text-black dark:text-[#FFD600]' : 'text-[#57534E] dark:text-[#A8A29E]'}`}>
                            {message.speaker}
                        </span>
                        <span className="text-[10px] font-bold text-[#57534E] dark:text-[#A8A29E]">v.{message.verse}</span>
                    </div>
                    <p className={`text-base md:text-xl lg:text-2xl leading-relaxed ${isGod ? 'font-black text-[#141413] dark:text-[#EDE9E1]' : 'font-medium text-[#3D3D3A] dark:text-[#D8D5CD]'}`}>
                        {message.text}
                    </p>
                    <LikeBadge isLiked={isLiked} position={isGod ? "bottom-right" : "bottom-left"} />
                </Surface>
            </div>
        </motion.div>
    );
};

const LikeBadge: React.FC<{ isLiked: boolean, position: 'bottom-right' | 'bottom-left' }> = ({ isLiked, position }) => (
    <AnimatePresence>
        {isLiked && (
            <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                className={`absolute -bottom-3 ${position === 'bottom-right' ? '-right-3' : '-left-3'} bg-red-500 text-[#FAF9F5] rounded-full p-2 border-2 border-[#141413] dark:border-[#EDE9E1] shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#EDE9E1] z-20 pointer-events-none select-none`}
            >
                <Heart className="w-4 h-4 fill-current shadow-lg" />
            </motion.div>
        )}
    </AnimatePresence>
);
