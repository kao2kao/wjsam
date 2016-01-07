'use strict';

/* Controllers */
app.controller('InfiniteScrollCtrl',
    function ($scope, Products) {
        $scope.products = new Products();
    });

// ������̨���ݽ�������
app.factory('Products', function ($http) {
    var Products = function () {
        this.items = [];
        this.busy = false;
        this.lastTimesort = '';
        this.page = 1;
    };

    Products.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;

        var url = "json_more.json?timesort=" + this.lastTimesort;
        $http.get(url).success(function (data) {
            Array.prototype.push.apply(this.items, data);
            //this.items.concat(data);
            this.lastTimesort = data[data.length - 1].timesort;
            this.busy = false;
            this.page += 1;
        }.bind(this));
    };
    return Products;
});
