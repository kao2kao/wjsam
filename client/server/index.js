var express = require('express');
var app = express();
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');

app.use(express.bodyParser());
ejs.open = '<?';
ejs.close = '?>';
var mockDelay = 1000;

app.get(/^\/.+\.jsonp$/, function(req,res,next){
  var urlPath = req.path.replace(/\.jsonp$/, '.json');
  setTimeout(function(){
    res.jsonp(getMock(urlPath, req.query));
  }, mockDelay);
});

app.get(/^\/.+\.json$/, function(req,res,next){
  var urlPath = req.path;
  setTimeout(function(){
    res.send(getMock(urlPath, req.query));
  }, mockDelay);
});

app.post(/^\/.+\.json$/, function(req,res,next){
  var urlPath = req.path;
  setTimeout(function(){
    res.send(getMock(urlPath, req.body));
  }, mockDelay);
});

app.use('/', express.static(path.resolve(__dirname, '../src')));

function getMock(urlPath, query){
  urlPath = urlPath.replace(/\.jsonp$/, '.json');
  var content = ejs.render(fs.readFileSync(path.join(__dirname,'../test/mock', urlPath)).toString(), {
    query: query
  });
  try{
    return JSON.parse(content);
  }catch(e){
    console.log('\nparse '+ urlPath+' error',e);
    return ''
  }
}

module.exports = app;