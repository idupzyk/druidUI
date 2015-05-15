/****************************************
 *
 * Author: Ian Dupzyk
 * Group: DSE Marketing
 *
 * Script: druidQuery.js
 *
 * Purpose:
 *   This is the script that processes communication 
 *   to druid from the UI
 *
 * Change Log:
 *   2015-05-12:
 *     initial script
 *
 ****************************************/

var express = require('express') ;
var http = require('http');
var bodyParser = require('body-parser') ;
var app = express() ;
var env = 'test' ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

app.post('/query', function(req, res) {
    //for (var v in req) {
    //    console.log(v+" "+req[v]) ;
    //}
    //console.log("req: "+ req + "  " + typeof req) ;
    //console.log("body: "+req.body) ;
    var sampleQuery = JSON.stringify(req.body) ;
    console.log("query: "+sampleQuery) ;

    var headers = {
        "Content-Type": "application/json",
        "Content-Length": sampleQuery.length
    }
    // prod: druid-broker.us-east-1.dynprod.netflix.net
    // test: druid-broker.us-east-1.dyntest.netflix.net
    var hostpath = "druid-broker.us-east-1.dynprod.netflix.net";
    if (env == "test") {
        hostpath = "druid-broker.us-east-1.dyntest.netflix.net";
    }
    var options = {
        host: hostpath,
        port: 7103,
        path: "/druid/v2/?pretty",
        method: "POST",
        headers: headers
    }
  
    var request = http.request(options, function(res2) {
        res2.setEncoding("utf-8");
    
        var responseString = "";
    
        res2.on("data", function(_data) {
            responseString += _data;
            //console.log(_data) ;
        })
    
        res2.on("end", function(){
            //console.log("end found!") ;
            var resultObject = JSON.parse(responseString);
            res.send(JSON.stringify(resultObject))
        })
  
    })
  
    request.write(sampleQuery);
    request.end();

})

module.exports = app;
