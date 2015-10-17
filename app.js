// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
var express = require('express');
// 创建项目实例
var app = express();

//站点配置
var settings = require("./models/common/settings");
var siteFunc = require("./models/common/siteFunc");
/*模板引擎*/
var partials = require('express-partials');

//文件操作对象
var fs = require('fs');
//时间格式化
var moment = require('moment');
//过滤用户
//var filter = require('./util/filter');


var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
//系统功能支持
var system = require('./routes/system');
//验证器
var validat = require('./routes/validat');
var log4js = require('log4js');
//log4js config
log4js.configure({
    appenders: [
        {type: 'console'}, {
            type: 'dateFile',
            filename: '/usr/local/webApps/logs/wjsam/access.log',
            maxLogSize: 1024,
            backups: 4,
            pattern: "-yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'normal'
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('normal');
app.use(log4js.connectLogger(logger, {level: 'auto', format: ':method :url'}));
exports.logger = function (name) {
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}

// 加载路由控制
var routes = require('./routes/index');
var users = require('./routes/users');
var movie = require('./routes/movie');
var spider = require('./later/spider');
var detail = require('./routes/detail');

//加载定时任务
require('./later/task');

// 定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
console.log('Server running at port:' + app.get('port'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 定义日志和输出级别
//app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
//解决异步层次混乱问题
app.use(require('express-promise')());
// 定义cookie解析器
app.use(cookieParser(settings.session_secret));

app.use(session({
    secret: settings.session_secret,
    store: new RedisStore({
        port: settings.redis_port,
        host: settings.redis_host,
        pass : settings.redis_psd,
        ttl: 1800 // 过期时间
    }),
    resave: true,
    saveUninitialized: true
}));


// 匹配路径和路由
app.use('/', routes);
app.use('/users', users);
app.use('/detail', detail);
app.get('/spider', spider.add);//增加;

/*
app.get('/movie', movie.movie);//增加
app.get('/movie/add', movie.movieAdd);//增加
app.post('/movie/add', movie.doMovieAdd);//提交
app.get('/movie/:name', movie.movieAdd);//编辑查询
app.get('/movie/json/:name', movie.movieJSON);//JSON数据
*/

app.use(function(req, res, next){
//    针对注册会员
    res.locals.logined = req.session.logined;
    res.locals.userInfo = req.session.user;
//    针对管理员
    res.locals.adminlogined = req.session.adminlogined;
    res.locals.adminUserInfo = req.session.adminUserInfo;
//    指定站点域名
    res.locals.myDomain = req.headers.host;

    next();
});


// 404错误处理
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log(err);
    res.render('web/public/do404', siteFunc.setDataForError(req, res, '找不到页面' ,err.message));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('web/public/do500', siteFunc.setDataForError(req, res, '出错啦！' ,err.message));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('web/public/do500', siteFunc.setDataForError(req, res, '出错啦！' , err.message));
});


// 输出模型app
module.exports = app;

