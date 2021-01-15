/*
 * Main JS file for gonjiam
 */
jQuery(document).ready(function($) {

	var config = {
		'share-selected-text': true,
		'load-more': true,
		'infinite-scroll': false,
		'infinite-scroll-step': 999,
		'disqus-shortname': 'hauntedthemes-demo'
	};

	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
		h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
		readLaterPosts = [],
		url = [location.protocol, '//', location.host].join(''),
		noBookmarksMessage = $('.no-bookmarks').html(),
		monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	setGalleryRation();

	$('[data-toggle="tooltip"]').tooltip({
		trigger: 'hover'
	});


	// Execute on load
	$(window).on('load', function(event) {

		var currentPage = 1;
		var pathname = window.location.pathname;
		var $result = $('.post');
		var step = 0;

		// remove hash params from pathname
		pathname = pathname.replace(/#(.*)$/g, '').replace('/\//g', '/');

		if ($('body').hasClass('paged')) {
			currentPage = parseInt(pathname.replace(/[^0-9]/gi, ''));
		}

		// Load more posts on click
		if (config['load-more'] && typeof maxPages !== 'undefined') {

			if (maxPages == 1) {
				$('#load-posts').addClass('hidden');
				return;
			};

			$('#load-posts').addClass('visible').removeClass('hidden');

			$('#load-posts').on('click', function(event) {
				event.preventDefault();

				if (currentPage == maxPages) {
					$('#load-posts').addClass('hidden');
					return;
				};

				var $this = $(this);

				// next page
				currentPage++;

				if ($('body').hasClass('paged')) {
					pathname = '/';
				};

				// Load more
				var nextPage = pathname + 'page/' + currentPage + '/';

				if ($this.hasClass('step')) {
					setTimeout(function() {
						$this.removeClass('step');
						step = 0;
					}, 1000);
				};

				$.get(nextPage, function(content) {
					step++;
					var post = $(content).find('.post').addClass('opacity');
					$('#content .loop').append(post);
					$.each(post, function(index, val) {
						var $this = $(this);
					});
				});

				if (currentPage == maxPages) {
					$('#load-posts').addClass('hidden');
				};

			});
		}else{
			$('#load-posts').removeClass('visible').addClass('hidden');
		};

		if (config['infinite-scroll'] && config['load-more']) {
			var checkTimer = 'on';
			if ($('#load-posts').length > 0) {
				$(window).on('scroll', function(event) {
					var timer;
					if (isScrolledIntoView('#load-posts') && checkTimer == 'on' && step < config['infinite-scroll-step']) {
						$('#load-posts').click();
						checkTimer = 'off';
						timer = setTimeout(function() {
							checkTimer = 'on';
							if (step == config['infinite-scroll-step']) {
								$('#load-posts').addClass('step');
							};
						}, 1000);
					};
				});
			};
		};

		setGalleryRation();

	});

	// Hide/Show menu
	function setMenu(w){
		if (w < 767) {
			$('header .nav').appendTo('#drawer .widget-menu');
		}else{
			$('#drawer .widget-menu .nav').appendTo('header .navigation');
			$('#drawer').modal('hide');
		};
	}

	setMenu(w);

	$(window).on('resize', function(event) {
		w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		setMenu(w);
	});

});