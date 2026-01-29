import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // comment this out on build
  //webpack: (config: any) => {
    // WSL2-specific file watching fix
    //config.watchOptions = {
      //poll: 1000,       // Check for changes every 1 second
      //aggregateTimeout: 300, // Wait 300ms before rebuilding
      //ignored: [
      //  '**/.git/**',
      //  '**/.next/**',
      //  '**/node_modules/**',
      //  '**/.swc/**'
     // ]
    //};
    //return config;
  //},
  
  // set to true on build
  //reactStrictMode: true,
  reactStrictMode: true,
  turbopack: {}, // ✅ THIS LINE FIXES THE BUILD

  images: {
    remotePatterns: [
      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },

      // Pexels
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },

      // Pixabay
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },

      // Lorem Picsum (placeholders)
      {
        protocol: "https",
        hostname: "picsum.photos",
      },

      // UI Avatars
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },

      // GitHub avatars (very common for dev blogs)
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "br.freepik.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      }
    ],
  },
};

export default nextConfig;