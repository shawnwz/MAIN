/**

 * Example markup:
 *
 *     <app-channel-entry-list data-orientation='vertical' data-focus-point='50%'>
 *       <template>
 *         <app-channel-entry-item></app-channel-entry-item>
 *       </template>
 *     </app-channel-entry-list>
 *
 * If no template element is provided, the generic o5-list-item will be used
 *
 * @class app.gui.controls.ChannelEntryList
 * @extends o5.gui.controls.List
 */
app.gui.controls.ChannelEntryList = function ChannelEntryList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.ChannelEntryList, o5.gui.controls.List);

app.gui.controls.ChannelEntryList.prototype.createdCallback = function createdCallback() {
	this.superCall();
	$util.Events.on("channelEntry:change", this._updateFilter, this);
	$util.Events.on("service:EPG:channel:updated", this._channelsUpdated, this);

	this._channels = [];
	this._filteredChannels = [];

	this._channelsUpdated($service.EPG.Channel.get());
};

app.gui.controls.ChannelEntryList.prototype._matchChannelToNumber = function _matchChannelToNumber(numberToMatch, channel) {
	return (channel.logicalChannelNum.toString().slice(0, numberToMatch.length) === numberToMatch);
};

app.gui.controls.ChannelEntryList.prototype._getChannelFilter = function _matchChannel(number) {
	return $util.Functional.partial(this._matchChannelToNumber, number);
};

app.gui.controls.ChannelEntryList.prototype._updateFilter = function _updateFilter(number) {
	this.logEntry(number);

	this._filteredChannels = this._channels.filter(this._getChannelFilter(number));

	this.deleteAllItems();
	this._populate(this._filteredChannels);

	$util.Events.fire("channelEntry:filter:updated");
	this.logExit();
};

/**
 * @property matches
 * @public
 * @type {Number} matches
 */
Object.defineProperty(app.gui.controls.ChannelEntryList.prototype, "matches", {
	get: function get() {
		return this._filteredChannels.length;
	}
});

app.gui.controls.ChannelEntryList.prototype._channelsUpdated = function _channelsUpdated(channels) {
	this.logEntry();
	this._channels = channels;
	this._filteredChannels = channels;
	this._populate(this._channels);
	this.logExit();
};

app.gui.controls.ChannelEntryList.prototype._addChannel = function _addChannel(channel) {
	this.logEntry();
	var channelStackItem = this.insertItem();
	channelStackItem.channel = channel;
	this.selectItem(0);
	this.logExit();
};

app.gui.controls.ChannelEntryList.prototype._populate = function _populate(channels) {
	this.logEntry();
	if (channels) {
		channels.forEach(this._addChannel, this);
	}
	this.logExit();
};
