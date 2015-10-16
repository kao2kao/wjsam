$(function () {
    //获得浏览器参数
    $.extend({
        getUrlVars: function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlVar: function (name) {
            return $.getUrlVars()[name];
        }
    });

    //封装浏览器参数
    var composeUrlParams = function () {
        var param = '';
        $.each($.getUrlVars(), function (i, item) {
            if (item != 'p') {
                var val = $.getUrlVar(item);
                if (val) param += "&" + item + "=" + val;
            }
        });
        return param;
    }

    //分页功能
    var page = $('#page1');
    //分页功能
    var options = {
        bootstrapMajorVersion: 3,
        currentPage: 2,
        totalPages: 5,
        numberOfPages: 5,
        itemTexts: function (type, page, current) {
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "上一页";
                case "next":
                    return "下一页";
                case "last":
                    return "末页";
                case "page":
                    return page;
            }
        }
    }
    /*var options = {
     currentPage: page.attr('pageNum'),
     totalPages: page.attr('pageCount'),
     numberOfPages: page.attr('numberOfPages'),
     pageUrl: function (type, page, current) {
     return "/admin/movie?" + composeUrlParams() + "&p=" + page;
     }
     }*/
    $('.pagination').bootstrapPaginator(options);


    /*var mdata = {};
     var url = '/js/movie.json';

     var movie = $('#c_editor').attr('movie')
     if (movie) {
     url = '/movie/json/' + movie;
     }

     $.getJSON(url, function (data) {
     mdata = data;
     render_editor_form(mdata);
     render_event_form(mdata);
     });

     var render_editor_form = function (data) {
     $('#c_editor').val($.toJSON(data));
     };

     var render_event_form = function () {
     $('#c_save').on('click', function (event) {
     var data = {};
     data['content'] = mdata;
     $.ajax({
     type: "POST",
     url: '/movie/add',
     contentType: "application/json", //必须有
     data: $.toJSON(data),
     success: function (data, textStatus) {
     if (data.success) {
     $('#msg').html('成功保存!');
     $('#msg').addClass('alert alert-success');
     $(location).attr('href', '/movie/' + mdata.name);
     } else {
     $('#msg').html(data.err);
     $('#msg').addClass('alert alert-error');
     }
     }
     });
     });
     };*/
});