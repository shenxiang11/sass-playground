import {createApp} from 'vue';
import 'highlight.js/styles/github.css';
import App from '/@/App.vue';
import {setupRootFolder, setupSassTemplate} from '#preload';
import css from 'highlight.js/lib/languages/css';
import hljs from 'highlight.js';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

hljs.registerLanguage('css', css);

setupRootFolder();
setupSassTemplate();

const app = createApp(App);
app.use(ElementPlus);

app.mount('#app');
