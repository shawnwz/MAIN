/**
 * @class app.gui.controls.SearchEntryText
 */

app.gui.controls.SearchEntryTextT9 = function SearchEntryTextT9() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SearchEntryTextT9, app.gui.controls.HtmlFocusItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.SearchEntryTextT9.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
	this._focusClass = "control-focused";
	var tmpl = document.getElementById("searchKeyTitleTemplate");
	this.appendChild(tmpl.content.cloneNode(true));

	this.onControlEvent("populate", this._populate);
	this.onControlEvent("append", this._append);
	this.onControlEvent("backspace", this._backspace);
	this.onControlEvent("clear", function() {
		this.fireControlEvent("populate");
	});
	this._keyMap = {
		"0": " 0",
		"1": ".,-1",
		"2": "ABC2",
		"3": "DEF3",
		"4": "GHI4",
		"5": "JKL5",
		"6": "MNO6",
		"7": "PQRS7",
		"8": "TUV8",
		"9": "WXYZ9"
	};

	this._searchKeyTitleText = this.querySelector("#searchEntryTextT9");

	this._focusLetterIndex = 0;
	this._T9Letter = "";
	this._term = "";
	this._timer = null;	// slow down get response, otheriwse we get too many responses if we enter chars fast

	this.logExit();
};

/**
 * @method _append
 * @private
 */
app.gui.controls.SearchEntryTextT9.prototype._append = function _append(term, keyboardType) {
	this.logEntry();
	var newTerm = term;

	if (newTerm === "&nbsp;") {
		newTerm = " ";
	}
	this.fireControlEvent("populate", this._term + newTerm, keyboardType);
	this.logExit();
};

/**
 * @method _backspace
 * @private
 */
app.gui.controls.SearchEntryTextT9.prototype._backspace = function _backspace(deleteAll) {
	this.logEntry();
	var term = this._term;
	if (term.length > 0) {
		if (deleteAll) {
			this.fireControlEvent("populate", "");
		} else {
			this.fireControlEvent("populate", term.slice(0, -1));
		}
	} else {
//		this.fireControlEvent("back", this);
	}
	this.logExit();
};

/**
 * @method _populate
 * @private
 */
app.gui.controls.SearchEntryTextT9.prototype._populate = function _populate(term, keyboardType) {
	this.logEntry();
	var newTerm = term,
		newTermLen = (newTerm && newTerm.length) ? newTerm.length : 0;

	if (!newTerm) {
		newTerm = "";
	}
	if (newTermLen > 0) {
		this._T9Letter = newTerm[newTermLen - 1];
	}
	if (newTerm === "") {
		this._searchKeyTitleText.innerHTML = "<span class='searchEntryInfo'>Search for TV Shows, Movies or People</span>";
	} else if (keyboardType === "abc" && this._T9Letter >= "0" && this._T9Letter <= "9") {
		this._focusLetterIndex = 0;
		newTerm = this._changeLetter(this._focusLetterIndex, newTerm);
		this.focus();
	} else {
		this._searchKeyTitleText.innerHTML = "<div class='searchT9tapPopup'>" + newTerm + "</div>";
	}
	this._term = newTerm;
	this._kickTimer();
	this.logExit();
};

/**
 * @method _kickTimer
 * @private
 */
app.gui.controls.SearchEntryTextT9.prototype._kickTimer = function _kickTimer() {
	this.logEntry();
	var me = this;

	if (this._timer) {
		clearTimeout(this._timer);
	}

	this._timer = setTimeout(function() {
		me.fireControlEvent("change", me._term);
		if (me._term.length > 0) {
			me._searchKeyTitleText.innerHTML = "<div class='searchT9tapPopup'>" + me._term + "</div>";
		}
		if (me._T9Letter >= "0" && me._T9Letter <= "9") {
			$util.ControlEvents.fire("app-search-query:searchKeysTable", "focus");
			me._T9Letter = "";
		}
	}, 1000);
	this.logExit();
};

/**
 * @method _changeLetter
 * @private
 */
app.gui.controls.SearchEntryTextT9.prototype._changeLetter = function _changeLetter(index, term) {
	this.logEntry();
	var newTerm = term,
		letters = this._keyMap[this._T9Letter],
		len = letters.length,
		innerText = "",
		i = 0;

	if (len === 0) {
		innerText += "<div class='searchT9tapPopup'> + newTerm + </div>";
	} else {
		if (index >= len) {
			this._focusLetterIndex = 0;
		}
		if (this._T9Letter >= "0" && this._T9Letter <= "9") {
			newTerm = newTerm.slice(0, -1) + letters[this._focusLetterIndex];
		}
		innerText = "<div class='searchT9tapPopup'>" + newTerm + "<span class='searchT9tapPopuptext searchT9tapPopuptextKey1'>";
		for (i = 0; i < len; i++) {
			if (i === this._focusLetterIndex) {
				innerText += "<span style='color:red'> " + letters[this._focusLetterIndex] + "</span>";
			} else {
				innerText += "<span> " + letters[i] + "</span>";
			}
		}
		innerText += "</span></div>";
	}
	this._searchKeyTitleText.innerHTML = innerText;
	return newTerm;
};


/**
 * @property itemData
 * @public
 * @type {Object} itemData
 */
Object.defineProperty(app.gui.controls.SearchEntryTextT9.prototype, "itemData", {
	get: function get() {
		return this._term;
	}
});

app.gui.controls.SearchEntryTextT9.prototype._onFocus = function _onFocus (e) {
	this.logEntry();
	if (e.key >= "0" && e.key <= "9") {
		console.log("e.key" + e.key);
		this._populate(e.key);
		return;
	}
	this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.SearchEntryTextT9.prototype._onKeyDown = function _onKeyDown (e) {
	this.logEntry();
	if (e.key >= "0" && e.key <= "9") {
		if (e.key === this._T9Letter) {
			this._focusLetterIndex += 1;
			this._term = this._changeLetter(this._focusLetterIndex, this._term);
			this._kickTimer();
		}
		e.stopImmediatePropagation();
		return;
	}
	switch (e.key) {
		case "Back":
			this.fireControlEvent("back", this);
			e.stopImmediatePropagation();
			break;
		case "Ok":
		case "Enter":
			this.fireControlEvent("enter", this);
			e.stopImmediatePropagation();
			break;
		default:
			break;
	}
	this.logExit();
};
