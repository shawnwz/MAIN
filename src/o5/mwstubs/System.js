/**
 * Stub for System: CCOM.System, a singleton added since v5.0.0
 * @ignore
 */
CCOM.System = new (function System()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.System";
	this._id = CCOM.stubs.uuid();
	this._hdmiConnected = true;
	this._videoFormat = 5;
	this._aspectMode = 1;
	this._audioDelay = 0;
	this._audioType = 1;
	this._3DFormat = 1;
	this._videoColorEncoding = 1;
	this._analogueConnected = true;
	this._analogueAspectMode = 1;
	this._aspectRatio = 1;
	// event from xml
	this._EVENT_ON_3D_MODE = "on3dModeEvent";
	this._EVENT_ON_TEMPERATURE_LEVEL_ALERT = "onTemperatureLevelAlert";
	this._EVENT_ON_HDMI_CEC = "onHdmiCecEvent";
	this._EVENT_ON_HDMI = "onHdmiEvent";
	this._EVENT_ON_SYSTEM_STANDBY = "onSystemStandby";
	this._EVENT_ON_SYSTEM_WAKE = "onSystemWake";
	this._EVENT_ON_HDMI_CEC_MGR_EVENT = "onHdmiCecMgrEvent";
	// event from methods
	this._EVENT_REBOOT_OK = "rebootOK"; // otv:deprecated="5.1.3"
	this._EVENT_REBOOT_FAILED = "rebootFailed"; // otv:deprecated="5.1.3"
	this._EVENT_RESET_OK = "resetOK"; // otv:deprecated="5.1.3"
	this._EVENT_RESET_FAILED = "resetFailed"; // otv:deprecated="5.1.3"
	this._EVENT_SET_STANDBY_OK = "setStandbyOK"; // otv:deprecated="5.1.3"
	this._EVENT_SET_STANDBY_FAILED = "setStandbyFailed"; // otv:deprecated="5.1.3"
	this._EVENT_GET_STANDBY_OK = "getStandbyOK"; // otv:deprecated="5.1.3"
	this._EVENT_GET_STANDBY_FAILED = "getStandbyFailed"; // otv:deprecated="5.1.3"
	this._EVENT_SET_SOFTWARE_UPGRADE_DATA_OK = "setSoftwareUpgradeDataOK"; // otv:deprecated="5.1.3"
	this._EVENT_SET_SOFTWARE_UPGRADE_DATA_FAILED = "setSoftwareUpgradeDataFailed"; // otv:deprecated="5.1.3"
	this._EVENT_SET_FRONT_PANEL_CONTROL_OK = "frontPanelControlOK";
	this._EVENT_SET_FRONT_PANEL_CONTROL_FAILED = "frontPanelControlFailed";
	this._EVENT_SET_FRONT_PANEL_STRING_OK = "setFrontPanelStringOK";
	this._EVENT_SET_FRONT_PANEL_STRING_FAILED = "setFrontPanelStringFailed";
	this._EVENT_SET_FRONT_PANEL_BLINK_PERIOD_OK = "setFrontPanelBlinkPeriodOK";
	this._EVENT_SET_FRONT_PANEL_BLINK_PERIOD_FAILED = "setFrontPanelBlinkPeriodFailed";
	this._EVENT_SET_FRONT_PANEL_FADE_PERIOD_OK = "setFrontPanelFadePeriodOK";
	this._EVENT_SET_FRONT_PANEL_FADE_PERIOD_FAILED = "setFrontPanelFadePeriodFailed";
	this._EVENT_SET_FRONT_PANEL_INTENSITY_LEVEL_OK = "setFrontPanelIntensityLevelOK";
	this._EVENT_SET_FRONT_PANEL_INTENSITY_LEVEL_FAILED = "setFrontPanelIntensityLevelFailed";
	this._EVENT_SET_LED_SPIN_STATE_OK = "setLedSpinStateOK";
	this._EVENT_SET_LED_SPIN_STATE_FAILED = "setLedSpinStateFailed";
	this._EVENT_SET_LED_STATE_OK = "setLedStateOK";
	this._EVENT_SET_LED_STATE_FAILED = "setLedStateFailed";
	this._EVENT_GET_LED_STATE_OK = "getLedStateOK";
	this._EVENT_GET_LED_STATE_FAILED = "getLedStateFailed";
	this._EVENT_SET_VCR_SCART_RECORD_OK = "setVcrScartRecordOK";
	this._EVENT_SET_VCR_SCART_RECORD_FAILED = "setVcrScartRecordFailed";
	this._EVENT_SET_SCART_VIDEO_FORMAT_OK = "setScartVideoFormatOK";
	this._EVENT_SET_SCART_VIDEO_FORMAT_FAILED = "setScartVideoFormatFailed";
	this._EVENT_GET_SCART_VIDEO_FORMAT_OK = "getScartVideoFormatOK";
	this._EVENT_GET_SCART_VIDEO_FORMAT_FAILED = "getScartVideoFormatFailed";
	this._EVENT_SET_ANALOGUE_CCI_OK = "setAnalogueCCIOK";
	this._EVENT_SET_ANALOGUE_CCI_FAILED = "setAnalogueCCIFailed";
	this._EVENT_GET_ANALOGUE_CCI_OK = "getAnalogueCCIOK";
	this._EVENT_GET_ANALOGUE_CCI_FAILED = "getAnalogueCCIFailed";
	this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_MODE_OK = "setAnalogueVideoAspectModeOK";
	this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_MODE_FAILED = "setAnalogueVideoAspectModeFailed";
	this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_MODE_OK = "getAnalogueVideoAspectModeOK";
	this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_MODE_FAILED = "getAnalogueVideoAspectModeFailed";
	this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_RATIO_OK = "setAnalogueVideoAspectRatioOK";
	this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_RATIO_FAILED = "setAnalogueVideoAspectRatioFailed";
	this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_RATIO_OK = "getAnalogueVideoAspectRatioOK";
	this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_RATIO_FAILED = "getAnalogueVideoAspectRatioFailed";
	this._EVENT_SET_HDMI_AUDIO_TYPE_OK = "setHdmiAudioTypeOK"; // otv:deprecated="5.1.2"
	this._EVENT_SET_HDMI_AUDIO_TYPE_FAILED = "setHdmiAudioTypeFailed"; // otv:deprecated="5.1.2"
	this._EVENT_GET_HDMI_AUDIO_TYPE_OK = "getHdmiAudioTypeOK";
	this._EVENT_GET_HDMI_AUDIO_TYPE_FAILED = "getHdmiAudioTypeFailed";
	this._EVENT_SET_HDMI_AUDIO_DELAY_OK = "setHdmiAudioDelayOK";
	this._EVENT_SET_HDMI_AUDIO_DELAY_FAILED = "setHdmiAudioDelayFailed";
	this._EVENT_GET_HDMI_AUDIO_DELAY_OK = "getHdmiAudioDelayOK";
	this._EVENT_GET_HDMI_AUDIO_DELAY_FAILED = "getHdmiAudioDelayFailed";
	this._EVENT_SET_HDMI_AUTO_LIPSYNC_MODE_OK = "setHdmiAutoLipsyncModeOK";
	this._EVENT_SET_HDMI_AUTO_LIPSYNC_MODE_FAILED = "setHdmiAutoLipsyncModeFailed";
	this._EVENT_GET_HDMI_AUTO_LIPSYNC_MODE_OK = "getHdmiAutoLipsyncModeOK";
	this._EVENT_GET_HDMI_AUTO_LIPSYNC_MODE_FAILED = "getHdmiAutoLipsyncModeFailed";
	this._EVENT_APPLY_CONFIG_SETTINGS_OK = "applyConfigSettingsOK";
	this._EVENT_APPLY_CONFIG_SETTINGS_FAILED = "applyConfigSettingsFailed";
	this._EVENT_SEND_HDMI_CEC_COMMAND_OK = "sendHdmiCecCommandOK";
	this._EVENT_SEND_HDMI_CEC_COMMAND_FAILED = "sendHdmiCecCommandFailed";
	this._EVENT_GET_HDMI_CEC_CONNECTED_DEVICES_OK = "getHdmiCecConnectedDevicesOK";
	this._EVENT_GET_HDMI_CEC_CONNECTED_DEVICES_FAILED = "getHdmiCecConnectedDevicesFailed";
	this._EVENT_SET_3D_MODE_OK = "set3dModeOK";
	this._EVENT_SET_3D_MODE_FAILED = "set3dModeFailed";
	this._EVENT_GET_3D_MODE_OK = "get3dModeOK";
	this._EVENT_GET_3D_MODE_FAILED = "get3dModeFailed";
	this._EVENT_SET_HDMI_3D_FORMAT_OK = "setHdmi3dFormatOK";
	this._EVENT_SET_HDMI_3D_FORMAT_FAILED = "setHdmi3dFormatFailed";
	this._EVENT_GET_HDMI_3D_FORMAT_OK = "getHdmi3dFormatOK";
	this._EVENT_GET_HDMI_3D_FORMAT_FAILED = "getHdmi3dFormatFailed";
	this._EVENT_SET_HDMI_VIDEO_SETTINGS_OK = "setHdmiVideoSettingsOK";
	this._EVENT_SET_HDMI_VIDEO_SETTINGS_FAILED = "setHdmiVideoSettingsFailed";
	this._EVENT_GET_HDMI_VIDEO_SETTINGS_OK = "getHdmiVideoSettingsOK";
	this._EVENT_GET_HDMI_VIDEO_SETTINGS_FAILED = "getHdmiVideoSettingsFailed";
	this._EVENT_SET_HDMI_VIDEO_ASPECT_MODE_OK = "setHdmiVideoAspectModeOK";
	this._EVENT_SET_HDMI_VIDEO_ASPECT_MODE_FAILED = "setHdmiVideoAspectModeFailed";
	this._EVENT_GET_HDMI_VIDEO_ASPECT_MODE_OK = "getHdmiVideoAspectModeOK";
	this._EVENT_GET_HDMI_VIDEO_ASPECT_MODE_FAILED = "getHdmiVideoAspectModeFailed";
	this._EVENT_GET_STRING_BY_ID_OK = "getStringByIdOK";
	this._EVENT_GET_STRING_BY_ID_FAILED = "getStringByIdFailed";
	this._EVENT_GET_VALUE_BY_ID_OK = "getValueByIdOK";
	this._EVENT_GET_VALUE_BY_ID_FAILED = "getValueByIdFailed";
	this._EVENT_GET_LED_CONFIG_OK = "getLedConfigOK";
	this._EVENT_GET_LED_CONFIG_FAILED = "getLedConfigFailed";
	this._EVENT_SET_LED_CONFIG_OK = "setLedConfigOK";
	this._EVENT_SET_LED_CONFIG_FAILED = "setLedConfigFailed";
	this._EVENT_GET_MOCA_INSTANCES_OK = "getMocaInstancesOK";
	this._EVENT_GET_MOCA_INSTANCES_FAILED = "getMocaInstancesFailed";
	this._EVENT_GET_MOCA_INFO_OK = "getMocaInfoOK";
	this._EVENT_GET_MOCA_INFO_FAILED = "getMocaInfoFailed";
	this._EVENT_RESET_MOCA_OK = "resetMocaOK";
	this._EVENT_RESET_MOCA_FAILED = "resetMocaFailed";
	this._EVENT_INFO_READ_OK = "infoReadOK";
	this._EVENT_INFO_READ_FAILED = "infoReadFailed";
	this._EVENT_READ_DUID_OK = "readDuidOK";
	this._EVENT_READ_DUID_FAILED = "readDuidFailed";
	this._EVENT_STANDBY_MODE_SET_OK = "standbyModeSetOK";
	this._EVENT_STANDBY_MODE_SET_FAILED = "standbyModeSetFailed";
	this._EVENT_STB_MODE_CAPS_GET_OK = "stbModeCapsGetOK";
	this._EVENT_STB_MODE_CAPS_GET_FAILED = "stbModeCapsGetFailed";
	this._EVENT_STANDBY_MODE_GET_OK = "standbyModeGetOK";
	this._EVENT_STANDBY_MODE_GET_FAILED = "standbyModeGetFailed";
	this._EVENT_PDATA_START_OK = "pdataStartOK";
	this._EVENT_PDATA_START_FAILED = "pdataStartFailed";
	this._EVENT_PDATA_WRITE_OK = "pdataWriteOK";
	this._EVENT_PDATA_WRITE_FAILED = "pdataWriteFailed";
	this._EVENT_PDATA_STOP_OK = "pdataStopOK";
	this._EVENT_PDATA_STOP_FAILED = "pdataStopFailed";
	this._EVENT_PDATA_GET_BLOCK_SIZE_OK = "pdataGetBlockSizeOK";
	this._EVENT_PDATA_GET_BLOCK_SIZE_FAILED = "pdataGetBlockSizeFailed";
	this._EVENT_WAKE_REASON_GET_OK = "wakeReasonGetOK";
	this._EVENT_WAKE_REASON_GET_FAILED = "wakeReasonGetFailed";
	this._EVENT_SET_BOOT_DATA_OK = "setBootDataOK";
	this._EVENT_SET_BOOT_DATA_FAILED = "setBootDataFailed";
	this._EVENT_PARSE_DOWNLOAD_DATA_OK = "parseDownloadDataOK";
	this._EVENT_PARSE_DOWNLOAD_DATA_FAILED = "parseDownloadDataFailed";
	this._EVENT_BLANK_ANALOGUE_OK = "blankAnalogueOK";
	this._EVENT_BLANK_ANALOGUE_FAILED = "blankAnalogueFailed";
	this._EVENT_DUAL_MONO_CONTROL_OK = "dualMonoControlOK";
	this._EVENT_DUAL_MONO_CONTROL_FAILED = "dualMonoControlFailed";
	this._EVENT_CEC_SEND_CMD_OK = "cecSendCmdOK";
	this._EVENT_CEC_SEND_CMD_FAILED = "cecSendCmdFailed";
	this._EVENT_GET_DOLBY_CAPABILITIES_OK = "getDolbyCapabilitiesOK";
	this._EVENT_GET_DOLBY_CAPABILITIES_FAILED = "getDolbyCapabilitiesFailed";
	this._EVENT_GET_DOLBY_EFFECT_STATE_OK = "getDolbyEffectStateOK";
	this._EVENT_GET_DOLBY_EFFECT_STATE_FAILED = "getDolbyEffectStateFailed";
	this._EVENT_SET_DOLBY_EFFECT_STATE_OK = "setDolbyEffectStateOK";
	this._EVENT_SET_DOLBY_EFFECT_STATE_FAILED = "setDolbyEffectStateFailed";
	this._EVENT_GET_DOLBY_FIXED_PROFILE_OK = "getDolbyFixedProfileOK";
	this._EVENT_GET_DOLBY_FIXED_PROFILE_FAILED = "getDolbyFixedProfileFailed";
	this._EVENT_SET_DOLBY_FIXED_PROFILE_OK = "setDolbyFixedProfileOK";
	this._EVENT_SET_DOLBY_FIXED_PROFILE_FAILED = "setDolbyFixedProfileFailed";
	// _EVENT_CEC_MSG_SEND_USER_CONTROL_RELEASED_OK = "cecMsgSendUserControlReleasedOK",
	// _EVENT_CEC_MSG_SEND_USER_CONTROL_RELEASED_FAILED = "cecMsgSendUserControlReleasedFailed",

	this._supportedEvents = [
		this._EVENT_ON_3D_MODE,
		this._EVENT_ON_HDMI_CEC,
		this._EVENT_ON_HDMI,
		this._EVENT_ON_SYSTEM_STANDBY,
		this._EVENT_ON_SYSTEM_WAKE,
		this._EVENT_ON_HDMI_CEC_MGR_EVENT,
		this._EVENT_REBOOT_OK, // otv:deprecated="5.1.3"
		this._EVENT_REBOOT_FAILED, // otv:deprecated="5.1.3"
		this._EVENT_RESET_OK, // otv:deprecated="5.1.3"
		this._EVENT_RESET_FAILED, // otv:deprecated="5.1.3"
		this._EVENT_SET_STANDBY_OK, // otv:deprecated="5.1.3"
		this._EVENT_SET_STANDBY_FAILED, // otv:deprecated="5.1.3"
		this._EVENT_GET_STANDBY_OK, // otv:deprecated="5.1.3"
		this._EVENT_GET_STANDBY_FAILED, // otv:deprecated="5.1.3"
		this._EVENT_SET_SOFTWARE_UPGRADE_DATA_OK, // otv:deprecated="5.1.3"
		this._EVENT_SET_SOFTWARE_UPGRADE_DATA_FAILED, // otv:deprecated="5.1.3"
		this._EVENT_SET_FRONT_PANEL_CONTROL_OK,
		this._EVENT_SET_FRONT_PANEL_CONTROL_FAILED,
		this._EVENT_SET_FRONT_PANEL_STRING_OK,
		this._EVENT_SET_FRONT_PANEL_STRING_FAILED,
		this._EVENT_SET_FRONT_PANEL_BLINK_PERIOD_OK,
		this._EVENT_SET_FRONT_PANEL_BLINK_PERIOD_FAILED,
		this._EVENT_SET_FRONT_PANEL_FADE_PERIOD_OK,
		this._EVENT_SET_FRONT_PANEL_FADE_PERIOD_FAILED,
		this._EVENT_SET_FRONT_PANEL_INTENSITY_LEVEL_OK,
		this._EVENT_SET_FRONT_PANEL_INTENSITY_LEVEL_FAILED,
		this._EVENT_SET_LED_SPIN_STATE_OK,
		this._EVENT_SET_LED_SPIN_STATE_FAILED,
		this._EVENT_SET_LED_STATE_OK,
		this._EVENT_SET_LED_STATE_FAILED,
		this._EVENT_GET_LED_STATE_OK,
		this._EVENT_GET_LED_STATE_FAILED,
		this._EVENT_SET_VCR_SCART_RECORD_OK,
		this._EVENT_SET_VCR_SCART_RECORD_FAILED,
		this._EVENT_SET_SCART_VIDEO_FORMAT_OK,
		this._EVENT_SET_SCART_VIDEO_FORMAT_FAILED,
		this._EVENT_GET_SCART_VIDEO_FORMAT_OK,
		this._EVENT_GET_SCART_VIDEO_FORMAT_FAILED,
		this._EVENT_SET_ANALOGUE_CCI_OK,
		this._EVENT_SET_ANALOGUE_CCI_FAILED,
		this._EVENT_GET_ANALOGUE_CCI_OK,
		this._EVENT_GET_ANALOGUE_CCI_FAILED,
		this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_MODE_OK,
		this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_MODE_FAILED,
		this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_MODE_OK,
		this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_MODE_FAILED,
		this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_RATIO_OK,
		this._EVENT_SET_ANALOGUE_VIDEO_ASPECT_RATIO_FAILED,
		this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_RATIO_OK,
		this._EVENT_GET_ANALOGUE_VIDEO_ASPECT_RATIO_FAILED,
		this._EVENT_SET_HDMI_AUDIO_TYPE_OK, // otv:deprecated="5.1.2"
		this._EVENT_SET_HDMI_AUDIO_TYPE_FAILED, // otv:deprecated="5.1.2"
		this._EVENT_GET_HDMI_AUDIO_TYPE_OK,
		this._EVENT_GET_HDMI_AUDIO_TYPE_FAILED,
		this._EVENT_SET_HDMI_AUDIO_DELAY_OK,
		this._EVENT_SET_HDMI_AUDIO_DELAY_FAILED,
		this._EVENT_GET_HDMI_AUDIO_DELAY_OK,
		this._EVENT_GET_HDMI_AUDIO_DELAY_FAILED,
		this._EVENT_SET_HDMI_AUTO_LIPSYNC_MODE_OK,
		this._EVENT_SET_HDMI_AUTO_LIPSYNC_MODE_FAILED,
		this._EVENT_GET_HDMI_AUTO_LIPSYNC_MODE_OK,
		this._EVENT_GET_HDMI_AUTO_LIPSYNC_MODE_FAILED,
		this._EVENT_APPLY_CONFIG_SETTINGS_OK,
		this._EVENT_APPLY_CONFIG_SETTINGS_FAILED,
		this._EVENT_SEND_HDMI_CEC_COMMAND_OK,
		this._EVENT_SEND_HDMI_CEC_COMMAND_FAILED,
		this._EVENT_GET_HDMI_CEC_CONNECTED_DEVICES_OK,
		this._EVENT_GET_HDMI_CEC_CONNECTED_DEVICES_FAILED, 
		this._EVENT_SET_3D_MODE_OK,
		this._EVENT_SET_3D_MODE_FAILED,
		this._EVENT_GET_3D_MODE_OK,
		this._EVENT_GET_3D_MODE_FAILED,
		this._EVENT_SET_HDMI_3D_FORMAT_OK,
		this._EVENT_SET_HDMI_3D_FORMAT_FAILED,
		this._EVENT_GET_HDMI_3D_FORMAT_OK,
		this._EVENT_GET_HDMI_3D_FORMAT_FAILED,
		this._EVENT_SET_HDMI_VIDEO_SETTINGS_OK,
		this._EVENT_SET_HDMI_VIDEO_SETTINGS_FAILED,
		this._EVENT_GET_HDMI_VIDEO_SETTINGS_OK,
		this._EVENT_GET_HDMI_VIDEO_SETTINGS_FAILED,
		this._EVENT_SET_HDMI_VIDEO_ASPECT_MODE_OK,
		this._EVENT_SET_HDMI_VIDEO_ASPECT_MODE_FAILED,
		this._EVENT_GET_HDMI_VIDEO_ASPECT_MODE_OK,
		this._EVENT_GET_HDMI_VIDEO_ASPECT_MODE_FAILED,
		this._EVENT_GET_STRING_BY_ID_OK,
		this._EVENT_GET_STRING_BY_ID_FAILED,
		this._EVENT_GET_VALUE_BY_ID_OK,
		this._EVENT_GET_VALUE_BY_ID_FAILED,
		this._EVENT_GET_LED_CONFIG_OK,
		this._EVENT_GET_LED_CONFIG_FAILED,
		this._EVENT_SET_LED_CONFIG_OK,
		this._EVENT_SET_LED_CONFIG_FAILED,
		this._EVENT_GET_MOCA_INSTANCES_OK,
		this._EVENT_GET_MOCA_INSTANCES_FAILED,
		this._EVENT_GET_MOCA_INFO_OK,
		this._EVENT_GET_MOCA_INFO_FAILED,
		this._EVENT_RESET_MOCA_OK,
		this._EVENT_RESET_MOCA_FAILED,
		this._EVENT_INFO_READ_OK,
		this._EVENT_INFO_READ_FAILED,
		this._EVENT_READ_DUID_OK,
		this._EVENT_READ_DUID_FAILED,
		this._EVENT_STANDBY_MODE_SET_OK, ,
		this._EVENT_STANDBY_MODE_SET_FAILED,
		this._EVENT_STB_MODE_CAPS_GET_OK,
		this._EVENT_STB_MODE_CAPS_GET_FAILED,
		this._EVENT_STANDBY_MODE_GET_OK,
		this._EVENT_STANDBY_MODE_GET_FAILED,
		this._EVENT_PDATA_START_OK,
		this._EVENT_PDATA_START_FAILED,
		this._EVENT_PDATA_WRITE_OK,
		this._EVENT_PDATA_WRITE_FAILED,
		this._EVENT_PDATA_STOP_OK,
		this._EVENT_PDATA_STOP_FAILED,
		this._EVENT_PDATA_GET_BLOCK_SIZE_OK,
		this._EVENT_PDATA_GET_BLOCK_SIZE_FAILED,
		this._EVENT_WAKE_REASON_GET_OK,
		this._EVENT_WAKE_REASON_GET_FAILED,
		this._EVENT_SET_BOOT_DATA_OK,
		this._EVENT_SET_BOOT_DATA_FAILED,
		this._EVENT_PARSE_DOWNLOAD_DATA_OK,
		this._EVENT_PARSE_DOWNLOAD_DATA_FAILED,
		this._EVENT_BLANK_ANALOGUE_OK,
		this._EVENT_BLANK_ANALOGUE_FAILED,
		this._EVENT_DUAL_MONO_CONTROL_OK,
		this._EVENT_DUAL_MONO_CONTROL_FAILED,
		this._EVENT_CEC_SEND_CMD_OK,
		this._EVENT_CEC_SEND_CMD_FAILED,
		this._EVENT_GET_DOLBY_CAPABILITIES_OK,
		this._EVENT_GET_DOLBY_CAPABILITIES_FAILED,
		this._EVENT_GET_DOLBY_EFFECT_STATE_OK,
		this._EVENT_GET_DOLBY_EFFECT_STATE_FAILED, 
		this._EVENT_SET_DOLBY_EFFECT_STATE_OK,
		this._EVENT_SET_DOLBY_EFFECT_STATE_FAILED,
		this._EVENT_GET_DOLBY_FIXED_PROFILE_OK,
		this._EVENT_GET_DOLBY_FIXED_PROFILE_FAILED,
		this._EVENT_SET_DOLBY_FIXED_PROFILE_OK,
		this._EVENT_SET_DOLBY_FIXED_PROFILE_FAILED
	];

	/*
	 * The object exists since the beginning (v5.0.0)
	 */

	// analogue_cci
	this.ANALOGUE_CCI_COPY_FREELY = 0;
	this.ANALOGUE_CCI_COPY_NO_MORE = 1;
	this.ANALOGUE_CCI_COPY_ONCE = 2;
	this.ANALOGUE_CCI_COPY_NEVER = 3;
	// analogue_video_aspect_mode
	this.ANALOGUE_VIDEO_ASPECT_MODE_LETTER_BOX = 0;
	this.ANALOGUE_VIDEO_ASPECT_MODE_PAN_SCAN = 1;
	this.ANALOGUE_VIDEO_ASPECT_MODE_CENTER_CUT = 2;
	this.ANALOGUE_VIDEO_ASPECT_MODE_STRETCH = 3;
	// analogue_video_aspect_ratio
	this.ANALOGUE_VIDEO_ASPECT_RATIO_4_3 = 0;
	this.ANALOGUE_VIDEO_ASPECT_RATIO_16_9 = 1;
	//TemperatureLevel
	this.UNKNOWN 	= 0;
	this.NORMAL  	= 1;
	this.HOT     	= 2;
	this.CRITICAL = 3;
	// front_panel_capabilities
	this.FPCHAR_CAPABILITY_BLINK = 1;
	this.FPCHAR_CAPABILITY_FADE = 2;
	this.FPCHAR_CAPABILITY_7SEG = 4;
	this.FPCHAR_CAPABILITY_ASCII = 8;
	this.FPCHAR_CAPABILITY_UTF8 = 16;
	// hdmi_3d_format
	this.HDMI_3D_FORMAT_FRAME_PACKING = 1;
	this.HDMI_3D_FORMAT_TOP_AND_BOTTOM = 64;
	this.HDMI_3D_FORMAT_SIDE_BY_SIDE_HALF = 128;
	this.HDMI_3D_FORMAT_FIELD_ALTERNATIVE = 2;
	this.HDMI_3D_FORMAT_LINE_ALTERNATIVE = 4;
	this.HDMI_3D_FORMAT_SIDE_BY_SIDE_FULL = 8;
	this.HDMI_3D_FORMAT_L_DEPTH = 16;
	this.HDMI_3D_FORMAT_L_DGGD = 32;
	// HDMI_3D_FORMAT_TOP_AND_BOTTOM= 64;
	// HDMI_3D_FORMAT_SIDE_BY_SIDE_HALF= 128;
	// hdmi_audio_type
	this.HDMI_AUDIO_TYPE_PCM = 1;
	this.HDMI_AUDIO_TYPE_AC3 = 2;
	this.HDMI_AUDIO_TYPE_DDPLUS = 4;
	// hdmi_event
	this.HDMI_EVENT_SINK_CONNECTED = 0;
	this.HDMI_EVENT_SINK_DISCONNECTED = 1;
	this.HDMI_EVENT_SINK_AUTHENTICATION_FAILED = 2;
	this.HDMI_EVENT_SINK_AUTHENTICATED = 3;
	this.HDMI_EVENT_SINK_REVOKED = 4;
	this.HDMI_EVENT_TOPOLOGY_CHANGED = 5;
	// hdmi_video_aspect_mode
	this.HDMI_VIDEO_ASPECT_MODE_PILLAR_BOX = 0;
	this.HDMI_VIDEO_ASPECT_MODE_STRETCH = 1;
	// hdmi_video_color_type
	this.HDMI_VIDEO_COLOR_TYPE_RGB = 1;
	this.HDMI_VIDEO_COLOR_TYPE_YCC_422 = 2;
	this.HDMI_VIDEO_COLOR_TYPE_YCC_444 = 4;
	// hdmi_video_format
	this.HDMI_VIDEO_FORMAT_480I = 1;
	this.HDMI_VIDEO_FORMAT_480P = 2;
	this.HDMI_VIDEO_FORMAT_576I = 4;
	this.HDMI_VIDEO_FORMAT_576P = 8;
	this.HDMI_VIDEO_FORMAT_720P = 16;
	this.HDMI_VIDEO_FORMAT_1080I = 32;
	this.HDMI_VIDEO_FORMAT_1080P = 64;
	this.HDMI_VIDEO_FORMAT_2160P = 128;
	this.HDMI_VIDEO_FORMAT_4320P = 256;
	// led_capabilities
	this.LED_CAPABILITY_BLINK = 1;
	this.LED_CAPABILITY_SPIN = 2;
	this.LED_CAPABILITY_FADE = 4;
	this.LED_CAPABILITY_BI_COLOUR = 8;
	// led_state
	this.LED_STATE_OFF = 0;
	this.LED_STATE_ON = 1;
	this.LED_STATE_BI_COLOUR_RED = 2;
	this.LED_STATE_BI_COLOUR_GREEN = 4;
	// scart_video_format
	this.SCART_VIDEO_FORMAT_CVBS = 0;
	this.SCART_VIDEO_FORMAT_RGB = 1;
	// system_standby_mode
	this.STB_STANDBY_OFF = 0;
	this.STB_STANDBY_ON = 1;
	this.STB_STANDBY_SUSPEND = 2;
	// system_wake_reason
	this.STB_WAKE_REASON_BOOTUP = 0;
	this.STB_WAKE_REASON_KEYPRESS = 1;
	this.STB_WAKE_REASON_SCHEDULED = 2;
	// 3D Mode
	this.STEREOSCOPIC_3D_MODE_OFF = 0;
	this.STEREOSCOPIC_3D_MODE_ON = 1;
	// hdmi_state
	this.HDMI_STATE_DISCONNECTED = 0;
	this.HDMI_STATE_CONNECTED = 1;
	// hdcp_state
	this.HDCP_STATE_NOT_AUTHENTICATED = 0;
	this.HDCP_STATE_AUTHENTICATED = 1;
	// config_setting_modules

	this.AUD_OUTPUT = 1;
	// system_info_type
	// PI_STB_INFO_TYPE_STRING: 0,
	// PI_STB_INFO_TYPE_VALUE: 1,
	// PI_STB_INFO_TYPE_DATA: 2,
	// HdmiLogicalAddr
	this.HDMI_LOGICAL_ADDR_TV = 0;
	this.HDMI_LOGICAL_ADDR_RECORD_1 = 1;
	this.HDMI_LOGICAL_ADDR_RECORD_2 = 2;
	this.HDMI_LOGICAL_ADDR_TUNER_1 = 3;
	this.HDMI_LOGICAL_ADDR_PLAYBACK_1 = 4;
	this.HDMI_LOGICAL_ADDR_AUDIO_SYS = 5;
	this.HDMI_LOGICAL_ADDR_TUNER_2 = 6;
	this.HDMI_LOGICAL_ADDR_TUNER_3 = 7;
	this.HDMI_LOGICAL_ADDR_PLAYBACK_2 = 8;
	this.HDMI_LOGICAL_ADDR_RECORD_3 = 9;
	this.HDMI_LOGICAL_ADDR_TUNER_4 = 10;
	this.HDMI_LOGICAL_ADDR_PLAYBACK_3 = 11;
	this.HDMI_LOGICAL_ADDR_RESERVED_1 = 12;
	this.HDMI_LOGICAL_ADDR_RESERVED_2 = 13;
	this.HDMI_LOGICAL_ADDR_SPECIFIC_USE = 14;
	this.HDMI_LOGICAL_ADDR_UNREG_BCAST = 15;
	// CeckeyCodes
	this.CEC_KEY_SELECT = 0;
	this.CEC_KEY_UP = 1;
	this.CEC_KEY_DOWN = 2;
	this.CEC_KEY_LEFT = 3;
	this.CEC_KEY_RIGHT = 4;
	this.CEC_KEY_CHANNEL_UP = 48;
	this.CEC_KEY_CHANNEL_DOWN = 49;
	this.CEC_KEY_PREVIOUS_CHANNEL = 50;
	this.CEC_KEY_POWER = 64;
	this.CEC_KEY_VOLUME_UP = 65;
	this.CEC_KEY_VOLUME_DOWN = 66;
	this.CEC_KEY_MUTE = 67;
	this.CEC_KEY_POWER_TOGGLE = 107;
	this.CEC_KEY_POWER_OFF = 108;
	this.CEC_KEY_POWER_ON = 109;
	// CecCommandCode
	this.CEC_ENTER_STANDBY = 0;
	this.CEC_EXIT_STANDBY = 1;
	this.CEC_GET_POWER_STATUS = 2;
	this.CEC_GET_VERSION = 3;
	this.CEC_SET_DEVICE_FRIENDLY_NAME = 4;
	this.CEC_KEY_PRESSED = 5;
	this.CEC_KEY_RELEASED = 6;
	this.CEC_IMAGE_DISPLAY = 7;
	this.CEC_ACTIVE_SOURCE = 8;

	/*
	 * //HdmiCecMsg this.CEC_MSG_FEATURE_ABORT= 0; this.CEC_MSG_REPORT_POWER_STATUS= 1; this.CEC_MSG_CEC_VERSION= 2; //HdmiCecAbortApi
	 * this.CEC_ABORT_UNRECOGNIZED_OPCODE= 0; this.CEC_ABORT_NOT_IN_CORRECT_MODE= 1; this.CEC_ABORT_CANNOT_PROVIDE_SOURCE= 2;
	 * this.CEC_ABORT_INVALID_OPERAND= 3; this.CEC_ABORT_REFUSED= 4; this.CEC_ABORT_UNABLE_TO_DETERMINE= 5;
	 */
	// CecVersion
	this.CEC_VERSION_1_4 = 0;
	this.CEC_VERSION_2_0 = 1;
	// CecPowerStatus
	this.CEC_POWER_STATUS_ON = 0;
	this.CEC_POWER_STATUS_STANDBY = 1;
	this.CEC_POWER_STATUS_TRANSITION_TO_ON = 2;
	this.CEC_POWER_STATUS_TRANSITION_TO_STANDBY = 3;
	// dolby_profiles
	this.DOLBY_PROFILE_OFF = 0;
	this.DOLBY_PROFILE_AUTO_PILOT = 1;
	this.DOLBY_PROFILE_MOVIE = 2;
	this.DOLBY_PROFILE_GAME = 3;
	this.DOLBY_PROFILE_NEWS = 4;
	this.DOLBY_PROFILE_NIGHT_MODE = 5;
	this.DOLBY_PROFILE_VOIP = 6;
	// DolbyEffect
	this.DOLBY_EFFECT_VOLUME_LEVELING = 0;
	this.DOLBY_EFFECT_DIALOGUE_ENHANCER = 1;
	//MocaVersion
	this.STD_1_1 = 0;
	this.STD_2_0 = 1;
	//MocaLinkStatus
	this.LINK_DOWN = 0;
	this.LINK_UP   = 1;
	//MocaLinkPrivacy
	this.DISABLE = 0;
	this.ENABLE  = 1;
	
	// properties
	Object.defineProperty(this, 'hdmi3dFormat', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.hdmi3dFormat : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'hdmiAudioType', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.hdmiAudioType : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'hdmiVideoColor', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.hdmiVideoColor : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'hdmiVideoFormat', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.hdmiVideoFormat : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'ledAttribute', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.ledAttribute : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'ledNumber', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.ledNumber : null ;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'muteAudio', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.muteAudio : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'scartNumber', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.scartNumber : null ;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'volume', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.volume : null ;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'bootloaderVersion', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.bootloaderVersion : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'firmwareVersion', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.firmwareVersion : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'frontPanelAttribute', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.frontPanelAttribute : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'hardwareVersion', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.hardwareVersion : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'manufacturer', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.manufacturer : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'softwareVersion', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system.softwareVersion : null ;
		},
		enumerable: true
	});

	Object.defineProperty(this, '_moca_id', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system._moca_id : null;
		},
		enumerable: true
	});

	Object.defineProperty(this, '_moca_info', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.system) ? CCOM.stubs.stbData.system._moca_info : { error: 'Not Available' } ;
		},
		enumerable: true
	});

	this.addEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	this.removeEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	this.getMocaInstances = function()
	{
		return 1;
	};
	this.getMocaInfo = function(mocaId)
	{
		if (mocaId === this._moca_id)
		{
			return this._moca_info;
		}
		else
		{
			return {
				error : "error"
			};
		}

	};
	this.getMocaDiagnostics = function(mocaId){
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.System",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.resetMoca = function(mocaId)
	{
		return {
			error : "error"
		};
	};
	this.reboot = function()
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REBOOT_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.System",
				message : "Warning:This API is deprecated. "
			}
		});
		return hdl;
	};
	this.reset = function()
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_RESET_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.System",
				message : "Warning:This API is deprecated. "
			}
		});
		return hdl;
	};
	this.setStandby = function(standby)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_STANDBY_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.System",
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	this.getStandby = function(standby)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_STANDBY_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.System",
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	this.setSoftwareUpgradeData = function(upgradeData)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SET_SOFTWARE_UPGRADE_DATA_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.System",
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};
	this.getHdmiVideoSettings = function()
	{
		if (this._hdmiConnected)
		{
			return {
				videoFormat : this._videoFormat,
				videoColorEncoding : this._videoColorEncoding
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.setHdmiVideoSettings = function(res, type)
	{
		if (this._hdmiConnected)
		{
			this._videoFormat = res;
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.getHdmiVideoAspectMode = function()
	{
		if (this._hdmiConnected)
		{
			return {
				aspectMode : this._aspectMode
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.setHdmiVideoAspectMode = function(mode)
	{
		if (this._hdmiConnected)
		{
			this._aspectMode = mode;
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.getHdmiAudioDelay = function()
	{
		if (this._hdmiConnected)
		{
			return {
				delayMs : this._audioDelay
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.setHdmiAudioDelay = function(delay)
	{
		if (this._hdmiConnected)
		{
			this._audioDelay = delay;
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	// otv:deprecated="5.1.2"
	this.setHdmiAudioType = function(audioType)
	{
		var hdl = CCOM.stubs.getHandle();

		if (this._hdmiConnected)
		{

			this._audioType = audioType;
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
		this.logDeprecated();
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_CONNECTION_INFO_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.System",
				message : "Warning:This API is deprecated. "

			}
		});
		return hdl;
	};

	this.setHdmiAutoLipsyncMode = function(autoOrManual)
	{
		if (this._hdmiConnected)
		{
			this._autoLipsyncMode = autoOrManual;
			return {};
		}
		else
		{

			return {
				error : "error"
			};
		}
	};

	this.getHdmiAutoLipsyncMode = function()
	{
		if (this._hdmiConnected)
		{
			return {
				autoLipsyncMode : this._autoLipsyncMode
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.getHdmiAudioType = function()
	{
		if (this._hdmiConnected)
		{
			return {
				audioType : this._audioType
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.getHdmi3dFormat = function()
	{
		if (this._hdmiConnected)
		{
			return {
				format : this._3DFormat
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.setHdmi3dFormat = function(format)
	{
		if (this._hdmiConnected)
		{
			this._3DFormat = format;
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.getAnalogueVideoSettings = function()
	{
		if (this._analogueConnected)
		{
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.getAnalogueVideoAspectMode = function()
	{
		if (this._analogueConnected)
		{
			return {
				aspectMode : this._analogueAspectMode
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.setAnalogueVideoAspectMode = function(mode)
	{
		if (this._analogueConnected)
		{
			this._analogueAspectMode = mode;
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.getAnalogueVideoAspectRatio = function()
	{
		if (this._analogueConnected)
		{
			return {
				aspectRatio : this._aspectRatio
			};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.setAnalogueVideoAspectRatio = function(ratio)
	{
		if (this._analogueConnected)
		{
			this._aspectRatio = ratio;
			return {};
		}
		else
		{
			return {
				error : "error"
			};
		}
	};
	this.frontPanelControl = function(on)
	{
	};
	this.getAnalogueCCI = function()
	{
		return {
			error : "error"
		};
	};
	this.getLedState = function(ledName)
	{
		// 0 means off
		return 0;
	};
	this.getScartVideoFormat = function()
	{
		return this.SCART_VIDEO_FORMAT_CVBS;
	};
	this.getStringById = function(id)
	{
		return {
			error : "error"
		};
	};
	this.getValueById = function(id)
	{
		return {
			error : "error"
		};
	};
	this.setAnalogueCCI = function(cgi)
	{
	};
	this.setFrontPanelString = function(string)
	{
	};
	this.setLedSpinState = function(spinPeriodMs)
	{
	};
	this.setLedState = function(ledName, state)
	{
	};
	this.setScartVideoFormat = function(format)
	{
	};
	this.setVcrScartRecord = function(record)
	{
	};
	this.getLedConfig = function(ledName)
	{
		return {
			error : "error"
		};
	};
	this.setLedConfig = function(ledName, blinkPeriodMs, fadePeriodMs)
	{
	};
	this.set3dMode = function()
	{
	};

	this.setFrontPanelBlinkPeriod = function(blinkPeriodMs)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.setFrontPanelFadePeriod = function(fadePeriodMs)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.setFrontPanelIntensityLevel = function(level)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.applyConfigSettings = function(modules)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.set3dMode = function(mode)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.get3dMode = function()
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.getHdmiCecConnectedDevices = function()
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.sendHdmiCecCommand = function(logicAddress, command, parameters, dataLen)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};

	this.cecSendCmd = function(cmd, address)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.getDolbyCapabilities = function()
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};

	this.getDolbyEffectState = function(effect)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.setDolbyEffectState = function(effect, enable)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.getDolbyFixedProfile = function()
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.setDolbyFixedProfile = function(profile)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.System",
				name : "OperationFailed",
				message : "error"
			}
		};
	};
	this.getTemperatureLevel = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.System",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

})();
