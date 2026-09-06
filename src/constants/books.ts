import { BookInfo } from '../types/bible';

export const BIBLE_BOOKS: BookInfo[] = [
    // --- PENTATEUCO ---
    {
        id: 'genesis',
        name: 'Génesis',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
        category: 'Pentateuco',
        description: 'La creación, la caída y la promesa divina a los patriarcas.',
        participants: ['Dios', 'Narrador', 'Adán', 'Eva', 'Serpiente', 'Caín', 'Noé', 'Abraham', 'Sara', 'Isaac', 'Jacob', 'José', 'Lot', 'Agar', 'Rebeca', 'Esaú', 'Labán', 'Lea', 'Raquel', 'Judá', 'Ángel', 'Faraón', 'Melquisedec', 'Abimelec', 'Efrón', 'Hamor', 'Siquem', 'Rubén', 'Copero', 'Panadero', 'Criado', 'Mensajero', 'Pastores', 'Hermanos', 'Hijas', 'Parteras', 'Pueblo', 'Tamar', 'Hombre', 'Amigo', 'Esposa', 'Lamec', 'Hijos de Labán', 'Rey de Sodoma']
    },
    {
        id: 'exodus',
        name: 'Éxodo',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        category: 'Pentateuco',
        description: 'La liberación épica de Israel de la esclavitud en Egipto y la entrega de la Ley.',
        participants: ['Dios', 'Narrador', 'Moisés', 'Faraón', 'Aarón', 'Pueblo', 'Egipcios', 'Capataces', 'Encantadores', 'María', 'Josué', 'Jetro', 'Criado', 'Artífices', 'Parteras', 'Hija de Faraón', 'Hermana', 'Hijas', 'Hebreo', 'Reuel', 'Séfora']
    },
    {
        id: 'levitico',
        name: 'Levítico',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'Leyes ceremoniales y santidad del pueblo de Dios.',
        participants: ['Dios', 'Moisés']
    },
    {
        id: 'numeros',
        name: 'Números',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'El censo y el vagabundeo de Israel por el desierto.',
        participants: ['Moisés']
    },
    {
        id: 'deuteronomio',
        name: 'Deuteronomio',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'Repetición de la ley y despedida de Moisés.',
        participants: ['Moisés']
    },

    // --- HISTORIA ---
    { id: 'josue', name: 'Josué', availableChapters: [], isLocked: true, category: 'Historia', description: 'La conquista de la Tierra Prometida.', participants: ['Josué'] },
    { id: 'jueces', name: 'Jueces', availableChapters: [], isLocked: true, category: 'Historia', description: 'El ciclo de desobediencia y liberación de Israel.', participants: ['Gedeón', 'Sansón'] },
    { id: 'rut', name: 'Rut', availableChapters: [1, 2, 3, 4], category: 'Historia', description: 'Una historia de redención y lealtad.', participants: ['Dios', 'Narrador', 'Rut', 'Booz', 'Noemí', 'Nueras', 'Criado', 'Segadores', 'Pariente', 'Ancianos', 'Mujeres', 'Pueblo'] },
    { id: '1samuel', name: '1 Samuel', availableChapters: [], isLocked: true, category: 'Historia', description: 'El surgimiento de la monarquía en Israel.', participants: ['Samuel', 'Saúl', 'David'] },
    { id: '2samuel', name: '2 Samuel', availableChapters: [], isLocked: true, category: 'Historia', description: 'El reinado del rey David.', participants: ['David'] },
    { id: '1reyes', name: '1 Reyes', availableChapters: [], isLocked: true, category: 'Historia', description: 'El esplendor de Salomón y la división del reino.', participants: ['Salomón', 'Elías'] },
    { id: '2reyes', name: '2 Reyes', availableChapters: [], isLocked: true, category: 'Historia', description: 'La caída de los reinos y el ministerio de Eliseo.', participants: ['Eliseo'] },
    { id: '1cronicas', name: '1 Crónicas', availableChapters: [], isLocked: true, category: 'Historia', description: 'Genealogías y el legado de David.', participants: ['David'] },
    { id: '2cronicas', name: '2 Crónicas', availableChapters: [], isLocked: true, category: 'Historia', description: 'Desde Salomón hasta el exilio.', participants: ['Salomón'] },
    { id: 'esdras', name: 'Esdras', availableChapters: [], isLocked: true, category: 'Historia', description: 'El retorno del exilio y la reconstrucción del templo.', participants: ['Esdras'] },
    { id: 'nehemias', name: 'Nehemías', availableChapters: [], isLocked: true, category: 'Historia', description: 'La reconstrucción de los muros de Jerusalén.', participants: ['Nehemías'] },
    { id: 'ester', name: 'Ester', availableChapters: [], isLocked: true, category: 'Historia', description: 'La providencia divina salvando a su pueblo.', participants: ['Ester', 'Mardoqueo'] },

    // --- POESÍA ---
    { id: 'job', name: 'Job', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], category: 'Poesía', description: 'El sufrimiento humano y la soberanía de Dios.', participants: ['Dios', 'Narrador', 'Job', 'Satán', 'Elifaz', 'Bildad', 'Zofar', 'Eliú', 'Esposa', 'Mensajero'] },
    { id: 'salmos', name: 'Salmos', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150], category: 'Poesía', description: 'Cánticos de adoración, lamento y esperanza.', participants: ['Dios', 'Narrador', 'David', 'Asaf', 'Impíos', 'Pueblos'] },
    { id: 'proverbios', name: 'Proverbios', availableChapters: [], isLocked: true, category: 'Poesía', description: 'Sabiduría práctica para la vida.', participants: ['Salomón'] },
    { id: 'eclesiastes', name: 'Eclesiastés', availableChapters: [], isLocked: true, category: 'Poesía', description: 'La búsqueda de significado bajo el sol.', participants: ['Predicador'] },
    { id: 'cantares', name: 'Cantares', availableChapters: [], isLocked: true, category: 'Poesía', description: 'La belleza del amor humano y divino.', participants: ['Amado', 'Amada'] },

    // --- PROFETAS MAYORES ---
    { id: 'isaias', name: 'Isaías', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Visiones del Mesías y el juicio venidero.', participants: ['Isaías', 'Dios'] },
    { id: 'jeremias', name: 'Jeremías', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'El profeta llorón y el nuevo pacto.', participants: ['Jeremías'] },
    { id: 'lamentaciones', name: 'Lamentaciones', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Duelo por la caída de Jerusalén.', participants: ['Jeremías'] },
    { id: 'ezequiel', name: 'Ezequiel', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Visiones de la gloria de Dios en el exilio.', participants: ['Ezequiel'] },
    { id: 'daniel', name: 'Daniel', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Fidelidad en Babilonia y visiones del fin.', participants: ['Daniel'] },

    // --- PROFETAS MENORES ---
    { id: 'oseas', name: 'Oseas', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'El amor infalible de Dios.', participants: ['Oseas'] },
    { id: 'joel', name: 'Joel', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'El día del Señor y la promesa del Espíritu.', participants: ['Joel'] },
    { id: 'amos', name: 'Amós', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Justicia social y juicio.', participants: ['Amós'] },
    { id: 'abdias', name: 'Abdías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Juicio contra Edom.', participants: ['Abdías'] },
    { id: 'jonas', name: 'Jonás', availableChapters: [1, 2, 3, 4], category: 'Profetas Menores', description: 'La misericordia de Dios hacia las naciones.', participants: ['Dios', 'Narrador', 'Jonás', 'Marineros', 'Rey de Nínive'] },
    { id: 'miqueas', name: 'Miqueas', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Requerimientos de Dios y nacimiento en Belén.', participants: ['Miqueas'] },
    { id: 'nahum', name: 'Nahum', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Caída de Nínive.', participants: ['Nahum'] },
    { id: 'habacuc', name: 'Habacuc', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Diálogo con Dios sobre la injusticia.', participants: ['Habacuc'] },
    { id: 'sofonias', name: 'Sofonías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Juicio y restauración.', participants: ['Sofonías'] },
    { id: 'hageo', name: 'Hageo', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Exhortación a reconstruir el templo.', participants: ['Hageo'] },
    { id: 'zacarias', name: 'Zacarías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Visiones del Mesías y el triunfo de Dios.', participants: ['Zacarías'] },
    { id: 'malaquias', name: 'Malaquías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'El mensajero del Señor.', participants: ['Malaquías'] },

    // --- EVANGELIOS ---
    { id: 'mateo', name: 'Mateo', availableChapters: [], isLocked: true, category: 'Evangelios', description: 'El evangelio del Rey de los judíos.', participants: ['Jesús', 'Mateo'] },
    {
        id: 'marcos', name: 'Marcos',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        category: 'Evangelios', description: 'El Siervo sufriente.',
        participants: ['Dios', 'Narrador', 'Jesús', 'Juan el Bautista', 'Juan', 'Herodes', 'Herodías', 'Hija de Herodías', 'Pilato', 'Pedro', 'Jacobo y Juan', 'Discípulos', 'Fariseos', 'Escribas', 'Saduceos', 'Sacerdotes', 'Sumo sacerdote', 'Multitud', 'Mujer', 'Mujeres', 'Hombre', 'Padre', 'Familiares', 'Demonio', 'Leproso', 'Ciego', 'Bartimeo', 'Jairo', 'Judas', 'Centurión', 'Testigos', 'Soldados', 'Criada', 'Mensajero', 'Joven']
    },
    {
        id: 'lucas', name: 'Lucas',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        category: 'Evangelios', description: 'El Salvador de toda la humanidad.',
        participants: ['Dios', 'Narrador', 'Jesús', 'Juan el Bautista', 'Juan', 'Herodes', 'Pilato', 'Pedro', 'Discípulos', 'Fariseos', 'Escribas', 'Saduceos', 'Sacerdotes', 'Multitud', 'María', 'Elisabet', 'Zacarías', 'Simeón', 'Pastores', 'Ángel', 'Ángeles', 'Mujer', 'Mujeres', 'Hombre', 'Padre', 'Familiares', 'Demonio', 'Leproso', 'Leprosos', 'Ciego', 'Publicanos', 'Publicano', 'Doctor', 'Marta', 'Zaqueo', 'Ladrones', 'Cleofas', 'Judas', 'Centurión', 'Soldados', 'Criada', 'Mensajero', 'Ancianos', 'Joven']
    },
    { id: 'juan', name: 'Juan', availableChapters: [], isLocked: true, category: 'Evangelios', description: 'El Hijo de Dios entre nosotros.', participants: ['Jesús', 'Juan'] },

    // --- HISTORIA NT ---
    { id: 'hechos', name: 'Hechos', availableChapters: [], isLocked: true, category: 'Historia', description: 'El nacimiento y expansión de la iglesia.', participants: ['Pedro', 'Pablo', 'Espíritu Santo'] },

    // --- EPÍSTOLAS DE PABLO ---
    { id: 'romanos', name: 'Romanos', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La justicia de Dios por medio de la fe.', participants: ['Pablo'] },
    { id: '1corintios', name: '1 Corintios', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Instrucciones para una iglesia en crisis.', participants: ['Pablo'] },
    { id: '2corintios', name: '2 Corintios', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Defensa del ministerio apostólico.', participants: ['Pablo'] },
    { id: 'galatas', name: 'Gálatas', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Libertad en Cristo y contra el legalismo.', participants: ['Pablo'] },
    { id: 'efesios', name: 'Efesios', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La riqueza espiritual en Cristo y la armadura de Dios.', participants: ['Pablo'] },
    { id: 'filipenses', name: 'Filipenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Gozo en medio del sufrimiento.', participants: ['Pablo'] },
    { id: 'colosenses', name: 'Colosenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La preeminencia de Cristo.', participants: ['Pablo'] },
    { id: '1tesalonicenses', name: '1 Tesalonicenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La venida del Señor.', participants: ['Pablo'] },
    { id: '2tesalonicenses', name: '2 Tesalonicenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Perseverancia ante el fin.', participants: ['Pablo'] },
    { id: '1timoteo', name: '1 Timoteo', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Consejos para un joven pastor.', participants: ['Pablo', 'Timoteo'] },
    { id: '2timoteo', name: '2 Timoteo', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Últimas palabras de Pablo.', participants: ['Pablo', 'Timoteo'] },
    { id: 'tito', name: 'Tito', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Organización de la iglesia en Creta.', participants: ['Pablo'] },
    { id: 'filemon', name: 'Filemón', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Súplica por un esclavo fugitivo.', participants: ['Pablo'] },

    // --- EPÍSTOLAS GENERALES ---
    { id: 'hebreos', name: 'Hebreos', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'La superioridad de Cristo.', participants: ['Autor anónimo'] },
    { id: 'santiago', name: 'Santiago', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'La fe que actúa.', participants: ['Santiago'] },
    { id: '1pedro', name: '1 Pedro', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Esperanza en el sufrimiento.', participants: ['Pedro'] },
    { id: '2pedro', name: '2 Pedro', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Contra los falsos maestros.', participants: ['Pedro'] },
    { id: '1juan', name: '1 Juan', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Caminar en la luz y el amor.', participants: ['Juan'] },
    { id: '2juan', name: '2 Juan', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Permanecer en la verdad.', participants: ['Juan'] },
    { id: '3juan', name: '3 Juan', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Hospitalidad cristiana.', participants: ['Juan'] },
    { id: 'judas', name: 'Judas', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Contender por la fe.', participants: ['Judas'] },

    // --- PROFECÍA ---
    { id: 'revelation', name: 'Apocalipsis', availableChapters: [], isLocked: true, category: 'Profecía', description: 'La victoria final de Jesucristo.', participants: ['Jesús', 'Juan', 'Ángeles'] }
];

/**
 * Multiplicador de delays: MAYOR = más lento (Zen 2x pausa, Fast 0.25x lectura rápida).
 */
export const READING_SPEEDS = [
    { label: 'Zen', multiplier: 2.0 },
    { label: 'Norm', multiplier: 1.0 },
    { label: 'Fast', multiplier: 0.25 }
];
