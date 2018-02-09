/**
 * @private Not for public use
 * @author lmayle
 */
o5.metadata.classes.Source = class Source extends o5.metadata.classes.Node
{
//	constructor()
//	{
//		super();
//	}
	
	

	/*
	 * Public properties
	 */
	get enabled ()
	{
		return this._enabled || false;
	}
	set enabled (val)
	{
		this._enabled = true;
		this._preLoad();
	}
	
	get channels ()
	{
		if(!this._channels)
		{
			this._loadChannels();
		}

		return this._channels;
	}

	get programs ()
	{
		if(!this._programs)
		{
			this._programs = [];
		}

		return this._programs;
	}
	
	get channelPropertiesMapping ()
	{
		if(this._channelPropertiesMapping)
		{
			return this._channelPropertiesMapping;
		}
		
		return [];
	}
	set channelPropertiesMapping (val)
	{
		this._channelPropertiesMapping = val;
		
		this._setupPropertiesMapping('channel');
	}
	
	get programPropertiesMapping ()
	{
		if(this._programPropertiesMapping)
		{
			return this._channelPropertiesMapping;
		}
		
		return [];
	}
	set programPropertiesMapping (val)
	{
		this._programPropertiesMapping = val;
		
		this._setupPropertiesMapping('program');
	}


	/*
	 * Public methods
	 */
	getChannelById (id)
	{
		this.logEntry();
		
		if (this._channels)
		{
			return this._channels.byId[id];
		}
		
		return null;
	}

	readAheadPrograms (channels, startTime, endTime, callback)
	{
		this.logEntry();
		
		setTimeout(this._readAheadPrograms.bind(this, channels, startTime, endTime, callback), 20);
	}

	

	/*
	 * Private properties
	 */



	/*
	 * Private methods
	 */
	_definePropertiesMapping (type, target)
	{
		this['_' + type + 'Class'] = target;
		
		Object.defineProperty(this.__proto__, type + 'PropertiesMapping', {
			get: new Function ('\n\
				if(this._' + type + 'PropertiesMapping)\n\
				{\n\
					return this._' + type + 'PropertiesMapping;\n\
				}\n\
				return [];'
			),
			set: new Function ('val', '\n\
				this._' + type + 'PropertiesMapping = val;\n\
				this._setupPropertiesMapping("' + type + '");'
			)
		});
	}
	
	_setupPropertiesMapping (type)
	{
		this.logEntry();
		
		this['_' + type + 'FieldsBase'] = [];
		this['_' + type + 'FieldsAll'] = [];
		
		for(let m of this['_' + type + 'PropertiesMapping'])
		{
			if(m[2])
			{
				this['_' + type + 'FieldsBase'].push(m[1]);
			}
			
			this['_' + type + 'FieldsAll'].push(m[1]);
			
			Object.defineProperty(this['_' + type + 'Class'].prototype, m[0], {
				get: new Function ('\
					if(this._data.' + m[1] + ' === undefined)\
						this.source._' + type + 'LoadData(this, false);\
					return this._data.' + m[1] + ';'
				)
			});
		}
	}
	
	_preLoad ()
	{
//		debugger;
	}
	
	_readAheadPrograms (channels, startTime, endTime, callback)
	{
		throw(0);
	}

	
	
	_loadChannels (async)
	{
		this.logEntry();
	};
};
