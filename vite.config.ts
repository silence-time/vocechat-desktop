import react from "@vitejs/plugin-react";
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import svgr from "vite-plugin-svgr";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });

  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    resolve: {
      alias: {
        "@": path.join(__dirname, "src")
      }
    },
    plugins: [
      react(),
      svgr({
        // Set it to `true` to export React component as default.
        // Notice that it will override the default behavior of Vite.
        exportAsDefault: false,

        // svgr options: https://react-svgr.com/docs/options/
        svgrOptions: {
          // ...
        },

        // esbuild options, to transform jsx to js
        esbuildOptions: {
          // ...
        },

        //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include. By default all svg files will be included.
        include: "**/*.svg",

        //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
        exclude: ""
      }),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: "electron/main/index.ts",
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ "[startup] Electron App");
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {})
              }
            }
          }
        },
        {
          entry: "electron/preload/index.ts",
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined, // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {})
              }
            }
          }
        }
      ]),
      // Use Node.js API in the Renderer-process
      renderer()
    ],
    build: {
      sourcemap: false
    },
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port
        };
      })(),
    clearScreen: false
  };
});
