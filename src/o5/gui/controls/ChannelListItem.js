/**
 * The ChannelListItem control extends {@link o5.gui.controls.ListItem} control and is used by {@link o5.gui.controls.ChannelList} control.
 * Can be used directly as a generic channel item or as a base class for customized ChannelList items.
 *
 * Example markup for ChannelListItem is:
 * 
 * 	<o5-channel-list data-orientation='vertical' data-focus-point=50%>
 * 		<template>
 * 			<app-channel-list-item>
 * 				<p>Text</p>
 * 			</app-channel-list-item>
 * 		</template>
 * 	</o5-channel-list>
 * 
 * @class o5.gui.controls.ChannelListItem
 * @extends o5.gui.controls.ListItem
 *
 * @author lmayle
 */

o5.gui.controls.ChannelListItem = function ChannelListItem () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ChannelListItem, o5.gui.controls.ListItem);

//o5.gui.controls.ChannelListItem.prototype.createdCallback = function createdCallback()
//{
//	this.superCall();
//};


/*
 * Public properties
 */
/**
 * The EPG data object for this channel
 * @property data
 * @type {o5.data.EPGService}
 */
Object.defineProperty(o5.gui.controls.ChannelListItem.prototype, 'data', {
	get: function get ()
	{
		return this._data;
	},
	set: function set (val)
	{
		this._data = val;
		
		this.update();
	},
	enumerable: true,
	configurable: false
});

/*
 * Public methods
 */

o5.gui.controls.ChannelListItem.prototype.update = function update ()
{
	this.textContent = this._data.channelKey + ' ' + this._data.name;
};


/*
 * Private properties
 */

/*
 * Private methods
 */

