/**
 * A Mosaic of assets
 *
 * @class o5.gui.controls.AssetMosaic
 * @extends o5.gui.controls.Mosaic
 *
 * @author lmayle
 */

o5.gui.controls.AssetMosaic = function AssetMosaic () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.AssetMosaic, o5.gui.controls.Mosaic);

// o5.log.setAll(o5.gui.controls.AssetMosaic, true);

o5.gui.controls.AssetMosaic.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
//	this.itemTemplate = 'o5-assets-mosaic-item';
};

/*
 * Public properties
 */
/*
 * Public properties
 */
/**
 * The URL to the assets metadata
 * 
 * The default parser supports the JSON file for assets containers used by the OpenTV Platform
 * @property {String} src
 */
Object.defineProperty(o5.gui.controls.AssetMosaic.prototype, "src", {
	get: function get ()
	{
		return this._src ? this._src : '';
	},
	set: function set (val)
	{
		this.logEntry();
		
		this._src = val;
		
		if (this._src)
		{
			var xmlhttp = new XMLHttpRequest();

			xmlhttp.open("GET", this._src, true);
			xmlhttp.responseType = 'json';
			xmlhttp.onloadend = this._onDataLoaded.bind(this);
			xmlhttp.send();
		}
		else
		{
			this.activeImage = '';
			this.style.content = '';
		}
	}
});




/*
 * Public methods
 */
/**
 * @method update
 */
o5.gui.controls.AssetMosaic.prototype.update = function update ()
{
	this.logEntry();
	
	if(this._data)
	{
		for (var i = 0; i < this._data.containers.length; i++)
		{
			var item = this.insertItem();
			
			item._data = this._data.containers[i];

			if (item._data.left)
				item.style.left = item._data.left;
			
			if (item._data.top)
				item.style.top = item._data.top;
			
			if (item._data.width)
				item.style.width = item._data.width;
			
			if (item._data.height)
				item.style.height = item._data.height;
			
			item.update();
		}
	}
};




/*
 * Private properties
 */



/*
 * Private methods
 */
o5.gui.controls.AssetMosaic.prototype._onDataLoaded = function _onDataLoaded (e)
{
	this._data = e.target.response;
	
	this.deleteAllItems();
	
	this.update();
};

o5.gui.controls.AssetMosaic.prototype._onKeyDown = function _onKeyDown (e)
{
	this.logInfo(e.keyCode + ' ' + e.timeStamp);
	
	this.superCall(e);
	
	if (e.defaultPrevented)
		return;

	switch (e.key)
	{
	}

};


