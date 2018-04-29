import Vue from 'vue';
import auth from '@/auth';
import firebase from 'firebase';

const state = {
  sources: null,
  categories: null
};

const getters = {
  sources: state => state.sources,
  categories: state => state.categories
};

const mutations = {
  setCategories: state => {
    const categories = [];
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const cat = userDb.child('categories');
    cat.on(
      'value',
      function(data) {
        data.forEach(function(data) {
          let cat = {
            key: data.key,
            category: {
              name: data.val().category.name,
              sources: data.val().category.sources
            }
          };
          categories.push(cat);
        });
        /* categories = data.map(element => ({
          key: element.key,
          category: {
            name: element.val().category.name,
            sources: element.val().category.sources
          }
        }));*/ //I don't know why,but it doesn't work..
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
    state.categories = categories;
  },
  setSources: state => {
    const sources = [];
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const cat = userDb.child('sources');
    cat.on(
      'value',
      function(data) {
        data.forEach(function(data) {
          let sour = {
            key: data.key,
            source: data.val().source
          };
          sources.push(sour);
        });
        /*sources = data.map(element => ({
          key: element.key,
          source: element.val().source
        }));*/ //I don't know why,but it doesn't work..
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
    state.sources = sources;
  }
};

const actions = {
  setUserSources: ({ commit, state }) => {
    commit('setSources');
  },
  setUserCategories: ({ commit, state }) => {
    commit('setCategories');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
