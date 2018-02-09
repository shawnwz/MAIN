/* Implementation of the HomeSearch View, which acts as the view controller */

app.views.HomeSearch = function HomeSearch() {};
o5.gui.controls.Control.registerAppControl(app.views.HomeSearch, o5.gui.controls.View, null, true);

/**
 * @method createdCallback
 * @private
 */
app.views.HomeSearch.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	$util.ControlEvents.on("app-home-search", "fetch", function () {
		$util.ControlEvents.fire("app-home-search:homeSearchRecent", "fetch");
		$util.ControlEvents.fire("app-home-search:homeSearchPopular", "fetch");
		$util.ControlEvents.fire("app-home-search:searchEntry", "clear");
		$util.ControlEvents.fire("app-home-search:searchKeysTable", "populate", "ABC");
	}, this);
	this.onshow = this._onShow;
	this.onfocus = this._onFocus;
	this._searchView = this.querySelector('#search');
	$util.Translations.update();
	this.logExit();
};

/**
 * @method attachedCallback
 * @private
 */
app.views.HomeSearch.prototype.attachedCallback = function attachedCallback() {
	this.logEntry();
	$util.Events.fire("app:view:attached", "HomeSearch");
	this.logExit();
};

/**
 * @method _onFocus
 */
app.views.HomeSearch.prototype._onFocus = function _onFocus() {
	this.logEntry();
	$util.ControlEvents.fire("app-search-query", "fetch", '');
	setTimeout(function() {
		$util.Events.fire("app:navigate:to", "searchQuery");
	}, 300);
	this.logExit();
};

/**
 * @method _onShow
 */
app.views.HomeSearch.prototype._onShow = function _onShow() {
	this.logEntry();
	this._searchView.style.display = 'block';
	$util.ControlEvents.fire("app-home-search:searchButtonsList", "populate", "123");
	this.logExit();
};
