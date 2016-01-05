var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var ArticleSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    article_id: String,
    article_title: String,
    article_price: String,
    article_content: String,
    article_content_all: String,
    article_date: String,
    article_mall: String,
    article_comment: String,
    article_collection: String,
    article_worthy: String,
    article_unworthy: String,
    article_item_title_mode: String,
    article_is_sold_out: Boolean,
    article_is_timeout: Boolean,
    article_referrals: String,
    article_pic: String,
    // height=\"190px\" width=\"188px\" style=\"margin-top:0px\"
    article_pic_style: String,
    article_link: String,
    article_link_domain: String,
    link_nofollow: String,
    article_link_list: String,
    taobao_url: {
        is_taobao: Boolean,
        product_id: String,
        taobao_url: String
    },
    article_url: String,
    article_mall_url: String,
    //优惠
    article_channel: String,
    //http://www.smzdm.com/youhui/
    article_channel_url: String,
    article_channel_id: Number,
    is_out: Boolean,
    top_category: String,
    article_category: {
        ID: String,
        parent_ids: String,
        title: String,
        parent_id: String,
        //hufujinghua
        url_nicktitle: String,
        category_url: String
    },
    article_tese_tags: String,
    article_author: String,
    is_black_five: Number,
    timesort: String,
    gmt_created: {type: Date, default: Date.now},
    gmt_modified: {type: Date, default: Date.now},
    is_deleted: Boolean
});
//指定数据库集合为Product表
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;