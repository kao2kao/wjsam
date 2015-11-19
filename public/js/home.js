// 出现收藏栏
if (!$.cookie('favorite')) {
    var _addHtml1 = '<div class="top_collect">' +
                        '<div class="grid_auto cf">' +
                            '<a class="close_collect" href="javascript:void(0)" onclick="closeCollect()">×</a>' +
                            '<div class="text_collect">' +
                                '<a href="javascript:void(0)" onclick="addCollect()">加入收藏</a>抢购快人一步' +
                            '</div>' +
                        '</div>' +
                    '</div>';

    var _addHtml2 = '<div class="top_collect">' +
                        '<div class="grid_auto cf">' +
                            '<a class="close_collect" href="javascript:void(0)" onclick="closeCollect()">×</a>' +
                            '<div class="text_collect">' +
                                '<span>请按键盘 Ctrl键 + D 收藏</span>抢购快人一步' +
                            '</div>' +
                        '</div>' +
                    '</div>';

    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    if (window.ActiveXObject) {
        Sys.ie = ua.match(/msie ([\d.]+)/)[1];
    } else if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0 && window.sidebar.addPanel) {
        Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1]; 
    }

    if (Sys.ie || Sys.firefox) {
        $(_addHtml1).prependTo('body').slideDown(500);
    } else {
        $(_addHtml2).prependTo('body').slideDown(500);
    }
}

//加入收藏夹
function addCollect() {
    closeCollect();
    var _addHref = "http://www.liuzhuni.com/?tp=topfav";
    if ($.browser.msie) {
        try {
            window.external.addFavorite(_addHref, '留住你-超值推荐');
        } catch (err) {
            alert('请按键盘 Ctrl键 + D 收藏留住你');
        }
    } else {
        if ($.browser.mozilla) {
            try {
                window.sidebar.addPanel('留住你-超值推荐', _addHref, "");
            } catch (err) {
                alert('请按键盘 Ctrl键 + D 收藏留住你');
            }
        } else {
            alert('请按键盘 Ctrl键 + D 收藏留住你');
        }
    }
    return false;
}

// 关闭收藏
function closeCollect() {
    $.cookie('favorite', 'true', { path: "/", expires: 30, domain: _domain });
    $('.top_collect').slideUp();
}

// 显示返回顶部
goTop();

var eTop = $(".zhi_tit").position().top - 120 - 35;
var sideTop = 0;
if ($(".zhi_type_grid").length == 0) {
    sideTop = $(".main_side").offset().top + $(".main_side").height();
}
var tmp = true;
// 首页左侧筛选导航
$(window).scroll(function () {
    var winTop = $(window).scrollTop();
    if (winTop >= eTop) {
        $(".side_nav").addClass("fixed_nav");
    } else {
        $(".side_nav").removeClass("fixed_nav");
    }

    if (winTop > 1500) {
        $(".side_nav .nav_list").slideUp(1);
    } else {
        $(".side_nav .current .nav_list").slideDown(1);
    }

    if (winTop >= 150) {
        $(".top_nav").css({ "top": "0" });
    } else {
        $(".top_nav").css({ "top": "-50px" });
    }

    var hot_height = $(".tj_hot").height();

    if($(".zhi_type_grid").length==0){
        if (winTop > sideTop) {

            $(".tj_hot").addClass("pfixed");
            if (tmp) {
                $(".tj_hot").css("top", -(hot_height)+"px");
                tmp = false;
            }
            $(".tj_hot").animate({ top: '55px' });

        } else {

            $(".tj_hot").removeClass("pfixed");
            if (!tmp) {
                $(".tj_hot").css("top", "0px");
                $(".tj_hot").animate({ top: '0px' }).stop(true, true);
                tmp = true;
            }

        }
    }


});

$(".side_nav .current").hover(function () {
    $(this).find(".nav_list").slideDown();
});

$(".side_nav .mall_list").hover(function () {
    $(".side_nav .mall_box").show();
}, function () {
    $(".side_nav .mall_box").hide();
});


// 热门推荐固定浮动

// 浏览模式切换引导
if (!$.cookie('showtype_pop')) {
    var _popHtml = '<div id="showtype_pop" style="position:absolute;top:-25px;left:-315px;width:364px;height:81px;background:url(/content_new/images/show_type_pop.png) no-repeat;">'+
                        '<a href="javascript:closeShowTypePop1();" style="background:none;width:25px;height:25px;margin-left:230px;" title="知道了"></a>' +
                    '</div>';
    $('.show_type').append(_popHtml);
}
// 显示第二个引导
function closeShowTypePop1() {
    $('#showtype_pop').remove();
    var _popHtml = '<div id="showtype_pop1" style="position:absolute;top:-25px;left:-690px;width:282px;height:103px;background:url(/content_new/images/tips_pop.png) no-repeat;">' +
                      '<a href="javascript:closeShowTypePop();" style="background:none;width:25px;height:25px;margin-left:255px;" title="知道了"></a>' +
                    '</div>';
    $('.show_type').append(_popHtml);
}

function closeShowTypePop() {
    $.cookie('showtype_pop', 'true', { path: "/", expires: 3000, domain: _domain });
    $('#showtype_pop1').remove();
}


// 签到达人榜单
$(".daren_sign,.sign_rank").hover(function () {
    $(".oksign_box .sign_rank").show();
}, function () {
    $(".oksign_box .sign_rank").hide();
});

//用户签到
function signIn() {
    if (!isLogin()) { loginShow(); return false; }
    
    var data;
    $.ajax({
        type: "POST",
        url: "/ajax/userSignIn_new",
        data: data,
        cache: false,
        success: function (data) {
            if (data.error == 0) {

                $(".start_sign").html("您已连续签到" + data.result.num + "天");
                $(".nosign_box").hide();
                $(".oksign_box").show();

                shopResult({ msg: "签到成功", point: data.result.jifen});

            } else {
                $(".nosign_box").show();
                $(".oksign_box").hide();
            }
        }
    });
}

// 首页幻灯片
var sliderBaner = function () {
    if ($(".banner li").size() == 1) $(".banner li").eq(0).css("opacity", "1");
    if ($(".banner li").size() <= 1) return;
    var i = 0, max = $(".banner li").size() - 1, playTimer;

    $(".banner li").each(function () {
        $(".adtype").append('<a></a>');
    });

    //初始化
    $(".adtype a").eq(0).addClass("current");
    $(".banner li").eq(0).css({ "z-index": "2", "opacity": "1" });
    var playshow = function () {
        $(".adtype a").removeClass("current").eq(i).addClass("current");
        $(".slider .banner li").eq(i).css("z-index", "2").fadeTo(500, 1, function () {
            $(".slider .banner li").eq(i).siblings("li").css({
                "z-index": 0,
                opacity: 0
            }).end().css("z-index", 1);
        });
    }

    var next = function () {
        i = i >= max ? 0 : i + 1;
        playshow()
    }
    var prev = function () {
        i = i <= 0 ? max : i - 1;
        playshow()
    }
    var play = setInterval(next, 5000);
    $(".banner li a,.banner_arrow").hover(function () {
        clearInterval(play);
        $(".banner_arrow").css("display", "block");
    }, function () {
        clearInterval(play);
        play = setInterval(next, 5000);
        $(".banner_arrow").css("display", "none");
    });

    $(".banner_arrow .arrow_prev").click(function () { prev(); });

    $(".banner_arrow .arrow_next").click(function () { next(); });

    $(".adtype a").mouseover(function () {
        if ($(this).hasClass("current")) return;
        var index = $(this).index() - 1;
        var playTimer = setTimeout(function () {
            clearInterval(play);
            i = index;
            next();
        }, 500)
    }).mouseout(function () {
        clearTimeout(playTimer);
    });
}
sliderBaner();

// 切换模式
function setStyle(v) {    
    // 点击后
    if ($("#showtype_pop").length==1) {
        closeShowTypePop();
    }

    $.ajax({
        type: "POST",
        url: "/ajax/setUserStyle",
        data: { flag: v },
        cache: false,
        success: function (result) {
            location = location;
        }
    });
}

// 切换声音图标
$(".push_voice").click(function () {
    var voice = $(this).attr("lang");
    if (voice == "0") {
        $(this).addClass("open_voice");
        $(this).attr('lang', 1);
        $.cookie('push_voice', 'open', { path: "/", expires: 3000, domain: _domain });
    } else {
        $(this).removeClass("open_voice");
        $(this).attr("lang", 0);
        $.cookie('push_voice', 'close', { path: "/", expires: 3000, domain: _domain });
    }
});
// 设置有声音的图标
if ($.cookie('push_voice') == "open") {
    $(".push_voice").addClass("open_voice").attr("lang", 0);
}
//声音提醒
function voiceWarning() {
    if ($.cookie('push_voice') == "open") {
        $('.audio_voice').remove();
        $('body').append('<audio class="audio_voice" style="display:none" controls="controls" autoplay="true" height="1" width="1"><source src="/Content/images/sound/jiankong.mp3" type="audio/mp3" /><source src="/Content/images/sound/jiankong.ogg" type="audio/ogg" /><embed src="/Content/images/sound/jiankong.mp3" /></audio>');
    }
}
function setRefreshTime() {
    $.ajax({
        url: "http://api.liuzhuni.com/ajax/setRefreshTime",
        type: 'Get',
        dataType: 'jsonp',
        success: function (data) {
        }
    });
}
setRefreshTime();
// 首页自动加载最新数据
function getNewPush() {
    $.ajax({
        url: "http://api.liuzhuni.com/ajax/getNewContent?jsonpcallback",
        type: 'Get',
        dataType: 'jsonp',
        jsonp: "jsonpcallback",
        success: function (data) {
            jsonpcallback(data);
           setTimeout(getNewPush, 60000);
        }
    });
}
setTimeout(getNewPush,60000);


function jsonpcallback(data) {
    if (data != "") {
        var listHtml = '';

        // 列表模式
        if ((Number($.cookie('userStyle').split('|')[1]) > Number($.cookie('userStyle').split('|')[2]))) {

            for (var i = 0; i < data.length; i++) {
                var tab = '';
                var comment = '评论'; 
                if (data[i].ShenJia != 0) {
                    tab = '<b class="tab_ico1"></b>';
                }
                if (data[i].ShouManWu != 0) {
                    tab = '<b class="tab_ico2"></b>';
                }
                if (data[i].ShenJia != 0) {
                    tab = '<b class="tab_ico3"></b>';
                }
                if (data[i].QuanQiuGou != 0) {
                    tab = '<b class="tab_ico4"></b>';
                }
                if (tab != '') {
                    tab = '<div class="tab_tips">' + tab + '</div>';
                }
                if (data[i].CommentNum > 0) {
                    comment = '评论' + data[i].CommentNum; 
                }
                listHtml = listHtml + '<div class="zhi_list cf">'+
                                '<div class="list_pic fl">'+
                                    '<a target="_blank" href="/detail/' + data[i].ContentId + '.html"><img src="' + data[i].PicUrl + '" alt=""></a>' +
                                '</div>'+
                                '<div class="list_info fl">'+
                                    '<p class="list_tit"><a target="_blank" href="/detail/' + data[i].ContentId + '.html">' + data[i].Title.replace(data[i].Title1,"") + '</a></p>' +
                                    '<p class="list_price"><a target="_blank" href="/detail/' + data[i].ContentId + '.html">' + data[i].Title1 + '</a></p>' +
                                    '<div class="list_doc">' + decodeURIComponent(data[i].ContentText) +
                                    '</div>'+
                                    '<div class="list_action">'+
                                        '<p class="list_label">'+
                                            '<a target="_blank" href="/0-' + data[i].MallId + '-0-0-0/">' + data[i].c_mallName + '</a><a target="_blank" href="/detail/' + data[i].ContentId + '.html#comment">' + comment + '</a>' +
                                        '</p>'+
                                        '<p class="list_page">'+
                                            '<span class="pub_time"><i class="ico_clock"></i>' + data[i].AuditMan + '</span>' +
                                            '<span class="page_num">' + data[i].Readcount + '人浏览</span>' +
                                        '</p>'+
                                        '<a target="_blank" class="list_buy_btn" href="/go/' + data[i].ContentId + '"><span>前往购买</span></a>' +
                                    '</div>'+
                                '</div>' + tab+
                            '</div>';

            }



        } else {
            // 风格模式

            for (var i = 0; i < data.length; i++) {
                var tab = '';
                var comment = '评论'; 
                if (data[i].ShenJia != 0) {
                    tab = '<b class="tab_ico1"></b>';
                }
                if (data[i].ShouManWu != 0) {
                    tab = '<b class="tab_ico2"></b>';
                }
                if (data[i].ShenJia != 0) {
                    tab = '<b class="tab_ico3"></b>';
                }
                if (data[i].QuanQiuGou != 0) {
                    tab = '<b class="tab_ico4"></b>';
                }
                if (tab != '') {
                    tab = '<div class="tab_tips">' + tab + '</div>';
                }
                if (data[i].CommentNum > 0) {
                    comment = '评论' + data[i].CommentNum;
                }
                listHtml = listHtml+  '<li>'+
                            '<div class="zhi_grid">'+
        	                    '<div class="grid_pic">'+
                                    '<a target="_blank" href="/detail/' + data[i].ContentId + '.html"><img src="' + data[i].PicUrl + '" alt=""></a>' +   		          
                                '</div>'+
        	                    '<h4 class="grid_tit">'+
        		                    '<a target="_blank" href="/detail/' + data[i].ContentId + '.html" title="' + data[i].Title.replace(data[i].Title1, "") + '">' + data[i].Title.replace(data[i].Title1, "") + '</a>' +
        	                    '</h4>'+
        	                    '<div class="grid_price">'+
        		                    '<p class="price_current"><a target="_blank" href="/detail/' + data[i].ContentId + '.html">' + data[i].Title1 + '</a></p>' +
                                    '<span class="pub_time"><i class="ico_clock"></i>' + data[i].AuditMan + '</span>' +
                                    '<a target="_blank" class="grid_buy_btn" href="/go/' + data[i].ContentId + '"><span>前往购买</span></a>' +
        	                    '</div>'+
                                '<div class="grid_page cf">'+
                                    '<a target="_blank" href="/0-' + data[i].MallId + '-0-0-0/">' + data[i].c_mallName + '</a><a target="_blank" href="/detail/' + data[i].ContentId + '.html#comment">' + comment + '</a>' +
                                    '<span class="page_num">' + data[i].Readcount + '人已浏览</span>' +
                                '</div>'+
                            '</div>'+tab+
                        '</li>';

            }

        }

        $("#ulmain").prepend(listHtml);
        voiceWarning();
    }

}
// 图片懒加载
lazyLoading($("img.lazyload"));