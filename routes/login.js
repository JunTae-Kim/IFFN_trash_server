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

router.post('/user', function (req, res, next) {
    var idx = req.body.idx;
    var query = connection.query("select * from user_info where idx=?", idx, function (err, rows) {
        if(err) {
            console.error(err);
            throw err;
        }
        else if(rows.length==0) {
            res.json({ "result": 1 });
        }
        else {
            var temp = {
                'idx': rows[0].idx,
                'id': rows[0].id,
                'name': rows[0].name,
                'address': rows[0].address,
                'phone_number': rows[0].phone_number,
                'age': rows[0].age,
                'email': rows[0].email,
                'sex': rows[0].sex,
                "result": 0
            }
            res.json(temp);
        }
    });
});

router.post('/', function (req, res, next) {
    var id = req.body.id;
    var password = req.body.password;
    var query = connection.query("select * from user_info where id=? and password=?", [id, password], function (err, rows) {
        if (err) {
            console.error(err);
            throw err;
        }
        else if (rows.length == 0) {
            console.log(req.headers.host + ' failed to login');
            res.json({ "result": 1 });
        }
        else {
            var to_send = {
                "idx":rows[0].idx,
                "result": 0
            }
            console.log(req.headers.host + ' successed to login');
            res.json(to_send);
        }
    });
});

router.post('/create', function (req, res, next) {
    var test = {
        'id': req.body.id,
        'name': req.body.name,
        'password': req.body.password,
        'address': req.body.address,
        'phone_number': req.body.phone_number,
        'age': req.body.age,
        'email': req.body.email,
        'sex': req.body.sex
    };
    var query3 = connection.query("select * from user_info where id=?", test.id, function (err, rows3) {
        if(err) {
            console.error(err);
            throw err;
        }
        else if(rows3.length==0) {
            var query2 = connection.query("insert into user_info(id, name, password, address, sex, phone_number, email, age) values(?, ?, ?, ?, ?, ?, ?, ?)", [test.id, test.name, test.password, test.address, test.sex, test.phone_number, test.email, test.age], function (err2, rows2) {
                if (err2) {
                    console.error(err2);
                    throw err2;
                }
                else {
                    console.log('inserted into user_info table');
                    var query4 = connection.query("select * from user_info where id=? and phone_number=?", [test.id, test.phone_number], function (err3, rows4) {
                        if(err3) {
                            console.error(err3);
                            throw err3;
                        }
                        else {
                            var to_send = {
                                'idx':rows4[0].idx,
                                "result": 0
                            }
                            res.json(to_send);
                        }
                    });
                }
            });
        }
        else {
            res.json({ "result": 1 });
        }
    });
});

router.get('/create/:id', function(req, res, next) {
    var id = req.params.id;
    var query = connection.query("select * from user_info where id=?", id, function(err, rows) {
        if(err) {
            console.error(err);
            throw err;
        }
        else if(rows.length==0) {
           res.json({ "result": 0 });
        }
        else {
           res.json({ "result": 1 });
        }
    });
});

module.exports = router;