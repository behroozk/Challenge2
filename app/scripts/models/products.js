'use strict';

angular.module('challenge2App').service('ProductsModel', ['Resource', function(Resource) {
	angular.extend(this, new Resource('http://api.vip.supplyhub.com:19000/products'));

	this.search = function search(term, limit, skip, count) {
		var config = {
			params: {
				search: term,
				limit: (!!limit && limit >= 1) ? limit : undefined,
				skip: (!!skip && skip >= 0) ? skip : undefined,
				count: count
			}
		};
		return this.get('', undefined, config).then(function(products) {
			return products;
		}, function() {
			return [];
		});
	};
}]);
