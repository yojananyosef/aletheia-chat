import React from 'react';
import { Lock } from 'lucide-react';
import { BookInfo } from '../../types/bible';
import { Surface, Avatar } from '../ui/Surface';
import { timeAgo } from '../../utils/activity';
import type { LastMessage } from '../../core/services/StorageService';

interface GroupListItemProps {
    book: BookInfo;
    lastChapter: number;
    lastMessage: LastMessage | null;
    onSelect: (id: string) => void;
}

export const GroupListItem: React.FC<GroupListItemProps> = ({ book, lastChapter, lastMessage, onSelect }) => {
    const { isLocked } = book;
    const isNew = !isLocked && lastMessage === null;

    return (
        <Surface
            onClick={isLocked ? undefined : () => onSelect(book.id)}
            elevation={false}
            ariaLabel={isLocked ? `${book.name} (próximamente)` : `Abrir ${book.name}, capítulo ${lastChapter}`}
            className={`p-4 md:p-5 flex items-center gap-4 border-x-0 border-t-0 first:border-t-2 group border-b-2 ${isLocked ? 'opacity-50 grayscale select-none cursor-not-allowed' : ''}`}
        >
            <Avatar letter={book.name[0]} size="md" color={isLocked ? "bg-gray-200" : undefined} />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none truncate">{book.name}</h2>
                    {isLocked ? (
                        <span className="text-[10px] font-bold text-gray-600 shrink-0">Próximamente</span>
                    ) : lastMessage ? (
                        <span className="text-[10px] font-bold text-gray-600 shrink-0">{timeAgo(lastMessage.at)}</span>
                    ) : null}
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-600 font-medium truncate leading-tight pr-2">
                        {isLocked
                            ? book.description
                            : lastMessage
                                ? `${lastMessage.speaker}: ${lastMessage.text}`
                                : book.description}
                    </p>
                    {isLocked ? (
                        <div className="bg-black text-[#FFD600] p-1 rounded-sm shrink-0">
                            <Lock className="w-3 h-3" />
                        </div>
                    ) : isNew ? (
                        <span className="bg-[#FFD600] border-2 border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest shrink-0 shadow-[2px_2px_0_#0A0A0A]">
                            Nuevo
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold text-gray-600 shrink-0">
                            Cap {lastMessage?.chapter ?? lastChapter}
                        </span>
                    )}
                </div>
            </div>
        </Surface>
    );
};
