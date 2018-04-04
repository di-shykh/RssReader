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
            <li class="nav-item">
                <a class="nav-link" href="">Category 1</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Category 2</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Category 3</a>
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
          sources:[]
      }
  },
  computed: mapGetters({
    source: 'source'
  }),
  methods:{
     /*
     ...mapActions([
        'findCurrentSource'
        ]),*/
      addSourse(){
        this.show=true;
        var strSourece=document.getElementById('sidebar-input').value;
       if (strSourece){
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


