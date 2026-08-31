import { z } from 'zod';
import { FavoriteMessageSchema } from '../validation/bibleSchemas';
import { FavoriteMessage } from '../../types/bible';

export interface NaasSettings {
    isMuted: boolean;
    readingSpeed: number;
}

const VERSION = 'v1';

const Keys = {
    favorites: `naas:${VERSION}:favorites`,
    settings: `naas:${VERSION}:settings`,
    lastChapter: (bookId: string) => `naas:${VERSION}:lastChapter:${bookId}`,
    progress: (book: string, chapter: number) => `naas:${VERSION}:progress:${book}:${chapter}`,
};

// Pre naas:v1 keys — read for lazy migration, never written again.
const LegacyKeys = {
    favorites: 'bible_favorites',
    isMuted: 'isMuted',
    readingSpeed: 'readingSpeedMultiplier',
    lastChapter: (bookId: string) => `lastChapter_${bookId}`,
    progress: (book: string, chapter: number) => `chatProgress_${book}_${chapter}`,
};

const SettingsSchema = z.object({
    isMuted: z.boolean(),
    readingSpeed: z.number().positive(),
});
const FavoritesSchema = z.array(FavoriteMessageSchema);

const FAVORITES_FALLBACK: FavoriteMessage[] = [];
const SETTINGS_FALLBACK: NaasSettings = { isMuted: false, readingSpeed: 1 };

function readRaw(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeRaw(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // Storage full or blocked — persistence is best-effort.
    }
}

function removeRaw(key: string): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem(key);
    } catch {
        // best-effort
    }
}

function parseJson<T>(raw: string | null, schema: z.ZodType<T>, fallback: T): T {
    if (raw === null) return fallback;
    try {
        const result = schema.safeParse(JSON.parse(raw));
        return result.success ? result.data : fallback;
    } catch {
        return fallback;
    }
}

export class StorageService {
    static getFavorites(): FavoriteMessage[] {
        const freshRaw = readRaw(Keys.favorites);
        if (freshRaw !== null) {
            return parseJson(freshRaw, FavoritesSchema, FAVORITES_FALLBACK);
        }

        const legacyRaw = readRaw(LegacyKeys.favorites);
        if (legacyRaw === null) return FAVORITES_FALLBACK;

        const legacy = parseJson(legacyRaw, FavoritesSchema, FAVORITES_FALLBACK);
        if (legacy.length > 0) {
            writeRaw(Keys.favorites, JSON.stringify(legacy));
        }
        return legacy;
    }

    static setFavorites(favorites: FavoriteMessage[]): void {
        writeRaw(Keys.favorites, JSON.stringify(favorites));
    }

    static getSettings(): NaasSettings {
        const freshRaw = readRaw(Keys.settings);
        if (freshRaw !== null) {
            return parseJson(freshRaw, SettingsSchema, SETTINGS_FALLBACK);
        }

        const legacyMuted = readRaw(LegacyKeys.isMuted);
        const legacySpeed = readRaw(LegacyKeys.readingSpeed);
        if (legacyMuted === null && legacySpeed === null) return SETTINGS_FALLBACK;

        const migrated: NaasSettings = {
            isMuted: legacyMuted === 'true',
            readingSpeed: Number(legacySpeed) || SETTINGS_FALLBACK.readingSpeed,
        };
        const validated = SettingsSchema.safeParse(migrated);
        if (validated.success) {
            writeRaw(Keys.settings, JSON.stringify(validated.data));
            return validated.data;
        }
        return SETTINGS_FALLBACK;
    }

    static setSettings(settings: NaasSettings): void {
        writeRaw(Keys.settings, JSON.stringify(settings));
    }

    static getProgress(book: string, chapter: number): number | null {
        const freshRaw = readRaw(Keys.progress(book, chapter));
        if (freshRaw !== null) {
            const value = Number(freshRaw);
            return Number.isFinite(value) ? value : null;
        }

        const legacyRaw = readRaw(LegacyKeys.progress(book, chapter));
        if (legacyRaw === null) return null;

        const value = Number(legacyRaw);
        if (!Number.isFinite(value)) return null;
        writeRaw(Keys.progress(book, chapter), String(value));
        return value;
    }

    static setProgress(book: string, chapter: number, index: number): void {
        writeRaw(Keys.progress(book, chapter), String(index));
    }

    static clearProgress(book: string, chapter: number): void {
        removeRaw(Keys.progress(book, chapter));
        removeRaw(LegacyKeys.progress(book, chapter));
    }

    static getLastChapter(bookId: string): number | null {
        const freshRaw = readRaw(Keys.lastChapter(bookId));
        if (freshRaw !== null) {
            const value = Number(freshRaw);
            return Number.isFinite(value) ? value : null;
        }

        const legacyRaw = readRaw(LegacyKeys.lastChapter(bookId));
        if (legacyRaw === null) return null;

        const value = Number(legacyRaw);
        if (!Number.isFinite(value)) return null;
        writeRaw(Keys.lastChapter(bookId), String(value));
        return value;
    }

    static setLastChapter(bookId: string, chapter: number): void {
        writeRaw(Keys.lastChapter(bookId), String(chapter));
    }
}
