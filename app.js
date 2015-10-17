// ���������⣬ԭ�������ⶼ��װ��connect�У��������ע��������
var express = require('express');
// ������Ŀʵ��
var app = express();

//վ������
var settings = require("./models/common/settings");
var siteFunc = require("./models/common/siteFunc");
/*ģ������*/
var partials = require('express-partials');

//�ļ���������
var fs = require('fs');
//ʱ���ʽ��
var moment = require('moment');
//�����û�
//var filter = require('./util/filter');


var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
//ϵͳ����֧��
var system = require('./routes/system');
//��֤��
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

// ����·�ɿ���
var routes = require('./routes/index');
var users = require('./routes/users');
var movie = require('./routes/movie');
var spider = require('./later/spider');
var detail = require('./routes/detail');

//���ض�ʱ����
require('./later/task');

// ����EJSģ�������ģ���ļ�λ�ã�Ҳ����ʹ��jade������ģ������
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
console.log('Server running at port:' + app.get('port'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// ������־���������
//app.use(logger('dev'));
// �������ݽ�����
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ���徲̬�ļ�Ŀ¼
app.use(express.static(path.join(__dirname, 'public')));
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
        pass : settings.redis_psd,
        ttl: 1800 // ����ʱ��
    }),
    resave: true,
    saveUninitialized: true
}));


// ƥ��·����·��
app.use('/', routes);
app.use('/users', users);
app.use('/detail', detail);
app.get('/spider', spider.add);//����;

/*
app.get('/movie', movie.movie);//����
app.get('/movie/add', movie.movieAdd);//����
app.post('/movie/add', movie.doMovieAdd);//�ύ
app.get('/movie/:name', movie.movieAdd);//�༭��ѯ
app.get('/movie/json/:name', movie.movieJSON);//JSON����
*/

app.use(function(req, res, next){
//    ���ע���Ա
    res.locals.logined = req.session.logined;
    res.locals.userInfo = req.session.user;
//    ��Թ���Ա
    res.locals.adminlogined = req.session.adminlogined;
    res.locals.adminUserInfo = req.session.adminUserInfo;
//    ָ��վ������
    res.locals.myDomain = req.headers.host;

    next();
});


// 404������
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log(err);
    res.render('web/public/do404', siteFunc.setDataForError(req, res, '�Ҳ���ҳ��' ,err.message));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('web/public/do500', siteFunc.setDataForError(req, res, '��������' ,err.message));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('web/public/do500', siteFunc.setDataForError(req, res, '��������' , err.message));
});


// ���ģ��app
module.exports = app;

