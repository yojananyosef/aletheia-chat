export type Speaker = 'Narrador' | 'Dios' | 'Moisés' | 'Sistema' | string;

export interface MessageData {
    id: string;
    speaker: Speaker;
    text: string;
    verse: number;
    isSectionTitle?: boolean;
}

export class Message {
    constructor(private readonly data: MessageData) { }

    get id() { return this.data.id; }
    get speaker() { return this.data.speaker; }
    get text() { return this.data.text; }
    get verse() { return this.data.verse; }
    get isSectionTitle() { return this.data.isSectionTitle; }

    isHuman(): boolean {
        const systemSpeakers = ['Dios', 'Narrador', 'Sistema'];
        return !systemSpeakers.includes(this.speaker) && !this.isTitle();
    }

    isTitle(): boolean {
        return !!this.isSectionTitle;
    }

    /** Solo el Narrador (no-título) fluye en auto-avance. */
    isNarratorFlow(): boolean {
        return this.speaker === 'Narrador' && !this.isTitle();
    }

    /** Todo no-Narrador pausa: Dios, humanos/personajes y títulos requieren tap. */
    requiresManualAdvance(): boolean {
        return !this.isNarratorFlow();
    }

    toJSON(): MessageData {
        return { ...this.data };
    }
}

export interface FavoriteMessageData extends MessageData {
    bookId: string;
    bookName: string;
    chapter: number;
}
