import Vue from 'vue';
import auth from '@/auth';
import 'es6-promise/auto';
import firebase from 'firebase';

const state = {
  source: [],
  flag: false,
  rssFeeds: [],
};

const getters = {
  source: state => state.source,
  rssFeeds: state => state.rssFeeds,
};

const mutations = {
  setSource: (state, source) => {
    state.source = source;
  },
  findRssInUrl: (state, rssFeeds) => {
    state.rssFeeds = rssFeeds;
  },
  findSource: (state, source) => {
    state.source.push(source);
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
  /* saveSourceInExistCategory: state => {

  },*/
};

const actions = {
  setCurrentSource: ({ commit, state }, source) => {
    commit('setSource', source);
  },
  async findCurrentSource({ commit, state }, URL) {
    try {
      const xmlhttp = new XMLHttpRequest();
      const proxyURL = 'https://cors-anywhere.herokuapp.com/' + URL;
      xmlhttp.open('GET', proxyURL, true);
      xmlhttp.onload = function(e) {
        if (xmlhttp.readyState === 4) {
          if (xmlhttp.status === 200) {
            const xmlDoc = xmlhttp.responseXML;
            if (xmlDoc.evaluate) {
              function findItemValue(xpath) {
                return xmlDoc
                  .evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null)
                  .iterateNext().childNodes[0].nodeValue;
              }
              const title = findItemValue('//channel/title');
              const url = findItemValue('//channel/link');
              const text = findItemValue('//channel/description');
              let img = '';
              if (
                xmlDoc
                  .evaluate('//channel/image/url', xmlDoc, null, XPathResult.ANY_TYPE, null)
                  .iterateNext()
              ) {
                img = findItemValue('//channel/image/url');
              }
              const articles = [];
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
                article.title = nodesSnapshot
                  .snapshotItem(i)
                  .getElementsByTagName('title')[0].textContent;
                article.link = nodesSnapshot
                  .snapshotItem(i)
                  .getElementsByTagName('link')[0].textContent;
                article.description = nodesSnapshot
                  .snapshotItem(i)
                  .getElementsByTagName('description')[0].textContent;
                article.date = nodesSnapshot
                  .snapshotItem(i)
                  .getElementsByTagName('pubDate')[0].textContent;
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

              const newSource = {
                sTitle: title,
                sLink: url,
                sDescr: text,
                sImg: img,
                rssLink: URL,
                articles,
              };
              //commit('findSource', newSource);
              return newSource;
            }
          } else {
            console.error(xmlhttp.statusText);
          }
        }
      };
      xmlhttp.onerror = function(e) {
        console.error(xmlhttp.statusText);
      };
      xmlhttp.send(null);
    } catch (error) {
      console.error(error);
      //alert("Unfortunately we can't save this blog");
    }
  },
  setCurrentCategory: ({ commit, state }, category) => {
    commit('setCategory', category);
  },
  saveCurrentSource: ({ commit, state }) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const source = {
      name: state.source.sTitle,
      description: state.source.sDescr,
      img: state.source.sImg,
      link: state.source.sLink,
      rssLink: state.source.rssLink,
      articles: state.source.articles,
    };
    if (state.flag) {
      source.category = state.source.category;
    } else {
      source.category = state.source.category.name;
    }
    const category = {
      name: state.source.category,
      sources: [source.name],
    };
    userDb.child('categories').push({ category });
    userDb.child('sources').push({ source });
  },
  saveCurrentSourceInExistCategory: ({ commit, state }) => {
    const db = firebase.database();
    const id = auth.user().uid;
    const userDb = db.ref(id);
    const source = {
      name: state.source.sTitle,
      description: state.source.sDescr,
      img: state.source.sImg,
      link: state.source.sLink,
      rssLink: state.source.rssLink,
      category: state.source.category.name,
      articles: state.source.articles,
    };
    const cat = userDb.child('categories/' + state.source.category.key);
    if (state.source.category.sources.includes(source.name)) {
      alert('This source already exists!');
    } else {
      //state.source.category.sources.push(source.name);
      const category = {
        name: state.source.category.name,
        sources: state.source.category.sources,
      };
      cat.set({
        category: {
          name: state.source.category.name,
          sources: state.source.category.sources,
        },
      });
      userDb.child('sources').push({ source });
    }
    // commit('saveSourceInExistCategory');
  },
  async findRssInUrl({ commit, state }, URL) {
    try {
      const xmlhttp = new XMLHttpRequest();
      URL = 'https://cors-anywhere.herokuapp.com/' + URL;
      xmlhttp.open('GET', URL);
      xmlhttp.responseType = 'document';
      xmlhttp.send();
      xmlhttp.onload = function() {
        const xml_doc = this.responseXML;
        const nodesSnapshot = xml_doc.evaluate(
          '//link[@type="application/rss+xml"]/@href',
          xml_doc,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        let rssFeeds = [];
        for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
          rssFeeds.push(nodesSnapshot.snapshotItem(i).textContent);
        }
        commit('findRssInUrl', rssFeeds);
      };
      xmlhttp.onerror = function(e) {
        console.error(xmlhttp.statusText);
      };
    } catch (error) {
      console.error(error);
    }
  },
  async parseFeed({ commit, dispatch, state }, URL) {
    let newSource;
    try {
      newSource = await dispatch('findCurrentSource', URL);
      if (newSource) commit('findSource', newSource);
    } catch (error) {
      console.error(error);
    }
    try {
      if (!newSource) {
        const promise=await dispatch('findRssInUrl', URL);
        if(promise){
          for (let i = 0; i < state.rssFeeds.length; i++) {
            let source = await dispatch('findCurrentSource', state.rssFeeds[i]);
            commit('findSource', source);
          }
        }
      }
    } catch (error) {
      console.error(error);
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
