import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ChapterDataSchema, type ValidatedChapterData } from '../validation/bibleSchemas';

/**
 * SOLO Server Components / build (usa `node:fs`).
 * Lee el JSON del corpus y lo valida con Zod. Devuelve `null` si el
 * capítulo no existe en disco o no valida (el llamador decide el fallback).
 */
export function loadChapterStatic(bookId: string, chapter: number): ValidatedChapterData | null {
    try {
        const raw = readFileSync(join(process.cwd(), 'public', 'data', bookId, `${chapter}.json`), 'utf-8');
        return ChapterDataSchema.parse(JSON.parse(raw));
    } catch {
        return null;
    }
}
