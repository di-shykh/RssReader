<template>
  <div class="app-container">
    <app-header class="app-header" />
    <div class="wrapper">
      <app-sidebar 
        id="app-sidebar" 
        :style="sidebarStyle" 
      />
      <div 
id="app-content" 
           :style="contentStyle" 
@click="closeSidebar"
>
        <router-view />
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
  name: 'Reader',
  components: {
    appHeader: Header,
    appSidebar: Sidebar,
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
    },
    userSources() {
      return this.$store.getters['userSources/sources'];
    },
    userCategories() {
      return this.$store.getters['userSources/categories'];
    },
    userSettings() {
      return this.$store.getters['settings/settings'];
    },
    contentStyle() {
      if (this.userSettings)
        return {
          fontFamily: this.userSettings.fontFamily,
          color: this.userSettings.textColor,
          backgroundColor: this.userSettings.bgColor,
          fontSize: this.userSettings.fontSize,
        };
      else
        return {
          fontFamily: 'sans-serif',
          color: '#000000',
          backgroundColor: '#ffffff',
          fontSize: 'medium',
        };
    },
    sidebarStyle() {
      if (this.userSettings)
        return {
          fontFamily: this.userSettings.fontFamily,
          color: this.userSettings.sidebarTextColor,
          backgroundColor: this.userSettings.sidebarColor,
          fontSize: this.userSettings.fontSize,
        };
      else
        return {
          fontFamily: 'sans-serif',
          color: '#007bff',
          backgroundColor: '#dbe4ee',
          fontSize: 'medium',
        };
    },
  },
  created() {
    this.$store.dispatch('userSources/setUserSources');
    this.$store.dispatch('userSources/setUserCategories');
    this.$store.dispatch('userSources/updateSources');
    this.$store.dispatch('settings/setUserSettings');
    this.$router.push('/reader/articles');
  },
  beforeCreate() {
    this.$store.dispatch('settings/setUserSettings');
  },
  methods: {
    logOut() {
      auth.logout();
    },
    closeSidebar() {
      this.$store.dispatch('appearance/closeWideSidebar');
    },
  },
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
