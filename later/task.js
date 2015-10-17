//schedule task
var later = require('later');
later.date.localTime();

var spider = require('./spider');

console.log("Task init:" + new Date());

//smzdm 5分钟抓取一次
var sched =later.parse.recur().every(5).minute(),
    t = later.setInterval(function () {
        console.log("sprider zdm start:" + new Date());
        spider.add();
        console.log("sprider zdm end:" + new Date());
    }, sched);

