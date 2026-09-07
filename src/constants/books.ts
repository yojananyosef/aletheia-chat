import { BookInfo } from '../types/bible';

export const BIBLE_BOOKS: BookInfo[] = [
    // --- PENTATEUCO ---
    {
        id: 'genesis',
        name: 'Génesis',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
        category: 'Pentateuco',
        description: 'La creación, la caída y la promesa divina a los patriarcas.',
        participants: ['Dios', 'Narrador', 'Adán', 'Eva', 'Mujer', 'Serpiente', 'Caín', 'Noé', 'Abraham', 'Sara', 'Isaac', 'Jacob', 'José', 'Lot', 'Agar', 'Rebeca', 'Esaú', 'Labán', 'Lea', 'Raquel', 'Judá', 'Ángel', 'Faraón', 'Melquisedec', 'Abimelec', 'Efrón', 'Hamor', 'Siquem', 'Rubén', 'Copero', 'Panadero', 'Criado', 'Mensajero', 'Pastores', 'Hermanos', 'Hijas', 'Parteras', 'Pueblo', 'Tamar', 'Hombre', 'Amigo', 'Esposa', 'Lamec', 'Hijos de Labán', 'Rey de Sodoma']
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
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
        category: 'Pentateuco',
        description: 'Leyes ceremoniales y santidad del pueblo de Dios.',
        participants: ['Dios', 'Narrador', 'Moisés', 'Aarón']
    },
    {
        id: 'numeros',
        name: 'Números',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
        category: 'Pentateuco',
        description: 'El censo y el vagabundeo de Israel por el desierto.',
        participants: ['Dios', 'Narrador', 'Moisés', 'Aarón', 'Josué', 'María', 'Pueblo', 'Multitud', 'Balaam', 'Balac', 'Coré', 'Caleb', 'Hobab', 'Edom', 'Eleazar', 'Asna', 'Mensajeros', 'Espías', 'Datán y Abiram', 'Israel', 'Gad y Rubén', 'Galaaditas', 'Capitanes', 'Hijas de Zelofehad', 'Joven', 'Príncipes', 'Hombres', 'Ángel']
    },
    {
        id: 'deuteronomio',
        name: 'Deuteronomio',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
        category: 'Pentateuco',
        description: 'Repetición de la ley y despedida de Moisés.',
        participants: ['Dios', 'Narrador', 'Moisés', 'Josué', 'Pueblo', 'Espías', 'Cuñado', 'Cuñada', 'Oficiales']
    },

    // --- HISTORIA ---
    { id: 'josue', name: 'Josué', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], category: 'Historia', description: 'La conquista de la Tierra Prometida.', participants: ['Dios', 'Narrador', 'Josué', 'Moisés', 'Rahab', 'Espías', 'Rey de Jericó', 'Hombres', 'Príncipe', 'Oficiales', 'Acán', 'Gabaonitas', 'Israel', 'Príncipes', 'Pueblo', 'Caleb', 'Acsa', 'Eleazar', 'Hijos de José', 'Levitas', 'Finees', 'Gad y Rubén', 'Hijas de Zelofehad'] },
    { id: 'jueces', name: 'Jueces', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], category: 'Historia', description: 'El ciclo de desobediencia y liberación de Israel.', participants: ['Dios', 'Narrador', 'Sansón', 'Judá', 'Israel', 'Adonibezec', 'Caleb', 'Acsa', 'Espías', 'Ángel', 'Aod', 'Eglón', 'Criado', 'Débora', 'Barac', 'Jael', 'Sísara', 'Madre de Sísara', 'Gedeón', 'Hombres', 'Joás', 'Pueblo', 'Madianita', 'Efraín', 'Abimelec', 'Jotam', 'Gaal', 'Zebul', 'Príncipes', 'Ancianos', 'Jefté', 'Rey de Amón', 'Hija de Jefté', 'Galaaditas', 'Manoa', 'Esposa de Manoa', 'Padres de Sansón', 'Filisteos', 'Dalila', 'Esposa de Sansón', 'Suegro', 'Levita', 'Micaía', 'Madre de Micaía', 'Danitas', 'Anciano', 'Benjamín'] },
    { id: 'rut', name: 'Rut', availableChapters: [1, 2, 3, 4], category: 'Historia', description: 'Una historia de redención y lealtad.', participants: ['Dios', 'Narrador', 'Rut', 'Booz', 'Noemí', 'Nueras', 'Criado', 'Segadores', 'Pariente', 'Ancianos', 'Mujeres', 'Pueblo'] },
    { id: '1samuel', name: '1 Samuel', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], category: 'Historia', description: 'El surgimiento de la monarquía en Israel.', participants: ['Dios', 'Narrador', 'Samuel', 'Elí', 'Ana', 'Elcana', 'Penina', 'Ofni', 'Finees', 'Saúl', 'Jonatán', 'David', 'Mical', 'Merab', 'Abner', 'Isaí', 'Eliab', 'Abinadab', 'Goliat', 'Filisteos', 'Aquís', 'Abigail', 'Nabal', 'Doeg', 'Ahimelec', 'Gad', 'Agag', 'Egipcio', 'Amalecita', 'Escudero', 'Pitonisa', 'Pueblo', 'Israel', 'Hombres', 'Ancianos', 'Criado', 'Mensajero', 'Mujeres', 'Esposa de Finees', 'Adivinos', 'Príncipes', 'Nahas', 'Tío de Saúl', 'Abisai', 'Galaaditas'] },
    { id: '2samuel', name: '2 Samuel', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], category: 'Historia', description: 'El reinado del rey David.', participants: ['Dios', 'Narrador', 'David', 'Natán', 'Joab', 'Absalón', 'Abner', 'Isboset', 'Amnón', 'Tamar', 'Jonadab', 'Husai', 'Ahitofel', 'Urías', 'Mefiboset', 'Siba', 'Simeí', 'Barzilai', 'Ahimaas', 'Arauna', 'Gad', 'Sadoc', 'Abiatar', 'Itai', 'Amasa', 'Seba', 'Mujer de Tecoa', 'Mujer sabia', 'Etíope', 'Amalecita', 'Gabaonitas', 'Asael', 'Mical', 'Israel', 'Judá', 'Pueblo', 'Hombres', 'Siervos', 'Jóvenes', 'Joven', 'Hombre', 'Mujer', 'Niños', 'Abisai', 'Príncipes', 'Mensajero', 'Recab', 'Baana', 'Rizpa', 'Jabes', 'Criado'] },
    { id: '1reyes', name: '1 Reyes', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], category: 'Historia', description: 'El esplendor de Salomón y la división del reino.', participants: ['Dios', 'Narrador', 'Salomón', 'David', 'Betsabé', 'Natán', 'Adonías', 'Jonatán', 'Benaía', 'Sadoc', 'Abiatar', 'Joab', 'Simeí', 'Hiram', 'Reina de Seba', 'Jeroboam', 'Roboam', 'Ahías', 'Esposa de Jeroboam', 'Varón de Dios', 'Profeta viejo', 'Profeta', 'Elías', 'Eliseo', 'Viuda', 'Acab', 'Jezabel', 'Abdías', 'Profetas de Baal', 'Criado', 'Ángel', 'Mensajero', 'Benadad', 'Ancianos', 'Siervos', 'Jóvenes', 'Hombres', 'Nabot', 'Faraón', 'Hadad', 'Micaías', 'Sedequías', 'Josafat', 'Rey de Siria', 'Capitanes', 'Ocozías', 'Pueblo', 'Israel', 'Mujer'] },
    { id: '2reyes', name: '2 Reyes', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], category: 'Historia', description: 'La caída de los reinos y el ministerio de Eliseo.', participants: ['Dios', 'Narrador', 'Eliseo', 'Elías', 'Giezi', 'Naamán', 'Sunamita', 'Joram', 'Josafat', 'Hazael', 'Benadad', 'Jehú', 'Jezabel', 'Jonadab', 'Atalía', 'Joiada', 'Ezequías', 'Rabsaces', 'Eliaquim', 'Hulda', 'Hilcías', 'Safán', 'Josías', 'Isaías', 'Senaquerib', 'Rey de Asiria', 'Gedalías', 'Joás', 'Acaz', 'Ocozías', 'Capitán', 'Viuda', 'Niño', 'Criado', 'Criada', 'Siervos', 'Profeta', 'Mujer', 'Mujeres', 'Hombres', 'Hombre', 'Mensajero', 'Mensajeros', 'Joven', 'Jóvenes', 'Príncipe', 'Moabitas', 'Pueblo', 'Israel', 'Judá', 'Ancianos', 'Ángel'] },
    { id: '1cronicas', name: '1 Crónicas', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], category: 'Historia', description: 'Genealogías y el legado de David.', participants: ['Dios', 'Narrador', 'David', 'Asaf', 'Natán', 'Gad', 'Joab', 'Saúl', 'Jabes', 'Amasai', 'Ornán', 'Israel', 'Judá', 'Jebuseos', 'Filisteos', 'Príncipes', 'Pueblo', 'Escudero', 'Ángel'] },
    { id: '2cronicas', name: '2 Crónicas', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], category: 'Historia', description: 'Desde Salomón hasta el exilio.', participants: ['Dios', 'Narrador', 'Salomón', 'Roboam', 'Jeroboam', 'Abías', 'Asa', 'Azarías', 'Hanani', 'Acab', 'Josafat', 'Micaías', 'Sedequías', 'Jehú', 'Jahaziel', 'Eliezer', 'Elías', 'Joiada', 'Atalía', 'Joás', 'Zacarías', 'Amasías', 'Oded', 'Acaz', 'Ezequías', 'Senaquerib', 'Rey de Siria', 'Hulda', 'Hilcías', 'Safán', 'Josías', 'Necao', 'Ciro', 'Hiram', 'Reina', 'Jóvenes', 'Ancianos', 'Príncipes', 'Pueblo', 'Profeta', 'Mensajero', 'Mensajeros', 'Sacerdotes', 'Cantores', 'Capitanes'] },
    { id: 'esdras', name: 'Esdras', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], category: 'Historia', description: 'El retorno del exilio y la reconstrucción del templo.', participants: ['Narrador', 'Esdras', 'Ciro', 'Darío', 'Artajerjes', 'Tatnai', 'Rehum', 'Zorobabel', 'Secanías', 'Ancianos', 'Príncipes', 'Pueblo', 'Adversarios', 'Profeta', 'Cantores'] },
    { id: 'nehemias', name: 'Nehemías', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], category: 'Historia', description: 'La reconstrucción de los muros de Jerusalén.', participants: ['Dios', 'Narrador', 'Nehemías', 'Artajerjes', 'Sanbalat', 'Tobías', 'Semaías', 'Hanani', 'Esdras', 'Levitas', 'Pueblo', 'Judá', 'Adversarios'] },
    { id: 'ester', name: 'Ester', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], category: 'Historia', description: 'La providencia divina salvando a su pueblo.', participants: ['Narrador', 'Ester', 'Mardoqueo', 'Asuero', 'Amán', 'Memucán', 'Zeres', 'Harbona', 'Criado'] },

    // --- POESÍA ---
    { id: 'job', name: 'Job', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], category: 'Poesía', description: 'El sufrimiento humano y la soberanía de Dios.', participants: ['Dios', 'Narrador', 'Job', 'Satán', 'Elifaz', 'Bildad', 'Zofar', 'Eliú', 'Esposa', 'Mensajero'] },
    { id: 'salmos', name: 'Salmos', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150], category: 'Poesía', description: 'Cánticos de adoración, lamento y esperanza.', participants: ['Dios', 'Narrador', 'David', 'Asaf', 'Impíos', 'Pueblos'] },
    { id: 'proverbios', name: 'Proverbios', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], category: 'Poesía', description: 'Sabiduría práctica para la vida.', participants: ['Dios', 'Narrador', 'Salomón', 'Sabiduría', 'Mujer insensata', 'Agur', 'Madre de Lemuel'] },
    { id: 'eclesiastes', name: 'Eclesiastés', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], category: 'Poesía', description: 'La búsqueda de significado bajo el sol.', participants: ['Dios', 'Narrador', 'Predicador'] },
    { id: 'cantares', name: 'Cantares', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8], category: 'Poesía', description: 'La belleza del amor humano y divino.', participants: ['Dios', 'Narrador', 'Amado', 'Amada', 'Hijas de Jerusalén', 'Hermanos'] },

    // --- PROFETAS MAYORES ---
    { id: 'isaias', name: 'Isaías', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66], category: 'Profetas Mayores', description: 'Visiones del Mesías y el juicio venidero.', participants: ['Dios', 'Narrador', 'Isaías', 'Serafines', 'Mujeres', 'Acaz', 'Rabsaces', 'Eliaquim', 'Siervos', 'Rey de Asiria', 'Ezequías', 'Jacob'] },
    { id: 'jeremias', name: 'Jeremías', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52], category: 'Profetas Mayores', description: 'El profeta llorón y el nuevo pacto.', participants: ['Dios', 'Narrador', 'Jeremías', 'Sedequías', 'Príncipes', 'Sacerdotes', 'Pueblo', 'Baruc', 'Hananías', 'Ebed-melec', 'Capitán', 'Gedalías', 'Azarías', 'Hombres', 'Ancianos'] },
    { id: 'lamentaciones', name: 'Lamentaciones', availableChapters: [1, 2, 3, 4, 5], category: 'Profetas Mayores', description: 'Duelo por la caída de Jerusalén.', participants: ['Dios', 'Narrador', 'Jeremías', 'Jerusalén', 'Pueblo', 'Niños', 'Sacerdotes', 'Enemigos'] },
    { id: 'ezequiel', name: 'Ezequiel', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], category: 'Profetas Mayores', description: 'Visiones de la gloria de Dios en el exilio.', participants: ['Dios', 'Narrador', 'Ezequiel', 'Pueblo', 'Ángel', 'Mensajero'] },
    { id: 'daniel', name: 'Daniel', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], category: 'Profetas Mayores', description: 'Fidelidad en Babilonia y visiones del fin.', participants: ['Dios', 'Narrador', 'Daniel', 'Nabucodonosor', 'Belsasar', 'Darío', 'Arioc', 'Caldeos', 'Príncipes', 'Sadrac', 'Reina', 'Eunuco', 'Ángel', 'Gabriel'] },

    // --- PROFETAS MENORES ---
    { id: 'oseas', name: 'Oseas', availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], category: 'Profetas Menores', description: 'El amor infalible de Dios.', participants: ['Dios', 'Narrador', 'Oseas', 'Efraín', 'Pueblo'] },
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
    {
        id: 'mateo', name: 'Mateo',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        category: 'Evangelios', description: 'El evangelio del Rey de los judíos.',
        participants: ['Dios', 'Narrador', 'Jesús', 'Mateo', 'Juan el Bautista', 'Ángel', 'Magos', 'Herodes', 'Hija de Herodías', 'Ancianos', 'Pedro', 'Andrés', 'Jacobo y Juan', 'Discípulos', 'Fariseos', 'Escribas', 'Saduceos', 'Sacerdotes', 'Sumo sacerdote', 'Caifás', 'Multitud', 'Judíos', 'Niños', 'Mujer', 'Hombre', 'Doctor', 'Jairo', 'Leproso', 'Ciego', 'Ciegos', 'Centurión', 'Publicanos', 'Demonio', 'Judas', 'Testigos', 'Pilato', 'Esposa de Pilato', 'Soldados', 'Criada', 'Mensajero']
    },
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
    {
        id: 'juan', name: 'Juan',
        availableChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        category: 'Evangelios', description: 'El Hijo de Dios entre nosotros.',
        participants: ['Dios', 'Narrador', 'Jesús', 'Juan el Bautista', 'Juan', 'Nicodemo', 'Samaritana', 'Pedro', 'Andrés', 'Felipe', 'Natanael', 'Tomás', 'Judas', 'Marta', 'María', 'Hombre', 'Mujer', 'Familiares', 'Ciego', 'Hermanos', 'Fariseos', 'Escribas', 'Saduceos', 'Sacerdotes', 'Caifás', 'Judíos', 'Multitud', 'Griegos', 'Pilato', 'Soldados', 'Alguaciles', 'Criado', 'Criada', 'Discípulos', 'Ángeles', 'Joven']
    },

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
