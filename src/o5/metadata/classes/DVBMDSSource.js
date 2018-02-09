/**
 * @private Not for public use
 * @author lmayle
 */


o5.metadata.classes.DVBMDSSource = class DVBMDSSource extends o5.metadata.classes.DVBSource
{
	constructor()
	{
		super();
		
		this.limit = 9999;
		
		this._channelClass = o5.metadata.classes.DVBMDSChannel;
		this._programClass = o5.metadata.classes.DVBMDSProgram;
		this._mdsChannelClass = o5.metadata.classes.DVBMDSChannel;
		this._mdsProgramClass = o5.metadata.classes.DVBMDSProgram;
		
		
		this._xhrLoadEnd = o5.metadata.classes.MDSSource.prototype._xhrLoadEnd;
		this._xhrError = o5.metadata.classes.MDSSource.prototype._xhrError;
		this._xhr = o5.metadata.classes.MDSSource.prototype._xhr;
	}

	/*
	 * Public properties
	 */
	get mdsChannelPropertiesMapping ()
	{
		if(this._mdsChannelPropertiesMapping)
		{
			return this._mdsChannelPropertiesMapping;
		}
		
		return [];
	}
	set mdsChannelPropertiesMapping (val)
	{
		this._mdsChannelPropertiesMapping = val;
		
		this._setupPropertiesMapping('mdsChannel');
	}
	
	get mdsProgramPropertiesMapping ()
	{
		if(this._mdsProgramPropertiesMapping)
		{
			return this._mdsProgramPropertiesMapping;
		}
		
		return [];
	}
	set mdsProgramPropertiesMapping (val)
	{
		this._mdsProgramPropertiesMapping = val;
		
		this._setupPropertiesMapping('mdsProgram');
	}

	

	/*
	 * Public methods
	 */



	
	/*
	 * Private properties
	 */



	/*
	 * Private methods
	 */
	_preLoad ()
	{
		this._loadChannels();
		this._loadPrograms();
	}
	
	_loadChannels (async)
	{
		super._loadChannels(async);
		
		var filter = {
			'locale': this.mdsLanguage
		};
		
		if(this.mdsOptionalChannelFilters)
		{
			Object.assign(filter, this.mdsOptionalChannelFilters);
		}
			
		var sort = [['editorial.tvChannel', 1]];
		
		this._xhr('/btv/services',
			'filter=' + JSON.stringify(filter) + '&limit=' + this.limit + '&fields=' + JSON.stringify(this._mdsChannelFieldsBase) + '&sort=' + JSON.stringify(sort),
			async, this._loadChannelsXHRLoaded);
	}
	
	_loadChannelsXHRLoaded (status, response, tag)
	{
		for (var i = 0, item; item = response.services[i]; ++i)
		{
			var svc = this.channels.byNumber[item.editorial.tvChannel];
			
			if(svc)
			{
				svc._dataMDS = item;
			}
			else
			{
//				svc = new o5.metadata.classes.MDSChannel();
//					
//				svc._source = this;
//				svc._dataMDS = item;
//					
//				this._channels.push(svc);
			}
		}
	}
	
	_loadPrograms (async)
	{
		super._loadPrograms(async);
		
//		var filter = {
//			'locale': this.mdsLanguage
//		};
//		
//		if(this.mdsOptionalChannelFilters)
//		{
//			Object.assign(filter, this.mdsOptionalChannelFilters);
//		}
//			
//		var sort = [['editorial.tvChannel', 1]];
//		
//		this._xhr('/btv/services',
//			'filter=' + JSON.stringify(filter) + '&limit=' + this.limit + '&fields=' + JSON.stringify(this._mdsChannelFieldsBase) + '&sort=' + JSON.stringify(sort),
//			async, this._loadChannelsXHRLoaded);
	}
	
	_readAheadProgramsCompleted(tag)
	{
		if(tag.mlRet && tag.mlRet.length)
		{
//			debugger;
		}
		
		if(tag.callback)
			tag.callback(tag.dvbRet);
	}
	
	_readAheadProgramsDVBCallback(tag, ret)
	{
		tag.dvbRet = ret;
		
		if(!tag.mdsReq || tag.mdsRet)
			this._readAheadProgramsCompleted(tag);
	}
	
	_readAheadProgramsMDSCallback(tag, ret)
	{
		tag.mdsRet = ret;
		
		//if(tag.dvbRet)
			this._readAheadProgramsCompleted(tag);
	}
	
	_readAheadPrograms(channels, startTime, endTime, callback)
	{
		var tag = { channels, startTime, endTime, callback };
		
		var mdschannels = [];
		
		for(var channel of channels)
		{
			var dvbch = o5.metadata.getChannelById(channel);
			
			if(dvbch.mds)
			{
				mdschannels.push(dvbch.mds);
			}
		}
		
		if(mdschannels.length)
		{
			tag.mdsReq = true;
			
			this._readAheadPrograms(mdschannels, startTime, endTime, this._readAheadProgramsMDSCallback.bind(this, tag));
		}

		//super._readAheadPrograms(channels, startTime, endTime, this._readAheadProgramsDVBCallback.bind(this, tag));
	}
}

