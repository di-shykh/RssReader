<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
  min-height: 100%;
}
body {
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
</style>
