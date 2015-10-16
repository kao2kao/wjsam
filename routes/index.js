var express = require('express');
var router = express.Router();

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
    res.render('web/index', siteFunc.setDataForIndex(req, res, {'type': 'content'}, '首页'));

});

module.exports = router;