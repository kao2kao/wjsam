var express = require('express');
var router = express.Router();
var request = require('request');
var Article = require("../models/Article");
//���ݿ��������
var DbOpt = require("../models/DbOpt");

//ʱ���ʽ��
var moment = require('moment');
var url = require('url');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

//�����б��ѯ
router.get('/json_more.json', function (req, res, next) {
    var params = url.parse(req.url, true);
    var timesort = params.query.timesort;
    if (null == timesort || "" == timesort) {
        timesort = new Date().getTime() / 10;
        console.log("timesort start:" + timesort);
    }
    var q = {timesort: {$lt: timesort}}
    req.query.limit = 20;
    res.json(DbOpt.getDatasByParam(Article, req, res, q));
});

/**
 * ����
 */
router.get('/detail.json', function (req, res, next) {
    var params = url.parse(req.url, true);
    var id = params.query.id;
    Article.findOne({'_id': id}, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.json(result);
        }
    });
});

/**
 * ��������
 */
router.get('/url/:params', function (req, res, next) {
    var params = req.params.params;
    var currentId = params.split('.')[0];
    Article.findOne({'_id': currentId}, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            var mall = result.article_mall;
            var targetUrl = result.article_link;
            if ('����' == mall) {
                var apiUrl = getJDApiUrl(targetUrl);
                console.log(apiUrl);
                request({url: apiUrl}, function (error, response, body) {
                    if (!error) {
                        var obj = JSON.parse(body)
                        var resultString = obj["jingdong_service_promotion_getcode_responce"]["queryjs_result"];
                        var result = JSON.parse(resultString);
                        targetUrl = result["url"];

                    }
                });
            } else if ("����" == mall) {
                targetUrl = result.buyUrl.replace("';", '').replace("4410", '13055809').replace("4303", '0').replace("adBookId=4908", 'adBookId=0').replace("channel=24", 'channel=14');

            }
            res.redirect(targetUrl);
        }
    });
});


module.exports = router;