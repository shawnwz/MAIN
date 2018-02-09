/**
 * @private Not for public use
 * @author lmayle
 */


o5.metadata.classes.DVBMDSChannel = class DVBMDSChannel extends o5.metadata.classes.DVBChannel
{
	constructor()
	{
		super();
	}
	
	
	
	/*
	 * Public properties
	 */
//	get programs ()
//	{
//		if (!this._programs)
//		{
//			throw(0);
//		}
//
//		return this._programs;
//	}



	/*
	 * Public methods
	 */

	

	/*
	 * Private properties
	 */



	/*
	 * Private methods
	 */
	_updateOrInsertProgram (programData)
	{
		debugger;
		
		var evt = this.getProgramById(programData.eventId);
		
		if(evt)
		{
			evt._data = programData;
		}
		else
		{
			var obj = new this.source._programClass();

			obj.source = this.source;
			obj.channel = this;
			obj.eventId = programData.eventId;
			obj._data = programData;
			
			this._programs.push(obj);
		}
	}
}
