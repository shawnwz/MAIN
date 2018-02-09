"use strict";

o5.gui.ViewManager.timer = null;

o5.gui.ViewManager.registerViewTimeout = function registerViewTimeout(id, src, cacheStrategy, exitTime) {
	this.logEntry();
	this.registerView(id, src, cacheStrategy);

	if (exitTime) {
		var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + id + '"]');
		if (vw) {
			vw.exitTime = exitTime;
		}
	}
};

o5.gui.ViewManager.stopTimeOut = function stopTimeOut() {
	this.logEntry();
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = null;
	}
};

o5.gui.ViewManager.kickTimeOut = function kickTimeOut(viewWindow) {
	var vw = viewWindow,
		me = this;
	if (!vw) {
		vw = this.activeView.parentElement;
	}
	if (vw && vw.exitTime) {
		this.stopTimeOut();
		this.timer = setTimeout(function() {
			me.navigateToDefault();
		}, vw.exitTime);
	}
};

o5.gui.ViewManager.navigateToTimeout = function navigateToTimeout(id, arg) {
	this.logEntry();
	this.stopTimeOut();
	this.navigateTo(id, arg);

	var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + id + '"]');
	if (vw && vw.exitTime) {
		this.kickTimeOut(vw);
	}
};

o5.gui.ViewManager.openToTimeout = function open (id, arg) {
	this.logEntry();
	this.stopTimeOut();
	this.open(id, arg);

	var vw = this.contextGroupElem.querySelector(':scope > o5-view-window[view="' + id + '"]');
	if (vw && vw.exitTime) {
		this.kickTimeOut(vw);
	}
};

o5.gui.ViewManager.keyHandler = function keyHandler(/*e*/) {
	o5.gui.ViewManager.kickTimeOut(); // kick on each keypress
};

document.addEventListener("keydown", o5.gui.ViewManager.keyHandler, true);
