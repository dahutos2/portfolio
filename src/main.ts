import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'
import 'github-markdown-css/github-markdown-light.css'

createApp(App).use(createPinia()).mount('#app')
