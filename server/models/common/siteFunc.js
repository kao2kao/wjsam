/**
 * Created by Administrator on 2015/09/28.
 */
// 文档对象
var Product = require("../Product");

var settings = require("./settings");
//数据库操作对象
var DbOpt = require("../DbOpt");
//时间格式化
var moment = require('moment');

function isLogined(req) {
    return false;
    //return req.session.logined;
}

var siteFunc = {
    siteInfos: function (title, cmsDescription, keyWords) {
        var discrip;
        var key;

        if (cmsDescription) {
            discrip = cmsDescription;
        } else {
            discrip = settings.CMSDISCRIPTION;
        }

        if (keyWords) {
            key = keyWords + ',' + settings.SITEBASICKEYWORDS;
        } else {
            key = settings.SITEKEYWORDS;
        }

        return {
            title: title + " | " + settings.SITETITLE,
            cmsDescription: discrip,
            keywords: key,
            siteIcp: settings.SITEICP
        }
    },

    setDataForIndex: function (req, res, q, title) {
        var documentList = DbOpt.getPaginationResult(Product, req, res, {});
        return {
            siteConfig: siteFunc.siteInfos("首页"),
            //documentList: documentList.docs,
            cateInfo: '',
            pageType: 'index',
            logined: isLogined(req),
            layout: 'sam/main'
        }
    },
    setDetailInfo: function (req, res, product) {
        return {
            siteConfig: siteFunc.siteInfos(product.title, product.detail, product.tags),
            productInfo: product,
            pageType: 'detail',
            logined: isLogined(req),
            layout: 'sam/main'
        }
    },


    setDataForSearch: function (req, res, q, searchKey) {
        req.query.searchKey = searchKey;
        var requireField = 'title date commentNum discription sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, q, requireField);
        return {
            siteConfig: siteFunc.siteInfos("文档搜索"),
            documentList: documentList.docs,
            //cateTypes: siteFunc.getCategoryList(),
            cateInfo: '',
            pageInfo: documentList.pageInfo,
            pageType: 'search',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },

    setDataForError: function (req, res, title, errInfo) {
        return {
            siteConfig: siteFunc.siteInfos(title),
           // cateTypes: siteFunc.getCategoryList(),
            errInfo: errInfo,
            pageType: 'error',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },


    setDataForInfo : function(infoType,infoContent){

        return {
            siteConfig: siteFunc.siteInfos('操作提示'),
           // cateTypes: siteFunc.getCategoryList(),
            infoType : infoType,
            infoContent : infoContent,
            layout: 'web/public/defaultTemp'
        }

    }


};
module.exports = siteFunc;