import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';



import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css';


import BootstrapVue3 from 'bootstrap-vue-3'


const app = createApp(App)

app.use(router)
app.use(BootstrapVue3)
app.mount('#app')
app.use(store);
