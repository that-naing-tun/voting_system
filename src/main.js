import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";
import "swiper/swiper-bundle.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Import Toastification styles

const app = createApp(App);

// Use router and Toastification
app.use(router);
app.use(Toast);

app.mount("#app");
