var express = require('express');
var router = express.Router();

var Product = require("../models/Product");
//数据库操作对象
var DbOpt = require("../models/DbOpt");
//站点配置
var settings = require("../models/common/settings");
var siteFunc = require("../models/common/siteFunc");
//短id
var shortid = require('shortid');
//时间格式化
var moment = require('moment');
var url = require('url');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('sam/index', siteFunc.setDataForIndex(req, res, {'type': 'content'}, '首页'));

});

//对象列表查询
router.get('/getProductList', function (req, res, next) {
    //var currentPage = req.params.currentPage;
    var params = url.parse(req.url, true);
    var keywords = params.query.searchKey;
    var keyPr = [];
    var callback = params.query.callback;
    if (keywords) {
        var reKey = new RegExp(keywords, 'i');
    }


    res.json(DbOpt.getPaginationResult(Product, req, res,{}));
    /*if (params.query &&params.query.callback) {
        var str=params.query.callback + '(' + JSON.stringify(list) + ')';//jsonp
        res.end(str);
    }else {
        res.end(JSON.stringify(list));//普通的json
    }*/
});

module.exports = router;