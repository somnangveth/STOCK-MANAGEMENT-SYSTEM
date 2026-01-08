//  @type {import('next').NextConfig} 
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xhfsyrdqmaxuhqbnhttj.supabase.co',
        pathname: '**',
      },
    ],
  },
  experimental: {
  serverActions: {
    bodySizeLimit: '2mb'
  }
}
};

module.exports = nextConfig;
