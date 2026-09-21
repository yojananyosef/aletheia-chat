import type { MessageData } from '../../core/domain/Message';

/**
 * Variante estática (server) de la burbuja: mismo texto y hablante, sin
 * `motion`, sin handlers. Existe para que el HTML prerenderizado contenga
 * texto bíblico real (SEO / lectores / sin JS). Tras hidratar, la isla
 * interactiva toma el relevo y `ChapterPrerenderGate` desmonta el bloque.
 */
export function MessageStatic({ message }: { message: MessageData }) {
    if (message.isSectionTitle) {
        return (
            <div className="text-center my-12">
                <p className="inline-block px-6 py-2 text-xs font-black uppercase tracking-widest">
                    {message.text}
                </p>
            </div>
        );
    }

    return (
        <article>
            <p>
                <strong>{message.speaker}</strong> <span>v.{message.verse}</span>
            </p>
            <p>{message.text}</p>
        </article>
    );
}
