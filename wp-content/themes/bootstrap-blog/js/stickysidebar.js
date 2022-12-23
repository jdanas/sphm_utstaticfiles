var uwStickySidebar = {
	a: [],
	handler: function(e) {
		if (uwStickySidebar.a.length < 1) return;
		for(var i=0;i<uwStickySidebar.a.length;i++) {
			var nWinTop = jQuery(window).scrollTop();
			var nWinBottom = nWinTop + window.innerHeight;
			var o = uwStickySidebar.a[i].element;
			var oParent = o.parent();
			var nParentPadding = oParent.outerHeight(true) - oParent.height();
			var nParentTop = oParent.offset().top;
			var nParentBottom = nParentTop + oParent.height();
			var nHeight = o.outerHeight(true);
			var nTop = uwStickySidebar.a[i].top;
			var nBottom = nTop + nHeight;
			var nLeft = uwStickySidebar.a[i].left;
			var nWidth = o.width();
			if (nWidth > nLeft || nHeight > oParent.height() - 60) {
				//give 10px allowance
				o.removeClass('fixed').removeClass('bottom').removeClass('top').css({'left':'', 'top':''});
				continue;
			}
			if (!o.hasClass('fixed')) {
				if (uwStickySidebar.a[i].left != o.offset().left) uwStickySidebar.a[i].left = o.offset().left;
				if (uwStickySidebar.a[i].top != o.offset().top) uwStickySidebar.a[i].top = o.offset().top;
			}
			if (nHeight < window.innerHeight) {
				var nMenuHeight = jQuery('header').height();
				if (nWinTop > nParentTop - nMenuHeight) {
					o.addClass('fixed').addClass('top').css({'left':oParent.offset().left, 'top':nMenuHeight, 'bottom':''});
				} else {
					o.removeClass('fixed').removeClass('top').css({'left':'', 'top':'', 'bottom':''});
				}
				if (nParentBottom < nWinTop + nHeight + nMenuHeight) {
					o.addClass('bottom').css({'left':'', 'top':'', 'bottom':nParentPadding });
				} else {
					o.removeClass('bottom').css({'left':oParent.offset().left, 'top':nMenuHeight, 'bottom':''})
					if (!o.hasClass('fixed')) o.css({'left':'', 'top':'', 'bottom':''});
				}
			} else {
				o.removeClass('top').css('top','');
				if (nWinBottom > nBottom) {
					o.addClass('fixed').css({'left':oParent.offset().left, 'top':'', 'bottom':''});
				} else if (nWinBottom <= nBottom) {
					o.removeClass('fixed').css({'left':'', 'top':'', 'bottom':''});
				}
				if (nWinBottom > nParentBottom) {
					o.addClass('bottom').css({'left':'', 'top':'', 'bottom':nParentPadding});
				} else if (nWinBottom <= nParentBottom) {
					o.removeClass('bottom')
					if (!o.hasClass('fixed')) o.css({'left':'', 'top':'', 'bottom':''});
				}
			}
		}
	},
	activate: function(b) {
		window.removeEventListener('scroll', this.handler);
		window.removeEventListener('resize', this.handler);
		if (b !== false) {
			window.addEventListener('scroll', this.handler);
			window.addEventListener('resize', this.handler);
		}
	}
}

