const request = require('request');
const Parser  = require('libxmljs');

exports.findRssInUrl = function findRssInUrl(URL) {
  return new Promise((resolve, reject) => {
    try {
      request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //падает с разными ошибками, на разных сайтах разные ошибки падают в консоль или вообще зависает наглухо
          const  xmlDoc = Parser.parseXml(body);
          let rssFeeds=[];
          let feeds = xmlDoc.find('//link[@type="application/rss+xml"]/@href');
          if(feeds){
            feeds.forEach(item=>{
              rssFeeds.push(item.value());
            }) 
            resolve(rssFeeds);
          }
        }});
    } catch (error) {
      reject(console.error(error));
    }
  });
}
exports.findCurrentSource = function findCurrentSource(URL) {
  return new Promise((resolve, reject) => {
    try {
      request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const  xmlDoc = Parser.parseXml(body);

          const title = xmlDoc.get('//channel/title').text();
          const url = xmlDoc.get('//channel/link').text();
          const text = xmlDoc.get('//channel/description').text();
          let img = '';
          if (xmlDoc.get('//channel/image/url')) {
            img = xmlDoc.get('//channel/image/url').text();
          }
          
          const articles = [];
          const items = xmlDoc.find('//channel/item');
          let i=0;
          items.forEach(item => {
            const article = {
              title: '',
              link: '',
              description: '',
              date: '',
              img: '',
              read: false,
              readLater: false,
            };

            article.title = item.get('title').text();
            article.link = item.get('link').text();
            article.description = item.get('description').text();
            article.date = item.get('pubDate').text();
            if(item.find('//@url')[i])
              article.img = item.find('//@url')[i].value();
            articles.push(article);
            i++;
          })
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
      });
    } catch (error) {
      reject(console.error(error));
    }
  });
}
exports.updateSource = function updateSource(URL) {
  return new Promise((resolve, reject) => {
    try {
      request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const  xmlDoc = Parser.parseXml(body);
          const articles = [];
          const items = xmlDoc.find('//channel/item');
          let i=0;
          items.forEach(item => {
            const article = {
              title: '',
              link: '',
              description: '',
              date: '',
              img: '',
              read: false,
              readLater: false,
            };

            article.title = item.get('title').text();
            article.link = item.get('link').text();
            article.description = item.get('description').text();
            article.date = item.get('pubDate').text();
            if(item.find('//@url')[i])
              article.img = item.find('//@url')[i].value();
            articles.push(article);
            i++;
          })
          resolve(articles);
        }});
    } catch (error) {
      reject(console.error(error));
    }
  });
}
