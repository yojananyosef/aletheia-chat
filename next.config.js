/** @type {import('next').NextConfig} */
const nextConfig = {
    // Vercel + output:'standalone' + Next 16.3 = ENOENT next-server.js.nft.json
    // en onBuildComplete (upstream vercel/next.js#96646). En Vercel se usa su
    // output normal (VERCEL=1 lo pone la plataforma); standalone solo local/Docker.
    output: process.env.VERCEL ? undefined : 'standalone',
};

export default nextConfig;
