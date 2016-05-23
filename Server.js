
var express = require('express');
var app = express();
var request = require('request');

var url = 'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/' +
    'v2/?key=AF03DCB793866DC48CB635FD445B3DDB&appid=8930';

request.get(url, function(error, steamHttpResponse, steamHttpBody) {
    console.log(steamHttpBody);
});

app.get('/steam/civ5achievements', function(httpRequest, httpResponse) {
    var url = 'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/' +
        'v2/?key=AF03DCB793866DC48CB635FD445B3DDB&appid=8930';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {

        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);

    });
});

app.get('/steam/game/:appid/achievements', function(httpRequest, httpResponse) {
    var url = 'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/' +
        'v2/?key=AF03DCB793866DC48CB635FD445B3DDB&appid=' +
        httpRequest.params.appid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

app.use('/', express.static('public'));

var bodyParser = require('body-parser');

app.use(bodyParser.text());

var port = 4000;
var server = app.listen(port);
console.log('Listening on port ' + port);
