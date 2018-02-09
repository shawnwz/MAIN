/**
 * Example markup:
 *
 *     <app-channel-entry-list-item></app-channel-entry-list-item>
 *
 * @class app.gui.controls.ChannelEntryListItem
 * @extends o5.gui.controls.Control
 */

app.gui.controls.ChannelEntryListItem = function ChannelEntryListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.ChannelEntryListItem, o5.gui.controls.ListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.ChannelEntryListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this._channel = {};

	this._channelNumber = this.ownerDocument.createElement("div");
	this._channelNumber.classList.add("channel-entry-list__channel-number");
	this.appendChild(this._channelNumber);

	this._channelName = this.ownerDocument.createElement("div");
	this._channelName.classList.add("channel-entry-list__channel-name");
	this.appendChild(this._channelName);

	if (this._channel.unsubscribed) {
		this.classList.add("channel-entry--unsubscribed");
	}

	this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.ChannelEntryListItem.prototype, "channel", {
	get: function get() {
		return this._channel;
	},
	set: function set(channel) {
		this._channel = channel;
		this._channelNumber.textContent = this._channel.logicalChannelNum;
		this._channelName.textContent = this._channel.name;
	}
});

/**
 * @method onSelect
 * @public
 */
app.gui.controls.ChannelEntryListItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	$util.Events.fire("channelEntry:focus", this._channel);
	this.logExit();
};
