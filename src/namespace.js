"use strict";

self.app = {
	gui: {
		controls: {}
	},
	data        : {},
	views       : {},
	screenConfig: {
		settings: {},
		portal  : {},
		tvguide : {},
		search  : {}
	}
};
self.$util = {};
self.$service = {
	DISCO   : {},
	EPG     : {},
	settings: {},
	SDP     : {},
	MDS     : {},
	scan    : {},
	tuner 	: {}
};
self.$actions = {
	Navigate: {},
	settings: {},
	app     : {},
	EPG     : {}
};
self.$N = {
	apps: {
		core: {}
	}
};
