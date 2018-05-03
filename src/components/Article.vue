<template>
  <div class="container">
    <div class="row header">
      <div class="col-3 date">{{getDate(article.date)}}</div>
      <h4 class="col-6">{{article.title}}</h4>
      <div class="col-3">
        <a @click.stop.prevent="markAsReadLater"><i id="icon" class="fa fa-bookmark-o fa-2x" aria-hidden="true"></i></a>
        <a @click.stop.prevent><i class="fa fa-share-alt fa-2x" aria-hidden="true"></i></a>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
        <!--<div v-html="findImgOfArticle(article.description)" v-else class="img-thumbnail"></div>-->
      </div>
      <div class="col-8" v-html="deleteImgTagFromDescr(article.description)"></div>
      <div class="w-100"></div>
      <button class="btn btn-primary col-md-4 offset-md-4" @click="openInNewTab(article.link)">Visit website</button>
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
    }
  },
  methods: {
    deleteImgTagFromDescr(str) {
      const start = str.indexOf('<img');
      const end = str.indexOf('/>', start);
      return str.slice(0, start) + str.slice(end + 2);
    },
    getDate(str) {
      return str
        .split(' ')
        .slice(1, 4)
        .join(' ');
    },
    openInNewTab(url) {
      const win = window.open(url, '_blank');
      win.focus();
    },
    markAsReadLater() {
      const icon = document.querySelector('#icon');
      if (icon.classList.contains('fa-bookmark-o')) {
        icon.classList.remove('fa-bookmark-o');
        icon.classList.add('fa-bookmark');
        this.article.readLater = true;
        this.$store.dispatch('userSources/saveCurrentArticle', this.article);
      } else {
        icon.classList.remove('fa-bookmark');
        icon.classList.add('fa-bookmark-o');
        this.article.readLater = false;
        this.$store.dispatch('userSources/saveCurrentArticle', this.article);
      }
    }
  },
  created() {
    this.article.read = true;
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


