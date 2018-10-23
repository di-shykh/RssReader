<template>
  <div 
    class="container" 
    @click="hideSosialButtons()"
  >
    <div class="row header">
      <div class="col-3 date">{{ getDate(article.date) }}</div>
      <h4 
        class="col-6" 
        v-html="article.title"
      />
      <div class="col-3">
        <a @click.stop.prevent="markAsReadLater"><i class="material-icons">{{ bookmarkStyle }}</i></a>
        <a @click.stop.prevent="shareContent()"><i class="material-icons">share</i></a>
        <div 
          v-show="isButtonsShown" 
          id="share-buttons"
        >
          <vue-goodshare-facebook 
            :page_url="article.link" 
            title_social="Facebook"
            has_counter
            has_icon
            button_design="outline" 
          />
          <vue-goodshare-vkontakte 
            :page_url="article.link" 
            title_social="Вконтакте"
            has_counter
            has_icon
            button_design="outline" 
          />
          <vue-goodshare-twitter 
            :page_url="article.link" 
            title_social="Twitter"
            has_counter
            has_icon
            button_design="outline" 
          />
          <vue-goodshare-googleplus 
            :page_url="article.link" 
            title_social="Google+"
            has_counter
            has_icon
            button_design="outline" 
          />
        </div>
      </div>
    </div>
    <div 
      class="row" 
      @click="hideSosialButtons()"
    >
      <div class="col-4">
        <img 
          v-if="article.img" 
          :src="article.img" 
          alt="article_icon" 
          class="img-thumbnail"
        >
      </div>
      <div 
        class="col-8" 
        v-html="deleteImgTagFromDescr(article.description)" 
      />
      <div class="w-100" />
      <a 
        :href="article.link" 
        target="_blank" 
        class="btn btn-primary col-md-4 offset-md-4"
      >Visit website</a>
    </div>
  </div>
</template>
<script>
import VueGoodshareFacebook from 'vue-goodshare/src/providers/Facebook.vue';
import VueGoodshareVkontakte from 'vue-goodshare/src/providers/Vkontakte.vue';
import VueGoodshareTwitter from 'vue-goodshare/src/providers/Twitter.vue';
import VueGoodshareGoogleplus from 'vue-goodshare/src/providers/Googleplus.vue';

export default {
  components: {
    VueGoodshareFacebook,
    VueGoodshareVkontakte,
    VueGoodshareTwitter,
    VueGoodshareGoogleplus,
  },
  data() {
    return {
      article: this.$route.params.article,
      articleKey: this.$route.params.articleKey,
      isButtonsShown: false,
    };
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
    },
  },
  watch: {
    $route(to, from) {
      this.article = to.params.article;
      this.articleKey = to.params.articleKey;
    },
  },
  created() {
    this.article.read = true;
    const data = this.getArticleData();
    if (data.source) {
      this.$store.dispatch('userSources/saveReadArticle', {
        source: data.source,
        article: this.article,
      });
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
      const data = this.getArticleData();
      if (data.source) {
        this.$store.dispatch('userSources/saveBookmarckedArticles', {
          source: data.source,
          article: this.article,
        });
      }
    },
    shareContent() {
      this.isButtonsShown = !this.isButtonsShown;
    },
    hideSosialButtons() {
      this.isButtonsShown = false;
    },
    getArticleData() {
      let source;
      this.sources.forEach(element => {
        element.source.articles.forEach(o => {
          if (o.link === this.article.link) {
            source = element;
          }
        });
      });
      return {
        source,
      };
    },
  },
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
#share-buttons {
  display: flex;
  flex-direction: row;
}
</style>
