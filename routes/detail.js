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
var Product = require("../models/Product");

/* GET home page. */
router.get('/:url', function (req, res, next) {

    var url = req.params.url;
    var currentId = url.split('.')[0];
    Product.findOne({ '_id': currentId }, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            if (result) {
//                ���·�����
                /*result.clickNum = result.clickNum + 1;
                result.save(function(){
                    var cateParentId = result.sortPath.split(',')[1];
                    var cateQuery = {'sortPath': { $regex: new RegExp(cateParentId, 'i') }};
                    res.render('web/temp/' + result.contentTemp + '/detail', siteFunc.setDetailInfo(req, res, cateQuery, result));
                })*/
                res.render('sam/detail', siteFunc.setDetailInfo(req, res, result));
            } else {
                res.render('web/public/do404', { siteConfig: siteFunc.siteInfos("����ʧ��")});
            }
        }
    });


    //res.render('web/detail', siteFunc.setDataForIndex(req, res, {'type': 'content'}, '��Ʒ����ҳ'));

});

module.exports = router;