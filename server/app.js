// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
var express = require('express');
//站点配置
var settings = require("./models/common/settings");
var siteFunc = require("./models/common/siteFunc");
/*模板引擎*/
var partials = require('express-partials');
//文件操作对象
var fs = require('fs');
//时间格式化
var moment = require('moment');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var log4js = require('log4js');
//加载定时任务
var task = require('./crons/task');
// 加载路由控制
var routes = require('./routes/index');

// 创建项目实例
var app = express();

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

app.set('views', __dirname + '\\dist')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'dist', 'img/favicon.ico')));
// 定义日志和输出级别
//app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));
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
        pass: settings.redis_psd,
        ttl: 1800 // 过期时间
    }),
    resave: true,
    saveUninitialized: true
}));


// 匹配路径和路由
app.use('/', routes);

// 404错误处理
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log(err);
    res.render('tpl/page_404.html');
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('tpl/page_404.html');
});


// 输出模型app
module.exports = app;

