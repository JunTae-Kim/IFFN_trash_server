var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '172.20.10.13',
    port: '3306',
    user: 'temp',
    password: 'nk304704',
    database: 'diffuse'
});

connection.connect(function (err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

router.post('/', function(req, res, next) {
    var idx = req.body.idx;
    var query1 = connection.query('select * from user_info where idx=?', idx, function(err, rows1) {
        if(err) {
            console.error(err);
            throw err;
        }
        else if(rows1.length==0) {
            res.json({ "result": 1 });
        }
        else {
            var query = connection.query('select * from common', function (err2, rows2) {
                if(err2) {
                    console.error(err2);
                    throw err2;
                }
                else {
                    res.json(rows2);
                }
            });
        }
    });
});

module.exports = router;
