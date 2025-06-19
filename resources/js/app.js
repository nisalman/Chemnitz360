/*
import './bootstrap';
import { createApp } from 'vue';
//import './assets/main.css' // or './styles.css'
import Home from './components/Home.vue';
import MapComponent from './components/MapComponent.vue'

const app = createApp(MapComponent); // Use Home.vue as the root component
app.mount('#app');
*/




import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
