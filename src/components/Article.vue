<template>
  <div class="container">
    <div class="row header">
      <div class="col-3 date">{{getDate(article.date)}}</div>
      <h4 class="col-6">{{article.title}}</h4>
      <div class="col-3">
        <a @click.stop.prevent="markAsReadLater"><i id="icon" v-bind:class="classObj" aria-hidden="true"></i></a>
        <a @click.stop.prevent><i class="fa fa-share-alt fa-2x" aria-hidden="true"></i></a>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
      </div>
      <div class="col-8" v-html="deleteImgTagFromDescr(article.description)"></div>
      <div class="w-100"></div>
      <a :href=article.link target="_blank"  class="btn btn-primary col-md-4 offset-md-4">Visit website</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      article: this.$route.params.article
    };
  },
  watch: {
    $route(to, from) {
      this.article = to.params.article;
    }
  },
  computed: {
    sources() {
      return this.$store.getters['userSources/sources'];
    },
    categories() {
      return this.$store.getters['userSources/categories'];
    },
    readLater() {
      return this.article.readLater;
    },
    classObj() {
      return [this.article.readLater ? 'fas' : 'far', 'fa-bookmark', 'fa-2x']; //иконка меняется только после повторного открытия,а не динамически.this.article.readLater и класс меняется динамически. Что я делаю не так?
    }
  },
  methods: {
    deleteImgTagFromDescr(str) {
      return str.replace(/<img[^>]*>/gi, '');
    },
    getDate(str) {
      return str
        .split(' ')
        .slice(1, 4)
        .join(' ');
    },
    markAsReadLater() {
      this.article.readLater = !this.article.readLater;
      let source = this.sources.find(o =>
        o.source.articles.includes(this.article)
      );
      if (source) this.$store.dispatch('userSources/saveCurrentSource', source);
    }
  },
  created() {
    this.article.read = true;
    let source = this.sources.find(o =>
      o.source.articles.includes(this.article)
    );
    if (source) this.$store.dispatch('userSources/saveCurrentSource', source);
  }
};
</script>
<style scoped>
.date {
  margin: 15px;
  color: gray;
  font-size: 1.5em;
}
.header {
  margin: 10px;
}
a i {
  margin-right: 5px;
}
</style>


