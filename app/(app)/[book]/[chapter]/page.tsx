import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BIBLE_BOOKS } from '../../../../src/constants/books';
import { ChatView } from '../../../../src/views/ChatView';

export const dynamicParams = false;

/**
 * Capítulos con JSON real en public/data (fuente de verdad para SSG).
 * Fallback a BIBLE_BOOKS si el FS no es legible (p. ej. ciertos sandboxes).
 */
function chaptersFromFs(): { book: string; chapter: string }[] {
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

export function generateStaticParams() {
    const fromFs = chaptersFromFs();
    if (fromFs.length > 0) return fromFs;
    return BIBLE_BOOKS.flatMap((book) =>
        book.availableChapters.map((chapter) => ({
            book: book.id,
            chapter: String(chapter),
        }))
    );
}

export async function generateMetadata(
    { params }: { params: Promise<{ book: string; chapter: string }> }
): Promise<Metadata> {
    const { book, chapter } = await params;
    const config = BIBLE_BOOKS.find((b) => b.id === book);
    return {
        title: config ? `${config.name} ${chapter} · Aletheia Chat 📖` : 'Aletheia Chat 📖',
        description: config?.description,
    };
}

export default async function BookChapterPage(
    { params }: { params: Promise<{ book: string; chapter: string }> }
) {
    const { book, chapter } = await params;
    const chapterNumber = Number(chapter);
    const config = BIBLE_BOOKS.find((b) => b.id === book);

    const fsParams = chaptersFromFs();
    const existsOnFs = fsParams.some((p) => p.book === book && p.chapter === String(chapterNumber));
    const listedInCatalog = !!config && config.availableChapters.includes(chapterNumber);

    if (!config || !Number.isFinite(chapterNumber) || (!existsOnFs && !listedInCatalog)) {
        notFound();
    }

    return <ChatView key={`${book}:${chapterNumber}`} bookId={book} chapter={chapterNumber} />;
}
