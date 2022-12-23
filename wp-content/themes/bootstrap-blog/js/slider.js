jQuery(document).ready(function($){

  /* SLIDE ON CLICK */ 

  $('.carousel-indicators > li > a').click(function() {

    // grab href, remove pound sign, convert to number
    var item = Number($(this).attr('href').substring(1));

    // slide to number -1 (account for zero indexing)
    $('#slideshow').carousel(item - 1);

    // remove current active class
    $('.carousel-indicators .active').removeClass('active');

    // add active class to just clicked on item
    $(this).parent().addClass('active');

    // don't follow the link
    return false;
  });

  /* AUTOPLAY NAV HIGHLIGHT */

// bind 'slid' function
$('#slideshow').bind('slid', function() {

    // remove active class
    $('.carousel-indicators .active').removeClass('active');

    // get index of currently active item
    var idx = $('#slideshow .carousel-item.active').index();

    // select currently active item and add active class
    $('.carousel-indicators li:eq(' + idx + ')').addClass('active');

  });


});

/* Slick slider syncing */
jQuery(document).ready(function($){
  $('.slick-slider-item').on('click', function(){
    $('.slick-slider-item').removeClass('slick-active slick-current');
    $(this).addClass('slick-active slick-current');

    $('.slick-slider-item').removeClass('active');
    var id = $(this).attr('id');
    $('#' + id).addClass('active');
 //  }
});

  $('.portfolio-thumb-slider').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.big-thum',
    dots: false,
    arrows: false,
    focusOnSelect: true,
    infinite: false
  });

  $('.big-thum.active').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: '.small-thumb',
    infinite: false
  });

var current = 0; // current slider dupa refresh
$('.portfolio-thumb-slider .slick-slide:not(.slick-cloned)').eq(current).addClass('slick-current');
$('.big-thum').on('afterChange', function(event, slick, currentSlide, nextSlide){
  current = currentSlide;
  $('.portfolio-thumb-slider .slick-slide').removeClass('slick-current');
  $('.portfolio-thumb-slider .slick-slide:not(.slick-cloned)').eq(current).addClass('slick-current');

});

});


/* slider numbers for home page */
jQuery(document).ready(function($){
  var totalslider = $('.home-carousel').length;
  var currentslide = $('div.carousel-item.home-carousel.active').index() + 1;

  $('.current-slide-number.anchor-block').html('<span>' + currentslide +'</span> / '+ totalslider + '');
  $(document).trigger('uw_anchorblock_load', { 'slider':$('#slideshow') });
  $(document).trigger('uw_anchorblock_update', { 'slide':$('div.carousel-item.home-carousel.active'), 'slidenumber':currentslide });

  $('#slideshow').on('slid.bs.carousel', function() {
    currentslide = $('div.carousel-item.home-carousel.active').index() + 1;
    $('.current-slide-number.anchor-block').html('<span>' + currentslide +'</span> / ' + totalslider + '');

    $(document).trigger('uw_anchorblock_update', { 'slide':$('div.carousel-item.home-carousel.active'), 'slidenumber':currentslide });
  });

});


/* slider title layout 1 */
jQuery(document).ready(function($){
  if ($('.carousel-caption').hasClass('slider-title-layout-1')) {
    $('.controlsBlock').css("bottom", "-83px");
  }

  if ($('.carousel-caption').hasClass('slider-title-layout-3')) {
    $('.controlsBlock').css("bottom", "-140px");
  }
  
});

/* slider numbers for image gallery */
jQuery(document).ready(function($){

  var totalgallery = $('.img-gallery').length;
  var currentgallery = $('div.carousel-item.img-gallery.active').index() + 1;
  $('.current-slide-number.gallery-slider').html('<span>' + currentgallery + '</span> / ' + totalgallery+ '');

  $('#img-gallery-carousel').on('slid.bs.carousel', function() {
    currentgallery = $('div.carousel-item.img-gallery.active').index() + 1;
    $('.current-slide-number.gallery-slider').html('<span>' + currentgallery + '</span> / ' + totalgallery + '');

  });
});

/*
jQuery(document).ready(function($){
  $('.topics-slider').slick({
    infinite: false,
    slidesToShow: 6,
    slidesToScroll: 6,
    swipeToSlide: true,
    arrows: false,
    //variableWidth: true,
    centerPadding: '5px',
    responsive: [
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      }
    }
    ]
  });
});
*/

// swipe anchorblock
jQuery(document).ready(function($){
  $("#slideshow.carousel").swipe({

    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

      if (direction == 'left') $(this).carousel('next');
      if (direction == 'right') $(this).carousel('prev');

    },
    allowPageScroll:"vertical",
    excludedElements: "button, input, select, textarea, .noSwipe, #slideshow .carousel-caption, #slideshow .controlsBlock .carousel-control"

  });
});
