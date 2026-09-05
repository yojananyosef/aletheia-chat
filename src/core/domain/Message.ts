/** Voces conocidas (autocompletado). Cualquier otro string también vale: `(string & {})`. */
export type CanonicalSpeaker =
    | 'Narrador' | 'Dios' | 'Sistema'
    | 'Serpiente' | 'Mujer' | 'Eva' | 'Adán' | 'Caín' | 'Abel' | 'Noé'
    | 'Abraham' | 'Sara' | 'Isaac' | 'Jacob' | 'José'
    | 'Moisés' | 'Aarón' | 'Faraón' | 'Séfora' | 'Jetro' | 'Reuel'
    | 'Parteras' | 'Hija de Faraón' | 'Hermana' | 'Hijas' | 'Hebreo'
    | 'Josué' | 'Gedeón' | 'Sansón' | 'Rut' | 'Booz' | 'Noemí' | 'Nueras'
    | 'Criado' | 'Segadores' | 'Pariente' | 'Ancianos' | 'Mujeres' | 'Pueblo'
    | 'Marineros' | 'Rey de Nínive' | 'Impíos' | 'Pueblos'
    | 'Samuel' | 'Saúl' | 'David' | 'Salomón' | 'Elías' | 'Eliseo'
    | 'Esdras' | 'Nehemías' | 'Ester' | 'Mardoqueo' | 'Job' | 'Asaf'
    | 'Satán' | 'Elifaz' | 'Bildad' | 'Zofar' | 'Eliú' | 'Esposa' | 'Mensajero'
    | 'Predicador' | 'Amado' | 'Amada'
    | 'Isaías' | 'Jeremías' | 'Ezequiel' | 'Daniel'
    | 'Oseas' | 'Joel' | 'Amós' | 'Abdías' | 'Jonás' | 'Miqueas'
    | 'Nahum' | 'Habacuc' | 'Sofonías' | 'Hageo' | 'Zacarías' | 'Malaquías'
    | 'Jesús' | 'Mateo' | 'Pedro' | 'Pablo' | 'Espíritu Santo' | 'Timoteo'
    | 'Santiago' | 'Juan' | 'Judas' | 'Ángeles';

export type Speaker = CanonicalSpeaker | (string & {});

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

/** Canónico (Fase 1): antes duplicado como `FavoriteMessage` en types/bible. */
export interface FavoriteMessage extends MessageData {
    bookId: string;
    bookName: string;
    chapter: number;
}

/** @deprecated Usar `FavoriteMessage`. */
export type FavoriteMessageData = FavoriteMessage;
