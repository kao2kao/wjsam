var ALY = require('aliyun-sdk/index.js');
var request = require('request');
var fs = require('fs');
var moment = require('moment');

var oss = new ALY.OSS({
    "accessKeyId": "z6N7uvvpNVMXIYeg",
    "secretAccessKey": "bcV6saoc4r4gY6JT5qvmj2WI7NJuVp",
    endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
    // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
    apiVersion: '2013-10-15'
});

var ossUrl = ".oss-cn-hangzhou.aliyuncs.com/";

var OssUtil = function () {
};

OssUtil.prototype.putFile = function (imgSrc, fileName, callback) {
    var bucketName = "wjsamdist";
    /*
     oss.createBucket({
     Bucket: bucketName,
     ACL: 'public-read',
     CreateBucketConfiguration: {
     LocationConstraint: 'oss-cn-hangzhou-a'   // oss-cn-hangzhou-a 或者 oss-cn-qingdao-a
     }
     }, function (err, data) {
     if (err) {
     console.log('error:', err);
     return;
     }
     console.log('success:', data);
     });
     */

    var rq = request(imgSrc).pipe(fs.createWriteStream(fileName));
    rq.on('finish', function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.readFile(fileName, function (err, data) {
                oss.putObject({
                        Bucket: bucketName,
                        Key: fileName,                 // 注意, Key 的值不能以 / 开头, 否则会返回错误.
                        Body: data,
                        AccessControlAllowOrigin: '',
                        ContentType: 'image/pjpeg',
                        CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
                        ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
                        ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
                        ServerSideEncryption: 'AES256',
                        Expires: 4070883661      // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
                    },
                    function (err, data) {
                        if (err) {
                            console.log('error:', err);
                            return;
                        }
                        console.log('success:', data);
                        fs.unlink(fileName);
                    });
            });
        }
    });
    return "http://" + bucketName + ossUrl + fileName;
}

module.exports = new OssUtil();
