import type { ValidatedChapterData } from '../../core/validation/bibleSchemas';
import { selectPrerenderMessages } from '../../core/domain/prerender';
import { MessageStatic } from './MessageStatic';

interface ChapterPrerenderProps {
    data: ValidatedChapterData;
    bookName: string;
}

/**
 * Bloque SEO server: `<h1>` + título + primeros mensajes en el HTML
 * prerenderizado. Visible sin JS; la isla client (`ChatView`) lo remueve
 * al hidratar para no duplicar el feed interactivo.
 */
export function ChapterPrerender({ data, bookName }: ChapterPrerenderProps) {
    const messages = selectPrerenderMessages(data.messages);

    return (
        <section id="chapter-prerender" data-testid="chapter-prerender">
            <h1>
                {bookName} {data.chapter}
            </h1>
            <p>{data.title}</p>
            {messages.map((m) => (
                <MessageStatic key={m.id} message={m} />
            ))}
        </section>
    );
}
