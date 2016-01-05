var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var ProductSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    productName: String,
    sourceName: String,
    articleId: String,
    buyUrl: String, //购买链接
    thumbSrc : String, //缩略图地址
    bigSrc: String, //大图地址
    detail : String, //详情
    from: String, //jd
    title: String,
    price: String,
    referee : String, //发布者
    category: [String],//类别
    tags: [String],
    worth : String, //值
    notWorth : String, //不值
    gmtCreated: {type: Date, default: Date.now},
    gmtModified: {type: Date, default: Date.now},
    isDeleted: Boolean
});
//指定数据库集合为Product表
var Product = mongoose.model("Product", ProductSchema);

module.exports = Product;