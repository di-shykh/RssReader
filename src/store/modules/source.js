import Vue from 'vue';
import auth from '@/auth';
import firebase from 'firebase';

const state = {
  source: null,
  flag: false,
};

const getters = {
  source: state => state.source,
};

const mutations = {
  setSource: (state, source) => {
    state.source = source;
  },
  findRssInUrl: (state, URL) => {
    const xmlhttp = new XMLHttpRequest();
    URL = 'https://cors-anywhere.herokuapp.com/' + URL;
    xmlhttp.open('GET', URL, false);
    xmlhttp.send();
    const response = xmlhttp.responseText;
    const doc = document.implementation.createHTMLDocument(''); // create a HTML document
    doc.body.innerHTML = response;
    let x = new XMLSerializer(),
      p = new DOMParser(),
      xml_string,
      xml_doc;
    xml_string = x.serializeToString(doc.body); // now we have a valid string
    xml_doc = p.parseFromString(xml_string, 'application/xml'); // and now it is an XML document
    console.log(xml_doc);

    const nodesSnapshot = xml_doc.evaluate(
      '//body/link[@type="application/rss+xml"]/@href',
      xml_doc,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    console.log(nodesSnapshot); //возращает XPathResult {resultType: 7, invalidIteratorState: false, snapshotLength: 0}

    for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
      console.log('hi'); //не выполняется ни разу
      console.log(nodesSnapshot.snapshotItem(i));
    }
  },
  findSource: (state, URL) => {
    try {
      const xmlhttp = new XMLHttpRequest();
      URL = 'https://cors-anywhere.herokuapp.com/' + URL;
      xmlhttp.open('GET', URL, false);
      xmlhttp.send();
      const xmlDoc = xmlhttp.responseXML;
      if (xmlDoc.evaluate) {
        function findItemValue(xpath) {
          return xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null).iterateNext()
            .childNodes[0].nodeValue;
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
          article.link = nodesSnapshot.snapshotItem(i).getElementsByTagName('link')[0].textContent;
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
        state.source = newSource;
      }
    } catch (error) {
      console.error(error);
      alert("Unfortunately we can't save this blog");
    }
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
  saveSource: state => {
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
  saveSourceInExistCategory: state => {
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
      state.source.category.sources.push(source.name);
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
  },
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
  },
  findRssInUrl: ({ commit, state }, source) => {
    commit('findRssInUrl', source);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
