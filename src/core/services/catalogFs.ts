import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Capítulos con JSON real en public/data (fuente de verdad para SSG y sitemap).
 * Fallback a BIBLE_BOOKS si el FS no es legible (p. ej. ciertos sandboxes).
 */
export function chaptersFromFs(): { book: string; chapter: string }[] {
    try {
        const dataDir = join(process.cwd(), 'public', 'data');
        return readdirSync(dataDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .flatMap((dir) =>
                readdirSync(join(dataDir, dir.name))
                    .filter((f) => /^\d+\.json$/.test(f))
                    .map((f) => ({ book: dir.name, chapter: f.replace(/\.json$/, '') }))
            );
    } catch {
        return [];
    }
}
