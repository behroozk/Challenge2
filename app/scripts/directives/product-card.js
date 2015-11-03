'use strict';

// directive for product cards
angular.module('challenge2App').directive('productCard', function() {
	return {
		restrict: 'EA',
		templateUrl: 'views/directives/product-card.html',
		scope: {
			name: '=',
			image: '=',
			link: '=',
			category: '=',
			brand: '='
		}
	};
});