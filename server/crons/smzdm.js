var http = require("http"),
    url = require("url"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
    moment = require('moment'),
    ossUtil = require('../utils/ossUtil.js');
eventproxy = require('eventproxy');
Article = require('../models/Article.js');

var iconv = require('iconv-lite');
var ep = new eventproxy();

//入口页面
var url = "http://www.smzdm.com/json_more?timesort=",
    catchFirstUrl = 'http://www.wjsam.com/',
    deleteRepeat = {},	//去重哈希数组
    articlesArray = [],	//存放爬取网址
    catchDate = [],	//存放爬取数据
    pageNum = 1,	//要爬取文章的页数
    userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36',
    cookie = '__jsluid=73ce565979d2d871c5db67c1bfb74a9c; __jsl_clearance=1442988612.178|0|vT%2BsW7w06Rq%2FenjYxHjrkuHuEdw%3D';


/**
 * 查询buyurl
 * @param fin
 * @param product
 */
function saveArticle(article) {

    Article.findOne({article_id: article.article_id}, function (err, pro) {
        if (err) {
            console.log(err);
            return;
        }
        if (pro) {
            console.log("Article is exist");
            return;
        }

        var proxy = new eventproxy();
        var linkUrl = article.article_link;
        var mall = article.article_mall;
        var articlePic = article.article_pic;
        if (null == linkUrl || "" == linkUrl || linkUrl.indexOf("/tag") >= 0 || linkUrl.indexOf("test.smzdm.com") >= 0) {
            return;
        }
        if (null == articlePic || "" == articlePic) {
            return;
        }

        proxy.all('article_link', 'article_pic', function (article_link, article_pic) {
            article.article_link = article_link;
            article.article_pic = article_pic;
            var $ = cheerio.load("<p>" + article.article_content + "</p>");
            article.article_content = $("p").text();

            var instance = new Article(article);
            instance.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Article save OK:' + article.article_id);
                }
            });
            console.log("article_link  is:" + article_link);
        });


        //处理小图片信息
        var fileName = "s" + article.article_id + ".jpg";
        var article_pic = ossUtil.putFile(articlePic, fileName);
        proxy.emit('article_pic', article_pic);


        //处理直达链接tmall.com viglink.com smzdm.com/youhui/
        if (linkUrl.indexOf("tmall.com") >= 0 || linkUrl.indexOf("viglink.com") >= 0 || linkUrl.indexOf("taobao.com") >= 0 || linkUrl.indexOf("smzdm.com/youhui") >= 0) {
            var article_link = linkUrl;
            proxy.emit('article_link', article_link);
        }
        else {
            //处理购买链接
            superagent
                .get(linkUrl)
                .set('User-Agent', userAgent).set('Cookie', cookie)
                .end(function (err, pres) {
                    try {
                        // 常规的错误处理
                        if (err) {
                            console.log(err);
                        }
                        var evalString = pres.text.substring(pres.text.lastIndexOf("eval(function"), pres.text.lastIndexOf("</script>"));
                        evalString = evalString.replace(/^eval/, '');
                        var unpacked = eval(evalString).toString();
                        //http://union.click.jd.com/jdc?e=&p=AyIBZRprFDJWWA1FBCVbV0IUEEULWldTCQQAQB1AWQkFXRcCEARUBAJQXk83EHsvSkFlQil7RUkcVHwjfBpwaWtnExdXJQMiAlYTUiVyYm8sKzpnMg%3D%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBV0XAhAEVAQCUF5P
                        var unionUrl = unpacked.substring(unpacked.lastIndexOf("smzdmhref") + 11, unpacked.lastIndexOf("ga(") - 2);
                        if ("京东" == mall) {
                            superagent.get(unionUrl).end(function (err, pres) {
                                // 常规的错误处理
                                if (err) {
                                    console.log(err);
                                }
                                if (pres == null || typeof(pres.text) == "undefined") {
                                    console.info("midUr is error 1:" + midUrl + "use union url:" + unionUrl);
                                    proxy.emit('article_link', unionUrl);
                                    return;
                                }
                                var midUrl = pres.text.substring(pres.text.lastIndexOf("hrl='") + 5, pres.text.lastIndexOf("' ;(function ()"));
                                if (midUrl.indexOf("jd.com") < 0) {
                                    console.info("midUr is error 2:" + midUrl + "use union url:" + unionUrl);
                                    proxy.emit('article_link', unionUrl);
                                    return;
                                }
                                superagent.get(midUrl).end(function (err, pres) {
                                    article_link = midUrl;
                                    if (null != pres) {
                                        article_link = 'http://item.jd.com/' + pres.req.path.substring(pres.req.path.lastIndexOf("item/") + 5, pres.req.path.lastIndexOf("?"));
                                    } else {
                                        console.info("midUr is sssss:" + midUrl);
                                    }
                                    proxy.emit('article_link', article_link);
                                    return;
                                })
                            })
                        } else {
                            article_link = unionUrl
                            proxy.emit('article_link', article_link);
                            return;
                        }
                    } catch (e) {
                        console.info("linkUrl:" + linkUrl);
                        console.info(e);
                    }
                })
        }

    });
}


// 主start程序
function start() {
    console.log('start ');
    // 相当于一个计数器
    ep.after('ArticleHtml', pageNum, function (list) {
        console.log("start save:" + list.length);
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list[i].length; j++) {
                saveArticle(list[i][j]);
            }
        }
        console.log("end save:" + list.length * 20);
    })

    //抓取json
    function agentSMZDM(timeSort) {
        superagent
            .get(url + timeSort)
            .set('User-Agent', userAgent).set('Cookie', cookie)
            .end(function (err, pres) {
                // 常规的错误处理
                if (err) {
                    console.log(err);
                }
                var infoList = JSON.parse(pres.text);
                ep.emit('ArticleHtml', infoList);
                console.log("Page:" + pageNum + "ok" + '<br/>');
                pageNum--;
                if (pageNum < 1) {
                    console.log("Finish all!");
                    return;
                }
                agentSMZDM(infoList[infoList.length - 1].timesort);
            })
    }

    //开始时间
    var startTimeSort = moment() + "";
    agentSMZDM(startTimeSort);

}
exports.start = start;