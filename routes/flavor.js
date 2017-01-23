var express = require('express');
var router = express.Router();
var app = express();
var http = require('http');
var mysql = require('mysql');
var options = {
    hostname: '172.20.10.3',
    port: '8080',
    path: '/',
    method: 'POST'
};

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

router.post('/mix', function(req, res) {
    var query=connection.query("select * from user_info where idx=?", req.body.idx, function(err, rows) {
        if(err) {
            console.error(err);
            throw err;
        }
        else if(rows.length==0) {
            res.json({ "result": 1 });
        }
        else {
            var req2 = http.request(options, function(response) {
                var responsedata = ' ';
                response.on('data', function(chunk) {
                    responsedata += chunk;
                });
                response.on('end', function() {
                    var test = JSON.parse(responsedata);
                    var test2 = {
                        "idx": test.idx,
                        "result": 0,
                        "flavor_1": test.flavor_1,
                        "flavor_2": test.flavor_2,
                        "flavor_3": test.flavor_3,
                        "flavor_4": test.flavor_4
                    }
                    res.json(test2);
                });
            });
            req2.write('{"idx": ' + req.body.idx + ',' +
                ' "flavor_1": ' + req.body.flavor_1 + ',' +
                ' "flavor_2": ' + req.body.flavor_2 + ',' +
                ' "flavor_3": ' + req.body.flavor_3 + ',' +
                ' "flavor_4": ' + req.body.flavor_4 + '}');
            req2.end();
        }
    });
});

module.exports = router;