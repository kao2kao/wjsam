var Movie = require('./../models/Movie.js');

//代码片段
exports.movie = function (req, res) {
    var search = {};
    var page = {limit: 5, num: 1};

//查看哪页
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }

    var model = {
        search: search,
        columns: 'name alias director publish images.coverSmall create_date type deploy',
        page: page
    };

    Movie.findPagination(model, function (err, pageCount, list) {
        page['pageCount'] = pageCount;
        page['size'] = list.length;
        page['numberOf'] = pageCount > 5 ? 5 : pageCount;

        return res.render('movie', {
            title: '电影|管理|moive.me',
            label: '编辑电影:' + req.params.name,
            movieList: list,
            page: page
        });
    });
}

exports.movieAdd = function (req, res) {
    if (req.params.name) {//update
        return res.render('movie', {
            title: req.params.name + '|电影|管理|moive.me',
            label: '编辑电影:' + req.params.name,
            movie: req.params.name
        });
    } else {
        return res.render('movie', {
            title: '新增加|电影|管理|moive.me',
            label: '新增加电影',
            movie: false
        });
    }
};

exports.doMovieAdd = function (req, res) {
    console.log(req.body.content);
    var json = req.body.content;
    //var json = JSON.parse(req.body.content);

    if (json._id) {//update

    } else {//insert
        Movie.save(json, function (err) {
            if (err) {
                res.send({'success': false, 'err': err});
            } else {
                res.send({'success': true});
            }
        });
    }
};

exports.movieJSON = function (req, res) {
    Movie.findByName(req.params.name, function (err, obj) {
        res.send(obj);
    });
}

