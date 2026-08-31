import { useState, useEffect } from 'react';
import { Message } from '../core/domain/Message';
import { ValidChapterData } from '../core/services/BibleDataService';
import { StorageService } from '../core/services/StorageService';

export interface UseBibleChatProps {
    book: string;
    chapter: number;
    speed: number;
    isActive: boolean;
    loadChapterService: (bookId: string, chapter: number) => Promise<ValidChapterData>;
    onMessageUpdate?: (msg: Message) => void;
}

export const useBibleChat = ({
    book,
    chapter,
    speed,
    isActive,
    loadChapterService,
    onMessageUpdate
}: UseBibleChatProps) => {
    const [data, setData] = useState<ValidChapterData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when the book/chapter route changes (render-time adjustment)
    const chapterKey = `${book}:${chapter}`;
    const [loadedKey, setLoadedKey] = useState(chapterKey);
    if (loadedKey !== chapterKey) {
        setLoadedKey(chapterKey);
        setData(null);
        setCurrentIndex(-1);
        setIsAdvancing(false);
        setError(null);
    }

    // Persist progress whenever it changes
    useEffect(() => {
        if (currentIndex >= 0) {
            StorageService.setProgress(book, chapter, currentIndex);
        }
    }, [book, chapter, currentIndex]);

    // Initial Fetch — runs when book or chapter changes
    useEffect(() => {
        let cancelled = false;

        loadChapterService(book, chapter)
            .then(json => {
                if (cancelled) return;
                setData(json);

                // Check if we have saved progress for this book+chapter
                const savedProgress = StorageService.getProgress(book, chapter);

                if (savedProgress !== null && savedProgress < json.messages.length) {
                    // Resume from saved position
                    setCurrentIndex(savedProgress);
                } else {
                    // Fresh start — check if the first message needs manual send
                    const firstMsg = json.messages[0];
                    const needsManualStart = firstMsg && (firstMsg.isHuman() || firstMsg.isTitle());
                    setCurrentIndex(needsManualStart ? -1 : 0);
                }
            })
            .catch(err => {
                if (!cancelled) setError(err.message);
            });

        return () => {
            cancelled = true;
        };
    }, [book, chapter, loadChapterService]);

    const visibleMessages = data ? data.messages.slice(0, currentIndex + 1) : [];
    const nextMessage = data && (currentIndex + 1 < data.messages.length) ? data.messages[currentIndex + 1] : null;

    // Domain behavior rules
    const canAdvanceManually = nextMessage ? (nextMessage.isHuman() || nextMessage.isTitle()) : false;

    // Auto-Advance Logic
    useEffect(() => {
        if (!isActive || !nextMessage || canAdvanceManually || !data) return;

        let isMounted = true;
        const autoAdvance = async () => {
            if (!isMounted) return;

            setIsAdvancing(true);
            const currentMessage = currentIndex >= 0 ? data.messages[currentIndex] : null;

            const charTimeReading = 80 * speed;
            const charTimeTyping = 60 * speed;
            const readingFloor = 2500 * speed;
            const typingFloor = 2000 * speed;

            const readingTime = currentMessage ? Math.max(currentMessage.text.length * charTimeReading, readingFloor) : (2000 * speed);
            const typingTime = Math.max(nextMessage.text.length * charTimeTyping, typingFloor);

            let delay = 0;
            if (nextMessage.speaker === 'Narrador') {
                delay = readingTime + (1000 * speed);
            } else if (nextMessage.isTitle()) {
                delay = readingTime * 0.5;
            } else {
                delay = typingTime + (readingTime * 0.2 * speed);
            }

            const maxDelay = Math.max(15000 * speed, 4000);
            delay = Math.min(delay, maxDelay);

            await new Promise(r => setTimeout(r, delay));

            if (isMounted && isActive) {
                setCurrentIndex(prev => prev + 1);
                setIsAdvancing(false);
                if (onMessageUpdate) onMessageUpdate(nextMessage);
            }
        };

        autoAdvance();
        return () => { isMounted = false; setIsAdvancing(false); };
    }, [nextMessage, canAdvanceManually, currentIndex, data, speed, isActive, onMessageUpdate]);

    const handleManualNext = () => {
        if (!nextMessage || isAdvancing || !canAdvanceManually || !data) return;
        setCurrentIndex(prev => prev + 1);
        if (onMessageUpdate) onMessageUpdate(nextMessage);
    };

    const restartChapter = () => {
        if (!data) return;
        const firstMsg = data.messages[0];
        const needsManualStart = firstMsg && (firstMsg.isHuman() || firstMsg.isTitle());
        setCurrentIndex(needsManualStart ? -1 : 0);
        setIsAdvancing(false);
        // Clear saved progress
        StorageService.clearProgress(book, chapter);
    };

    return {
        data,
        currentIndex,
        isAdvancing,
        error,
        visibleMessages,
        nextMessage,
        canAdvanceManually,
        handleManualNext,
        restartChapter
    };
};
