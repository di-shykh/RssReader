import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import source from './modules/source';
import userSources from './modules/userSources';
import appearance from './modules/appearance';
import settings from './modules/settings';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    source,
    userSources,
    appearance,
    settings,
  },
});
