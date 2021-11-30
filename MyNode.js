var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var multer = require("multer");
var path = require("path");
var app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//This configuration is based on the public IP of the AWS instance. Change this configuration as needed to link the application to your own database.
var con = mysql.createConnection({
    host: "3.141.11.147",
    user: "user",
    password: "Password2!",
    database: "finalprojectDB"
});


app.listen(8080, function () {
    console.log("app listening on port 8080");
});

app.get("", function (req, res) {
    fs.readFile('./Store.html', function (err, html) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html)
        res.end();
    });
});


app.get("/Search/", function (req, res) {
    con.connect(function(err) {
        if (err) throw err;
        var sql = mysql.format('SELECT COUNT(stock.itemid), stores.name, inventory.name FROM stock LEFT JOIN inventory ON (stock.itemid = inventory.itemid) LEFT JOIN stores ON (stock.storeid = stores.storeid) WHERE inventory.name LIKE "%"?"%" GROUP BY stores.name, inventory.name', [req.query.Search]);
        con.query(sql, function (err, result, fields) {
          if (err) throw err;
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(JSON.stringify(result));
          res.end();
        });
      });
});
//Product lookup search bar

app.get("/orderSearch/", function (req, res) {
    con.connect(function(err) {
        if (err) throw err;
        var sql = mysql.format('SELECT orders.orderid, customers.name, inventory.name, quantity, orderdate FROM orders INNER JOIN customers ON orders.customerid = customers.customerid INNER JOIN inventory ON orders.itemid = inventory.itemid WHERE orders.orderid =? GROUP BY orders.orderid, orders.itemid, orders.quantity', [req.query.orderSearch]);
        con.query(sql, function (err, result, fields) {
          if (err) throw err;
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(JSON.stringify(result));
          res.end();
        });
      });
});
//Order lookup search bar


app.post("/addOrder/", function (req, res) {
    con.connect(function(err) {

      });


});
