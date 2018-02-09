describe("$service.EPG.channel tests", function () {
	var GET_EVENT_NAME = "service:EPG:channel:get",
		e = $util.Events,
		eventMap = {},
		channelUpdatedCallback = sinon.spy();

	beforeAll(function () {
		// Stub registerRefreshCallback and getAllChannels. Spy on init (used by service)
		sinon.stub(o5.platform.btv.EPG, "registerRefreshCallback").yields();
		sinon.stub(o5.platform.btv.EPG, "getAllChannels").returns([{"Channel": "Fake"}]);
		sinon.stub(o5.platform.btv.EPG, "registerSvlUpdateCallback").yields();

		sinon.spy(o5.platform.btv.EPG, "init");
	});

	afterAll(function () {
		o5.platform.btv.EPG.registerRefreshCallback.restore();
		o5.platform.btv.EPG.getAllChannels.restore();
		o5.platform.btv.EPG.init.restore();
	});

	beforeEach(function () {
		eventMap = {};
	});

	describe("Channel.init", function () {
		beforeAll(function () {
			// Is this function too complicated as it has multiple points of failure?
			$service.EPG.Channel.init();
		});

		it("Should register to 'service:EPG:channel:get' event", function () {
			eventMap = e.getEvents();
			expect(eventMap[GET_EVENT_NAME].length).toBe(1);
			expect(eventMap[GET_EVENT_NAME][0].callback).toBe($service.EPG.Channel.get);
		});

		it("Should register to refreshCallback in o5", function () {
			expect(o5.platform.btv.EPG.registerRefreshCallback.calledOnce).toBe(true);
		});

		it("Should init the EPG service in o5", function () {
			expect(o5.platform.btv.EPG.init.calledOnce).toBe(true);
		});
	});

	describe("service:EPG:channel:updated", function () {
		beforeAll(function () {
			e.on("service:EPG:channel:updated", channelUpdatedCallback);
			$service.EPG.Channel.init();
			$util.Events.fire("service:MDS:channel:update", []);
		});
		it("Should be called when services are available", function () {
			expect(channelUpdatedCallback.calledOnce).toBe(true);
			expect(channelUpdatedCallback.calledWith(sinon.match.array)).toBe(true);
		});
	});

	describe("Channel.get", function () {
		beforeAll(function () {
			sinon.spy($service.EPG.Channel, "get");
		});

		afterAll(function () {
			$service.EPG.Channel.get.restore();
		});

		it("Should return an array of Channels", function () {
			$service.EPG.Channel.get();
			expect($service.EPG.Channel.get.returned(sinon.match.array)).toBe(true);
		});
	});
});
