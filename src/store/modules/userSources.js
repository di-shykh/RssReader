import Vue from 'vue';
import auth from '@/auth';
import firebase from 'firebase';

const state = {
  sources: null,
  categories: null,
};

const getters = {
  sources: state => state.sources,
  categories: state => state.categories,
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
              sources: data.val().category.sources,
            },
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
          let source = {
            key: data.key,
            source: data.val().source,
          };
          sources.push(source);
        });
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
    state.sources = sources;
  },
  /*saveExistingSource: (state, source) => {
        const db = firebase.database();
        const id = auth.user().uid;
        const userDb = db.ref(id);
        const sourceRef = userDb.child('sources/' + source.key);
        sourceRef.set({
          source: {
            name: source.source.name,
            description: source.source.description,
            img: source.source.img,
            link: source.source.link,
            rssLink: source.source.rssLink,
           category: source.source.category,
            articles: source.source.articles
          }
       });
      } 
  saveExistingArticle: (state, art) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const articleRef = userDb.child(
      'sources/' + art.source.key + '/source/articles/' + art.article_key
    );
    const article = art.article;
    articleRef.set({
      title: article.title,
      link: article.link,
      description: article.description,
      date: article.date,
      img: article.img,
      read: article.read,
      readLater: article.readLater
    });
  },использовать потом для сохранения изменений в источнике и статье. Это не мертвый код,он мне еще нужен:)*/
  saveStatusReadLater: (state, art) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    //тут кол-во статей увеличивается после отметки прочитать позже
    const ref = userDb.child(
      'sources/' + art.source.key + '/source/articles/' + art.article_key + '/readLater'
    );
    const article = art.article;
    ref.set(article.readLater);
  },
  saveStatusRead: (state, art) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    //тут кол-во статей увеличивается после отметки прочитано
    const ref = userDb.child(
      'sources/' + art.source.key + '/source/articles/' + art.article_key + '/read'
    );
    const article = art.article;
    ref.set(article.read);
  },
  changeSourceName: (state, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    //кол-во источников почему-то увеличивается,после переименования.Что я не так делаю?
    state.sources.find(item => item.key === data.source_key).source.name = data.newName;
    state.categories.find(item => item.key === data.category_key).category.sources[
      data.sourceIdInCategory
    ] =
      data.newName;

    let ref = userDb.child('sources/' + data.source_key + '/source/name');
    ref.set(data.newName);
    ref = userDb.child(
      'categories/' + data.category_key + '/category/sources/' + data.sourceIdInCategory
    );
    ref.set(data.newName);
  },
  deleteSource: (state, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    //тут где-то косяк,только не пойму где именно
    state.sources = state.sources.filter(item => item.key !== data.source_key);
    state.categories
      .find(item => item.key === data.category_key)
      .category.sources.splice(data.sourceIdInCategory, 1);
    let ref = userDb.child('sources/' + data.source_key);
    ref.remove();
    ref = userDb.child(
      'categories/' + data.category_key + '/category/sources/' + data.sourceIdInCategory
    );
    ref.remove();
  },
  changeCategoryOfSource: (state, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    console.log(data);
    state.sources.find(item => item.key === data.source_key).source.category =
      data.new_category_name;
    console.log(state.sources.find(item => item.key === data.source_key).source.category);
    state.categories
      .find(item => item.key === data.old_category_key)
      .category.sources.splice(data.sourceIdInCategory, 1);
    state.categories
      .find(item => item.key === data.new_category_key)
      .category.sources.push(data.source_name);
    console.log(state.categories);
  },
};

const actions = {
  setUserSources: ({ commit, state }) => {
    commit('setSources');
  },
  setUserCategories: ({ commit, state }) => {
    commit('setCategories');
  },
  saveBookmarckedArticles: ({ commit, state }, art) => {
    commit('saveStatusReadLater', art);
  },
  saveReadArticle: ({ commit, state }, art) => {
    commit('saveStatusRead', art);
  },
  saveNewSourceName: ({ commit, state }, data) => {
    commit('changeSourceName', data);
  },
  ufollowSource: ({ commit, state }, data) => {
    commit('deleteSource', data);
  },
  changeCategory: ({ commit, state }, data) => {
    commit('changeCategoryOfSource', data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
