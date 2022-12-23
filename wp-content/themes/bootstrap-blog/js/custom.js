// https://developers.google.com/youtube/iframe_api_reference

// global variable for the player
var player;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
  	events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {

  // bind events
  jQuery(document).ready(function($){
  	var playButton = document.getElementById("play-button");
  	playButton.addEventListener("click", function() {
  		player.playVideo();
  		$('#play-button').hide();
  		$('#pause-button').show();
  	});

  	var pauseButton = document.getElementById("pause-button");
  	pauseButton.addEventListener("click", function() {
  		player.pauseVideo();
  		$('#pause-button').hide();
  		$('#play-button').show();
  	});

  });
  
}

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// Scroll indicator progress
jQuery(document).ready(function($){
  $('.modal-body').scroll(function () {
    const scrollBox = $('.modal-body'),
    scroll = scrollBox.scrollTop(),
    scrollHeight = scrollBox[0].scrollHeight,
    containerHeight = scrollBox.innerHeight();
    scrollPercent = (scroll / (scrollHeight - containerHeight) * 100);

    $("#progressbar").attr('aria-valuenow', scrollPercent);
    $("#progressbar").css('width', scrollPercent + '%');

  });
});

//Change the number of gallery when scroll down
jQuery(document).ready(function($){
 $(".current-number").text("1");
 $(".total-number").text($(".gallery-img").length);

 $('.modal-body').scroll(function() {
  $(".gallery-img").each(function() {
      //+ 100 is for header part
      if (($(window).scrollTop() + 100) >= $(this).offset().top) {
        var id = $(this).attr("id");
        var id = id.split("-");
        $(".current-number").text(id[1]);
      }
    });
});
});

//Grid and List view for gallery
jQuery(document).ready(function($){
  $('.grid').click(function(){
    $('.gallery-img').addClass('gallery-img-grid');
    $('.gallery-img-desc').hide();
    $('h1.page-title').hide();
    $('.grid .fa-th').hide();
    $('.list .fa-list').show();
    $('.modal-title').hide();
    $('.progress').hide();
  });

  $('.list').click(function(){
    $('.gallery-img').removeClass('gallery-img-grid');
    $('.gallery-img-desc').show();
    $('h1.page-title').show();
    $('.grid .fa-th').show();
    $('.list .fa-list').hide();
    $('.modal-title').show();
    $('.progress').show();
  });

});

// hamburger menu
jQuery(document).ready(function($){
 $(".navbar-toggler").click(function() {
  $("#sidebar-wrapper").toggleClass('open');
  $("#wrapper.main-nav").toggleClass("toggled");
  //$(".navbar-toggler").toggleClass("collapsed");

  if($('#sidebar-wrapper.desktop').hasClass('open')){
    $('.overlay-bg').show();
    $('.overlay-bg').removeClass('fadeOut');
    $('.overlay-bg').addClass('fadeIn');
    $('.overlay-bg').css('z-index', 1111);
    $('body').css('overflow','hidden');
  }
  else{
    $('.overlay-bg').removeClass('fadeIn');  
    $('body').css('overflow','auto');
    $('.overlay-bg').hide();
  }
});

 $(".overlay-bg").click(function(){
  $("#sidebar-wrapper").toggleClass('open');
  $("#wrapper.main-nav").toggleClass("toggled");
  //$(".navbar-toggler").toggleClass("collapsed");

  if($('#sidebar-wrapper.desktop').hasClass('open')){
    $('.overlay-bg').show();
    $('.overlay-bg').removeClass('fadeOut');
    $('.overlay-bg').addClass('fadeIn');
    $('.overlay-bg').css('z-index', 1111);
    $('body').css('overflow','hidden');
  }
  else{
    $('.overlay-bg').removeClass('fadeIn');  
    $('body').css('overflow','auto');
    $('.overlay-bg').hide();
  }
});
 
});

//search bar

jQuery(document).ready(function($){

  $("#close-icon-desktop.search-top").click(function () {
    $("#for-desktop.search-bar").hide();
    $(".scroll-top-wrapper").show();
    $("body").css("overflow", "auto");
    $(".search-bar-bg").hide();
    $("#close-icon-desktop").hide();
    $("#search-icon-desktop").show();
  });
  
  $("#search-icon-desktop.search-top").click(function () {
    $("#for-desktop.search-bar").show();
    $(".proinput>form>input.orig").focus();
    $(".scroll-top-wrapper").hide();
    $("body").css("overflow", "hidden");
    $('.search-bar-bg').show();
    $("#close-icon-desktop").show();
    $("#search-icon-desktop").hide();
  });  
  
  $("#search-icon-mobile.search-top").click(function () {
    $("#for-mobile.search-bar").show();
    $(".proinput>form>input.orig").focus();
    $(".scroll-top-wrapper").hide();
    $(".sticky-header").hide();
    $("body").css("overflow", "hidden");
    $("#close-icon-mobile").show();
    $("#search-icon-mobile").hide();
  });

  $("#close-icon-mobile").click(function () {
    $("#for-mobile.search-bar").hide();
    $(".scroll-top-wrapper").show();
    $(".sticky-header").show();
    $("body").css("overflow", "auto");
    $("#close-icon-mobile").hide();
    $("#search-icon-mobile").show();
  });
  
});

// single article progress bar and header
jQuery(document).ready(function($){

  if ($('body').hasClass('single') === true) {

    var lastScrollTop = 0, delta = 5;
    $(window).scroll(function () {

      var scroll = $(window).scrollTop();

      modalHeight = $('body.single').height(),
      contantHeight = $(window).height();
      scrollPercent = ((scroll / (modalHeight-contantHeight)) * 100);
     /*
      $("#progressbar").attr('aria-valuenow', scrollPercent);
      $("#progressbar").css('width', scrollPercent + '%');
      */

      if(Math.abs(lastScrollTop - scroll) <= delta)
        return;

      if (scroll > lastScrollTop && scrollPercent > 0 && scroll > 500){
        // downscroll code
        $('.main-nav').css({'transform': 'translateY(-100%)', '-ms-transform': 'translateY(-100%)', '-webkit-transform': 'translateY(-100%)'});
        $('.flip-nav').css('transform', 'translateY(0)');
        $('.flip-nav').addClass('shown');   
      } else {
        // upscroll code        
        $('.flip-nav').css({'transform': 'translateY(-100%)', '-ms-transform': 'translateY(-100%)', '-webkit-transform': 'translateY(-100%)'});
        $('.main-nav').css('transform', 'translateY(0)');
        $('.flip-nav').removeClass('shown');
      }
      lastScrollTop = scroll;

    });

  }  
});

jQuery(document).ready(function($){
  

goToPromoBox();

function goToPromoBox(){
  $('body').on('click', '.promo-box-top', function(){
    var _this = $(this);
    var target_box = _this.data('targetBox');
    var get_box_offset = $("#" + target_box).offset();
    var navbar_h = $('#wrapper .navbar').height();
    var box_offset_top = get_box_offset.hasOwnProperty('top') ? get_box_offset.top : 0;

    if(box_offset_top > 0){
      $("html, body").animate({ 
        scrollTop: (box_offset_top - (navbar_h + 10))
      }, 1000);
    }

    return false;
  })
}
});