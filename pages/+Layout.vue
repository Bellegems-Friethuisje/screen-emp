<!-- https://vike.dev/Layout -->

<template>
  <Content><slot /></Content>
</template>

<script lang="ts" setup>
import Content from "../components/Content.vue";
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background: #000;
}
* {
  box-sizing: border-box;
}
</style>
