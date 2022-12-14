<script lang="ts" setup>
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import {nextTick, onMounted, ref} from 'vue';
import {readFile, getAllScssFiles, workspace, writeScssFileAndCompile} from '#preload';
import highlightPlugin from '@highlightjs/vue-plugin';

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

const highlightjs = highlightPlugin.component;

const scssFiles = ref<string[]>([]);

const editorRef = ref();
const content = ref('');

const compiledContent = ref('');

const activeScssFile = ref('');

let editor: any;

onMounted(async () => {
  await nextTick();

  editor = monaco.editor.create(editorRef.value, {
    language: 'scss',
  });

  editor.onDidChangeModelContent(() => {
    content.value = editor.getValue();
  });

  getAllScssFiles().then(async res => {
    scssFiles.value = res.filenames;

    if (res.filenames.length !== 0) {
      const contentFromFile = await readFile(`${workspace}/${res.filenames[0]}`, {
        encoding: 'utf8',
      });
      content.value = contentFromFile.toString();
      editor.setValue(content.value);
      activeScssFile.value = res.filenames[0];
    }
  });
});

async function handleScssFileChange(name: string) {
  const contentFromFile = await readFile(`${workspace}/${name}`, {encoding: 'utf8'});
  content.value = contentFromFile.toString();
  editor?.setValue(content.value);
  compiledContent.value = '';
}

async function saveAndCompile() {
  const result = await writeScssFileAndCompile(activeScssFile.value, editor?.getValue() ?? '', {
    autoprefixer: {
      overrideBrowserslist: ['>0.02%', 'not dead'],
    },
  });
  compiledContent.value = result;
}
</script>

<template>
  <div class="container">
    <div class="tab-wrapper">
      <el-tabs
        v-model="activeScssFile"
        class="tab-main"
        @tab-change="handleScssFileChange"
      >
        <el-tab-pane
          v-for="item in scssFiles"
          :key="item"
          :label="item"
          :name="item"
        />
      </el-tabs>
      <div class="tab-right-action">
        <el-button
          type="primary"
          size="small"
          @click="saveAndCompile"
        >
          ??????
        </el-button>
        <el-button size="small">??????</el-button>
      </div>
    </div>
    <div class="editor-container">
      <div
        ref="editorRef"
        class="main-editor"
      ></div>
      <highlightjs
        class="result-preview"
        language="css"
        :code="compiledContent"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .tab-wrapper {
    flex-shrink: 0;
    display: flex;

    .tab-main {
      width: 0;
      flex-grow: 1;
      margin-bottom: 0;
    }

    .tab-right-action {
      padding: 0 15px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .editor-container {
    height: 0;
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    .main-editor {
      width: 0;
      flex-shrink: 0;
      flex-grow: 5;
    }
    .result-preview {
      width: 0;
      flex-shrink: 0;
      flex-grow: 4;
    }
  }
}
</style>
