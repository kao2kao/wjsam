var httpUtil = require('../util/httpUtil.js');
var ossUtil = require('../util/ossUtil.js');
var cheerio = require('cheerio');
var logger = require('../app').logger('spider');
var Product = require('../models/Product.js');

//数据库操作对象
var DbOpt = require("../models/DbOpt");

var tarUrl = "http://www.smzdm.com";
var tarDomain = "www.smzdm.com";
var escaper = require("true-html-escape");

//TODO Discovery Channel

//简单的爬虫
exports.add = function (req, res) {
    httpUtil.get(tarUrl, function (content, status) {

        var $ = cheerio.load(content);

        $('.list').each(function (i, element) {
            var product = {};
            var articleid = element.attribs["articleid"];
            var innerHtml = escaper.unescape($(this).html());
            if (articleid == null) {
                console.log("articleid is null");
                return;
            } else {
                query = Product.findOne({articleId: articleid}, function (err, pro) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (pro) {
                        console.log("articleid is exist");
                        return;
                    }
                    product["articleId"] = articleid;
                    parseHtml(innerHtml, product);
                    var instance = new Product(product);
                    instance.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('saved OK!');
                        }
                    });
                });
            }
        });
    });
};
/**
 * 解析html list
 * @param element
 * @param product
 */
function parseHtml(innerHtml, product) {
    try {
        var $ = cheerio.load(innerHtml);
        var title = $('div[class=listTitle]').children('h4').children('a')[0]['children'][0].data
        product["title"] = title;

        var price = $('div[class=listTitle]').children('h4').children('a').children('span').text();
        product["price"] = price;
        var publishData = $('div[class=listRight]').children('div').children('span')[0]['children'][0].data;
        var tempTags = $('div[class=listRight]').children('div[class=lrTop]').children('span').last().children();
        var tags = new Array();
        for (var i = 0; i < tempTags.length; i++) {
            var tag = tempTags[i];
            if (tag["type"] == 'tag') {
                tags.push(tag['children'][0].data);
            }
        }
        product["tags"] = tags;

        //没有购买链接的return
        if ($('div[class=listRight]').children('div[class=lrBot]').children('div[class=botPart]').children('div[class=buy]').length == 0) {
            console.info('There is no buy url,pass!');
            return;
        }

        var buyUrl = $('div[class=listRight]').children('div[class=lrBot]').children('div[class=botPart]').children('div[class=buy]')[0]['children'][1].attribs['href'];
        parseBuyUrl(buyUrl, product);

        //来源，jd tmall
        var source = $('div[class=listRight]').children('div[class=lrBot]').children('div[class=botPart]').children('a[class=mall]').text();
        product["from"] = source;


        //缩略图
        var imgSrc = $('a[class=picLeft]').children('img')[0].attribs['src'];
        var fileName = "s" + product["articleId"] + ".jpg";
        product["thumbSrc"] = ossUtil.putFile(imgSrc, fileName);

        var detailUrl = $('a[class=picLeft]')[0]['attribs']['href'];
        parseDetail(detailUrl, product);
    } catch (e) {
        console.error(innerHtml);
        console.error(e);
    }
}

/**
 * 查询buyurl
 * @param fin
 * @param product
 */
function parseBuyUrl(directUrl, product) {
    if (directUrl.indexOf(tarDomain) > -1) {
        httpUtil.get(directUrl, function (directContent, directStatus) {
            try {
                var evalString = directContent.substring(directContent.lastIndexOf("eval(function"), directContent.lastIndexOf("</script>"));
                evalString = evalString.replace(/^eval/, '');
                var unpacked = eval(evalString).toString();
                var buyUrl = unpacked.substring(unpacked.lastIndexOf("smzdmhref") + 11, unpacked.lastIndexOf("ga(")-2);
                logger.info(buyUrl);
                product["buyUrl"] = buyUrl;

                var articleId = product["articleId"];
                var conditions = {articleId: articleId};
                var update = {$set: {buyUrl: buyUrl}};
                var options = {multi: true};
                Product.update(conditions, update, options, function (err) {
                    if (err) {
                        console.error("update buyurl error!" + buyUrl);
                    } else {
                        console.log("update buyurl success!" + buyUrl);
                    }
                })
            } catch (e) {
                console.error("directUrl:" + directUrl);
                console.error(e);
            }
        });
    } else {
        product["buyUrl"] = directUrl;
    }
}


/**
 * 查询buyurl
 * @param fin
 * @param product
 */
function parseDetail(detailUrl, product) {
    httpUtil.get(detailUrl, function (detailHtml, status) {
        try {
            var $ = cheerio.load(escaper.unescape(detailHtml));
            //var detailHtml = escaper.unescape(detailHtml);
            //详情信息要有优惠力度，商品介绍
            var detail = $('div[class=inner-block]').text();

            //大图
            var bigSrc = "";
            if ($('div[class=inner-block]').children('p').children('img').length > 0) {
                var imgSrc = $('div[class=inner-block]').children('p').children('img')[0].attribs['src'];
                var fileName = "b" + product["articleId"] + ".jpg";
                bigSrc = ossUtil.putFile(imgSrc, fileName);
            }
            product["detail"] = detail;
            var articleId = product["articleId"];
            var conditions = {articleId: articleId};
            var update = {$set: {detail: detail, bigSrc: bigSrc}};
            var options = {multi: true};
            Product.update(conditions, update, options, function (err) {
                if (err) {
                    console.error("update detail error!" + detailUrl);
                } else {
                    console.log("update detail success!" + detailUrl);
                }
            })
        } catch (e) {
            console.error("detail:" + detailUrl);
            console.error(e);
        }

    });
}
