'use strict';

// controller for the products listing view
angular.module('challenge2App')
	.controller('ProductsCtrl', ['$rootScope', 'CONFIG', '$location', '$stateParams', 'ProductsModel', function ($rootScope, CONFIG, $location, $stateParams, ProductsModel) {
		var self = this,
			// store a reference to the timeout set
			timeoutId = false,
			// store the default page size and list of available sizes
			config = {
				limit: CONFIG.products.pageSizes[CONFIG.products.pageSizes - 1],
				sizes: CONFIG.products.pageSizes
			},

			// initialization function
			init = function init() {
				// search term
				self.search = '';
				self.totalProducts = 0;
				self.products = [];
				self.totalPages = 0;
				self.currentPage = 1;
				self.pageSizes = config.sizes;
				// indicates whether results are being fetched from the server
				self.loading = false;

				// if initially there is a search term and page number in the address bar, load those
				if(typeof $stateParams.search !== 'undefined') {
					getProductsCount($stateParams.search);

					self.search = $stateParams.search;

					if(typeof $stateParams.page !== 'undefined') {
						self.currentPage = Number($stateParams.page);
					}

					searchProducts(self.search, (self.currentPage - 1) * config.limit);
				}
			},

			// calculate number of the results page
			setupPagination = function setupPagination(count) {
				self.totalPages = Math.ceil(count / config.limit);
			},

			// update url
			updateLocation = function updateLocation(term, start) {
				if(start === 0) {
					self.currentPage = 1;
				}

				$location.search({'search': term, 'page': self.currentPage});
			},

			// search for products with specified parameters
			searchProducts = function searchProducts(term, start) {
				// display the loader
				self.loading = true;

				ProductsModel.search(term, config.limit, start).then(function(products) {
					self.loading = false;
					self.products = products;
				});
			},

			// find the number of items in the results
			getProductsCount = function getProductsCount(term) {
				ProductsModel.search(term, undefined, undefined, 1).then(function(response) {
					self.totalProducts = response.count || 0;
					setupPagination(self.totalProducts);
				});
			};

		// enqueue the search terms, wait for 1 second to make sure typing is done
		this.queueSearch = function queueSearch(term, start) {
			// if there is already a timeout set, cancel the old one
			if(!!timeoutId) {
				clearTimeout(timeoutId);
			}

			// set the new timer for updating url and results' count
			timeoutId = setTimeout(function() {
				self.loading = true;
				updateLocation(term, start);
				getProductsCount(term);

				timeoutId = false;
			}, 1000);
		};

		this.changePage = function changePage(page) {
			if(page <= self.totalPages) {
				if(Number($location.search().page) === page) {
					searchProducts(self.search, (self.currentPage - 1) * config.limit);
				} else {
					$location.search('page', page);
				}
			}
		};

		this.changePageSize = function changePageSize(size) {
			config.limit = size;
			setupPagination(self.totalProducts);
			self.changePage(self.currentPage > self.totalPages ? self.totalPages : self.currentPage);
		};

		// listen for location change events, then load the proper products
		$rootScope.$on('$locationChangeSuccess', function() {
			self.search = $location.search().search;
			self.currentPage = Number($location.search().page) || 1;
			// if page number is invalid, load the first page
			if(self.currentPage > self.totalPages && self.totalPages > 0) {
				$location.search('page', 1);
				return;
			}

			searchProducts(self.search, (self.currentPage - 1) * config.limit);

			getProductsCount(self.search);
		});

		init();
	}]);
