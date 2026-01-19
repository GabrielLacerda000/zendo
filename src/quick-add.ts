import { createApp } from "vue";
import { createPinia } from "pinia";
import QuickAddWindow from "./modules/quick-add/QuickAddWindow.vue";
import './style.css'

const app = createApp(QuickAddWindow);
const pinia = createPinia();

app.use(pinia);
app.mount("#quick-add");
