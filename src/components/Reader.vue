<template>
  <div class="app-container">
    <app-header class="app-header"></app-header>
    <div class="wrapper">
      <app-sidebar id="app-sidebar"></app-sidebar>
        <div @click="closeSidebar" id="app-content">
          <router-view></router-view>
        </div>
    </div>
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
    },
    closeSidebar() {
      this.$store.dispatch('appearance/closeWideSidebar');
    }
  },
  created() {
    this.$store.dispatch('userSources/setUserSources');
    this.$store.dispatch('userSources/setUserCategories');
    this.$router.push('/reader/articles');
    this.$store.dispatch('userSources/updateSources');
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
.app-container {
  height: 100%;
}
.wrapper {
  display: flex;
  height: calc(100% - 62px);
}
#app-sidebar {
  flex: 0 0 auto;
  order: 0;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
}
#app-content {
  flex: 1 1 auto;
  height: 100%;
  width: 100%;
  order: 1;
  overflow-y: auto;
}
</style>