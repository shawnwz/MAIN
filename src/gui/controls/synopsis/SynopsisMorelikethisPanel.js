/**
 * @class app.gui.controls.SynopsisMorelikethisPanel
 */

app.gui.controls.SynopsisMorelikethisPanel = function SynopsisMorelikethisPanel () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisMorelikethisPanel, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisMorelikethisPanel.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	$util.ControlEvents.on("app-synopsis:directorGridMenu", "exit:left", function () {
		if (this.visible) {
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "select", "last");
			$util.ControlEvents.fire("app-synopsis:synopsisMoreLikeThis", "focus");
		} else { // pass on to the left
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "exit:left");
		}
	}, this);

	$util.ControlEvents.on("app-synopsis:castGridMenu", "exit:left", function () {
		if (this.visible) {
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "select", "last");
			$util.ControlEvents.fire("app-synopsis:synopsisMoreLikeThis", "focus");
		} else { // pass on to the left
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "exit:left");
		}
	}, this);

	$util.ControlEvents.on("app-synopsis:synopsisOverviewActions", "exit:right", function () {
		if (this.visible) {
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "select", "first");
			$util.ControlEvents.fire("app-synopsis:synopsisMoreLikeThis", "focus");
		} else { // pass on to the right
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "exit:right");
		}
	}, this);

	$util.ControlEvents.on("app-synopsis:synopsisEpisodeActions", "exit:right", function () {
		if (this.visible) {
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "select", "first");
			$util.ControlEvents.fire("app-synopsis:synopsisMoreLikeThis", "focus");
		} else { // pass on to the right
			$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "exit:right");
		}
	}, this);

	this._hiddenClass = "hide";

	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.SynopsisMorelikethisPanel.prototype._focus = function _focus () {
	this.logEntry();
	if (this.visible) {
		$util.ControlEvents.fire("app-synopsis:synopsisPageNavMenu", "select", "app-synopsis:synopsisMoreLikeThis");
		$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "focus");
	}
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SynopsisMorelikethisPanel.prototype._fetch = function _fetch (node) {
	this.logEntry();
	var me = this;

	this.fireControlEvent("hide");
	$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "clear");

	if (node) {
		$service.DISCO.Morelikethis.fetch(node).then(function (data) {
			me.fireControlEvent("populate", data);
		});
	}
	this.logExit();
};

/**
 * @method populate
 */
app.gui.controls.SynopsisMorelikethisPanel.prototype._populate = function _populate (items) {
	this.logEntry();
	$util.ControlEvents.fire("app-synopsis:synopsisMosaicTiles", "populate", items);
	this.fireControlEvent("show");
	this.logExit();
};
