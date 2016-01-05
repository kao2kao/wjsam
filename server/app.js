// ���������⣬ԭ�������ⶼ��װ��connect�У��������ע��������
var express = require('express');
//վ������
var settings = require("./models/common/settings");
var siteFunc = require("./models/common/siteFunc");
/*ģ������*/
var partials = require('express-partials');
//�ļ���������
var fs = require('fs');
//ʱ���ʽ��
var moment = require('moment');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var log4js = require('log4js');
//���ض�ʱ����
var task = require('./crons/task');
// ����·�ɿ���
var routes = require('./routes/index');

// ������Ŀʵ��
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
// ������־���������
//app.use(logger('dev'));
// �������ݽ�����
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ���徲̬�ļ�Ŀ¼
app.use(express.static(path.join(__dirname, 'dist')));
app.use(partials());
//����첽��λ�������
app.use(require('express-promise')());
// ����cookie������
app.use(cookieParser(settings.session_secret));

app.use(session({
    secret: settings.session_secret,
    store: new RedisStore({
        port: settings.redis_port,
        host: settings.redis_host,
        pass: settings.redis_psd,
        ttl: 1800 // ����ʱ��
    }),
    resave: true,
    saveUninitialized: true
}));


// ƥ��·����·��
app.use('/', routes);

// 404������
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


// ���ģ��app
module.exports = app;

