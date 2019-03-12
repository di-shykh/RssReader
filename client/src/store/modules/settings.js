import Vue from 'vue';
import auth from '@/auth';
import firebase from 'firebase';

const DEFAULT_SETTINGS = {
  fontFamily: 'sans-serif',
  fontSize: 'medium',
  bgColor: '#ffffff',
  textColor: '#000000',
  sidebarColor: '#dbe4ee',
  sidebarTextColor: '#007bff',
};

const state = {
  settings: null,
};

const getters = {
  settings: state => state.settings,
};

const mutations = {
  setUserSettings: state => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const settingsFromDB = userDb.child('settings');

    settingsFromDB.on(
      'value',
      function(data) {
        if (!data.exists()) {
          settingsFromDB.set(DEFAULT_SETTINGS);
          state.settings = DEFAULT_SETTINGS;
        } else {
          let settings = {};
          data.forEach(function(data) {
            settings[data.key] = data.val();
          });
          state.settings = settings;
        }
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
  },
  setDefaultSettings: state => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const settings = userDb.child('settings');

    settings.set(DEFAULT_SETTINGS);
    state.settings = DEFAULT_SETTINGS;
  },
  setTextColor: (state, data) => {
    state.settings.textColor = data;
  },
  setBgColor: (state, data) => {
    state.settings.bgColor = data;
  },
  setSidebarColor: (state, data) => {
    state.settings.sidebarColor = data;
  },
  setSidebarTextColor: (state, data) => {
    state.settings.sidebarTextColor = data;
  },
  setFotnFamily: (state, data) => {
    state.settings.fontFamily = data;
  },
  setFotnSize: (state, data) => {
    state.settings.fontSize = data;
  },
  saveUserSettings: state => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const settings = userDb.child('settings');
    settings.set(state.settings);
  },
};

const actions = {
  setUserSettings: ({ commit, state }) => {
    commit('setUserSettings');
  },
  setBgColor: ({ commit, state }, data) => {
    commit('setBgColor', data);
  },
  setTextColor: ({ commit, state }, data) => {
    commit('setTextColor', data);
  },
  setSidebarColor: ({ commit, state }, data) => {
    commit('setSidebarColor', data);
  },
  setSidebarTextColor: ({ commit, state }, data) => {
    commit('setSidebarTextColor', data);
  },
  setFotnFamily: ({ commit, state }, data) => {
    commit('setFotnFamily', data);
  },
  setFotnSize: ({ commit, state }, data) => {
    commit('setFotnSize', data);
  },
  setDefaultSettings: ({ commit, state }) => {
    commit('setDefaultSettings');
  },
  saveUserSettings: ({ commit, state }) => {
    commit('saveUserSettings');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
