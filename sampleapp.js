var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');

var ejs_hello = fs.readFileSync("./hello.ejs", 'utf-8');
var ejs_tweetlist = fs.readFileSync("./tweetlist.ejs", 'utf-8');

mysql://b49c824740c2da:c407fa91@us-cdbr-iron-east-04.cleardb.net/heroku_20e30b52a4f14b5?reconnect=true

var connection = mysql.createConnection({
  host:'us-cdbr-iron-east-04.cleardb.net',
  user:'b49c824740c2da',
  password:'c407fa91',
  database:'heroku_20e30b52a4f14b5',
  port:3306
});
connection.connect();

const PORT = process.env.PORT || 5000
var server = http.createServer();
server.on('request', doRequest);
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
console.log('Server running!');

// リクエストの処理
function doRequest(req, res) {
  connection.query('select * from tweet', function(error,results,fields){
    if (error) {
      console.log(error);
    }

    var rend_hello = ejs.render(ejs_hello,{
      tweetlist:ejs.render(ejs_tweetlist,{
        tweets:results
      })
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(rend_hello);
    res.end();
  });
}
