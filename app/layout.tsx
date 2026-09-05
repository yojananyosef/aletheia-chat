import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
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
    title: 'BIBLIA CHAT 📖',
    description: 'Experiencia bíblica inmersiva Neo-AIDA',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Biblia Chat',
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
