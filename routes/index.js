var express = require('express');
var router = express.Router();

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
    res.render('web/index', siteFunc.setDataForIndex(req, res, {'type': 'content'}, '��ҳ'));

});

module.exports = router;