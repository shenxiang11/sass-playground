import {createApp} from 'vue';
import 'highlight.js/styles/github.css';
import App from '/@/App.vue';
import {readdirSync, setupRootFolder, setupSassTemplate, workspace } from '#preload';
import css from 'highlight.js/lib/languages/css';
import hljs from 'highlight.js';

hljs.registerLanguage('css', css);

setupRootFolder();

// setupSassTemplate().then(res => {
//   console.log(res)
// });

console.log(readdirSync(workspace));

createApp(App).mount('#app');
