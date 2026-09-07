import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SITE_URL } from '../src/constants/site';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-grotesk',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Aletheia Chat — Lectura bíblica conversacional',
        template: '%s | Aletheia Chat',
    },
    description: 'Experiencia bíblica conversacional e inmersiva',
    applicationName: 'Aletheia Chat',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: '/',
        siteName: 'Aletheia Chat',
        title: 'Aletheia Chat — Lectura bíblica conversacional',
        description: 'Experiencia bíblica conversacional e inmersiva',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aletheia Chat — Lectura bíblica conversacional',
        description: 'Experiencia bíblica conversacional e inmersiva',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Aletheia Chat',
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: '#FFD600',
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={`h-full overflow-hidden selection:bg-yellow-200 ${inter.variable} ${spaceGrotesk.variable}`}>
            <head>
                <link rel="preload" href="/sounds/pop.mp3" as="audio" type="audio/mpeg" />
            </head>
            <body className="h-full overflow-hidden bg-white text-[#0A0A0A] antialiased touch-manipulation">
                <div id="root" className="h-full overflow-hidden">{children}</div>
            </body>
        </html>
    );
}
