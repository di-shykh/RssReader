import Vue from 'vue';
import $ from 'jquery';
import auth from '@/auth';
import firebase from 'firebase';

const state = {
    source: null,
    flag:false
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
        if(!category.key){
            state.source.category=category;
            state.flag=true
        }
        else{
            state.source.category={
                key:category.key,
                name:category.name,
                sources:category.sources
            };
        }
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
            articles:state.source.articles
        };
        if (state.flag){           
            source.category=state.source.category;
        }
        else{
            source.category=state.source.category.name;
        }     
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
       var cat= userDb.child('categories/'+state.source.category.key);
       if(state.source.category.sources.includes(source.name)){
            alert("This source already exists!")
       }
       else{
        state.source.category.sources.push(source.name);
        var category={
             name:state.source.category.name,
             sources:state.source.category.sources
         };
         cat.set({category:{name:state.source.category.name,
             sources:state.source.category.sources}});
         userDb.child('sources').push({source});
       }
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