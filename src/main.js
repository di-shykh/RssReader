import Vue from 'vue';
import App from './App';
import { router } from '@/router';
import { store } from '@/store';
import auth from '@/auth';
//import VueResource from 'vue-resource';
//import VueFire from 'vuefire';

//Vue.use(VueFire);
//Vue.use(VueResource);
//Vue.http.options.credentials = true;
/*Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.http.headers.common['Content-type'] = 'application/xml';
Vue.http.headers.common['Access-Control-Allow-Methods']='GET, POST, OPTIONS'; */

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  beforeCreate() {
    auth.init(this);
  },
  components: { App },
  template: '<App/>'
});
