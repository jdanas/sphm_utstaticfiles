jQuery(function ($) {
  // DOM is now read and ready to be manipulated

  var loadMoreCounter = 0;
  var uwActivePostID = 0;
  var uwMidAdUnits = {};
  var uwIsInitLoad = true;
  var uwSliderShowPrev = false;
  var uwCurrentPostId = 0;

  //Tab to top
  $(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
      $(".scroll-top-wrapper").addClass("show");
    } else {
      $(".scroll-top-wrapper").removeClass("show");
    }
  });
  $(".scroll-top-wrapper").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });

  // Hamburger dropdown menu
  $("#menu-hamburger-menu>.menu-item-has-children")
    .click(function (event) {
      event.preventDefault();
      $(this).children(".dropdown-menu").slideToggle("slow");
      $(this).toggleClass("clicked").siblings();
    })
    .children("ul")
    .find(".menu-item")
    .click(function (event) {
      //event.preventDefault();
      event.stopPropagation();
      $(this).children(".dropdown-menu").slideToggle("slow");
      $(this).toggleClass("expanded").siblings().removeClass("expanded");
      $(this).toggleClass("clicked").siblings().removeClass("clicked");
    })
    .children("ul")
    .find(".menu-item")
    .click(function (event) {
      //select all the `.child` elements and stop the propagation of click events on the elements
      //event.preventDefault();
      //event.stopPropagation();
      return true;
      $(this).parents(".menu-item-has-children").removeClass("expanded");
    });

  $("#menu-hamburger-menu-1>.menu-item-has-children")
    .click(function (event) {
      //event.preventDefault();
      $(this).children(".dropdown-menu").slideToggle("slow");
      $(this).toggleClass("clicked").siblings();
    })
    .children("ul")
    .find(".menu-item")
    .click(function (event) {
      //event.preventDefault();
      event.stopPropagation();
      $(this).children(".dropdown-menu").slideToggle("slow");
      $(this).toggleClass("expanded").siblings().removeClass("expanded");
      $(this).toggleClass("clicked").siblings().removeClass("clicked");
    })
    .children("ul")
    .find(".menu-item")
    .click(function (event) {
      //select all the `.child` elements and stop the propagation of click events on the elements
      //event.preventDefault();
      //event.stopPropagation();
      return false;
      $(this).parents(".menu-item-has-children").removeClass("expanded");
    });

  if (!!jQuery(".sticky-header")) {
    jQuery(window).scroll(function () {
      var oHeader = jQuery("header");
      if (!oHeader) return;
      var sticky = jQuery(".sticky-header");
      var scroll = jQuery(window).scrollTop();
      var bodywidth = jQuery("body").width(); //see body got shrinked by skinning?
      if (scroll >= oHeader.offset().top) sticky.addClass("fix-top");
      else sticky.removeClass("fix-top");
      if (
        sticky.width() > bodywidth ||
        (bodywidth > sticky.width() && bodywidth < 1060)
      )
        sticky.css("max-width", bodywidth);
      else if (bodywidth > sticky.width()) sticky.css("max-width", "");
    });
  }

  $("#owl-testimonials").owlCarousel({
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });

  $("#owl-slider").owlCarousel({
    loop: false,
    margin: 15,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });

  $("#owl-slider-one").owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });

  $(".widget-instagram ul").addClass("owl-carousel");
  $(".widget-instagram ul").owlCarousel({
    loop: false,
    margin: 1,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 5,
      },
      1440: {
        items: 8,
      },
    },
  });

  function handleEmbeddedGallery() {
    $(".embedded-gallery").each(function (index, el) {
      if (Utils.isWidgetProcessed(el)) return;

      Utils.flagWidgetAsProcessed(el);
      var isGridViewDisabled = $(el).data("grid-disabled") == "1";
      var isSlideshowDisabled = $(el).data("slideshow-disabled") == "1";
      $(el)
        .galleryPurse({
          initialView: "slider",
          gridEnabled: !isGridViewDisabled,
          slideshowEnabled: !isSlideshowDisabled,
          urlBehavior: {
            isUrlAffected: true,
            isInternalOnly: true,
            galleryParamName: "egallery",
            slideParamName: "eslide",
          },
          shareBehavior: {
            isIconSVG: true,
          },
        })
        .on("galleryIndexChange", function (event, galleryInfo) {
          if (galleryInfo != null) {
            galleryInfo.target = this;
            $(document).trigger("uw_embedded_gallery_update", galleryInfo);
            //console.log('send dummy GA event for ' + galleryInfo.url);
          }
        });
    });
  }

  /**
   * Monitor element' stickiness based on its position in viewport
   */
  var StickyMonitor = (function () {
    var elementsInfo = [];
    var interval = 50;
    var defaultOptions = {
      mobile: true,
      tablet: true,
      desktop: true,
    };
    var stickyInfo = [];
    var freezeState = [];

    /**
     * Register element to monitor
     * Options consists of:
     * - mainEl : element to monitor
     * - headerEl  : part of mainEl which acts as header
     * - bodyEl : remaining part of mainEl not including header
     * - mobile : apply monitoring in mobile view
     * - tablet : apply monitoring in tablet view
     * - desktop: apply monitoring in desktop view
     */
    function registerElement(options) {
      var args = $.extend({}, defaultOptions, options);
      elementsInfo.push(args);
      freezeState.push(false);
      stickyInfo.push(false);
    }

    function adjustSticky() {
      if (elementsInfo.length === 0) return;

      var $stickyHeader = $(".sticky-header");
      var stickyHeight = $stickyHeader.height();
      var stickyPosition = $(".sticky-header").position();
      var minimumHeight =
        (stickyPosition.top > 0 ? stickyPosition.top : 0) + stickyHeight;
      var currentView = "desktop";

      if (Utils.isMobileView()) currentView = "mobile";
      else if (Utils.isTabletView()) currentView = "tablet";

      for (var i = 0; i < elementsInfo.length; i++) {
        if (freezeState[i]) continue;

        var mainEl = elementsInfo[i].mainEl;
        var headerEl = elementsInfo[i].headerEl;
        var bodyEl = elementsInfo[i].bodyEl;
        var isMonitor = elementsInfo[i][currentView];
        var isInView = false;
        var headerHeight = 0;
        var $insidePage = $(".inside-page");

        if (isMonitor) {
          var mainPos = mainEl.getBoundingClientRect();
          headerHeight = $(headerEl).height();
          isInView =
            mainPos.top <= minimumHeight &&
            mainPos.bottom > minimumHeight + headerHeight;
        }

        //hack: freeze change for 200 ms if sticky state change
        if (
          (!isInView && stickyInfo[i] === true) ||
          (isInView && stickyInfo[i] === false)
        ) {
          freezeState[i] = true;
          (function (idx) {
            setTimeout(function () {
              freezeState[idx] = false;
            }, 200);
          })(i);
        }

        stickyInfo[i] = isInView;

        if (isInView) {
          var parentWidth = $insidePage.width();
          $(bodyEl).css("margin-top", headerHeight);
          $(mainEl).addClass("sticky");
          $(headerEl).css("top", minimumHeight.toString() + "px");
          $(headerEl).css("width", parentWidth + "px");
        } else {
          $(bodyEl).css("margin-top", 0);
          $(headerEl).css("top", 0).width("auto");
          $(mainEl).removeClass("sticky");
        }
      }
    }

    function monitor() {
      var fn = Utils.throttle(adjustSticky, interval);
      $(window).scroll(fn);
      $(window).on("resize orientationchange pageresize", adjustSticky);
    }

    return {
      register: registerElement,
      monitor: monitor,
    };
  })();

  function handleVideoPlaylist() {
    //viewer properties:
    //- dependency (optional)
    //- pause
    //- play
    //- getElementToMonitor
    //- init
    //- view
    var player = null;

    var bcoveViewer = {
      dependency: {
        url: "https://players.brightcove.net/4802324438001/default_default/index.min.js",
        test: function () {
          return window.bc;
        },
      },
      pause: function () {
        if (player === null) return;
        player.pause();
      },
      play: function () {
        if (player === null) return;
        player.play();
      },
      getElementToMonitor: function () {
        return $(".video-playlist").find(".main-video")[0];
      },
      init: function (playerId) {
        player = window.bc(playerId);
        player.volume(0);
        player.muted(true);
        //player.play();
        addVideoPlayerEvents(player);
      },

      //options consists of:
      //- $playlist: playlist element
      //- $videoItem
      //- playlist
      //- videoIndex
      //- totalVideo
      view: function (options) {
        var $playlist = options.$playlist;
        var playlist = options.playlist;
        var videoId = options.$videoItem.data("video");
        var playerId =
          "playlist-" +
          options.videoIndex +
          "-" +
          (Math.floor(Math.random() * 10000) + 1);
        var accountId = $playlist.data("acc");
        var videoHtml =
          '<video id="' +
          playerId +
          '" data-account="' +
          accountId +
          '" data-player="default" data-embed="default" data-video-id="' +
          videoId +
          '"' +
          ' class="video-js" controls style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; width: 100%; height: 100%;"></video>';
        var $videoWrapper = $playlist.find(".main-video > .video");
        var $bcoveWrapper = $('<div class="bcove-wrapper"></div>');
        var $bcoveInner = $('<div class="bcove-inner"></div>');
        $bcoveWrapper.appendTo($videoWrapper);
        $bcoveInner.appendTo($bcoveWrapper);
        $(videoHtml).appendTo($bcoveInner);
        //Initialized player
        this.init(playerId);

        var index = (options.videoIndex + 1) % options.totalVideo;

        player.on("ended", function () {
          playlist.showVideo(index);
        });
      },
    };

    var ytViewer = {
      tryPlaying: false,
      dependency: {
        test: function () {
          return window.YT;
        },
        url: "https://www.youtube.com/iframe_api",
      },
      pause: function (event) {
        if (player === null || !player.pauseVideo) return;
        player.pauseVideo();
      },
      play: function (event) {
        if (player === null || !player.playVideo) {
          ytViewer.tryPlaying = true;
          return;
        }

        player.playVideo();
      },
      init: function (playerId, newIndex, playlist) {
        Utils.onYouTubeIframeAPIReady(function () {
          player = new YT.Player(playerId, {
            events: {
              onReady: function (event) {
                event.target.mute();
                if (ytViewer.tryPlaying) {
                  ytViewer.play();
                }
              },
              onStateChange: function (event) {
                if (event.data == 0) {
                  playlist.showVideo(newIndex);
                }
                if (player.uwHandleEvents) {
                  player.uwHandleEvents(event);
                }
              },
            },
          });
          addVideoPlayerEvents(player);
        });
      },
      getElementToMonitor: function () {
        return $(".video-playlist").find(".main-video")[0];
      },
      view: function (options) {
        var $playlist = options.$playlist;
        var playlist = options.playlist;
        var playerId =
          "playlist-" +
          options.videoIndex +
          "-" +
          (Math.floor(Math.random() * 10000) + 1);
        var videoId = options.$videoItem.data("video");
        var $videoWrapper = $playlist.find(".main-video > .video");
        var $ytWrapper = $('<div class="youtube-wrapper"></div>');
        $ytWrapper.appendTo($videoWrapper);
        var embedUrl =
          "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1";
        var $iframe = $(
          '<iframe id="' +
            playerId +
            '" src="' +
            embedUrl +
            '" frameborder="0" />'
        );
        $iframe.appendTo($ytWrapper);
        var newIndex = (options.videoIndex + 1) % options.totalVideo;

        ytViewer.init(playerId, newIndex, playlist);
      },
    };

    var othersViewer = {
      view: function (options) {
        var videoFallback = options.$videoItem.data("fallback");
        var $playlist = options.$playlist;
        var $videoWrapper = $playlist.find(".main-video > .video");
        var videoHtml = "<div class='others-video'>" + videoFallback + "</div>";
        $(videoHtml).appendTo($videoWrapper);
      },
    };

    var playerRegistry = {
      brightcove: bcoveViewer,
      youtube: ytViewer,
      others: othersViewer,
    };

    function setupPlaylist(el) {
      var $playlist = $(el);
      var $videoList = $playlist.find(".video-list");
      var $videoItems = $playlist.find(
        ".video-item:not(.video-item-watch-all)"
      );
      var $allItems = $playlist.find(".video-item");
      var $watchAllItem = $playlist.find(".video-item.video-item-watch-all");
      var $videoWrapper = $playlist.find(".main-video > .video");
      var scroll = null;
      var viewer = null;
      var observer = null;
      var threshold = 0.5; //0.99;

      var playlist = {
        adjustWidth: function () {
          var totalWidth = 0;
          $allItems.each(function (index, item) {
            totalWidth += $(item).outerWidth(true);
          });
          $videoList.css("width", "" + (totalWidth + 70) + "px");
        },
        adjustHeight: function () {
          var height = 0;

          $allItems.each(function (index, item) {
            var itemHeight = $(item).height();
            if (itemHeight > height) height = itemHeight;
          });

          $allItems.height(height);
          if ($watchAllItem.length > 0) $watchAllItem.height(height);
        },
        adjustScroll: function () {
          var listWrapperEl = $playlist.find(".video-list-wrapper")[0];

          if (scroll === null)
            scroll = new IScroll(listWrapperEl, {
              scrollX: true,
              bounce: true,
              scrollbars: true,
              interactiveScrollbars: true,
              scrollY: false,
              eventPassthrough: true,
              preventDefault: false,
            });
          else scroll.refresh();
        },
        adjustSize: function () {
          playlist.adjustWidth();
          playlist.adjustHeight();
          playlist.adjustScroll();
        },
        setHandlers: function () {
          $playlist.find(".stop-link").click(function (event) {
            event.preventDefault();
          });
          $(window).on("resize orientationchange pageresize", function () {
            playlist.adjustSize();
          });
          $videoItems.click(function () {
            var $item = $(this);
            playlist.showVideo($item.index());
          });
        },
        updateActiveItem: function ($activeItem, videoIndex) {
          var $oldActiveItem = $playlist.find(".video-item.active");

          if ($oldActiveItem.length != 0) {
            $oldActiveItem.find(".playing-wrapper").remove();
            $oldActiveItem.find(".active-overlay").remove();
            $oldActiveItem.removeClass("active");
          }

          var $imgWrapper = $activeItem.find(".img-wrapper");
          $(
            '<div class="playing-wrapper"><i class="fas fa-check-circle"></i></div>'
          ).appendTo($imgWrapper);
          $('<div class="active-overlay"></div>').appendTo($activeItem);
          $activeItem.addClass("active");

          var $mainTitle = $playlist.find(".main-video .title");
          var $mainDesc = $playlist.find(".main-video .desc");
          var $mainLink = $playlist.find(".main-video .read-on");
          var newUrl = $activeItem.find(".title").attr("href");
          var desc = $activeItem.find(".desc").html();
          $mainTitle
            .html($activeItem.find(".title").html())
            .attr("href", newUrl);
          $mainTitle.data("position", videoIndex + 1);
          $mainDesc.html(desc ? desc : "");
          $mainLink.attr("href", newUrl);
        },
        showVideo: function (videoIndex) {
          $videoWrapper.empty();
          var $videoItem = $($videoItems[videoIndex]);
          playlist.updateActiveItem($videoItem, videoIndex);
          var videoType = $videoItem.data("type") || "brightcove";
          if (playerRegistry[videoType]) {
            playerRegistry[videoType].view({
              $playlist: $playlist,
              $videoItem: $videoItem,
              playlist: playlist,
              videoIndex: videoIndex,
              totalVideo: $videoItems.length,
            });

            //This manage our element observer
            playlist.handleObserver(videoType);
          }
        },
        init: function () {
          if ($videoItems.length === 0) return;

          Utils.flagWidgetAsProcessed(el);
          playlist.adjustWidth();
          $playlist.addClass("initialized");
          playlist.adjustHeight();
          playlist.adjustScroll();
          playlist.setHandlers();

          //make element sticky on mobile if not in videos landing page or if doesn't have no-sticky class
          if (
            $playlist.find(
              ".playlist-header.center-header,.playlist-header.no-sticky"
            ).length === 0
          ) {
            StickyMonitor.register({
              mainEl: $playlist[0],
              headerEl: $playlist.find(".playlist-header")[0],
              bodyEl: $playlist.find(".main-video")[0],
              tablet: false,
              desktop: false,
            });
          }

          this.showVideo(0);
        },
        handleIntersection: function (entries, observer) {
          if (entries.length == 0) return;

          entries.forEach(function (entry, index) {
            if (entry.intersectionRatio < threshold) {
              viewer.pause();
            } else {
              viewer.play();
            }
          });
        },
        handleObserver: function (videoType) {
          viewer = playerRegistry[videoType];
          var stickyHeight = $(".sticky-header").height();
          observer = new IntersectionObserver(playlist.handleIntersection, {
            threshold: threshold,
            rootMargin: "-" + stickyHeight + "px 0px 0px 0px",
          });
          observer.observe(viewer.getElementToMonitor());
        },
      };

      playlist.init();
    }

    function initPlaylist() {
      var $playlists = $(".video-playlist");
      var scriptUrls = [];

      if ($playlists.length === 0) return;

      $(document).trigger("uw_video_playlist_viewer", playerRegistry);

      for (var key in playerRegistry) {
        if (playerRegistry[key].dependency) {
          var dep = playerRegistry[key].dependency;
          if (!dep.test()) {
            scriptUrls.push(dep.url);
          }
        }
      }

      function internalSetup() {
        $playlists.each(function (index, el) {
          if (Utils.isWidgetProcessed(el)) return;

          setupPlaylist(el);
        });
      }

      if (scriptUrls.length == 0) {
        internalSetup();
      } else {
        Utils.loadScripts({
          async: true,
          urls: scriptUrls,
          cb: function () {
            setTimeout(function () {
              internalSetup();
            }, 10);
          },
        });
      }
    }

    initPlaylist();
  }

  function handleFeaturedVideo() {
    //viewer properties:
    //- dependency (optional)
    //- pause
    //- play
    //- init
    //- getElementToMonitor
    var bcoveViewer = function ($section) {
      var $videoEl = $section.find("video");
      var player = null;

      return {
        dependency: {
          url: "https://players.brightcove.net/4802324438001/default_default/index.min.js",
          test: function () {
            return window.bc;
          },
        },
        pause: function () {
          if (player == null) return;
          player.pause();
        },
        play: function () {
          if (player == null) return;
          player.play();
        },
        init: function () {
          player = window.bc($videoEl[0]);
          player.volume(0);
          player.muted(true);
          addVideoPlayerEvents(player);
        },
        getElementToMonitor: function () {
          return $videoEl[0];
        },
      };
    };

    var ytViewer = function ($section) {
      var player = null;
      var $iframe = $section.find(".youtube-wrapper iframe");
      var tryPlaying = false;
      var viewer = {
        dependency: {
          url: "https://www.youtube.com/iframe_api",
          test: function () {
            return window.YT;
          },
          loadFunction: function (cb) {
            Utils.onYouTubeIframeAPIReady(cb);
          },
        },
        pause: function () {
          if (player == null || !player.pauseVideo) return;
          player.pauseVideo();
        },
        play: function () {
          if (player == null || !player.playVideo) {
            tryPlaying = true;
            return;
          }

          player.playVideo();
        },
        init: function () {
          player = new window.YT.Player($iframe.attr("id"), {
            events: {
              onReady: (evt) => {
                evt.target.mute();
                if (tryPlaying) {
                  viewer.play();
                }
              },
              onStateChange: function (event) {
                if (player.uwHandleEvents) {
                  player.uwHandleEvents(event);
                }
              },
            },
          });
          addVideoPlayerEvents(player);
        },
        getElementToMonitor: function () {
          return $iframe[0];
        },
      };

      return viewer;
    };

    var registry = {
      youtube: ytViewer,
      brightcove: bcoveViewer,
    };

    function setupWidget(el) {
      var $widget = $(el);
      var provider = $widget.data("video-type");
      if (!provider || !registry[provider]) return;
      var viewer = null;
      var observer = null;
      var threshold = 0.99;
      var viewer = registry[provider]($widget);
      if (!viewer) return;

      Utils.flagWidgetAsProcessed(el);

      var widget = {
        handleIntersection: function (entries, observer) {
          if (entries.length == 0) return;

          entries.forEach(function (entry, index) {
            if (entry.intersectionRatio < threshold) {
              viewer.pause();
            } else {
              viewer.play();
            }
          });
        },
        setupPlayer: function () {
          viewer.init();
          var stickyHeight = $(".sticky-header").height();
          observer = new IntersectionObserver(widget.handleIntersection, {
            threshold: threshold,
            rootMargin: "-" + stickyHeight + "px 0px 0px 0px",
          });
          observer.observe(viewer.getElementToMonitor());
        },
        init: function () {
          if (!viewer.dependency || viewer.dependency.test()) {
            widget.setupPlayer();
            return;
          }

          Utils.loadScript({
            async: true,
            url: viewer.dependency.url,
            cb: function () {
              if (viewer.dependency.loadFunction) {
                viewer.dependency.loadFunction(function () {
                  widget.setupPlayer();
                });
              } else widget.setupPlayer();
            },
          });
        },
      };

      widget.init();
    }

    function initFeaturedVideo() {
      var $fvideo = $(".featured-video");

      if ($fvideo.length === 0) return;

      $(document).trigger("uw_featured_video_viewer", registry);

      $fvideo.each(function (_, el) {
        if (Utils.isWidgetProcessed(el)) return;

        setupWidget(el);
      });
    }

    initFeaturedVideo();
  }

  function handleLatestVideos() {
    function setupLatestVideos() {
      var $widget = $(this);

      if ($widget.length === 0) return;

      Utils.flagWidgetAsProcessed(this);
      var $filterWrapper = $widget.find(".video-filter-wrapper");
      var $filters = $widget.find(".video-cat-filter");
      var $list = $widget.find(".video-list");
      var $loadMoreBtn = $widget.find(".load-more");

      var currentCat =
        $filters.length == 0 ? "all" : $filters.find("li.active").data("cat");
      var offset = parseInt($widget.data("initial-offset"), 10);
      var totalInitial = parseInt($widget.data("total-init"), 10);
      var totalDynamic = parseInt($widget.data("total-dynamic"), 10);
      var sponsoredLimit = parseInt($widget.data("sponsored-limit"), 10);
      var idsToExcludeStr = $widget.data("ex-ids");
      var itemInterval = null;
      var key = 1;
      var scroll = null;
      var itemTemplate = window.tmpl("tmpl-latest-video-item");

      var idsToExclude = [];
      if (idsToExcludeStr)
        idsToExclude = $.map(idsToExcludeStr.toString().split(","), Number);

      var ajaxInfo = {
        url: "/wp-admin/admin-ajax.php",
        action: "latest_videos",
      };

      $(document).trigger("uw_latest_videos_ajax_info", ajaxInfo);

      function createItem(video) {
        var title = Utils.escapeHtml(video.title);
        var sponsoredClass = video.sponsored ? "sponsored-item" : "";
        var model = $.extend({}, video, {
          sponsoredClass: sponsoredClass,
          escapedTitle: title,
        });
        var html = itemTemplate(model);
        var $item = $(html).appendTo($list);
        return $item;
      }

      function loadVideos(options) {
        key = Math.floor(Math.random() * 1000) + 1;

        var utLoadingTargetVideoList = ".videos-inner .video-list";
        var utLoadingTargetEl = ".videos-inner .buttons button";
        var utLoadingTargetElRemove = ".videos-inner .buttons";
        var args = {
          action: ajaxInfo.action,
          key: key,
        };

        if (idsToExclude) args.ids_to_exclude = idsToExclude;

        if (options.sponsoredLimit)
          args.sponsored_limit = options.sponsoredLimit;

        if (options.limit) args.limit = options.limit;

        if (options.offset) {
          args.offset = options.offset;
          offset = args.offset;
        } else {
          offset = 0;
        }

        if (options.cat && options.cat !== "all") args.cat = options.cat;

        currentCat = args.cat;
        $loadMoreBtn.css("visibility", "hidden");

        //Load by clicking "load more"
        if (offset > 0) {
          utLoadingIndicator(utLoadingTargetEl, "", "insertBefore");
        }

        //Load by clicking the "category tab"
        if (offset <= 0) {
          utLoadingIndicator(utLoadingTargetVideoList, "", "appentTo");
        }

        $.post(ajaxInfo.url, args)
          .done(function (result) {
            if (result.key != key) return;

            offset = result.next_offset;
            idsToExclude = result.ids_to_exclude;
            var newItems = [];

            if (result.items) {
              $.each(result.items, function (index, item) {
                newItems.push(createItem(item));
              });

              var intervalIndex = 0;
              var totalItems = newItems.length;

              itemInterval = setInterval(function () {
                newItems[intervalIndex].css("opacity", 1);
                intervalIndex++;
                if (intervalIndex >= totalItems) clearInterval(itemInterval);
              }, 100);
            }

            if (result.has_more) $loadMoreBtn.css("visibility", "visible");

            utLoadingIndicator("", utLoadingTargetElRemove, "remove");
            utLoadingIndicator("", utLoadingTargetVideoList, "remove");
          })
          .fail(function () {
            $loadMoreBtn.css("visibility", "visible");

            utLoadingIndicator("", utLoadingTargetElRemove, "remove");
            utLoadingIndicator("", utLoadingTargetVideoList, "remove");
          });
      }

      $filters.find("li[data-cat]").click(function (event) {
        var $el = $(this);

        if ($el.hasClass("active")) return;

        var cat = $el.data("cat");
        $filters.find("li.prev-active").removeClass("prev-active");
        $filters
          .find("li.active")
          .removeClass("active")
          .addClass("prev-active");
        $el.addClass("active");

        clearInterval(itemInterval);
        $list.empty();
        idsToExclude = [];
        loadVideos({
          cat: cat,
          offset: 0,
          limit: totalInitial,
          sponsoredLimit: sponsoredLimit,
        });

        //scroll to widget's top
        var $stickyHeader = $(".sticky-header");
        var stickyHeight = $stickyHeader.height();
        var stickyPosition = $(".sticky-header").position();
        var minimumHeight =
          (stickyPosition.top > 0 ? stickyPosition.top : 0) + stickyHeight;
        var top = $widget.offset().top - minimumHeight;
        $(window).scrollTop(top);
      });

      $loadMoreBtn.click(function () {
        clearInterval(itemInterval);
        loadVideos({ cat: currentCat, offset: offset, limit: totalDynamic });
      });

      function calculateNavWidth() {
        var width = 0;
        $filters.find("li").each(function (index, element) {
          width += $(element).outerWidth(true);
        });

        if (Utils.isMobileView()) {
          width += 30;
        }
        $filters.width(width);
      }

      StickyMonitor.register({
        mainEl: $widget[0],
        headerEl: $widget.find(".videos-header")[0],
        bodyEl: $list[0],
      });

      calculateNavWidth();

      if ($filters.length > 0) {
        scroll = new IScroll($filterWrapper[0], {
          scrollX: true,
          scrollY: false,
          eventPassthrough: true,
          preventDefault: false,
        });

        $(window).on("resize orientationchange pageresize", function () {
          if (scroll != null) scroll.refresh();
        });
      }
    }

    $(".latest-videos").each(function (index, el) {
      if (Utils.isWidgetProcessed(el)) return;

      setupLatestVideos.call(el);
    });
  }

  function handleGalleryPost() {
    $(".single-gallery-purse").each(function (index, el) {
      if (Utils.isWidgetProcessed(el)) return;

      Utils.flagWidgetAsProcessed(el);
      var adCounter = 0;
      var galleryId = $(el).data("gallery-id");
      var isSponsored = $(el).data("sponsored") == "1";
      var isGridViewDisabled = $(el).data("grid-disabled") == "1";
      var isSlideshowDisabled = $(el).data("slideshow-disabled") == "1";
      var oAlm = $(el).closest(".alm-single-post");

      function getAdSuffix() {
        //if (loadMoreCounter == 0 && adCounter == 0)
        //    return '';

        //return '-' + galleryId + '-' + adCounter;

        s = "";
        if (oAlm.length > 0 && ~~oAlm.data("page") > 0) {
          s += "_" + galleryId;
        }
        s += "-" + adCounter;
        return s;
      }

      $(el)
        .on("containerRenderEnded", function (event, info) {
          var viewName = info.viewName;
          if (typeof window.uwGenerateAds != "function") return;

          var suffix = getAdSuffix();

          if (["fixed-slider", "list"].indexOf(viewName) > -1) {
            uwMidAdUnits = {
              midarticlespecial: "dfp-ad-midarticlespecial" + suffix,
              midarticlespecial2: "dfp-ad-midarticlespecial2" + suffix,
            };

            if (viewName === "fixed-slider") {
              uwSliderShowPrev = true;
            }

            if (
              viewName === "fixed-slider" ||
              !!uwIsInitLoad ||
              !!uwSliderShowPrev
            ) {
              window.uwGenerateAds(uwMidAdUnits, "ad_gallery", viewName);
            }

            if (viewName !== "fixed-slider") {
              uwSliderShowPrev = false;
            }
          }

          uwActivePostID = galleryId;
          uwIsInitLoad = false;
          //This will monitor our ad units visibility in viewport
          utMonitoryAdsVisibility();
        })
        .on("galleryIndexChange", function (event, galleryInfo) {
          if (galleryInfo != null) {
            galleryInfo.target = this;
            $(document).trigger("uw_gallery_update", galleryInfo);
            //console.log('send dummy GA pageview for ' + galleryInfo.url);
          }
        })
        .on("beforeGalleryViewChange", function () {
          adCounter++;
        })
        .on("slideshowButtonClick", function (event, args) {
          $(document).trigger("uw_gallery_show_slide", args);
        })
        .on("gridButtonClick", function (event, args) {
          $(document).trigger("uw_gallery_show_grid", args);
        });

      var purseOptions = {
        initialView: "list",
        urlBehavior: {
          isUrlAffected: true,
          isInternalOnly: true,
          slideParamName: "slide",
        },
        shareBehavior: {
          isIconSVG: true,
        },
        cb: {
          getExtraTtem: function (args) {
            if (isSponsored) return null;

            var suffix = getAdSuffix();
            if (args.index == 2) {
              return {
                type: "dfp",
                element: $(
                  '<div class="mpu-wrapper"><div id="dfp-ad-midarticlespecial' +
                    suffix +
                    '" class="gpt-gallery-ad gpt-gallery-ad-outstream-1"></div></div>'
                )[0],
              };
            } else if (args.index == 5) {
              return {
                type: "dfp",
                element: $(
                  '<div class="mpu-wrapper"><div id="dfp-ad-midarticlespecial2' +
                    suffix +
                    '" class="gpt-gallery-ad gpt-gallery-ad-outstream-2"></div></div>'
                )[0],
              };
            }
            return null;
          },
        },
      };

      if (isGridViewDisabled) purseOptions.gridEnabled = false;

      if (isSlideshowDisabled) purseOptions.slideshowEnabled = false;

      $(el).galleryPurse(purseOptions);
    });
  }

  function handleNewsletterSubscribe() {
    function setupWidget() {
      var $root = $(this);
      var $subscribeForm = $root.find(".newsletter-subscribe-form");

      if ($subscribeForm.length === 0) return;

      Utils.flagWidgetAsProcessed(this);

      $subscribeForm.submit(function (event) {
        event.preventDefault();
        var $email = $subscribeForm.find(".email");
        var $dataConsent = $subscribeForm.find(".data-consent-newsletter");
        var $button = $subscribeForm.find("button");
        var $result = $root.find(".result");
        var $dataConsentVal = $dataConsent.is(":checked") === true ? 1 : 0;

        function setFormState(isDisabled) {
          $email.prop("disabled", isDisabled);
          $button.prop("disabled", isDisabled);
          $dataConsent.prop("disabled", isDisabled);
        }

        function validateEmail() {
          var value = $email.val().trim();

          if (!value) {
            $result
              .html("Email is required")
              .addClass("error")
              .removeClass("success");
            return false;
          }

          var re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(value)) {
            $result
              .html("Email is not valid")
              .addClass("error")
              .removeClass("success");
            return false;
          }

          return true;
        }

        function validateDataConsent() {
          var $attrDataIsRequired = $dataConsent.attr("data-is-required");

          if (
            typeof $attrDataIsRequired !== "undefined" &&
            $attrDataIsRequired !== false &&
            $attrDataIsRequired === "true"
          ) {
            if ($dataConsent.is(":checked") === false) {
              var $attrDataConsent = $dataConsent.attr("data-error-message");

              var $errorMessage = "Please check the box if you agree";

              if (
                typeof $attrDataConsent !== "undefined" &&
                $attrDataConsent !== false
              ) {
                $errorMessage = $dataConsent.data("errorMessage");
              }

              $result
                .html($errorMessage)
                .addClass("error")
                .removeClass("success");
              return false;
            }
          }

          return true;
        }

        if (!validateEmail()) return;

        if (!validateDataConsent()) {
          return false;
        }

        setFormState(true);

        $.ajax({
          url: "/wp-admin/admin-ajax.php",
          type: "POST",
          data: {
            action: "handle_newsletter_subscribe",
            email: $email.val(),
            dataConsent: $dataConsentVal,
            ajaxNonce: bootstrap_blog_ajax_object.ajax_nonce,
          },
          success: function (response) {
            if (response.success) {
              $email.val("");
              $dataConsent.prop("checked", false);
              $result.addClass("success").removeClass("error");

              if (typeof ut_site_info !== "undefined") {
                window.postMessage("newsletter_success", ut_site_info.url);
              }
            } else {
              $result.removeClass("success").addClass("error");
            }

            setFormState(false);
            $result.html(response.message);
          },
          error: function (xhr, status, err) {
            console.log("newsletter subscribe", status);
            setFormState(false);
          },
        });

        return false;
      });
    }

    $(".newsletter-subscribe").each(function (_, el) {
      if (Utils.isWidgetProcessed(el)) return;

      setupWidget.call(el);
    });
  }

  function handleVideoSeriesList() {
    var $seriesList = $(".video-series-list");

    if ($seriesList.length === 0) return;

    var defaultItemWidth = 280; //as wireframe
    var defaultItemMargin = 16;

    function setupListWidget() {
      var $root = $(this);

      $root.find(".series").each(function (index, seriesEl) {
        var $widget = $(seriesEl);

        Utils.createScrollableArea({
          rootElement: seriesEl,
          wrapperSelector: ".items-wrapper",
          itemsSelector: ".items",
          itemSelector: ".item",
          prevElement: ".prev",
          nextElement: ".next",
          cb: {
            adjustArea: function () {
              var width = $widget.width();

              if (width === 0) return;

              if (Utils.isMobileView()) {
                var newItemWidth = (width - defaultItemMargin) / 1.5;

                if (newItemWidth > defaultItemWidth)
                  newItemWidth = defaultItemWidth;

                $widget.find(".item").width(newItemWidth);
              } else {
                $widget.find(".item").width(defaultItemWidth);
              }
            },
          },
        });
      });

      Utils.flagWidgetAsProcessed(this);
    }

    $seriesList.each(function (_, el) {
      if (Utils.isWidgetProcessed(el)) return;

      setupListWidget.call(el);
    });
  }

  function handleLatestInSeries() {
    var $latest = $(".latest-in-series");

    if ($latest.length === 0) return;

    var defaultItemWidth = 280; //as wireframe
    var defaultItemMargin = 16;

    $latest.each(function (_, el) {
      if (Utils.isWidgetProcessed(el)) return;

      var $widget = $(el);

      Utils.createScrollableArea({
        rootElement: el,
        wrapperSelector: ".items-wrapper",
        itemsSelector: ".items",
        itemSelector: ".item",
        prevElement: ".prev",
        nextElement: ".next",
        cb: {
          adjustArea: function () {
            var width = $widget.width();

            if (width === 0) return;

            if (Utils.isMobileView()) {
              var newItemWidth = (width - defaultItemMargin) / 1.5;

              if (newItemWidth > defaultItemWidth)
                newItemWidth = defaultItemWidth;

              $widget.find(".item").width(newItemWidth);
            } else {
              $widget.find(".item").width(defaultItemWidth);
            }
          },
        },
      });

      Utils.flagWidgetAsProcessed(el);
    });
  }

  function handleSignatureHighlights() {
    var $widgets = $(".signature-highlights");

    if ($widgets.length === 0) return;

    $widgets.each(function (_, el) {
      if (Utils.isWidgetProcessed(el)) return;

      Utils.flagWidgetAsProcessed(el);

      var $root = $(el);
      var $slider = $root.find(".sh-slider");
      var $totalSlides = $slider.find(".sh-slide").length;
      var $currentSlideInfo = $root.find(".current-slide-number");

      function updateSlideInfo(currentIndex) {
        $currentSlideInfo.html(
          "<span>" + currentIndex + "</span> / " + $totalSlides
        );
      }

      $slider.on("afterChange", function (event, slick, currentChange) {
        updateSlideInfo(currentChange + 1);
      });

      $slider.slick({
        slidesToShow: 1,
        centerMode: false,
        variableWidth: false,
        prevArrow: $root.find(".controls .prev"),
        nextArrow: $root.find(".controls .next"),
        responsive: [
          {
            breakpoint: 990,
            settings: {
              centerMode: true,
              variableWidth: true,
            },
          },
        ],
      });

      updateSlideInfo(1);
    });
  }

  function handleContentHub() {
    var $widget = $(".contenthub-widget");

    if ($widget.length === 0) return;

    var defaultItemWidth = 280; //as wireframe
    var defaultItemMargin = 16;

    $widget.each(function (_, el) {
      if (Utils.isWidgetProcessed(el)) return;

      Utils.flagWidgetAsProcessed(el);

      Utils.createScrollableArea({
        rootElement: el,
        wrapperSelector: ".scroll-bar-slider",
        itemsSelector: ".contenthub-slider",
        itemSelector: ".slick-slider",
        prevElement: ".prev",
        nextElement: ".next",
        cb: {
          adjustArea: function () {
            var width = $widget.width();

            if (width === 0) return;

            if (Utils.isMobileView()) {
              var newItemWidth = (width - defaultItemMargin) / 1.5;

              if (newItemWidth > defaultItemWidth)
                newItemWidth = defaultItemWidth;

              $widget.find(".slick-slider").width(newItemWidth);
            } else {
              $widget.find(".slick-slider").width(defaultItemWidth);
            }
          },
        },
      });
    });
  }

  function handleTrendingSlider(sTarget) {
    var oTarget = $("#" + sTarget);
    if (oTarget.length < 1) oTarget = null;
    var $widget = $(".home-trending", oTarget);

    if ($widget.length === 0) return;

    var defaultItemWidth = 280; //as wireframe
    var defaultItemMargin = 16;

    $widget.each(function (_, el) {
      if (Utils.isWidgetProcessed(el)) return;

      Utils.flagWidgetAsProcessed(el);

      Utils.createScrollableArea({
        rootElement: el,
        wrapperSelector: ".scroll-bar-slider",
        itemsSelector: ".trending-slider",
        itemSelector: ".slick-slider",
        prevElement: ".prev",
        nextElement: ".next",
        cb: {
          adjustArea: function () {
            var width = $widget.width();

            if (width === 0) return;

            if (Utils.isMobileView()) {
              var newItemWidth = (width - defaultItemMargin) / 1.5;

              if (newItemWidth > defaultItemWidth)
                newItemWidth = defaultItemWidth;

              $widget.find(".slick-slider").width(newItemWidth);
            } else {
              $widget.find(".slick-slider").width(defaultItemWidth);
            }
          },
        },
      });
    });
  }

  function handleTrendingPostSlider(sTarget) {
    var oTarget = $("#" + sTarget);
    if (oTarget.length < 1) oTarget = null;
    var $widget = $(".post-trending", oTarget);

    if ($widget.length === 0) return;

    var defaultItemWidth = 280; //as wireframe
    var defaultItemMargin = 16;

    $widget.each(function (_, el) {
      if (Utils.isWidgetProcessed(el)) return;

      Utils.flagWidgetAsProcessed(el);

      Utils.createScrollableArea({
        rootElement: el,
        wrapperSelector: ".scroll-bar-slider",
        itemsSelector: ".trending-slider",
        itemSelector: ".slick-slider",
        prevElement: ".prev",
        nextElement: ".next",
        cb: {
          adjustArea: function () {
            var width = $widget.width();

            if (width === 0) return;

            if (Utils.isMobileView()) {
              var newItemWidth = (width - defaultItemMargin) / 1.5;

              if (newItemWidth > defaultItemWidth)
                newItemWidth = defaultItemWidth;

              $widget.find(".slick-slider").width(newItemWidth);
            } else {
              $widget.find(".slick-slider").width(defaultItemWidth);
            }
          },
        },
      });
    });
  }

  function handleCategoryTopics() {
    var $topicsWrapper = $(".category .topics-wrapper");

    if ($topicsWrapper.length == 0) return;

    var $topics = $topicsWrapper.find(".topics-slider");
    var scroll = null;
    var $topicItems = $topicsWrapper.find(".topic-item");

    function adjustWidth() {
      var totalWidth = 0;
      $topicItems.each(function (index, item) {
        totalWidth += jQuery(item).outerWidth(true);
      });
      $topics.css("width", "" + (totalWidth + 30) + "px");
    }

    function createScrollableTopics() {
      if (!Utils.isMobileView()) {
        if (scroll == null) return;

        scroll.destroy();
        $(scroll.scroller).attr("style", "");
        scroll = null;
      } else {
        adjustWidth();
        if (scroll != null) {
          scroll.refresh();
        } else {
          $topicsWrapper.css("visibility", "visible");
          scroll = new IScroll($topicsWrapper[0], {
            scrollX: true,
            scrollY: false,
            eventPassthrough: true,
            preventDefault: false,
          });
        }
      }
    }

    $(window).on("resize orientationchange pageresize", createScrollableTopics);

    createScrollableTopics();
  }

  function handleSearchBox() {
    // search box
    jQuery(document).ready(function ($) {
      // focus on textbox when search icon is clicked
      $("#isearch").click(function () {
        $("#search-text").focus();
      });

      // clear textbox when X icon is clicked
      $("#itimes").click(function () {
        $("#search-text").val("");
        $(this).hide();
      });

      // hide X icon when textbox is empty
      $("#search-text").keyup(function () {
        if ($(this).val() == "") {
          $("#itimes").hide();
        } else {
          $("#itimes").show();
        }
      });

      if ($("#search-text").val() == "") {
        $("#itimes").hide();
      }
    });
  }

  function handleProgressIndicator() {
    var $bar = $("#progressbar");

    if (!$("body").hasClass("single") || $bar.length == 0) return;

    function updateProgress() {
      var currentTop = $(window).scrollTop();
      var scrollPercent = 0;
      if (window.history.state && window.history.state.postID) {
        var currentPostId = window.history.state.postID;
        var $currentPost = $(".alm-single-post.post-" + currentPostId);
        var currentHeight = currentTop - $currentPost.offset().top;
        var totalHeight = $currentPost.height() - $(window).height();
        if ($currentPost.is(":last-child")) {
          totalHeight -= $(".alm-btn-wrap").height();
        }

        scrollPercent = Math.round((currentHeight / totalHeight) * 100);
      } else {
        var docHeight = $(document).innerHeight() - $(window).height();
        scrollPercent = Math.round((currentTop / docHeight) * 100);
      }

      $("#progressbar").attr("aria-valuenow", scrollPercent);
      $("#progressbar").css("width", scrollPercent + "%");
    }

    var scrollFn = Utils.throttle(updateProgress, 10);
    $(window).scroll(scrollFn);

    $(document).on("uw_alm_complete", updateProgress);
  }

  function handleVideoArticle() {
    if (typeof bc == "undefined") return;

    var $video = $(".video-article .post-top .bcove-inner video");

    if ($("body").hasClass("single-content_hub") === true) {
      $video = $(".featured-video-bg .bcove-inner video");
    }

    if ($video.length == 0) return;

    var player = bc($video[0]);
    addVideoPlayerEvents(player);
    player.muted(true);
    player.play();
  }

  var YTVideoArticle = (function () {
    var players = {};

    function updatePlayerStates(postDiv) {
      var $curPost = postDiv != null ? $(postDiv) : $(".alm-single-post:first");
      var $curFrame = null;
      var curFrameId = null;
      var player = null;

      if ($curPost.length > 0) {
        $curFrame = $curPost.find(".post-top .youtube-wrapper iframe");
      }

      if ($curFrame != null && $curFrame.length > 0) {
        curFrameId = $curFrame.attr("id");
      }

      for (var playerId in players) {
        if (playerId != curFrameId) players[playerId].pauseVideo();
      }

      if (curFrameId != null) {
        if (!players.hasOwnProperty(curFrameId)) {
          player = new YT.Player(curFrameId, {
            events: {
              onReady: function (evt) {
                evt.target.mute();
                evt.target.playVideo();
              },
              onStateChange: function (event) {
                if (player.uwHandleEvents) {
                  player.uwHandleEvents(event);
                }
              },
            },
          });
          addVideoPlayerEvents(player);
          players[curFrameId] = player;
        } else {
          player = players[curFrameId];
          player.playVideo();
        }
      }
    }

    function handle(postDiv) {
      if ($("body.single-video").length == 0) return;

      if (typeof YT === "undefined") {
        var ytArgs = {
          url: "https://www.youtube.com/iframe_api",
        };

        ytArgs.cb = function () {
          Utils.onYouTubeIframeAPIReady(function () {
            updatePlayerStates(postDiv);
          });
        };

        Utils.loadScript(ytArgs);
      } else updatePlayerStates(postDiv);
    }

    return {
      handle: handle,
    };
  })();

  function addYoutubePlayerEvents(oPlayer) {
    oPlayer.uwInterval = null;

    function getVideoInfo(status, progress) {
      var videoData = oPlayer.getVideoData();
      var videoUrl = oPlayer.getVideoUrl();
      var videoDuration = oPlayer.getDuration();

      var videoInfo = {
        videostatus: status,
        videoduration: progress,
        element: oPlayer.getIframe(),
      };

      if (videoData) {
        if (typeof videoData.title == "string")
          videoInfo.video_title = videoData.title;
        if (typeof videoData.video_id == "string")
          videoData.video_id = videoData.video_id;
      }

      if (videoUrl) videoInfo.video_source = videoUrl;

      if (videoDuration) videoInfo.video_duration = videoDuration;

      return videoInfo;
    }

    oPlayer.uwHandleEvents = function (event) {
      switch (event.data) {
        case YT.PlayerState.ENDED:
          var videoInfo = getVideoInfo("Complete", 100);
          $(document).trigger("uw_video_update", videoInfo);
          if (oPlayer.uwInterval) {
            clearInterval(oPlayer.uwInterval);
            oPlayer.uwInterval = null;
            oPlayer.uwCurrentPercent = 0;
          }
          break;
        case YT.PlayerState.PLAYING:
          if (!oPlayer.uwStarted) {
            oPlayer.uwStarted = true;
            var videoInfo = getVideoInfo("Start", 0);
            $(document).trigger("uw_video_update", videoInfo);
          }

          if (!oPlayer.uwInterval) {
            oPlayer.uwInterval = setInterval(oPlayer.uwHandleInterval, 1000);
          }
          break;
      }
    };

    oPlayer.uwHandleInterval = function () {
      if (typeof oPlayer.uwCurrentPercent == "undefined") {
        oPlayer.uwCurrentPercent = 0;
      }
      var currentPercent = oPlayer.uwCurrentPercent;
      var percent = Math.round(
        (oPlayer.getCurrentTime() * 100) / oPlayer.getDuration()
      );
      var triggerevent = false;
      switch (currentPercent) {
        case 0:
          if (percent >= 25) {
            oPlayer.uwCurrentPercent = 25;
            triggerevent = true;
          }
          break;
        case 25:
          if (percent >= 50) {
            oPlayer.uwCurrentPercent = 50;
            triggerevent = true;
          }
          break;
        case 50:
          if (percent >= 75) {
            oPlayer.uwCurrentPercent = 75;
            triggerevent = true;
          }
          break;
      }
      if (triggerevent) {
        var videoInfo = getVideoInfo("InProgress", oPlayer.uwCurrentPercent);
        $(document).trigger("uw_video_update", videoInfo);
      }
    };
  }

  function addVideoPlayerEvents(oPlayer) {
    //["loadstart","suspend","abort","error","emptied","stalled","loadedmetadata","loadeddata","canplay","canplaythrough","playing","waiting","seeking","seeked","ended","durationchange","timeupdate","progress","play","pause","ratechange","resize","volumechange"];
    if (typeof oPlayer == "object" && !("one" in oPlayer)) {
      addYoutubePlayerEvents(oPlayer);
      return;
    }

    function getBrightcoveVideoInfo(status, percent) {
      var videoInfo = {
        videostatus: status,
        videoduration: percent,
      };
      if (oPlayer.el_) videoInfo.element = $(oPlayer.el_)[0];

      if (oPlayer.mediainfo) {
        var mediaInfo = oPlayer.mediainfo;
        if (typeof mediaInfo.name == "string")
          videoInfo.video_title = mediaInfo.name;
        if (typeof mediaInfo.account_id == "string")
          videoInfo.video_account_id = mediaInfo.account_id;
        if (typeof mediaInfo.id == "string") videoInfo.video_id = mediaInfo.id;
        if ("tags" in mediaInfo && Array.isArray(mediaInfo.tags))
          videoInfo.video_tags = mediaInfo.tags.join(",");
        if ("duration" in mediaInfo && ~~mediaInfo.duration > 0)
          videoInfo.video_duration = mediaInfo.duration;
        if (typeof mediaInfo.custom_fields == "object") {
          if (typeof mediaInfo.custom_fields.category == "string")
            videoInfo.video_category = mediaInfo.custom_fields.category;
          if (typeof mediaInfo.custom_fields.source == "string")
            videoInfo.video_source = mediaInfo.custom_fields.source;
          if (typeof mediaInfo.custom_fields.language == "string")
            videoInfo.video_language = mediaInfo.custom_fields.language;
        }
        if (typeof mediaInfo.published_at == "string")
          videoInfo.video_published_date = mediaInfo.published_at.substr(0, 10);
      }

      return videoInfo;
    }

    oPlayer.currentPercent = 0;
    oPlayer.one("play", function (e) {
      var videoInfo = getBrightcoveVideoInfo("Start", 0);
      $(document).trigger("uw_video_update", videoInfo);
    });
    oPlayer.one("ended", function (e) {
      var videoInfo = getBrightcoveVideoInfo("Complete", 100);
      $(document).trigger("uw_video_update", videoInfo);
    });
    oPlayer.on("timeupdate", function (e) {
      var oPlayer = this;
      var current = this.currentTime();
      var duration = this.mediainfo.duration;
      var percent = Math.round((current / duration) * 100);
      if (!("currentPercent" in this)) this.currentPercent = 0;
      var triggerevent = false;
      switch (this.currentPercent) {
        case 0:
          if (percent >= 25) {
            this.currentPercent = 25;
            triggerevent = true;
          }
          break;
        case 25:
          if (percent >= 50) {
            this.currentPercent = 50;
            triggerevent = true;
          }
          break;
        case 50:
          if (percent >= 75) {
            this.currentPercent = 75;
            triggerevent = true;
          }
          break;
      }
      if (triggerevent) {
        var videoInfo = getBrightcoveVideoInfo(
          "InProgress",
          oPlayer.currentPercent
        );
        $(document).trigger("uw_video_update", videoInfo);
      }
      //console.log('brightcove timeupdateprogress', current, duration, percent, this.currentPercent);
    });
  }

  function trackPageResize() {
    var curWidth = 0;
    var $container = $(".inside-page");

    if ($container.length == 0) return;

    new ResizeSensor($container, function () {
      var isNew = curWidth === 0;
      var newWidth = $container.width();

      if (curWidth !== newWidth) {
        curWidth = newWidth;

        if (!isNew) {
          $(window).triggerHandler("pageresize", { width: curWidth });
        }
      }
    });
  }

  // function setupCookieNotice(){
  //     var cookieNoticeHtml = '<div id="cookie-notice">'+
  //     '<div class="cookie-notice-container"><span id="cn-notice-text">This site uses cookies to help us serve you better. By continuing to explore our site, you accept our <a href="https://sph.com.sg/legal/cookie-policy/" target="sph_policy">use of cookies</a>.</span><a href="#" id="cn-accept-cookie" data-cookie-set="accept" class="cn-set-cookie cn-button sph_cookie_button">I Accept</a></div>'+
  //     '</div>';

  //     $(cookieNoticeHtml).appendTo('body');

  //     var o = document.getElementById('cookie-notice');
  //     if (!o) return;
  //     function getcookie() {
  //         var cn = 'cookie_notice_accepted';
  //         var n = cn + '=';
  //         var ca = document.cookie.split(';');
  //         for (var i = 0; i < ca.length; i++) {
  //             var c = ca[i];
  //             while (c.charAt(0) == ' ') c = c.substring(1);
  //             if (c.indexOf(n) == 0) return c.substring(n.length, c.length);
  //         }
  //         return '';
  //     }
  //     var cv = getcookie();
  //     if (cv === 'true') {
  //         o.className = 'accepted';
  //         o.style.display = 'none';
  //         return;
  //     }
  //     var oAccept = document.getElementById('cn-accept-cookie');
  //     oAccept.addEventListener('click', function (e) {
  //         e.preventDefault();
  //         var o = document.getElementById('cookie-notice');
  //         if (!o) return;
  //         function setcookie() {
  //             var cn = 'cookie_notice_accepted', cv = 'true', n = 6000 * 24 * 60 * 60 * 1000;
  //             var d = new Date();
  //             d.setTime(d.getTime() + (n));
  //             var expires = "expires=" + d.toUTCString();
  //             document.cookie = cn + "=" + cv + ";" + expires + ";path=/";
  //         }
  //         setcookie();
  //         o.className = 'accepted';
  //         o.style.display = 'none';
  //     });
  // }

  handleFeaturedVideo();
  handleGalleryPost();
  handleEmbeddedGallery();
  handleVideoPlaylist();
  handleLatestVideos();
  handleNewsletterSubscribe();
  handleVideoSeriesList();
  handleLatestInSeries();
  handleSignatureHighlights();
  handleVideoArticle();
  YTVideoArticle.handle();
  handleContentHub();
  handleTrendingSlider();
  handleTrendingPostSlider();
  handleCategoryTopics();
  handleProgressIndicator();
  trackPageResize();
  StickyMonitor.monitor();
  //setupCookieNotice();

  handleSearchBox();

  var handleGPTAds = function (n) {
    n = ~~n;
    var o = document.getElementById("alm-single-post-" + n);
    if (!o) return;
    var a = o.getElementsByClassName("gpt-ad");
    for (var i = 0; i < a.length; i++) {
      a[i].id += "_" + n;
    }
    var oNoLayout = document.getElementById("gpt-no-layout");
    if (!!oNoLayout) {
      var oNewNoLayout = document.createElement("div");
      oNewNoLayout.id = "gpt-no-layout_" + n;

      var oSkinning = document.createElement("div");
      oSkinning.id = "dfp-ad-skinning_" + n;
      oSkinning.className = "gpt-ad gpt-ad-skinning";
      oNewNoLayout.appendChild(oSkinning);

      oNoLayout.insertAdjacentElement("afterend", oNewNoLayout);
    }
  };

  var handleGPTAdsChange = function (oPostDiv, uwCurrentPostID) {
    var aSlots = {
      lb1: "gpt-ad-lb-1",
      skinning: "gpt-ad-skinning",
      midarticlespecial: "gpt-ad-outstream-1",
      midarticlespecial2: "gpt-ad-outstream-2",
      imu1: "gpt-ad-mpu-1",
      imu2: "gpt-ad-mpu-2",
      gallery: {
        midarticlespecial: "gpt-gallery-ad-outstream-1",
        midarticlespecial2: "gpt-gallery-ad-outstream-2",
      },
    };
    var refreshSlots = {};

    if (!oPostDiv) {
      return;
    }

    //Set current article ID
    utSetPostCurrentId(uwCurrentPostID);

    refreshSlots = {
      skinning: "dfp-ad-skinning_" + uwCurrentPostID, // window.history.state.postID,
    };
    for (sKey in aSlots) {
      var adSlotValue = aSlots[sKey];

      if (sKey === "gallery") {
        if (!uwGTMObjectIsEmpty(uwMidAdUnits)) {
          for (sKey2 in uwMidAdUnits) {
            if ($("#" + uwMidAdUnits[sKey2]).length < 1) {
              continue;
            }
            refreshSlots[sKey2] = uwMidAdUnits[sKey2];
          }
        } else {
          for (sKey2 in adSlotValue) {
            var a = oPostDiv.getElementsByClassName(adSlotValue[sKey2]);
            if (a.length < 1 || !a[0].id) {
              continue;
            }
            refreshSlots[sKey2] = a[0].id;
          }
        }

        uwMidAdUnits = {};
      } else {
        var a = oPostDiv.getElementsByClassName(adSlotValue);
        if (a.length < 1 || !a[0].id) continue;
        refreshSlots[sKey] = a[0].id;
      }
    }
    if (typeof window.uwGenerateAds == "function") {
      window.uwGenerateAds(refreshSlots);
    }
  };

  var handleVideoLoadMore = function (oPostDiv) {
    if (typeof bc == "undefined") {
      return;
    }
    var oPost = $(oPostDiv);
    if (oPost.length < 1) {
      oPost = $(".alm-single-post:first");
      if (oPost.length != 1) return;
    }
    var oVideo = $(".post-top .bcove-inner video", oPost);
    //if (oVideo.length < 1) return;

    var aVideos = $(".post-top .bcove-inner video");
    for (var i = 0; i < aVideos.length; i++) {
      if (!aVideos[i].id) continue;
      var oPlayer = bc(aVideos[i]);
      if (oVideo.length > 0 && aVideos[i].id == oVideo[0].id) {
        oPlayer.play();
      } else {
        oPlayer.pause();
      }
    }
  };

  var handleNavChange = function (oPostDiv, sUrl) {
    var oNav = $("nav.navbar");
    if (oNav.length < 1) return;

    var oPost = $(oPostDiv);
    if (oPost.length < 1) {
      oPost = $(".alm-single-post:first");
      if (oPost.length != 1) return;
    }
    var oByline = oPost.find(".byline-info:first");
    if (oByline.length < 1) return;
    var sCategory = oByline.find(".category").text();
    var sTitle = oByline.find(".page-title").text();
    if (!!sCategory)
      oNav.find(".article-title-cat .article-cat").text(sCategory);
    if (!!sTitle) oNav.find(".article-title-cat .article-title").text(sTitle);
    // oNav
    //   .find(".addthis_toolbox")
    //   .attr("addthis:url", sUrl)
    //   .attr("addthis:title", sTitle);
    // window.addthis.toolbox(".addthis_toolbox");

    oNav
      .find(".mobile-share-toggle")
      .data("url", sUrl)
      .data("title", sTitle)
      .data("cn-title", sTitle);
  };

  var blockBeforeAndAfterImage = function () {
    if (jQuery(".twentytwenty-container").length > 0) {
      jQuery(".twentytwenty-container").each(function () {
        var $this = jQuery(this);

        $this.twentytwenty({
          default_offset_pct: $this.data("offsetPct"), // How much of the before image is visible when the page loads
          orientation: $this.data("orientation"), // Orientation of the before and after images ('horizontal' or 'vertical')
          before_label: $this.data("beforeText"), // Set a custom before label
          after_label: $this.data("afterText"), // Set a custom after label
          no_overlay: $this.data("noOverlay"), //Do not show the overlay with before and after
        });
      });
    }
  };

  window.almOnLoad = function (alm) {
    uw_debuglog("alm loaded", alm);
    var oPost = $(".alm-single-post:first");
    if (oPost.length < 1) return;
    var nPostID = ~~oPost.data("id");
    if (nPostID > 0) oPost.attr("id", "alm-single-post-" + nPostID);
  };

  window.almComplete = function (alm) {
    //console.log('alm ', alm, alm.el.className, alm.el.id);
    loadMoreCounter++;
    // window.addthis.toolbox(".addthis_toolbox");
    handleFeaturedVideo();
    handleGalleryPost();
    handleEmbeddedGallery();
    handleLatestInSeries();
    jQuery( 'body' ).trigger( 'post-load' ); // this to trigger the addtoany function 
    $(document).trigger("uw_alm_complete", alm);

    if (typeof alm.el != "undefined") {
      alm.el.id = "alm-single-post-" + alm.el.dataset.id;
      uw_debuglog("almComplete", alm.el);
      handleGPTAds(alm.el.dataset.id);
      var oPostDivEL = document.getElementById(alm.el.id);
      handleGPTAdsChange(oPostDivEL, alm.el.dataset.id);
      if (typeof handleTrendingSlider == "function") {
        handleTrendingSlider(alm.el.id);
      }
      if (typeof handleTrendingPostSlider == "function") {
        handleTrendingPostSlider(alm.el.id);
      }
    }

    //Start block before and after image
    blockBeforeAndAfterImage();
    //End block before and after image

    utMonitoryAdsVisibility();
  };

  window.almUrlUpdate = function (sUrl, sType) {
    if (sType !== "single-post") return;
    //console.log('alm url update ', sUrl, sType, window.history.state);
    if (!("postID" in window.history.state)) return;
    var oPostDiv = document.getElementById(
      "alm-single-post-" + window.history.state.postID
    );
    uwActivePostID = 0;
    //Set current article ID
    utSetPostCurrentId(window.history.state.postID);

    uw_debuglog("almUrlUpdate", oPostDiv);
    handleNavChange(oPostDiv, sUrl);
    handleVideoLoadMore(oPostDiv);
    YTVideoArticle.handle(oPostDiv);
    $(document).trigger("uw_alm_update", oPostDiv);
    renderEmbed();

    utMonitoryAdsVisibility();
  };

  function renderEmbed() {
    if ($("article blockquote").find(".instagram-media")) {
      window.setTimeout(function () {
        if (window.instgrm) window.instgrm.Embeds.process();
      }, 10);
    }
  }

  //override alm's default scrolling behaviour.
  if (
    typeof almSinglePosts != "undefined" &&
    typeof almSinglePosts.onScroll != "undefined"
  ) {
    window.removeEventListener("touchstart", almSinglePosts.onScroll);
    window.removeEventListener("scroll", almSinglePosts.onScroll);
    almSinglePosts.onScroll = function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (almSinglePosts.active && !almSinglePosts.popstate && scrollTop > 1) {
        almSinglePosts.timer = window.setTimeout(function () {
          var oALM = document.getElementById("ajax-load-more");
          if (!oALM) return;

          //disable view more button if it's above viewport
          var oViewMore = oALM.querySelector(".alm-load-more-btn");

          if (!!oViewMore) {
            var oRect = oViewMore.getBoundingClientRect();
            var nViewMore = oRect.top + scrollTop;
            var reDone = /\bdone\b/;
            if (scrollTop > nViewMore + oRect.height) {
              if (!reDone.test(oViewMore.className))
                oViewMore.className = oViewMore.className.trim() + " done";
            } else if (scrollTop < nViewMore) {
              if (!!reDone.test(oViewMore.className))
                oViewMore.className = oViewMore.className.replace(reDone, "");
            }
          }

          // Get container scroll position
          var fromTop = scrollTop + almSinglePosts.offset;
          var posts = oALM.querySelectorAll(".alm-single-post");
          var url = window.location.href;

          //HKS: Add about 1/3 window height threshold
          fromTop += ~~((window.innerHeight / 3) * 2);

          // Loop all posts
          var current = Array.prototype.filter.call(posts, function (n, i) {
            if (typeof ajaxloadmore.getOffset === "function") {
              var divOffset = ajaxloadmore.getOffset(n);
              if (divOffset.top < fromTop) {
                return n;
              }
            }
          });

          // Get the data attributes of the current element
          var currentPost = current[current.length - 1];
          var id = currentPost ? currentPost.dataset.id : undefined;
          var permalink = currentPost ? currentPost.dataset.url : "";
          var title = currentPost ? currentPost.dataset.title : "";
          var page = currentPost ? currentPost.dataset.page : "";

          // If undefined, use the first post data
          if (id === undefined) {
            id = almSinglePosts.first.dataset.id;
            permalink = almSinglePosts.first.dataset.url;
            title = almSinglePosts.first.dataset.title;
          }

          uwCurrentPostId = id;

          // Set URL if applicible.
          if (url !== permalink) {
            almSinglePosts.setURL(id, permalink, title, page);
          }
        }, 15);
      }
    };
    window.addEventListener("touchstart", almSinglePosts.onScroll);
    window.addEventListener("scroll", almSinglePosts.onScroll);
  }

  //test moving LB to above masthead
  (function () {
    return;
    var oLB1 = $("#dfp-ad-lb1");
    var oNLO = $("#gpt-no-layout");
    if (!oLB1.length || !oNLO.length) return;
    var oInside = oLB1.closest(".inside-page");
    if (oInside.length > 0) return;
    oLB1.insertAfter(oNLO);
  })();

  var utLoadingIndicator = function (targetIns, targetRemove, action) {
    var utLoadingClass = "ut-loading-indicator";
    var utElement = '<div class="' + utLoadingClass + '">&nbsp;</div>';

    if (action === "remove") {
      $(targetRemove + " ." + utLoadingClass).remove();
    } else {
      //Let's check if we're currently loading and return false
      if ($(targetRemove + " ." + utLoadingClass).length > 0) {
        return;
      }

      if (action === "insertBefore") {
        $(utElement).insertBefore(targetIns);
      } else if (action === "appentTo") {
        $(utElement).appendTo(targetIns);
      }
    }
  };

  function utMonitoryAdsVisibility() {
    if (typeof uwMonitorAdUnitVisibility === "function") {
      uwMonitorAdUnitVisibility();
    }
  }

  function utSetPostCurrentId(post_id) {
    if (typeof uwGTMSetPostCurrentId === "function") {
      return uwGTMSetPostCurrentId(post_id);
    }
  }
});

function uwGTMObjectIsEmpty(value) {
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    JSON.stringify(value) === "{}"
  );
}
