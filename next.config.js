/** @type {import('next').NextConfig} */
const nextConfig = {
    // Vercel + output:'standalone' + Next 16.3 = ENOENT next-server.js.nft.json
    // en onBuildComplete (upstream vercel/next.js#96646). En Vercel se usa su
    // output normal (VERCEL=1 lo pone la plataforma); standalone solo local/Docker.
    output: process.env.VERCEL ? undefined : 'standalone',
    async headers() {
        return [
            {
                // Corpus de capítulos (JSON) servido por fetch de cliente.
                source: '/data/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                ],
            },
        ];
    },
};

export default nextConfig;
