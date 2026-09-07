import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Aletheia Chat',
        short_name: 'Aletheia Chat',
        description: 'Experiencia bíblica inmersiva y accesible',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#FFD600',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
