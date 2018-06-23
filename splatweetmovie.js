var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql2');


var config_db = {
  host:'us-cdbr-iron-east-04.cleardb.net',
  user:'b49c824740c2da',
  password:'c407fa91',
  database:'heroku_20e30b52a4f14b5',
  port:3306
};
var connection;

var ejs_hello = fs.readFileSync("./hello.ejs", 'utf-8');
var ejs_tweetlist = fs.readFileSync("./tweetlist.ejs", 'utf-8');


function handleDisconnect() {
    console.log('INFO.CONNECTION_DB: ');
    connection = mysql.createConnection(db_config);

    //connection取得
    connection.connect(function(err) {
        if (err) {
            console.log('ERROR.CONNECTION_DB: ', err);
            setTimeout(handleDisconnect, 1000);
        }
    });

    //error('PROTOCOL_CONNECTION_LOST')時に再接続
    connection.on('error', function(err) {
        console.log('ERROR.DB: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ERROR.CONNECTION_LOST: ', err);
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

// リクエストの処理
function doRequest(req, res) {
  connection.query('select * from tweet', function(error,results,fields){
    if (error) {
      console.log('QUERY ERROR: ', error);
      throw error;
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

const PORT = process.env.PORT || 5000
var server = http.createServer();
server.on('request', doRequest);
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
console.log('Server running!');
