<template>
  <div class="row header">
    <div class="col-12">
      <div class="input-group">   
        <input type="text" class="form-control" placeholder="Search">
        <span class="input-group-btn" @click="changeViewOfArticles()">
          <i class="material-icons" :title="title">{{view}}</i><!--<i class="material-icons">view_module</i>-->
        </span>
        <span class="input-group-btn">
          <i class="material-icons">sync</i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){ 
    return {
      title:""
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
        this.title = "change to title only view"
      }
      else{
        this.title = "change to magazine view"
      }
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

