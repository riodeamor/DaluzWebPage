const assetVersion = require("node:crypto").randomUUID();
if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_GIT_COMMIT_REF === 'codex/entrega-admin-seo-delivered') {
  const ref = 'pdxgpfnxsewulpieqdrf';
  if (process.env.NEXT_PUBLIC_SUPABASE_URL !== `https://${ref}.supabase.co`) {
    throw new Error('Rehearsal build requires isolated Supabase');
  }
  for (const [name, role] of [['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon'], ['SUPABASE_SERVICE_ROLE_KEY', 'service_role']]) {
    try {
      const claims = JSON.parse(Buffer.from((process.env[name] || '').split('.')[1], 'base64url').toString());
      if (claims.ref !== ref || claims.role !== role) throw new Error('Wrong project or role');
    } catch { throw new Error('Rehearsal build requires isolated credentials'); }
  }
}
const {
  PublicAssetVersionPlugin,
} = require("./scripts/public-asset-version.cjs");
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/origen", destination: "/raices", permanent: true }];
  },
  experimental: {
    // typedRoutes: true, // Temporarily disabled
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source:
          "/:route(perfil|mis-pedidos|mis-tesoros|mi-membresia|checkout|carrito|admin)/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/tesoro-:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

module.exports = (phase) => {
  const { PHASE_PRODUCTION_BUILD } = require("next/constants");
  const fs = require("node:fs");
  const version =
    phase === PHASE_PRODUCTION_BUILD
      ? assetVersion
      : fs.existsSync(".next/BUILD_ID")
        ? fs.readFileSync(".next/BUILD_ID", "utf8").trim()
        : assetVersion;
  return {
    ...nextConfig,
    deploymentId: version,
    env: { NEXT_PUBLIC_ASSET_VERSION: version },
    generateBuildId: async () => version,
    webpack(config, { dev }) {
      if (!dev) config.plugins.push(new PublicAssetVersionPlugin(version));
      return config;
    },
  };
};
