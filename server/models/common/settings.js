/**
 * Created by dora on 2015/4/8.
 * 创建数据库连接
 * 该模块只会被加载一次
 */

module.exports = {

    // debug 为 true 时，用于本地调试
    debug: false,
    session_secret: 'doracms_secret', // 务必修改
    auth_cookie_name: 'doracms',
    encrypt_key: 'dora',
//    数据库配置

    DBURL: 'mongodb://115.29.44.230:27017/admin',
    DBOptions: {'user': 'kaokao', 'pass': 'kao123456kao'},
    DB: 'doracms',
    HOST: '',
    PORT: 27017,
    USERNAME: 'kaokao',
    PASSWORD: 'kao123456kao',

    IsTest: true,

//    站点基础信息配置

    SITETITLE: '我就是爱买', // 站点名称
    SITEDOMAIN: 'http://www.wjsam.com', // 站点域名
    SITEICP: '京ICP备11035347号-1', // 站点备案号
    SYSTEMMAIL: '330996818@qq.com', // 管理员个人邮箱
    UPDATEFOLDER: process.cwd() + '/public/upload', // 默认上传文件夹本地路径
    TEMPSFOLDER: process.cwd() + '/views/web/temp', // 默认模板文件夹本地路径
    DATAOPERATION: process.cwd() + '/models/db/bat', //数据库操作脚本目录
    DATABACKFORDER: 'C:/softbak/mongodbConfig/mongodata/', // 服务端数据库操作脚本目录
    CMSDISCRIPTION: '前端开发俱乐部,分享前端知识,丰富前端技能。汇集国内专业的前端开发文档,为推动业内前端开发水平共同奋斗。html,js,css,nodejs,前端开发,jquery,web前端, web前端开发, 前端开发工程师',
    SITEKEYWORDS: '我就是爱买,值得买,全网折扣,便宜货',
    SITEBASICKEYWORDS: '我就是爱买,值得买,全网折扣', // 基础关键词


    SYSTEMMANAGE: new Array('sysTemManage_0', 'DoraCMS后台管理'),  // 后台模块(系统管理)
    ADMINUSERLIST: new Array('sysTemManage_0_1', '系统用户管理'),
    ADMINGROUPLIST: new Array('sysTemManage_0_2', '系统用户组管理'),
    EMAILTEMPLIST: new Array('sysTemManage_0_3', '邮件模板管理'),
    ADSLIST: new Array('sysTemManage_0_4', '广告管理'),
    FILESLIST: new Array('sysTemManage_0_5', '文件管理'),
    DATAMANAGE: new Array('sysTemManage_0_6', '数据管理'), // 数据管理
    BACKUPDATA: new Array('sysTemManage_0_6_1', '数据备份'), // 数据备份


    CONTENTMANAGE: new Array('contentManage_1', '内容管理'), // 后台模块(内容管理)
    CONTENTLIST: new Array('contentManage_1_1', '文档管理'),
    CONTENTCATEGORYS: new Array('contentManage_1_2', '文档类别管理'),
    CONTENTTAGS: new Array('contentManage_1_3', '文档标签管理'), //标签管理
    CONTENTTEMPS: new Array('contentManage_1_4', '文档模板管理'), //模板管理
    MESSAGEMANAGE: new Array('contentManage_1_5', '留言管理'), // 留言管理

    USERMANAGE: new Array('userManage_2', '会员管理'), // 后台模块(会员管理)
    REGUSERSLIST: new Array('userManage_2_1', '注册用户管理'),

//    本地缓存设置
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_psd: 'redispsd',
    redis_db: 0,

//    邮件相关设置
    site_email: 'xx@163.com',
    site_email_psd: 'xxx',
    email_findPsd: 'findPsd',
    email_reg_active: 'reg_active',
    email_notice_contentMsg: 'notice_contentMsg',
    email_notice_user_contentMsg: 'notice_user_contentMsg'
};
