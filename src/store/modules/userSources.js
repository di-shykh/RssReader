import Vue from 'vue';
import auth from '@/auth';
import 'es6-promise/auto';
import firebase from 'firebase';

const state = {
  sources: [],
  categories: [],
  flag: 0,
  viewList: true,
  textForSearch: '',
};

const getters = {
  sources: state => state.sources,
  categories: state => state.categories,
  flag: state => state.flag,
  viewList: state => state.viewList,
  textForSearch: state => state.textForSearch,
};

const mutations = {
  setCategories: (state, categories) => {
    state.categories = categories;
  },
  setSources: (state, sources) => {
    state.sources = sources;
  },
  setTextForSearch: (state, text) => {
    state.textForSearch = text;
  },
  saveStatusRead: state => {
    state.flag++;
  },
  hideOrShowReadedArticles: state => {
    state.sources.forEach(item => {
      item.source.articles = item.source.articles.filter(o => o.read !== true);
    });
  },
  changeViewOfArticles: state => {
    state.viewList = !state.viewList;
  },
};

const actions = {
  setUserSources: ({ commit, state }) => {
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
          commit('setSources', sources);
        });
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
  },
  setUserCategories: ({ commit, state }) => {
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
              sources:
                data.val().category.sources != null
                  ? Object.keys(data.val().category.sources).map(
                      key => data.val().category.sources[key]
                    )
                  : data.val().category.sources,
            },
          };
          categories.push(cat);
          commit('setCategories', categories);
        });
      },
      function(error) {
        console.log('Error: ' + error.code);
      }
    );
  },
  saveBookmarckedArticles: ({ commit, state }, art) => {
    const article = art.article;
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    let article_key;
    let ref = userDb
      .child('sources/' + art.source.key + '/source/articles/')
      .orderByChild('link')
      .equalTo(article.link)
      .once('value', function(snapshot) {
        snapshot.forEach(function(data) {
          article_key = data.key;
        });
      });
    ref = userDb.child(
      'sources/' + art.source.key + '/source/articles/' + article_key + '/readLater'
    );

    ref.set(article.readLater);
  },
  saveReadArticle: ({ commit, state }, art) => {
    const article = art.article;
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    let article_key;
    let ref = userDb
      .child('sources/' + art.source.key + '/source/articles/')
      .orderByChild('link')
      .equalTo(article.link)
      .once('value', function(snapshot) {
        snapshot.forEach(function(data) {
          article_key = data.key;
        });
      });
    ref = userDb.child('sources/' + art.source.key + '/source/articles/' + article_key + '/read');
    ref.set(article.read);
    commit('saveStatusRead');
  },
  saveNewSourceName: ({ commit, state }, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);

    let ref = userDb.child('sources/' + data.source_key + '/source/name');
    ref.set(data.new_name);

    ref = userDb.child('categories/' + data.category_key + '/category/sources/');
    let sourceIdInCategory = -1;
    ref
      .once('value', function(snapshot) {
        snapshot.forEach(function(o) {
          if (o.val() == data.source_name) sourceIdInCategory = o.key;
        });
      })
      .then(() => {
        if (sourceIdInCategory >= 0) {
          ref = userDb.child(
            'categories/' + data.category_key + '/category/sources/' + sourceIdInCategory
          );
          ref.set(data.new_name);
        }
      });
  },
  unfollowSource: ({ commit, state }, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);

    const refToSource = userDb.child('sources/' + data.sourceKey);
    refToSource.remove();

    const refToSourcesInCategory = userDb.child(
      'categories/' + data.category_key + '/category/sources/'
    );
    refToSourcesInCategory
      .once('value', function(snapshot) {
        let sourceIdInCategory = -1;
        snapshot.forEach(function(o) {
          if (o.val() == data.source_name) sourceIdInCategory = o.key;
        });
        if (sourceIdInCategory >= 0) {
          const refToSourcesInCategoryForRemove = userDb.child(
            'categories/' + data.category_key + '/category/sources/' + sourceIdInCategory
          );
          refToSourcesInCategoryForRemove.remove();
        }
      })
      .then(() => {
        const refToSourcesInCategory = userDb
          .child('categories/' + data.category_key + '/category/sources/')
          .once('value', function(snapshot) {
            if (!snapshot.exists() || snapshot.val() === null) {
              const refToCategory = userDb.child('categories/' + data.category_key);
              refToCategory.remove();
            }
          });
      });
  },
  changeCategory: ({ commit, state }, data) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);

    //set new category in source
    const refToCategoryInSources = userDb.child('sources/' + data.sourceKey + '/source/category');
    refToCategoryInSources.set(data.new_category_name);

    //remove source from array of sources in old category
    const refToSourcesInCategory = userDb.child(
      'categories/' + data.old_category_key + '/category/sources/'
    );
    refToSourcesInCategory
      .once('value', function(snapshot) {
        let sourceIdInCategory = -1;
        snapshot.forEach(function(o) {
          if (o.val() == data.source_name) {
            sourceIdInCategory = o.key;
          }
        });
        if (sourceIdInCategory >= 0) {
          const refToSourcesInCategory = userDb.child(
            'categories/' + data.old_category_key + '/category/sources/' + sourceIdInCategory
          );
          refToSourcesInCategory.remove();
        }
      })
      .then(() => {
        //if array of sources in old category is empty, remove category
        const refToSourcesToRemoveInCategory = userDb
          .child('categories/' + data.old_category_key + '/category/sources/')
          .once('value', function(snapshot) {
            if (!snapshot.exists() || snapshot.val() === null) {
              const refToCategoryToRemove = userDb.child('categories/' + data.old_category_key);
              refToCategoryToRemove.remove();
            }
          });
      });

    //add source to array of sources in new category
    const refToSourcesInNewCategory = userDb
      .child('categories/' + data.new_category_key + '/category/sources/')
      .limitToLast(1);

    refToSourcesInNewCategory.once('value', function(snapshot) {
      let source_key;
      snapshot.forEach(function(data) {
        source_key = data.key;
      });
      source_key = parseInt(source_key) + 1;
      if (!source_key) source_key = 0;
      const refToSourcesInNewCategoryToSet = userDb.child(
        'categories/' + data.new_category_key + '/category/sources/' + source_key
      );
      refToSourcesInNewCategoryToSet.set(data.source_name);
    });
  },
  createNewCategory: ({ commit, state }, data) => {
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
  hideOrShowReadedArticles: ({ commit, state }) => {
    commit('hideOrShowReadedArticles');
  },
  changeViewOfArticles: ({ commit, state }) => {
    commit('changeViewOfArticles');
  },
  updateSources: ({ commit, dispatch, state }) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    state.sources.forEach(async item => {
      const articles = await dispatch('downloadSourceArticlesFromURL', item);
      if (articles) {
        let data = {
          source: item,
          articles: articles,
          userDb: userDb,
        };
        dispatch('updateArticles', data);
      }
    });
  },
  downloadSourceArticlesFromURL({ commit, dispatch, state }, source) {
    return new Promise((resolve, reject) => {
      try {
        const xmlhttp = new XMLHttpRequest();
        const URL = 'https://cors-anywhere.herokuapp.com/' + source.source.rssLink;
        xmlhttp.open('GET', URL, true);
        xmlhttp.onload = function(e) {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const xmlDoc = xmlhttp.responseXML;
            if (xmlDoc && xmlDoc.evaluate) {
              const articles = dispatch('parseSource', xmlDoc);
              resolve(articles);
            }
          } else {
            reject(console.error(xmlhttp.statusText));
          }
        };
        xmlhttp.onerror = function(e) {
          reject(console.error(xmlhttp.statusText));
        };
        xmlhttp.send(null);
      } catch (error) {
        reject(console.error(error));
      }
    });
  },
  parseSource: ({ commit, state }, xmlDoc) => {
    let articles = [];
    const nodesSnapshot = xmlDoc.evaluate(
      '//channel/item',
      xmlDoc,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
      const article = {
        title: '',
        link: '',
        description: '',
        date: '',
        img: '',
        read: false,
        readLater: false,
      };
      article.title = nodesSnapshot.snapshotItem(i).getElementsByTagName('title')[0].textContent;
      article.link = nodesSnapshot.snapshotItem(i).getElementsByTagName('link')[0].textContent;
      article.description = nodesSnapshot
        .snapshotItem(i)
        .getElementsByTagName('description')[0].textContent;
      article.date = nodesSnapshot.snapshotItem(i).getElementsByTagName('pubDate')[0].textContent;
      articles.push(article);
    }
    var namespaceResolver = (function() {
      var prefixMap = {
        media: 'http://search.yahoo.com/mrss/',
        ynews: 'http://news.yahoo.com/rss/',
      };
      return function(prefix) {
        return prefixMap[prefix] || null;
      };
    })();
    const articlesImg = xmlDoc.evaluate(
      '//channel/item/media:thumbnail/@url',
      xmlDoc,
      namespaceResolver,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )
      ? xmlDoc.evaluate(
          '//channel/item/media:thumbnail/@url',
          xmlDoc,
          namespaceResolver,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        )
      : xmlDoc.evaluate(
          '//channel/item/media:content/@url',
          xmlDoc,
          namespaceResolver,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

    for (let i = 0; i < articlesImg.snapshotLength; i++) {
      articles[i].img = articlesImg.snapshotItem(i).textContent;
    }
    return articles;
  },
  updateArticles: ({ commit, state }, data) => {
    data.articles.forEach(o => {
      const refToArticles = data.userDb
        .child('sources/' + data.source.key + '/source/articles/')
        .orderByChild('link')
        .equalTo(o.link);
      refToArticles.once('value', function(snapshot) {
        if (!snapshot.val()) {
          const refToLastArticle = data.userDb
            .child('sources/' + data.source.key + '/source/articles/')
            .limitToLast(1);
          refToLastArticle.once('value', function(snapshot) {
            let article_key;
            snapshot.forEach(function(data) {
              article_key = data.key;
            });
            article_key = parseInt(article_key) + 1;
            const refToNewArticle = data.userDb.child(
              'sources/' + data.source.key + '/source/articles/' + article_key
            );
            refToNewArticle.set(o);
          });
        }
      });
    });
  },
  findArticle: ({ commit, state }, text) => {
    commit('setTextForSearch', text);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
