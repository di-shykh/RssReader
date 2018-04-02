import Vue from 'vue'

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
                        articles
                    };
                    //console.log("--------");
                    //console.log( newSource);
                    state.source=newSource;
                }   
            });
    }
}

const actions = {
    setCurrentSource: ({ commit,state },source) => {
      commit('setSource',source)
    },
    findCurrentSource:({ commit,state },str)=>{
        commit('findSource',str);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}