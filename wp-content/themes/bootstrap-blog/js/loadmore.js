// contenthub view more
jQuery( document ).ready(function($){
	
	$(".with-loadmore.content-hub").slice(0, 12).show();
	if ($(".with-loadmore:hidden").length == 0) {
			$(".loadmore").hide();
	}
	$(".loadmore.content-hub").on('click', function (e) {
		e.preventDefault();
		$(".with-loadmore:hidden").slice(0, 4).slideDown(500);
		if ($(".with-loadmore:hidden").length == 0) {
			$(".loadmore").hide();
		}

	});

});