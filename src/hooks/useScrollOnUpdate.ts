import { useCallback, useEffect, useState, RefObject } from 'react';

const NEAR_BOTTOM_THRESHOLD = 160;
const FAR_FROM_BOTTOM = 600;

export const useScrollOnUpdate = (
    ref: RefObject<HTMLElement | null>,
    dependencies: unknown[]
) => {
    const [isFarFromBottom, setIsFarFromBottom] = useState(false);

    const checkDistance = useCallback(() => {
        const element = ref.current;
        if (!element) return;
        const distanceToBottom =
            element.scrollHeight - element.scrollTop - element.clientHeight;
        setIsFarFromBottom(distanceToBottom > FAR_FROM_BOTTOM);
    }, [ref]);

    const scrollToBottom = useCallback(
        (smooth = true) => {
            ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
            setIsFarFromBottom(false);
        },
        [ref]
    );

    useEffect(() => {
        const onScroll = () => checkDistance();
        const element = ref.current;
        element?.addEventListener('scroll', onScroll, { passive: true });
        return () => element?.removeEventListener('scroll', onScroll);
    }, [ref, checkDistance]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const frame = requestAnimationFrame(() => {
            const distanceToBottom =
                element.scrollHeight - element.scrollTop - element.clientHeight;
            setIsFarFromBottom(distanceToBottom > FAR_FROM_BOTTOM);
            if (distanceToBottom > NEAR_BOTTOM_THRESHOLD) return;
            element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
        });

        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { isFarFromBottom, scrollToBottom };
};
