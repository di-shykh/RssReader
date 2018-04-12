<template>
  <div class=" app-sidebar">
      <nav class="sidebar bg-faded">
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <a class="nav-link" href="">Latest articles</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Read later</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Sources <i class="fas fa-cog"></i></a>
            </li>
        </ul>
         <ul class="nav nav-pills flex-column">
             <li class="nav-item">
                <a class="nav-link" href="">All</a>
            </li>
            <li class="nav-item" v-for="cat in userCategories">
                <a class="nav-link" href="" @click.stop.prevent>{{cat.category.name}}</a>
                <ul>
                    <li class="nav-item" v-for="item in cat.category.sources">
                        <router-link to="" tag="a" @click.stop.prevent>{{item}}</router-link>
                    </li>
                </ul>
            </li>
         </ul>
         <ul class="nav nav-pills flex-column">
             <li class="nav-item sidebar-footer">
                 <input id="sidebar-input" class="form-control sidebar-input" type="text" v-show="show" @keyup.enter="addSourse">
                 <button class="btn sidebar-button" @click="addSourse">+Add</button>
             </li>
         </ul>   
      </nav>     
  </div>
</template>
<script>
import AddSource from './AddSource';
import {router} from '../router';
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
      return{
          show:false,
          someData:'',
          //sources:[]
      }
  },
  computed: {
    userSources(){
        return this.$store.getters['userSources/sources']
    },
    userCategories(){
        return this.$store.getters['userSources/categories']
    }
  },
  methods:{
     /*
     ...mapActions([
        'findCurrentSource'
        ]),*/
      addSourse(){
        this.show=true;
        var strSourece=document.getElementById('sidebar-input').value;
       if (strSourece.trim()){
           this.$store.dispatch('source/findCurrentSource', strSourece);
           this.$router.push('/reader/addsource');
           document.getElementById('sidebar-input').value="";
           this.show=false;
        }
  }
}
}
</script>
<style scoped>
    .app-sidebar{
        background: rgba(219, 228, 238, 0.877);
        height: calc(100vh - 62px); /* 62 pixel is the height of .navbar */

    }
    ul{
        list-style: none;
    }
    .sidebar-button{
        width: 100%;
        background:rgba(219, 228, 238, 0.877); 
        color: #007BFF;
    }
    .sidebar-button:hover{
        color: rgb(12, 84, 161);
    }
    .sidebar-input{
        width: 100%;
    }
    .sidebar-footer {
        position: absolute; 
        bottom: 0px;
        width: 127px;
    }

</style>


