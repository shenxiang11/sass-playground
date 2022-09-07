<script lang="ts" setup>
import ReactiveCounter from '/@/components/ReactiveCounter.vue';
import ReactiveHash from '/@/components/ReactiveHash.vue';
import ElectronVersions from '/@/components/ElectronVersions.vue';
import VEditor from '/@/components/VEditor.vue';
import {getAllScssFiles} from '#preload';
import {onMounted, ref} from 'vue';

const scssFiles = ref<string[]>([])

onMounted(() => {
  getAllScssFiles().then(res => {
    console.log(res);
    scssFiles.value = res.filenames;
  });
})

</script>

<template>

  {{JSON.stringify(scssFiles)}}

  <v-editor />
  <fieldset>
    <legend>Test Vue Reactivity</legend>
    <reactive-counter />
  </fieldset>

  <fieldset>
    <legend>Test Node.js API</legend>
    <reactive-hash />
  </fieldset>

  <fieldset>
    <legend>Environment</legend>
    <electron-versions />
  </fieldset>
</template>

<style>
fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
