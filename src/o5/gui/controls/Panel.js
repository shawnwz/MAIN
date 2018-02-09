/**
 * Panel is a simple container control
 *
 * Example markup of Panel control is::
 *
 *     <o5-panel>
 *         <!-- other elements of any kind /-->
 *     </o5-panel>
 *
 * See below example of O5JS Panel control
 * 
 *     @example
 *     <o5-panel style="width: 300px; 
 *     		height: 100px; 
 *     		margin: 10px 5px 0px 10px; 
 *     		border:1px solid black; 
 *     		background-color: #f2f2f2;">
 *     </o5-panel>  
 *     
 * @class o5.gui.controls.Panel
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.Panel = function Panel () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.Panel);

o5.gui.controls.Panel.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
};
