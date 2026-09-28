import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cardFilename, shareImage, downloadBlob, drawShareCard, type ShareCardSpec } from './shareCard';

function fakeNav(patch: Partial<Navigator>) {
    Object.defineProperty(window.navigator, 'share', { value: patch.share, configurable: true, writable: true });
    Object.defineProperty(window.navigator, 'canShare', { value: patch.canShare, configurable: true, writable: true });
}

const BLOB = new Blob(['x'], { type: 'image/png' });

beforeEach(() => {
    Object.defineProperty(window.navigator, 'share', { value: undefined, configurable: true, writable: true });
    Object.defineProperty(window.navigator, 'canShare', { value: undefined, configurable: true, writable: true });
    vi.restoreAllMocks();
});

describe('cardFilename', () => {
    it('slug legible sin acentos', () => {
        expect(cardFilename('Génesis 1:3')).toBe('genesis-1-3.png');
        expect(cardFilename('1 Corintios 13:4')).toBe('1-corintios-13-4.png');
        expect(cardFilename('Apocalipsis  «»')).toBe('apocalipsis.png');
    });

    it('nunca devuelve un nombre vacío', () => {
        expect(cardFilename('«»')).toBe('versiculo.png');
    });
});

describe('shareImage', () => {
    it('usa la Web Share API cuando acepta archivos', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        fakeNav({ share, canShare: vi.fn().mockReturnValue(true) });
        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        await expect(shareImage(BLOB, 'a.png', 'A')).resolves.toBe('shared');
        expect(share).toHaveBeenCalledOnce();
        expect(share.mock.calls[0]![0].files?.[0]).toBeInstanceOf(File);
    });

    it('cae a descarga si canShare rechaza el archivo', async () => {
        const share = vi.fn();
        fakeNav({ share, canShare: vi.fn().mockReturnValue(false) });
        const dl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        await expect(shareImage(BLOB, 'a.png', 'A')).resolves.toBe('downloaded');
        expect(share).not.toHaveBeenCalled();
        expect(dl).toHaveBeenCalled();
    });

    it('silencio si el usuario aborta (AbortError), sin descargar', async () => {
        fakeNav({
            share: vi.fn().mockRejectedValue(new DOMException('cancelado', 'AbortError')),
            canShare: vi.fn().mockReturnValue(true),
        });
        const dl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        await expect(shareImage(BLOB, 'a.png', 'A')).resolves.toBe('cancelled');
        expect(dl).not.toHaveBeenCalled();
    });

    it('descarga si share falla por otro motivo (p. ej. sin gesto de usuario)', async () => {
        fakeNav({
            share: vi.fn().mockRejectedValue(new DOMException('sin gesto', 'NotAllowedError')),
            canShare: vi.fn().mockReturnValue(true),
        });
        const dl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        await expect(shareImage(BLOB, 'a.png', 'A')).resolves.toBe('downloaded');
        expect(dl).toHaveBeenCalled();
    });

    it('entrega la imagen aunque el navegador no comparta nada', async () => {
        // Firefox desktop y similares: sin share ni canShare. Antes devolvía
        // 'unsupported' y se negaba a entregar el PNG.
        fakeNav({});
        const dl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        await expect(shareImage(BLOB, 'a.png', 'A')).resolves.toBe('downloaded');
        expect(dl).toHaveBeenCalled();
    });
});

/** Debe coincidir con AVATAR_GUTTER de shareCard (84 + 12). */
const AVATAR_GUTTER_TEST = 96;

describe('drawShareCard', () => {
    /**
     * Dibuja sobre el canvas de jsdom y registra cada `fillText`. jsdom no
     * implementa el contexto 2D, así que se espía `fillStyle`/`fillRect`/
     * `fillText`/`measureText`: lo que interesa no son los píxeles sino QUÉ se
     * pinta, en qué orden y en qué posición (de eso depende que el diálogo no
     * invada la referencia).
     */
    function render(spec: ShareCardSpec) {
        const painted: { t: string; x: number; y: number }[] = [];
        const ctx = {
            canvas: { width: 1080, height: 1350 },
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            font: '',
            textAlign: 'left',
            textBaseline: 'alphabetic',
            globalAlpha: 1,
            save: () => {},
            restore: () => {},
            setLineDash: () => {},
            beginPath: () => {},
            closePath: () => {},
            moveTo: () => {},
            arcTo: () => {},
            arc: () => {},
            stroke: () => {},
            fill: () => {},
            fillRect: () => {},
            strokeRect: () => {},
            roundRect: () => {},
            createPattern: () => null,
            measureText: (t: string) => ({ width: t.length * 18 }),
            fillText: (t: string, x: number, y: number) => {
                // Aislado por tokens: los mensajes llevan "texto@x,y" pero
                // compiten con el hablante y "V.3" si se busca por subcadena.
                painted.push({ t, x: Math.round(x), y: Math.round(y) });
            },
        } as unknown as CanvasRenderingContext2D;
        drawShareCard(ctx, spec, null);
        return { ctx, painted };
    }

    const base: ShareCardSpec = {
        messages: [
            { id: 'g1_3a', speaker: 'Narrador', text: 'Y dijo Dios:', verse: 3 },
            { id: 'g1_3b', speaker: 'Dios', text: 'Sea la luz.', verse: 3 },
            { id: 'g1_3c', speaker: 'Narrador', text: 'Y fue la luz.', verse: 3 },
        ],
        reference: 'Génesis 1:3',
        footer: 'aletheiachat.johan.cl',
    };

    it('pinta hablante, texto y referencia de cada mensaje', () => {
        const { painted } = render(base);
        const t = painted.map((p) => p.t);
        // El narrador se rotula "V.3 NARRADOR" (como en MessageBubble).
        expect(t).toContain('V.3 NARRADOR');
        expect(t).toContain('DIOS');
        expect(t).toContain('Sea la luz.');
        expect(t).toContain('Y fue la luz.');
        expect(t).toContain('Y dijo Dios:');
        expect(t).toContain('Génesis 1:3');
        expect(t).toContain('aletheiachat.johan.cl');
        expect(t).toContain('ALETHEIA');
    });

    it('respeta el orden de lectura: el diálogo va de arriba abajo', () => {
        const { painted } = render(base);
        const y = (texto: string) => painted.find((p) => p.t === texto)!.y;
        expect(y('DIOS')).toBeGreaterThan(y('V.3 NARRADOR'));
        expect(y('Y fue la luz.')).toBeGreaterThan(y('Sea la luz.'));
        // La referencia va por debajo de todo el diálogo.
        expect(y('Génesis 1:3')).toBeGreaterThan(y('Y fue la luz.'));
    });

    it('dibuja TODOS los mensajes, no solo los que caben', () => {
        // Regresión: el reparto por longitud fijaba un tope por burbuja y el
        // conjunto se pasaba de la card, así que se pintaban 3 de 8. Se cuentan
        // los rótulos de versículo, que se dibujan una vez por mensaje.
        const muchos = Array.from({ length: 8 }, (_, i) => ({
            id: `g1_${i + 1}`,
            speaker: i % 2 ? 'Dios' : 'Narrador',
            text: `Mensaje ${i + 1} con longitud ${'contexto '.repeat(3 + i)}para variar el reparto.`,
            verse: i + 1,
        }));
        const { painted } = render({ ...base, messages: muchos });
        const versiculos = new Set(painted.map((p) => p.t).filter((t) => /^V\.\d+/.test(t)));
        expect(versiculos.size).toBe(muchos.length);
    });

    it('respeta el margen del avatar: nada se sale del ancho útil', () => {
        // El avatar vive FUERA de la caja, en el margen izquierdo del chat.
        // Si no se descuenta, la caja se pasa y el avatar se sale de la card.
        const conDios = render({
            ...base,
            messages: [{ id: 'g1_3b', speaker: 'Dios', text: 'Sea la luz.', verse: 3 }],
        });
        const texto = conDios.painted.find((p) => p.t === 'Sea la luz.')!;
        expect(texto.x).toBeGreaterThan(AVATAR_GUTTER_TEST);
        const anchoUtil = 1080 - 2 * 72;
        expect(texto.x).toBeLessThan(anchoUtil);
    });

    it('acota las líneas para no invadir la referencia', () => {
        const largo = Array.from({ length: 14 }, (_, i) => ({
            id: `g1_${i + 1}`,
            speaker: i % 2 ? 'Dios' : 'Narrador',
            text: `Mensaje número ${i + 1} con un texto razonablemente largo para forzar el ajuste de líneas.`,
            verse: i + 1,
        }));
        const { painted } = render({ ...base, messages: largo });
        const refY = painted.find((p) => p.t === 'Génesis 1:3')!.y;
        const pieY = painted.find((p) => p.t === 'aletheiachat.johan.cl')!.y;
        const ultimo = Math.max(
            ...painted
                .filter((p) => p.t !== 'Génesis 1:3' && p.t !== 'aletheiachat.johan.cl' && p.t !== 'ALETHEIA')
                .map((p) => p.y),
        );
        expect(ultimo).toBeLessThan(refY);
        expect(refY).toBeLessThan(pieY);
    });
});

describe('downloadBlob', () => {
    it('pulsa un ancla con download y revoca la URL después', () => {
        vi.useFakeTimers();
        const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
        const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        downloadBlob(BLOB, 'genesis-1-3.png');
        expect(create).toHaveBeenCalledWith(BLOB);
        expect(click).toHaveBeenCalledOnce();
        expect(document.querySelector('a[download]')).toBeNull(); // se quita del DOM
        expect(revoke).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1000);
        expect(revoke).toHaveBeenCalledWith('blob:x');
        vi.useRealTimers();
    });
});
