import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineConfig({
  plugins: [
    nodePolyfills({
      exclude: ["fs"],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    react(),
  ],
  server: {
    host: "127.0.0.1",
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      // Provide aliases for node modules
      crypto: "crypto-browserify",
      zlib: "browserify-zlib",
      process: "process/browser",
      path: "path-browserify",
      os: "os-browserify",
      stream: "stream-browserify",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          // process: true,
          buffer: true,
        }),
      ],
    },
  },
  // build: {
  //   reportCompressedSize: true,
  //   // outDir: "build",
  //   sourcemap: true,
  //   chunkSizeWarningLimit: 99999,
  //   // rollupOptions: {
  //   //   external: ["@datadog/browser-rum"],
  //   // },
  //   commonjsOptions: {
  //     transformMixedEsModules: true,
  //   },
  // },
});
