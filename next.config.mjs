/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "swiperjs.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "credential.okhub-tech.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/vi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
