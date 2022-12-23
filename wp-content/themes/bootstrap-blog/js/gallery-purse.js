(function ($, window) {
  //#region share button
  var shareCounter = 1;

  /**
   * ShareButton is a custom jQuery plugin for building popup share buttons with addThis
   * @param {Element} element
   * @param {object} options
   * @param {string} options.toggleSelector  css selector for toggle button inside element
   * @param {boolean} options.isIconSVG  determines if font awesome icon is in SVG
   * @param {string} options.shareIconName font awesome class for open popup icon
   * @param {string} options.closeIconName font awesome class for close popup icon
   */
  function ShareButton(element, options) {
    this.element = element;
    var defaults = {
      toggleSelector: ".toggle",
      isIconSVG: false,
      services: ["facebook", "twitter", "whatsapp", "pinterest", "addthis"],
      shareIconName: "fa-share-alt",
      closeIconName: "fa-times",
      rootElement: window.document,
    };
    this.options = $.extend({}, defaults, options);
    this.init();
    a2a.init_all();
  }

  ShareButton.prototype = {
    init: function () {
      var $el = $(this.element);
      $el.addClass("share-buttons-container");
      this.$toggleButton = $el.find(this.options.toggleSelector);

      if (
        this.$toggleButton.length > 0 &&
        !this.$toggleButton.hasClass("toggle")
      )
        this.$toggleButton.addClass("toggle");

      var self = this;

      this.$toggleButton.click(function (event) {
        event.preventDefault();
        self.$toggleButton.toggleClass("active");
        if (self.$toggleButton.siblings(".share-buttons").length === 0) {
          self.renderButtons();
        }
        else{
            $(".share-buttons.addthis_toolbox.a2a_kit").remove();
            
        }
        window.setTimeout(function () {
          self.updateState();
        }, 10);
        return false;
      });
      a2a.init_all();
    },
    updateState: function () {
      var $currentBtn = this.$toggleButton;

      if (this.options.isIconSVG) {
        $(this.options.rootElement)
          .find(".share-buttons-container .toggle.active")
          .not($currentBtn)
          .each(function (buttonIndex, button) {
            var $button = $(button);
            $button.empty().append('<i class="fas fa-share-alt"></i>');
            $button.siblings(".share-buttons").removeClass("active");
            $button.removeClass("active");
          });
      } else {
        $(this.options.rootElement)
          .find(".share-buttons-container .toggle.active i")
          .not($currentBtn.find("i"))
          .removeClass("fa-times")
          .addClass("fa-share-alt");
        $(this.options.rootElement)
          .find(".share-buttons-container .share-buttons")
          .not($currentBtn.siblings(".share-buttons"))
          .removeClass("active");
        $(this.options.rootElement)
          .find(".share-buttons-container .toggle.active")
          .not($currentBtn)
          .removeClass("active");
      }

      $currentBtn.siblings(".share-buttons").toggleClass("active");
      if ($currentBtn.hasClass("active")) {
        if (!this.options.isIconSVG) {
          $currentBtn
            .find("i")
            .removeClass("fa-share-alt")
            .addClass("fa-times");
        } else {
          $currentBtn.empty().append('<i class="fas fa-times"></i>');
        }
      } else {
        if (!this.options.isIconSVG) {
          $currentBtn
            .find("i")
            .removeClass("fa-times")
            .addClass("fa-share-alt");
        } else {
          $currentBtn.empty().append('<i class="fas fa-share-alt"></i>');
        }
      }
    },

    renderButtons: function () {
      var $element = $(this.element);

      var url = this.options.getUrl
        ? this.options.getUrl()
        : $element.data("url");
      var title = this.options.getTitle
        ? this.options.getTitle()
        : $element.data("title");

      var html =
        '<div class="share-buttons addthis_toolbox a2a_kit" id="share-buttons-' +
        shareCounter +
        '" data-a2a-url="' +
        url +
        '" data-a2a-title="' +
        title +
        '">';
      if (~this.options.services.indexOf("facebook")) {
        html +=
          '<div class="share-wrapper share-wrapper-fb">' +
          '<div class="share-inner">' +
          '<a class="a2a_button_facebook share-btn">' +
          '<i class="fab fa-facebook-f"></i>' +
          "</a>" +
          "</div>" +
          "</div>";
      }

      if (~this.options.services.indexOf("twitter")) {
        html +=
          '<div class="share-wrapper share-wrapper-twitter">' +
          '<div class="share-inner">' +
          '<a class="a2a_button_twitter share-btn">' +
          '<i class="fab fa-twitter"></i>' +
          "</a>" +
          "</div>" +
          "</div>";
      }

      if (~this.options.services.indexOf("whatsapp")) {
        html +=
          '<div class="share-wrapper share-wrapper-whatsapp">' +
          '<div class="share-inner">' +
          '<a class="a2a_button_whatsapp share-btn">' +
          '<i class="fab fa-whatsapp"></i>' +
          "</a>" +
          "</div>" +
          "</div>";
      }

      if (~this.options.services.indexOf("pinterest")) {
        html +=
          '<div class="share-wrapper share-wrapper-pinterest">' +
          '<div class="share-inner">' +
          '<a class="a2a_button_pinterest share-btn">' +
          '<i class="fab fa-pinterest"></i>' +
          "</a>" +
          "</div>" +
          "</div>";
      }
      if (~this.options.services.indexOf("addthis")) {
        html +=
          '<div class="share-wrapper share-wrapper-addthis">' +
          '<div class="share-inner">' +
          '<a class="a2a_dd share-btn">' +
          '<i class="fas fa-plus"></i>' +
          "</a>" +
          "</div>" +
          "</div>";
      }

      html += "</div>";

      $(this.element).append(html);

      if (window.a2a && window.a2a.toolbox)
        window.a2a.toolbox("#share-buttons-" + shareCounter);

      shareCounter++;
      a2a.init_all();
    },
    /**
     * Refresh the addthis share information
     * To update the existing addthis button, you will need to assign data('url') and data('title') to element and call this method
     */
    refreshAddThis: function () {
      var $element = $(this.element);
      var $toolbox = $element.find(".a2a_kit");

      if ($toolbox.length === 0) return;

      var url = this.options.getUrl
        ? this.options.getUrl()
        : $element.data("url");
      var title = this.options.getTitle
        ? this.options.getTitle()
        : $element.data("title");
      $toolbox.attr("data-a2a-url", url).attr("data-a2a-title", title);

      if (window.a2a && window.a2a.toolbox) window.a2a.toolbox($toolbox[0]);

      a2a.init_all();
    },
  };

  $.fn.shareButton = function (options) {
    return this.each(function () {
      if (typeof options === "string") {
        var obj = $.data(this, "plugin_shareButton");
        if (obj === undefined || obj === null) return;

        var commands = ["refreshAddThis"];
        if (~commands.indexOf(options)) obj[options]();
      } else if (!$.data(this, "plugin_shareButton")) {
        $.data(this, "plugin_shareButton", new ShareButton(this, options));
      }
    });
  };
  //#endregion

  //#region GalleryPurseView skeleton

  function GalleryPurseView(parent, options) {
    this.parent = parent;
    if (this.defaults !== undefined)
      this.options = $.extend({}, this.defaults, options);
    else this.options = options;
    this.$target = $(this.options.target);
    this.isFullScreen = false;
    this.isFirstFocus = true;
    this.isFromLoadMore =
      this.$target.closest(".ajax-load-more-wrap").length > 0;
  }

  GalleryPurseView.prototype = {
    init: function () {},
    hide: function () {
      this.$target.removeClass("visible").addClass("hidden fade");
      if (this.isFullScreen) {
        $(window.document.body)
          .removeClass("noscroll-body")
          .css(
            "overflow",
            this.originalOverflow ? this.originalOverflow : "initial"
          );
      }
    },
    show: function () {
      this.$target.removeClass("hidden").addClass("visible");

      if (this.isFullScreen) {
        var $body = $(window.document.body);
        this.originalOverflow = $body.css("overflow");
        $body.addClass("noscroll-body");
      }

      if (this.options.index !== null) {
        var self = this;
        if (this.isFirstFocus) {
          setTimeout(function () {
            self.focusItem(self.options.index);
            self.isFirstFocus = false;
          }, 700);
        } else {
          self.focusItem(self.options.index);
        }
      }
    },
    render: function () {},
    //args consist of:
    //- item
    //- index
    //- parent
    renderItem: function (args) {},
    renderExtraItem: function (item, index, parent) {},
    renderContainer: function () {
      var items = this.options.dataSource.items;
      var $items = $('<div class="items"></div>');
      var position = 0;
      for (var i = 0; i < items.length; i++) {
        var extraItem = null;
        if (typeof this.options.cb.getExtraTtem === "function") {
          do {
            extraItem = this.options.cb.getExtraTtem({
              viewName: this.viewName,
              index: position,
            });
            if (extraItem != null) {
              this.renderExtraItem(extraItem, i, $items[0]);
              position++;
            }
          } while (extraItem != null);
        }

        this.renderItem({
          item: items[i],
          index: i,
          parent: $items[0],
        });
        position++;
      }
      this.$target.append($items);
    },
    focusItem: function (index) {
      var offset = this.$target
        .find(".item[data-index=" + index + "]")
        .offset();
      if (offset)
        $("html, body").animate(
          { scrollTop: offset.top - this.getStickyHeight() },
          300
        );
    },
    getStickyHeight: function () {
      var $header = $(".sticky-header");
      if ($header.length > 0) return $header.height();

      return 0;
    },
    injectRichHtmlField: function (field, containerEl) {
      var fieldType = typeof field;
      var $container = containerEl.nodeType ? $(containerEl) : containerEl;

      if (fieldType === "string") {
        $container.html(field);
      } else if (
        field instanceof window.Element ||
        field instanceof window.HTMLDocument
      ) {
        $container.append(field);
      } else if (fieldType === "function") {
        $container.append(field());
      }
    },
    customRender: function () {
      var self = this;

      //instagram
      if (this.$target.find(".instagram-media")) {
        window.setTimeout(function () {
          if (window.instgrm) window.instgrm.Embeds.process();
        }, 10);
      }

      //twitter, just hopes twitter widget.js is loaded under 1 second
      //if most cases can't, then need to reference twitter script manually and listen to rendered/loaded event
      setTimeout(function () {
        self.$target
          .find(".item twitter-widget, .slide twitter-widget")
          .each(function (index, el) {
            var index = parseInt(
              $(el).closest(".item, .slide").data("index"),
              10
            );
            var skipChecking = isNaN(index);

            if (!skipChecking) {
              if (self.parent.formattedIndex.indexOf(index) > -1) return;
            }

            try {
              var style = document.createElement("style");
              style.classList
                ? style.classList.add("purse-twitter")
                : (style.className += " purse-twitter");
              style.textContent = ".EmbeddedTweet { margin: auto; }";
              el.shadowRoot.appendChild(style);
            } catch (e) {}
          });
      }, 1500);

      //youtube
      var $iframes = this.$target.find(
        ".data-customHtml iframe, .data-description iframe"
      );
      $iframes.each(function (index, el) {
        var $el = $(el);
        var src = $el.attr("src");
        if (!src) return;
        if (src.indexOf("youtube") > -1) {
          if ($el.parent().hasClass("yt-wrapper")) return;

          var $wrapper = $('<div class="yt-wrapper"></div>');
          var $parentEl = $el.parent();
          $wrapper.append($el).appendTo($parentEl);
        }
      });

      //pinterest
      var $pintTag = this.$target.find("a[data-pin-do], span[data-pin-id]");
      $pintTag.each(function (index, el) {
        var $el = $(el);
        if ($el.parent().hasClass("board-wrapper")) return;

        var $parentEl = $el.parent();
        var $wrapper = $('<div class="pinterest-wrapper"></div>').appendTo(
          $parentEl
        );
        var $boardWrapper = $('<div class="board-wrapper"></div>').appendTo(
          $wrapper
        );
        $boardWrapper.append($el);
      });
    },
    //cleanup resource
    //jQuery.remove() and empty() is supposed to cleanup event handlers, but you can remove manually as well
    destroy: function () {
      this.parent = null;
    },
  };
  //#endregion

  //#region GalleryListView methods

  function GalleryListView(parent, options) {
    GalleryPurseView.call(this, parent, options);
    this.viewName = "list";
    this.intersectionTreshold = 0.1;
    this.currentScrollIndex = 0;
    this.init();
    a2a.init_all();
  }

  GalleryListView.prototype = Object.create(GalleryPurseView.prototype);

  GalleryListView.prototype.focusItem = function (index) {
    if (this.options.viewCount == 1 && !this.parent.containsURLValues) {
      this.initIntersectionObserver();
      return;
    }

    var self = this;
    var offset = this.$target.find(".item[data-index=" + index + "]").offset();
    if (offset)
      $("html, body").animate(
        { scrollTop: offset.top - this.getStickyHeight() },
        300,
        function () {
          self.initIntersectionObserver();
        }
      );
    else this.initIntersectionObserver();
  };

  GalleryListView.prototype.hide = function () {
    GalleryPurseView.prototype.hide.call(this);

    if (this.intersectionObserver) this.intersectionObserver.disconnect();
  };

  GalleryListView.prototype.renderItem = function (args) {
    var totalItems = this.options.dataSource.items.length;
    var item = args.item;

    //wish this is template string
    var titleHtml = item.title
      ? '<div class="title">' + item.title + "</div>"
      : "";
    var hasCustomHtml = item.customHtml != null;
    var imgHtml = "";
    if (item.image && !hasCustomHtml) {
      imgHtml =
        '<div class="img-wrapper">' +
        '<img src="' +
        item.image +
        '" />' +
        "</div>";
    }
    var creditHtml = item.credit
      ? '<div class="credit">Credit: ' + item.credit + "</div>"
      : "";

    var html =
      '<div class="item" data-index="' +
      args.index +
      '">' +
      titleHtml +
      imgHtml +
      '<div class="links">' +
      '<div class="left">' +
      '<div class="index-info">' +
      '<i class="far fa-clone"></i><span class="index">' +
      (args.index + 1) +
      '</span><span class="separator">/</span><span class="total">' +
      totalItems +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="right">' +
      '<div class="share"><div class="toggle"><i class="fas fa-share-alt"></i></div></div>' +
      (this.options.gridEnabled
        ? '<div class="show-grid"><i class="fas fa-th"></i></div>'
        : "") +
      (this.options.slideshowEnabled
        ? '<div class="show-slide"><i class="fas fa-expand"></i></div>'
        : "") +
      "</div>" +
      "</div>" +
      '<div class="info">' +
      creditHtml +
      "</div>" +
      "</div>";

    var $item = $(html).appendTo(args.parent);

    if (hasCustomHtml) {
      var $customHtmlWrapper = $('<div class="custom-html-wrapper"></div>');
      var customHtmlType = typeof item.customHtml;
      var $titleEl = $item.find(".title").first();
      if (customHtmlType === "string") {
        $customHtmlWrapper.html(item.customHtml);
      } else if (
        item.customHtml instanceof window.Element ||
        item.customHtml instanceof window.HTMLDocument
      ) {
        $customHtmlWrapper.append(item.customHtml);
      } else if (customHtmlType === "function") {
        $customHtmlWrapper.append(item.customHtml());
      }

      if ($titleEl.length > 0) $customHtmlWrapper.insertAfter($titleEl);
      else $customHtmlWrapper.prependTo($item);
    }

    if (item.description != null) {
      var $info = $item.find(".info");
      var $desc = $('<div class="desc"></div>');
      var descType = typeof item.description;

      if (descType === "string") {
        $desc.html(item.description).appendTo($info);
      } else if (
        item.description instanceof window.Element ||
        item.description instanceof window.HTMLDocument
      ) {
        $desc.append(item.description).appendTo($info);
      } else if (descType === "function") {
        $desc.append(item.description()).appendTo($info);
      }
    }

    var currentUrl = this.parent.getURL(null, args.index);
    $item.find(".share").data("url", currentUrl).data("title", item.title);
    a2a.init_all();
  };

  GalleryListView.prototype.renderExtraItem = function (
    extraItem,
    index,
    parent
  ) {
    var $item = $('<div class="item extra-item"></div>');
    $(extraItem.element).appendTo($item);
    $item.appendTo(parent);
  };

  GalleryListView.prototype.initIntersectionObserver = function () {
    var self = this;

    if (this.intersectionObserver == null) {
      this.intersectionObserver = new window.IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: this.intersectionTreshold,
        }
      );
    }

    this.$target
      .find(".items .item[data-index]")
      .each(function (index, element) {
        self.intersectionObserver.observe(element);
      });
  };

  GalleryListView.prototype.handleIntersection = function (entries, observer) {
    if (entries.length === 0) return;

    var self = this;

    entries.forEach(function (entry) {
      var $el = $(entry.target);
      var currentIndex = parseInt($el.data("index"), 10);

      if (
        entry.intersectionRatio > self.intersectionTreshold &&
        self.currentScrollIndex !== currentIndex
      ) {
        self.currentScrollIndex = currentIndex;
        self.parent.handleIndexChange(self.viewName, currentIndex);
      }
    });
  };

  GalleryListView.prototype.setHandlers = function () {
    var self = this;

    if (this.options.gridEnabled) {
      this.$target.find(".show-grid").click(function () {
        var index = $(this).closest(".item").data("index");
        self.parent.triggerGridButtonClick(self.viewName, index);
        self.parent.changeView("grid", index);
      });
    }

    if (this.options.slideshowEnabled) {
      this.$target.find(".show-slide").click(function () {
        var index = $(this).closest(".item").data("index");
        self.parent.triggerSlideshowButtonClick(self.viewName, index);
        self.parent.changeView("fixed-slider", index);
      });

      this.$target.find(".item .img-wrapper img").click(function () {
        var index = $(this).closest(".item").data("index");
        self.parent.changeView("fixed-slider", index);
      });
    }
  };

  GalleryListView.prototype.renderContainer = function () {
    GalleryPurseView.prototype.renderContainer.call(this);
    this.customRender();
    this.parent.triggerContainerRenderEnded(this.viewName, this.$target[0]);
  };

  GalleryListView.prototype.render = function () {
    GalleryPurseView.prototype.render.call(this);
    this.renderContainer();
    var shareArgs = {};
    if (
      this.options.shareBehavior != null &&
      this.options.shareBehavior.isIconSVG
    )
      shareArgs.isIconSVG = true;
    this.$target.find(".links .share").shareButton(shareArgs);
    this.setHandlers();
  };

  GalleryListView.prototype.destroy = function () {
    GalleryPurseView.prototype.destroy.call(this);
    this.intersectionObserver = null;
    this.$target.find(".show-grid,.show-slide").off("click");
    this.$target.find(".item .img-wrapper img").off("click");
    this.$target.remove();
    delete this.options;
  };

  //#endregion

  //#region GalleryGridView

  function GalleryGridView(parent, options) {
    this.viewName = "grid";
    GalleryPurseView.call(this, parent, options);
    this.isFullScreen = true;
    this.init();
    a2a.init_all();
    this.adjustCenteredItems = this.adjustCenteredItems.bind(this);
  }
  GalleryGridView.prototype = Object.create(GalleryPurseView.prototype);

  GalleryGridView.prototype.render = function () {
    GalleryPurseView.prototype.render.call(this);
    this.renderContainer();
    this.setHandlers();
  };

  GalleryGridView.prototype.renderContainer = function () {
    var url =
      this.options.dataSource.url ||
      [
        window.location.protocol,
        "//",
        window.location.host,
        window.location.pathname,
      ].join("");
    var title = this.options.dataSource.title;

    var items = this.options.dataSource.items;
    var topBarHtml =
      '<div class="top-bar bar">' +
      '<div class="top-bar-inner">' +
      '<div class="right">' +
      '<div class="icon-btn close-grid"><i class="fas fa-times"></i></div>' +
      "</div>" +
      "</div>" +
      "</div>";
    this.$target.append(topBarHtml);

    var $items = $('<div class="items"></div>');
    for (var i = 0; i < items.length; i++) {
      this.renderItem({
        item: items[i],
        index: i,
        parent: $items[0],
      });
    }
    var $itemsWrapper = $('<div class="items-wrapper"></div>');
    $itemsWrapper.append($items);
    this.$target.append($itemsWrapper);

    var bottomBarHtml =
      '<div class="bottom-bar">' +
      '<div class="bottom-bar-inner">' +
      '<div class="share-text">Share This On</div>' +
      '<div class="a2a_kit" style="display:inline-block;">' +
      '<a class="a2a_button_facebook share-btn">' +
      '<i class="fab fa-facebook-f"></i>' +
      "</a>" +
      '<a class="a2a_button_whatsapp share-btn">' +
      '<i class="fab fa-whatsapp"></i>' +
      "</a>" +
      '<a class="a2a_button_twitter share-btn">' +
      '<i class="fab fa-twitter"></i>' +
      "</a>" +
      '<a class="a2a_button_pinterest share-btn">' +
      '<i class="fab fa-pinterest"></i>' +
      "</a>" +
      ' <a class="a2a_dd share-btn">' +
      '<i class="fas fa-plus"></i>' +
      "</a>" +
      "</div>" +
      "</div>" +
      "</div>";
    this.$target.append(bottomBarHtml);

    this.adjustCenteredItems();
    a2a.init_all();
  };

  GalleryGridView.prototype.setHandlers = function () {
    var self = this;

    this.$target.find(".items .item").click(function () {
      var index = $(this).closest(".item").data("index");
      if (self.options.slideshowEnabled) {
        self.parent.triggerSlideshowButtonClick(self.viewName, index);
        self.parent.changeView("fixed-slider", index);
      } else {
        self.parent.changeView(self.options.initialView, index);
      }
    });

    this.$target.find(".top-bar .close-grid").click(function () {
      var index = self.options.index;
      self.parent.changeView(self.options.initialView, index);
    });

    $(window).on("resize orientationchange", this.adjustCenteredItems);

    if (window.a2a !== undefined && window.a2a.toolbox !== undefined) {
      window.a2a.toolbox(this.$target.find(".bottom-bar-inner .a2a_kit")[0]);
    }
  };

  GalleryGridView.prototype.renderItem = function (args) {
    var $parent = $(args.parent);
    var item = args.item;
    var thumb = item.thumb
      ? item.thumb
      : this.options.dataSource.thumbnails.default;

    if (item.customHtml && item.customHtmlType) {
      var propKey = item.customHtmlType;
      var propUrl = this.options.dataSource.thumbnails[propKey];

      if (propUrl) thumb = propUrl;
    }

    var isGif = ~thumb.indexOf(".gif");

    $parent.append(
      '<div class="item ' +
        (isGif ? "center" : "") +
        '" data-index="' +
        args.index +
        '">' +
        '<img src="' +
        thumb +
        '" />' +
        "</div>"
    );
  };

  GalleryGridView.prototype.adjustCenteredItems = function () {
    var $centeredItems = this.$target.find(".items .item.center");

    if ($centeredItems.length === 0) return;

    var $items = this.$target.find(".items .item:not(.center)");

    if ($items.length === 0) return;

    var width = $items.first().width();
    $centeredItems.width(width).height(width);
  };

  GalleryGridView.prototype.destroy = function () {
    GalleryPurseView.prototype.destroy.call(this);

    $(window).off("resize orientationchange", this.adjustCenteredItems);
    this.$target.find(".items .item").off("click");
    this.$target.find(".top-bar .close-grid").off("click");
    this.$target.remove();
    delete this.options;
  };

  //#endregion

  //#region FixedSliderView

  function FixedSliderView(parent, options) {
    this.viewName = "fixed-slider";
    GalleryPurseView.call(this, parent, options);
    this.indexMapping = {};
    this.isFullScreen = true;
    this.init();
    a2a.init_all();
  }

  FixedSliderView.prototype = Object.create(GalleryPurseView.prototype);

  FixedSliderView.prototype.render = function () {
    GalleryPurseView.prototype.render.call(this);
    this.renderContainer();
    this.initSlider();
    this.setHandlers();
    a2a.init_all();
  };

  FixedSliderView.prototype.renderContainer = function () {
    var items = this.options.dataSource.items;
    var totalItems = items.length;
    var curIndex = (this.options.index || 0) + 1;
    var topBarHtml =
      '<div class="top-bar"><div class="top-bar-inner">' +
      '<div class="left">' +
      '<div class="index-info">' +
      '<i class="far fa-clone"></i><span class="index">' +
      curIndex +
      '</span><span class="separator">/</span><span class="total">' +
      totalItems +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="right">' +
      (this.options.gridEnabled
        ? '<div class="show-grid"><i class="fas fa-th"></i></div>'
        : "") +
      '<div class="close-slide"><i class="fas fa-times"></i></div>' +
      "</div>" +
      "</div></div>";
    this.$target.append(topBarHtml);

    var $sliderWrapper = $('<div class="slider-wrapper"></div>');
    $(
      '<a class="prev" href="javascript:void(0)"><i class="fas fa-chevron-left"></i></a>'
    ).appendTo($sliderWrapper);
    $(
      '<a class="next" href="javascript:void(0)"><i class="fas fa-chevron-right"></i></a>'
    ).appendTo($sliderWrapper);
    var $items = $('<div class="items slides"></div>');
    var mappingCounter = 0;

    for (var i = 0; i < items.length; i++) {
      var extraItem = null;
      if (typeof this.options.cb.getExtraTtem === "function") {
        do {
          extraItem = this.options.cb.getExtraTtem({
            viewName: this.viewName,
            index: mappingCounter,
          });
          if (extraItem != null) {
            this.renderExtraItem(extraItem, i, $items[0]);
            mappingCounter++;
          }
        } while (extraItem != null);
      }

      this.indexMapping[i] = mappingCounter;
      mappingCounter++;

      this.renderItem({
        item: items[i],
        index: i,
        parent: $items[0],
      });
    }

    $items.appendTo($sliderWrapper);
    $('<div class="large-prev"></div>').appendTo($sliderWrapper);
    $('<div class="large-next"></div>').appendTo($sliderWrapper);
    $('<div class="slider-outer"></div>')
      .append($sliderWrapper)
      .appendTo(this.$target);

    var bottomBarHtml =
      '<div class="bottom-bar">' +
      '<div class="bottom-bar-inner">' +
      '<div class="share-text">Share This On</div>' +
      '<div class="a2a_kit" style="display:inline-block;">' +
      '<a class="a2a_button_facebook share-btn">' +
      '<i class="fab fa-facebook-f"></i>' +
      "</a>" +
      '<a class="a2a_button_whatsapp share-btn">' +
      '<i class="fab fa-whatsapp"></i>' +
      "</a>" +
      '<a class="a2a_button_twitter share-btn">' +
      '<i class="fab fa-twitter"></i>' +
      "</a>" +
      '<a class="a2a_button_pinterest share-btn">' +
      '<i class="fab fa-pinterest"></i>' +
      "</a>" +
      ' <a class="a2a_dd share-btn" href="https://www.addtoany.com/share">' +
      '<i class="fas fa-plus"></i>' +
      "</a>" +
      "</div>" +
      "</div>" +
      "</div>";
    this.$target.append(bottomBarHtml);
    this.parent.triggerContainerRenderEnded(this.viewName, this.$target[0]);
  };

  FixedSliderView.prototype.renderItem = function (args) {
    var item = args.item;
    var formattedTitle = Utils.truncateString(item.title, 110);
    var hasCustomHtml = item.customHtml != null;
    var itemTargetURL = item.targetUrl;
    var hasTargetURL = itemTargetURL != "";

    var $slide = $(
      '<div class="slide' +
        (hasCustomHtml ? " has-custom-html" : "") +
        '" data-index="' +
        args.index +
        '">' +
        '<div class="figure">' +
        '<div class="caption">' +
        (hasTargetURL
          ? '<a href="' +
            itemTargetURL +
            '" style="color: #f7f7f7" target="_blank" >' +
            formattedTitle +
            "</a>"
          : formattedTitle) +
        "</div>" +
        (hasCustomHtml
          ? '<div class="custom-html-wrapper"></div>'
          : '<img src="' + item.image + '" />') +
        '<div class="desc"></div>' +
        "</div>" +
        "</div>"
    ).appendTo(args.parent);

    if (hasCustomHtml) {
      var $customHtmlWrapper = $slide.find(".custom-html-wrapper").first();
      this.injectRichHtmlField(item.customHtml, $customHtmlWrapper);
    }
  };

  FixedSliderView.prototype.renderExtraItem = function (
    extraItem,
    index,
    parent
  ) {
    var $item = $('<div class="slide extra-item"></div>');
    var $itemsWrapper = $('<div class="item-wrapper"></div>').appendTo($item);
    var $itemInner = $('<div class="item-inner"></div>').appendTo(
      $itemsWrapper
    );

    $(extraItem.element).appendTo($itemInner);
    $item.appendTo(parent);
  };

  FixedSliderView.prototype.initSlider = function () {
    this.$slider = this.$target.find(".slides");
    this.$sliderWrapper = this.$target.find(".slider-wrapper");

    var slickOptions = {
      speed: 700,
      infinite: false,
      autoplaySpeed: 2000,
      slidesToShow: 1,
      slideToScroll: 1,
      cssEase: "linear",
      centerMode: false,
      prevArrow: $(".prev", this.$sliderWrapper),
      nextArrow: $(".next", this.$sliderWrapper),
      responsive: [
        {
          breakpoint: 767,
          settings: {
            speed: 300,
          },
        },
      ],
    };

    if (this.options.index)
      slickOptions.initialSlide = this.indexMapping[this.options.index];

    this.$slider.on("init", this.onSlideInit.bind(this));
    this.$slider.on("beforeChange", this.onBeforeSlideChange.bind(this));
    this.$slider.on("afterChange", this.onAfterSlideChange.bind(this));
    this.$slider.slick(slickOptions);
    a2a.init("page");
  };

  FixedSliderView.prototype.updateSlideInfo = function () {
    var index = this.$slider.find(".slick-current").attr("data-index");
    if (index === undefined || index === null) return;
    index = parseInt(index, 10);
    var title = this.options.dataSource.items[index].title;
    var url = this.parent.getURL(null, index);
    this.$target
      .find(".bottom-bar .a2a_kit")
      .attr("data-a2a-url", url)
      .attr("data-a2a-title", title);

    if (window.a2a !== undefined && window.a2a.toolbox !== undefined) {
      window.a2a.toolbox(this.$target.find(".bottom-bar-inner .a2a_kit")[0]);
    }
    a2a.init("page");

    this.calcPaginationWidth();
  };

  //Calculate width for prev and next buttons dynamically to make the title clickable
  FixedSliderView.prototype.calcPaginationWidth = function () {
    var slider = this.$slider;
    var sliderFigure = slider.find(".slick-current .figure");
    var sliderWidth = $(slider).width();
    var sliderFigureWidth = $(sliderFigure).width();
    var totalBaseWidth = parseFloat(
      parseFloat(sliderFigureWidth) / parseFloat(sliderWidth)
    );
    //Calculate total width in percentage
    var totalPercentageBaseWidth = parseFloat(
      parseFloat(totalBaseWidth * 100).toFixed(2)
    );
    //Calculate total width for prev and next
    var totalWidthLR = parseFloat((100 - totalPercentageBaseWidth) / 2).toFixed(
      2
    );
    //Lets change the prev and next width dynamically based on the figure width
    this.$target
      .find(".large-prev, .large-next")
      .css({ width: totalWidthLR + "%" });
  };

  /***
   * enable /disable large arrows
   * on custom html slide and ad slide, large arrows need to be disabled
   * @param {boolean} isEnabled
   */
  FixedSliderView.prototype.enableLargeArrows = function (isEnabled) {
    if (isEnabled) {
      this.$target.find(".large-prev, .large-next").removeClass("disabled");
    } else {
      this.$target.find(".large-prev, .large-next").addClass("disabled");
    }
  };

  FixedSliderView.prototype.onSlideInit = function () {
    this.updateSlideInfo();
    var $currentSlide = this.$slider.find(".slick-current");
    this.enableLargeArrows(!$currentSlide.hasClass("has-custom-html"));
  };

  FixedSliderView.prototype.onBeforeSlideChange = function (
    event,
    slick,
    currentSlide,
    nextSlide
  ) {};

  FixedSliderView.prototype.onAfterSlideChange = function (
    event,
    slick,
    currentSlide
  ) {
    //checks if slide is not an injected item
    var $currentSlide = this.$slider.find(".slick-current");
    var index = $currentSlide.attr("data-index");
    if (index !== undefined) {
      index = parseInt(index, 10);
      this.$target.find(".index-info .index").html(index + 1);
      this.parent.handleIndexChange(this.viewName, index);
      this.updateSlideInfo();
      this.enableLargeArrows(!$currentSlide.hasClass("has-custom-html"));
    } else {
      this.enableLargeArrows(false);
    }
  };

  FixedSliderView.prototype.setHandlers = function () {
    var self = this;
    if (this.options.gridEnabled) {
      this.$target.find(".top-bar .show-grid").click(function () {
        var index = self.$slider.find(".slick-current").attr("data-index");
        self.parent.triggerGridButtonClick(self.viewName, index);
        self.parent.changeView("grid", index);
      });
    }
    this.$target.find(".top-bar .close-slide").click(function () {
      var index = self.$slider.find(".slick-current").attr("data-index");
      if (isNaN(index)) index = self.options.index;
      //self.parent.returnToPreviousView(index);
      self.parent.changeView(self.options.initialView, index);
    });
    this.$target.find(".slider-wrapper .large-prev").click(function () {
      self.$slider.slick("slickPrev");
    });
    this.$target.find(".slider-wrapper .large-next").click(function () {
      self.$slider.slick("slickNext");
    });
  };

  FixedSliderView.prototype.destroy = function () {
    GalleryPurseView.prototype.destroy.call(this);
    this.$target.find(".top-bar .show-grid").off("click");
    this.$target.find(".top-bar .close-slide").off("click");
    this.$slider.off("init");
    this.$slider.off("beforeChange");
    this.$slider.off("afterChange");
    this.$target.find(".items-wrapper .large-prev").off("click");
    this.$target.find(".items-wrapper .large-next").off("click");
    this.$slider.slick("unslick");
    this.$target.remove();
    this.$slider = null;

    delete this.options;
  };

  //#endregion

  //#region slider view
  function SliderView(parent, options) {
    this.viewName = "slider";
    GalleryPurseView.call(this, parent, options);
    this.init();
  }

  SliderView.prototype = Object.create(GalleryPurseView.prototype);

  SliderView.prototype.render = function () {
    GalleryPurseView.prototype.render.call(this);
    this.renderContainer();
    this.initSlider();
    this.setHandlers();
    a2a.init_all();
  };

  SliderView.prototype.renderContainer = function () {
    var index = (this.options.index || 0) + 1;
    var items = this.options.dataSource.items;
    var totalItems = items.length;

    var $sliderWrapper = $('<div class="slider-wrapper"></div>');
    $(
      '<a class="prev" href="javascript:void(0);"><div class="prev-inner"><i class="fas fa-chevron-left"></i></div></a>'
    ).appendTo($sliderWrapper);
    $(
      '<a class="next" href="javascript:void(0);"><div class="next-inner"><i class="fas fa-chevron-right"></i></div></a>'
    ).appendTo($sliderWrapper);
    var $items = $('<div class="items slides"></div>');

    for (var i = 0; i < items.length; i++) {
      this.renderItem({
        item: items[i],
        index: i,
        parent: $items[0],
      });
    }

    $items.appendTo($sliderWrapper);

    //try preventing (unexplainable) error when appending brightcove to last slide
    try {
      this.$target.append($sliderWrapper);
    } catch (e) {
      console.log(e);
    }

    var linksHtml =
      '<div class="links">' +
      '<div class="left">' +
      '<div class="index-info">' +
      '<i class="far fa-clone"></i><span class="index">' +
      (index + 1) +
      '</span><span class="separator">/</span><span class="total">' +
      totalItems +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="right">' +
      '<div class="share"><div class="toggle"><i class="fas fa-share-alt"></i></div></div>' +
      (this.options.gridEnabled
        ? '<div class="show-grid"><i class="fas fa-th"></i></div>'
        : "") +
      (this.options.slideshowEnabled
        ? '<div class="show-slide"><i class="fas fa-expand"></i></div>'
        : "") +
      "</div>";
    this.$target.append(linksHtml);

    var infoHtml =
      '<div class="info">' +
      '<div class="title"></div>' +
      '<div class="desc"></div>' +
      '<div class="credit">Credit: <span class="by"></span></div>' +
      "</div>";

    this.$target.append(infoHtml);

    var shareArgs = {};

    if (
      this.options.shareBehavior != null &&
      this.options.shareBehavior.isIconSVG
    )
      shareArgs.isIconSVG = true;

    this.$target.find(".links .share").shareButton(shareArgs);
    this.customRender();
    a2a.init_all();
  };

  SliderView.prototype.renderItem = function (args) {
    var item = args.item;
    var hasCustomHtml = item.customHtml != null;

    var $slide = $(
      '<div class="slide" data-index="' +
        args.index +
        '">' +
        (hasCustomHtml
          ? '<div class="custom-html-wrapper"></div>'
          : '<img src="' + item.image + '" />') +
        "</div>"
    ).appendTo(args.parent);

    if (hasCustomHtml) {
      var $customHtmlWrapper = $slide.find(".custom-html-wrapper").first();
      this.injectRichHtmlField(item.customHtml, $customHtmlWrapper);
    }
  };

  SliderView.prototype.initSlider = function () {
    this.$sliderWrapper = this.$target.find(".slider-wrapper");
    this.$slider = this.$target.find(".slides");

    var slickOptions = {
      speed: 500,
      infinite: false,
      slidesToShow: 1,
      slideToScroll: 1,
      fade: true,
      cssEase: "linear",
      prevArrow: $(".prev", this.$sliderWrapper),
      nextArrow: $(".next", this.$sliderWrapper),
    };

    if (this.options.index) slickOptions.initialSlide = this.options.index;

    this.$slider.on("init", this.onSlideInit.bind(this));
    this.$slider.on("afterChange", this.onAfterSlideChange.bind(this));
    this.$slider.slick(slickOptions);
  };

  SliderView.prototype.updateSlideInfo = function () {
    var index = parseInt(
      this.$slider.find(".slick-current").attr("data-index"),
      10
    );
    var title = "",
      desc = "",
      credit = "";
    var item = null;

    if (index !== undefined && !isNaN(index)) {
      this.$target.find(".links .index-info .index").html(index + 1);
      item = this.options.dataSource.items[index];
      title = item.title;
      desc = item.description;
      credit = item.credit;
    }

    this.$target.find(".info .title").html(title);
    this.$target.find(".info .credit .by").html(credit);

    if (credit) this.$target.find(".info .credit").show();
    else this.$target.find(".info .credit").hide();

    var $desc = this.$target.find(".info .desc").empty();

    if (item != null && item.description != null) {
      var descType = typeof item.description;

      if (descType === "string") {
        $desc.html(item.description);
      } else if (
        item.description instanceof window.Element ||
        item.description instanceof window.HTMLDocument
      ) {
        $desc.append(item.description);
      } else if (descType === "function") {
        $desc.append(item.description());
      }
    }

    var url = this.parent.getURL(null, index);
    var $share = this.$target.find(".links .share");
    $share.data("url", url).data("title", title).shareButton("refreshAddThis");

    var $prevArrow = $(".prev", this.$sliderWrapper);
    var $nextArrow = $(".next", this.$sliderWrapper);

    if (index === 0) $prevArrow.addClass("disabled");
    else $prevArrow.removeClass("disabled");

    if (index === this.options.dataSource.items.length - 1)
      $nextArrow.addClass("disabled");
    else $nextArrow.removeClass("disabled");
  };

  SliderView.prototype.onSlideInit = function () {
    this.updateSlideInfo();
    this.focusSlide();
  };

  SliderView.prototype.onAfterSlideChange = function (
    event,
    slick,
    currentSlide
  ) {
    this.updateSlideInfo();

    var index = this.$slider.find(".slick-current").attr("data-index");
    if (index !== undefined) {
      index = parseInt(index, 10);
      this.parent.handleIndexChange(this.viewName, index);
    }
  };

  SliderView.prototype.setHandlers = function () {
    var self = this;
    if (this.options.gridEnabled) {
      this.$target.find(".links .show-grid").click(function () {
        var index = self.$slider.find(".slick-current").attr("data-index");
        self.parent.triggerGridButtonClick(self.viewName, index);
        self.parent.changeView("grid", index);
      });
    }
    if (this.options.slideshowEnabled) {
      this.$target.find(".links .show-slide").click(function () {
        var index = self.$slider.find(".slick-current").attr("data-index");
        self.parent.triggerSlideshowButtonClick(self.viewName, index);
        self.parent.changeView("fixed-slider", index);
      });
      this.$target.find(".slide[data-index] img").click(function () {
        var index = parseInt($(this).closest(".slide").attr("data-index"), 10);
        self.parent.changeView("fixed-slider", index);
      });
    }
  };

  SliderView.prototype.focusSlide = function () {
    if (this.options.viewCount == 1 && !this.parent.containsURLValues) return;

    var offset = this.$target.find(".slider-wrapper").offset();

    if (offset) {
      var offsetTop = offset.top - this.getStickyHeight();
      $("html, body").animate({ scrollTop: offsetTop }, 300);
    }
  };

  SliderView.prototype.destroy = function () {
    GalleryPurseView.prototype.destroy.call(this);

    this.$target.find(".links .show-grid").off("click");
    this.$target.find(".links .show-slide").off("click");

    this.$slider.off("init");
    this.$slider.off("afterChange");
    this.$slider.slick("unslick");
    this.$target.remove();
    this.$slider = null;
  };

  //#endregion

  function UrlHelper(parent, options) {
    var defaultOptions = {
      isUrlAffected: false,
      isInternalOnly: false,
      galleryParamName: null,
      viewParamName: null,
      slideParamName: null,
    };
    this.parent = parent;
    this.options = $.extend({}, defaultOptions, options);
  }

  UrlHelper.prototype = {
    //adapted from https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
    getParamValues: function (value) {
      var params = {};
      var arr = value.split("&");

      for (var i = 0; i < arr.length; i++) {
        var param = arr[i].split("=", 2);
        if (param.length !== 2) continue;
        params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
      }

      return params;
    },

    getInitialValues: function () {
      if (!this.options.isUrlAffected) return null;

      var queryString = window.location.search;

      if (queryString === "") return null;

      var values = {};
      var params = this.getParamValues(queryString.substring(1));

      if (
        this.options.galleryParamName != null &&
        params[this.options.galleryParamName] != null &&
        params[this.options.galleryParamName] != this.parent.id
      )
        return null;

      if (
        this.options.viewParamName != null &&
        params[this.options.viewParamName] != null
      )
        values.viewName = params[this.options.viewParamName];

      if (
        this.options.slideParamName != null &&
        params[this.options.slideParamName] != null
      ) {
        var index = params[this.options.slideParamName];
        index = parseInt(index, 10);
        if (!isNaN(index)) values.index = index;
      }

      return values;
    },

    //params are:
    //- viewName : view name
    //- index
    getUrl: function (options) {
      if (!this.options.isUrlAffected) return window.location.href;

      var queryString = window.location.search;
      var params = {};
      var url = [
        window.location.protocol,
        "//",
        window.location.host,
        window.location.pathname,
      ].join("");

      if (queryString !== "")
        params = this.getParamValues(queryString.substring(1));

      if (this.options.galleryParamName !== null && this.parent.id)
        params[this.options.galleryParamName] = this.parent.id;

      if (this.options.viewParamName !== null)
        params[this.options.viewParamName] = options.viewName;

      if (this.options.slideParamName !== null)
        params[this.options.slideParamName] = options.index + 1;

      var newQueryString = $.param(params);
      if (newQueryString) url += "?" + newQueryString;

      return url;
    },
  };

  //#region Plugin methods
  var pluginName = "galleryPurse";
  var pluginDefaults = {
    initialView: "list",
    cb: {},
    slideshowEnabled: true,
    gridEnabled: true,
  };

  /***
   * Options consists of :
   * - initialView ,  value is one of 'list', 'fixed-slider','slider', or 'grid
   * - urlBehavior
   * - shareBehavior
   * - cb  : callback object
   * -    getExtraTtem
   *
   */
  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, pluginDefaults, options);
    this._name = pluginName;
    this.view = null;
    this.viewCount = 0;
    this.viewHistory = [];
    this.formattedIndex = []; //store indexes of item who is formatted, used for twitter for now
    this.currentViewName = "";
    if (this.element.id) this.id = this.element.id;

    if (!this.options.dataSource) {
      this.extractDataSource();
    }

    if (this.options.dataSource && !this.options.dataSource.thumbnails)
      this.options.dataSource.thumbnails = [];

    this.init();
    a2a.init_all();
  }

  Plugin.prototype.extractDataSource = function () {
    var $source = null;

    if (this.options.dataSourceElement)
      $source = $(this.options.dataSourceElement);
    else $source = $(this.element).find(".data-source");

    if ($source.length === 0) return;

    var reClass = /data\-([a-zA-Z0-9-_])+/g;

    function extractDataFromDOM($el, isArrayItem) {
      var $children = $el.children(['class^="data-"']);
      var value = {};

      var isArray = $el.attr("data-type") === "array";
      var isObject = $el.attr("data-type") === "object";
      var hasHTMLContent = $el.attr("data-type") === "html";
      var hasHTMLRef = $el.attr("data-type") === "html-ref";
      var isInt = $el.attr("data-type") === "int";
      var propName = "";

      if (!isArrayItem) {
        var classes = $el.attr("class");
        if (classes === undefined) return null;

        var propNames = classes.match(reClass);
        if (propNames === null || propNames.length === 0) return null;

        propName = propNames[0].replace("data-", "");

        if (hasHTMLRef) {
          value[propName] = $el[0];
          return value;
        }

        if ($children.length == 0 || hasHTMLContent || isInt) {
          var propValue = "";
          var attrValue = $el.attr("data-value");

          if (attrValue != null) propValue = attrValue;
          else propValue = $.trim($el.html());

          if (isInt) propValue = parseInt(propValue, 10);

          value[propName] = propValue;
          return value;
        }
      }

      if (isArray) value[propName] = [];

      if (isObject) value[propName] = {};

      $children.each(function (index, childEl) {
        var $childEl = $(childEl);
        var newValue = extractDataFromDOM($childEl, isArray);

        if (isArray && newValue !== null) {
          value[propName].push(newValue);
        } else if (isObject && newValue !== null) {
          $.extend(value[propName], newValue);
        } else {
          if (newValue !== null) value = $.extend(value, newValue);
        }
      });

      return value;
    }

    if ($source.length === 0) return;

    var dataSource = extractDataFromDOM($source);
    if (dataSource !== null) this.options.dataSource = dataSource;
    $source.remove();
  };

  Plugin.prototype.createView = function (viewName, index) {
    if (viewName === "default") viewName = this.options.initialView;

    var $div = $('<div class="' + viewName + '-view hidden"></div>').appendTo(
      this.purseContainer
    );
    var viewOptions = {
      dataSource: this.options.dataSource,
      target: $div[0],
      index: index,
      cb: this.options.cb,
      viewCount: this.viewCount,
      initialView: this.options.initialView,
      gridEnabled: this.options.gridEnabled,
      slideshowEnabled: this.options.slideshowEnabled,
    };
    if (this.options.shareBehavior)
      viewOptions.shareBehavior = this.options.shareBehavior;

    switch (viewName) {
      case "grid":
        return new GalleryGridView(this, viewOptions);
      case "fixed-slider":
        return new FixedSliderView(this, viewOptions);
      case "slider":
        return new SliderView(this, viewOptions);
      default:
        return new GalleryListView(this, viewOptions);
    }
  };

  Plugin.prototype.changeView = function (viewName, index, ignoreHistory) {
    if (this.currentViewName === viewName) return;

    if (typeof index !== "number") index = parseInt(index, 10);

    if (this.viewCount > 0)
      this.triggerBeforeViewChange(this.currentViewName, viewName);
    this.viewCount++;

    var newView = this.createView(viewName, index);
    this.currentViewName = viewName;

    if (!ignoreHistory) this.viewHistory.push(viewName);

    var oldView = null;
    var self = this;
    if (this.view !== null) {
      oldView = this.view;
    }
    this.view = newView;
    this.view.render();

    if (oldView !== null) {
      oldView.hide();
    }

    setTimeout(function () {
      self.view.show();
    }, 10);

    setTimeout(function () {
      if (oldView !== null) {
        oldView.destroy();
      }
    }, 1500);
  };

  Plugin.prototype.returnToPreviousView = function (index) {
    if (this.viewHistory.length <= 1) return;

    this.viewHistory.pop();
    var prevView = this.viewHistory[this.viewHistory.length - 1];
    this.changeView(prevView, index, true);
  };

  Plugin.prototype.triggerContainerRenderEnded = function (viewName, element) {
    var data = { viewName: viewName, element: element };
    $(this.element).trigger("containerRenderEnded", data);
  };

  Plugin.prototype.triggerBeforeViewChange = function (oldView, newView) {
    var data = { oldView: oldView, newView: newView };
    $(this.element).trigger("beforeGalleryViewChange", data);
  };

  Plugin.prototype.handleIndexChange = function (viewName, index) {
    var url = this.getURL(viewName, index);
    var data = { viewName: viewName, index: index };
    if (url != null) data.url = url;
    $(this.element).trigger("galleryIndexChange", data);
  };

  Plugin.prototype.triggerSlideshowButtonClick = function (oldView, index) {
    var args = {
      oldView: oldView,
      index: index,
    };
    $(this.element).trigger("slideshowButtonClick", args);
  };

  Plugin.prototype.triggerGridButtonClick = function (oldView, index) {
    var args = {
      oldView: oldView,
      index: index,
    };
    $(this.element).trigger("gridButtonClick", args);
  };

  //may not need this code but better attach extra elements to DOM to prevent garbage collection
  Plugin.prototype.storeElement = function (el) {
    var $element = $(this.element);
    var $store = $element.children(".element-store");

    if ($store.length == 0) {
      $store = $(
        '<div class="element-store" style="display:none;"></div>'
      ).appendTo($element);
    }
    $store.append(el);
  };

  Plugin.prototype.init = function () {
    var $el = $(this.element);
    var $purseContainer = $el.find(".purse-container");
    if ($purseContainer.length === 0) {
      $purseContainer = $('<div class="purse-container"></div>');
      $purseContainer.appendTo($el);
    }
    this.purseContainer = $purseContainer[0];
    this.urlHelper = new UrlHelper(this, this.options.urlBehavior || {});
    var initialValues = this.urlHelper.getInitialValues();

    //TODO: view name validations
    var initialView = this.options.initialView,
      initialIndex = 0;
    if (initialValues != null && Object.keys(initialValues).length > 0) {
      if (
        initialValues.viewName != initialView &&
        initialValues.viewName != null
      ) {
        this.viewHistory.push(initialView);
        initialView = initialValues.viewName;
      }
      if (initialValues.index != null) {
        initialIndex = initialValues.index - 1;
      }

      this.containsURLValues = true;
    }

    this.changeView(initialView, initialIndex);
  };

  Plugin.prototype.getURL = function (viewName, index) {
    var args = { index: index };

    if (viewName) args.viewName = viewName;

    return this.urlHelper.getUrl(args);
  };

  //#endregion

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window);
