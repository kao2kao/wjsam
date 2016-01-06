var path = require('path');
var less = require('less');
var content = process.argv[2];
var filepath = process.argv[3];

/*
less.render(content, {
  paths:filepath
}, function(e, output){
  process.stdout.write(output.css);
});*/
