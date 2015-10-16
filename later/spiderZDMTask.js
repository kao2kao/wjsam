//schedule task
var later = require('later');
var spider = require('spider')

later.date.localTime();

console.log("Now:"+new Date());

var sched = later.parse.recur().every(10).minute(),
    t = later.setInterval(function() {
        spriderZDM(Math.random(10));
    }, sched);

function spriderZDM(val) {
    console.log("sprider zdm start");
    console.log(new Date());
    spider.add();
}
