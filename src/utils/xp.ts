/**
 * XP combinada (público joven): capítulos + favoritos (topados) + racha.
 * Derivada 100% en cliente desde datos existentes: sin migración ni ledger.
 * Los HITOS semánticos (Pentateuco, NT, AT…) viven en `badges.ts`;
 * aquí solo progresión numérica: leer es lo que más cuenta.
 */

export const XP_PER_CHAPTER = 10;
export const XP_PER_FAVORITE = 2;
/** Tope anti-farmer: solo los 50 primeros favoritos dan XP. */
export const MAX_COUNTED_FAVORITES = 50;
export const XP_PER_STREAK_DAY = 5;

export interface XpInput {
    chapters: number;
    favorites: number;
    streak: number;
}

/** XP total. Idempotente por construcción: reeler no suma (sale de isChapterComplete). */
export function computeXP({ chapters, favorites, streak }: XpInput): number {
    const safe = (n: number) => (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);
    return (
        safe(chapters) * XP_PER_CHAPTER +
        Math.min(safe(favorites), MAX_COUNTED_FAVORITES) * XP_PER_FAVORITE +
        safe(streak) * XP_PER_STREAK_DAY
    );
}

export interface XpLevel {
    min: number;
    title: string;
    rank: string;
    color: string;
    icon: string;
    textColor?: string;
}

/** 20 niveles: gancho en la 1.ª sesión (Nv.2 ≈ 2 caps + racha), gesta final 8500→11500. */
export const XP_LEVELS: XpLevel[] = [
    { min: 0, title: 'Novato', rank: 'Nivel 1', color: '#EFE9DE', icon: 'N' },
    { min: 25, title: 'Despertar', rank: 'Nivel 2', color: '#E9E1D1', icon: 'D' },
    { min: 80, title: 'Chispa', rank: 'Nivel 3', color: '#E2D5C0', icon: 'C' },
    { min: 180, title: 'Ritmo', rank: 'Nivel 4', color: '#D9C7AC', icon: 'R' },
    { min: 320, title: 'Impulso', rank: 'Nivel 5', color: '#CFB795', icon: 'I' },
    { min: 500, title: 'Constante', rank: 'Nivel 6', color: '#C2A67E', icon: 'C' },
    { min: 720, title: 'Raíces', rank: 'Nivel 7', color: '#B39467', icon: 'R' },
    { min: 980, title: 'Atalaya', rank: 'Nivel 8', color: '#FFD600', icon: 'A' },
    { min: 1280, title: 'Centinela', rank: 'Nivel 9', color: '#F9CE2B', icon: 'C' },
    { min: 1620, title: 'Discípulo', rank: 'Nivel 10', color: '#F4C245', icon: 'D' },
    { min: 2000, title: 'Guardián', rank: 'Nivel 11', color: '#EFB439', icon: 'G' },
    { min: 2450, title: 'Mensajero', rank: 'Nivel 12', color: '#EAA52C', icon: 'M' },
    { min: 2950, title: 'Embajador', rank: 'Nivel 13', color: '#E09520', icon: 'E' },
    { min: 3500, title: 'Héroe', rank: 'Nivel 14', color: '#D58514', icon: 'H' },
    { min: 4100, title: 'Titán', rank: 'Nivel 15', color: '#C9760C', icon: 'T' },
    { min: 4750, title: 'Leyenda', rank: 'Nivel 16', color: '#B86708', icon: 'L' },
    { min: 5450, title: 'Faro', rank: 'Nivel 17', color: '#A65806', icon: 'F' },
    { min: 6300, title: 'Testigo', rank: 'Nivel 18', color: '#8F4A05', icon: 'T' },
    { min: 8500, title: 'Elegido', rank: 'Nivel 19', color: '#6B3804', icon: 'E', textColor: 'text-white' },
    { min: 11500, title: 'Ungido', rank: 'Nivel 20', color: '#141413', icon: 'U', textColor: 'text-white' },
];

/** Techo calibrado: la Biblia entera (1189×10 = 11890) lo alcanza incluso sin racha ni favs. */
export const MAX_XP_GOAL = 11500;

export interface XpLevelResult extends XpLevel {
    nextTitle?: string;
    nextMin?: number;
    progress: number;
}

/** Función pura: nivel por XP total. */
export const getLevelByXP = (xp: number): XpLevelResult => {
    const safe = Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0;
    const current = [...XP_LEVELS].reverse().find((l) => safe >= l.min) || XP_LEVELS[0];
    const nextIdx = XP_LEVELS.indexOf(current) + 1;
    const next = XP_LEVELS[nextIdx];

    const progress = next
        ? ((safe - current.min) / (next.min - current.min)) * 100
        : 100;

    return { ...current, nextTitle: next?.title, nextMin: next?.min, progress };
};
