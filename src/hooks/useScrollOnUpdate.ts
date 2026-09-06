import { useCallback, useEffect, useRef, useState, RefObject } from 'react';

const NEAR_BOTTOM_THRESHOLD = 160;
const FAR_FROM_BOTTOM = 600;
// Los scrolls programáticos disparan eventos 'scroll': se ignoran durante la ventana de animación.
const PROGRAMMATIC_SCROLL_WINDOW_MS = 700;

export const useScrollOnUpdate = (
    ref: RefObject<HTMLElement | null>,
    dependencies: unknown[]
) => {
    // Modo "seguir narración": el viewport acompaña cada mensaje nuevo.
    // Se desactiva solo si el usuario hace scroll manual hacia arriba;
    // volver al fondo (o pulsar el botón ↓) lo reactiva.
    const [follow, setFollow] = useState(true);
    const [isFarFromBottom, setIsFarFromBottom] = useState(false);
    const programmaticUntil = useRef(0);
    const firstRun = useRef(true);

    const scrollToBottom = useCallback(
        (smooth = true) => {
            const element = ref.current;
            if (!element) return;
            programmaticUntil.current = Date.now() + PROGRAMMATIC_SCROLL_WINDOW_MS;
            element.scrollTo({ top: element.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
            setFollow(true);
            setIsFarFromBottom(false);
        },
        [ref]
    );

    useEffect(() => {
        const onScroll = () => {
            if (Date.now() < programmaticUntil.current) return;
            const element = ref.current;
            if (!element) return;
            const distanceToBottom =
                element.scrollHeight - element.scrollTop - element.clientHeight;
            setIsFarFromBottom(distanceToBottom > FAR_FROM_BOTTOM);
            // Solo el gesto manual del usuario cambia el modo follow.
            setFollow(distanceToBottom <= NEAR_BOTTOM_THRESHOLD);
        };
        const element = ref.current;
        element?.addEventListener('scroll', onScroll, { passive: true });
        return () => element?.removeEventListener('scroll', onScroll);
    }, [ref]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const frame = requestAnimationFrame(() => {
            const distanceToBottom =
                element.scrollHeight - element.scrollTop - element.clientHeight;
            setIsFarFromBottom(distanceToBottom > FAR_FROM_BOTTOM);
            if (!follow) return;
            // Al montar/reanudar con mucho contenido acumulado, salto instantáneo;
            // en avance normal, desplazamiento suave.
            const instant = firstRun.current;
            firstRun.current = false;
            programmaticUntil.current = Date.now() + PROGRAMMATIC_SCROLL_WINDOW_MS;
            element.scrollTo({ top: element.scrollHeight, behavior: instant ? 'auto' : 'smooth' });
        });

        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { isFarFromBottom, scrollToBottom };
};
