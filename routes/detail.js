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
//                更新访问量
                /*result.clickNum = result.clickNum + 1;
                result.save(function(){
                    var cateParentId = result.sortPath.split(',')[1];
                    var cateQuery = {'sortPath': { $regex: new RegExp(cateParentId, 'i') }};
                    res.render('web/temp/' + result.contentTemp + '/detail', siteFunc.setDetailInfo(req, res, cateQuery, result));
                })*/
                res.render('sam/detail', siteFunc.setDetailInfo(req, res, result));
            } else {
                res.render('web/public/do404', { siteConfig: siteFunc.siteInfos("操作失败")});
            }
        }
    });


    //res.render('web/detail', siteFunc.setDataForIndex(req, res, {'type': 'content'}, '商品详情页'));

});

module.exports = router;