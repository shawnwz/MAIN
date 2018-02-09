/**
 * @class app.gui.controls.SearchQueryCallToActionList
 */

app.gui.controls.SearchQueryCallToActionList = function SearchQueryCallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchQueryCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.SearchQueryCallToActionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SearchQueryCallToActionList.prototype._fetch = function _fetch() {
	this.logEntry();
	var items = ["ctaClearRecent"];
	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};

