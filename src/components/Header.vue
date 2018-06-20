<template>
  <div class="app-header">
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
        <a class="navbar-brand" href="#">
            Reader 
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">                   
                    <button class="btn btn-default app-menu">Mark all as read</button>
                </li>
                <li class="nav-item">
                    <div class="btn-group app-menu" data-toggle="buttons">
                        <label class="btn btn-info active">
                            <input type="radio" name="options" id="option1" autocomplete="off" checked>All
                        </label>
                        <label class="btn btn-info">
                            <input type="radio" name="options" id="option2" autocomplete="off">Unread only
                        </label>
                    </div>                   
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-cog"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#">{{user.displayName}}<br>
                            {{user.email}}</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Settings</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" @click="logOut">Log out</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
  </div>
</template>
<script>
import auth from '@/auth';
export default {
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
    }
  },
  methods: {
    logOut() {
      auth.logout();
    }
  }
};
</script>
<style scoped>
.navbar-brand {
  font-style: italic;
  font-weight: bolder;
  color: lightgray;
}
.navbar-brand:hover {
  color: gray;
}
.app-menu {
  margin-right: 10px;
}
.app-menu input[type='radio'] {
  display: none;
}
.fa-cog:hover {
  color: gray;
}
.fa-cog {
  color: lightgray;
}
</style>


