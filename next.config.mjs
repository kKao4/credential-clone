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
        hostname: "okhub.vn",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false
};

export default nextConfig;
