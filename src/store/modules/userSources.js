import Vue from 'vue';
import auth from '@/auth';
import firebase from 'firebase';

const state = {
  sources: [],
  categories: [],
  flag: 0,
};

const getters = {
  sources: state => state.sources,
  categories: state => state.categories,
  flag: state => state.flag,
};

const mutations = {
  setCategories: state => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const cat = userDb.child('categories');
    cat.on(
      'value',
      function(data) {
        const categories = [];
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
        state.categories = categories;
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
  },
  setSources: state => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const cat = userDb.child('sources');
    cat.on(
      'value',
      function(data) {
        const sources = [];
        data.forEach(function(data) {
          let source = {
            key: data.key,
            source: data.val().source,
          };
          sources.push(source);
        });
        state.sources = sources;
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
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
    const article = art.article;
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    let article_key;
    let ref = userDb
      .child('sources/' + art.source.key + '/source/articles/')
      .orderByChild('link')
      .equalTo(article.link)
      .on('value', function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(data) {
          article_key = data.key;
        });
      });
    ref = userDb.child(
      'sources/' + art.source.key + '/source/articles/' + article_key + '/readLater'
    );

    ref.set(article.readLater);
  },
  saveStatusRead: (state, art) => {
    const article = art.article;
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    let article_key;
    let ref = userDb
      .child('sources/' + art.source.key + '/source/articles/')
      .orderByChild('link')
      .equalTo(article.link)
      .on('value', function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(data) {
          article_key = data.key;
        });
      });
    ref = userDb.child('sources/' + art.source.key + '/source/articles/' + article_key + '/read');
    ref.set(article.read);
    state.flag++;
  },
  changeSourceName: (state, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
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
    state.sources.find(item => item.key === data.source_key).source.category =
      data.new_category_name; //change name of category in source
    let ref = userDb.child('sources/' + data.source_key + '/source/category');
    ref.set(data.new_category_name);
    state.categories
      .find(item => item.key === data.old_category_key)
      .category.sources.splice(data.sourceIdInOldCategory, 1); //delete source form old category
    ref = userDb.child(
      'categories/' + data.old_category_key + '/category/sources/' + data.sourceIdInOldCategory
    );
    ref.remove();
    state.categories
      .find(item => item.key === data.new_category_key)
      .category.sources.push(data.source_name); //add source in new category
    const newSourcesInCategory = state.categories.find(item => item.key === data.new_category_key)
      .category.sources;
    ref = userDb.child('categories/' + data.new_category_key + '/category/sources/');
    ref.set(newSourcesInCategory);
  },
  createCategory: (state, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const sources = [];
    const category = {
      name: data,
      sources: sources,
    };
    userDb.child('categories').push({ category });
  },
  hideOrShowReadedArticles: state => {
    state.sources.forEach(item => {
      item.source.articles = item.source.articles.filter(o => o.read !== true);
    });
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
  createNewCategory: ({ commit, state }, data) => {
    commit('createCategory', data);
  },
  hideOrShowReadedArticles: ({ commit, state }) => {
    commit('hideOrShowReadedArticles');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
