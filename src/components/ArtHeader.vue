<template>
  <div class="row header">
    <div class="col-12">
      <div class="input-group">   
        <input type="text" class="form-control" placeholder="Search" v-model="textForSearch" @keyup.enter="findArticle()">
        <span class="input-group-btn" @click="changeViewOfArticles()">
          <i class="material-icons" :title="title">{{view}}</i><!--<i class="material-icons">view_module</i>-->
        </span>
        <span class="input-group-btn" @click="updateSources()">
          <i class="material-icons" title="Update your sources" id="sync">sync</i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){ 
    return {
      title:'',
      textForSearch:''
    }
  },
  computed: {
    view() {
      return this.viewList ? 'view_list' : 'view_headline';
    },
    viewList(){
      return this.$store.getters['userSources/viewList'];
    }
  },
  methods:{
    changeViewOfArticles(){
      this.$store.dispatch('userSources/changeViewOfArticles');
      if(this.viewList){
        this.title = 'Change to title only view';
      }
      else{
        this.title = 'Change to magazine view';
      }
    },
    updateSources(){
      let degrees=0;
      let loop=setInterval(function(){
        const elem=document.querySelector('#sync');
        elem.style.transform = 'rotate('+degrees+'deg)';
        degrees+=5;
        if(degrees>359){
          clearInterval(loop);
        }
      },3);
      this.$store.dispatch('userSources/updateSources');
    },
    findArticle(){
      if(this.textForSearch.length !== 0){
        this.textForSearch.trim();
        this.$store.dispatch('userSources/findArticle',this.textForSearch);
      }
      if(this.textForSearch.trim().length === 0)
       this.$store.dispatch('userSources/findArticle',this.textForSearch);
    }
  }
}
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
</style>

