// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Évite les erreurs pour les modules Node.js natifs dans le navigateur
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         net: false,
//         tls: false,
//         crypto: false,
//         dns: false,
//         path: false,
//         stream: false,
//         http: false,
//         https: false,
//         zlib: false,
//         querystring: false,
//         buffer: false,
//         url: false,
//         string_decoder: false,
//         punycode: false,
//         util: false,
//         os: false,
//         constants: false,
//       };
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;











// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = nextConfig;