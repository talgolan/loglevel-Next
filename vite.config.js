import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/loglevel-Next.js", // Entry file
      name: "loglevelNext",
      fileName: (format) => `loglevel-next.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [], // Keep ramda as an external dependency
      output: {
        globals: {
          ramda: "R",
        },
        exports: "named",
      },
    },
  },
  resolve: {
    alias: {
      ramda: "ramda/es/index.js",
    },
  },
  optimizeDeps: {
    include: ["ramda"], // Pre-bundle Ramda for development
  },
});
/*
import { defineConfig } from "vite";
import { terser } from "rollup-plugin-terser";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/loglevel-Next.js", // Path to your main file
      name: "loglevelNext", // Global variable name
      fileName: (format) => `loglevel-next.${format}.js`, // File name template
      formats: ["es", "umd"], // Output formats
    },
    rollupOptions: {
      plugins: [terser()], // Use Terser for minification
      output: {
        exports: "named", // Suppress warnings about named exports
      },
    },
    outDir: "dist", // Output directory
    sourcemap: true,
  },
  resolve: {
    alias: {
      ramda: "ramda/es/index.js", // Optional: Use the ES module version
    },
  },
});
*/

/*
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/loglevel-Next.js", // Path to your input file
      name: "loglevelNext", // Global variable for UMD build
      fileName: (format) => `loglevel-next.${format}.js`, // File name template
      formats: ["es", "umd"], // ESM and UMD formats
    },
    minify: "esbuild", // Enable minification (default esbuild)
    rollupOptions: {
      external: [],
      output: {
        exports: "named", // Suppress warnings about named exports
      },
    },
    outDir: "dist", // Output directory
    reportCompressedSize: true,
  },
  resolve: {
    alias: {
      ramda: "ramda/es/index.js", // Optional: Use the ES module version
    },
  },
});
*/
