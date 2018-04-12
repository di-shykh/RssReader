import Vue from 'vue';
import $ from 'jquery';
import auth from '@/auth';
import firebase from 'firebase';

const state = {
    source: null
}

const getters = {
    source: state => state.source
}

const mutations = {
    setSource: (state, source) => {
        state.source = source
    },
    findSource:(state,str)=>{
            $.ajax(str, {
                accepts:{
                    xml:"application/rss+xml"
                },
                dataType:"xml",
                success:function(xml) {            
                    var self = $(xml).find('channel');
                    var url = $(self).find('link').first().text();
                    var title = $(self).find('title').first().text();
                    var text = $(self).find('description').first().text();
                    var date = $(self).find('pubDate').first().text();
                    var img=$(self).find('image').find('url').text();

                    var articles=[];
                    
                    $(xml).find("item").each(function () { 
                        var article={};
                        var el = $(this);
                        article.title=el.find("title").text();
                        article.link=el.find("link").text();
                        article.desription=el.find("description").text();
                        article.date=el.find('pubDate').text();
                        var img=el.find('media\\:content,content').attr('url');
                        if(img===undefined)
                            img=el.find('media\\:thumbnail,thumbnail').attr('url');
                        if(img===undefined)
                            img="";
                        article.img=img;
                        article.read=false;
                        article.readLater=false;
                        articles.push(article);
                    });
                    var newSource={
                        sTitle: title,
                        sLink:url,
                        sDescr:text,
                        sImg:img,
                        rssLink:str,
                        articles
                    };   
                    state.source=newSource;
                }   
            });
    },
    setCategory: (state, category)=>{
        state.source.category=category;
    },
    saveSource:(state)=>{
        var db=firebase.database();
        var id=auth.user().uid;
        var userDb=db.ref(id);
        var source={
            name:state.source.sTitle,
            description:state.source.sDescr,
            img:state.source.sImg,
            link:state.source.sLink,
            rssLink:state.source.rssLink,
            category:state.source.category,
            articles:state.source.articles
        };
        var category={
            name:state.source.category,
            sources:[source.name]
        };
        userDb.child('categories').push({category});
        userDb.child('sources').push({source});
    },
    saveSourceInExistCategory:(state)=>{
        var db=firebase.database();
        var id=auth.user().uid;
        var userDb=db.ref(id);
        var source={
            name:state.source.sTitle,
            description:state.source.sDescr,
            img:state.source.sImg,
            link:state.source.sLink,
            rssLink:state.source.rssLink,
            category:state.source.category.name,
            articles:state.source.articles
        };
       var cat= userDb.child('categories/'+state.source.category.key);//вот тут проблема...
       var category={
            name:state.source.category.name,
            sources:[source.name]
        };
        console.log(state.source.category.sources);
        //state.source.category.sources.push(source.name);
        //cat.update({category})
        //cat.update(source.name);
        //userDb.child('sources').push({source});
    }
}

const actions = {
    setCurrentSource: ({ commit,state },source) => {
      commit('setSource',source)
    },
    findCurrentSource:({ commit,state },str)=>{
        commit('findSource',str);
    },
    setCurrentCategory:({ commit,state }, category)=>{
        commit('setCategory',category);
    },
    saveCurrentSource:({ commit,state })=>{
        commit('saveSource');
    },
    saveCurrentSourceInExistCategory:({ commit,state })=>{
        commit('saveSourceInExistCategory');
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}