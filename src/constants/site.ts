/**
 * URL canónica del sitio. En producción definir NEXT_PUBLIC_SITE_URL
 * si el dominio cambia; el fallback es el dominio propio del proyecto.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aletheiachat.johan.cl';
