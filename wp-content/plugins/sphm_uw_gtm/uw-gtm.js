function uw_debuglog() {
  if (typeof console != "object" || typeof console.log != "function")
    return false;
  if (!/sphmdb=1/.test(document.cookie)) return false;
  console.log.apply(console, arguments);
  return true;
}

window.dataLayer = window.dataLayer || [];
window.uwBaseData = window.uwBaseData || {};
window.uwAlmData = window.uwAlmData || [];

window.uwGTM = {
  debugging: !!window.uwDebugging,
  lazies: [],

  sendData: function (eventLayer) {
    if (typeof window.dataLayer == "undefined") return;
    var lotame_id = "";
    var emarsys_id = "";
    var uwurl = window.location.href;
    var validkeys = [
      "content_category",
      "content_level_1",
      "content_level_2",
      "content_level_3",
      "content_level_4",
      "content_type",
      "product_name",
      "product_brand",
      "product_category",
      "content_author",
      "article_keyword",
      "product_keyword",
      "page_name",
      "pagination",
      "content_publication_date",
      "content_url",
      "video_account_id",
      "video_id",
      "video_title",
      "video_tags",
      "video_duration",
      "video_category",
      "video_source",
      "video_language",
      "video_auto_played",
      "video_published_date",
      "adblocker_status",
      "container_id",
      "container_version",
      "render_type",
      "no_of_search_results",
      "locale",
      "recommended_article_ids",
      "search_keyword",
      "promotion_code",
      "gift_code",
      "subscriber_promotion",
      "from",
      "client_id",
      "user_id_h",
      "user_id_s",
      "lotame_id",
      "emarsys_id",
      "visitor_category_s",
      "visitor_category_h",
      "product_family",
      "advertising_id",
      "firebase_instance_id",
      "product_variant",
      "ux_element_name",
      "ux_element_type",
      "search_category",
      "subscription_duration",
      "subscription_option",
      "environment",
      "device_id",
      "user_type",
      "user_registration_date",
      "login_status",
      "article_keyword_1",
      "article_keyword_2",
      "article_keyword_3",
      "article_keyword_4",
      "article_keyword_5",
      "article_type",
      "dynamic_views",
      "gpt_ad_cat",
    ];
    var newLayer = {
      content_category: "free",
      content_type: "index", // index / listing / article / video / photo / forum / post / thread / price guides / product
      page_name: "Homepage",
      content_url: uwurl,
      render_type: "web",
      visitor_category_s: "anonymous",
      visitor_category_h: "anonymous",
      product_family: "Universal Template",
      locale: "en",
    };
    if (typeof window.uwBaseData == "object") {
      for (var sKey in window.uwBaseData) {
        if (
          typeof window.uwBaseData[sKey] != "string" ||
          validkeys.indexOf(sKey) < 0
        )
          continue;
        newLayer[sKey] = window.uwBaseData[sKey];
      }
    }
    if (!!eventLayer) {
      for (var sKey in eventLayer) {
        if (typeof eventLayer[sKey] != "string") continue;
        newLayer[sKey] = eventLayer[sKey];
      }

      if (!("dynamic_views" in eventLayer)) {
        newLayer["dynamic_views"] = undefined;
      }
    }
    if (!!this.debugging)
      console.log(
        "gtm " + ("event" in newLayer ? newLayer.event : "pageview") + ":",
        newLayer
      );
    else window.dataLayer.push(newLayer);
  },

  send: function (sType, sCategory, sAction, sLabel, oOther) {
    if (["event", "pageview", "virtual_pageview"].indexOf(sType) < 0) return;
    var validkeys = [
      "content_category",
      "content_level_1",
      "content_level_2",
      "content_level_3",
      "content_level_4",
      "content_type",
      "product_name",
      "product_brand",
      "product_category",
      "content_author",
      "article_keyword",
      "product_keyword",
      "page_name",
      "pagination",
      "content_publication_date",
      "content_url",
      "video_account_id",
      "video_id",
      "video_title",
      "video_tags",
      "video_duration",
      "video_category",
      "video_source",
      "video_language",
      "video_auto_played",
      "video_published_date",
      "adblocker_status",
      "container_id",
      "container_version",
      "render_type",
      "no_of_search_results",
      "locale",
      "recommended_article_ids",
      "search_keyword",
      "promotion_code",
      "gift_code",
      "subscriber_promotion",
      "from",
      "client_id",
      "user_id_h",
      "user_id_s",
      "lotame_id",
      "emarsys_id",
      "visitor_category_s",
      "visitor_category_h",
      "product_family",
      "advertising_id",
      "firebase_instance_id",
      "product_variant",
      "ux_element_name",
      "ux_element_type",
      "search_category",
      "subscription_duration",
      "subscription_option",
      "environment",
      "device_id",
      "user_type",
      "user_registration_date",
      "login_status",
      "article_keyword_1",
      "article_keyword_2",
      "article_keyword_3",
      "article_keyword_4",
      "article_keyword_5",
      "article_type",
    ];
    var data = {};
    if (sType == "event") {
      if (
        typeof sCategory != "string" ||
        typeof sAction != "string" ||
        typeof sLabel != "string"
      )
        return;
      data["event"] = "hm_push_event";
      if (
        [
          "Content-Conversion",
          "Content-Engagement",
          "Product-Conversion",
          "Product-Core",
        ].indexOf(sCategory) > -1
      ) {
        data["event_category"] = sCategory;
        data["event_action"] = sAction;
        data["event_label"] = sLabel;
        if (typeof oOther == "object" && "data" in oOther) {
          for (datakey in oOther.data) {
            if (validkeys.indexOf(datakey) < 0) continue;
            data[datakey] = oOther.data[datakey];
          }
        }
      } else {
        var oSection = {},
          sSectionName = "",
          sSectionTitle = "",
          sArticleName = "";
        var nPosition =
          typeof oOther == "object" && "position" in oOther
            ? ~~oOther.position
            : 0;
        data["event_category"] = "Content-Engagement";
        if (typeof sAction == "string") data["event_action"] = sAction;
        if (typeof sCategory == "string")
          data["ux_element_type"] = data["ux_element_name"] = sCategory;
        if (typeof sLabel == "string") {
          if (!!sSectionName) oSection["SectionName"] = sSectionName;
          if (!!sSectionTitle) oSection["SectionTitle"] = sSectionTitle;
          if (!!sArticleName) oSection["ArticleName"] = sArticleName;
          if (nPosition > 0) oSection["Position"] = nPosition + "";
          data["event_label"] = JSON.stringify(oSection);
        }
      }
      if (typeof oOther == "object" && "non_interactive" in oOther) {
        data["non_interactive"] = ~~oOther.non_interactive + "";
      }
    } else if (sType == "virtual_pageview") {
      data["event"] = "virtual_pageview";
      if (
        typeof sCategory == "string" &&
        sCategory.search(window.location.origin) > -1
      ) {
        data["content_url"] = sCategory;
        data["virtual_page"] = sCategory.replace(window.location.origin, "");
      } else if (window.location.href.search(window.location.origin) > -1) {
        data["virtual_page"] = window.location.href.replace(
          window.location.origin,
          ""
        );
      }
    } else if (sType == "pageview") {
      //Custom metric send only once
      data["dynamic_views"] = "1";
    }

    this.sendData(data);
  },

  watchClick: function (oWatch, sCategory, sAction, sLabel, oOther, bNoClick) {
    if (!jQuery) return;
    if (
      jQuery(oWatch).length < 1 ||
      typeof sCategory != "string" ||
      typeof sAction != "string" ||
      typeof sLabel != "string"
    )
      return;
    if (!!jQuery(oWatch).data("clickwatched")) {
      uw_debuglog("already watched", oWatch);
      return;
    }
    jQuery(oWatch).data("clickwatched", 1);
    jQuery(oWatch).on("click", function (e) {
      if (!!bNoClick) e.preventDefault();
      //if (!!jQuery(oWatch).data('clicked')) return;
      //jQuery(this).data('clicked', 1);
      uwGTM.send("event", sCategory, sAction, sLabel, oOther);
    });
  },

  watchLazy: function (oWatch, sCategory, sAction, sLabel, oOther) {
    if (!jQuery) return;
    if (
      jQuery(oWatch).length < 1 ||
      typeof sCategory != "string" ||
      typeof sAction != "string" ||
      typeof sLabel != "string"
    )
      return;
    if (!Array.isArray(this.lazies)) this.lazies = [];
    this.lazies.push({
      target: jQuery(oWatch),
      category: sCategory,
      action: sAction,
      label: sLabel,
      other: oOther,
    });
  },

  initLazy: function () {
    if (!jQuery) return;
    jQuery(window).scroll(function () {
      if (!Array.isArray(uwGTM.lazies)) return;
      var nTop = jQuery(window).scrollTop();
      var nBottom = jQuery(window).scrollTop() + jQuery(window).height();
      for (var i = 0; i < uwGTM.lazies.length; i++) {
        var o = uwGTM.lazies[i];
        if (
          !o.target ||
          jQuery(o.target).length < 1 ||
          typeof o.category != "string" ||
          typeof o.action != "string" ||
          typeof o.label != "string"
        )
          continue;
        if (!!jQuery(o.target).data("impressed")) {
          continue;
        }
        var nLinkTop = jQuery(o.target).offset().top;
        var nLinkBottom =
          jQuery(o.target).offset().top + jQuery(o.target).height();
        if (nTop < nLinkTop && nBottom > nLinkBottom) {
          jQuery(o.target).data("impressed", 1);
          uwGTM.lazies[i] = false;
          if (
            typeof o.other == "object" &&
            ("data" in o.other || "position" in o.other)
          ) {
            uwGTM.send("event", o.category, o.action, o.label, o.other);
          } else {
            uwGTM.send("event", o.category, o.action, o.label);
          }
        }
      }
    });
  },

  checkviewable: function (o, bPartial) {
    if (jQuery(o).length < 1) return false;
    var nTop = jQuery(window).scrollTop();
    var nBottom = jQuery(window).scrollTop() + jQuery(window).height();
    var nLinkTop = jQuery(o).offset().top;
    var nLinkBottom = jQuery(o).offset().top + jQuery(o).height();

    if (nTop < nLinkTop && nBottom > nLinkBottom) return true;
    if (bPartial) {
      if (nTop < nLinkTop && nBottom > nLinkTop) return true; //top part visible
      if (nTop < nLinkBottom && nBottom > nLinkBottom) return true; //bottom part visible
      if (nTop > nLinkTop && nBottom < nLinkBottom) return true; //link bigger than the window
    }
    return false;
  },

  prepare: function () {
    if (!jQuery) return;

    jQuery(document).on("uw_gallery_update", function (e, o) {
      if (typeof o != "object" || !("url" in o) || typeof o.url != "string")
        return;
      uwGTM.send("virtual_pageview", o.url);
    });

    jQuery(document).on("uw_embedded_gallery_update", function (e, o, a) {
      if (
        typeof o != "object" ||
        typeof o.url != "string" ||
        typeof o.target != "object"
      )
        return;
      var sTitle = jQuery.trim(jQuery(o.target).find(".info .title").text());
      var oLabel = {
        SectionName: "Embedded Gallery",
        SectionTitle: "Embedded Gallery",
        ArticleName: sTitle,
        Position: ~~o.index + 1,
      };
      uwGTM.send(
        "event",
        "Content-Engagement",
        "Click",
        JSON.stringify(oLabel),
        {
          data: {
            ux_element_type: "Embedded Gallery",
            ux_element_name: "Embedded Gallery",
          },
        }
      );
    });

    jQuery(document).on("uw_gallery_show_slide", function (e, o) {
      if (typeof o != "object" || !("index" in o)) return;
      uwGTM.send("event", "Product-Core", "Navigation", "Type=ShowSlide", {
        data: {
          ux_element_type: "show_slide",
          ux_element_name: "Gallery Enlarge Button",
        },
      });
    });

    jQuery(document).on("uw_gallery_show_grid", function (e, o) {
      if (typeof o != "object" || !("index" in o)) return;
      uwGTM.send("event", "Product-Core", "Navigation", "Type=ShowGrid", {
        data: {
          ux_element_type: "show_grid",
          ux_element_name: "Gallery Purse Button",
        },
      });
    });

    jQuery(document).on("uw_alm_update", function (e, o) {
      var oPost = jQuery(o);
      var oAlm = jQuery("#ajax-load-more");
      var nPostID = 0;
      if (oPost.length > 0) nPostID = ~~oPost.data("id");
      else if (oAlm.length > 0) nPostID = ~~oAlm.data("post-id");
      if (nPostID > 0) {
        var uwAlmData = window.uwAlmData || {};
        var uwBaseData = window.uwBaseData || {};
        var sPostID = nPostID + "";
        if (sPostID in uwAlmData) {
          for (var sKey in uwAlmData[sPostID]) {
            uwBaseData[sKey] = uwAlmData[sPostID][sKey];
          }
        }
      }

      uwGTM.send("virtual_pageview");
      uwGTM.refresh(o);
    });

    jQuery(document).on("uw_signature_highlight_load", function (e, o) {
      if (
        typeof o != "object" ||
        !("slider" in o) ||
        !("selector" in o.slider) ||
        jQuery(o.slider.selector).length < 1
      )
        return;
      jQuery(o.slider.selector)
        .find(".sh-slide")
        .each(function (i, oSlide) {
          var sTitle = jQuery.trim(jQuery(oSlide).find(".text a h4").text());
          var oLabel = {
            SectionName: "Signature Highlights",
            SectionTitle: "Signature Highlights",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            jQuery(oSlide).find("a"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Signature Highlights",
                ux_element_name: "Signature Highlights",
              },
            }
          );
        });
    });

    jQuery(document).on("uw_signature_highlight_update", function (e, o) {
      if (
        typeof o != "object" ||
        !("slide" in o) ||
        !uwGTM.checkviewable(o.slide)
      )
        return;
      var sTitle = jQuery.trim(jQuery(o.slide).find(".text a h4").text());
      var oLabel = {
        SectionName: "Signature Highlights",
        SectionTitle: "Signature Highlights",
        ArticleName: sTitle,
        Position: o.slidenumber,
      };
      uwGTM.send(
        "event",
        "Content-Engagement",
        "Impression",
        JSON.stringify(oLabel),
        {
          data: {
            ux_element_type: "Signature Highlights",
            ux_element_name: "Signature Highlights",
          },
        }
      );
    });

    jQuery(document).on("uw_anchorblock_load", function (e, o) {
      if (typeof o != "object" || !("slider" in o)) return;
      jQuery(o.slider)
        .find(".carousel-item")
        .each(function (i, oSlide) {
          var sTitle = jQuery.trim(
            jQuery(oSlide).find(".carousel-caption a h1").text()
          );
          var oLabel = {
            SectionName: "Anchor Block",
            SectionTitle: "Anchor Block",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            jQuery(oSlide).find("a.post-link,a.slider-link"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Anchor Block",
                ux_element_name: "Anchor Block",
              },
            }
          );
        });
    });

    jQuery(document).on("uw_anchorblock_update", function (e, o) {
      if (
        typeof o != "object" ||
        !("slide" in o) ||
        !uwGTM.checkviewable(o.slide, true)
      )
        return;
      var sTitle = jQuery.trim(
        jQuery(o.slide).find(".carousel-caption a h1").text()
      );
      var oLabel = {
        SectionName: "Anchor Block",
        SectionTitle: "Anchor Block",
        ArticleName: sTitle,
        Position: o.slidenumber,
      };
      uwGTM.send(
        "event",
        "Content-Engagement",
        "Impression",
        JSON.stringify(oLabel),
        {
          data: {
            ux_element_type: "Anchor Block",
            ux_element_name: "Anchor Block",
          },
        }
      );
    });

    jQuery(document).on("uw_video_update", function (e, o) {
      if (
        typeof o != "object" ||
        !("videostatus" in o) ||
        ["Start", "InProgress", "Complete"].indexOf(o.videostatus) < 0
      )
        return;

      var oElement =
        typeof o.element == "undefined" ? false : jQuery(o.element);
      if (oElement.length < 1) return;

      var oLabel = {
        VideoStatus: o.videostatus,
        SectionName: "Video",
        SectionTitle: "Video",
      };
      var oData = {
        ux_element_type: "Video",
        ux_element_name: "Video",
      };

      if (!!oElement && oElement.length > 0) {
        if (oElement.closest(".home-page-widget-area").length > 0) {
          var oActiveVideo = oElement
            .closest(".home-page-widget-area")
            .find(".video-item.active");
          var bFeatured =
            oActiveVideo.length > 0 &&
            oActiveVideo.hasClass("featured-video-item");
          oLabel = {
            VideoStatus: o.videostatus,
            SectionName: "Homepage Video Playlist",
            SectionTitle: "Featured Playlist",
          };
          oData = {
            ux_element_type: "Video",
            ux_element_name: bFeatured
              ? "Playlist Featured Video"
              : "Playlist Video",
          };
        }
        if (oElement.closest(".video-landing-widget-area").length > 0) {
          var oActiveVideo = oElement
            .closest(".video-landing-widget-area")
            .find(".video-item.active");
          var bFeatured =
            oActiveVideo.length > 0 &&
            oActiveVideo.hasClass("featured-video-item");
          oLabel = {
            VideoStatus: o.videostatus,
            SectionName: "Video Landing Playlist",
            SectionTitle: "Video Playlist",
          };
          oData = {
            ux_element_type: "Video",
            ux_element_name: bFeatured
              ? "Playlist Featured Video"
              : "Playlist Video",
          };
        }
        if (oElement.closest(".featured-video").length > 0) {
          oLabel = {
            VideoStatus: o.videostatus,
            SectionName: "Featured Video",
            SectionTitle: "Featured Video",
          };
          oData = {
            ux_element_type: "Video",
            ux_element_name: "Featured Video",
          };
        }
      }

      if ("videoduration" in o && ~~o.videoduration > 0)
        oLabel["VideoDuration"] = ~~o.videoduration + "";
      if (typeof o.video_title == "string")
        oData["video_title"] = oLabel["VideoName"] = o.video_title;
      if (typeof o.video_account_id == "string")
        oData["video_account_id"] = o.video_account_id;
      if (typeof o.video_id == "string") oData["video_id"] = o.video_id;
      if (typeof o.video_tags == "string") oData["video_tags"] = o.video_tags;
      if ("video_duration" in o && ~~o.video_duration > 0)
        oData["video_duration"] = ~~o.video_duration + "";
      if (typeof o.video_category == "string")
        oData["video_category"] = o.video_category;
      if (typeof o.video_source == "string")
        oData["video_source"] = o.video_source;
      if (typeof o.video_language == "string")
        oData["video_language"] = o.video_language;
      oData["video_auto_played"] = "yes";
      if (typeof o.video_published_date == "string")
        oData["video_published_date"] = o.video_published_date;

      uwGTM.send(
        "event",
        "Content-Engagement",
        "Video",
        JSON.stringify(oLabel),
        { data: oData, non_interactive: "1" }
      );
    });
  },

  refresh: function (oParent) {
    (function ($) {
      if (!$ || typeof uwGTM != "object") return;
      $(function () {
        oParent = $(oParent);
        if (oParent.length < 1) oParent = $(document);

        //search
        uwGTM.watchClick(
          oParent.find("#search-icon-desktop"),
          "Product-Core",
          "SearchStart",
          "",
          {
            data: {
              ux_element_type: "Search",
              ux_element_name: "Search Desktop",
            },
          }
        );
        uwGTM.watchClick(
          oParent.find("#search-icon-mobile"),
          "Product-Core",
          "SearchStart",
          "",
          {
            data: {
              ux_element_type: "Search",
              ux_element_name: "Search Mobile",
            },
          }
        );
        if (oParent.find(".search-page").length > 0) {
          var sKeyword = $.trim(
            oParent.find(".search-page #search-text").val()
          );
          var nResults = ~~$.trim(
            oParent.find(".search-page .search-count strong").text()
          );
          var sAction = nResults > 0 ? "SearchComplete" : "SearchNoResults";
          var oLabel = {
            SearchCategory: $.trim(
              oParent
                .find(
                  ".search-page .search-filter .cat-filter select option[selected]"
                )
                .text()
            ),
            SearchId: Date.now().toString(16),
            Keyword: sKeyword,
            ResultCount: nResults,
          };
          uwGTM.send("event", "Product-Core", sAction, JSON.stringify(oLabel), {
            data: {
              ux_element_type: "Search",
              ux_element_name: "Search Results",
              search_keyword: sKeyword,
              no_of_search_results: nResults.toString(),
            },
          });
        }

        //Nav bar
        oParent.find("#navbarNav li.menu-item a").each(function (i, o) {
          uwGTM.watchClick(
            o,
            "Product-Core",
            "Navigation",
            "Type=" + $.trim($(o).text()),
            {
              data: {
                ux_element_type: "Navigation",
                ux_element_name: "Top Menu Link",
              },
            }
          );
        });
        oParent
          .find("#menu-hamburger-menu li.menu-item a")
          .each(function (i, o) {
            uwGTM.watchClick(
              o,
              "Product-Core",
              "Navigation",
              "Type=" + $.trim($(o).text()),
              {
                data: {
                  ux_element_type: "Navigation",
                  ux_element_name: "Hamburger Menu Link",
                },
              }
            );
          });

        //Sponsored highlights
        oParent
          .find(".widget_uwp_widgets .sponsored-highlights li")
          .each(function (i, o) {
            var sTitle = $.trim($(o).find(".title").text());
            var oLabel = {
              SectionName: "Sponsored Highlights",
              SectionTitle: "Sponsored Highlights",
              ArticleName: sTitle,
              Position: i + 1,
            };
            uwGTM.watchLazy(
              o,
              "Content-Engagement",
              "Impression",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Sponsored Highlights",
                  ux_element_name: "Sponsored Highlights",
                },
              }
            );
            uwGTM.watchClick(
              o,
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Sponsored Highlights",
                  ux_element_name: "Sponsored Highlights",
                },
              }
            );
          });

        //Editor's picks
        oParent
          .find(".widget_uwp_widgets .editors-pick li")
          .each(function (i, o) {
            var sTitle = $.trim($(o).find(".title").text());
            var oLabel = {
              SectionName: "Editors Picks",
              SectionTitle: "Editor's Picks",
              ArticleName: sTitle,
              Position: i + 1,
            };
            uwGTM.watchLazy(
              o,
              "Content-Engagement",
              "Impression",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Editors Picks",
                  ux_element_name: "Editors Picks",
                },
              }
            );
            uwGTM.watchClick(
              o,
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Editors Picks",
                  ux_element_name: "Editors Picks",
                },
              }
            );
          });

        //Native inlines
        oParent.find(".story.native_inline_ads").each(function (i, o) {
          var sTitle = $.trim($(o).find(".title").text());
          var oLabel = {
            SectionName: "Listing",
            SectionTitle: "Latest",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchLazy(
            o,
            "Content-Engagement",
            "Impression",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Native Inline",
                ux_element_name: "Native Inline Ad",
              },
            }
          );
          uwGTM.watchClick(
            $(o).find("a:not(.cat)"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Native Inline",
                ux_element_name: "Native Inline Ad",
              },
            }
          );
        });
        oParent.find(".cb-list.native_inline_ads").each(function (i, o) {
          var sTitle = $.trim($(o).find(".title").text());
          var oLabel = {
            SectionName: "Content Block",
            SectionTitle: "Content Block",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchLazy(
            o,
            "Content-Engagement",
            "Impression",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Native Inline",
                ux_element_name: "Native Inline Ad",
              },
            }
          );
          uwGTM.watchClick(
            $(o).find("a:not(.cat)"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Native Inline",
                ux_element_name: "Native Inline Ad",
              },
            }
          );
        });

        //Content Hub Widget
        oParent.find(".contenthub-slider .slick-slider").each(function (i, o) {
          var sTitle = $.trim($(o).find(".article-title").text());
          var sContenthubTitle = $.trim(
            oParent.find(".contenthub-widget h1.text-center").text()
          );
          var oLabel = {
            SectionName: "Content Hub Widget",
            SectionTitle: sContenthubTitle,
            ArticleName: sTitle,
            Position: i + 1,
          };
          if ($(o).hasClass("native_inline_ads")) {
            uwGTM.watchLazy(
              o,
              "Content-Engagement",
              "Impression",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Native Inline",
                  ux_element_name: "Native Inline Ad",
                },
              }
            );
            uwGTM.watchClick(
              $(o).find("a"),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Native Inline",
                  ux_element_name: "Native Inline Ad",
                },
              }
            );
          } else {
            uwGTM.watchClick(
              $(o).find("a"),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Content Hub Link",
                  ux_element_name: "Content Hub Slide",
                },
              }
            );
          }
        });
        oParent.find(".contenthub-widget").each(function (i, o) {
          var sTitle = $.trim($(o).find("h1.text-center").text());
          var oLabel = {
            SectionName: "Content Hub Widget",
            SectionTitle: sTitle,
          };
          uwGTM.watchClick(
            $(o).find("h1.text-center a"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Content Hub Link",
                ux_element_name: "Content Hub Title",
              },
            }
          );
          uwGTM.watchClick(
            $(o).find(".view-more-slide a"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Content Hub Link",
                ux_element_name: "Content Hub View More",
              },
            }
          );
        });

        //Content Hub Native Inline
        oParent
          .find(".single-content_hub .contenthub_native_post")
          .each(function (i, o) {
            var sTitle = $.trim($(o).find(".post-title").text());
            var sContenthubTitle = "Section 1";
            if ($(o).closest(".two-col-post-big").length > 0)
              sContenthubTitle = "Section 2";
            if ($(o).closest(".content-hub-tcp-container").length > 0)
              sContenthubTitle = "Section 3";
            var oLabel = {
              SectionName: "Content Hub Articles",
              SectionTitle: sContenthubTitle,
              ArticleName: sTitle,
              Position: i + 1,
            };
            uwGTM.watchLazy(
              o,
              "Content-Engagement",
              "Impression",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Native Inline",
                  ux_element_name: "Native Inline Ad",
                },
              }
            );
            uwGTM.watchClick(
              $(o).find("a"),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Native Inline",
                  ux_element_name: "Native Inline Ad",
                },
              }
            );
          });

        //Brand Page Native Inline
        oParent
          .find(".single-featured .contenthub_native_post")
          .each(function (i, o) {
            var sTitle = $.trim($(o).find(".post-title").text());
            var sContenthubTitle = "Section 1";
            if ($(o).closest(".two-col-post-big").length > 0)
              sContenthubTitle = "Section 2";
            if ($(o).closest(".content-hub-tcp-container").length > 0)
              sContenthubTitle = "Section 3";
            var oLabel = {
              SectionName: "Brand Articles",
              SectionTitle: sContenthubTitle,
              ArticleName: sTitle,
              Position: i + 1,
            };
            uwGTM.watchLazy(
              o,
              "Content-Engagement",
              "Impression",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Native Inline",
                  ux_element_name: "Native Inline Ad",
                },
              }
            );
            uwGTM.watchClick(
              $(o).find("a"),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Native Inline",
                  ux_element_name: "Native Inline Ad",
                },
              }
            );
          });

        //Topics list
        oParent.find(".topics .topics-list a").each(function (i, o) {
          var sTitle = $.trim($(o).text());
          var oLabel = {
            SectionName: "Topics Filter Tags",
            SectionTitle: "Topics",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            $(o),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Topics Link",
                ux_element_name: "Topics Link",
              },
            }
          );
        });

        //Read Next / Related posts
        oParent.find(".related-posts .post-desc a").each(function (i, o) {
          var sTitle = $.trim($(o).text());
          var oLabel = {
            SectionName: "Related Posts",
            SectionTitle: "Read Next",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            $(o),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Related Posts",
                ux_element_name: "Read Next",
              },
            }
          );
        });

        //Shopping Button
        oParent.find(".shopbtn-wrapper a").each(function (i, o) {
          var sTitle = $.trim($(o).text());
          var oLabel = {
            SectionName: "Shopping Button",
            SectionTitle: "Shop Button",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            $(o),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Shopping Button",
                ux_element_name: "Shop Button",
              },
            }
          );
        });

        //From The Magazine
        oParent.find(".from-the-magazine .copy").each(function (i, o) {
          var sTitle = $.trim($(o).find("h2").text());
          var oLabel = {
            SectionName: "From The Magazine",
            SectionTitle: "Read On",
            ArticleName: sTitle,
          };
          uwGTM.watchClick(
            $(o),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "From The Magazine",
                ux_element_name: "Read On",
              },
            }
          );
        });

        //Trending
        oParent.find(".trending-slider .slick-slider").each(function (i, o) {
          var sTitle = $.trim($(o).find("a p").text());
          var oLabel = {
            SectionName: "Trending",
            SectionTitle: "Trending",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            $(o).find("> a"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Trending Link",
                ux_element_name: "Trending Slide",
              },
            }
          );
        });

        //Latest In Series
        oParent
          .find(".latest-in-series .items-slider .item")
          .each(function (i, o) {
            var sTitle = $.trim($(o).find(".info .title").text());
            var oLabel = {
              SectionName: "Latest In Series",
              SectionTitle: "Latest",
              ArticleName: sTitle,
              Position: i + 1,
            };
            uwGTM.watchClick(
              $(o).find(".info .title, .thumb-wrapper a"),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Latest In Series",
                  ux_element_name: "Latest",
                },
              }
            );
          });

        //Tags in articles
        oParent.find(".tag-list li a").each(function (i, o) {
          var sTitle = $.trim($(o).text());
          var oLabel = {
            SectionName: "Tags",
            SectionTitle: "Tags",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            $(o),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            { data: { ux_element_type: "Tags List", ux_element_name: "Tags" } }
          );
        });

        //Homepage Video Playlist links
        oParent
          .find(".home-page-widget-area .video-playlist .video-info")
          .each(function (i, o) {
            jQuery(o)
              .find("a")
              .on("click", function (e) {
                var oParent = jQuery(this).parent(".video-info");
                var oTitle = oParent.find(".title");
                var sTitle = $.trim(oTitle.text());
                var ux_element_type = "Video Link";
                var ux_element_name = "Video Title";

                var sPosition = ~~oTitle.data("position") + "";
                if (jQuery(this).text().toLowerCase() == "read on") {
                  ux_element_name = "Read On";
                }
                var oLabel = {
                  SectionName: "Homepage Video Playlist",
                  SectionTitle: "Featured Playlist",
                  ArticleName: sTitle,
                  Position: sPosition,
                };
                uwGTM.send(
                  "event",
                  "Content-Engagement",
                  "Click",
                  JSON.stringify(oLabel),
                  {
                    data: {
                      ux_element_type: ux_element_type,
                      ux_element_name: ux_element_name,
                    },
                  }
                );
              });
          });

        //Video landing Video Playlist links
        oParent
          .find(".video-landing-widget-area .video-playlist .video-info")
          .each(function (i, o) {
            jQuery(o)
              .find("a")
              .on("click", function (e) {
                var oParent = jQuery(this).parent(".video-info");
                var oTitle = oParent.find(".title");
                var sTitle = $.trim(oTitle.text());
                var ux_element_type = "Video Link";
                var ux_element_name = "Video Title";

                var sPosition = ~~oTitle.data("position") + "";
                if (jQuery(this).text().toLowerCase() == "read on") {
                  ux_element_name = "Read On";
                }
                var oLabel = {
                  SectionName: "Video Landing Playlist",
                  SectionTitle: "Video Playlist",
                  ArticleName: sTitle,
                  Position: sPosition,
                };
                uwGTM.send(
                  "event",
                  "Content-Engagement",
                  "Click",
                  JSON.stringify(oLabel),
                  {
                    data: {
                      ux_element_type: ux_element_type,
                      ux_element_name: ux_element_name,
                    },
                  }
                );
              });
          });

        //Featured Video
        oParent
          .find(".widget-box.featured-video .info a")
          .each(function (i, o) {
            var sTitle = $.trim($(o).text());
            var oLabel = {
              SectionName: "Featured Video",
              SectionTitle: "Featured Video",
              ArticleName: sTitle,
            };
            uwGTM.watchClick(
              $(o),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Featured Video Link",
                  ux_element_name: "Featured Video Link",
                },
              }
            );
          });

        //video cat filter
        oParent.find(".video-cat-filter li").each(function (i, o) {
          var sTitle = $.trim($(o).text());
          var oLabel = {
            SectionName: "Videos",
            SectionTitle: "Latest Videos",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchClick(
            $(o),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Video Cat Filter",
                ux_element_name: "Video Category Filter",
              },
            }
          );
        });

        //sponsored video
        oParent
          .find(".latest-videos .video-list .video-item.sponsored-item")
          .each(function (i, o) {
            var sTitle = $.trim($(o).find(".title").text());
            var oLabel = {
              SectionName: "Videos",
              SectionTitle: "Latest Videos",
              ArticleName: sTitle,
              Position: i + 1,
            };
            uwGTM.watchLazy(
              $(o),
              "Content-Engagement",
              "Impression",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Sponsored Video",
                  ux_element_name: "Sponsored Video",
                },
              }
            );
            uwGTM.watchClick(
              $(o).find("a:not(.category)"),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Sponsored Video",
                  ux_element_name: "Sponsored Video",
                },
              }
            );
          });

        //featured event / promo anchorblocks section
        oParent
          .find(".ep-page .anchorblock .featured-ep")
          .each(function (i, o) {
            var sTitle = $.trim($(o).find(".details p a").text());
            var oLabel = {
              SectionName: "Anchor Block",
              SectionTitle: "Anchor Block",
              ArticleName: sTitle,
              Position: i + 1,
            };
            uwGTM.watchLazy(
              $(o),
              "Content-Engagement",
              "Impression",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Events and Promos",
                  ux_element_name: "Featured Event Promo",
                },
              }
            );
            uwGTM.watchClick(
              $(o).find("a"),
              "Content-Engagement",
              "Click",
              JSON.stringify(oLabel),
              {
                data: {
                  ux_element_type: "Events and Promos",
                  ux_element_name: "Featured Event Promo",
                },
              }
            );
          });

        //featured event / promo in listing section
        oParent.find(".ep-page .ep-list .featured-ep").each(function (i, o) {
          var sTitle = $.trim($(o).find(".detail .title").text());
          var oLabel = {
            SectionName: "Events & Promos List",
            SectionTitle: "Events & Promos",
            ArticleName: sTitle,
            Position: i + 1,
          };
          uwGTM.watchLazy(
            $(o),
            "Content-Engagement",
            "Impression",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Events and Promos",
                ux_element_name: "Featured Event Promo",
              },
            }
          );
          uwGTM.watchClick(
            $(o).find("a"),
            "Content-Engagement",
            "Click",
            JSON.stringify(oLabel),
            {
              data: {
                ux_element_type: "Events and Promos",
                ux_element_name: "Featured Event Promo",
              },
            }
          );
        });
      });
    })(jQuery || false);

    uwGTM.initLazy();
  },
};

uwGTM.send("pageview");
