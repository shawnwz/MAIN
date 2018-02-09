/**
 * The TimeList control is subclass of {@link o5.gui.controls.List} control and is used to show timeline for channels
 *
 * Example markup for TimeList is:
 *
 *     <o5-time-list data-orientation='horizontal'>
 *       <template>
 *         <o5-list-item>
 *           <p>Text</p>
 *         </o5-list-item>
 *       </template>
 *     </o5-time-list>
 *
 * If no template element is provided, the generic o5-list-item will be used
 *
 * @class o5.gui.controls.TimeList
 * @extends o5.gui.controls.List
 *
 * @author lmayle
 */

o5.gui.controls.TimeList = function TimeList () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.TimeList, o5.gui.controls.List);

// o5.log.setAll(o5.gui.controls.TimeList, true);

o5.gui.controls.TimeList.prototype.createdCallback = function createdCallback ()
{
	this.dataset.orientation = 'horizontal';
	
	this.superCall();
};

o5.gui.controls.TimeList.prototype.init = function init (startTime, endTime, step, pixelRatio)
{
	this.logEntry(startTime + ' ' +  endTime + ' ' + step);
	
	this.deleteAllItems();
	
	var start = startTime.getTime();
	var end = endTime.getTime();
	
	for (; start <= end; start += step)
	{
		var item = this.insertItem();
		
		item.textContent = new Date(start).format('HH:mm');
		
		item.style.width = (step / pixelRatio) + 'px';
	}
};

