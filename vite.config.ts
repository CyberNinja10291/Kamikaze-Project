import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  server: {
    host: "127.0.0.1",
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      // Provide aliases for node modules
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      zlib: "browserify-zlib",
    },
  },
  optimizeDeps: {
    // disabled: false,
    // esbuildOptions: {
    //   plugins: [NodeGlobalsPolyfillPlugin()],
    // },
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
        // NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    reportCompressedSize: true,
    // outDir: "build",
    sourcemap: true,
    chunkSizeWarningLimit: 99999,
    // rollupOptions: {
    //   external: ["@datadog/browser-rum"],
    // },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // build: {
  //   commonjsOptions: {
  //     include: [],
  //   },
  // },
  // build: {
  //   rollupOptions: {
  //     plugins: [
  //       // Enable rollup polyfills plugin
  //       // used during production bundling
  //       rollupNodePolyFill(),
  //     ],
  //   },
  // },
});
