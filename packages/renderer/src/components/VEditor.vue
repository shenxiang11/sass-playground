<script lang="ts" setup>
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import {computed, nextTick, onMounted, ref} from 'vue';
import {readFile, compileString, getAllScssFiles, workspace} from '#preload';
import highlightPlugin from "@highlightjs/vue-plugin";

// @ts-ignore
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
  }
};

const highlightjs = highlightPlugin.component;


const scssFiles = ref<string[]>([])

const editorRef = ref();
const content = ref('');

const compiledContent = computed(() => {
  const css = compileString(content.value).css;
  return css;
});

let editor: any;

onMounted(async () => {
  await nextTick();

  editor = monaco.editor.create(editorRef.value, {
    language: 'scss',
  });

  editor.onDidChangeModelContent((e) => {
    content.value = editor.getValue();
  });

  getAllScssFiles().then(async res => {
    scssFiles.value = res.filenames;

    if (res.filenames.length !== 0) {
      const contentFromFile = await readFile(`${workspace}/${res.filenames[0]}`, { encoding: 'utf8' });
      content.value = contentFromFile.toString();
      editor.setValue(content.value);
    }
  });
})

async function change(item: string) {
  const contentFromFile = await readFile(`${workspace}/${item}`, { encoding: 'utf8' });
  content.value = contentFromFile.toString();
  editor?.setValue(content.value);
}
</script>

<template>
  <div v-for="item in scssFiles" :key="item" @click="change(item)">{{item}}</div>
  <div class="editor-container">
    <div ref="editorRef" class="main-editor"></div>
    <highlightjs
      class="result-preview"
      language="css"
      :code="compiledContent"
    />
  </div>
</template>

<style lang="scss" scoped>
.editor-container {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  .main-editor {
    width: 0;
    flex-shrink: 0;
    flex-grow: 1;
  }
  .result-preview {
    width: 0;
    flex-shrink: 0;
    flex-grow: 1;
  }
}
</style>
