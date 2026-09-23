import React from 'react';
import { motion } from 'motion/react';
import { Avatar, Surface } from '../ui/Surface';

interface TypingIndicatorProps {
    speaker: string;
    isGod: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ speaker, isGod }) => {
    const isSerpent = speaker === 'Serpiente';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`flex items-end gap-2 md:gap-4 max-w-[85%] ${isGod ? 'flex-row' : 'flex-row-reverse'} mx-2 md:mx-4 w-full mt-4 transition-all duration-300`}
        >
            <Avatar
                letter={isSerpent ? "🐍" : speaker[0]}
                color={isSerpent ? "bg-[#2A0A0A]" : isGod ? "bg-[#FFD600]" : "bg-[#EFE9DE] dark:bg-[#252320]"}
                size="sm"
                borderColor={isSerpent ? "border-red-900" : undefined}
            />
            <Surface className={`p-3 md:p-5 flex flex-col relative ${isSerpent
                ? 'rounded-l-lg rounded-tr-lg !bg-[#1A0A0A] !border-[#4A0000]'
                : isGod
                    ? 'rounded-r-lg rounded-tl-lg'
                    : 'bg-[#EFE9DE] dark:bg-[#252320] rounded-l-lg rounded-tr-lg'
                }`}>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] mb-2 ${isSerpent ? 'text-red-400/90' : 'text-[#57534E] dark:text-[#A8A29E]'}`}>
                    {speaker} ESTÁ ESCRIBIENDO...
                </span>
                <div className="flex gap-1.5 h-3 items-center">
                    {[0, 0.2, 0.4].map(delay => (
                        <motion.div
                            key={delay}
                            className={`w-1.5 h-1.5 rounded-full ${isSerpent ? 'bg-red-600' : 'bg-[#141413] dark:bg-[#EDE9E1]'}`}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay }}
                        />
                    ))}
                </div>
            </Surface>
        </motion.div>
    );
};
