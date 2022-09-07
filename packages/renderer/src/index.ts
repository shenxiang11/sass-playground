import {createApp} from 'vue';
import App from '/@/App.vue';
import {readdirSync, setupRootFolder, setupSassTemplate, workspace } from '#preload';

setupRootFolder();

// setupSassTemplate().then(res => {
//   console.log(res)
// });

console.log(readdirSync(workspace));

createApp(App).mount('#app');
