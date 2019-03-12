import Vue from 'vue';

const state = {
  showSidebar: false
};

const getters = {
  showSidebar: state => state.showSidebar
};

const mutations = {
  openSidebar: state => {
    state.showSidebar = true;
  },
  closeSidebar() {
    state.showSidebar = false;
  }
};

const actions = {
  openWideSidebar: ({ commit }) => {
    commit('openSidebar');
  },
  closeWideSidebar: ({ commit }) => {
    commit('closeSidebar');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
