var http = require('http');
var request = require('request');

var HttpUtil = function () {
};

HttpUtil.prototype.get = function (url, callback) {
    var options = {
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36',
            'Cookie': '__jsluid=73ce565979d2d871c5db67c1bfb74a9c; __jsl_clearance=1442988612.178|0|vT%2BsW7w06Rq%2FenjYxHjrkuHuEdw%3D'
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body, response.statusCode);
        }
    });
}

module.exports = new HttpUtil();
