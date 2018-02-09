/**
 * Stub for Player: CCOM.Player
 * This file defines the Player non-singleton objects.
 * These objects exist since the beginning (v5.0.0).
 * @ignore
 */
CCOM.Player = function Player(videoObj)
{
	this.id = CCOM.stubs.uuid();

	this.videoObj = videoObj;
	this.speed = CCOM.Player.prototype.DEFAULT_SPEED;
	this.tracks = {};
	//this.sourceUri = "http: //testuri";
	this.activeStreams = [ { id: 2, type: 1 },
							{ id: 3, type: 3 } ];
	this.availableStreams = [ { id: 1,
							  type: 1
							  },
							  { id: 2,
							   type: 2,
							   iaudio: { language: "eng" }
							  },
							  { id: 3,
							   type: 2,
							   iaudio: { language: "spa", dualMono: true }
							  },
							  { id: 4,
							   type: 3,
							   idvbSubtitle: { language: "eng" }
							  },
							  { id: 5,
								type: 3,
								idvbSubtitle: { language: "spa" }
							  } ];
	this.audioDetails = {};
	this.videoDetails = {};


	Object.defineProperty(this, 'position', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.position : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.player.position= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'sourceUri', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.sourceUri : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.player.sourceUri= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'destUri', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.sourceUri : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.player.sourceUri= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'htmlVideoListener', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.htmlVideoListener : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'realTimePosition', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.realTimePosition : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.player.realTimePosition= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'duration', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.duration : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.player.duration= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'bufferingLevel', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.bufferingLevel : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.player.bufferingLevel= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'videoBlankStatus', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.player) ? CCOM.stubs.stbData.player.videoBlankStatus : null ;
		},
		set: function(val) {
 			CCOM.stubs.stbData.player.videoBlankStatus= val;
 		},
		enumerable: true
	});

	this._EVENT_MAP_TABLE = [
		{
			CCOMEvent: CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_STARTED,
			htmlEvent: CCOM.Player.prototype._HTML5_VIDEO_EVENT_PLAY,
			isListened: false,
			callbacks: []
		},
		{
			CCOMEvent: CCOM.Player.prototype._CCOM_EVENT_ON_EOC,
			htmlEvent: CCOM.Player.prototype._HTML5_VIDEO_EVENT_ENDED,
			isListened: false,
			callbacks: []
		},
		{
			CCOMEvent: CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_ERRORS,
			htmlEvent: CCOM.Player.prototype._HTML5_VIDEO_EVENT_ERROR,
			isListened: false,
			callbacks: []
		},
		{
			CCOMEvent: CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_STOPPED,
			htmlEvent: CCOM.Player.prototype._HTML5_VIDEO_EVENT_PAUSE,
			isListened: false,
			callbacks: []
		},

		/* NOTE: Since there are no equivalent HTML events for CCOM events "onStreamAvailable" and "onStreamError",
		 * these events are simulated in the HTML "onplay" event.
		 * If this is the CCOM "onStreamAvailable" event, a listener is added for the html "play" event.
		 * When the "play" event is triggered, a streamAvailable event is sent.
		 */
		{
			CCOMEvent: CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_AVAILABLE,
			htmlEvent: CCOM.Player.prototype._HTML5_VIDEO_EVENT_PLAY,
			isListened: false,
			callbacks: []
		},
		{
			CCOMEvent: CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_ERROR,
			htmlEvent: CCOM.Player.prototype._HTML5_VIDEO_EVENT_PLAY,
			isListened: false,
			callbacks: []
		},
		{
			CCOMEvent: CCOM.Player.prototype._CCOM_EVENT_ON_BUFFERING,
			htmlEvent: CCOM.Player.prototype._HTML5_VIDEO_EVENT_WAITING,
			isListened: false,
			callbacks: []
		}
	];
};

CCOM.Player.prototype.DEFAULT_SPEED = 100;
//contentErrorReason
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCES_LOST = -1;
CCOM.Player.prototype.CONTENT_ERROR_REASON_SIGNAL_LOSS = -2;
CCOM.Player.prototype.CONTENT_ERROR_REASON_DISK_ERROR = -3;
CCOM.Player.prototype.CONTENT_ERROR_REASON_DISK_REMOVED = -4;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_CORE_ERROR = -5;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_CORE_SEEK = -6;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_CORE_MISSING_PLUGIN = -7;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_LIB_ERROR = -8;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_LIB_INIT = -9;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_LIB_SHUTDOWN = -10;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_LIB_SETTINGS = -11;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GST_LIB_ENCODE = -12;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_FAILED = -13;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_NOT_FOUND = -14;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_BUSY = -15;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_OPEN_READ = -16;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_OPEN_WRITE = -17;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_OPEN_READ_WRITE = -18;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_CLOSE = -19;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_READ = -20;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_WRITE = -21;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_SEEK = -22;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_SYNC = -23;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_SETTINGS = -24;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_NO_SPACE_LEFT = -25;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_FAILED = -26;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_NOT_IMPLEMENTED = -27;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_TYPE_NOT_FOUND = -28;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_WRONG_TYPE = -29;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_CODEC_NOT_FOUND = -30;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_DECODE = -31;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_ENCODE = -32;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_DEMUX = -33;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_MUX = -34;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_FORMAT = -35;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_DECRYPT = -36;
CCOM.Player.prototype.CONTENT_ERROR_REASON_STREAM_DECRYPT_NOKEY = -37;
CCOM.Player.prototype.CONTENT_ERROR_REASON_REQUESTED = -38;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RESOURCE_TRANSITION = -39;
CCOM.Player.prototype.CONTENT_ERROR_REASON_LACK_OF_RESOURCE = -40;
CCOM.Player.prototype.CONTENT_ERROR_REASON_PMT_UPDATED = -41;
CCOM.Player.prototype.CONTENT_ERROR_REASON_TUNER_ERROR = -42;
CCOM.Player.prototype.CONTENT_ERROR_REASON_INTERNAL_ERROR = -43;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_DENIED = -44;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_BLACKED_OUT = -45;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_DENIED_NO_VALID_CREDIT = -46;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_DENIED_COPY_PROTECTED = -47;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_DENIED_PARENTAL_CONTROL = -48;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_DIALOG_REQUIRED = -49;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_PAIRING_REQUIRED = -50;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_CHIPSET_PAIRING_REQUIRED = -51;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_NO_VALID_SECURE_DEVICE = -52;
CCOM.Player.prototype.CONTENT_ERROR_REASON_CA_ACCESS_OTHER = -53;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_BAD_REQUEST = -54;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_UNAUTHORIZED = -55;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_PAYMENT_REQUIRED = -56;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_FORBIDDEN = -57;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_NOT_FOUND = -58;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_METHOD_NOT_ALLOWED = -59;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_NOT_ACCEPTABLE = -60;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_PROXY_AUTH_REQUIRED = -61;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_REQUEST_TIMEOUT = -62;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_LENGTH_REQUIRED = -63;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_PRECONDITION_FAILED = -64;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_ENTIRY_TOO_LARGE = -65;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_URI_TOO_LONG = -66;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_UNSUPPORTED_MEDIA_TYPE = -67;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_INVALID_PARAMETER = -68;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_ILLEGAL_CONFERENCE_ID = -69;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_NO_BANDWIDTH = -70;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_SESSION_NOT_FOUND = -71;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_METHOD_AT_WRONG_STATE = -72;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_INVALID_HEADER_FIELD = -73;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_INVALID_RANGE = -74;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_PARAM_IS_READ_ONLY = -75;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_AGGREGATION_NOT_ALLOWED = -76;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_ONLY_AGGREGATION_ALLOWED = -77;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_UNSUPPORTED_TRANSPORT = -78;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_DESTINATION_UNREACHABLE = -79;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_CLIENT_GENERIC = -80;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_INTERNAL_SERVER_ERROR = -81;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_NOT_IMPLEMENTED = -82;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_BAD_GATEWAY = -83;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_SERVICE_UNAVAILABLE = -84;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_GATEWAY_TIMEOUT = -85;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_RTSP_VERSION_NOT_SUPPORT = -86;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_BANDWIDTH_LIMIT_EXCEEDED = -87;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_OPTION_NOT_SUPPORT = -88;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_SERVER_GENERIC = -89;
CCOM.Player.prototype.CONTENT_ERROR_REASON_RTSP_VOD_GENERIC = -90;
CCOM.Player.prototype.CONTENT_ERROR_REASON_PRM_ACCESS_DENIED = -91;
CCOM.Player.prototype.CONTENT_ERROR_REASON_DTCPIP_ACCESS_DENIED = -92;
CCOM.Player.prototype.CONTENT_ERROR_REASON_BOX_IN_DELINQUENT_STATE = -93;
CCOM.Player.prototype.CONTENT_ERROR_REASON_GENERIC = -94;
//contentStartFailedReason
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_BAD_LOCATION = -7;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_BAD_PARAM = -5;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_BAD_URI = -4;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_BLACKED_OUT = -16;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_CHIPSET_PAIRING_REQUIRED = -22;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_DENIED = -15;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_DENIED_COPY_PROTECTED = -18;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_DENIED_NO_VALID_CREDIT = -17;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_DENIED_PARENTAL_CONTROL = -19;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_DIALOG_REQUIRED = -20;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_PAIRING_REQUIRED = -21;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_NO_VALID_SECURE_DEVICE = -23;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CA_ACCESS_OTHER = -24;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_CONFLICT = -3;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_DUPLICATE_URI = -27;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_GENERIC = -26;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_INTERNAL_ERROR = -14;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -8;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_LACK_OF_RESOURCES = -2;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_NOT_SUPPORTED = -1;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_NO_LOCK = -28;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_PLAYER_BUSY = -29;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_BAD_PARTITION = -30;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_NO_LNB = -31;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_PERMISSION_DENIED = -32;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_OUT_OF_MEMORY = -25;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_OVERRIDDEN_BY_NEW_REQUEST = -6;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_PMT_UPDATED = -12;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_REQUESTED = -10;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_RESOURCE_LOST = -9;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_RESOURCE_TRANSITION = -11;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_TUNER_ERROR = -13;
CCOM.Player.prototype.CONTENT_PLAY_FAILED_REASON_BOX_IN_DELINQUENT_STATE = -33;
//contentStopFailedReason
CCOM.Player.prototype.CONTENT_STOP_FAILED_REASON_ALREADY_STOPPED = -1;
CCOM.Player.prototype.CONTENT_STOP_FAILED_REASON_GENERIC = -4;
CCOM.Player.prototype.CONTENT_STOP_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -2;
CCOM.Player.prototype.CONTENT_STOP_FAILED_REASON_PERMISSION_DENIED = -3;
//jumpToLiveFailedReason
CCOM.Player.prototype.JUMP_TO_LIVE_FAILED_INVALID_PLAY_SESSION_HANDLE = -2;
CCOM.Player.prototype.JUMP_TO_LIVE_FAILED_REASON_GENERIC = -4;
CCOM.Player.prototype.JUMP_TO_LIVE_FAILED_REASON_NOT_SUPPORTED = -1;
CCOM.Player.prototype.JUMP_TO_LIVE_FAILED_REASON_PERMISSION_DENIED = -3;
//playControlCommandType
CCOM.Player.prototype.PLAY_CONTROL_CMD_DONT_START_STREAMS = 1;
CCOM.Player.prototype.PLAY_CONTROL_CMD_POSITION = 2;
CCOM.Player.prototype.PLAY_CONTROL_CMD_EXT_SUBTITLE_INFO = 3;
CCOM.Player.prototype.PLAY_CONTROL_CMD_PLAY_MODE = 4;
CCOM.Player.prototype.PLAY_CONTROL_CMD_START_STREAMS = 5;
CCOM.Player.prototype.PLAY_CONTROL_CMD_INVALID = 6;
// Commented in 5.1.3 as not required
//playerMethodReturnErrors
/*
PLAYER_METHOD_ERROR_BAD_PARAM = 1;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_BAD_STREAM = 2;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_BAD_URI = 3;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_DUPLICATE_URI = 4;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_FAILURE = 5;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_GENERIC = 6;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_INACTIVE = 7;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_INVALID_NO_OF_PARAMS = 8;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_NOT_SUPPORTED = 9;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_STREAM_ALREADY_STARTED = 10;
CCOM.Player.prototype.PLAYER_METHOD_ERROR_STREAM_ALREADY_STOPPED = 11;
CCOM.Player.prototype.*/
//positionChangeFailedReason
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_BAD_PARAM = -6;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_GENERIC = -7;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_INACTIVE = -2;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_INVALID_NO_OF_IP_PARAMS = -4;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -5;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_NOT_SUPPORTED = -1;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_OUT_OF_BOUNDS = -3;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_TRICK_PLAY_NOT_SUPPORTED = -8;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_BUSY = -9;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_PERMISSION_DENIED = -10;
CCOM.Player.prototype.POSITION_CHANGE_FAILED_REASON_OVERRIDDEN_BY_NEW_REQUEST = -11;
//positionType
CCOM.Player.prototype.POSITION_TYPE_INVALID = 0;
CCOM.Player.prototype.POSITION_TYPE_TIME_BASED = 1;
//seekWhence
CCOM.Player.prototype.SEEK_CUR = 3;
CCOM.Player.prototype.SEEK_END = 2;
CCOM.Player.prototype.SEEK_INVALID = 0;
CCOM.Player.prototype.SEEK_SET = 1;
//speedChangeFailedReason
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_GENERIC = -4;
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_INACTIVE = -2;
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -3;
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_NOT_SUPPORTED = -1;
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_TRICK_PLAY_NOT_SUPPORTED = -5;
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_BUSY = -6;
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_BAD_PARAM = -7;
CCOM.Player.prototype.SPEED_CHANGE_FAILED_REASON_PERMISSION_DENIED = -8;
//streamAspectRatio
CCOM.Player.prototype.ASPECT_RATIO_16_9 = 2;
CCOM.Player.prototype.ASPECT_RATIO_2_21_1 = 3;
CCOM.Player.prototype.ASPECT_RATIO_4_3 = 1;
CCOM.Player.prototype.ASPECT_RATIO_HIGH_DEFINITION = 6;
CCOM.Player.prototype.ASPECT_RATIO_NONE = 0;
CCOM.Player.prototype.ASPECT_RATIO_21_9 = 4;
CCOM.Player.prototype.ASPECT_RATIO_SQUARE = 5;
CCOM.Player.prototype.ASPECT_RATIO_END = 7;
//streamAudioDualMonoChannelType
CCOM.Player.prototype.AUDIO_CHANNEL_DUAL_MONO_LEFT = 1;
CCOM.Player.prototype.AUDIO_CHANNEL_DUAL_MONO_RIGHT = 2;
CCOM.Player.prototype.AUDIO_CHANNEL_NO_DUAL_MONO = 0;
//streamAudioType
CCOM.Player.prototype.AUDIO_TYPE_CLEAN_EFFECTS = 1;
CCOM.Player.prototype.AUDIO_TYPE_HEARING_IMPAIRED = 2;
CCOM.Player.prototype.AUDIO_TYPE_UNDEFINED = 0;
CCOM.Player.prototype.AUDIO_TYPE_VISUAL_IMPAIRED_COMMENTARY = 3;
//streamCustomInfoType
CCOM.Player.prototype.STREAM_CUSTOM_TYPE_ARIB = 2;
CCOM.Player.prototype.STREAM_CUSTOM_TYPE_DVB = 1;
CCOM.Player.prototype.STREAM_CUSTOM_TYPE_NONE = 0;
//streamDisabledReason
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_BLACKED_OUT = -1;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_CHIPSET_PAIRING_REQUIRED = -8;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_DENIED = -2;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_DENIED_COPY_PROTECTED = -4;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_DENIED_NO_VALID_CREDIT = -3;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_DENIED_PARENTAL_CONTROL = -5;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_DIALOG_REQUIRED = -6;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_PAIRING_REQUIRED = -7;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_NO_VALID_SECURE_DEVICE = -9;
CCOM.Player.prototype.STREAM_DISABLED_REASON_CA_ACCESS_OTHER = -10;
CCOM.Player.prototype.STREAM_DISABLED_REASON_GENERIC = -11;
//streamDualMonoChannel
CCOM.Player.prototype.STREAM_DUAL_MONO_LEFT_CHANNEL = 1;
CCOM.Player.prototype.STREAM_DUAL_MONO_RIGHT_CHANNEL = 2;
//streamErrorReason
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_BLACKED_OUT = -9;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_CHIPSET_PAIRING_REQUIRED = -15;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_DENIED = -8;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_DENIED_COPY_PROTECTED = -11;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_DENIED_NO_VALID_CREDIT = -10;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_DENIED_PARENTAL_CONTROL = -12;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_DIALOG_REQUIRED = -13;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_PAIRING_REQUIRED = -14;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_NO_VALID_SECURE_DEVICE = -16;
CCOM.Player.prototype.STREAM_ERROR_REASON_DISK_ERROR = -4;
CCOM.Player.prototype.STREAM_ERROR_REASON_DISK_REMOVED = -5;
CCOM.Player.prototype.STREAM_ERROR_REASON_GENERIC = -18;
CCOM.Player.prototype.STREAM_ERROR_REASON_INVALID_PLAY_SESSION_HANDLE = -6;
CCOM.Player.prototype.STREAM_ERROR_REASON_OVERRIDDEN_BY_NEW_REQUEST = -3;
CCOM.Player.prototype.STREAM_ERROR_REASON_RESOURCES_LOST = -1;
CCOM.Player.prototype.STREAM_ERROR_REASON_SIGNAL_LOSS = -2;
CCOM.Player.prototype.STREAM_ERROR_REASON_STREAM_LIST_CHANGED = -7;
CCOM.Player.prototype.STREAM_ERROR_REASON_CA_ACCESS_OTHER = -17;
CCOM.Player.prototype.STREAM_ERROR_REASON_NO_MORE_CONTENT = -19;
//streamFormat
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_AAC = 18;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_AC2 = 14;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_AC3 = 15;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_AIFF = 27;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_DTS = 20;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_ENHANCED_AC3 = 16;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_G729 = 17;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_HE_AAC = 19;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_INVALID = 11;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_LPCM = 22;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_MP3 = 23;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_MP4 = 25;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_MPEG1 = 12;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_MPEG2 = 13;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_PCM = 21;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_WAVE = 26;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_WMA = 24;
CCOM.Player.prototype.STREAM_FORMAT_DATA_AIT = 48;
CCOM.Player.prototype.STREAM_FORMAT_DATA_DSMCC = 47;
CCOM.Player.prototype.STREAM_FORMAT_DATA_INVALID = 46;
CCOM.Player.prototype.STREAM_FORMAT_DATA_OTV_MODULE = 49;
CCOM.Player.prototype.STREAM_FORMAT_MUSIC_INFO_INVALID = 44;
CCOM.Player.prototype.STREAM_FORMAT_MUSIC_INFO_MUSIC_INFO = 45;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_ARIB_CLOSED_CAPTION = 36;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_DVB_SUBTITLE = 34;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_DVB_TLTXT_SUBTITLE = 33;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_EIT_608_CLOSED_CAPTION = 37;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_INVALID = 32;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_SCTE27 = 35;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_DIVX = 7;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_H264 = 6;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_INDEPENDENT_PAGE_ARIB_SUPERIMPOSE = 43;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_INDEPENDENT_PAGE_DVB_TLTXT_TELETEXT = 42;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_INDEPENDENT_PAGE_INVALID = 41;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_INVALID = 1;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_MPEG1 = 2;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_MPEG2 = 3;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_MPEG4P2 = 4;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_VC1 = 5;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_SRT = 39;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_WEBVTT = 40;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_VP8 = 8;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_XVID = 9;
CCOM.Player.prototype.STREAM_FORMAT_VIDEO_HEVC = 10;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_AAC_ADTS = 28;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_HE_AAC_ADTS = 29;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_VORBIS = 30;
CCOM.Player.prototype.STREAM_FORMAT_AUDIO_HD_MASTER = 31;
CCOM.Player.prototype.STREAM_FORMAT_SUBTITLE_DFXP = 38;
CCOM.Player.prototype.STREAM_FORMAT_PES = 50;
CCOM.Player.prototype.STREAM_FORMAT_DATA_SECTION = 51;
//streamOtvDefault
CCOM.Player.prototype.STREAM_OTV_DEFAULT = 2;
CCOM.Player.prototype.STREAM_OTV_NEVER_DEFAULT = 3;
CCOM.Player.prototype.STREAM_OTV_NONE = 0;
CCOM.Player.prototype.STREAM_OTV_NOT_DEFAULT = 1;
//streamPageDisplayTiming
CCOM.Player.prototype.PAGE_DISPLAY_ASYNC = 0;
CCOM.Player.prototype.PAGE_DISPLAY_PROGRAM_SYNC = 1;
CCOM.Player.prototype.PAGE_DISPLAY_TIME_SYNC = 2;
//streamSpecType
CCOM.Player.prototype.STREAM_SPEC_TYPE_JUST_ID = 1;
CCOM.Player.prototype.STREAM_SPEC_TYPE_JUST_TYPE = 3;
//streamStartFailedReason
CCOM.Player.prototype.STREAM_START_FAILED_REASON_ALREADY_STARTED = -22;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_BAD_PARAM = -7;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_BAD_REQUEST = -8;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_BAD_STREAM = -3;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_BAD_TAG = -5;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_BLACKED_OUT = -10;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_CHIPSET_PAIRING_REQUIRED = -17;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_DENIED = -11;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_DENIED_COPY_PROTECTED = -13;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_DENIED_NO_VALID_CREDIT = -12;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_DENIED_PARENTAL_CONTROL = -14;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_DIALOG_REQUIRED = -15;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_PAIRING_REQUIRED = -16;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_NO_VALID_SECURE_DEVICE = -18;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_GENERIC = -21;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_INACTIVE = -4;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -9;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_LACK_OF_RESOURCES = -2;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_NOT_AVAILABLE_IN_PMT = -20;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_NOT_SUPPORTED = -1;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_OVERRIDDEN_BY_NEW_REQUEST = -6;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_BUSY = -23;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_PERMISSION_DENIED = -24;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_CA_ACCESS_OTHER = -19;
CCOM.Player.prototype.STREAM_START_FAILED_REASON_AT_EOC = -25;
//streamStopFailedReason
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_ALREADY_STOPPED = -7;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_BAD_PARAM = -3;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_BAD_REQUEST = -4;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_BAD_STREAM = -1;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_GENERIC = -6;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_INACTIVE = -2;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -5;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_BUSY = -8;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_NOT_SUPPORTED = -9;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_PERMISSION_DENIED = -10;
CCOM.Player.prototype.STREAM_STOP_FAILED_REASON_AT_EOC = -11;
//streamTeletextType
CCOM.Player.prototype.ADDITIONAL_INFORMATION_PAGE = 2;
CCOM.Player.prototype.PROGRAMM_SCHEDULE_PAGE = 3;
CCOM.Player.prototype.TELETEXT_PAGE = 1;
//streamType
CCOM.Player.prototype.STREAM_TYPE_ANY = 0;
CCOM.Player.prototype.STREAM_TYPE_AUDIO = 2;
CCOM.Player.prototype.STREAM_TYPE_DATA = 6;
CCOM.Player.prototype.STREAM_TYPE_END = 7;
CCOM.Player.prototype.STREAM_TYPE_MUSIC_INFO = 5;
CCOM.Player.prototype.STREAM_TYPE_SUBTITLE = 3;
CCOM.Player.prototype.STREAM_TYPE_VIDEO = 1;
CCOM.Player.prototype.STREAM_TYPE_VIDEO_INDEPENDENT_PAGE = 4;
//uriRenovateFailedReason
CCOM.Player.prototype.PLAYER_URI_RENOVATE_FAILED_REASON_BAD_PARAM = -2;
CCOM.Player.prototype.PLAYER_URI_RENOVATE_FAILED_REASON_GENERIC = -5;
CCOM.Player.prototype.PLAYER_URI_RENOVATE_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -3;
CCOM.Player.prototype.PLAYER_URI_RENOVATE_FAILED_REASON_NOT_SUPPORTED = -1;
CCOM.Player.prototype.PLAYER_URI_RENOVATE_FAILED_REASON_PERMISSION_DENIED = -4;
//videoScanType
CCOM.Player.prototype.VIDEO_SCAN_TYPE_ENDDEF = 2;
CCOM.Player.prototype.VIDEO_SCAN_TYPE_INTERLACED = 1;
CCOM.Player.prototype.VIDEO_SCAN_TYPE_PROGRESSIVE = 0;
//playModeType
CCOM.Player.prototype.PLAY_MODE_BY_SERVICE = 2;
CCOM.Player.prototype.PLAY_MODE_BY_STREAM = 1;
CCOM.Player.prototype.PLAY_MODE_INVALID = 3;
//rbOpFailureReason
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_CONFIG_DISABLED = -6;
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_ONLY_ONE_INSTANCE_ALLOWED = -7;
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_REASON_BUSY = -4;
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_REASON_GENERIC = -8;
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_REASON_INVALID_PLAY_SESSION_HANDLE = -3;
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_REASON_MEDIA_NOT_SUPPORTED = -5;
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_REASON_NOT_SUPPORTED = -1;
CCOM.Player.prototype.RB_STATE_CHANGE_FAILED_REASON_PLAYER_INACTIVE = -2;
//videoLayerZorder
CCOM.Player.prototype.VIDEO_LAYER_ZORDER_BOTTOM = 2;
CCOM.Player.prototype.VIDEO_LAYER_ZORDER_MIDDLE = 1;
CCOM.Player.prototype.VIDEO_LAYER_ZORDER_TOP = 0;
// 5.2.4 changes
//videoResolution type
CCOM.Player.prototype.VIDEO_RESOLUTION_NONE = 0;
CCOM.Player.prototype.VIDEO_RESOLUTION_480I = 1;
CCOM.Player.prototype.VIDEO_RESOLUTION_480P = 2;
CCOM.Player.prototype.VIDEO_RESOLUTION_576I = 3;
CCOM.Player.prototype.VIDEO_RESOLUTION_576P = 4;
CCOM.Player.prototype.VIDEO_RESOLUTION_720P = 5;
CCOM.Player.prototype.VIDEO_RESOLUTION_1080I = 6;
CCOM.Player.prototype.VIDEO_RESOLUTION_1080P = 7;
CCOM.Player.prototype.VIDEO_RESOLUTION_2000P = 8; 	// otv=deprecated="5.2.4"
CCOM.Player.prototype.VIDEO_RESOLUTION_2160P = 9;
CCOM.Player.prototype.VIDEO_RESOLUTION_2540P = 10; 	// otv=deprecated="5.2.4"
CCOM.Player.prototype.VIDEO_RESOLUTION_4000P = 11; 	// otv=deprecated="5.2.4"
CCOM.Player.prototype.VIDEO_RESOLUTION_4320P = 12;

//tunerType
CCOM.Player.prototype.TUNER_TYPE_S = 0;
CCOM.Player.prototype.TUNER_TYPE_C = 1;
CCOM.Player.prototype.TUNER_TYPE_T = 2;
CCOM.Player.prototype.TUNER_TYPE_ATSC = 3;
CCOM.Player.prototype.TUNER_TYPE_IP = 4;
CCOM.Player.prototype.TUNER_TYPE_ISDBT = 5;
//FEC
CCOM.Player.prototype.FEC_INNER_1_2 = 1;
CCOM.Player.prototype.FEC_INNER_2_3 = 2;
CCOM.Player.prototype.FEC_INNER_3_4 = 3;
CCOM.Player.prototype.FEC_INNER_5_6 = 4;
CCOM.Player.prototype.FEC_INNER_7_8 = 5;
CCOM.Player.prototype.FEC_INNER_8_9 = 6;
CCOM.Player.prototype.FEC_INNER_3_5 = 7;
CCOM.Player.prototype.FEC_INNER_4_5 = 8;
CCOM.Player.prototype.FEC_INNER_9_10 = 9;
CCOM.Player.prototype.FEC_INNER_NONE = 10;
CCOM.Player.prototype.FEC_INNER_AUTO = 11;
//MOD
CCOM.Player.prototype.DVB_C_MOD_16_QAM = 1;
CCOM.Player.prototype.DVB_C_MOD_32_QAM = 2;
CCOM.Player.prototype.DVB_C_MOD_64_QAM = 3;
CCOM.Player.prototype.DVB_C_MOD_128_QAM = 4;
CCOM.Player.prototype.DVB_C_MOD_256_QAM = 5;
//polar
CCOM.Player.prototype.LNB_POLAR_H = 0;
CCOM.Player.prototype.LNB_POLAR_V = 1;
CCOM.Player.prototype.LNB_POLAR_LCIRC = 2;
CCOM.Player.prototype.LNB_POLAR_RCIRC = 3;
//STREAM control teletext
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_SET = 0;
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_NEXT = 1;
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_PREVIOUS = 2;
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_NAVIGATE = 3;
//Stream control teletext key
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_KEY0 = 0;
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_KEY1 = 1;
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_KEY2 = 2;
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_KEY3 = 3;
CCOM.Player.prototype.STREAM_CONTROL_TELETEXT_KEY4 = 4;
/*
//cryptoSystem deprecated in 5.1.5
CRYPTO_SYSTEM_NATIVE = 0;
CCOM.Player.prototype.CRYPTO_SYSTEM_PRM = 1;
CCOM.Player.prototype.CRYPTO_SYSTEM_CLEAR_KEY = 2;
CCOM.Player.prototype.CRYPTO_SYSTEM_PLAY_READY = 3;
CCOM.Player.prototype.CRYPTO_SYSTEM_WIDEVINE = 4;
CCOM.Player.prototype.CRYPTO_SYSTEM_UNKNOWN = 5;
CCOM.Player.prototype.*/
//streamWebVttTrackKind
CCOM.Player.prototype.WEBVTT_TRACK_KIND_SUBTITLE = 1;
CCOM.Player.prototype.WEBVTT_TRACK_KIND_CAPTION = 2;
CCOM.Player.prototype.WEBVTT_TRACK_KIND_DESCRIPTION = 3;
CCOM.Player.prototype.WEBVTT_TRACK_KIND_CHAPTER = 4;
CCOM.Player.prototype.WEBVTT_TRACK_KIND_METADATA = 5;
//properties
CCOM.Player.prototype._MY_NAME_SPACE = "CCOM.Player";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_CAN_PLAY = "canplay";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_CAN_PLAY_THROUGH = "canplaythrough";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_ENDED = "ended";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_EMPTIED = "emptied";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_DURATION_CHANGE = "durationchange";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_LOADED_DATA = "loadeddata";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_LOADED_METADATA = "loadedmetadata";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_LOAD_START = "loadstart";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_PAUSE = "pause";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_PLAY = "play";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_PLAYING = "playing";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_PROGRESS = "progress";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_RETECHANGE = "retechange";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_SEEKED = "seeked";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_SEEKING = "seeking";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_STALLED = "stalled";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_SUSPEND = "suspend";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_TIME_UPDATE = "timeupdate";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_VOLUME_CHANGE = "volumechange";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_WAITING = "waiting";
CCOM.Player.prototype._HTML5_VIDEO_EVENT_ERROR = "error";
CCOM.Player.prototype._CCOM_EVENT_ON_BOC = "onBoc";
CCOM.Player.prototype._CCOM_EVENT_ON_BUFFERING = "onBuffering";
CCOM.Player.prototype._CCOM_EVENT_ON_CAUGHTUP_TO_LIVE = "onCaughtUptoLive";
CCOM.Player.prototype._CCOM_EVENT_ON_EOC = "onEoc";
//_CCOM_EVENT_ON_EOC_EXT = "onEocExt",//deprecated in 5.1.5
CCOM.Player.prototype._CCOM_EVENT_ON_BOUNDARY_CHANGED = "onEventBoundaryChanged";
CCOM.Player.prototype._CCOM_EVENT_ON_JUMP_TO_LIVE_FAILED = "onJumpToLiveFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_LOCKER_STATUS_UPDATE = "onLockerStatusUpdate";
CCOM.Player.prototype._CCOM_EVENT_ON_LOCKER_UNLOCK = "onLockerUnlock";
CCOM.Player.prototype._CCOM_EVENT_ON_PARENTAL_RATING_CHANGED = "onParentalRatingChanged";
CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_ERRORS = "onPlayError";
CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_START_FAILED = "onPlayStartFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_STARTED = "onPlayStarted";
CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_STOP_FAILED = "onPlayStopFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_STOPPED = "onPlayStopped";
CCOM.Player.prototype._CCOM_EVENT_ON_POSITION_CHANGED_FAILED = "onPositionChangeFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_POSITION_CHANGED = "onPositionChanged";
CCOM.Player.prototype._CCOM_EVENT_ON_READY_FOR_START_STREAMS = "onReadyForStartStreams";
CCOM.Player.prototype._CCOM_EVENT_ON_REVIEW_BUFFER_DISABLE_FAILED = "onReviewBufferDisableFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_REVIEW_BUFFER_DISABLED = "onReviewBufferDisabled";
CCOM.Player.prototype._CCOM_EVENT_ON_REVIEW_BUFFER_ENABLED_FAILED = "onReviewBufferEnableFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_REVIEW_BUFFER_ENABLED = "onReviewBufferEnabled";
CCOM.Player.prototype._CCOM_EVENT_ON_REVIEW_BUFFER_STARTED = "onReviewBufferStarted";
CCOM.Player.prototype._CCOM_EVENT_ON_REVIEW_BUFFER_STOPPED = "onReviewBufferStopped";
CCOM.Player.prototype._CCOM_EVENT_ON_SIGNAL_GAIN = "onSignalGain";
CCOM.Player.prototype._CCOM_EVENT_ON_SIGNAL_LOSS = "onSignalLoss";
CCOM.Player.prototype._CCOM_EVENT_ON_SPEED_CHANGED_FAILED = "onSpeedChangeFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_SPEED_CHANGED = "onSpeedChanged";
CCOM.Player.prototype._CCOM_EVENT_ON_SPEED_CHANGED_UPDATED = "onSpeedUpdated";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_AVAILABLE = "onStreamAvailable";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_DISABLED = "onStreamDisabled";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_ENABLED = "onStreamEnabled";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_ERROR = "onStreamError";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_START_FAILED = "onStreamStartFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_STARTED = "onStreamStarted";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_STARTED_FROM_DEFAULT_LOCATION = "onStreamStartedFromDefaultLocation";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_STOP_FAILED = "onStreamStopFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_STREAM_STOPPED = "onStreamStopped";
CCOM.Player.prototype._CCOM_EVENT_ON_URI_RENOVATE_FAILED = "onUriRenovateFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_URI_RENOVATED = "onUriRenovated";
CCOM.Player.prototype._CCOM_EVENT_ON_VIDEO_ASPECT_CHANGED = "onVideoAspectChanged";
CCOM.Player.prototype._CCOM_EVENT_ON_VIDEO_BLANK_FAILED = "onVideoBlankFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_VIDEO_BLANKED = "onVideoBlanked";
CCOM.Player.prototype._CCOM_EVENT_ON_VIDEO_UNBLANK_FAILED = "onVideoUnblankFailed";
CCOM.Player.prototype._CCOM_EVENT_ON_VIDEO_UNBLANKED = "onVideoUnblanked";
CCOM.Player.prototype._CCOM_EVENT_ON_CLOSED_CAPTION_DATA = "onClosedCaptionData";
CCOM.Player.prototype._CCOM_EVENT_ON_IFRAME_DECODE = "onIframeDecode", //otv =private="true"
CCOM.Player.prototype._CCOM_EVENT_ON_VIDEO_DETAILS_CHANGED = "onVideoDetailsChanged";
CCOM.Player.prototype._CCOM_EVENT_ON_CONTENT_PROFILE_CHANGED = "onContentProfileChanged";
CCOM.Player.prototype._CCOM_EVENT_ON_CAPPING_BITRATE_NOT_AVAILABLE = "onCappingBitrateNotAvailable";

//_CCOM_EVENT_ON_CRYPTO_NEED_KEY = "onCryptoNeedKey",//deprecated in 5.1.5

CCOM.Player.prototype._EVENT_SET_POSITION_OK = "setPositionOK";
CCOM.Player.prototype._EVENT_SET_POSITION_FAILED = "setPositionFailed";
CCOM.Player.prototype._EVENT_SET_SPEED_OK = "setSpeedOK";
CCOM.Player.prototype._EVENT_SET_SPEED_FAILED = "setSpeedFailed";
CCOM.Player.prototype._EVENT_START_STREAMS_OK = "startStreamsOK";
CCOM.Player.prototype._EVENT_START_STREAMS_FAILED = "startStreamsFailed";
CCOM.Player.prototype._EVENT_STOP_STREAMS_OK = "stopStreamsOK";
CCOM.Player.prototype._EVENT_STOP_STREAMS_FAILED = "stopStreamsFailed";
CCOM.Player.prototype._EVENT_PLAY_OK = "playOK";
CCOM.Player.prototype._EVENT_PLAY_FAILED = "playFailed";
CCOM.Player.prototype._EVENT_STOP_OK = "stopOK";
CCOM.Player.prototype._EVENT_STOP_FAILED = "stopFailed";
CCOM.Player.prototype._EVENT_JUMP_TO_LIVE_OK = "jumpToLiveOK";
CCOM.Player.prototype._EVENT_JUMP_TO_LIVE_FAILED = "jumpToLiveFailed";
CCOM.Player.prototype._EVENT_RENOVATE_URI_OK = "renovateUriOK";
CCOM.Player.prototype._EVENT_RENOVATE_URI_FAILED = "renovateUriFailed";
CCOM.Player.prototype._EVENT_SET_STREAM_CONTROL_OK = "setStreamControlOK";
CCOM.Player.prototype._EVENT_SET_STREAM_CONTROL_FAILED = "setStreamControlFailed";
//_EVENT_SET_POSITION_WITH_SEQ_NUM_OK = "setPositionWithSeqNumOK",//deprecated in 5.1.5
//_EVENT_SET_POSITION_WITH_SEQ_NUM_FAILED = "setPositionWithSeqNumFailed",//deprecated in 5.1.5
CCOM.Player.prototype._EVENT_BLANK_VIDEO_OK = "blankVideoOK";
CCOM.Player.prototype._EVENT_BLANK_VIDEO_FAILED = "blankVideoFailed";
CCOM.Player.prototype._EVENT_UNBLANK_VIDEO_OK = "unblankVideoOK";
CCOM.Player.prototype._EVENT_UNBLANK_VIDEO_FAILED = "unblankVideoFailed";
CCOM.Player.prototype._EVENT_GET_STREAM_CONTROL_OK = "getStreamControlOK";
CCOM.Player.prototype._EVENT_GET_STREAM_CONTROL_FAILED = "getStreamControlFailed";
CCOM.Player.prototype._EVENT_GET_RESOURCE_STATISTIC_OK = "getResourceStatisticOK";
CCOM.Player.prototype._EVENT_GET_RESOURCE_STATISTIC_FAILED = "getResourceStatisticFailed";
CCOM.Player.prototype._EVENT_GET_BROADCAST_SIGNAL_INFO_OK = "getBroadcastSignalInfoOK";
CCOM.Player.prototype._EVENT_GET_BROADCAST_SIGNAL_INFO_FAILED = "getBroadcastSignalInfoFailed";
CCOM.Player.prototype._EVENT_SET_VIDEO_LAYER_DETAILS_OK = "setVideoLayerDetailsOK";
CCOM.Player.prototype._EVENT_SET_VIDEO_LAYER_DETAILS_FAILED = "setVideoLayerDetailsFailed",

		
CCOM.Player.prototype.setPosition = function(command)
{
	var pos, _handle = CCOM.stubs.getHandle();

	if (command.whence === this.SEEK_CUR)
	{
		pos = this.position += command.timePosition;
		this.position = pos < 0 ? 0 : pos;
	}
	else
	{
		pos = this.position = command.timePosition;
		this.position = pos < 0 ? 0 : pos;
	}

	if (this.position === 0)
	{
		CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._CCOM_EVENT_ON_BOC, {
			target : this,
			handle : _handle
		}, 10);
	}

	if (command && command.type === this.POSITION_TYPE_TIME_BASED && command.whence === this.SEEK_SET)
	{
		// this.videoObj.src = this.videoObj.src.split("#t=")[0] + "#t=" + command.timePosition / 1000;
		this.videoObj.currentTime = command.timePosition / 1000;
	}
	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_SET_POSITION_OK, {
		target : this,
		handle : _handle
	});
	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._CCOM_EVENT_ON_POSITION_CHANGED, {
		target : this,
		positionChangedInfo : {
			newPosition : this.position,
			playSessionHandle : _handle
		}
	}, 10);
	return _handle;
};

CCOM.Player.prototype.setSpeed = function(speed)
{
	var _handle = CCOM.stubs.getHandle();
	var oldSpeed = this.speed;

	this.speed = speed;
	this.videoObj.playbackRate = this.speed / this.DEFAULT_SPEED;
	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_SET_SPEED_OK, {
		target : this,
		handle : _handle
	});
	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._CCOM_EVENT_ON_SPEED_CHANGED, {
		target : this,
		speedChangedInfo : {
			newSpeed : this.speed,
			oldSpeed : oldSpeed,
			playSessionHandle : _handle
		}
	}, 10);
	return _handle;
};

CCOM.Player.prototype.setReviewBuffer = function(reviewBufferObj)
{
	this.realTimePosition = reviewBufferObj;
};

CCOM.Player.prototype.getHtmlVideoListener = function(event)
{
	// for sent ccom event
	var instance = this, evt = {
		contentErrorInfo : ''
	}, index = 0, callbacks = [];

	for (index = 0; index < instance._EVENT_MAP_TABLE.length; index += 1)
	{
		if (instance._EVENT_MAP_TABLE[index].CCOMEvent === event)
		{
			callbacks = instance._EVENT_MAP_TABLE[index].callbacks;
			break;
		}
	}

	switch (event)
	{

	case instance._CCOM_EVENT_ON_STREAM_AVAILABLE:
		evt.streamsAvailableInfo = {
			streamInfo : {
				id : 2,
				type : 2,
				iaudio : {
					language : "eng"
				}
			}
		};
		break;
	case instance._CCOM_EVENT_ON_PLAY_STARTED:
		evt.contentStartedInfo = {
			sourceUri : instance.sourceUri
		};
		break;
	case instance._CCOM_EVENT_ON_PLAY_ERRORS:
		evt.contentErrorInfo = {
			sourceUri : instance.sourceUri
		};
		break;
	case instance._CCOM_EVENT_ON_BUFFERING:
		evt.bufferingInfo = {
			percentBuffered : 80
		}; // Using 80 as a placeholder, one improvement would be to calculate the actual percent buffered
		break;
	default:
	}

	return function(e)
	{

		// if (instance.sourceUri != "http://testuri" && callbacks.length !== 0) {
		if (instance.sourceUri != "" && callbacks.length !== 0)
		{

			evt.target = instance;
			callbacks.forEach(function(hook)
			{
				hook(evt);
			});
		}
	};
};

CCOM.Player.prototype.getResourceStatistic = function(){
	this.logWarning("This API has not been implemented yet!");
    var hdl = CCOM.stubs.getHandle();
    CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_RESOURCE_STATISTIC_FAILED, {
		target: this,
		handle: hdl,
		error: {
			domain: "com.opentv.Player",
			message: "Not implemented yet. "
		}
	});
	return hdl;
};

CCOM.Player.prototype.setMaxResolution = function(resolution)
{
	this.logWarning("This API has not been implemented yet!");
	return {
		error : {
			domain : "com.opentv.Player",
			name : "Failed",
			message : "Not implemented yet"
		}
	};
};

CCOM.Player.prototype.addEventListener = function(event, callback)
{
	var instance = this;

	if (-1 === this._supportedEvents.indexOf(event))
	{
		var index = 0;

		for (index = 0x0; index < this._EVENT_MAP_TABLE.length; index += 1)
		{
			if (this._EVENT_MAP_TABLE[index].CCOMEvent === event)
			{

				this._EVENT_MAP_TABLE[index].callbacks.push(callback);

				if (!this._EVENT_MAP_TABLE[index].isListened)
				{

					/*
					 * If this is the CCOM "onStreamError" event, a listener is added for the html "play" event. When the
					 * "play" event is triggered, two streamError events are sent, one for audio and one for subtitle.
					 */
					if (event === this._CCOM_EVENT_ON_STREAM_ERROR)
					{
						this.videoObj.addEventListener(this._EVENT_MAP_TABLE[index].htmlEvent, function()
						{
							var callbacks = instance._EVENT_MAP_TABLE[index].callbacks;
							var evt = {
								contentErrorInfo : ''
							};

							evt.target = instance;
							evt.streamErrorInfo = {
								id : 4,
								type : 3
							};
							callbacks.forEach(function(hook)
							{
								hook(evt);
							});
						});
						this.videoObj.addEventListener(this._EVENT_MAP_TABLE[index].htmlEvent, function()
						{
							var callbacks = instance._EVENT_MAP_TABLE[index].callbacks;
							var evt = {
								contentErrorInfo : ''
							};

							evt.target = instance;
							evt.streamErrorInfo = {
								id : 3,
								type : 2
							};
							callbacks.forEach(function(hook)
							{
								hook(evt);
							});
						});
					}
					else
					{
						this.videoObj.addEventListener(this._EVENT_MAP_TABLE[index].htmlEvent, this.getHtmlVideoListener(event));
						this._EVENT_MAP_TABLE[index].isListened = true;
					}
				}

				return [];
			}
		}
		this.logInfo("The event is not supported");
		return {
			error : {
				domain : "com.opentv.CCOM",
				name : "UnsupportedEvent",
				message : "the event is not supported"
			}
		};
	}
	else
	{
		return CCOM.stubs.addEventListener(this.id, this._MY_NAME_SPACE, event, callback);
	}
};

CCOM.Player.prototype.removeEventListener = function(event, callback)
{
	if (-1 === this._supportedEvents.indexOf(event))
	{
		var index = 0, i, callbacks, isDelelted = false;

		for (index = 0x0; index < this._EVENT_MAP_TABLE.length; index++)
		{
			if (this._EVENT_MAP_TABLE[index].CCOMEvent === event)
			{
				callbacks = this._EVENT_MAP_TABLE[index].callbacks;
				for (i = 0; i < callbacks.length; i++)
				{
					if (callbacks[i] === callback)
					{
						callbacks.splice(i, 1);
						isDelelted = true;
					}
				}
				if (callbacks.length === 0 && isDelelted)
				{
					this.videoObj.removeEventListener(this._EVENT_MAP_TABLE[index].htmlEvent, this
							.getHtmlVideoListener(event));
					this._EVENT_MAP_TABLE[index].isListened = false;
				}

				break;
			}
		}
		if (isDelelted)
		{
			return [];
		}
		else
		{
			this.logInfo("The callback function can not be found");
			return {
				error : {
					domain : "com.opentv.CCOM",
					name : "InvalidArguments",
					message : "the callback function can not be found"
				}
			};
		}
	}
	else
	{
		return CCOM.stubs.removeEventListener(this.id, this._MY_NAME_SPACE, event, callback);
	}
};

CCOM.Player.prototype.startStreams = function(context)
{
	var contextCount, i, stream, _handle = CCOM.stubs.getHandle();

	for (contextCount = 0; contextCount < context.length; contextCount += 1)
	{
		for (i = 0; i < this.availableStreams.length; i += 1)
		{
			if (context[contextCount].id === this.availableStreams[i].id)
			{
				stream = this.availableStreams[i];
				break;
			}
		}
		if (stream)
		{
			for (i = 0; i < this.activeStreams.length; i += 1)
			{
				if (this.activeStreams[i].type === stream.type)
				{
					this.activeStreams.splice(i, 1);
					break;
				}
			}
			this.activeStreams.push({
				id : stream.id,
				type : stream.type
			});

			CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_START_STREAMS_OK, {
				target : this,
				handle : _handle
			});
			return _handle;
		}
	}
	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_START_STREAMS_FAILED, {
		target : this,
		handle : _handle,
		error : {
			message : "Stream unavailable"
		}
	});
	return _handle;
};

CCOM.Player.prototype.stopStreams = function(context)
{
	var newActiveStreams = [], contextCount, i, stopStream = false, _handle = CCOM.stubs.getHandle();

	for (i = 0; i < this.activeStreams.length; i++)
	{
		stopStream = false;
		for (contextCount = 0; contextCount < context.length; contextCount += 1)
		{
			if (context[contextCount].stopStreamTypes === this.activeStreams[i].type)
			{
				stopStream = true;
				break;
			}
		}
		if (!stopStream)
		{
			newActiveStreams.push(this.activeStreams[i]);
		}
	}
	if (this.activeStreams.length === newActiveStreams.length)
	{
		CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_STOP_STREAMS_FAILED, {
			target : this,
			handle : _handle,
			error : {
				message : "Stream type not found"
			}
		});
	}
	else
	{
		this.activeStreams = newActiveStreams;
		CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_STOP_STREAMS_OK, {
			target : this,
			handle : _handle
		});
	}
	return _handle;
};

CCOM.Player.prototype.play = function(sourceUri, controlCommands)
{
	var _handle = CCOM.stubs.getHandle(), scripts = document.getElementsByTagName("script"), me = this, path, i;

	if (sourceUri !== "")
	{
	    if(this.videoObj.hls)
        {
        	this.videoObj.hls.destroy();
        	delete this.videoObj.hls;
        }

        if(sourceUri.indexOf('m3u8') != -1 && Hls.isSupported())
        {
        	this.sourceUri = sourceUri;
        	this.videoObj.hls = new Hls({ debug: false, enableWorker: true });
			this.videoObj.hls.attachMedia(this.videoObj);
			this.videoObj.hls.loadSource(sourceUri);
     	
			this.videoObj.hls.on(Hls.Events.MANIFEST_PARSED, function(event,data) {
				
				this.videoObj.play();
				// Get the full duration of stream
				if(data.levels[0].details.totalduration)
				{
					this.duration = data.levels[0].details.totalduration * 1000;
				}
				
			}.bind(this));

				// Get the buffering level info and project the percentage of download completion 
			this.videoObj.hls.on(Hls.Events.FRAG_LOADED, function(event,data) {
				

				if(this.duration)
				{
					this.bufferingLevel = Math.round(((data.frag.start)/(this.duration/1000) ) * 100 )
				}
				
			}.bind(this));

			this.videoObj.hls.on(Hls.Events.ERROR, function(event,data) {
				
				if(data.type != "otherError")
				{
					CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_PLAY_FAILED, {
						target: this,
						handle: _handle,
						error: {
							// networkError/mediaError
							message: "Error in play due to: "+data.type
						}
					});
				} else {

					CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._CCOM_EVENT_ON_PLAY_START_FAILED, {
						target: this,
						contentStartFailedInfo: {
							sourceUri: this.sourceUri,
							reason: this.CONTENT_PLAY_FAILED_REASON_INTERNAL_ERROR
						}
					});
				}					
				return _handle;

			}.bind(this));

        } else if (sourceUri && sourceUri.substring(0, 3) === "tv:")
		{
			if (sourceUri !== this.sourceUri)
			{
				this.sourceUri = sourceUri;
				// Just for html browser supported video tag.
				this.videoObj.loop = true;
				if (controlCommands && controlCommands.length
						&& controlCommands[0].commandType === this.PLAY_CONTROL_CMD_DONT_START_STREAMS)
				{
					this.videoObj.autoplay = false;
				}
				else
				{
					this.videoObj.autoplay = true;
				}

				if (CCOM.stubs.stbData.player && CCOM.stubs.stbData.player.videoData)
				{
					if (CCOM.stubs.stbData.player.videoData.current == undefined
							|| CCOM.stubs.stbData.player.videoData.current >= CCOM.stubs.stbData.player.videoData.length)
					{
						CCOM.stubs.stbData.player.videoData.current = 0;
					}

					this.videoObj.src = CCOM.stubs.stbData.player.videoData[CCOM.stubs.stbData.player.videoData.current];
					// this.videoObj.src = 'file:///D:/1.webm';

					CCOM.stubs.stbData.player.videoData.current++;
				}
				else if (CCOM.stubs.stbData.path)
				{
					this.videoObj.src = CCOM.stubs.stbData.path + sourceUri.match('tv:\/\/(.*)')[1] + '.webm';
				}
			}
			else
			{
				this.videoObj.play(); // play paused video
			}
		}
		else if (sourceUri !== this.sourceUri)
		{
			this.sourceUri = sourceUri;
			this.videoObj.loop = false;
			if (controlCommands && controlCommands.length
					&& controlCommands[0].commandType === this.PLAY_CONTROL_CMD_DONT_START_STREAMS)
			{
				this.videoObj.autoplay = false;
			}
			else
			{
				this.videoObj.autoplay = true;
			}
			this.videoObj.src = sourceUri;
		}
		else
		{
			this.videoObj.play(); // play paused video
		}
		if (controlCommands && controlCommands.length && controlCommands[0].commandType === this.PLAY_CONTROL_CMD_POSITION
				&& controlCommands[0].positionCommandData.type === this.POSITION_TYPE_TIME_BASED
				&& controlCommands[0].positionCommandData.whence === this.SEEK_SET)
		{
			// this.videoObj.src = this.videoObj.src + "#t=" + controlCommands[0].positionCommandData.timePosition / 1000;
		}

		CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_PLAY_OK, {
			target : this,
			handle : _handle
		});
	}
	else
	{
		CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_PLAY_FAILED, {
			target : this,
			handle : _handle,
			error : {
				message : "Source URI not provided"
			}
		});
		CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._CCOM_EVENT_ON_PLAY_START_FAILED, {
			target : this,
			contentStartFailedInfo : {
				sourceUri : me.sourceUri
			}
		});
	}
	return _handle;
};

CCOM.Player.prototype.stop = function()
{
	var _handle = CCOM.stubs.getHandle();

	this.videoObj.pause();
	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_STOP_OK, {
		target : this,
		handle : _handle
	});
	return _handle;
};

CCOM.Player.prototype.blankVideo = function()
{
	this.videoObj.style.display = 'none';
	this.videoBlankStatus = true;
};

CCOM.Player.prototype.unblankVideo = function()
{
	this.videoObj.style.display = '';
	this.videoBlankStatus = false;
};

CCOM.Player.prototype.jumpToLive = function()
{
	// jump from playback
	var path, scripts = document.getElementsByTagName("script"), i;

	this.videoObj.loop = true;
	this.videoObj.autoplay = true;
	for (i = 0; i < scripts.length; i += 1)
	{
		if (scripts[i].src.indexOf("stub") >= 0 && scripts[i].src.indexOf("Player.js") >= 0)
		{
			path = scripts[i].src.substr(0, scripts[i].src.indexOf("Player.js"));
			break;
		}
	}
	if (path)
	{
		if (this.videoObj.src.indexOf("1.ogv") > 0)
		{
			this.videoObj.src = path + "video/1.ogv";
		}
		else
		{
			this.videoObj.src = path + "video/2.ogv";
		}
	}
};

CCOM.Player.prototype.renovateUri = function(renovatedUri)
{
	var _handle = CCOM.stubs.getHandle();

	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_RENOVATE_URI_FAILED, {
		target : this,
		handle : _handle,
		error : {
			domain : "com.opentv.Player",
			message : ""
		}
	});
	return _handle;
};

CCOM.Player.prototype.getStreamControl = function(command)
{
	return {
		streamCommandControlData : {}
	};
};

CCOM.Player.prototype.setStreamControl = function(command, data)
{
	var _handle = CCOM.stubs.getHandle();

	CCOM.stubs.raiseEvent(this.id, this._MY_NAME_SPACE, this._EVENT_SET_STREAM_CONTROL_FAILED, {
		target : this,
		handle : _handle,
		error : {
			domain : "com.opentv.Player",
			message : ""
		}
	});
	return _handle;
};

// Newly added in 5.1.3
CCOM.Player.prototype.setVideoLayerDetails = function(propertyObj)
{
	if (propertyObj.zOrder)
	{
		this.videoObj.zOrder = propertyObj.zOrder;
	}
};

CCOM.Player.prototype.getBroadcastSignalInfo = function()
{
	var BroadcastSignalInfo = {
		BER : 1,
		cnrPercent : 50,
		dvbC : {},
		dvbS : {
			STunerFec : 2,
			STunerFreqKhz : 11170000,
			STunerLnbPolar : 1,
			STunerModulation : 1,
			STunerSymbolRateKsps : 27500
		},
		dvbT : {},
		ip : {
			IPFecOverhead : "",
			IPMulticastSource : ""
		},
		isdbt : {
			ISDBFreqHz : 9750000
		},
		lockStatus : 0,
		networkId : 2,
		qualityPercent : 50,
		serviceId : 1,
		transportStreamId : 1,
		tunerType : 0
	};

	return BroadcastSignalInfo;
};

CCOM.Player.prototype._supportedEvents = [
	CCOM.Player.prototype._EVENT_SET_POSITION_OK,
	CCOM.Player.prototype._EVENT_SET_POSITION_FAILED,
	CCOM.Player.prototype._EVENT_SET_SPEED_OK,
	CCOM.Player.prototype._EVENT_SET_SPEED_FAILED,
	CCOM.Player.prototype._EVENT_START_STREAMS_OK,
	CCOM.Player.prototype._EVENT_START_STREAMS_FAILED,
	CCOM.Player.prototype._EVENT_STOP_STREAMS_OK,
	CCOM.Player.prototype._EVENT_STOP_STREAMS_FAILED,
	CCOM.Player.prototype._EVENT_PLAY_OK,
	CCOM.Player.prototype._EVENT_PLAY_FAILED,
	CCOM.Player.prototype._EVENT_STOP_OK,
	CCOM.Player.prototype._EVENT_STOP_FAILED,
	CCOM.Player.prototype._EVENT_RENOVATE_URI_OK,
	CCOM.Player.prototype._EVENT_RENOVATE_URI_FAILED,
	CCOM.Player.prototype._EVENT_SET_STREAM_CONTROL_OK,
	CCOM.Player.prototype._EVENT_SET_STREAM_CONTROL_FAILED,
	CCOM.Player.prototype._EVENT_SET_POSITION_WITH_SEQ_NUM_OK,
	CCOM.Player.prototype._EVENT_SET_POSITION_WITH_SEQ_NUM_FAILED,
	CCOM.Player.prototype._CCOM_EVENT_ON_SPEED_CHANGED,
	CCOM.Player.prototype._CCOM_EVENT_ON_POSITION_CHANGED,
	CCOM.Player.prototype._CCOM_EVENT_ON_BOC,
	CCOM.Player.prototype._CCOM_EVENT_ON_PLAY_START_FAILED
];
