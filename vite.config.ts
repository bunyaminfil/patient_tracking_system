import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset({ target: '18' })] })
  ],
  // React Compiler (target 18) çıktısı bu runtime'ı import eder; ön-paketlemeye dahil et.
  optimizeDeps: {
    include: ['react-compiler-runtime'],
  },
})
