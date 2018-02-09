/**
 * The ProgramListItem control is used by ProgramList. ProgramListItem extends ListItem control.
 * Can be used directly as a generic program item or as a base class for customized ProgramList items.
 *
 * Example markup for ProgramListItem is:
 * 
 * 	<o5-program-list data-orientation='vertical' data-focus-point=50%>
 * 		<template>
 * 			<app-program-list-item>
 * 				<p>Text</p>
 * 			</app-program-list-item>
 * 		</template>
 * 	</o5-program-list>
 *
 * @class o5.gui.controls.ProgramListItem
 * @extends o5.gui.controls.ListItem
 *
 * @author lmayle
 */

o5.gui.controls.ProgramListItem = function ProgramListItem () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ProgramListItem, o5.gui.controls.ListItem);

//o5.gui.controls.ProgramListItem.prototype.createdCallback = function createdCallback()
//{
//	this.superCall();
//};


o5.gui.controls.ProgramListItem.prototype.update = function update ()
{
	this.textContent = this._data.title;
};

/**
 * The metadata object associated with this control
 * @property data
 * @type {o5.data.EPGService}
 */
Object.defineProperty(o5.gui.controls.ProgramListItem.prototype, 'data', {
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
