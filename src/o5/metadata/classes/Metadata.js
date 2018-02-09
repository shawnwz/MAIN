/**
 * @private Not for public use
 * @author lmayle
 */

o5.metadata.classes.Metadata = class Metadata extends o5.metadata.classes.Node
{
	constructor()
	{
		super();
		
		this.classes = o5.metadata.classes;
		this.util = o5.metadata.util;
		
		this._sources = [];
	}
	
	
	
	/*
	 * Public properties
	 */
	get channels()
	{
		if(!this._channels)
		{
			for(let source of this._sources)
			{
				this._channels = source.channels;
			}
		}

		return this._channels;
	}
	
	get sources()
	{
		return this._sources;
	}
	
	
	
	/*
	 * Public methods
	 */
	addDataSource(source)
	{
		this._sources.push(source);
	}
	
	readAheadPrograms (channels, startTime, endTime, callback)
	{
		this.logEntry();
		
		for(let source of this._sources)
		{
			source.readAheadPrograms (channels, startTime, endTime, callback);
		}
	};

	getChannelById (id)
	{
		this.logEntry();
		
		return this.channels.byId[id];
	}
	
	
	/*
	 * Private properties
	 */



	/*
	 * Private methods
	 */
};

