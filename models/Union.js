var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var UnionSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    userName: String,
    params:String,
    from: String, //jd

    gmtCreated: {type: Date, default: Date.now},
    gmtModified: {type: Date, default: Date.now},
    isDeleted: Boolean
});
//指定数据库集合为Product表
var Union = mongoose.model("Union", UnionSchema);

module.exports = Union;