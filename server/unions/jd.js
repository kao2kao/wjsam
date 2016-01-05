require("moment.js");

var channel = "PC",
    type = 7,
    unionId = "340892107",
    webId = "344975369",
    token = "cb596fb2-2032-4f11-96f5-cf423e79c0a0",
    appkey = "F4E5957B666A592AF051BDADD68960E1",
    appSecret = "28f55c86a0784e7f9abca3eb5519ecd5",
    v = "2.0",
    method = "jingdong.service.promotion.getcode",
    baseurl = "https://api.jd.com/routerjson?";


function getJDUrl(sourceUrl) {
    var sourceUrl = 'http://item.jd.com/' + sourceUrl;
    //应用参数，json格式
    buy_param_json = '{"channel":"' + channel + '","materialId":"' + sourceUrl + '","promotionType":' + type
        + ',"unionId":"' + unionId + '","webId":"' + webId + '"}';
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
    time = moment().format('YYYY-MM-DD HH:mm:ss');

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
exports.getJDUrl = getJDUrl;