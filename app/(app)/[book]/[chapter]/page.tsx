import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BIBLE_BOOKS } from '../../../../src/constants/books';
import { chaptersFromFs } from '../../../../src/core/services/catalogFs';
import { ChatView } from '../../../../src/views/ChatView';

export const dynamicParams = false;

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
    const title = `${config?.name ?? 'Capítulo'} ${chapter}`;
    // El title.template del root layout añade «| Aletheia Chat».
    return {
        title: config ? title : 'Capítulo no encontrado',
        description: config?.description,
        alternates: {
            canonical: `/${book}/${chapter}`,
        },
        openGraph: {
            type: 'website',
            locale: 'es_ES',
            url: `/${book}/${chapter}`,
            siteName: 'Aletheia Chat',
            title,
            description: config?.description,
            images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Aletheia Chat' }],
        },
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
