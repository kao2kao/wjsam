var express = require('express');
var router = express.Router();

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
    if (null == timesort||""==timesort) {
        timesort = new Date().getTime()/10;
        console.log("timesort start:" + timesort);
    }
    var q = {timesort: {$lt: timesort}}
    req.query.limit = 20;
    res.json(DbOpt.getDatasByParam(Article, req, res, q));
});

module.exports = router;