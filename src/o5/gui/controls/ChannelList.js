/**
 * The ChannelList control extends the {@link o5.gui.controls.List} control
 * 
 * Example markup for ChannelList is:
 * 
 * 		<o5-channel-list data-orientation='vertical' data-focus-point='50%'>
 * 		</o5-channel-list>
 * 
 * By default the orientation of channels in ChennelList is horizontal.
 * 
 * @class o5.gui.controls.ChannelList
 * @extends o5.gui.controls.List
 *
 * @author lmayle
 */
o5.gui.controls.ChannelList = function ChannelList () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ChannelList, o5.gui.controls.List);

// o5.log.setAll(o5.gui.controls.ChannelList, true);

o5.gui.controls.ChannelList.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
};



/*
 * Public properties
 */
/**
 * Gets or sets the template used for the channels of this ChannelList
 * @property itemTemplate
 * @htmlDataAttribute
 * @readonly
 * @type {Object}
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.ChannelList.prototype, 'itemTemplate',	{
	template: o5.gui.controls.ChannelListItem,
	querySelector: ':scope template'
});

/*
 * Public methods
 */

/*
 * Private properties
 */

/*
 * Private methods
 */

o5.gui.controls.ChannelList.prototype.loadChannels = function loadChannels (filter, sort)
{
	this.deleteAllItems();

	var channels = o5.metadata.channels;

	if (filter)
	{
		var channels2 = channels;

		channels = [];
		
		for (var i = 0; i < channels2.length; i++)
		{
			if (filter(channels2[i]))
			{
				channels.push(channels2[i]);
			}
		}
	}
	
	if (sort)
	{
		channels = channels.slice(0); // clone it
		channels.sort(sort);
	}
	
	for (var j = 0; j < channels.length; j++)
	{
		var el = this.insertItem();
		
		el.data = channels[j];
	}
};


o5.gui.controls.ChannelList.prototype.getChannelItemByServiceId = function getChannelItemByServiceId (id)
{
	for (var channel = this._container.firstElementChild; channel; channel = channel.nextElementSibling)
	{
		if (channel.data.id === id)
		{
			return channel;
		}
	}
	
	return null;
};



