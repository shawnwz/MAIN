/**
 * The MenuItem control is used by {@link o5.gui.controls.Menu} control
 *
 * Example Markup for MenuItem is:
 * 
 * 	<o5-menu>
 * 		<template>
 * 			<o5-menu-item>
 * 				<p>Text</p>
 * 			</o5-menu-item>
 * 		</template>
 * 	</o5-menu>
 * 
 * @class o5.gui.controls.MenuItem
 * @extends o5.gui.controls.ListItem
 *
 * @author lmayle
 */

o5.gui.controls.MenuItem = function MenuItem () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.MenuItem, o5.gui.controls.ListItem);

//o5.gui.controls.MenuItem.prototype.createdCallback = function createdCallback()
//{
//	this.superCall();
//};

/*
 * Public properties
 */
/*
 * Public methods
 */
/*
 * Private properties
 */


/*
 * Private methods
 */
o5.gui.controls.MenuItem.prototype._onActivate = function _onActivate ()
{
	if (this.targetView && this.previewOnSelection)
	{
		o5.gui.ViewManager.preview(this.targetView);
	}
};

o5.gui.controls.MenuItem.prototype._onDeselect = function _onDeselect ()
{
	if (this.targetView && this.previewOnSelection)
	{
		o5.gui.ViewManager.close(this.targetView);
	}
};
