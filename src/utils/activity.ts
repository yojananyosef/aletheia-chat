/** "hace X" corto en español para la lista de chats. */
export function timeAgo(iso: string, now: number = Date.now()): string {
    const diff = now - new Date(iso).getTime();
    if (!Number.isFinite(diff) || diff < 0) return 'ahora';
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'ahora';
    if (min < 60) return `hace ${min} min`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'ayer';
    if (days < 7) return `hace ${days} d`;
    return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

/** Clave de día local YYYY-MM-DD para rachas. */
export function toDateKey(d: Date): string {
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
}

/** Días consecutivos con lectura hasta hoy (hoy ausente: cuenta desde ayer). */
export function computeStreak(days: Record<string, unknown>, today: Date = new Date()): number {
    let streak = 0;
    const cursor = new Date(today);
    if (!days[toDateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while (days[toDateKey(cursor)]) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}
