var express=require('express');
var app = express();
var http = require('http').createServer(app);
var mysql = require('mysql');
var crypto = require('crypto');
var cors = require('cors');
var bodyParser = require('body-parser');
app.use('/static', express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cors());
//connect to database
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass123",
    database: "chad"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var sql = "select iu.username,iu.salt,iu.password from  ilance_users iu where iu.username = '" + username + "'"
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {
            var hash = md5(result[0].salt + password);
            console.log("hash", hash);
            if (hash == result[0].password) {
                res.send({ "status": "success", "message": "login successfull" })
            } else {
                res.send({ "status": "failure", "message": "login failure" })
            }
        }
    });
})
app.post('/getProjectInfo', (req, res) => {
    var sortBy = req.body.sortBy;
    var skip = req.body.skip;
    //var sortBy = "ip.date_added"
    
    var sql = "SELECT iu.user_id,iu.username,ip.project_id,ip.project_title,ip.date_added,ip.cid,c.categorie_name " + " " +
        "FROM ilance_users iu" + " " +
        "INNER JOIN ilance_projects ip" + " " +
        "ON iu.user_id = ip.user_id" + " " +
        "LEFT JOIN categories c" + " " +
        "ON ip.cid = c.cid" + " " +
        "order by " + sortBy + " ASC LIMIT 2 OFFSET "+skip

    con.query(sql, function (err, result) {
        if (err) {
            res.send({ "status": "failure", "message": err })
        } else {
            if (result.length>0) {
                var ttable="";
                result.forEach(element => {
                   var trow= "<tr>"+""+
                    "<th>"+element.project_title+"</th>"+
                    "<th>"+element.username+"</th>"+
                    "<th>"+element.categorie_name+"</th>"+
                    "</tr>" 
                    ttable=ttable+trow;
                });
                res.send({ "status": "success", "message":ttable })
            } else {
                res.send({ "status": "failure", "message": "records not found" })
            }
        }
    });
})
/*************************************************************************
 * utils
 *************************************************************************/
function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

http.listen(3000, () => {
    console.log('listening on *:3000');
});
