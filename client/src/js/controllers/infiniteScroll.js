'use strict';

/* Controllers */
app.controller('InfiniteScrollCtrl',
    function ($scope, Products) {
        $scope.products = new Products();
    });

// 创建后台数据交互工厂
app.factory('Products', function ($http) {
    var Products = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.page = 0;
    };

    Products.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;

        var url = "json_more.json?timesort=";
        $http.get(url).success(function (data) {
            Array.prototype.push.apply(this.items, data);
            //this.items.concat(data);
            this.after = "t3_" + this.items[this.items.length - 1]._id;
            this.busy = false;
            this.page += 1;
        }.bind(this));
    };
    return Products;
});
