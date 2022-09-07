<script lang="ts" setup>
import { compileString } from '#preload';

console.log(compileString(`
.div {
  .a {
    color: #fff;
  }
}
`))
</script>

<template>
  <button @click="count++"> count is: 0</button>
  <br /><br />
  <code>packages/renderer/src/components/ReactiveCounter.vue</code>
</template>
