SPHMoverlay = {
	body: false,
	url: false,
	prestitialdiv: false,
	getBody: function() {
		if (this.body !== false) return this.body;
		var a=document.getElementsByTagName('body');
		if(a.length < 1)return false;
		this.body = a[0];
		return this.body;
	},
	hasClass: function (className) {
		if (!this.getBody()) return false;
		return new RegExp(' ' + className + ' ').test(' ' + this.body.className + ' ');
	},
	addClass: function (className) {
		if (!this.getBody()) return false;
		if (!this.hasClass(className)) {
			this.body.className += ' ' + className;
		}
	},
	removeClass: function (className) {
		if (!this.getBody()) return false;
		var newClass = ' ' + this.body.className.replace( /[\t\r\n]/g, ' ') + ' ';
		if (this.hasClass(className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			this.body.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	},
	on: function(){
		this.addClass('gotoverlay');
	},
	off: function() {
		if (!!this.url && typeof(this.url) == 'string') {
			window.location.href = this.url;
			return;
		}
		this.removeClass('gotoverlay');
		this.removeClass('gotads');
	},
	ad: function() {
		this.addClass('gotads');
	},
	fail: function() {
		this.addClass('gotfail');
	},
	initcheck: function(b) {
		if(typeof(uwAdTesting)!='string') {
			this.off();
			return;
		}
		this.on();
		setTimeout(function(){if(!SPHMoverlay.hasClass('gotads'))SPHMoverlay.off();},(!!b?15000:5000));
	}
}

function continueToSite() {
	SPHMoverlay.off();
}

window.addEventListener('message', function(e){
	if (typeof(window.SPHMoverlay)!='object'||!('off' in SPHMoverlay)) return;
	if (e.data === 'close' || e.data === 'bz-interstitial-close') {
		var o;
		if (typeof(SPHMoverlay.prestitialdiv) == 'string' && !!(o = document.getElementById(SPHMoverlay.prestitialdiv))) {
			o.style.height = '0';
			o.style.overflow = 'hidden';
		}
		SPHMoverlay.off();
	}
}, false);
