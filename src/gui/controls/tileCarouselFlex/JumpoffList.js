/**
 * @class app.gui.controls.JumpoffList
 */

app.gui.controls.JumpoffList = function JumpoffList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.JumpoffList, o5.gui.controls.List);

app.gui.controls.JumpoffList.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();

	this.fixedLayout = true;

	/*
		<app-jumpoff-list id="jumpListHome" class="jump-list" data-orientation="horizontal" data-feature="home">
			<template>
				<app-jumpoff-list-item class="jumpoff-item"></app-jumpoff-list-item>
			</template>
		</app-jumpoff-list>
	*/
	this.itemTemplate = "app-jumpoff-list-item";
	this.className = "jump-list";

	this._container.style.width = "100%";
	this._container.style.webkitJustifyContent = "space-between";

	this._node = null;

	this.onfocus = this._onFocus;
	this.onblur = this._onBlur;

	this.logExit();
};

/**
 * @method _exitDown
 * @private
 */
app.gui.controls.JumpoffList.prototype._exitDown = function _exitDown () {
	//var jumpoff;
	if (this._node) {
		//jumpoff = this._node.displayName.toUpperCase();
		//if (this._node._hasJumpOffs) {
		//	jumpoff += " / " + this.selectedItem.itemData.displayName.toUpperCase();
		//}
		this.fireControlEvent("exit:down", this);
		//$util.ControlEvents.fire("app-home-menu:portalBreadcrumb", "populate", jumpoff);
		//$util.ControlEvents.fire("app-home-menu:portalBreadcrumb", "show");
	}
};

/**
 * @method attachedCallback
 * @private
 */
app.gui.controls.JumpoffList.prototype.attachedCallback = function attachedCallback () {
	this.logEntry();

	this.onControlEvent("show", this._show);
	this.onControlEvent("hide", this._hide);
	this.onControlEvent("populate", this._populate);
	this.onControlEvent("fetch", this._fetch);
	this.onControlEvent("clear", this._clear);

	this.onControlEvent("reset", function () {
		$util.ControlEvents.fire("app-home:carouselList", "reset");
	});

	this.onControlEvent("focus", function () {
		if (this._node && this._node._hasJumpOffs) {
			this.focus();
		} else { // go straight to carousel if there are no jumpoffs
			this._exitDown();
		}
	});

	this.onControlEvent("enter:up", function () {
		//$util.ControlEvents.fire("app-home:portalBreadcrumb", "hide");
		this.fireControlEvent("show");
		if (this._node._hasJumpOffs) {
			this.fireControlEvent("focus");
		} else { // skip focus on jumpoff if there are none
			this.fireControlEvent("exit:up", this);
		}
	});
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._setFocus = function _setFocus () {
	this.logEntry();
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._onFocus = function _onFocus () {
	this.logEntry();
	this.setAttribute("selected", "");
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._onBlur = function _onBlur () {
	this.logEntry();
	this.removeAttribute("selected");
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._show = function _show () {
	this.logEntry();
	this.parentElement.classList.remove("hideJumpList");
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._hide = function _hide() {
	this.logEntry();
	this.parentElement.classList.add("hideJumpList");
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._addItem = function _addItem (item, itemNum) {
	this.logEntry();
	if (item.displayName !== "Highlights") {
		var elem = this.insertItem();
		elem.itemData = item;
		elem.style.width = 1170 / itemNum - 30 + "px";
	} else {
		this.logDebug("'Highlights' removed");
	}
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._fetch = function _fetch (node) {
	this.logEntry();
	this.fireControlEvent("clear");
	//$service.MDS.Node.screenNode(node).then(this._populate.bind(this), $util.ControlEvents.fire("app-home-menu:homeJumpoffList", "populated", { itemNb: 0 }));
	$service.MDS.Node.screenNode(node).then(this._populate.bind(this), this.fireControlEvent("populated", { itemNb: 0 }));
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._clear = function _clear () {
	this.logEntry();
	this.deleteAllItems();
	this._itemNb = 0;
	//$util.ControlEvents.fire("app-home-menu:carouselList", "clear");
	this.logExit();
};

app.gui.controls.JumpoffList.prototype._populate = function _populate (node) {
	this.logEntry();
	this._clear();
	var nodeId, itemNb = 0;

	if (node) {
		this._node = node;

		if (!node._hasJumpOffs) { // no jumpoffs: pass in the whole node
			this._addItem(node);
			this.parentElement.classList.add("noJumpList");
		} else if (node._subNodes && node._subNodesNb > 0) { // jumpoffs and subNodes: pass in each individual subnode as a jumpoff
			this.parentElement.classList.remove("noJumpList");
			// eslint-disable-next-line guard-for-in

			for (nodeId in node._subNodes) {
				if (node._subNodes[nodeId].displayName !== "Highlights") {
					itemNb++;
				}
			}
			for (nodeId in node._subNodes) {
				if (node._subNodes[nodeId]) {
					this._addItem(node._subNodes[nodeId], itemNb);
				}
			}
		}
		this.selectedItem = 0;
	}

	this.logExit();
};

/**
 * @method _onKeyDown
 * @param {Object} e
 */
app.gui.controls.JumpoffList.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var handled = false;
	switch (e.key) {
		case "Back":
			this.fireControlEvent("back", this);
			e.stopImmediatePropagation();
			break;
		case "ArrowUp":
			this.fireControlEvent("exit:up", this);
			handled = true;
			break;
		case "ArrowDown":
			this._exitDown();
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
