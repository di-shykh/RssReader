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
    var categories = [];
    var db = firebase.database();
    var id = auth.user().uid;
    var userDb = db.ref(id);
    var cat = userDb.child('categories');
    cat.on(
      'value',
      function(data) {
        data.forEach(function(data) {
          var cat = {
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
    var sources = [];
    var db = firebase.database();
    var id = auth.user().uid;
    var userDb = db.ref(id);
    var cat = userDb.child('sources');
    cat.on(
      'value',
      function(data) {
        data.forEach(function(data) {
          var sour = {
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