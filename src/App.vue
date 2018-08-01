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
body,
#app {
  height: 100%;
}
body {
  margin: 0;
}
.material-icons {
  font-size: 50px !important;
}
.highlight {
  background-color: orange;
}
</style>
