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
            class="material-icons" 
            title="Update your sources"
            :class="{ rotate: isRotate }"
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
  -webkit-animation: spin 0.7s linear;
  -moz-animation: spin 0.7s linear;
  animation: spin 0.7s linear;
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
