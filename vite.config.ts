import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const pathSrc = path.resolve(__dirname, 'src')
export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      imports: ['vue', '@vueuse/core'],
      dts: 'src/typings/auto-imports.d.ts',
      vueTemplate: true,
    }),
    UnoCSS(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/typings/components.d.ts',
    }),
    DefineOptions(),
  ],
  resolve: {
    alias: {
      '@/': `${pathSrc}/`,
    },
  },
  build: {
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          dep: ['vue', '@vueuse/core', 'lodash-es'],
        },
      },
    },
  },
})
