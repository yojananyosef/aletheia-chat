import type { MetadataRoute } from 'next';
import { BIBLE_BOOKS } from '../src/constants/books';
import { SITE_URL } from '../src/constants/site';
import { chaptersFromFs } from '../src/core/services/catalogFs';

export default function sitemap(): MetadataRoute.Sitemap {
    const fromFs = chaptersFromFs();
    const chapters =
        fromFs.length > 0
            ? fromFs
            : BIBLE_BOOKS.flatMap((book) =>
                  book.availableChapters.map((chapter) => ({
                      book: book.id,
                      chapter: String(chapter),
                  }))
              );

    return [
        {
            url: SITE_URL,
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...chapters.map(({ book, chapter }) => ({
            url: `${SITE_URL}/${book}/${chapter}`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
