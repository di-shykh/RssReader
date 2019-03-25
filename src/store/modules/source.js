import Vue from 'vue';
import auth from '@/auth';
import 'es6-promise/auto';
import firebase from 'firebase';
import ConnectToServer from '@/services/ConnectToServer';

const state = {
  source: [],
  flag: false,
};

const getters = {
  source: state => state.source,
};

const mutations = {
  setSource: (state, source) => {
    state.source = source;
  },
  findSource: (state, source) => {
    state.source = source.slice(0);
  },
  setCategory: (state, category) => {
    if (!category.key) {
      state.source.category = category;
      state.flag = true;
    } else {
      state.source.category = {
        key: category.key,
        name: category.name,
        sources: category.sources,
      };
    }
  },
  resetSourcesAndFeeds: state => {
    state.source = [];
    state.error = false;
  },
};

const actions = {
  setCurrentSource: ({ commit, state }, source) => {
    commit('setSource', source);
  },
  resetSourcesAndFeeds: ({ commit, state }) => {
    commit('resetSourcesAndFeeds');
  },
  saveCurrentSourceInNewCategory: ({ commit, state }, source) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);

    const category = {
      name: source.category,
      sources: [source.name],
    };
    userDb.child('categories').push({ category });
    userDb.child('sources').push({ source });
  },
  saveCurrentSourceInExistCategory: ({ commit, state }, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const source = data.source;
    //save source in array of sources in categories and in sources
    let ref = userDb.child('categories/' + data.category_key + '/category/sources/').limitToLast(1);
    let sourceKey;
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(data) {
        sourceKey = data.key;
      });
    });
    sourceKey = parseInt(sourceKey) + 1;
    if (!sourceKey) sourceKey = 0;
    ref = userDb.child('categories/' + data.category_key + '/category/sources/' + sourceKey);
    ref.set(source.name);
    //add source to sources
    userDb.child('sources').push({ source });
  },

  async parseFeed({ commit, state }, URL) {
    const wait = document.querySelector('.wait');
    const elem = document.querySelector('#sync');
    wait.style.display = 'flex';
    elem.classList.add('rotate');
    try {
      const responseNewSource = await ConnectToServer.findCurrentSource({ url: URL });
      if (responseNewSource.data) {
        commit('findSource', responseNewSource.data);
      }
      if (responseNewSource.data.length == 0) {
        alert("Unfortunately we can't save this blog");
      }
      elem.classList.remove('rotate');
      wait.style.display = 'none';
    } catch (error) {
      console.error(error);
      elem.classList.remove('rotate');
      wait.style.display = 'none';
      alert("Unfortunately we can't save this blog");
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
