<template>
  <div>
    <app-header class="fixed-top"></app-header>
    <app-sidebar id="app-sidebar" class="float-left"></app-sidebar>
    <!--<img :src="user.photoURL" width="100"> <br>-->
    <router-view id="app-content"></router-view>
  </div>
</template>

<script>
import auth from '@/auth';
import Header from './Header';
import Sidebar from './Sidebar';
import AddSource from './AddSource';
import Articles from './Articles';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'reader',
  computed: {
    user() {
      return this.$store.getters['user/user'];
    },
    userSources() {
      return this.$store.getters['userSources/sources'];
    },
    userCategories() {
      return this.$store.getters['userSources/categories'];
    }
  },
  components: {
    appHeader: Header,
    appSidebar: Sidebar
  },
  methods: {
    logOut() {
      auth.logout();
    }
  },
  created() {
    this.$store.dispatch('userSources/setUserSources');
    this.$store.dispatch('userSources/setUserCategories');
  }
};
</script>

<style scoped>
img {
  border-radius: 50px;
}

h3 {
  margin-bottom: 0;
}

p {
  margin-top: 0;
}

pre {
  text-align: left;
}
</style>