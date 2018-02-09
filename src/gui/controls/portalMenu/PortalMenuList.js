/**
 * @class app.gui.controls.PortalMenuList
 */

app.gui.controls.PortalMenuList = function PortalMenuList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PortalMenuList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.PortalMenuList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.animate = true;
	this.orientation = "Horizontal";

	this._hiddenClass = "removed";

	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.PortalMenuList.prototype._fetch = function _fetch(node) {
	this.logEntry();
	var me = this;
	this.fireControlEvent("clear");
	$service.MDS.Node.fetch(node).then(function(data) {
			me.fireControlEvent("populate", data);
		},
		function(data) {
			var defaultTopMenu = {
				_subNodes  : $util.constants.DEFAUT_TOP_MENU,
				_subNodesNb: 8
			};
			me.fireControlEvent("populate", defaultTopMenu);
		});
	this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.PortalMenuList.prototype._focus = function _focus () {
	this.logEntry();
//	$util.ControlEvents.fire("app-home-menu:portalBreadcrumb", "hide"); /* hide breadcrump when we set focus */
	this.superCall();
	this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.PortalMenuList.prototype._populate = function _populate(arr) {
	this.logEntry();
	this._clear();
	var data = [], subNodes, key;

	// items is the root node, we want to populate its subNodes
	subNodes = (arr && arr._subNodes && arr._subNodesNb) ? arr._subNodes : null;
	if (subNodes) {
		// eslint-disable-next-line guard-for-in
		for (key in subNodes) {
			data.push(subNodes[key]);
		}
		this.superCall(data, 0);
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.PortalMenuList.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	var handled = false;

	switch (e.key) {
		case "ArrowDown": // same as "enter"
			e.key = "Enter";
			handled = this.superCall(e);
			break;
		case "Back":
		case "backspace":
			//do not handle the BACK key at super class
			break;
		default:
			handled = this.superCall(e);
			break;
	}
	if (handled === true) {
		e.stopImmediatePropagation();
	}
	this.logExit();
};



/**
 * @class app.gui.controls.PortalMenuListItem
 */

app.gui.controls.PortalMenuListItem = function PortalMenuListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.PortalMenuListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.PortalMenuListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._floatItem = true;
	this._text = this.querySelector('.portalMenuItemText');
	this.logExit();
};

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.PortalMenuListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data) {
			this._text.textContent = data.displayName.titleCase();
			this.classList.add("portal-menu-item-" + data.displayName.toLowerCase().replace(/\s/g, ''));
			this.classList.remove("hidden");
		} else {
			this._text.textContent = "item" + this.itemIndex;
			this.classList.add("hidden");
		}
	}
});

