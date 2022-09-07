<script lang="ts" setup>
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import {onMounted, ref} from 'vue';
import { readFile } from '#preload';

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

const editorRef = ref()

onMounted(async () => {
  const content = await readFile('/Users/xiang.shen/.shenxiang-sass-playground/extend.scss');
  console.log(content.toString());
  const editor = monaco.editor.create(editorRef.value, {
    value: content.toString(),
    language: 'scss',
  })

  editor.onDidChangeModelContent((e) => {
    console.log(editor.getValue())
  })
})

</script>

<template>
  <div ref="editorRef" class="v-editor"></div>
</template>

<style scoped>
.v-editor {
  width: 300px;
  height: 300px;
}
</style>
