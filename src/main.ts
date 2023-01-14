import { createApp } from 'vue'
import '@unocss/reset/tailwind.css'
import App from './App.vue'
import 'uno.css'
import '@/styles/global.scss'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)
createApp(App).mount('#app')
