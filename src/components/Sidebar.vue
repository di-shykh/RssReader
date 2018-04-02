<template>
  <div class=" app-sidebar">
      <nav class="sidebar bg-faded">
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <a class="nav-link" href="">Latest articles</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Read later</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Sources <i class="fas fa-cog"></i></a>
            </li>
        </ul>
         <ul class="nav nav-pills flex-column">
             <li class="nav-item">
                <a class="nav-link" href="">All</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Category 1</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Category 2</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Category 3</a>
            </li>
         </ul>
         <ul class="nav nav-pills flex-column">
             <li class="nav-item sidebar-footer">
                 <input id="sidebar-input" class="form-control sidebar-input" type="text" v-show="show" @keyup.enter="addSourse">
                 <button class="btn sidebar-button" @click="addSourse">+Add</button>
             </li>
         </ul>   
      </nav>     
  </div>
</template>
<script>
import $ from 'jquery';
import AddSource from './AddSource';
import {router} from '../router';
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
      return{
          show:false,
          someData:'',
          sources:[]
      }
  },
  computed: mapGetters({
    source: 'source'
  }),
  methods:{
     ...mapActions([
        'findCurrentSource',
        'setCurrentSource'
        ]),
      addSourse(){
        this.show=true;
        var strSourece=document.getElementById('sidebar-input').value;
       if (strSourece){
           this.$store.dispatch('findCurrentSource', strSourece);//error: [vuex] unknown action type: findCurrentSource
           this.$router.push('addsource');//не работает Uncaught RangeError: Maximum call stack size exceeded
        }
        /*if (strSourece){
            $.ajax(strSourece, {
                accepts:{
                    xml:"application/rss+xml"
                },
                dataType:"xml",
                success:function(xml) {            
                    //console.log($(data).find("channel"));
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

                    console.log("--------");
                    console.log( newSource);//парсится все нормально,но не работает остальное
                    this.$store.dispatch('setCurrentSource',newSource);//не работает
                    router.push('/addsource');//не работает Uncaught RangeError: Maximum call stack size exceeded
                }   
            });
        }*/
  }
}
}
</script>
<style scoped>
    .app-sidebar{
        background: rgba(219, 228, 238, 0.877);
        height: calc(100vh - 62px); /* 62 pixel is the height of .navbar */

    }
    ul{
        list-style: none;
    }
    .sidebar-button{
        width: 100%;
        background:rgba(219, 228, 238, 0.877); 
        color: #007BFF;
    }
    .sidebar-button:hover{
        color: rgb(12, 84, 161);
    }
    .sidebar-input{
        width: 100%;
    }
    .sidebar-footer {
        position: absolute; 
        bottom: 0px;
        width: 127px;
    }

</style>


