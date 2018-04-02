<template>
  <div>
    <app-header></app-header>
    <app-sidebar class="float-left"></app-sidebar>
    <img :src="user.photoURL" width="100"> <br>
    <h3>{{user.displayName}}</h3>
    <p>{{user.email}}</p>
    <button @click="logOut">Log out</button>
    <button @click="gotoAdd">Push</button>
    <router-view></router-view>
  </div>
</template>

<script>
 import auth from '@/auth'
 import Header from './Header'
 import Sidebar from './Sidebar'
 import AddSource from './AddSource'

    export default {
        name: 'reader',
        computed: {
            user() {
                return this.$store.getters['user/user']
            }
        },
        components:{
            appHeader:Header,
            appSidebar:Sidebar
        },
        methods: {
            logOut() {
                auth.logout()
            },
            gotoAdd(){
                this.$router.push('addsource');//не работает..Uncaught RangeError: Maximum call stack size exceeded
            }
        }
    }
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