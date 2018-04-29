<template>
  <div class="container">
    <art-header></art-header>
    <h2 v-if="sourceName">{{sourceName}}</h2>
    <h2 v-else-if="categoryName">{{categoryName}}</h2>
    <h2 v-else>All</h2>
    <div class="container">
      <!--<div class="row" v-for="source in sources">-->
      <div class="row article" v-for="article in articles">
        <router-link :to="{ name: 'article', params: { article: article }}" tag="div" @click.stop.prevent>
          <div class="date">{{getDate(article.date)}}</div>
          <div class="w-100"></div>
          <div class="col-2">
            <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
            <!--<div v-html="findImgOfArticle(article.description)" v-else class="img-thumbnail"></div>-->
          </div>
          <div class="col-10">
            <h6>{{article.title}}</h6> 
            <p v-html="deleteImgTagFromDescr(article.description)"></p>
          </div>
        </router-link>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import ArtHeader from '../components/ArtHeader';
export default {
  data() {
    return {
      sourceName: this.$route.params.sourcename,
      categoryName: this.$route.params.categoryname
    };
  },
  watch: {
    $route(to, from) {
      this.sourceName = to.params.sourcename;
      this.categoryName = to.params.categoryname;
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
        return source.source.articles;
      }
      if (this.categoryName) {
        let art = [];
        this.sources.forEach(item => {
          if (item.source.category == this.categoryName) {
            art.push(...item.source.articles);
          }
        });
        return art;
      } else {
        let art = [];
        this.sources.forEach(item => {
          art.push(...item.source.articles);
        });
        return art;
      }
    }
    /*date(str) {
      return new Date(Date.parse(str)).toISOString().substr(0, 10);
    }*/
  },
  methods: {
    deleteImgTagFromDescr(str) {
      const start = str.indexOf('<img');
      const end = str.indexOf('/>', start);
      return str.slice(0, start) + str.slice(end + 2, 500) + '...'; //and make description not so long
    },
    findImgOfArticle(str) {
      const start = str.indexOf('<img');
      const end = str.indexOf('/>', start);
      return str.slice(start, end + 2);
    },
    getDate(str) {
      //console.log(new Date(Date.parse(str)).toISOString().substr(0, 10));
      return str
        .split(' ')
        .slice(1, 4)
        .join(' ');
    }
  },
  created() {
    //this.$store.dispatch('userSources/setUserSources');
    //this.$store.dispatch('userSources/setUserCategories');
  },
  mounted() {
    const content = document.getElementById('app-content');
    const sidebar = document.getElementById('app-sidebar');
    content.style.marginLeft = sidebar.clientWidth + 'px';
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


