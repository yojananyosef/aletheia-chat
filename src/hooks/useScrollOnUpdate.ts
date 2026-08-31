import { useEffect, RefObject } from 'react';

const NEAR_BOTTOM_THRESHOLD = 160;

export const useScrollOnUpdate = (
    ref: RefObject<HTMLElement | null>,
    dependencies: unknown[]
) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const frame = requestAnimationFrame(() => {
            const distanceToBottom =
                element.scrollHeight - element.scrollTop - element.clientHeight;
            if (distanceToBottom > NEAR_BOTTOM_THRESHOLD) return;
            element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
        });

        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};
