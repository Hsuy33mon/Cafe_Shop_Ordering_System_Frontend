
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // if you have one


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)          
app.use(router)         
app.mount('#app')
