var express = require('express');
var port = process.env.PORT || 3232;
var app = express();

app.use(express.static(__dirname + '/dist/'))
app.listen(process.env.PORT || port, function(err) {
  if (err) {
    console.log('err')
    return
  }
  console.log(`Listening...`)
})