/**
 * @class app.gui.controls.HomeMenuList
 */

app.gui.controls.HomeMenuList = function HomeMenuList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeMenuList, app.gui.controls.HtmlFocusList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HomeMenuList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this.orientation = "horizontal";
	this.logExit();
};

/**
 * @method _onFocus
 * @private
 */
app.gui.controls.HomeMenuList.prototype._onFocus = function _onFocus() {
	this.logEntry();
	if (this.selectedItem) {
		this.selectedItem._onSelect();
		this.selectedItem.classList.add("focused");
	}
	this.logExit();
};

/**
 * @method _onBlur
 * @private
 */
app.gui.controls.HomeMenuList.prototype._onBlur = function _onBlur() {
	this.logEntry();
	if (this.selectedItem) {
		this.selectedItem.classList.remove("focused");
	}
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.HomeMenuList.prototype._fetch = function _fetch(node) {
	this.logEntry();
	var me = this;

	this.fireControlEvent("clear");
	$service.MDS.Node.fetch(node).then(function(data) {
		me.fireControlEvent("populate", data);
	}, function() {
		me.fireControlEvent("populate", []);
	});
	this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.HomeMenuList.prototype._populate = function _populate(node) {
	this.logEntry();
	this._clear();

	// items is the root node, we want to populate its subNodes
	var items = (node && node._subNodes && node._subNodesNb) ? node._subNodes : null,
		data = [],
		key;

	if (items) {
		// eslint-disable-next-line guard-for-in
		for (key in items) {
			data.push(items[key]);
		}
		this.superCall(data);
		this.fireControlEvent("select", 0);
	}
	this.logExit();
};

/**
 * @method _select
 * @public
 */
app.gui.controls.HomeMenuList.prototype._select = function _select(item) {
	this.logEntry();

	// disable animation if we select the item through this function
	this._listElem.style.webkitTransition = 'none';
	var me = this, elem, index;

	setTimeout(function() {
		me._listElem.style.webkitTransition = '';
	}, 500);

	if (typeof item === "string") {
	  elem = this.querySelector("app-home-menu-list-item[data-id=" + item + "]");
	  this.selectedItem = elem ? elem.itemIndex : 0;
	} else if (typeof item === "number") {
		index = item;
		this.selectedItem = index;
	}

	this.logExit();
};

/**
 * @method _change
 */
app.gui.controls.HomeMenuList.prototype._change = function _change() {
	this.logEntry();
	var selectedItem = this.selectedItem,
		node = selectedItem ? selectedItem.itemData : null;

	if (node && node._parentNode && node._parentNode._parentNode) { // have parent and grandparent: not root
		$util.ControlEvents.fire("app-home-menu:homeNavBreadcrumb", "populate", node._parentNode.displayName);
		$util.ControlEvents.fire("app-home-menu:homeNavBreadcrumb", "show");
	} else {
		$util.ControlEvents.fire("app-home-menu:homeNavBreadcrumb", "hide");
	}
	this._listElem.style.webkitTransform = "translate3d(-" + selectedItem.startPos + "px, 0px, 0px)";
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.HomeMenuList.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false,
		node, parentNode, grannyNode;

	switch (e.key) {
		case "ArrowDown":
		case "Enter":
		case "Ok":
			if (this.selectedItem) {
				node = this.selectedItem.itemData;
				if (node && node._subNodes && node._subNodesNb) {
					this.fireControlEvent("populate", node);
					this.fireControlEvent("select", 0);
				} else {
					this.fireControlEvent("enter", this);
				}
			}
			handled = true;
			break;

		case "ArrowUp":
		case "Back":
			if (this.selectedItem) {
				node = this.selectedItem.itemData;
				parentNode = node._parentNode ? node._parentNode : null;
				grannyNode = parentNode._parentNode ? parentNode._parentNode : null;

				if (grannyNode && grannyNode._subNodes && grannyNode._subNodesNb) {
					this.fireControlEvent("populate", grannyNode);
					this.fireControlEvent("select", parentNode.id);
				}
			}
			handled = true;
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
 * @class app.gui.controls.HomeMenuListItem
 */

app.gui.controls.HomeMenuListItem = function HomeMenuListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HomeMenuListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.HomeMenuListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._floatItem = true;
	this._focusClass = "focused";
  this._text = this.querySelector('.homeMenuItemText');
	this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.HomeMenuListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		this._data = data;

		if (data) {
			this._text.textContent = data.displayName;
			this.dataset.id = data.id;
			if (data._subNodes && data._subNodesNb) {
				this.classList.add("hasSubMenu");
			}
		} else {
			this._text.textContent = "item" + this.itemIndex;
			this.dataset.id = "id" + this.itemIndex;
		}
	}
});

/**
 * @method onSelect
 * @public
 */
app.gui.controls.HomeMenuListItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	this.superCall();
	if (this.previousSibling) {
		this.previousSibling.classList.add("focus-to-my-right");
	}
	this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.HomeMenuListItem.prototype._onDeselect = function _onDeselect() {
	this.logEntry();
	this.superCall();
	if (this.previousSibling) {
		this.previousSibling.classList.remove("focus-to-my-right");
	}
	this.logExit();
};
