import Vue from 'vue';

const state = {
  sidebarWidth: null,
  contentMargin: null,
  contentWidth: null,
  showSidebar: false
};

const getters = {
  sidebarWidth: state => state.sidebarWidth,
  contentMargin: state => state.contentMargin,
  showSidebar: state => state.showSidebar,
  contentWidth: state => state.contentWidth
};

const mutations = {
  openSidebar: state => {
    state.showSidebar = true;
    const sidebar = document.querySelector('#app-sidebar');
    const content = document.querySelector('#app-content');
    function changeContenttSize() {
      state.sidebarWidth = sidebar.offsetWidth;
      state.contentMargin = state.sidebarWidth;
      content.style.marginLeft = `${state.contentMargin}px`;
      content.offsetWidth = `${content.offsetWidth - state.sidebarWidth}`;
    }
    changeContenttSize();
    window.addEventListener('resize', changeContenttSize, false);
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
