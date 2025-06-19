import { defineConfig } from 'vite';
import path, { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (/\.(woff2?|ttf|eot|otf)$/.test(assetInfo.name ?? '')) {
            return 'fonts/[name][extname]';
          }
          return 'styles/[name][extname]';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: false,
    sourcemap: false,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tabler/icons-webfont': path.resolve(__dirname, 'node_modules/@tabler/icons-webfont'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        //additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },

  plugins: [
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: 'icon.png', dest: 'dist' },
        { src: 'node_modules/@tabler/icons-webfont/dist/fonts/*', dest: 'dist/fonts' },
      ],
      hook: 'writeBundle',
    }),
  ],
});
