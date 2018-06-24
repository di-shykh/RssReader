<template>
  <div class="container">
    <art-header></art-header>
    <div class="row col-12">
      <h2 v-if="sourceName">{{sourceName}}</h2>
      <h2 v-else-if="categoryName">{{categoryName}}</h2>
      <h2 v-else-if="readLater">Bookmared Articles</h2>
      <h2 v-else>All</h2>
    </div>
    <div class="row article" v-for="(article,key) in articles">
      <router-link :to="{ name: 'article', params: { article: article, article_key:key }}" tag="div" @click.stop.prevent>
        <div class="date">{{getDate(article.date)}}</div>
        <div class="w-100"></div>
        <div class="col-2">
          <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
        </div>
        <div class="col-10">
          <h6>{{article.title}}</h6> 
          <p v-html="deleteImgTagFromDescr(article.description)"></p>
        </div>
      </router-link>
    </div>
    </div>
</template>
<script>
import ArtHeader from '../components/ArtHeader';
export default {
  data() {
    return {
      sourceName: this.$route.params.sourcename,
      categoryName: this.$route.params.categoryname,
      readLater: this.$route.params.readLater
    };
  },
  watch: {
    $route(to, from) {
      this.sourceName = to.params.sourcename;
      this.categoryName = to.params.categoryname;
      this.readLater = to.params.readLater;
    }
  },
  computed: {
    sources() {
      return this.$store.getters['userSources/sources'];
    },
    categories() {
      return this.$store.getters['userSources/categories'];
    },
    articles() {
      if (this.sourceName) {
        let source = this.sources.find(o => o.source.name === this.sourceName);
        if (source) return source.source.articles;
      }
      let acc = [];
      if (this.categoryName) {
        let art = this.sources
          .filter(item => item.source.category === this.categoryName)
          .reduce((acc, item) => acc.concat(item.source.articles), acc);
        return art;
      }
      if (this.readLater) {
        let art = this.sources
          .reduce((acc, item) => acc.concat(item.source.articles), acc)
          .filter(item => item.readLater === true);
        return art;
      } else {
        let art = this.sources.reduce(
          (acc, item) => acc.concat(item.source.articles),
          acc
        );
        return art;
      }
    }
  },
  methods: {
    deleteImgTagFromDescr(str) {
      return str.replace(/<img[^>]*>/gi, '').slice(0, 500) + '...'; //and make description not so long
    },
    getDate(str) {
      return str
        .split(' ')
        .slice(1, 4)
        .join(' ');
    }
  },
  components: {
    artHeader: ArtHeader
  }
};
</script>
<style scoped>
.article {
  margin-top: 15px;
  margin-bottom: 15px;
}
.article:hover {
  cursor: pointer;
}
.date {
  margin: 15px;
  color: gray;
}
</style>


