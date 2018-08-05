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
        <div class="w-100" v-show="viewList"></div>
        <div class="col-2" v-show="viewList">
          <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
        </div>
        <div class="col-10">
          <h5 v-html="article.title"></h5> 
          <p v-html="deleteImgTagFromDescr(article.description)" v-show="viewList"></p>
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
      readLater: this.$route.params.readLater,
      latestArticles: this.$route.params.latestArticles,
      isArticlesFiltered:false,
    };
  },
  watch: {
    $route(to, from) {
      this.sourceName = to.params.sourcename;
      this.categoryName = to.params.categoryname;
      this.readLater = to.params.readLater;
      this.latestArticles = to.params.latestArticles;
    },
    textForSearch(newValue, oldValue){
      if(this.textForSearch.trim().length !== 0)
        this.isArticlesFiltered = true;
      if(this.textForSearch.trim().length === 0)
        this.isArticlesFiltered = false;
    }
  },
  computed: {
    viewList(){
      return this.$store.getters['userSources/viewList'];
    },
    sources() {
      return this.$store.getters['userSources/sources'];
    },
    categories() {
      return this.$store.getters['userSources/categories'];
    },
    textForSearch(){
      return this.$store.getters['userSources/textForSearch'];
    },
    articles(){
      let dateForLatestArt=new Date();
      dateForLatestArt.setDate(dateForLatestArt.getDate() - 1);
        if (this.sourceName) {
          let source = this.sources.find(o => o.source.name === this.sourceName);
          if (source) {
            if(this.isArticlesFiltered){
              return this.filterArticles(source.source.articles, this.textForSearch);
              this.isArticlesFiltered=false;
            }
          else{
            this.deleteTagSpan(source.source.articles);
            return this.sortArticlesByDate(source.source.articles);
          }
          }
        }
        if (this.categoryName) {
          let art = this.sources
            .filter(item => item.source.category === this.categoryName)
            .reduce((acc, item) => acc.concat(item.source.articles), []);
          if(this.isArticlesFiltered){
            return this.filterArticles(art, this.textForSearch);
            this.isArticlesFiltered=false;
          }
          else{
            this.deleteTagSpan(art);
            return this.sortArticlesByDate(art);
          }
        }
        if (this.readLater) {
          let art = this.sources
            .reduce((acc, item) => acc.concat(item.source.articles), [])
            .filter(item => item.readLater === true);
          if(this.isArticlesFiltered){
            return this.filterArticles(art, this.textForSearch);
            this.isArticlesFiltered=false;
          }
          else{
            this.deleteTagSpan(art);
            return this.sortArticlesByDate(art);
          }
        } 

        else {
          let art = this.sources.reduce(
            (acc, item) => acc.concat(item.source.articles),
            []
          );
          if(this.latestArticles === 'latest'){
           art = this.sources.reduce(
            (acc, item) => acc.concat(item.source.articles),
            []
           ).filter(item => new Date(item.date) >= dateForLatestArt);
           this.sourceName='Latest Articles'
          }
          if(this.isArticlesFiltered){
            return this.filterArticles(art, this.textForSearch);
            this.isArticlesFiltered=false;
          }
          else{
            this.deleteTagSpan(art);
            return this.sortArticlesByDate(art);
          }
        }
    }
  },
  methods: {
    deleteImgTagFromDescr(str) {
      if (str) return str.replace(/<img[^>]*>/gi, '').slice(0, 500) + '...'; //and make description not so long
    },
    deleteTagSpan(arr){
      arr=arr.map(o=>{
        const str1='<span class="highlight">';
        const str2='</span>';
        let indexStart = o.title.indexOf(str1);
         if(indexStart >= 0){
           let indexEnd=o.title.indexOf(str2,indexStart+str1.length);
           if(indexEnd >= 0){
             o.title=o.title.substring(0,indexStart)+o.title.substring(indexStart+str1.length,indexEnd)+o.title.substring(indexEnd+str2.length,)
           }
         }
         else{
           indexStart = o.description.indexOf(str1);
          if(indexStart >= 0){
            let indexEnd=o.description.indexOf(str2,indexStart+str1.length);
            if(indexEnd >= 0){
              o.description=o.description.substring(0,indexStart)+o.description.substring(indexStart+str1.length,indexEnd)+o.description.substring(indexEnd+str2.length,)
            }
          }
         }
        return o;
      })
    },
    filterArticles(arr, str){
      arr = arr.filter(o => o.title.toLowerCase().includes(str.toLowerCase())||o.description.toLowerCase().includes(str.toLowerCase()));
      arr = this.hightlight(arr, str);
      return this.sortArticlesByDate(arr);
    },
    hightlight(arr,str){
       arr = arr.map(o => {
          let index = o.title.toLowerCase().indexOf(str); 
          if(index >= 0)
            o.title = this.addHighlightClass(o.title, index, str);
          else{
            index = o.description.toLowerCase().indexOf(str);
            if(index >= 0)
              o.description = this.addHighlightClass(o.description, index, str);
          }
          return o;
        }); 
        return arr;       
     }, 
    addHighlightClass(innerText, index, str){
        innerText = innerText.substring(0,index) + '<span class="highlight">' + innerText.substring(index,index + str.length) + '</span>' + innerText.substring(index + str.length);
        return innerText;
    },
    getDate(str) {
      if (str)
        return str
          .split(' ')
          .slice(1, 4)
          .join(' ');
    },
    sortArticlesByDate(arr){
      return arr.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
    } 
  },
  components: {
    artHeader: ArtHeader
  },
  created(){
    this.$store.dispatch('userSources/updateSources');
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
.highlight {
  background-color: orange;
}
</style>


