<template>
<div class="container">
    <div class="row">
        <div class="col-2">
            <img :src="source.sImg" alt="source_icon" v-if="source.sImg" class="img-thumbnail">
        </div>
        <div class="col-10">
            <h2>{{source.sTitle}}</h2> 
            <div>{{source.sDescr}}</div>
            <button class="btn btn-primary float-right" @click="addNewSource($event)">Add</button>
        </div>
    </div>
    <hr>
    <div class="row" v-for="article in articles">
        <div class="col-2">
            <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
        </div>
        <div class="col-10">
            <h6>{{article.title}}</h6> 
        </div>
    </div>
    <div v-show="show" class="menu-for-adding-source">
        <ul class="nav flex-column">
            <li v-for="cat in userCategories" @click="addSource(cat)">{{cat.category.name}}</li>
            <li class="nav-item" @click="addNewCatecory($event)">+ New category</li>
        </ul>
    </div>
     <div v-show="showFormCat" class="menu-for-adding-category">
        <form>
            <div class="form-group">
                <label for="catName">Category name</label>
                <input type="text" id="catName" class="form-control" v-model="categor">
                <button class="btn btn-success" disabled @click.stop.prevent="createNewCategory">Create</button>
                <button class="btn btn-light" @click.stop.prevent="showFormCat=false">Cancel</button>
            </div>
        </form>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            show:false,
            showFormCat:false,
            x:null,
            y:null,
            categor:''
          }
    },
    watch: {
        categor(){
            var menu=document.querySelector('.menu-for-adding-category');
            var submitButton=menu.querySelector('.btn-success');
            if(this.categor){
                submitButton.removeAttribute("disabled");
            }
        }
    },
  computed:{
      source(){
          return this.$store.getters['source/source'];
      },
      sources(){
          return this.$store.getters['userSources/sources'];
      },
      articles(){
          var art=[];
          for(var i=0;i<3;i++)
            art.push(this.source.articles[i]);
          return art;
      },
      userSources(){
          return this.$store.getters['userSources/sources']
      },
      userCategories(){
          return this.$store.getters['userSources/categories']
      }
  },
  methods:{
      addNewSource(event){
          this.show=!this.show
          var menu=document.querySelector('.menu-for-adding-source');
          this.x=event.screenX;
          this.y=event.screenY;
          if(menu){
              menu.style.left=`${this.x-230}px`;
              menu.style.top=`${this.y-35}px`;
          }
      },
      addNewCatecory(){
        this.show=false;
        this.showFormCat=!this.showFormCat;
        var menu=document.querySelector('.menu-for-adding-category');
        if(menu){
            menu.style.left=`${this.x-230}px`;
            menu.style.top=`${this.y-35}px`;
        }       
      },
      createNewCategory(){
          if(this.categor.trim()){
            this.$store.dispatch('source/setCurrentCategory', this.categor);
            this.showFormCat=false;
            this.$store.dispatch('source/saveCurrentSource');
            this.categor='';
          }
          this.$store.dispatch('userSources/setCurrentSources');
      },
      addSource(cat){
          //console.log(cat.key);
          this.$store.dispatch('source/setCurrentCategory', cat);
          this.$store.dispatch('source/saveCurrentSourceInExistCategory');
      }
  }
}
</script>
<style scoped>
    .menu-for-adding-source{
        border: 1px solid #808080;
        -webkit-box-shadow: 0px 1px 1px #808080;
        -moz-box-shadow: 0px 1px 1px #808080;
        box-shadow: 0px 1px 1px #808080;
        border-radius: 2px;
        width: 250px;
        padding: 10px;
        padding-right: 20px;
        box-sizing: border-box;
        position: absolute;
        background: white;
    }
    .menu-for-adding-source li{
        cursor: pointer;
    }
    .menu-for-adding-source li:hover{
        text-decoration: underline;
    }
    .menu-for-adding-source::before,
    .menu-for-adding-source::after {
        content: '';
        position: absolute;
        left: 200px;
        top: -20px;
        border: 10px solid transparent;
        border-bottom: 10px solid #808080;
    }
    .menu-for-adding-source::after {
        border-bottom: 10px solid white;
        top: -19px;
    }
    .menu-for-adding-category{
        border: 1px solid #808080;
        -webkit-box-shadow: 0px 1px 1px #808080;
        -moz-box-shadow: 0px 1px 1px #808080;
        box-shadow: 0px 1px 1px #808080;
        border-radius: 2px;
        width: 250px;
        padding: 10px;
        padding-right: 20px;
        box-sizing: border-box;
        position: absolute;
        background: white;
    }
    .menu-for-adding-category::before,
    .menu-for-adding-category::after {
        content: '';
        position: absolute;
        left: 200px;
        top: -20px;
        border: 10px solid transparent;
        border-bottom: 10px solid #808080;
    }
    .menu-for-adding-category::after {
        border-bottom: 10px solid white;
        top: -19px;
    }
    .menu-for-adding-category button{
        margin-top:10px; 
    }
</style>


