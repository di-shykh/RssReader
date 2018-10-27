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
  resetSourcesAndFeeds: state => {
    state.source = [];
    state.rssFeeds = [];
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
  findCurrentSource({ commit, state }, URL) {
    return new Promise((resolve, reject) => {
      try {
        const xmlhttp = new XMLHttpRequest();
        const proxyURL = 'https://cors-anywhere.herokuapp.com/' + URL;
        xmlhttp.open('GET', proxyURL, true);
        xmlhttp.onload = function(e) {
          if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
              const xmlDoc = xmlhttp.responseXML;
              if (xmlDoc) {
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
                    name: title,
                    link: url,
                    description: text,
                    img: img,
                    rssLink: URL,
                    articles,
                  };
                  resolve(newSource);
                }
              } else {
                reject(console.error(xmlhttp.statusText));
              }
            } else reject(console.error(xmlhttp.statusText));
          } else reject(console.error(xmlhttp.statusText));
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
    let source_key;
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(data) {
        source_key = data.key;
      });
    });
    source_key = parseInt(source_key) + 1;
    if (!source_key) source_key = 0;
    ref = userDb.child('categories/' + data.category_key + '/category/sources/' + source_key);
    ref.set(source.name);
    //add source to sources
    userDb.child('sources').push({ source });
  },

  findRssInUrl({ commit, state }, URL) {
    return new Promise((resolve, reject) => {
      try {
        const xmlhttp = new XMLHttpRequest();
        URL = 'https://cors-anywhere.herokuapp.com/' + URL;
        xmlhttp.open('GET', URL);
        xmlhttp.responseType = 'document';
        xmlhttp.send();
        xmlhttp.onload = function() {
          if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
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
              resolve(commit('findRssInUrl', rssFeeds));
            } else
              reject(() => {
                console.error(xmlhttp.statusText);
                alert("Unfortunately we can't save this blog");
                state.error;
              });
          } else
            reject(() => {
              console.error(xmlhttp.statusText);
              alert("Unfortunately we can't save this blog");
              commit('setError');
            });
        };
        xmlhttp.onerror = function(e) {
          reject(() => {
            console.error(xmlhttp.statusText);
            alert("Unfortunately we can't save this blog");
          });
        };
      } catch (error) {
        reject(() => {
          console.error(error);
          alert("Unfortunately we can't save this blog");
        });
      }
    });
  },
  async parseFeed({ commit, dispatch, state }, URL) {
    let newSource;
    let degrees = 0;
    let isTimerWorking = false;
    const wait = document.querySelector('.wait');
    const elem = document.querySelector('#sync');
    wait.style.display = 'flex';
    let loop = setInterval(function() {
      elem.style.transform = 'rotate(' + degrees + 'deg)';
      degrees += 5;
      if (isTimerWorking) {
        clearInterval(loop);
      }
    }, 3);
    try {
      newSource = await dispatch('findCurrentSource', URL);
      if (newSource) {
        commit('findSource', newSource);
        isTimerWorking = true;
        wait.style.display = 'none';
      }
    } catch (error) {
      console.error(error);
    } finally {
      try {
        if (!newSource) {
          const promise = await dispatch('findRssInUrl', URL);
          for (let i = 0; i < state.rssFeeds.length; i++) {
            let source = await dispatch('findCurrentSource', state.rssFeeds[i]);
            if (source) commit('findSource', source);
          }
        }
        isTimerWorking = true;
        wait.style.display = 'none';
      } catch (error) {
        console.error(error);
        isTimerWorking = true;
        wait.style.display = 'none';
        alert("Unfortunately we can't save this blog");
      }
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
