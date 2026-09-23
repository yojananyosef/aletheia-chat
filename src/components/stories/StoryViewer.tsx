'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useDismissOnEscape } from '../../hooks/useDismissOnEscape';
import { ShareButton } from '../chat/ShareButton';
import type { Story } from '../../hooks/useStories';

interface StoryViewerProps {
    stories: Story[];
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
    /** Solo tests: duración del auto-avance. */
    durationMs?: number;
}

/** Visor fullscreen estilo stories: tap avanza, X/Escape cierra. */
export const StoryViewer: React.FC<StoryViewerProps> = ({
    stories,
    index,
    onIndexChange,
    onClose,
    durationMs = 6000,
}) => {
    const story = stories[index];
    const [cycle, setCycle] = useState(0);
    useDismissOnEscape(true, onClose);

    // Auto-avance con reinicio por historia.
    useEffect(() => {
        if (!story) return;
        const id = setTimeout(() => {
            if (index + 1 < stories.length) {
                onIndexChange(index + 1);
                setCycle((c) => c + 1);
            } else {
                onClose();
            }
        }, durationMs);
        return () => clearTimeout(id);
    }, [story, index, stories.length, durationMs, onIndexChange, onClose, cycle]);

    if (!story) return null;

    const go = (dir: 1 | -1) => {
        const next = index + dir;
        if (next < 0 || next >= stories.length) {
            onClose();
            return;
        }
        onIndexChange(next);
        setCycle((c) => c + 1);
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Historia: ${story.title}`}
                className="relative w-full max-w-md bg-[#FFD600] text-black border-[3px] border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 pt-5 flex flex-col min-h-[60vh]"
            >
                {/* Progreso por historia */}
                <div className="flex gap-1.5 mb-5" aria-hidden="true">
                    {stories.map((s, i) => (
                        <div key={s.id} className="flex-1 h-1.5 bg-black/20 overflow-hidden">
                            {i < index && <div className="h-full w-full bg-black" />}
                            {i === index && (
                                <div
                                    key={cycle}
                                    className="h-full bg-black origin-left"
                                    style={{ animation: `story-progress ${durationMs}ms linear forwards` }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{story.eyebrow}</p>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">{story.title}</h2>
                <p className="text-lg font-medium leading-relaxed flex-1">&ldquo;{story.text}&rdquo;</p>

                <div className="flex items-center justify-between mt-6 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        Aletheia Chat
                    </span>
                    <div className="flex items-center gap-2">
                        {story.ref && (
                            <ShareButton
                                bookId={story.ref.bookId}
                                bookName={story.ref.bookName}
                                chapter={story.ref.chapter}
                            />
                        )}
                        <button
                            onClick={onClose}
                            autoFocus
                            aria-label="Cerrar historias"
                            className="p-2 border-2 border-[#141413] dark:border-[#EDE9E1] bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1] hover:bg-black hover:text-[#EDE9E1] dark:hover:bg-[#EDE9E1] dark:hover:text-black transition-all shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#EDE9E1] active:translate-y-0.5 active:shadow-none"
                        >
                            <X className="w-6 h-6" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Zonas tap: atrás / adelante (bajo los botones de acción) */}
                <button
                    aria-label="Historia anterior"
                    onClick={() => go(-1)}
                    className="absolute inset-y-0 left-0 w-1/4 z-0 outline-none"
                />
                <button
                    aria-label="Historia siguiente"
                    onClick={() => go(1)}
                    className="absolute inset-y-0 right-0 w-1/4 z-0 outline-none"
                />
            </div>
            <style>{`@keyframes story-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
        </div>
    );
};
