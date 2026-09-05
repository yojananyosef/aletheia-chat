'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ShieldCheck, MessageSquare, ArrowDown } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import { useBibleChat } from '../hooks/useBibleChat';
import { useScrollOnUpdate } from '../hooks/useScrollOnUpdate';
import { useFavoritesToggle } from '../hooks/useFavoritesToggle';
import { useUIState } from '../context/UIStateContext';
import { useSettings, useAudio } from '../hooks/useSettings';
import { BibleDataService } from '../core/services/BibleDataService';
import { StorageService } from '../core/services/StorageService';

import { BIBLE_BOOKS } from '../constants/books';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageBubble } from '../components/chat/MessageBubble';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { InputBar } from '../components/chat/InputBar';
import { GroupInfoDrawer } from '../components/chat/GroupInfoDrawer';
import { Message } from '../core/domain/Message';

interface ChatViewProps {
    bookId: string;
    chapter: number;
}

export const ChatView: React.FC<ChatViewProps> = ({ bookId, chapter }) => {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const { isMuted, setIsMuted, readingSpeed, setReadingSpeed } = useSettings();
    const { playPop } = useAudio(isMuted);

    const { isFavorite, toggleFavorite } = useFavoritesToggle();
    const { showInfo, setShowInfo } = useUIState();

    const [showSelector, setShowSelector] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const bookConfig = BIBLE_BOOKS.find(b => b.id === bookId);

    // Remember the last visited chapter for the Home list
    useEffect(() => {
        StorageService.setLastChapter(bookId, chapter);
    }, [bookId, chapter]);

    const onMessageNext = useCallback((msg: Message) => {
        if (!msg.isTitle() && msg.speaker !== 'Narrador') playPop();
    }, [playPop]);

    const {
        data, currentIndex, isAdvancing, error, visibleMessages,
        nextMessage, canAdvanceManually, handleManualNext, restartChapter
    } = useBibleChat({
        book: bookId,
        chapter: chapter,
        speed: readingSpeed,
        isActive: true,
        loadChapterService: BibleDataService.loadChapter,
        onMessageUpdate: onMessageNext
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const { isFarFromBottom, scrollToBottom } = useScrollOnUpdate(scrollRef, [currentIndex, isAdvancing]);

    const isMessageLiked = (msgId: string) => isFavorite(bookId, msgId);

    const handleToggleLike = (id: string, overrideBookId?: string) => {
        const targetBookId = overrideBookId || bookId;
        const msgInstance = data?.messages.find(m => m.id === id);
        if (!msgInstance || !bookConfig) {
            // Sin datos del mensaje solo se puede borrar (el Drawer pasa el fav completo).
            toggleFavorite(id, targetBookId);
            return;
        }
        toggleFavorite(id, targetBookId, {
            ...msgInstance.toJSON(),
            bookName: bookConfig.name,
            chapter: chapter
        });
    };

    const navigateToChapter = (targetChapter: number) => {
        if (targetChapter === chapter) return;
        setIsNavigating(true);
        // No se borra el progreso del destino: al volver se reanuda (solo
        // restartChapter explícito limpia). Ver spec robustness-perf Fase 2.
        router.push(`/${bookId}/${targetChapter}`);
    };

    const handleNextChapter = () => {
        const nextIdx = bookConfig ? bookConfig.availableChapters.indexOf(chapter) + 1 : -1;
        if (bookConfig && nextIdx >= 0 && nextIdx < bookConfig.availableChapters.length) {
            navigateToChapter(bookConfig.availableChapters[nextIdx]);
        } else {
            router.push('/');
        }
    };

    const lastSectionTitle = visibleMessages.slice().reverse().find(m => m.isTitle());
    const subtitle = lastSectionTitle ? lastSectionTitle.text : (data?.title || '');

    return (
        <div className="h-full w-full bg-white overflow-hidden font-sans">
            <main data-viewport-scope="chat" className="w-full flex flex-col h-full relative overflow-hidden">
                <ChatHeader
                    book={bookConfig} chapter={chapter} subtitle={subtitle}
                    onBack={() => router.push('/')}
                    onToggleSelector={() => setShowSelector(!showSelector)} onCloseSelector={() => setShowSelector(false)} isSelectorOpen={showSelector}
                    onSelectChapter={navigateToChapter}
                    isMuted={isMuted} currentSpeed={readingSpeed}
                    onToggleMute={() => setIsMuted(!isMuted)} onSetSpeed={setReadingSpeed}
                    onShowInfo={() => setShowInfo(true)} onRestart={restartChapter}
                    isOptionsOpen={showOptions} onToggleOptions={() => setShowOptions(!showOptions)}
                    onCloseOptions={() => setShowOptions(false)}
                />

                <section ref={scrollRef} data-testid="chat-feed" className="chat-feed flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-white space-y-10 sm:space-y-12 scroll-smooth pb-32 no-scrollbar">
                    {error ? (
                        <div className="py-20 flex flex-col items-center opacity-40 italic">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-black uppercase text-xs">{error}</p>
                        </div>
                    ) : (data) ? (
                        <>
                            {chapter === 1 && (
                                <div className="flex flex-col items-center gap-2 mb-8 opacity-50 px-4">
                                    <div className="flex items-center gap-2 bg-gray-100 border-2 border-black/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full"><ShieldCheck className="w-3 h-3" /> Grupo creado hace eones por el Espíritu Santo</div>
                                    <div className="flex items-center gap-2 bg-gray-100 border-2 border-black/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full"><MessageSquare className="w-3 h-3" /> Has ingresado al grupo de {bookConfig?.name}</div>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {visibleMessages.map(msg => (
                                    <MessageBubble
                                        key={msg.id} message={msg}
                                        isLiked={isMessageLiked(msg.id)}
                                        onToggleLike={handleToggleLike}
                                    />
                                ))}
                            </AnimatePresence>

                            {nextMessage && isAdvancing && nextMessage.speaker === 'Narrador' && (
                                <TypingIndicator speaker={nextMessage.speaker} isGod={false} />
                            )}
                        </>
                    ) : isNavigating ? (
                        <div className="py-20 flex flex-col items-center opacity-40">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-black uppercase text-xs">ABRIENDO CAPÍTULO...</p>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center opacity-40">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-black uppercase text-xs">SYNCHRONIZING REVELATION...</p>
                        </div>
                    )}
                </section>

                {isFarFromBottom && (
                    <button
                        onClick={() => scrollToBottom()}
                        aria-label="Ir al último mensaje"
                        data-testid="scroll-down"
                        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 bg-black text-[#FFD600] border-2 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-[3px_3px_0_rgba(0,0,0,0.3)] active:scale-90 transition-all"
                    >
                        <ArrowDown className="w-6 h-6" strokeWidth={3} />
                    </button>
                )}

                <div className="absolute bottom-0 left-0 right-0 sm:relative">
                    <InputBar
                        nextMessage={nextMessage} isAdvancing={isAdvancing} isNextUser={canAdvanceManually}
                        isComplete={!nextMessage && (currentIndex >= 0) && !!data && !isNavigating} error={error}
                        onManualNext={handleManualNext} onNextChapter={handleNextChapter} onGoHome={() => router.push('/')}
                    />
                </div>

                <GroupInfoDrawer isOpen={showInfo} book={bookConfig} onClose={() => setShowInfo(false)} />
            </main>
        </div>
    );
};
