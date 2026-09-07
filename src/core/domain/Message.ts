/** Voces conocidas (autocompletado). Cualquier otro string también vale: `(string & {})`. */
export type CanonicalSpeaker =
    | 'Narrador' | 'Dios' | 'Sistema'
    | 'Serpiente' | 'Mujer' | 'Eva' | 'Adán' | 'Caín' | 'Abel' | 'Noé'
    | 'Abraham' | 'Sara' | 'Isaac' | 'Jacob' | 'José'
    | 'Moisés' | 'Aarón' | 'Faraón' | 'Séfora' | 'Jetro' | 'Reuel'
    | 'Parteras' | 'Hija de Faraón' | 'Hermana' | 'Hijas' | 'Hebreo'
    | 'Josué' | 'Gedeón' | 'Sansón' | 'Rut' | 'Booz' | 'Noemí' | 'Nueras'
    | 'Lamec' | 'Lot' | 'Melquisedec' | 'Agar' | 'Abimelec'
    | 'Rebeca' | 'Esaú' | 'Labán' | 'Lea' | 'Raquel' | 'Hamor' | 'Siquem'
    | 'Efrón' | 'Judá' | 'Rubén' | 'Copero' | 'Panadero' | 'Ángel'
    | 'Hermanos' | 'Hijos de Labán' | 'Tamar'
    | 'Hombre' | 'Amigo' | 'Rey de Sodoma'
    | 'María' | 'Egipcios' | 'Capataces' | 'Encantadores' | 'Artífices'
    | 'Criado' | 'Segadores' | 'Pariente' | 'Ancianos' | 'Mujeres' | 'Pueblo'
    | 'Marineros' | 'Rey de Nínive' | 'Impíos' | 'Pueblos'
    | 'Samuel' | 'Saúl' | 'David' | 'Salomón' | 'Elías' | 'Eliseo'
    | 'Adonías' | 'Benaía' | 'Acab' | 'Jezabel' | 'Jeroboam' | 'Roboam'
    | 'Hiram' | 'Reina de Seba' | 'Abdías' | 'Nabot' | 'Micaías' | 'Sedequías'
    | 'Josafat' | 'Benadad' | 'Ahías' | 'Viuda' | 'Varón de Dios' | 'Profeta viejo'
    | 'Esposa de Jeroboam' | 'Profeta' | 'Ocozías' | 'Rey de Siria'
    | 'Hadad' | 'Profetas de Baal'
    | 'Giezi' | 'Naamán' | 'Sunamita' | 'Joram' | 'Jehú' | 'Hazael'
    | 'Atalía' | 'Joiada' | 'Ezequías' | 'Rabsaces' | 'Eliaquim' | 'Hulda'
    | 'Hilcías' | 'Safán' | 'Josías' | 'Isaías' | 'Senaquerib' | 'Gedalías'
    | 'Joás' | 'Acaz' | 'Capitán' | 'Niño'
    | 'Moabitas' | 'Rey de Asiria'
    | 'Esdras' | 'Nehemías' | 'Ester' | 'Mardoqueo' | 'Job' | 'Asaf'
    | 'Satán' | 'Elifaz' | 'Bildad' | 'Zofar' | 'Eliú' | 'Esposa' | 'Mensajero'
    | 'Predicador' | 'Amado' | 'Amada' | 'Sabiduría' | 'Agur' | 'Madre de Lemuel'
    | 'Mujer insensata' | 'Hijas de Jerusalén' | 'Serafines' | 'Baruc' | 'Hananías'
    | 'Ebed-melec' | 'Jerusalén' | 'Enemigos' | 'Nabucodonosor' | 'Belsasar'
    | 'Caldeos' | 'Sadrac' | 'Arioc' | 'Eunuco' | 'Gabriel' | 'Efraín'
    | 'Isaías' | 'Jeremías' | 'Ezequiel' | 'Daniel'
    | 'Oseas' | 'Joel' | 'Amós' | 'Abdías' | 'Jonás' | 'Miqueas'
    | 'Nahum' | 'Habacuc' | 'Sofonías' | 'Hageo' | 'Zacarías' | 'Malaquías'
    | 'Jesús' | 'Mateo' | 'Pedro' | 'Pablo' | 'Espíritu Santo' | 'Timoteo'
    | 'Juan el Bautista' | 'Herodes' | 'Herodías' | 'Pilato' | 'Discípulos'
    | 'Fariseos' | 'Escribas' | 'Saduceos' | 'Multitud' | 'Demonio' | 'Leproso'
    | 'Jairo' | 'Centurión' | 'Sumo sacerdote' | 'Sacerdotes' | 'Testigos'
    | 'Bartimeo' | 'Criada' | 'Joven' | 'Familiares' | 'Padre' | 'Soldados'
    | 'Ciego' | 'Jacobo y Juan' | 'Hija de Herodías'
    | 'Elisabet' | 'Simeón' | 'Marta' | 'Zaqueo' | 'Ladrones' | 'Cleofas'
    | 'Publicanos' | 'Publicano' | 'Doctor' | 'Leprosos' | 'Pastores'
    | 'Samaritana' | 'Judíos' | 'Natanael' | 'Felipe' | 'Andrés' | 'Tomás'
    | 'Nicodemo' | 'Caifás' | 'Alguaciles' | 'Griegos'
    | 'Magos' | 'Esposa de Pilato' | 'Niños' | 'Ciegos'
    | 'Santiago' | 'Juan' | 'Judas' | 'Ángeles'
    | 'Balaam' | 'Balac' | 'Coré' | 'Caleb' | 'Hobab' | 'Edom' | 'Eleazar'
    | 'Asna' | 'Mensajeros' | 'Espías' | 'Datán y Abiram' | 'Israel'
    | 'Gad y Rubén' | 'Galaaditas' | 'Capitanes' | 'Hijas de Zelofehad'
    | 'Príncipes' | 'Hombres' | 'Cuñado' | 'Cuñada' | 'Oficiales'
    | 'Rey de Jericó' | 'Rahab' | 'Príncipe' | 'Acán' | 'Gabaonitas'
    | 'Acsa'     | 'Hijos de José' | 'Levitas' | 'Finees'
    | 'Adonibezec' | 'Otoniel' | 'Aod' | 'Eglón' | 'Débora' | 'Barac'
    | 'Jael' | 'Sísara' | 'Madre de Sísara' | 'Joás' | 'Madianita'
    | 'Efraín' | 'Zebul' | 'Gaal' | 'Jotam' | 'Abimelec' | 'Jefté'
    | 'Rey de Amón' | 'Hija de Jefté' | 'Esposa de Manoa' | 'Manoa'
    | 'Padres de Sansón' | 'Filisteos' | 'Dalila' | 'Esposa de Sansón'
    | 'Suegro' | 'Levita' | 'Micaía' | 'Madre de Micaía' | 'Danitas'
    | 'Anciano' | 'Benjamín'
    | 'Elí' | 'Ana' | 'Elcana' | 'Penina' | 'Ofni' | 'Jonatán'
    | 'Goliat' | 'Abigail' | 'Nabal' | 'Aquís' | 'Doeg' | 'Ahimelec'
    | 'Gad' | 'Ornán' | 'Jebuseos' | 'Amasai' | 'Abías' | 'Azarías' | 'Hanani' | 'Jahaziel' | 'Eliezer' | 'Amasías' | 'Oded' | 'Necao' | 'Ciro' | 'Cantores' | 'Tirsata' | 'Zorobabel' | 'Rehum' | 'Artajerjes' | 'Tatnai' | 'Secanías' | 'Darío' | 'Adversarios' | 'Sanbalat' | 'Tobías' | 'Semaías' | 'Asuero' | 'Amán' | 'Memucán' | 'Zeres' | 'Harbona' | 'Sabios' | 'Abner' | 'Asael' | 'Asa' | 'Reina' | 'Mical' | 'Merab' | 'Agag' | 'Eliab'
    | 'Abinadab' | 'Isaí' | 'Egipcio' | 'Amalecita' | 'Escudero' | 'Pitonisa'
    | 'Esposa de Finees' | 'Adivinos' | 'Nahas' | 'Tío de Saúl' | 'Abisai'
    | 'Natán' | 'Joab' | 'Absalón' | 'Isboset' | 'Amnón' | 'Tamar'
    | 'Jonadab' | 'Husai' | 'Ahitofel' | 'Betsabé' | 'Urías' | 'Mefiboset'
    | 'Siba' | 'Simeí' | 'Barzilai' | 'Ahimaas' | 'Arauna' | 'Sadoc'
    | 'Abiatar' | 'Itai' | 'Amasa' | 'Seba' | 'Mujer de Tecoa' | 'Mujer sabia'
    | 'Etíope' | 'Recab' | 'Baana' | 'Rizpa' | 'Jabes' | 'Siervos' | 'Jóvenes';

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
