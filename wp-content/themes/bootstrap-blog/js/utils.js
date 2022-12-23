
//common utils
var Utils = {
    getQueryString: function (name) {
        var regexS = "[\\?&]" + name + "=([^&#]*)",
            regex = new RegExp(regexS),
            results = regex.exec(window.location.search);
        if (results === null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    },
    //adapted from underscore js, taken from https://stackoverflow.com/questions/27078285/simple-throttle-in-js
    throttle: function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = Date.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    },
    //from https://stackoverflow.com/questions/24004791/can-someone-explain-the-debounce-function-in-javascript
    debounce: function (func, wait, immediate) {
        var timeout;

        return function () {
            var context = this,
                args = arguments;

            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            }, wait);
            if (callNow) func.apply(context, args);
        }
    },
    isMobileView: function () {
        return window.matchMedia("(max-width:767px)").matches;
    },

    isTabletView: function () {
        return window.matchMedia("(min-width:768px) and (max-width:1059px)").matches;
    },

    isDesktopView: function () {
        return window.matchMedia("(min-width:1060px)").matches;
    },
    //from https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
    escapeHtml: function (string) {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    },
    /***
     * options consists of:
     * - async 
     * - url 
     * - cb : callback  
     */
    loadScript: function (options) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if (options.async)
            script.async = true;
        script.src = options.url;
        script.onload = options.cb;
        document.body.appendChild(script);
    },

    /***
    * options consists of:
    * - async 
    * - urls 
    * - cb : callback  
    */
    loadScripts: function (options) {
        var urls = options.urls;

        function internalLoad(index) {
            Utils.loadScript({
                async: options.async,
                url: urls[index],
                cb: function () {
                    if (index < urls.length - 1) {
                        internalLoad(index + 1);
                    } else {
                        options.cb();
                    }
                }
            })
        }

        internalLoad(0);
    },

    truncateString: function (value, length) {
        if (!value) return value;

        if (value.length <= length) return value;

        return value.substring(0, length) + ' ...';
    },
    /**
     * set processed widget 
     */
    flagWidgetAsProcessed: function (element) {
        var $el = element.nodeType ? jQuery(element) : element;

        $el.data('processed', 1);
    },
    isWidgetProcessed: function (element) {
        var $el = element.nodeType ? jQuery(element) : element;

        return $el.data('processed') === 1;
    },

    /**
     * create scrollable area on mobile, and carousel on desktop
     * @param {*} options 
     * - rootElement
     * - wrapperSelector 
     * - itemsSelector
     * - itemSelector
     * - prevSelector
     * - nextSelector
     * - carouselSlidesToShow
     */
    createScrollableArea: function (options) {
        var defaultOptions = {
            wrapperSelector: '.items-wrapper',
            itemsSelector: '.items',
            itemSelector: '.item',
            prevSelector: '.prev',
            nextSelector: '.next',
            carouselSlidesToShow: 3,
            carouselSlidesToScroll: 1
        };

        var args = jQuery.extend({}, defaultOptions, options);
        var $root = jQuery(args.rootElement);
        var $wrapper = $root.find(args.wrapperSelector);
        var $items = $root.find(args.itemsSelector);
        var $allItems = $root.find(args.itemSelector);
        var $prev = $root.find(args.prevSelector);
        var $next = $root.find(args.nextSelector);
        var scroll = null;
        var $slick = null;

        function adjustWidth() {
            var totalWidth = 0;
            $allItems.each(function (index, item) {
                totalWidth += jQuery(item).outerWidth(true);
            });
            $items.css('width', '' + (totalWidth + 40) + 'px');
        }

        function adjustLayout() {
            if (!Utils.isDesktopView()) {
                if ($slick !== null) {
                    $slick.slick('unslick');
                    $slick = null;
                }

                if (args.cb && typeof args.cb.adjustArea === 'function') {
                    args.cb.adjustArea();
                }

                adjustWidth();
                $root.show();

                if (scroll !== null) {
                    scroll.refresh();
                }
                else {
                    scroll = new IScroll($wrapper[0], {
                        scrollX: true,
                        scrollbars: true,
                        interactiveScrollbars: true,
                        fadeScrollbars: true,
                        hideScrollbars: true,
                        scrollY: false,
                        eventPassthrough: true,
                        preventDefault: false,
                        bindToWrapper: true
                    });
                }
            } else {
                if ($slick !== null)
                    return;

                if (scroll !== null) {
                    scroll.destroy();
                    jQuery(scroll.scroller).attr('style', '');
                    scroll = null;
                }

                if (args.cb && typeof args.cb.adjustArea === 'function') {
                    args.cb.adjustArea();
                }

                $root.show();

                $slick = $items.slick({
                    slidesToShow: args.carouselSlidesToShow,
                    slidesToScroll: args.carouselSlidesToScroll,
                    prevArrow: $prev,
                    nextArrow: $next,
                    infinite: false
                });
            }
        }

        adjustLayout();

        jQuery(window).on('resize orientationchange pageresize', adjustLayout);
    },

    onYouTubeIframeAPIReady: function (cb) {
        if(window.YT && window.YT.Player){
            cb();
            return;
        }

        jQuery(document).on('uw_youtube_api_ready', function () {
            cb();
        });

        if (! window.onYouTubeIframeAPIReady) {
            window.onYouTubeIframeAPIReady = function () {
                jQuery(document).trigger('uw_youtube_api_ready');
            };
        }
    }
}
