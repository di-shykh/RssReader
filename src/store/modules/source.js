import Vue from 'vue';
import $ from 'jquery';
import auth from '@/auth';
import firebase from 'firebase';

const state = {
  source: null,
  flag: false
};

const getters = {
  source: state => state.source
};

const mutations = {
  setSource: (state, source) => {
    state.source = source;
  },
  findSource: (state, URL) => {
    var xmlhttp;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xmlhttp.open('GET', URL, false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    var x = xmlDoc.getElementsByTagName('channel');

    var url = x[0].getElementsByTagName('link')[0].childNodes[0].nodeValue;
    var title = x[0].getElementsByTagName('title')[0].childNodes[0].nodeValue;
    var text = x[0].getElementsByTagName('description')[0].childNodes[0]
      .nodeValue;
    var date = x[0].getElementsByTagName('pubDate')[0].childNodes[0].nodeValue;
    if (x[0].getElementsByTagName('image')[0])
      var img = x[0]
        .getElementsByTagName('image')[0]
        .getElementsByTagName('url')[0].childNodes[0].nodeValue;

    var item = xmlDoc.getElementsByTagName('item');
    var articles = [];

    for (let j = 0; j < item.length; j++) {
      var article = {};
      article.title = item[j].getElementsByTagName(
        'title'
      )[0].childNodes[0].nodeValue;
      article.link = item[j].getElementsByTagName(
        'link'
      )[0].childNodes[0].nodeValue;
      article.description = item[j].getElementsByTagName(
        'description'
      )[0].childNodes[0].nodeValue;
      article.date = item[j].getElementsByTagName(
        'pubDate'
      )[0].childNodes[0].nodeValue;
      var img;
      if (item[j].getElementsByTagName('media:content')[0])
        img = item[j]
          .getElementsByTagName('media:content')[0]
          .getAttribute('url');
      if (item[j].getElementsByTagName('media:thumbnail')[0]) {
        img = item[j]
          .getElementsByTagName('media:thumbnail')[0]
          .getAttribute('url');
      }
      if (img === undefined) img = '';
      article.read = false;
      article.readLater = false;
      articles.push(article);
    }
    var newSource = {
      sTitle: title,
      sLink: url,
      sDescr: text,
      sImg: img,
      rssLink: URL,
      articles
    };
    state.source = newSource;
  },
  setCategory: (state, category) => {
    if (!category.key) {
      state.source.category = category;
      state.flag = true;
    } else {
      state.source.category = {
        key: category.key,
        name: category.name,
        sources: category.sources
      };
    }
  },
  saveSource: state => {
    var db = firebase.database();
    var id = auth.user().uid;
    var userDb = db.ref(id);
    var source = {
      name: state.source.sTitle,
      description: state.source.sDescr,
      img: state.source.sImg,
      link: state.source.sLink,
      rssLink: state.source.rssLink,
      articles: state.source.articles
    };
    if (state.flag) {
      source.category = state.source.category;
    } else {
      source.category = state.source.category.name;
    }
    var category = {
      name: state.source.category,
      sources: [source.name]
    };
    userDb.child('categories').push({ category });
    userDb.child('sources').push({ source });
  },
  saveSourceInExistCategory: state => {
    var db = firebase.database();
    var id = auth.user().uid;
    var userDb = db.ref(id);
    var source = {
      name: state.source.sTitle,
      description: state.source.sDescr,
      img: state.source.sImg,
      link: state.source.sLink,
      rssLink: state.source.rssLink,
      category: state.source.category.name,
      articles: state.source.articles
    };
    var cat = userDb.child('categories/' + state.source.category.key);
    if (state.source.category.sources.includes(source.name)) {
      alert('This source already exists!');
    } else {
      state.source.category.sources.push(source.name);
      var category = {
        name: state.source.category.name,
        sources: state.source.category.sources
      };
      cat.set({
        category: {
          name: state.source.category.name,
          sources: state.source.category.sources
        }
      });
      userDb.child('sources').push({ source });
    }
  }
};

const actions = {
  setCurrentSource: ({ commit, state }, source) => {
    commit('setSource', source);
  },
  findCurrentSource: ({ commit, state }, str) => {
    commit('findSource', str);
  },
  setCurrentCategory: ({ commit, state }, category) => {
    commit('setCategory', category);
  },
  saveCurrentSource: ({ commit, state }) => {
    commit('saveSource');
  },
  saveCurrentSourceInExistCategory: ({ commit, state }) => {
    commit('saveSourceInExistCategory');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
