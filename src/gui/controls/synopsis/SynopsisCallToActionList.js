/**
 * @class app.gui.controls.SynopsisCallToActionList
 */

app.gui.controls.SynopsisCallToActionList = function SynopsisCallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.SynopsisCallToActionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SynopsisCallToActionList.prototype._fetch = function _fetch(node) {
	this.logEntry();
	var items = [];

	if (node) {
		//@hdk make this more dynamic
		items = [ "ctaClose", "ctaRecord" ];
	}

	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};

