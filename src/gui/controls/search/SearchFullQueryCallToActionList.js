/**
 * @class app.gui.controls.SearchFullQueryCallToActionList
 */

app.gui.controls.SearchFullQueryCallToActionList = function SearchFullQueryCallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchFullQueryCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.SearchFullQueryCallToActionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SearchFullQueryCallToActionList.prototype._fetch = function _fetch() {
	this.logEntry();
	var items = [ "ctaSearchClose", "ctaFilter" ];

	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};
