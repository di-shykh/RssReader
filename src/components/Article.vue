<template>
  <div class="container">
    <div class="row header">
      <div class="col-3 date">{{getDate(article.date)}}</div>
      <h4 class="col-6">{{article.title}}</h4>
      <div class="col-3">
        <a @click.stop.prevent="markAsReadLater"><i class="material-icons">{{bookmarkStyle}}</i></a>
        <a @click.stop.prevent><i class="material-icons">share</i></a>
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
      article: this.$route.params.article,
      article_key: this.$route.params.article_key
    };
  },
  watch: {
    $route(to, from) {
      this.article = to.params.article;
      this.article_key = to.params.article_key;
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
    bookmarkStyle() {
      return this.article.readLater ? 'bookmark' : 'bookmark_border';
    }
  },
  methods: {
    deleteImgTagFromDescr(str) {
      if (str) return str.replace(/<img[^>]*>/gi, '');
    },
    getDate(str) {
      if (str)
        return str
          .split(' ')
          .slice(1, 4)
          .join(' ');
    },
    markAsReadLater() {
      this.article.readLater = !this.article.readLater; 
      const data = this.findDataForChangingStatusOfArticle();
      if(typeof data.source !== 'undefined'){
        this.$store.dispatch('userSources/saveBookmarckedArticles', {
          source: data.source,
          article: this.article
        });
      }
    },
    findDataForChangingStatusOfArticle(){
      let source;
      this.sources.forEach(element => {
        element.source.articles.forEach(o => {
          if(o.link === this.article.link){
            source = element;
          }
        })
      });
      return {
        source
      }
    }
  },
  created() {
    this.article.read = true;
    const data = this.findDataForChangingStatusOfArticle();
    if(typeof data.source !== 'undefined'){
      this.$store.dispatch('userSources/saveReadArticle', {
        source: data.source,
        article: this.article
      });
    }
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


