import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BIBLE_BOOKS } from '../../../../src/constants/books';
import { ChatView } from '../../../../src/views/ChatView';

export const dynamicParams = false;

export function generateStaticParams() {
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
        title: config ? `${config.name} ${chapter} · Biblia Chat 📖` : 'Biblia Chat 📖',
        description: config?.description,
    };
}

export default async function BookChapterPage(
    { params }: { params: Promise<{ book: string; chapter: string }> }
) {
    const { book, chapter } = await params;
    const chapterNumber = Number(chapter);
    const config = BIBLE_BOOKS.find((b) => b.id === book);

    if (!config || !config.availableChapters.includes(chapterNumber)) {
        notFound();
    }

    return <ChatView bookId={book} chapter={chapterNumber} />;
}
