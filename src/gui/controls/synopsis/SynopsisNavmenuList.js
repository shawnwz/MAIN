/**
 * @class app.gui.controls.SynopsisNavmenuList
 */

app.gui.controls.SynopsisNavmenuList = function SynopsisNavmenuList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisNavmenuList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 */
app.gui.controls.SynopsisNavmenuList.prototype.createdCallback = function createdCallback () {
	this.superCall();

	//this.fireControlEvent("debug", true, 'background: blue; color: yellow;');

	$util.ControlEvents.on("app-synopsis", "fetch", function () {
		this.fireControlEvent("populate", this._panels);
	}, this);

	this._panels = [
		{ text: $util.Translations.translate("synopsisOverview"),	control: "app-synopsis:synopsisOverview" },
		{ text: $util.Translations.translate("synopsisEpisodes"),	control: "app-synopsis:synopsisEpisodes" },
		{ text: $util.Translations.translate("synopsisMoreLikeThis"), control: "app-synopsis:synopsisMoreLikeThis" },
		{ text: $util.Translations.translate("synopsisCastTitle"), control: "app-synopsis:synopsisCast" }
	];

	this.focusClass = "focused";
};

/**
 * @method _select
 */
app.gui.controls.SynopsisNavmenuList.prototype._select = function _select (control) {
	var i = -1, elem;

	if (typeof control === "string") {
		i = this._data.findIndex(function (panel) {
			return (panel.control === control);
		});
	} else if (typeof control === "number") {
		i = control;
	}

	if (i > -1) {
		elem = this._elems[i] ? this._elems[i] : null;
		if (elem) {
			if (elem.selectable) {
				this.selectedItem = i;
			}
		}
	}
};

/**
 * @class app.gui.controls.SynopsisNavmenuListItem
 */

app.gui.controls.SynopsisNavmenuListItem = function SynopsisNavmenuListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SynopsisNavmenuListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SynopsisNavmenuListItem.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
  this._text = this.querySelector('span.text');
	this._hiddenClass = "synopsisNavMenuItem-hidden";
	this._floatItem = true;
	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SynopsisNavmenuListItem.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data) {
			// link show/hide of the panels to show/hide the NavMenu items
			$util.ControlEvents.on(data.control, "show", function () {
				this._show();
			}, this);
			$util.ControlEvents.on(data.control, "hide", function () {
				this._hide();
			}, this);

			this._text.textContent = data.text;
			this.classList.add(this._hiddenClass); // hide at first sight
		}
	}
});
