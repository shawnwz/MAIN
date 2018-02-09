
app.gui.controls.ChannelEntry = function ChannelEntry() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.ChannelEntry);


app.gui.controls.ChannelEntry.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.onkeydown = this._onKeyDown;
	this.onload = this._onLoad;

	this._MAX_DIGITS = $config.getConfigValue("dvb.max.lcn.length");

	this._channelEntryList = this.children.channelEntryList;
	this._channelEntryNumber = this.children.channelEntryNumber;

	this._channelEntryNoResult = this.children.channelEntryNoResult;
	this._channelEntryNoResultTitle = this._channelEntryNoResult.children.channelEntryNoResultTitle;
	this._channelEntryNoResultBody = this._channelEntryNoResult.children.channelEntryNoResultBody;

	this._currentChannel = {};
	this._previousActiveElement = undefined;

	this._activityTimeoutId = 0;
	this._ACTIVITY_TIMEOUT_DURATION = $config.getConfigValue("settings.notifications.channel-entry.timeout") * 1000;
	this._activityTimeoutTune = 0;
	this._TUNE_TIMEOUT_DURATION = $config.getConfigValue("settings.notifications.channel-entry-tune.timeout") * 1000;

	this._registerEvents();
	this.logExit();
};

/**
 * @method _registerEvents
 * @private
 */
app.gui.controls.ChannelEntry.prototype._registerEvents = function _registerEvents() {
	this.logEntry();
	$util.Events.on("channelEntry:number", this._onNumberPressed, this);
	$util.Events.on("channelEntry:focus", this._channelFocused, this);

	$util.Events.on("channelEntry:select", this._dismiss, this);
	$util.Events.on("channelEntry:tune", this._dismiss, this);

	$util.Events.on("channelEntry:change", this._channelChanged, this);
	$util.Events.on("channelEntry:filter:updated", this._updateNoChannels, this);
	this.logExit();
};

/**
 * @method _dismiss
 * @private
 */
app.gui.controls.ChannelEntry.prototype._dismiss = function _dismiss() {
	this.logEntry();
	this._clearNumber();
	this._clearTimeout();

	if (this._previousActiveElement) {
		this._previousActiveElement.focus();
		this._previousActiveElement = null;
	}

	this.classList.add("hidden");
	this.logExit();
};

app.gui.controls.ChannelEntry.prototype._channelChanged = function _channelChanged(channelNumber) {
	this.logEntry();
	if (channelNumber === "") {
		this._dismiss();
	}
	this.logExit();
};

/**
 * @method _channelFocused
 * @private
 * @param {Object} e
 */
app.gui.controls.ChannelEntry.prototype._channelFocused = function _channelFocused(channel) {
	this.logEntry();
	this._currentChannel = channel;
	this.logExit();
};

/**
 * @method _selectChannel
 * @private
 */
app.gui.controls.ChannelEntry.prototype._selectChannel = function _selectChannel() {
	this.logEntry();
	if (this._channelEntryList.matches) {
		$util.Events.fire("channelEntry:tune", this._currentChannel);
	}
	this.logExit();
};

/**
 * @property channelEntryNumber
 * @public
 * @type {String} channelEntryNumber
 */
Object.defineProperty(app.gui.controls.ChannelEntry.prototype, "channelEntryNumber", {
	get: function get() {
		return this._channelEntryNumber.textContent;
	},
	set: function set(number) {
		this._channelEntryNumber.textContent = number;
	}
});

/**
 * @method _updateNoChannels
 * @private
 */
app.gui.controls.ChannelEntry.prototype._updateNoChannels = function _updateNoChannels() {
	this.logEntry();
	if (this._channelEntryList.matches) {
		this._channelEntryNoResult.classList.add("hidden");
	} else {
		this._channelEntryNoResult.classList.remove("hidden");
		this._channelEntryNoResultTitle.textContent = "Sorry,";
		this._channelEntryNoResultBody.textContent = "There's no channel at " + this.channelEntryNumber;
	}
	this.logExit();
};

/**
 * @method _updateNumber
 * @private
 * @param {String} digit
 */
app.gui.controls.ChannelEntry.prototype._updateNumber = function _updateNumber(digit) {
	this.logEntry(digit);
	this._resetTimeout();
	var currentNumber = this.channelEntryNumber,
		newNumber = currentNumber + digit;
	if (currentNumber.length < this._MAX_DIGITS) {
		this.channelEntryNumber = newNumber;
		$util.Events.fire("channelEntry:change", newNumber);
	}
	if (this._channelEntryList.matches === 1) {
		this._resetTuneTimeout();
	}
	this.logExit();
};

/**
 * @method _clearNumber
 * @private
 */
app.gui.controls.ChannelEntry.prototype._clearNumber = function _clearNumber() {
	this.logEntry();
	this.channelEntryNumber = "";
	this.logExit();
};

/**
 * @method _cropNumber
 * @private
 */
app.gui.controls.ChannelEntry.prototype._cropNumber = function _cropNumber() {
	this.logEntry();
	var currentNumber = this.channelEntryNumber,
		newNumber = "";
	if (currentNumber.length > 0) {
		newNumber = currentNumber.slice(0, -1);
		this.channelEntryNumber = newNumber;
		$util.Events.fire("channelEntry:change", newNumber);
	}
	this.logExit();
};

/**
 * @method _onNumberPressed
 * @private
 * @param {Object} key
 */
app.gui.controls.ChannelEntry.prototype._onNumberPressed = function _onNumberPressed(key) {
	this.logEntry();
	if (document.activeElement !== this._channelEntryList) {
		this._previousActiveElement = document.activeElement;
		this.classList.remove("hidden");
		this._channelEntryList.focus();
	}
	this._updateNumber(key);
	this.logExit();
};

/**
 * @method _clearTimeout
 * @private
 */
app.gui.controls.ChannelEntry.prototype._clearTimeout = function _clearTimeout() {
	this.logEntry();
	clearTimeout(this._activityTimeoutId);
	clearTimeout(this._activityTimeoutTune);
	this.logExit();
};

/**
 * @method _resetTimeout
 * @private
 */
app.gui.controls.ChannelEntry.prototype._resetTimeout = function _resetTimeout() {
	this.logEntry();
	this._clearTimeout();
	this._activityTimeoutId = setTimeout(this._timeoutComplete.bind(this), this._ACTIVITY_TIMEOUT_DURATION);
	this.logExit();
};

app.gui.controls.ChannelEntry.prototype._resetTuneTimeout = function _resetTuneTimeout() {
	this.logEntry();
	this._clearTimeout();
	this._activityTimeoutTune = setTimeout(this._tunetimeoutComplete.bind(this), this._TUNE_TIMEOUT_DURATION);
	this.logExit();
};

/**
 * @method._timeoutComplete
 * @private
 */
app.gui.controls.ChannelEntry.prototype._timeoutComplete = function _timeoutComplete() {
	this.logEntry();
	this._dismiss();
	this.logExit();
};

app.gui.controls.ChannelEntry.prototype._tunetimeoutComplete = function _tunetimeoutComplete() {
	this.logEntry();
	if (this._channelEntryList.matches === 1) {
		$util.Events.fire("channelEntry:tune", this._currentChannel);
	}
	this._dismiss();
	this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.ChannelEntry.prototype._onKeyDown = function _onKeyDown(e) {
	this.logEntry();
	this._resetTimeout();

	switch (e.key) {
		case "Back":
			this._cropNumber();
			e.stopImmediatePropagation();
			e.preventDefault();
			break;
		case "Ok":
		case "Enter":
			this._selectChannel();
			e.stopImmediatePropagation();
			break;
		default:
			break;
	}
	this.logExit();
};
