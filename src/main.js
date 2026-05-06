import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import router from './router'
import App from './App.vue'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './css/app.scss'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(Quasar, {
    plugins: {
      Notify,
    },
  })
  .mount('#q-app')
