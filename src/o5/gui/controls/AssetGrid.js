/**
 * A Mosaic of assets
 *
 * @class o5.gui.controls.AssetGrid
 * @extends o5.gui.controls.Mosaic
 *
 * @author lmayle
 */

o5.gui.controls.AssetGrid = function AssetGrid () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.AssetGrid, o5.gui.controls.FlexGrid);

// o5.log.setAll(o5.gui.controls.AssetGrid, true);

o5.gui.controls.AssetGrid.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
//	this.cellTemplate 	= 'o5-asset-grid-cell';
//	this.rowTemplate 	= 'o5-asset-grid-row';
	
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
Object.defineProperty(o5.gui.controls.AssetGrid.prototype, "data", {
	get: function get ()
	{
		return this._data ? this._data : '';
	},
	set: function set (val)
	{
		this.logEntry();
		
		this._data = val;
		
		this.update();
	}
});




/*
 * Public methods
 */
/**
 * @method update
 */
o5.gui.controls.AssetGrid.prototype.update = function update ()
{
	this.logEntry();
	
	if(this._data)
	{
		for (let child of Object.values(this._data.children))
		{
			var row = this.insertRow();
			
			row.data = child;
		}
	}
};




/*
 * Private properties
 */



/*
 * Private methods
 */
o5.gui.controls.AssetGrid.prototype._onKeyDown = function _onKeyDown (e)
{
	this.logInfo(e.keyCode + ' ' + e.timeStamp);
	
	this.superCall(e);
	
	if (e.defaultPrevented)
		return;

	switch (e.key)
	{
	}

};


