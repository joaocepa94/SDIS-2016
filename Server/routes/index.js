'use strict';

var Joi = require('joi');
var request = require('request');

module.exports = function(server) {

    let key = 'AF03DCB793866DC48CB635FD445B3DDB';

    server.route({
        method: 'POST',
        path: '/api/GetPlayerSummaries',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    code: Joi.string().required()
                }
            },
            handler: function (req, rep) {

                var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' +
                key + '&steamids=' +req.payload.code;

                request.get(url, function(error, steamHttpResponse, steamHttpBody) {

                   return rep(steamHttpBody);

                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/friendList',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    code: Joi.string().required()
                }
            },
            handler: function (req, rep) {

                var url = ' http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=' +
                key + '&steamid=' +req.payload.code + '&relationship=friend';

                request.get(url, function(error, steamHttpResponse, steamHttpBody) {

                   return rep(steamHttpBody);

                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/getOwnedGames',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    code: Joi.string().required()
                }
            },
            handler: function (req, rep) {

                var url =  'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + key +
                '&steamid=' + req.payload.code + '&format=json';

                request.get(url, function(error, steamHttpResponse, steamHttpBody) {

                   return rep(steamHttpBody);

                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/getPlayerBans',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    code: Joi.string().required()
                }
            },
            handler: function (req, rep) {

                var url =  'http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=' +
                  key + '&steamids=' + req.payload.code;

                request.get(url, function(error, steamHttpResponse, steamHttpBody) {

                   return rep(steamHttpBody);

                });
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/api/GetRecentlyPlayedGames',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    code: Joi.string().required()
                }
            },
            handler: function (req, rep) {

                var url =  'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' +
                  key + '&steamid=' + req.payload.code + '&format=json';

                request.get(url, function(error, steamHttpResponse, steamHttpBody) {

                   return rep(steamHttpBody);

                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/playerAchievements',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    code: Joi.string().required()
                }
            },
            handler: function (req, rep) {

                var url = 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=440&key=' +
                    key + '&steamid=' + req.payload.code;

                request.get(url, function(error, steamHttpResponse, steamHttpBody) {

                   return rep(steamHttpBody);

                });
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/{name*}',
        handler: {
            directory: {
                path: '../Client/www'
        }
    }
    });
};
