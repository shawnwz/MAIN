/**
 * @class app.gui.controls.SynopsisChannelLogo
 */

app.gui.controls.SynopsisChannelLogo = function SynopsisChannelLogo () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisChannelLogo, app.gui.controls.HtmlItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisChannelLogo.prototype.createdCallback = function createdCallback () {
	this.superCall();
};

/**
 * @method _fetch
 */
app.gui.controls.SynopsisChannelLogo.prototype._fetch = function _fetch (chtag) {
	var me = this;

	if (chtag) {
		$service.EPG.lcnTagMapper.byTag(chtag).then(function (data) {
			me.fireControlEvent("populate", data);
		});
	}
};

/**
 * @method populate
 */
app.gui.controls.SynopsisChannelLogo.prototype._populate = function _populate (data) {
	if (data && data.logo && data.logo !== "undefined") { //@hdk fix this! Other places wont check for the "undefined" string!
		this._data = data;
		this.style.backgroundImage = "url('" + data.logo + "')";
	} else {
		this._data = null;
		this.style.backgroundImage = "";
	}
};


