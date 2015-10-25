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
//缓存
var cache = require('../../util/cache');

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

    setConfirmPassWordEmailTemp : function(name,token){

        var html = '<p>您好：' + name + '</p>' +
            '<p>我们收到您在 <strong>' + settings.SITETITLE + '</strong> 的注册信息，请点击下面的链接来激活帐户：</p>' +
            '<a href="' + settings.SITEDOMAIN + '/users/reset_pass?key=' + token + '">重置密码链接</a>' +
            '<p>若您没有在 <strong>' + settings.SITETITLE + '</strong> 填写过注册信息，说明有人滥用了您的电子邮箱，请忽略或删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
            '<p> <strong>' + settings.SITETITLE + ' </strong> 谨上。</p>';

        return html;

    },

    setNoticeToAdminEmailTemp : function(obj){
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html ='';
        html += '主人您好，'+obj.uName+'于 '+msgDate +' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + settings.SITEDOMAIN + '/details/'+obj.contentId+'.html">'+obj.contentTitle+'</a> 中留言了';
        return html;
    },

    setNoticeToUserEmailTemp : function(obj){
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html ='';
        html += '主人您好，'+obj.uName+'于 '+msgDate +' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + settings.SITEDOMAIN + '/details/'+obj.contentId+'.html">'+obj.contentTitle+'</a> 中回复了您';
        return html;
    },

    /*getCategoryList: function () {
        return ContentCategory.find({'parentID': '0', 'state': '1'}, 'name defaultUrl').sort({'sortId': 1}).find();
    },*/

    getHotItemListData: function (q) {
        return Content.find(q, 'stitle').sort({'clickNum': -1}).skip(0).limit(10);
    },

    getNewItemListData : function(q){
        return Content.find(q, 'stitle').sort({'date': -1}).skip(0).limit(10);
    },

   /* getFriendLink: function () {
        return Ads.find({'category': 'friendlink'});
    },*/

    setDataForIndex: function (req, res, q, title) {
        //var requireField = 'title date commentNum discription sImg';
        var documentList = DbOpt.getPaginationResult(Product, req, res, {});
        return {
            siteConfig: siteFunc.siteInfos("首页"),
            //documentList: documentList.docs,
            //hotItemListData: siteFunc.getHotItemListData({}),
            //friendLinkData: siteFunc.getFriendLink(),
           // cateTypes: siteFunc.getCategoryList(),
            cateInfo: '',
            //pageInfo: documentList.pageInfo,
            pageType: 'index',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },


    setDetailInfo: function (req, res, product) {
        return {
            siteConfig: siteFunc.siteInfos(product.title, product.detail, product.tags),
            productInfo: product,
            pageType: 'detail',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },

   /* setDataForCate: function (req, res, dq, cq, cateInfo) {
        var requireField = 'title date commentNum discription sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, dq, requireField);
        var currentCateList = ContentCategory.find(cq).sort({'sortId': 1});
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: siteFunc.siteInfos(cateInfo.name, cateInfo.comments, cateInfo.keywords),
            documentList: documentList.docs,
            currentCateList: currentCateList,
            hotItemListData: siteFunc.getHotItemListData(dq),
            friendLinkData: siteFunc.getFriendLink(),
            tagsData: tagsData,
            cateInfo: cateInfo,
            cateTypes: siteFunc.getCategoryList(),
            pageInfo: documentList.pageInfo,
            pageType: 'cate',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },*/


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

    setDataForUser: function (req, res, title ,tokenId) {
        return {
            siteConfig: siteFunc.siteInfos(title),
            //cateTypes: siteFunc.getCategoryList(),
            userInfo: req.session.user,
            tokenId : tokenId,
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

   /* setDataForSiteMap: function (req, res) {

        var root_path = 'http://www.html-js.cn/';
        var priority = 0.8;
        var freq = 'weekly';
        var lastMod = moment().format('YYYY-MM-DD');
        var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        xml += '<url>';
        xml += '<loc>' + root_path + '</loc>';
        xml += '<changefreq>daily</changefreq>';
        xml += '<lastmod>' + lastMod + '</lastmod>';
        xml += '<priority>' + 0.8 + '</priority>';
        xml += '</url>';
        cache.get('sitemap', function(siteMapData){
            if(siteMapData){ // 缓存已建立
                res.end(siteMapData);
            }else{
                ContentCategory.find({}, 'defaultUrl', function (err, cates) {
                    if (err) {
                        console.log(err);
                    } else {
                        cates.forEach(function (cate) {
                            xml += '<url>';
                            xml += '<loc>' + root_path + cate.defaultUrl + '___' + cate._id + '</loc>';
                            xml += '<changefreq>weekly</changefreq>';
                            xml += '<lastmod>' + lastMod + '</lastmod>';
                            xml += '<priority>0.5</priority>';
                            xml += '</url>';
                        });

                        Content.find({}, 'title', function (err, contentLists) {
                            if (err) {
                                console.log(err);
                            } else {
                                contentLists.forEach(function (post) {
                                    xml += '<url>';
                                    xml += '<loc>' + root_path + 'details/' + post._id + '.html</loc>';
                                    xml += '<changefreq>Monthly</changefreq>';
                                    xml += '<lastmod>' + lastMod + '</lastmod>';
                                    xml += '<priority>0.5</priority>';
                                    xml += '</url>';
                                });
                                xml += '</urlset>';
                                // 缓存一天
                                cache.set('sitemap', xml, 1000 * 3600 * 2);
                                res.end(xml);
                            }
                        })
                    }

                })
            }
        })

    }*/

};
module.exports = siteFunc;