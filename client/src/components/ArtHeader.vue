<template>
  <div class="row header">
    <div class="col-12">
      <div class="input-group">   
        <input 
          v-model.trim="textForSearch" 
          type="text" 
          class="form-control" 
          placeholder="Search" 
          @keyup.enter="findArticle()"
        >
        <span 
          class="input-group-btn" 
          @click="changeViewOfArticles()"
        >
          <i 
            class="material-icons" 
            :title="title"
          >{{ view }}</i>
        </span>
        <span 
          class="input-group-btn" 
          @click="updateSources()"
        >
          <i 
            id="sync" 
            :class="{rotate:isRotate}"
            class="material-icons" 
            title="Update your sources"
          >sync</i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      textForSearch: '',
      isRotate: false,
    };
  },
  computed: {
    view() {
      return this.viewList ? 'view_list' : 'view_headline';
    },
    viewList() {
      return this.$store.getters['userSources/viewList'];
    },
  },
  methods: {
    changeViewOfArticles() {
      this.$store.dispatch('userSources/changeViewOfArticles');
      this.title = this.viewList ? 'Change to title only view' : 'Change to magazine view';
    },
    updateSources() {
      this.isRotate = true;
      this.$store.dispatch('userSources/updateSources');
      setTimeout(() => {
        this.isRotate = false;
      }, 500);
    },
    findArticle() {
      if (this.textForSearch.length !== 0) {
        this.$store.dispatch('userSources/findArticle', this.textForSearch);
      }
      if (this.textForSearch.length === 0)
        this.$store.dispatch('userSources/findArticle', this.textForSearch);
    },
  },
};
</script>

<style scoped>
.header {
  margin-top: 10px;
  margin-bottom: 10px;
}
.header span {
  margin-left: 5px;
  cursor: pointer;
}
.rotate {
  -webkit-animation: spin 500ms linear;
  -moz-animation: spin 500ms linear;
  animation: spin 500ms linear;
}
@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
