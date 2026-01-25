import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['src/**/*.test.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ShimmerReact',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'esm.js' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@shimmer-from-structure/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@shimmer-from-structure/core': 'ShimmerCore',
        },
      },
    },
  },
});
