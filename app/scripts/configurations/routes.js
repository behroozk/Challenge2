'use strict';

angular.module('challenge2App').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	// route state for the products listing page
	$stateProvider
	.state('products', {
		url: '/products?search&page',
		templateUrl: 'views/products.html',
		controller: 'ProductsCtrl',
		controllerAs: 'ctrl',
		reloadOnSearch: false
	});

	// redirect every other route to the products page
	$urlRouterProvider.otherwise('/products');
}]);