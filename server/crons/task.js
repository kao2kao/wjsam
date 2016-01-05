//schedule task
var later = require('later');
later.date.localTime();
var settings = require("../models/common/settings");
var smzdm = require('./smzdm');

console.log("Task init:" + new Date());
var i = 1;

//smzdm 5分钟抓取一次
var sched = later.parse.recur().every(5).second(),
    t = later.setInterval(function () {
        if (i > 1) {
            return;
        }
        console.log("sprider zdm start:" + new Date());
        i++;
        smzdm.start();
        console.log("sprider zdm end:" + new Date());
    }, sched);

