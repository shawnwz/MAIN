describe("$service.Video tests", function () {

	var e = $util.Events;

	beforeAll(function () {
	});

	afterAll(function () {
	});

	beforeEach(function () {
		sinon.spy(e, "on");
		sinon.spy(e, "once");
		sinon.spy(e, "fire");
		e.remove();
	});

	afterEach(function () {
		e.on.restore();
		e.once.restore();
		e.fire.restore();
	});

	describe("init()", function () {

		var registerPlayerPlayingListenerSpy,
			registerPlayerPlayFailedListenerSpy,
			registerPlayerBufferingListenerSpy,
			registerPlayerReachedEndListenerSpy,
			registerPlayerReachedStartListenerSpy,
			registerCaughtUptoLiveListenerSpy,
			registerEventBoundaryChangedListenerSpy,
			registerLockerStatusUpdateListenerSpy,
			registerOnParentalRatingChangedListenerSpy,
			registerLockerUnlockListenerSpy,
			registerResourcesLostListenerSpy,
			registerPlayerPmtUpdateListenerSpy,
			registerStreamDisabledListenerSpy,
			registerStreamEnabledListenerSpy,
			registerStreamStartedListenerSpy,
			registerSetPositionListenerSpy,
			videoPlayerSpy;

		beforeEach(function () {
			videoPlayerSpy = sinon.spy(o5.platform.output, "VideoPlayer");
			registerPlayerPlayingListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerPlayerPlayingListener");
			registerPlayerPlayFailedListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerPlayerPlayFailedListener");
			registerPlayerBufferingListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerPlayerBufferingListener");
			registerPlayerReachedEndListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerPlayerReachedEndListener");
			registerPlayerReachedStartListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerPlayerReachedStartListener");
			registerCaughtUptoLiveListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerCaughtUptoLiveListener");
			registerEventBoundaryChangedListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerEventBoundaryChangedListener");
			registerLockerStatusUpdateListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerLockerStatusUpdateListener");
			registerOnParentalRatingChangedListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerOnParentalRatingChangedListener");
			registerLockerUnlockListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerLockerUnlockListener");
			registerResourcesLostListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerResourcesLostListener");
			registerPlayerPmtUpdateListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerPlayerPmtUpdateListener");
			registerStreamDisabledListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerStreamDisabledListener");
			registerStreamEnabledListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerStreamEnabledListener");
			registerStreamStartedListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerStreamStartedListener");
			registerSetPositionListenerSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype, "registerSetPositionListener");
		});

		afterEach(function () {
			videoPlayerSpy.restore();
			registerPlayerPlayingListenerSpy.restore();
			registerPlayerPlayFailedListenerSpy.restore();
			registerPlayerBufferingListenerSpy.restore();
			registerPlayerReachedEndListenerSpy.restore();
			registerPlayerReachedStartListenerSpy.restore();
			registerCaughtUptoLiveListenerSpy.restore();
			registerEventBoundaryChangedListenerSpy.restore();
			registerLockerStatusUpdateListenerSpy.restore();
			registerOnParentalRatingChangedListenerSpy.restore();
			registerLockerUnlockListenerSpy.restore();
			registerResourcesLostListenerSpy.restore();
			registerPlayerPmtUpdateListenerSpy.restore();
			registerStreamDisabledListenerSpy.restore();
			registerStreamEnabledListenerSpy.restore();
			registerStreamStartedListenerSpy.restore();
			registerSetPositionListenerSpy.restore();
		});

		it("Creates events and initialises the player", function () {
			$service.Video.init();
			expect(videoPlayerSpy.calledOnce).toBe(true);
			expect(registerPlayerPlayingListenerSpy.calledOnce).toBe(true);
			expect(registerPlayerPlayFailedListenerSpy.calledOnce).toBe(true);
			expect(registerPlayerBufferingListenerSpy.calledOnce).toBe(true);
			expect(registerPlayerReachedEndListenerSpy.calledOnce).toBe(true);
			expect(registerPlayerReachedStartListenerSpy.calledOnce).toBe(true);
			expect(registerCaughtUptoLiveListenerSpy.calledOnce).toBe(true);
			expect(registerEventBoundaryChangedListenerSpy.calledOnce).toBe(true);
			expect(registerLockerStatusUpdateListenerSpy.calledOnce).toBe(true);
			expect(registerOnParentalRatingChangedListenerSpy.calledOnce).toBe(true);
			expect(registerLockerUnlockListenerSpy.calledOnce).toBe(true);
			expect(registerResourcesLostListenerSpy.calledOnce).toBe(true);
			expect(registerPlayerPmtUpdateListenerSpy.calledOnce).toBe(true);
			expect(registerStreamDisabledListenerSpy.calledOnce).toBe(true);
			expect(registerStreamEnabledListenerSpy.calledOnce).toBe(true);
			expect(registerStreamStartedListenerSpy.calledOnce).toBe(true);
			expect(registerSetPositionListenerSpy.calledOnce).toBe(true);

			expect(e.on.callCount).toBe(4); // once calls on
			expect(e.once.callCount).toBe(1);
			expect(e.on.calledWith("service:video:tune")).toBe(true);
			expect(e.on.calledWith("app:boot")).toBe(true);
		});
	});

	describe("events", function () {

		var preferencesGetSpy,
			preferencesSetSpy,
			getByServiceIdSpy,
			tuneSpy;

		beforeAll(function () {
		});

		afterAll(function () {
		});

		beforeEach(function () {
			preferencesGetSpy = sinon.spy(o5.platform.system.Preferences, "get");
			preferencesSetSpy = sinon.spy(o5.platform.system.Preferences, "set");
			getByServiceIdSpy = sinon.spy($service.EPG.Channel, "getByServiceId");
			tuneSpy = sinon.spy(o5.platform.output.VideoPlayer.prototype.tuner, "tune");
		});

		afterEach(function () {
			preferencesGetSpy.restore();
			preferencesSetSpy.restore();
			getByServiceIdSpy.restore();
			tuneSpy.restore();
		});

		it("Responds to the app:boot event", function () {
			$service.Video.init();
			e.fire("app:boot");
			expect(preferencesGetSpy.calledOnce).toBe(true);
			expect(preferencesGetSpy.calledWith("tv.currentServiceId")).toBe(true);
			expect(getByServiceIdSpy.calledOnce).toBe(true);
			expect(tuneSpy.calledOnce).toBe(true);
		});

		it("Responds to the service:video:tune", function () {
			var id = "123456d",
				uri = "tv://352.bbc_one";
			$service.Video.init();
			e.fire("service:video:tune", {serviceId: id, uri: uri});
			expect(tuneSpy.calledOnce).toBe(true);
			expect(tuneSpy.calledWith(uri)).toBe(true);
			e.fire("service:video:player:onPlayStarted"); // to simulate a successful play
			expect(preferencesSetSpy.callCount).toBe(2);
			expect(preferencesSetSpy.calledWith("tv.currentServiceId")).toBe(true);
			expect(preferencesSetSpy.calledWith("tv.previousServiceId")).toBe(true);
		});

		it("Responds to the service:video:tune", function () {
			var id = "123456d",
				uri = "tv://352.bbc_one";
			$service.Video.init();
			e.fire("service:video:tune", {serviceId: id, uri: uri});
			expect(tuneSpy.calledOnce).toBe(true);
			e.fire("service:video:player:onPlayStartFailed"); // to simulate a successful play
			expect(preferencesSetSpy.called).toBe(false);
		});
	});

});
