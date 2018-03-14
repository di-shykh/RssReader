<template>
  <div class=" mySidebar">
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
             <li class="nav-item myfooter">
                 <input class="form-control myInput" type="text" v-if="show">
                 <button class="btn myButton" @click="show=!show">+Add</button>
             </li>
         </ul>   
      </nav>     
  </div>
</template>
<script>
export default {
  data(){
      return{
          show:false
      }
  },
  methods:{
      
  }
}
</script>
<style scoped>
    .mySidebar{
        background: rgba(219, 228, 238, 0.877);
        height: calc(100vh - 62px); /* 62 pixel is the height of .navbar */

    }
    ul{
        list-style: none;
    }
    .myButton{
        width: 100%;
        background:rgba(219, 228, 238, 0.877); 
        color: #007BFF;
    }
    .myButton:hover{
        color: rgb(12, 84, 161);
    }
    .myInput{
        width: 100%;
    }
    .myfooter {
        position: absolute; 
        bottom: 0px;
        width: 127px;
    }

</style>


