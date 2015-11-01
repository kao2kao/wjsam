var express = require('express');
var router = express.Router();
var request = require('request');

var DbOpt = require("../models/DbOpt");
var settings = require("../models/common/settings");
var siteFunc = require("../models/common/siteFunc");
var Product = require("../models/Product");
var moment = require('moment');

/* GET home page. */
router.get('/:url', function (req, res, next) {
    var url = req.params.url;
    var currentId = url.split('.')[0];
    Product.findOne({'_id': currentId}, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            if (result != null && result.buyUrl != '') {
                var options = {
                    url: result.buyUrl.replace("';", ''),
                };
                if (result.from == '京东') {
                    request(options, function (error, response, body) {
                        if (!error) {
                            unionUrl = body.substring(body.lastIndexOf("hrl='") + 5, body.lastIndexOf("' ;(function ()"));
                            console.log(unionUrl);
                            request({url: unionUrl}, function (error, response, body) {
                                if (!error) {
                                    // var reqPath = ‌‌response.req.path;
                                    htmlPath = response.req.path.substring(response.req.path.lastIndexOf("item/") + 5, response.req.path.lastIndexOf("?"));

                                    /*                   var apiUrl = "http://api.jd.com/routerjson?v=2.0&method=jingdong.service.promotion.getcode&app_key=F4E5957B666A592AF051BDADD68960E1&access_token=cb596fb2-2032-4f11-96f5-cf423e79c0a0&360buy_param_json={\"promotionType\":\"7\",\"materialId\":\"http://item.jd.com/" +
                                     htmlPath + "\",\"unionId\":\"340892107\",\"subUnionId\":\"\",\"siteSize\":\"\",\"siteId\":\"\",\"channel\":\"PC\",\"webId\":\"344975369\",\"extendId\":\"\",\"ext1\":\"\"}&timestamp=" + moment().format('YYYY-MM-DD HH:mm:ss') + "&sign=803BC3B7A2A6DE513DF86A0DAAA63FFF";
                                     */
                                    apiUrl = getJDApiUrl(htmlPath);
                                    console.log(apiUrl);
                                    request({url: apiUrl}, function (error, response, body) {
                                        if (!error) {
                                            console.log(body);
                                            res.redirect(result.buyUrl.replace("';", ''));
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    res.redirect(result.buyUrl.replace("';", ''));
                }

            }
        }
    });
});


function getJDApiUrl(sourceurl) {
    sourceurl = 'http://item.jd.com/' + sourceurl;
    channel = "PC";
    type = 7;
    unionId = "340892107";
    webId = "344975369";
    token = "cb596fb2-2032-4f11-96f5-cf423e79c0a0";
    appkey = "F4E5957B666A592AF051BDADD68960E1";
    appSecret = "28f55c86a0784e7f9abca3eb5519ecd5";
    v = "2.0";
    time = moment().format('YYYY-MM-DD HH:mm:ss')
    method = "jingdong.service.promotion.getcode";

    baseurl = "https://api.jd.com/routerjson?";

//应用参数，json格式
    buy_param_json = '{"channel":"' + channel + '","materialId":"' + sourceurl + '","promotionType":' + type + ',"unionId":"' + unionId + '","webId":"' + webId + '"}';

//系统参数
    fields = {
        "360buy_param_json": buy_param_json,
        "access_token": token,
        "app_key": appkey,
        "method": method,
        "timestamp": time,
        "v": v
    };

    fields_string = "";

//用来计算md5，以appSecret开头
    tempString = appSecret;

    for (var prop in fields) {
        tempString += prop + fields[prop];
        //作为url参数的字符串
        fields_string += prop + "=" + fields[prop] + "&";

    }

//最后再拼上appSecret
    tempString += appSecret;

//计算md5，然后转为大写，sign参数作为url中的最后一个参数
    var crypto = require("crypto");
    sign = crypto.createHash("md5").update(tempString).digest("hex").toUpperCase();


//加到最后
    fields_string += ("sign=" + sign);

//最终请求的url
    link = baseurl + fields_string;
    return link;
}
module.exports = router;