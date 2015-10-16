/**
 * Created by Administrator on 2015/09/28.
 */

var url = require('url');
//������
var crypto = require("crypto");
var mongoose = require('mongoose');
//վ������
var settings = require("../models/common/settings");

var dbURL = 'mongodb://115.29.44.230:27017/admin';
var dbOptions = {'user':'kaokao','pass':'kao123456kao'};
var db = mongoose.connect(dbURL,dbOptions);

var DbOpt = {
    del: function (obj, req, res, logMsg) {
        var params = url.parse(req.url, true);
        obj.remove({_id: params.query.uid}, function (err, result) {
            if (err) {
                res.end(err);
            } else {
                console.log(logMsg + " success!");
                res.end("success");
            }
        })
    },
    findAll: function (obj, req, res, logMsg) {//����ָ���������м�¼
        obj.find({}, function (err, result) {
            if (err) {

            } else {
                console.log(logMsg + " success!");
                return res.json(result);
            }
        })
    },
    findOne: function (obj, req, res, logMsg, key) { //����ID���ҵ�����¼
        var params = url.parse(req.url, true);
        var currentId = (params.query.uid).split('.')[0];
        obj.findOne({_id: currentId}, function (err, result) {
            if (err) {

            } else {
                console.log(logMsg + " success!");
                return res.json(result);
            }
        })
    },
    updateOneByID: function (obj, req, res, logMsg) {
        var params = url.parse(req.url, true);
        var conditions = {_id: params.query.uid};
        req.body.updateDate = new Date();
        var update = {$set: req.body};
        obj.update(conditions, update, function (err, result) {
            if (err) {

            } else {
                console.log(logMsg + " success!");
                res.end("success");
            }
        })
    },
    addOne: function (obj, req, res, logMsg) {
        var newObj = new obj(req.body);
        newObj.save();
        console.log(logMsg + " success!");
        res.end("success");
    },

    pagination: function (obj, req, res, conditions) {

        var params = url.parse(req.url, true);
        var startNum = (params.query.currentPage - 1) * params.query.limit + 1;
        var currentPage = Number(params.query.currentPage);
        var limit = Number(params.query.limit);
        var pageInfo;

//    ����������ѯ��¼(������������ݣ���������ѯ)
        var query;
        if (conditions && conditions.length > 1) {
            query = obj.find().or(conditions);
        }
        else if (conditions) {
            query = obj.find(conditions);
        }
        else {
            query = obj.find({});
        }

        query.sort({'date': -1});
        query.exec(function (err, docs) {
            if (err) {
                console.log(err)

            } else {
                pageInfo = {
                    "totalItems": docs.length,
                    "currentPage": currentPage,
                    "limit": limit,
                    "startNum": Number(startNum)
                };

                return res.json({
                    docs: docs.slice(startNum - 1, startNum + limit - 1),
                    pageInfo: pageInfo
                });
            }
        })
    },

    getPaginationResult: function (obj, req, res, q, filed) {// ͨ�ò�ѯ������ҳ��ע��������ݸ�ʽ,filedΪָ���ֶ�
        var searchKey = req.query.searchKey;
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.limit);
        if (!page) page = 1;
        if (!limit) limit = 15;
        var order = req.query.order;
        var sq = {}, Str, A = 'problemID', B = 'asc';
        if (order) {    //�Ƿ�����������
            Str = order.split('_');
            A = Str[0];
            B = Str[1];
            sq[A] = B;    //�����������Ӳ�ѯ��������������ΪA�Ǳ���
        } else {
            sq.date = -1;    //Ĭ�������ѯ����
        }

        var startNum = (page - 1) * limit;
        var resultList;
        var resultNum;
        if (q && q.length > 1) { // ������ֻҪ����һ������
            resultList = obj.find().or(q, filed).sort(sq).skip(startNum).limit(limit);
            resultNum = obj.find().or(q, filed).count();
        } else {
            resultList = obj.find(q).sort(sq).skip(startNum).limit(limit);
            resultNum = obj.find(q).count();
        }
        //        ��ҳ����
        var pageInfo = {
            "totalItems": resultNum,
            "currentPage": page,
            "limit": limit,
            "startNum": startNum + 1,
            "searchKey": searchKey
        };
        var datasInfo = {
            docs: resultList,
            pageInfo: pageInfo
        };
        return datasInfo;
    },

    getDatasByParam: function (obj, req, res, q) {// ͨ�ò�ѯlist������ҳ��ע��������ݸ�ʽ,ͨ��express-promiseȥ���˻ص���ʽ��������
//        Ĭ�ϲ�ѯ���м�¼��������˳������Ͳ�ѯ���ּ�¼
        var order = req.query.order;
        var limit = parseInt(req.query.limit);
        var sq = {}, Str, A = 'problemID', B = 'asc';
        if (order) {    //�Ƿ�����������
            Str = order.split('_');
            A = Str[0];
            B = Str[1];
            sq[A] = B;    //�����������Ӳ�ѯ��������������ΪA�Ǳ���
        } else {
            sq.date = -1;    //Ĭ�������ѯ����
        }
        if (!limit) {
            return obj.find(q).sort(sq);
        } else {
            return obj.find(q).sort(sq).skip(0).limit(limit);
        }


    },

    getKeyArrByTokenId: function (tokenId) {
        var newLink = DbOpt.decrypt(tokenId, settings.encrypt_key);
        var keyArr = newLink.split('$');
        return keyArr;
    },

    getCount: function (obj, req, res, conditions) { // ��ѯָ�����������
        obj.count(conditions, function (err, count) {
            if (err) {
                console.log(err);
            } else {
                return res.json({
                    count: count
                });
            }

        });
    },
    encrypt: function (data, key) { // �������
        var cipher = crypto.createCipher("bf", key);
        var newPsd = "";
        newPsd += cipher.update(data, "utf8", "hex");
        newPsd += cipher.final("hex");
        return newPsd;
    },
    decrypt: function (data, key) { //�������
        var decipher = crypto.createDecipher("bf", key);
        var oldPsd = "";
        oldPsd += decipher.update(data, "hex", "utf8");
        oldPsd += decipher.final("utf8");
        return oldPsd;
    }
};


module.exports = DbOpt;