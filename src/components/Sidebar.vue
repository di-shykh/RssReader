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
                <router-link to="/reader/articles" tag="a" @click.stop.prevent>All</router-link>
            </li>
            <li class="nav-item" v-for="cat in userCategories">
                <router-link tag="a" class="nav-link" :to="{ name: 'articlesbycategory', params: { categoryname: cat.category.name }}" @click.stop.prevent>{{cat.category.name}}</router-link>
                <ul>
                    <li class="nav-item" v-for="item in cat.category.sources">
                        <router-link :to="{ name: 'articlesbysourcename', params: { sourcename: item }}" tag="a" @click.stop.prevent>{{item}}</router-link>
                    </li>
                </ul>
            </li>
         </ul>
         <ul class="nav nav-pills flex-column">
             <li class="nav-item sidebar-footer">
                 <input id="sidebar-input" class="form-control sidebar-input" type="text" v-show="show" @keyup.enter="addSource">
                 <button class="btn sidebar-button" @click="addSource">+Add</button>
             </li>
         </ul>   
      </nav>     
  </div>
</template>

<script>
import AddSource from './AddSource';
import { router } from '../router';

export default {
  data() {
    return {
      show: false,
      someData: ''
    };
  },
  computed: {
    userSources() {
      return this.$store.getters['userSources/sources'];
    },
    userCategories() {
      return this.$store.getters['userSources/categories'];
    }
  },
  methods: {
    addSource() {
      this.show = true;
      const strSource = document.getElementById('sidebar-input').value;
      if (strSource.trim()) {
        this.$store.dispatch('source/findCurrentSource', strSource);
        this.$router.push('/reader/addsource');
        document.getElementById('sidebar-input').value = '';
        this.show = false;
      }
    }
  }
};
</script>
<style scoped>
.app-sidebar {
  background: rgba(219, 228, 238, 0.877);
  min-height: calc(100vh - 62px); /* 62 pixel is the height of .navbar */
  position: fixed;
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
</style>


