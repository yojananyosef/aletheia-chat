import { describe, it, expect } from 'vitest';
import { Message } from './Message';

describe('Message (domain)', () => {
    it('identifica actores divinos y sistema como no humanos', () => {
        for (const speaker of ['Dios', 'Narrador', 'Sistema']) {
            const message = new Message({ id: 'm1', speaker, text: 'texto', verse: 1 });
            expect(message.isHuman()).toBe(false);
        }
    });

    it('identifica personajes humanos', () => {
        const message = new Message({ id: 'm2', speaker: 'Adán', text: 'texto', verse: 2 });
        expect(message.isHuman()).toBe(true);
    });

    it('un título de sección nunca es humano', () => {
        const message = new Message({
            id: 'm3', speaker: 'Moisés', text: 'Título', verse: 1, isSectionTitle: true
        });
        expect(message.isTitle()).toBe(true);
        expect(message.isHuman()).toBe(false);
    });

    it('expone getters inmutables y toJSON devuelve los datos', () => {
        const data = { id: 'm4', speaker: 'Dios', text: '¡Que haya luz!', verse: 3 } as const;
        const message = new Message(data);

        expect(message.id).toBe('m4');
        expect(message.speaker).toBe('Dios');
        expect(message.text).toBe('¡Que haya luz!');
        expect(message.verse).toBe(3);
        expect(message.isSectionTitle).toBeUndefined();
        expect(message.toJSON()).toEqual(data);
    });
});
