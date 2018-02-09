/**
 * The ProgramList control extends the {@link o5.gui.controls.List} control.
 * 
 * Example markup for ProgramList is:
 * 
 * 	<o5-program-list data-orientation='vertical' data-focus-point='50%'>
 * 	</o5-program-list>
 * 
 * By default the orientation of program items in ProgramList control is horizontal.
 * 
 * @class o5.gui.controls.ProgramList
 * @extends o5.gui.controls.List
 *
 * @author lmayle
 */

o5.gui.controls.ProgramList = function ProgramList () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ProgramList, o5.gui.controls.List);

// o5.log.setAll(o5.gui.controls.ProgramList, true);

o5.gui.controls.ProgramList.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
};



//o5.gui.controls.ProgramList.prototype.delayActivation = 500;


o5.gui.controls.ProgramList.prototype.loadEvents = function loadEvents ()
{
	var Events = o5.platform.btv.EPG.getAllEventsOrderedByEventNumber();
	
	for (var i = 0; i < Events.length; i++)
	{
		var el = this.insertItem();
		
		el.data = Events[i];
	}
};




/**
 * Gets or sets the template used for the items of this list
 * @property itemTemplate
 * @htmlDataAttribute
 * @readonly
 * @type {Object}
 */
o5.gui.controls.Control.defineTemplatePropertyWithDataAttribute(o5.gui.controls.ProgramList.prototype, 'itemTemplate',	{
	template: o5.gui.controls.ProgramListItem,
	querySelector: ':scope template'
	});
