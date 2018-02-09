/**
 * @class o5.gui.controls.VideoInfoPanel
 * @extends o5.gui.controls.Panel
 * 
 * @author lmayle
 * @ignore Not for public use yet
 */

o5.gui.controls.VideoInfoPanel = function VideoInfoPanel () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.VideoInfoPanel, o5.gui.controls.Panel);

o5.log.setAll(o5.gui.controls.VideoInfoPanel, true);

o5.gui.controls.VideoInfoPanel.prototype.createdCallback = function createdCallback ()
{
	this.superCall();

	this._dataItems = this.querySelectorAll(':scope [data-bind]');
};


/*
 * Events
 */
/*
 * Public properties
 */
/**
 * @property
 */
Object.defineProperty(o5.gui.controls.VideoInfoPanel.prototype, 'videoControl', {
	get: function get ()
	{
		return this._videoControl;
	},
	set: function set (val)
	{
		this._videoControl = val;
		
		this._videoControl.addEventListener('play', this._onPlay.bind(this));
	},
	enumerable: true
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
o5.gui.controls.VideoInfoPanel.prototype._onPlay = function _onPlay ()
{
	this.logEntry();
	
	this.update();
};


Object.defineProperty(o5.gui.controls.VideoInfoPanel.prototype, 'data', {
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


o5.gui.controls.VideoInfoPanel.prototype.update = function update ()
{
	if (this.videoControl)
	{
		if (this.videoControl.currentChannel)
		{
			this.children.channelLabel.textContent = this.videoControl.currentChannel.number + ' ' + this.videoControl.currentChannel.name;
		}
	}
};

