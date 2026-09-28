import React from 'react';
import { CheckCheck, Lock, Link2 } from 'lucide-react';
import { BookInfo } from '../../types/bible';
import { Surface, Avatar } from '../ui/Surface';
import { timeAgo } from '../../utils/activity';
import type { LastMessage } from '../../core/services/StorageService';

interface GroupListItemProps {
    book: BookInfo;
    lastChapter: number;
    lastMessage: LastMessage | null;
    lockHint?: string;
    /**
     * Capítulo al que se entró por enlace compartido con el libro todavía
     * bloqueado. La fila se puede abrir, pero NO cuenta como visita: el
     * desbloqueo progresivo sigue intacto.
     */
    linkChapter?: number | null;
    /** El capítulo retomado está completo: doble check azul. */
    isComplete?: boolean;
    onSelect: (id: string, chapter?: number) => void;
}

export const GroupListItem: React.FC<GroupListItemProps> = ({ book, lastChapter, lastMessage, lockHint, linkChapter, isComplete, onSelect }) => {
    const { isLocked } = book;
    const isNew = !isLocked && lastMessage === null;
    // Bloqueado pero con un capítulo que te compartieron: se puede abrir sin
    // estar desbloqueado. Es el estado "leído por enlace", no "abierto".
    const isLinked = isLocked && linkChapter != null;
    const targetChapter = linkChapter ?? lastChapter;
    // Bloqueado y sin enlace = no se puede abrir. Con enlace, sí.
    const canOpen = !isLocked || isLinked;

    return (
        <Surface
            onClick={canOpen ? () => onSelect(book.id, isLinked ? targetChapter : undefined) : undefined}
            elevation={false}
            ariaLabel={canOpen
                ? `Abrir ${book.name}, capítulo ${targetChapter}`
                : `${book.name} (próximamente)`}
            className={`p-4 md:p-5 flex items-center gap-4 border-x-0 border-t-0 first:border-t-2 group border-b-2 border-[#141413] dark:border-white/15 bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1] ${canOpen ? '' : 'opacity-70 select-none cursor-not-allowed'}`}
        >
            <Avatar letter={book.name[0]} size="md" color={isLocked && !isLinked ? "bg-[#E8E0D2] dark:bg-[#2E2B27] dark:text-[#A8A29E]" : undefined} />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none truncate">{book.name}</h2>
                    {isLocked && !isLinked ? (
                        <span className="text-[10px] font-bold text-[#57534E] dark:text-[#A8A29E] shrink-0">{lockHint ?? 'Próximamente'}</span>
                    ) : (
                        <span className="flex items-center gap-1 shrink-0">
                            {isComplete && (
                                <>
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#FFD600]" aria-hidden="true" />
                                    <span className="sr-only">Capítulo completado</span>
                                </>
                            )}
                            {lastMessage && (
                                <span className="text-[10px] font-bold text-[#57534E] dark:text-[#A8A29E]">{timeAgo(lastMessage.at)}</span>
                            )}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-[#3D3D3A] dark:text-[#D8D5CD] font-medium truncate leading-tight pr-2">
                        {isLocked && !isLinked
                            ? book.description
                            : lastMessage
                                ? `${lastMessage.speaker}: ${lastMessage.text}`
                                : book.description}
                    </p>
                    {isLinked ? (
                        <span className="bg-[#FFD600] text-black border-2 border-[#141413] dark:border-[#EDE9E1] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] shrink-0 shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#000] flex items-center gap-1">
                            <Link2 className="w-3 h-3" aria-hidden="true" />
                            Cap {targetChapter}
                        </span>
                    ) : isLocked ? (
                        <div className="bg-black text-[#FFD600] p-1 rounded-sm shrink-0">
                            <Lock className="w-3 h-3" />
                        </div>
                    ) : isNew ? (
                        <span className="bg-[#FFD600] text-black border-2 border-[#141413] dark:border-[#EDE9E1] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] shrink-0 shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#000]">
                            Nuevo
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold text-[#57534E] dark:text-[#A8A29E] shrink-0">
                            Cap {lastMessage?.chapter ?? lastChapter}
                        </span>
                    )}
                </div>
            </div>
        </Surface>
    );
};
