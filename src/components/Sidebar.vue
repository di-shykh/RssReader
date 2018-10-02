<template>
  <div class=" app-sidebar" @click="openSidebar">
    <div class="sidebar-toggle" v-show="!isSidebarVisible">
        <a>
          <i class="material-icons" v-bind:style="textColor">menu</i>
        </a>
    </div>
    <nav class="sidebar bg-faded" v-show="isSidebarVisible">
        <ul class="nav nav-pills flex-column">
          <li class="nav-item">
              <router-link tag="a" v-bind:style="sidebarTextColor" class="nav-link" :to="{ name: 'latestArticles', params: { latestArticles:'latest' }}">Latest articles</router-link>
          </li>
          <li class="nav-item" @click.stop.prevent="closeSidebar">
              <router-link tag="a" v-bind:style="sidebarTextColor" class="nav-link" :to="{ name: 'articlesReadLater', params: { readLater:true }}">Read later</router-link>
          </li>
          <li class="nav-item" @click.stop.prevent="closeSidebar">
            <router-link tag="a" v-bind:style="sidebarTextColor" class="nav-link" :to="{ name: 'sources'}">Sources <i class="material-icons" style="font-size: 20px !important; vertical-align: middle;">settings</i></router-link>
          </li>
      </ul>
        <ul class="nav nav-pills flex-column">
            <li class="nav-item" @click.stop.prevent="closeSidebar">
              <router-link to="/reader/articles" tag="a" v-bind:style="sidebarTextColor">All</router-link>
          </li>
          <li class="nav-item" v-for="cat in userCategories" @click.stop.prevent="closeSidebar">
              <router-link tag="a" class="nav-link" v-bind:style="sidebarTextColor" :to="{ name: 'articlesbycategory', params: { categoryname: cat.category.name }}">{{cat.category.name}}</router-link>
              <ul>
                  <li class="nav-item" v-for="item in cat.category.sources" @click.stop.prevent="closeSidebar">
                      <router-link v-bind:style="sidebarTextColor" :to="{ name: 'articlesbysourcename', params: { sourcename: item }}" tag="a" >{{item}}</router-link>
                  </li>
              </ul>
          </li>
        </ul>
        <ul class="nav nav-pills flex-column">
            <li class="nav-item sidebar-footer">
                <input id="sidebar-input" class="form-control sidebar-input" type="text" v-show="show" @keyup.enter="addSource">
                <button class="btn sidebar-button" @click="addSource" v-bind:style="sidebarColor">+Add</button>
            </li>
        </ul>   
    </nav> 
    <div class="wait">
      <span class="loader">
        <i class="material-icons" id="sync">sync</i>
      </span>  
    </div>     
  </div>
</template>

<script>
import AddSource from './AddSource';
import { router } from '../router';

export default {
  data() {
    return {
      show: false,
      someData: '',
    };
  },
  computed: {
    userSources() {
      return this.$store.getters['userSources/sources'];
    },
    userCategories() {
      return this.$store.getters['userSources/categories'];
    },
    isSidebarVisible() {
      return this.$store.getters['appearance/showSidebar'];
    },
    textColor(){
      if(this.$store.getters['settings/settings'])
      return {
        color:this.$store.getters['settings/settings'].textColor
      }
      else return{
        color:'#007bff'
      }
    },
    sidebarColor(){
      if(this.$store.getters['settings/settings'])
      return {
        backgroundColor:this.$store.getters['settings/settings'].sidebarColor,
        color:this.$store.getters['settings/settings'].sidebarTextColor
      }
      else return{
        backgroundColor:'#dbe4ee',
        color:'#007bff'
      }
    },
    sidebarTextColor(){
      if(this.$store.getters['settings/settings'])
      return{
        color:this.$store.getters['settings/settings'].sidebarTextColor
      }
      else return{
        color:'#007bff'
      }
    },
    findedSources(){
      return this.$store.getters['source/source']
    }
  },
  watch:{
    isSidebarVisible(){
      if(!this.isSidebarVisible)
        this.show=false
    },
  },
  methods: {
    addSource() {
      this.show = true;
      const strSource = document.getElementById('sidebar-input').value;
      if (strSource.trim()) {
        try{
          this.$store.dispatch('source/setSourcesAndFeedsToNull');
          this.isRssFeedNotLoaded=true;
          const promise= this.$store.dispatch('source/parseFeed', strSource);
          if(this.findedSources){
            this.$router.push('/reader/addsource');
          }
        }
        catch (error) {
          //doesn't work at all
          //ошибка в консоль падает,то дальше ничего не происходит
          this.$router.push('/reader/articles');
          console.error(error);
          alert("Unfortunately we can't save this blog");
          const wait = document.querySelector('.wait');
          wait.style.display = 'none';
        }
        finally{
          document.getElementById('sidebar-input').value = '';
          this.show = false;
        }
      }
    },
    openSidebar() {
      this.$store.dispatch('appearance/openWideSidebar');
    },
    closeSidebar() {
      this.$store.dispatch('appearance/closeWideSidebar');
    }
  },
  updated() {
    if (this.isSidebarVisible) {
      this.$store.dispatch('appearance/openWideSidebar');
    }
  }
};
</script>
<style scoped>
.app-sidebar {
  background: rgba(219, 228, 238, 0.877);
  min-height: calc(100vh - 62px); /* 62 pixel is the height of .navbar */
  cursor: pointer;
  flex: 0 0 auto;
  justify-content: flex-start;
  order: 0;
  flex-direction: column;
}
ul {
  list-style: none;
}
.sidebar-button {
  width: 100%;
  background: rgba(219, 228, 238, 0.877);
  color: #007bff;
}
.sidebar-button:hover {
  color: rgb(12, 84, 161);
}
.sidebar-input {
  width: 100%;
}
.fa-bars {
  margin: 10px;
}
.wait {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 5;
  width: 100%;
  height: 100%;
  display: none; /* flex establish flex container */
  flex-direction: column; /* make main axis vertical */
  justify-content: center; /* center items vertically, in this case */
  align-items: center;
}
#sync {
  z-index: 6;
  color: white;
  text-align: center; /* will center text in <p>, which is not a flex item */
}
</style>


