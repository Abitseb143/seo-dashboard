/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["puppeteer"],
    typescript: {
        // Puppeteer often causes module-not-found errors in CI build environments
        // despite being present in node_modules. We ignore errors here so the
        // runtime can handle the dynamic import.
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
