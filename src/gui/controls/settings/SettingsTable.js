/**
 * @class app.gui.controls.SettingsTable
 */

app.gui.controls.SettingsTable = function SettingsTable () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsTable, app.gui.controls.HtmlTable);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsTable.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._colCount = 2;
	this._handleAction = null;
	this.logExit();
};


app.gui.controls.SettingsTable.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	var element;
	switch (e.key) {
		case "0":
		case "6":
		case "1":
		    	if (this._handleAction) {
		    	    this._handleAction._handleNumericEntry(e.key);
		    	    e.stopImmediatePropagation();
		    	}
			break;
		case "Ok":
		    	if (this._handleAction && this._handleAction._showInstaller) {
		    	element = document.querySelector('.InstallerLauncher');
		    	element.classList.remove("hide");
		    	element.classList.add("show");
		    	element.selectable = true;
		    	element.classList.remove("unselectable");
		    	this.fireControlEvent("select", element.itemRowIndex, element.itemColIndex);
		    	this._handleAction._showInstaller = false;
		    	e.stopImmediatePropagation();
		    	} else {
		    	    this.superCall(e);
		    	}
		    	
		    	break;
		default:
			this.superCall(e);
			break;
	}
	this.logExit();
};


app.gui.controls.SettingsTable.prototype._fetch = function _fetch() {
	this.logEntry();

	var objs = this._config ? this._config.split('.') : [],
		configObj = null,
		arr,
		footer = document.querySelector("#callToAction");
	footer.classList = [];
	this.fireControlEvent("clear");
	objs.forEach(function(obj) {
		if (configObj) { // concat with previous

			if (configObj[obj]) {

				configObj = configObj[obj];

			}

		} else if (window[obj]) { // first one

			configObj = window[obj];

		}

	});

	if (configObj && configObj.getMenu) {

		arr = configObj.getMenu();
		this.fireControlEvent("populate", arr);
		if (configObj.footerClassList) {
			configObj.footerClassList.forEach(function(e) {
				footer.classList.add(e);
				document.querySelector("#" + e).children[1].innerHTML = $util.Translations.translate(document.querySelector("#" + e).children[1].attributes.getNamedItem("data-i18n").value);
			});
		}
	}
	if (configObj && configObj.handleAction) {
	    this._handleAction = configObj.handleAction();
	    this._handleAction._clearNumericSequence();
	}

	this.logExit();
};

app.gui.controls.SettingsTable.prototype._populate = function _populate (items) {
	this.logEntry();
	if (items && items.length > 0) {
		var item = this._split(items, this._colCount);

		this.superCall(item);
		//this.selectedItem = 0;
		this.fireControlEvent("select", 0, 0);
	}

	this.logExit();
};

o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.SettingsTable.prototype, 'colCount',	{
	get: function () {
		return this._colCount;
	},
	set: function (val) {
		this._colCount = Number(val);
	},
	toAttribute: function (val) {
		return val ? val.localName : '';
	},
	fromAttribute: function (val) {
		return val;
	}
});

o5.gui.controls.Control.definePropertyWithDataAttribute(app.gui.controls.SettingsTable.prototype, 'type', {
	get: function () {
		return "Table";
	}
});

/**
 * @class app.gui.controls.SettingsTableCell
 */

app.gui.controls.SettingsTableCell = function SettingsTableCell () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SettingsTableCell, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 */
app.gui.controls.SettingsTableCell.prototype.createdCallback = function createdCallback () {
	this.logEntry();
	this.superCall();
	this._focusClass = "focused";
	this._emptyClass = "unavailable";
	this.logExit();
};

/**
 * @property selectable
 */
Object.defineProperty(app.gui.controls.SettingsTableCell.prototype, "selectable", {
    get: function get () {
        if (this.classList.length === 0) {
            return true;
        } else if (this._hiddenClass && this.classList.contains(this._hiddenClass)) {
            return false;
        } else if (this._emptyClass && this.classList.contains(this._emptyClass)) {
            return false;
        }
        if (this.classList.contains("unselectable")) {
            return false;
        }
        return true;
    }
});

/**
 * @property itemData
 */
Object.defineProperty(app.gui.controls.SettingsTableCell.prototype, "itemData", {
	get: function get () {
		return this._data;
	},
	set: function set (data) {
		this._data = data;

		if (data) {
			this.innerHTML = $util.Translations.translate(data.text);
			if (data.isHide) {
			    this.classList.add('InstallerLauncher');
			    this.classList.add('hide');
			    this.selectable = false;
			    this.classList.add("unselectable");
			}
			this.dataset.i18n = data.text;
		} else {
			this.textContent = "";
		}
	}
});
