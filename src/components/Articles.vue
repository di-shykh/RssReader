<template>
  <div class="container">
    <art-header></art-header>
    <div class="row col-12">
      <h2 v-if="sourceName">{{sourceName}}</h2>
      <h2 v-else-if="categoryName">{{categoryName}}</h2>
      <h2 v-else-if="readLater">Bookmared Articles</h2>
      <h2 v-else>All</h2>
    </div>
    <div class="row article" v-for="(article,key) in articles" v-show="!showFindedArticles">
      <router-link :to="{ name: 'article', params: { article: article, article_key:key }}" tag="div" @click.stop.prevent>
        <div class="date">{{getDate(article.date)}}</div>
        <div class="w-100" v-show="viewList"></div>
        <div class="col-2" v-show="viewList">
          <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
        </div>
        <div class="col-10">
          <h5>{{article.title}}</h5> 
          <p v-html="deleteImgTagFromDescr(article.description)" v-show="viewList"></p>
        </div>
      </router-link>
    </div>
    <div class="row article" v-show="showFindedArticles" v-for="(article,key) in tempArr" >
      <router-link :to="{ name: 'article', params: { article: article, article_key:key }}" tag="div" @click.stop.prevent>
        <div class="date">{{getDate(article.date)}}</div>
        <div class="w-100" v-show="viewList"></div>
        <div class="col-2" v-show="viewList">
          <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
        </div>
        <div class="col-10">
          <h5 class="finded-text">{{article.title}}</h5> 
          <p class="finded-text" v-html="deleteImgTagFromDescr(article.description)" v-show="viewList"></p>
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
      showFindedArticles:false,
      tempArr:[]
    };
  },
  watch: {
    $route(to, from) {
      this.sourceName = to.params.sourcename;
      this.categoryName = to.params.categoryname;
      this.readLater = to.params.readLater;
    },
    textForSearch(newValue, oldValue){
      if(newValue!==oldValue){
        this.tempArr=[];
        this.showFindedArticles=false;
        if(this.textForSearch){
          this.tempArr = this.articles.filter(o => o.title.toLowerCase().includes(this.textForSearch.toLowerCase())||o.description.toLowerCase().includes(this.textForSearch.toLowerCase()));
          this.showFindedArticles=true;
          this.hightlight(this.textForSearch);
        }
        else{
          this.tempArr=[];
          this.showFindedArticles=false;
        }
      }
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
        if (this.sourceName) {
          let source = this.sources.find(o => o.source.name === this.sourceName);
          if (source) return this.sortArticlesByDate(source.source.articles);
        }
        if (this.categoryName) {
          let art = this.sources
            .filter(item => item.source.category === this.categoryName)
            .reduce((acc, item) => acc.concat(item.source.articles), []);
          return this.sortArticlesByDate(art);
        }
        if (this.readLater) {
          let art = this.sources
            .reduce((acc, item) => acc.concat(item.source.articles), [])
            .filter(item => item.readLater === true);
          return this.sortArticlesByDate(art);
        } else {
          let art = this.sources.reduce(
            (acc, item) => acc.concat(item.source.articles),
            []
          );
          return this.sortArticlesByDate(art);
        }
    }
  },
  methods: {
    deleteImgTagFromDescr(str) {
      if (str) return str.replace(/<img[^>]*>/gi, '').slice(0, 500) + '...'; //and make description not so long
    },
    hightlight(str){
      const findedText = document.querySelectorAll('.finded-text');
      //не всегда вообще находит узлы с этим классом. Почему?????
      console.log(findedText);
      try {
        if(findedText)
        findedText.forEach(item=>{
          let innerHTML = item.innerHTML;
         /* innerHTML.replace(new RegExp(str, 'g'),'<span class="highlight">'+str+'</span>');//не работает
          item.innerHTML = innerHTML;*/
         // console.log(innerHTML); 
          let index = item.innerHTML.toLowerCase().indexOf(str); //работает через раз,определяет индекс,вставляет спан с нужным классом,только вот желтым текст не становится
          console.log(index);
          if (index >= 0) { 
            innerHTML = innerHTML.substring(0,index) + '<span class="highlight">' + innerHTML.substring(index,index+str.length) + '</span>' + innerHTML.substring(index + str.length);
            item.innerHTML = innerHTML;
          }
        }) 
      } catch (error) {
        console.log('Error: ' + error.code);
     } 
     /* const findedText = document.getElementsByClassName('finded-text'); и так тоже не работает
      for(let i=0;i<findedText.length;i++){
        let innerHTML = findedText[i].innerHTML;
        let index = findedText[i].innerHTML.toLowerCase().indexOf(str);
        console.log(index);
        if (index >= 0) { 
           innerHTML = innerHTML.substring(0,index) + '<span class="highlight">' + innerHTML.substring(index,index+str.length) + '</span>' + innerHTML.substring(index + str.length);
           findedText[i].innerHTML = innerHTML;
            console.log(findedText[i].innerHTML);
          }
      }*/
      //console.log(document.getElementsByClassName('highlight'));
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
  background-color: yellow;
}
</style>


