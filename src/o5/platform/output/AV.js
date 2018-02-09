/**
 * Singleton instance instantiated in the top level window that contains methods
 * for getting and setting the video and audio output settings.
 *
 * @class o5.platform.output.AV
 * @singleton
 * @author lmayle
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.output.AV = new (function AV () {
    this._supportedAudioType = [];

    this.CONFIG_PREFERRED_AUDIO_HDMI = "/system/devices/audmgr/hdmiFormat";

})();

/**
 * Initializes the AV singleton must be called prior to any
 * other methods in this class
 * @method init
 */
o5.platform.output.AV.init = function init () {
    // cache hdmi state enum values
    this._hdmiState = {
        HDMI_STATE_DISCONNECTED: CCOM.System.HDMI_STATE_DISCONNECTED,
        HDMI_STATE_CONNECTED: CCOM.System.HDMI_STATE_CONNECTED
    };

    o5.platform.output.AV.getHDMIAudioType();
};

/**
 * @method initialise
 * @deprecated use init()
 */
o5.platform.output.AV.initialise = function initialise () {
    this.logDeprecated();

    this.init();
};

/**
 * Returns true if an HD output such as HDMI is available and
 * connected to a display device such as a TV, false otherwise
 * @method isHDOutputAvailable
 * @return {Boolean} Returns true if HDMI is available, otherwise false.
 */
o5.platform.output.AV.isHDOutputAvailable = function isHDOutputAvailable () {
    if (CCOM.System.hdmiState === this._hdmiState.HDMI_STATE_CONNECTED) {
        return true;
    }
    return false;
};

/**
 * Returns true if an SD/Analog output such as SCART is available, false otherwise
 * @method isAnalogueOutputAvailable
 * @removed
 */

/**
 * Returns true if an SD/Analog output such as SCART is available, false otherwise
 * @method isAnalogOutputAvailable
 * @return {Boolean} Returns true if SD/Analog output is available, otherwise false.
 */
o5.platform.output.AV.isAnalogOutputAvailable = function isAnalogOutputAvailable () {
    var videoAspectRatio = CCOM.System.getAnalogueVideoAspectRatio();
    if (videoAspectRatio.error) {
        return false;
    }
    return true;
};

/**
 * Returns the current resolution that the HD output is running at.
 * @method getResolution
 * @return {Number} one of the o5.platform.output.AV.VideoResolution constants:
 *   HDMI_VIDEO_FORMAT_480I,
 *   HDMI_VIDEO_FORMAT_480P,
 *   HDMI_VIDEO_FORMAT_576I,
 *   HDMI_VIDEO_FORMAT_576P,
 *   HDMI_VIDEO_FORMAT_720P,
 *   HDMI_VIDEO_FORMAT_1080I,
 *   HDMI_VIDEO_FORMAT_1080P,
 *   HDMI_VIDEO_FORMAT_2160P
 * or null if there is no active output
 */
o5.platform.output.AV.getResolution = function getResolution () {
    var videoSetting = CCOM.System.getHdmiVideoSettings();
    if (videoSetting.error) {
        return null;
    }
    return videoSetting.videoFormat;
};

/**
 * Sets the resolution of the HD outputs such as HDMI (note: this method has
 * no affect on other outputs).
 * @method setResolution
 * @param {Number} videoResolution one of the o5.platform.output.AV.VideoResolution constants:
 *   HDMI_VIDEO_FORMAT_480I,
 *   HDMI_VIDEO_FORMAT_480P,
 *   HDMI_VIDEO_FORMAT_576I,
 *   HDMI_VIDEO_FORMAT_576P,
 *   HDMI_VIDEO_FORMAT_720P,
 *   HDMI_VIDEO_FORMAT_1080I,
 *   HDMI_VIDEO_FORMAT_1080P,
 *   HDMI_VIDEO_FORMAT_2160P
 * @return {Boolean} true if successful, otherwise false
 */
o5.platform.output.AV.setResolution = function setResolution (videoResolution) {
    return CCOM.System.setHdmiVideoSettings(videoResolution, CCOM.System.HDMI_VIDEO_COLOR_TYPE_RGB).error ? false : true;
};

/**
 * Returns the current aspect mode of the HD outputs.
 * @method getHDVideoAspectMode
 * @return {Number} one of the o5.platform.output.AV.VideoAspectMode constants:
 *   HDMI_PILLAR_BOX,
 *   HDMI_STRETCH,
 * or null if there is no active output
 */
o5.platform.output.AV.getHDVideoAspectMode = function getHDVideoAspectMode () {
    var aspectMode = CCOM.System.getHdmiVideoAspectMode();
    if (aspectMode.error) {
        return null;
    }
    return aspectMode.aspectMode;
};

/**
 * Sets the aspect mode of the HD output so the video can
 * be stretched for example.
 * @method setHDVideoAspectMode
 * @param {Number} aspectMode one of the o5.platform.output.AV.VideoAspectMode constants:
 *   HDMI_PILLAR_BOX,
 *   HDMI_STRETCH
 * @return {Boolean} true if successful, otherwise false
 */
o5.platform.output.AV.setHDVideoAspectMode = function setHDVideoAspectMode (aspectMode) {
    return CCOM.System.setHdmiVideoAspectMode(aspectMode).error ? false : true;
};

/**
 * Returns the current aspect mode of the analog outputs.
 * @method getAnalogueVideoAspectMode
 * @return {Number} one of the o5.platform.output.AV.VideoAspectMode constants:
 *   ANALOGUE_LETTER_BOX,
 *   ANALOGUE_PAN_SCAN,
 *   ANALOGUE_CENTER_CUT,
 *   ANALOGUE_STRETCH or null if there is no active output
 */
o5.platform.output.AV.getAnalogueVideoAspectMode = function getAnalogueVideoAspectMode () {
    var aspectMode = CCOM.System.getAnalogueVideoAspectMode();
    if (aspectMode.error) {
        return null;
    }
    return aspectMode.aspectMode;
};

/**
 * Sets the aspect mode of the analog outputs so the video can
 * be stretched for example.
 * @method setAnalogueVideoAspectMode
 * @param {Number} aspectMode one of the o5.platform.output.AV.VideoAspectMode constants:
 *   ANALOGUE_LETTER_BOX,
 *   ANALOGUE_PAN_SCAN,
 *   ANALOGUE_CENTER_CUT,
 *   ANALOGUE_STRETCH
 * @return {Boolean} true if successful, otherwise false
 */
o5.platform.output.AV.setAnalogueVideoAspectMode = function setAnalogueVideoAspectMode (aspectMode) {
    return CCOM.System.setAnalogueVideoAspectMode(aspectMode).error ? false : true;
};

/**
 * DEPRECATED: Use setHDVideoAspectMode or setAnalogueVideoAspectMode
 * @method setScaleMethod
 * @removed use one of: setHDVideoAspectMode or setAnalogueVideoAspectMode
 */

/**
 * Returns the current aspect ratio of the analog outputs.
 * @method getAspectRatio
 * @return {Number} one of the o5.platform.output.AV.VideoAspectRatio constants:
 *   ASPECT_RATIO_4_3,
 *   ASPECT_RATIO_16_9
 * or null if there is no active output
 */
o5.platform.output.AV.getAspectRatio = function getAspectRatio () {
    var aspectRatio = CCOM.System.getAnalogueVideoAspectRatio();
    if (aspectRatio.error) {
        return null;
    }
    return aspectRatio.aspectRatio;
};

/**
 * Sets the aspect ratio of the analog outputs so the video can
 * be stretched for example.
 * @method setAspectRatio
 * @param {Number} aspectRatio one of the o5.platform.output.AV.VideoAspectRatio constants:
 *   ASPECT_RATIO_4_3,
 *   ASPECT_RATIO_16_9
 * @return {Boolean} true if successful, otherwise false
 */
o5.platform.output.AV.setAspectRatio = function setAspectRatio (aspectRatio) {
    return CCOM.System.setAnalogueVideoAspectRatio(aspectRatio).error ? false : true;
};

/**
 * Gets the audio delay applied to compatible outputs.
 * @method getAudioDelay
 * @return {Number} The amount of Audio Delay in milliseconds.
 */
o5.platform.output.AV.getAudioDelay = function getAudioDelay () {
    var audioDelay = CCOM.System.getHdmiAudioDelay();
    if (audioDelay.error) {
        return null;
    }
    return audioDelay.delayMs;
};

/**
 * Sets the audio delay for all compatible outputs.
 * @method setAudioDelay
 * @param {Number} delay The amount of Audio Delay in milliseconds.
 * @return {Boolean} Returns true if successful, otherwise false.
 */
o5.platform.output.AV.setAudioDelay = function setAudioDelay (delay) {
    return CCOM.System.setHdmiAudioDelay(delay).error ? false : true;
};

/**
 * Gets the audio type applied to the HDMI output.
 * @method getAudioType
 * @return {Number} One of the o5.platform.output.AV.AudioType constants:
 *   PCM,
 *   AC3
 * or null if there is no active output
 */
o5.platform.output.AV.getAudioType = function getAudioType () {
    var audioType = CCOM.System.getHdmiAudioType();
    if (audioType.error) {
        return null;
    }
    return audioType.audioType;
};

/**
 * Gets the audio type supported by the connected CEC device.
 * @method getHDMIAudioType
 */
o5.platform.output.AV.getHDMIAudioType = function getHDMIAudioType () {
    var hdmiAudioType = CCOM.System.hdmiAudioType;
    this._supportedAudioType = [];

    if (hdmiAudioType & CCOM.System.HDMI_AUDIO_TYPE_PCM)
        this._supportedAudioType.push("PCM");

    if (hdmiAudioType & CCOM.System.HDMI_AUDIO_TYPE_AC3)
        this._supportedAudioType.push("AC3");

    if (hdmiAudioType & CCOM.System.HDMI_AUDIO_TYPE_DDPLUS)
        this._supportedAudioType.push("DDPLUS");
};

/**
 * Sets the audio type of the HDMI output.
 * @method setAudioType
 * @param {Number} type One of the o5.platform.output.AV.AudioType constants:
 *   PCM,
 *   AC3
 * @return {Boolean} true if successful, otherwise false
 */
o5.platform.output.AV.setAudioType = function setAudioType (type) {
    CCOM.ConfigManager.setValue(this.CONFIG_PREFERRED_AUDIO_HDMI, Number(type));
    return true;
};

/**
 * Returns the 3D format that is active on the HDMI output
 * @method get3DFormat
 * @return {Number} one of the o5.platform.output.AV.Video3dFormat constants:
 *   FRAME_PACKING,
 *   TOP_AND_BOTTOM,
 *   SIDE_BY_SIDE
 * or null if there is no active output
 */
o5.platform.output.AV.get3DFormat = function get3DFormat () {
    var format = CCOM.System.getHdmi3dFormat();
    if (format.error) {
        return null;
    }
    return format.format;
};

/**
 * Sets the 3D format to use on the HDMI output
 * @method set3DFormat
 * @param {Number} mode one of the o5.platform.output.AV.Video3dFormat constants:
 *   FRAME_PACKING,
 *   TOP_AND_BOTTOM,
 *   SIDE_BY_SIDE
 * @return {Boolean} true if successful, otherwise false
 */
o5.platform.output.AV.set3DFormat = function set3DFormat (mode) {
    return CCOM.System.setHdmi3dFormat(mode).error ? false : true;
};

/**
 * @method VideoResolution
 * @return {Object} Returns the video resolution object for enumeration
 * with the following values:
 *
 *        HDMI_VIDEO_FORMAT_480I
 *        HDMI_VIDEO_FORMAT_480P
 *        HDMI_VIDEO_FORMAT_576I
 *        HDMI_VIDEO_FORMAT_576P
 *        HDMI_VIDEO_FORMAT_720P
 *        HDMI_VIDEO_FORMAT_1080I
 *        HDMI_VIDEO_FORMAT_1080P
 *        HDMI_VIDEO_FORMAT_2160P
 */
o5.platform.output.AV.VideoResolution = function VideoResolution () {
    return {
        HDMI_VIDEO_FORMAT_480I: CCOM.System.HDMI_VIDEO_FORMAT_480I,
        HDMI_VIDEO_FORMAT_480P: CCOM.System.HDMI_VIDEO_FORMAT_480P,
        HDMI_VIDEO_FORMAT_576I: CCOM.System.HDMI_VIDEO_FORMAT_576I,
        HDMI_VIDEO_FORMAT_576P: CCOM.System.HDMI_VIDEO_FORMAT_576P,
        HDMI_VIDEO_FORMAT_720P: CCOM.System.HDMI_VIDEO_FORMAT_720P,
        HDMI_VIDEO_FORMAT_1080I: CCOM.System.HDMI_VIDEO_FORMAT_1080I,
        HDMI_VIDEO_FORMAT_1080P: CCOM.System.HDMI_VIDEO_FORMAT_1080P,
        HDMI_VIDEO_FORMAT_2160P: CCOM.System.HDMI_VIDEO_FORMAT_2160P
    };
};

/**
 * @method VideoAspectRatio
 * @return {Object} Returns the video aspect ratio object for enumeration
 * with the following values:
 *
 *        ASPECT_RATIO_4_3
 *        ASPECT_RATIO_16_9
 */
o5.platform.output.AV.VideoAspectRatio = function VideoAspectRatio () {
    return {
        ASPECT_RATIO_4_3: CCOM.System.ANALOGUE_VIDEO_ASPECT_RATIO_4_3,
        ASPECT_RATIO_16_9: CCOM.System.ANALOGUE_VIDEO_ASPECT_RATIO_16_9
    };
};

/**
 * @method VideoAspectMode
 * @return {Object} Returns the video aspect mode object for enumeration
 * with the following values:
 *
 *        HDMI_PILLAR_BOX
 *        HDMI_STRETCH
 *        ANALOGUE_LETTER_BOX
 *        ANALOGUE_PAN_SCAN
 *        ANALOGUE_CENTER_CUT
 *        ANALOGUE_STRETCH
 */
o5.platform.output.AV.VideoAspectMode = function VideoAspectMode () {
    return {
        HDMI_PILLAR_BOX: CCOM.System.HDMI_VIDEO_ASPECT_MODE_PILLAR_BOX,
        HDMI_STRETCH: CCOM.System.HDMI_VIDEO_ASPECT_MODE_STRETCH,
        ANALOGUE_LETTER_BOX: CCOM.System.ANALOGUE_VIDEO_ASPECT_MODE_LETTER_BOX,
        ANALOGUE_PAN_SCAN: CCOM.System.ANALOGUE_VIDEO_ASPECT_MODE_PAN_SCAN,
        ANALOGUE_CENTER_CUT: CCOM.System.ANALOGUE_VIDEO_ASPECT_MODE_CENTER_CUT,
        ANALOGUE_STRETCH: CCOM.System.ANALOGUE_VIDEO_ASPECT_MODE_STRETCH
    };
};

/**
 * @method Video3dFormat
 * @return {Object} Returns the video 3D format object for enumeration
 * with the following values:
 *
 *        FRAME_PACKING
 *        TOP_AND_BOTTOM
 *        SIDE_BY_SIDE
 */
o5.platform.output.AV.Video3dFormat = function Video3dFormat () {
    return {
        FRAME_PACKING: CCOM.System.HDMI_3D_FORMAT_FRAME_PACKING,
        TOP_AND_BOTTOM: CCOM.System.HDMI_3D_FORMAT_TOP_AND_BOTTOM,
        SIDE_BY_SIDE_HALF: CCOM.System.HDMI_3D_FORMAT_SIDE_BY_SIDE_HALF
    };
};

/**
 * Checks the given audio type supported or not by connected CEC device.
 * `getHDMIAudioType` should be called prior to call this method.
 * @method audioTypeSupport
 * @param {String} audioType Audio type
 * @return {Boolean} Returns true if audio type is supported, otherwise false.
 */
o5.platform.output.AV.audioTypeSupport = function audioTypeSupport (audioType) {
    return this._supportedAudioType.indexOf(audioType) > -1;
};

/**
 * @method AudioType
 * @return {Object} Returns the audio type object for enumeration
 * with the following values:
 *
 *        PCM
 *        AC3
 *        DDPLUS
 */
o5.platform.output.AV.AudioType = function AudioType () {

    // In OTV5.1.5, Configuration values for HDMI audio do not match CCOM.System.hdmi_audio_type enum values
    // There is plan to fix in 5.2.x, for now we have to use current Configuration values
    // which match PI definitions (pasted below)

    // PI AUDIO DEFINITIONS ////////////////////////////////////////////////////////////////////////////////
    //typedef enum
    //{
    //    PI_AUDDEC_CODEC_MPEG1,          /*!< MPEG1 Layer 1 or 2                                     */
    //        PI_AUDDEC_CODEC_MPEG2,          /*!< MPEG2 Layer 1 or 2                                     */
    //        PI_AUDDEC_CODEC_AAC,            /*!< Advanced Audio Coding (LATM), typically for broadcast  */
    //        PI_AUDDEC_CODEC_MP3,            /*!< MPEG1 or MPEG2 Layer 3                                 */
    //        PI_AUDDEC_CODEC_PCM,            /*!< PCM                                                    */
    //        PI_AUDDEC_CODEC_LPCM,           /*!< Linear PCM (i.e. WAV)                                  */
    //        PI_AUDDEC_CODEC_AC3,            /*!< Dolby digital AC-3 stream                              */
    //        PI_AUDDEC_CODEC_HE_AAC,         /*!< High efficiency AAC (LATM), typically for broadcast    */
    //        PI_AUDDEC_CODEC_VORBIS,         /*!< Raw vorbis stream in OGG container                     */
    //        PI_AUDDEC_CODEC_WMA,            /*!< Windows Media Audio (WMA7/8/9 standard and WMA9 pro)   */
    //        PI_AUDDEC_CODEC_DD_PLUS,        /*!< Enhanced AC3 (DD+)                                     */
    //        PI_AUDDEC_CODEC_AAC_ADTS,       /*!< Advanced Audio Coding (ADTS), typically for OTT        */
    //        PI_AUDDEC_CODEC_HE_AAC_ADTS,    /*!< High efficiency AAC (ADTS), typically for OTT          */
    //        PI_AUDDEC_CODEC_DTS,            /*!< Basic DTS 5.1 Digital Surround (Coherent Acoustics)    */
    //        PI_AUDDEC_CODEC_DTS_HD_MASTER,  /*!< DTS HD Master Audio (DTS++)                            */
    //        PI_AUDDEC_CODEC_OPUS,           /*!< Opus (http://opus-codec.org/)                          */
    //        PI_AUDDEC_CODEC_ENDDEF          /* enum terminator                                          */
    //}   pi_auddec_codec_t;

    var HDMI_AUDIO_TYPE_PCM = 4,
        HDMI_AUDIO_TYPE_AC3 = 6,
        HDMI_AUDIO_TYPE_DDPLUS = 10;
    return {
        PCM: HDMI_AUDIO_TYPE_PCM,
        AC3: HDMI_AUDIO_TYPE_AC3,
        DDPLUS: HDMI_AUDIO_TYPE_DDPLUS
    };
};

// uncomment to turn debugging on for AV object
// o5.log.setAll(o5.platform.output.AV, true);
