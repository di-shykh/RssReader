const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const parser = require('./parser');
const { wrap } = require('express-promise-wrap');


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/addsource', wrap(async(req, res) => {
  const URL = req.body.url;

  let sources=[];
  let newSource;

  try{
    const feeds = await parser.findRssInUrl(URL);
    if (feeds){
      for(let i = 0;i < feeds.length; i++){
        let source = await parser.findCurrentSource(feeds[i]);
        if (source) sources.push(source);
      }
    }
    else{
      newSource = await parser.findCurrentSource(URL);
      if (newSource) sources.push(newSource);
    }
  }
  catch(error){
    console.error(error);
  }
  finally{
    res.send(JSON.stringify(sources));
  }
}));

app.post('/articles', wrap(async(req, res) => {
  const URL = req.body.url;
  let articles=[];

  try{
    articles = await parser.updateSource(URL);
    res.send(JSON.stringify(articles));
  }
  catch(error){
    console.error(error);
  }
}));

const port = process.env.PORT || 8081;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});


