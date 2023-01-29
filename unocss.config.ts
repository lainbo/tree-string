import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'
export default defineConfig({
  shortcuts: [
    {
      'page-card':
        'rounded-12px p-16px auto-bg shadow-[var(--page-card-shadow)] border border-#f2f3f4 dark:border-#444',
      'auto-bg': 'bg-#fff dark:bg-#2a2a2b',
      'flex-c': 'flex items-center justify-center',
      'flex-y-c': 'flex items-center',
      'grid-c': 'grid place-items-center',
      'absolute-x-center': 'absolute left-1/2 -translate-x-1/2',
      'absolute-y-center': 'absolute top-1/2 -translate-y-1/2',
      'absolute-center': 'absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
    },
    [/^horizontal-place-(.*)$/, ([, c]) => `flex items-center space-x-${c}`],
  ],
  presets: [
    presetWind(), // presetWind和presetUno的区别是，用presetWind的预设可以获得VS Code中windicss插件的提示，其他的都一样
    presetRemToPx(),
    presetAttributify(), // 属性化写法，如<div border="2 rounded blue-200" />
    presetIcons({
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'margin-top': '-1px',
      },
    }),
  ],
  theme: {
    colors: {
      primary: '#5b61ff',
    },
  },
  transformers: [
    transformerDirectives(), // 支持@apply text-center my-0 font-medium;这种写法
    transformerVariantGroup(), // <div class="hover:(bg-gray-400 font-medium) font-(light mono)"/>
  ],
  variants: [
    // 因为.scss文件里面,uno不能写"@apply !text-center"去表示 !importannt ,会报错
    // 这里为important写一种变体，让以"I_"开头的class也是important，兼容scss文件
    // 如：@apply I_text-center
    matcher => {
      if (!matcher.startsWith('I_')) {
        return matcher
      }
      return {
        matcher: matcher.slice(2),
        body: body => {
          body.forEach(v => {
            if (v[1]) {
              v[1] += ' !important'
            }
          })
          return body
        },
      }
    },
  ],
})
