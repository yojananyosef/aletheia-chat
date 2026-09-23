'use client';

import React from 'react';
import { Flame, Heart, Sparkles } from 'lucide-react';
import type { Story } from '../../hooks/useStories';

interface StoriesRowProps {
    stories: Story[];
    onOpen: (index: number) => void;
}

const ICONS: Record<string, React.ReactNode> = {
    'versiculo-del-dia': <Sparkles className="w-6 h-6" strokeWidth={2.5} />,
    racha: <Flame className="w-6 h-6" strokeWidth={2.5} />,
};

export const StoriesRow: React.FC<StoriesRowProps> = ({ stories, onOpen }) => {
    if (stories.length === 0) return null;
    return (
        <div className="border-b-2 border-[#141413]/10 dark:border-[#EDE9E1]/15 bg-[#FAF9F5] px-4 py-3 dark:bg-[#181715]">
            <div className="flex gap-4 overflow-x-auto no-scrollbar" role="list" aria-label="Historias">
                {stories.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => onOpen(i)}
                        aria-label={`Historia: ${s.title}`}
                        className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition-transform outline-none"
                    >
                        <span className="rounded-full border-[3px] border-[#FFD600] bg-black dark:bg-[#0A0A0A] p-1">
                            <span className="rounded-full bg-[#FFD600] text-black w-12 h-12 flex items-center justify-center border-2 border-black dark:border-[#141413]">
                                {ICONS[s.id] ?? <Heart className="w-6 h-6" strokeWidth={2.5} />}
                            </span>
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] max-w-[72px] truncate text-[#141413] dark:text-[#EDE9E1]">
                            {s.eyebrow}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
