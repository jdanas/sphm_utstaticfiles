//jquery.event.move.js
!function(e){"function"==typeof define&&define.amd?define([],e):"undefined"!=typeof module&&null!==module&&module.exports?module.exports=e:e()}(function(){var e=Object.assign||window.jQuery&&jQuery.extend,t=8,n=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){return window.setTimeout(function(){e()},25)};!function(){if("function"==typeof window.CustomEvent)return!1;function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n}e.prototype=window.Event.prototype,window.CustomEvent=e}();var o={textarea:!0,input:!0,select:!0,button:!0},i={move:"mousemove",cancel:"mouseup dragstart",end:"mouseup"},a={move:"touchmove",cancel:"touchend",end:"touchend"},u=/\s+/,c={bubbles:!0,cancelable:!0},r="function"==typeof Symbol?Symbol("events"):{};function d(e){return e[r]||(e[r]={})}function m(e,t,n,o,i){t=t.split(u);var a,c=d(e),r=t.length;function m(e){n(e,o)}for(;r--;)(c[a=t[r]]||(c[a]=[])).push([n,m]),e.addEventListener(a,m)}function f(e,t,n,o){t=t.split(u);var i,a,c,r=d(e),m=t.length;if(r)for(;m--;)if(a=r[i=t[m]])for(c=a.length;c--;)a[c][0]===n&&(e.removeEventListener(i,a[c][1]),a.splice(c,1))}function v(t,n,o){var i=function(e){return new CustomEvent(e,c)}(n);o&&e(i,o),t.dispatchEvent(i)}function s(e){var t=e,o=!1,i=!1;function a(e){o?(t(),n(a),i=!0,o=!1):i=!1}this.kick=function(e){o=!0,i||a()},this.end=function(e){var n=t;e&&(i?(t=o?function(){n(),e()}:e,o=!0):e())}}function l(){}function p(e){e.preventDefault()}function g(e,t){var n,o;if(e.identifiedTouch)return e.identifiedTouch(t);for(n=-1,o=e.length;++n<o;)if(e[n].identifier===t)return e[n]}function h(e,t){var n=g(e.changedTouches,t.identifier);if(n&&(n.pageX!==t.pageX||n.pageY!==t.pageY))return n}function X(e,t){b(e,t,e,y)}function Y(e,t){y()}function y(){f(document,i.move,X),f(document,i.cancel,Y)}function w(e){f(document,a.move,e.touchmove),f(document,a.cancel,e.touchend)}function b(e,n,o,i){var a=o.pageX-n.pageX,u=o.pageY-n.pageY;a*a+u*u<t*t||function(e,t,n,o,i,a){var u=e.targetTouches,c=e.timeStamp-t.timeStamp,r={altKey:e.altKey,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,startX:t.pageX,startY:t.pageY,distX:o,distY:i,deltaX:o,deltaY:i,pageX:n.pageX,pageY:n.pageY,velocityX:o/c,velocityY:i/c,identifier:t.identifier,targetTouches:u,finger:u?u.length:1,enableMove:function(){this.moveEnabled=!0,this.enableMove=l,e.preventDefault()}};v(t.target,"movestart",r),a(t)}(e,n,o,a,u,i)}function T(e,t){var n=t.timer;t.touch=e,t.timeStamp=e.timeStamp,n.kick()}function E(e,t){var n=t.target,o=t.event,a=t.timer;f(document,i.move,T),f(document,i.end,E),k(n,o,a,function(){setTimeout(function(){f(n,"click",p)},0)})}function S(e,t){var n=t.target,o=t.event,i=t.timer;g(e.changedTouches,o.identifier)&&(!function(e){f(document,a.move,e.activeTouchmove),f(document,a.end,e.activeTouchend)}(t),k(n,o,i))}function k(e,t,n,o){n.end(function(){return v(e,"moveend",t),o&&o()})}if(m(document,"mousedown",function(e){(function(e){return 1===e.which&&!e.ctrlKey&&!e.altKey})(e)&&(function(e){return!!o[e.target.tagName.toLowerCase()]}(e)||(m(document,i.move,X,e),m(document,i.cancel,Y,e)))}),m(document,"touchstart",function(e){if(!o[e.target.tagName.toLowerCase()]){var t=e.changedTouches[0],n={target:t.target,pageX:t.pageX,pageY:t.pageY,identifier:t.identifier,touchmove:function(e,t){!function(e,t){var n=h(e,t);n&&b(e,t,n,w)}(e,t)},touchend:function(e,t){!function(e,t){g(e.changedTouches,t.identifier)&&w(t)}(e,t)}};m(document,a.move,n.touchmove,n),m(document,a.cancel,n.touchend,n)}}),m(document,"movestart",function(e){if(!e.defaultPrevented&&e.moveEnabled){var t={startX:e.startX,startY:e.startY,pageX:e.pageX,pageY:e.pageY,distX:e.distX,distY:e.distY,deltaX:e.deltaX,deltaY:e.deltaY,velocityX:e.velocityX,velocityY:e.velocityY,identifier:e.identifier,targetTouches:e.targetTouches,finger:e.finger},n={target:e.target,event:t,timer:new s(function(e){(function(e,t,n){var o=n-e.timeStamp;e.distX=t.pageX-e.startX,e.distY=t.pageY-e.startY,e.deltaX=t.pageX-e.pageX,e.deltaY=t.pageY-e.pageY,e.velocityX=.3*e.velocityX+.7*e.deltaX/o,e.velocityY=.3*e.velocityY+.7*e.deltaY/o,e.pageX=t.pageX,e.pageY=t.pageY})(t,n.touch,n.timeStamp),v(n.target,"move",t)}),touch:void 0,timeStamp:e.timeStamp};void 0===e.identifier?(m(e.target,"click",p),m(document,i.move,T,n),m(document,i.end,E,n)):(n.activeTouchmove=function(e,t){!function(e,t){var n=t.event,o=t.timer,i=h(e,n);i&&(e.preventDefault(),n.targetTouches=e.targetTouches,t.touch=i,t.timeStamp=e.timeStamp,o.kick())}(e,t)},n.activeTouchend=function(e,t){S(e,t)},m(document,a.move,n.activeTouchmove,n),m(document,a.end,n.activeTouchend,n))}}),window.jQuery){var K="startX startY pageX pageY distX distY deltaX deltaY velocityX velocityY".split(" ");jQuery.event.special.movestart={setup:function(){return m(this,"movestart",j),!1},teardown:function(){return f(this,"movestart",j),!1},add:q},jQuery.event.special.move={setup:function(){return m(this,"movestart",C),!1},teardown:function(){return f(this,"movestart",C),!1},add:q},jQuery.event.special.moveend={setup:function(){return m(this,"movestart",Q),!1},teardown:function(){return f(this,"movestart",Q),!1},add:q}}function j(e){e.enableMove()}function C(e){e.enableMove()}function Q(e){e.enableMove()}function q(e){var t=e.handler;e.handler=function(e){for(var n,o=K.length;o--;)e[n=K[o]]=e.originalEvent[n];t.apply(this,arguments)}}});

//jquery.twentytwenty.js
!function(t){t.fn.twentytwenty=function(e){e=t.extend({default_offset_pct:.5,orientation:"horizontal",before_label:"Before",after_label:"After",no_overlay:!1,move_slider_on_hover:!1,move_with_handle_only:!0,click_to_move:!1},e);return this.each(function(){var n=e.default_offset_pct,a=t(this),i=e.orientation,o="vertical"===i?"down":"left",s="vertical"===i?"up":"right";if(a.wrap("<div class='twentytwenty-wrapper twentytwenty-"+i+"'></div>"),!e.no_overlay){a.append("<div class='twentytwenty-overlay'></div>");var r=a.find(".twentytwenty-overlay");r.append("<div class='twentytwenty-before-label' data-content='"+e.before_label+"'></div>"),r.append("<div class='twentytwenty-after-label' data-content='"+e.after_label+"'></div>")}var c=a.find("img:first"),l=a.find("img:last");a.append("<div class='twentytwenty-handle'></div>");var d=a.find(".twentytwenty-handle");d.append("<span class='twentytwenty-"+o+"-arrow'></span>"),d.append("<span class='twentytwenty-"+s+"-arrow'></span>"),a.addClass("twentytwenty-container"),c.addClass("twentytwenty-before"),l.addClass("twentytwenty-after");var w=function(t){var e,n,o,s=(e=t,n=c.width(),o=c.height(),{w:n+"px",h:o+"px",cw:e*n+"px",ch:e*o+"px"});d.css("vertical"===i?"top":"left","vertical"===i?s.ch:s.cw),function(t){"vertical"===i?(c.css("clip","rect(0,"+t.w+","+t.ch+",0)"),l.css("clip","rect("+t.ch+","+t.w+","+t.h+",0)")):(c.css("clip","rect(0,"+t.cw+","+t.h+",0)"),l.css("clip","rect(0,"+t.w+","+t.h+","+t.cw+")")),a.css("height",t.h)}(s)},f=function(t,e){var n,a,o;return n="vertical"===i?(e-p)/h:(t-v)/y,a=0,o=1,Math.max(a,Math.min(o,n))};t(window).on("resize.twentytwenty",function(t){w(n)});var v=0,p=0,y=0,h=0,u=function(t){(t.distX>t.distY&&t.distX<-t.distY||t.distX<t.distY&&t.distX>-t.distY)&&"vertical"!==i?t.preventDefault():(t.distX<t.distY&&t.distX<-t.distY||t.distX>t.distY&&t.distX>-t.distY)&&"vertical"===i&&t.preventDefault(),a.addClass("active"),v=a.offset().left,p=a.offset().top,y=c.width(),h=c.height()},_=function(t){a.hasClass("active")&&(n=f(t.pageX,t.pageY),w(n))},m=function(){a.removeClass("active")},g=e.move_with_handle_only?d:a;g.on("movestart",u),g.on("move",_),g.on("moveend",m),e.move_slider_on_hover&&(a.on("mouseenter",u),a.on("mousemove",_),a.on("mouseleave",m)),d.on("touchmove",function(t){t.preventDefault()}),a.find("img").on("mousedown",function(t){t.preventDefault()}),e.click_to_move&&a.on("click",function(t){v=a.offset().left,p=a.offset().top,y=c.width(),h=c.height(),n=f(t.pageX,t.pageY),w(n)}),t(window).trigger("resize.twentytwenty")})}}(jQuery);

//block before and after
//@TODO move the above dependencies into a core js file
jQuery(function ($) {
    /**
     * initializeBlock
     *
     * Adds custom JavaScript to the block HTML.
     *
     * @date    30/09/20
     * @since   0.0.0
     *
     * @param   object $block The block jQuery element.
     * @param   object attributes The block attributes (only available when editing).
     * @return  void
     */
    
    var initializeBlockBAImage = function() {
        if(jQuery('.twentytwenty-container').length > 0){
            // Initialize each block on page load (front end).
            jQuery('.twentytwenty-container').each(function(){
                var $this = jQuery(this);
    
                $this.twentytwenty({
                    default_offset_pct: $this.data('offsetPct'), // How much of the before image is visible when the page loads
                    orientation: $this.data('orientation'), // Orientation of the before and after images ('horizontal' or 'vertical')
                    before_label: $this.data('beforeText'), // Set a custom before label
                    after_label: $this.data('afterText'), // Set a custom after label
                    no_overlay: $this.data('noOverlay') //Do not show the overlay with before and after
                });
            });
        }
    }
    
    //block on page load (front end).
    $(document).ready(function(){
        initializeBlockBAImage();
    });
});