/**
 * Single source de tipos de dominio (Fase 1): todo vive en `src/core/domain/*`
 * y aquí solo se re-exporta para los componentes.
 */
import type { MessageData } from '../core/domain/Message';

export type { Speaker, CanonicalSpeaker, MessageData, FavoriteMessage } from '../core/domain/Message';
export type { BookInfo } from '../core/domain/BookInfo';

export interface ChapterData {
    book: string;
    chapter: number;
    title: string;
    messages: MessageData[];
}
