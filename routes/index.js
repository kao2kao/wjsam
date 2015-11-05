var express = require('express');
var router = express.Router();

var Product = require("../models/Product");
//���ݿ��������
var DbOpt = require("../models/DbOpt");
//վ������
var settings = require("../models/common/settings");
var siteFunc = require("../models/common/siteFunc");
//��id
var shortid = require('shortid');
//ʱ���ʽ��
var moment = require('moment');
var url = require('url');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('sam/index', siteFunc.setDataForIndex(req, res, {'type': 'content'}, '��ҳ'));

});

//�����б��ѯ
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
        res.end(JSON.stringify(list));//��ͨ��json
    }*/
});

module.exports = router;