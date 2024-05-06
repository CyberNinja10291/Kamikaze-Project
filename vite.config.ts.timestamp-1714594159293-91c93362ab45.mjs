// vite.config.ts
import { defineConfig } from "file:///E:/Test/KAMIKAZE/vite-React/Kamikaze%20ProjectF/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Test/KAMIKAZE/vite-React/Kamikaze%20ProjectF/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { NodeGlobalsPolyfillPlugin } from "file:///E:/Test/KAMIKAZE/vite-React/Kamikaze%20ProjectF/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import { NodeModulesPolyfillPlugin } from "file:///E:/Test/KAMIKAZE/vite-React/Kamikaze%20ProjectF/node_modules/@esbuild-plugins/node-modules-polyfill/dist/index.js";
import { nodePolyfills } from "file:///E:/Test/KAMIKAZE/vite-React/Kamikaze%20ProjectF/node_modules/vite-plugin-node-polyfills/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [nodePolyfills(), react()],
  server: {
    host: "127.0.0.1"
  },
  // define: {
  //   global: "globalThis",
  // },
  resolve: {
    alias: {
      // Provide aliases for node modules
      "node:stream": "stream-browserify",
      crypto: "crypto-browserify",
      zlib: "browserify-zlib"
    }
    //   alias: {
    //     // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
    //     // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
    //     // process and buffer are excluded because already managed
    //     // by node-globals-polyfill
    //     util: "rollup-plugin-node-polyfills/polyfills/util",
    //     sys: "util",
    //     events: "rollup-plugin-node-polyfills/polyfills/events",
    //     stream: "rollup-plugin-node-polyfills/polyfills/stream",
    //     path: "rollup-plugin-node-polyfills/polyfills/path",
    //     querystring: "rollup-plugin-node-polyfills/polyfills/qs",
    //     punycode: "rollup-plugin-node-polyfills/polyfills/punycode",
    //     url: "rollup-plugin-node-polyfills/polyfills/url",
    //     string_decoder: "rollup-plugin-node-polyfills/polyfills/string-decoder",
    //     http: "rollup-plugin-node-polyfills/polyfills/http",
    //     https: "rollup-plugin-node-polyfills/polyfills/http",
    //     os: "rollup-plugin-node-polyfills/polyfills/os",
    //     assert: "rollup-plugin-node-polyfills/polyfills/assert",
    //     constants: "rollup-plugin-node-polyfills/polyfills/constants",
    //     _stream_duplex:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
    //     _stream_passthrough:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
    //     _stream_readable:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
    //     _stream_writable:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
    //     _stream_transform:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
    //     timers: "rollup-plugin-node-polyfills/polyfills/timers",
    //     console: "rollup-plugin-node-polyfills/polyfills/console",
    //     vm: "rollup-plugin-node-polyfills/polyfills/vm",
    //     zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
    //     tty: "rollup-plugin-node-polyfills/polyfills/tty",
    //     domain: "rollup-plugin-node-polyfills/polyfills/domain",
    //   },
  },
  optimizeDeps: {
    // disabled: false,
    // esbuildOptions: {
    //   plugins: [NodeGlobalsPolyfillPlugin()],
    // },
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    reportCompressedSize: true,
    outDir: "build",
    sourcemap: true,
    chunkSizeWarningLimit: 99999,
    rollupOptions: {
      external: ["@datadog/browser-rum"]
    }
  }
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxUZXN0XFxcXEtBTUlLQVpFXFxcXHZpdGUtUmVhY3RcXFxcS2FtaWthemUgUHJvamVjdEZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFRlc3RcXFxcS0FNSUtBWkVcXFxcdml0ZS1SZWFjdFxcXFxLYW1pa2F6ZSBQcm9qZWN0RlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovVGVzdC9LQU1JS0FaRS92aXRlLVJlYWN0L0thbWlrYXplJTIwUHJvamVjdEYvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgTm9kZUdsb2JhbHNQb2x5ZmlsbFBsdWdpbiB9IGZyb20gXCJAZXNidWlsZC1wbHVnaW5zL25vZGUtZ2xvYmFscy1wb2x5ZmlsbFwiO1xuaW1wb3J0IHsgTm9kZU1vZHVsZXNQb2x5ZmlsbFBsdWdpbiB9IGZyb20gXCJAZXNidWlsZC1wbHVnaW5zL25vZGUtbW9kdWxlcy1wb2x5ZmlsbFwiO1xuaW1wb3J0IHJvbGx1cE5vZGVQb2x5RmlsbCBmcm9tIFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxsc1wiO1xuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxsc1wiO1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW25vZGVQb2x5ZmlsbHMoKSwgcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMTI3LjAuMC4xXCIsXG4gIH0sXG4gIC8vIGRlZmluZToge1xuICAvLyAgIGdsb2JhbDogXCJnbG9iYWxUaGlzXCIsXG4gIC8vIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBub2RlIG1vZHVsZXNcbiAgICAgIFwibm9kZTpzdHJlYW1cIjogXCJzdHJlYW0tYnJvd3NlcmlmeVwiLFxuICAgICAgY3J5cHRvOiBcImNyeXB0by1icm93c2VyaWZ5XCIsXG4gICAgICB6bGliOiBcImJyb3dzZXJpZnktemxpYlwiLFxuICAgIH0sXG4gICAgLy8gICBhbGlhczoge1xuICAgIC8vICAgICAvLyBUaGlzIFJvbGx1cCBhbGlhc2VzIGFyZSBleHRyYWN0ZWQgZnJvbSBAZXNidWlsZC1wbHVnaW5zL25vZGUtbW9kdWxlcy1wb2x5ZmlsbCxcbiAgICAvLyAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1vcnNlcy9lc2J1aWxkLXBsdWdpbnMvYmxvYi9tYXN0ZXIvbm9kZS1tb2R1bGVzLXBvbHlmaWxsL3NyYy9wb2x5ZmlsbHMudHNcbiAgICAvLyAgICAgLy8gcHJvY2VzcyBhbmQgYnVmZmVyIGFyZSBleGNsdWRlZCBiZWNhdXNlIGFscmVhZHkgbWFuYWdlZFxuICAgIC8vICAgICAvLyBieSBub2RlLWdsb2JhbHMtcG9seWZpbGxcbiAgICAvLyAgICAgdXRpbDogXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy91dGlsXCIsXG4gICAgLy8gICAgIHN5czogXCJ1dGlsXCIsXG4gICAgLy8gICAgIGV2ZW50czogXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9ldmVudHNcIixcbiAgICAvLyAgICAgc3RyZWFtOiBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3N0cmVhbVwiLFxuICAgIC8vICAgICBwYXRoOiBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3BhdGhcIixcbiAgICAvLyAgICAgcXVlcnlzdHJpbmc6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvcXNcIixcbiAgICAvLyAgICAgcHVueWNvZGU6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvcHVueWNvZGVcIixcbiAgICAvLyAgICAgdXJsOiBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3VybFwiLFxuICAgIC8vICAgICBzdHJpbmdfZGVjb2RlcjogXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9zdHJpbmctZGVjb2RlclwiLFxuICAgIC8vICAgICBodHRwOiBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL2h0dHBcIixcbiAgICAvLyAgICAgaHR0cHM6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvaHR0cFwiLFxuICAgIC8vICAgICBvczogXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9vc1wiLFxuICAgIC8vICAgICBhc3NlcnQ6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvYXNzZXJ0XCIsXG4gICAgLy8gICAgIGNvbnN0YW50czogXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9jb25zdGFudHNcIixcbiAgICAvLyAgICAgX3N0cmVhbV9kdXBsZXg6XG4gICAgLy8gICAgICAgXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9yZWFkYWJsZS1zdHJlYW0vZHVwbGV4XCIsXG4gICAgLy8gICAgIF9zdHJlYW1fcGFzc3Rocm91Z2g6XG4gICAgLy8gICAgICAgXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9yZWFkYWJsZS1zdHJlYW0vcGFzc3Rocm91Z2hcIixcbiAgICAvLyAgICAgX3N0cmVhbV9yZWFkYWJsZTpcbiAgICAvLyAgICAgICBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZVwiLFxuICAgIC8vICAgICBfc3RyZWFtX3dyaXRhYmxlOlxuICAgIC8vICAgICAgIFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvcmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlXCIsXG4gICAgLy8gICAgIF9zdHJlYW1fdHJhbnNmb3JtOlxuICAgIC8vICAgICAgIFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvcmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybVwiLFxuICAgIC8vICAgICB0aW1lcnM6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvdGltZXJzXCIsXG4gICAgLy8gICAgIGNvbnNvbGU6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvY29uc29sZVwiLFxuICAgIC8vICAgICB2bTogXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy92bVwiLFxuICAgIC8vICAgICB6bGliOiBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3psaWJcIixcbiAgICAvLyAgICAgdHR5OiBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3R0eVwiLFxuICAgIC8vICAgICBkb21haW46IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvZG9tYWluXCIsXG4gICAgLy8gICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICAvLyBkaXNhYmxlZDogZmFsc2UsXG4gICAgLy8gZXNidWlsZE9wdGlvbnM6IHtcbiAgICAvLyAgIHBsdWdpbnM6IFtOb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luKCldLFxuICAgIC8vIH0sXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIC8vIE5vZGUuanMgZ2xvYmFsIHRvIGJyb3dzZXIgZ2xvYmFsVGhpc1xuICAgICAgZGVmaW5lOiB7XG4gICAgICAgIGdsb2JhbDogXCJnbG9iYWxUaGlzXCIsXG4gICAgICB9LFxuICAgICAgLy8gRW5hYmxlIGVzYnVpbGQgcG9seWZpbGwgcGx1Z2luc1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICBOb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luKHtcbiAgICAgICAgICBwcm9jZXNzOiB0cnVlLFxuICAgICAgICAgIGJ1ZmZlcjogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICAgIE5vZGVNb2R1bGVzUG9seWZpbGxQbHVnaW4oKSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcbiAgICBvdXREaXI6IFwiYnVpbGRcIixcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA5OTk5OSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1wiQGRhdGFkb2cvYnJvd3Nlci1ydW1cIl0sXG4gICAgfSxcbiAgfSxcbiAgLy8gYnVpbGQ6IHtcbiAgLy8gICBjb21tb25qc09wdGlvbnM6IHtcbiAgLy8gICAgIGluY2x1ZGU6IFtdLFxuICAvLyAgIH0sXG4gIC8vIH0sXG4gIC8vIGJ1aWxkOiB7XG4gIC8vICAgcm9sbHVwT3B0aW9uczoge1xuICAvLyAgICAgcGx1Z2luczogW1xuICAvLyAgICAgICAvLyBFbmFibGUgcm9sbHVwIHBvbHlmaWxscyBwbHVnaW5cbiAgLy8gICAgICAgLy8gdXNlZCBkdXJpbmcgcHJvZHVjdGlvbiBidW5kbGluZ1xuICAvLyAgICAgICByb2xsdXBOb2RlUG9seUZpbGwoKSxcbiAgLy8gICAgIF0sXG4gIC8vICAgfSxcbiAgLy8gfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVSxTQUFTLG9CQUFvQjtBQUNsVyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxpQ0FBaUM7QUFDMUMsU0FBUyxpQ0FBaUM7QUFFMUMsU0FBUyxxQkFBcUI7QUFDOUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7QUFBQSxFQUNsQyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxlQUFlO0FBQUEsTUFDZixRQUFRO0FBQUEsTUFDUixNQUFNO0FBQUEsSUFDUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBcUNGO0FBQUEsRUFDQSxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtaLGdCQUFnQjtBQUFBO0FBQUEsTUFFZCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsTUFDVjtBQUFBO0FBQUEsTUFFQSxTQUFTO0FBQUEsUUFDUCwwQkFBMEI7QUFBQSxVQUN4QixTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVixDQUFDO0FBQUEsUUFDRCwwQkFBMEI7QUFBQSxNQUM1QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxzQkFBc0I7QUFBQSxJQUN0QixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCx1QkFBdUI7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsc0JBQXNCO0FBQUEsSUFDbkM7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWVGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
