"use strict";

Object.defineProperty(o5.gui.controls.Control.prototype, "controlName", {
	get: function get () {
		if (this._controlName === undefined) {
			var view = (this.ownerView) ? this.ownerView.localName : "",
				id = (this.id) ? this.id : (this.localName ? this.localName : null);

			this._controlName = (id) ? view + ":" + id : null;
		}
		return this._controlName;
	}
});
o5.gui.controls.Control.prototype.onControlEvent = function onControlEvent (eventName, callback) {
	var control = this.controlName;

	if (!this.id) {
		console.trace("onControlEvent: no id for this control", this.ownerView, this.localName, this.id, eventName);
	}
	if (control) {
		$util.ControlEvents.on(control, eventName, callback, this);
	} else {
		console.trace("onControlEvent: no ownerView for this control", this.ownerView, this.localName, this.id, eventName);
	}
};
o5.gui.controls.Control.prototype.fireControlEvent = function fireControlEvent (eventName) {
	var control = this.controlName,
		args = [].slice.call(arguments);

	if (control) {
		args.unshift(control); // add control
		$util.ControlEvents.fire.apply(this, args);
	} else {
		console.trace("fireControlEvent: no ownerView for this control", this.ownerView, this.localName, this.id, eventName);
	}
};
o5.gui.controls.Control.prototype.removeControlEvent = function removeControlEvent (eventName) {
	var control = this.controlName;

	if (control) {
		$util.ControlEvents.remove(control, eventName, this);
	} else {
		console.trace("removeControlEvent: no ownerView for this control", this.ownerView, this.localName, this.id, eventName);
	}
};
