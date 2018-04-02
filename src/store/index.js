import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import source from './modules/source'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        user,
        source
    }
})