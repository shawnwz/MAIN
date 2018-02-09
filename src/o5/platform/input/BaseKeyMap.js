/**
 * Base class for device / platform specific key maps.
 * A KeyMap is a mapping of a device-specific key code (represented by the key event.keyCode)
 * to a defined key constant. All implemented key maps will inherit a set of common key definitions
 * and must override those specific to the platform. Additional Key definitions maybe added for specific platforms, however
 * it is important to note that those keys will only be propagated on that platform.
 * @class o5.platform.input.BaseKeyMap
 * @constructor
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */
o5.platform.input.BaseKeyMap = function BaseKeyMap () {
    this._PLATFORM = "OTV";
    this._PLATFORM_VARIANT = "";
};

// Default Key Constants

/**
 * @property {String} KEY_ZERO
 */
o5.platform.input.BaseKeyMap.prototype.KEY_ZERO = "0";

/**
 * @property {String} KEY_ONE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_ONE = "1";

/**
 * @property {String} KEY_TWO
 */
o5.platform.input.BaseKeyMap.prototype.KEY_TWO = "2";

/**
 * @property {String} KEY_THREE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_THREE = "3";

/**
 * @property {String} KEY_FOUR
 */
o5.platform.input.BaseKeyMap.prototype.KEY_FOUR = "4";

/**
 * @property {String} KEY_FIVE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_FIVE = "5";

/**
 * @property {String} KEY_SIX
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SIX = "6";

/**
 * @property {String} KEY_SEVEN
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SEVEN = "7";

/**
 * @property {String} KEY_EIGHT
 */
o5.platform.input.BaseKeyMap.prototype.KEY_EIGHT = "8";

/**
 * @property {String} KEY_NINE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_NINE = "9";

/**
 * @property {String} KEY_STAR
 */
o5.platform.input.BaseKeyMap.prototype.KEY_STAR = "*";

/**
 * @property {String} KEY_HASH
 */
o5.platform.input.BaseKeyMap.prototype.KEY_HASH = "#";

/**
 * @property {String} KEY_UP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_UP = "ArrowUp";

/**
 * @property {String} KEY_DOWN
 */
o5.platform.input.BaseKeyMap.prototype.KEY_DOWN = "ArrowDown";

/**
 * @property {String} KEY_LEFT
 */
o5.platform.input.BaseKeyMap.prototype.KEY_LEFT = "ArrowLeft";

/**
 * @property {String} KEY_RIGHT
 */
o5.platform.input.BaseKeyMap.prototype.KEY_RIGHT = "ArrowRight";

/**
 * @property {String} KEY_OK
 */
o5.platform.input.BaseKeyMap.prototype.KEY_OK = "Ok";

/**
 * @property {String} KEY_ENTER
 */
o5.platform.input.BaseKeyMap.prototype.KEY_ENTER = "Enter";

/**
 * @property {String} KEY_BACK
 */
o5.platform.input.BaseKeyMap.prototype.KEY_BACK = "Back";

/**
 * @property {String} KEY_FORWARD
 */
o5.platform.input.BaseKeyMap.prototype.KEY_FORWARD = "Forward";

/**
 * @property {String} KEY_REFRESH
 */
o5.platform.input.BaseKeyMap.prototype.KEY_REFRESH = "refresh";

/**
 * The menu key.
 * @property {String} KEY_MENU
 */
o5.platform.input.BaseKeyMap.prototype.KEY_MENU = "Menu";

/**
 * The TV key.
 * @property {String} KEY_TV
 */
o5.platform.input.BaseKeyMap.prototype.KEY_TV = "TV";

/**
 * The radio key.
 * @property {String} KEY_RADIO
 */
o5.platform.input.BaseKeyMap.prototype.KEY_RADIO = "radio";

/**
 * The exit key.
 * @property {String} KEY_EXIT
 */
o5.platform.input.BaseKeyMap.prototype.KEY_EXIT = "Exit";

/**
 * The home key.
 * @property {String} KEY_HOME
 */
o5.platform.input.BaseKeyMap.prototype.KEY_HOME = "Home";

/**
 * The info key.
 * @property {String} KEY_INFO
 */
o5.platform.input.BaseKeyMap.prototype.KEY_INFO = "Info";

/**
 * The escape key.
 * @property {String} KEY_ESCAPE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_ESCAPE = "Escape";

/**
 * The guide key.
 * @property {String} KEY_GUIDE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_GUIDE = "Guide";

/**
 * The subtitle key.
 * @property {String} KEY_SUBTITLE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SUBTITLE = "Subtitle";

/**
 * The teletext key.
 * @property {String} KEY_TELETEXT
 */
o5.platform.input.BaseKeyMap.prototype.KEY_TELETEXT = "Teletext";

/**
 * The favorites key.
 * @property {String} KEY_FAVOURITES
 */
o5.platform.input.BaseKeyMap.prototype.KEY_FAVOURITES = "Favorites";

/**
 * The audio key.
 * @property {String} KEY_AUDIO
 */
o5.platform.input.BaseKeyMap.prototype.KEY_AUDIO = "Audio";

/**
 * The language key
 * @property {String} KEY_LANG
 */
o5.platform.input.BaseKeyMap.prototype.KEY_LANG = "lang";

/**
 * The play/pause key
 * @property {String} KEY_PLAY_PAUSE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PLAY_PAUSE = "PlayPause";

/**
 * The play key
 * @property {String} KEY_PLAY
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PLAY = "Play";

/**
 * The pause key
 * @property {String} KEY_PAUSE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PAUSE = "Pause";

/**
 * The stop key
 * @property {String} KEY_STOP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_STOP = "Stop";

/**
 * The record key
 * @property {String} KEY_RECORD
 */
o5.platform.input.BaseKeyMap.prototype.KEY_RECORD = "Record";

/**
 * The jump key
 * @property {String} KEY_JUMP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_JUMP = "jump";

/**
 * The rewind key
 * @property {String} KEY_REW
 */
o5.platform.input.BaseKeyMap.prototype.KEY_REW = "rw";

/**
 * The fast-forward key
 * @property {String} KEY_FFW
 */
o5.platform.input.BaseKeyMap.prototype.KEY_FFW = "ff";

/**
 * The skip forward key
 * @property {String} KEY_SKIP_FW
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SKIP_FW = "skipfw";

/**
 * The skip backward key
 * @property {String} KEY_SKIP_REW
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SKIP_REW = "skiprew";

/**
 * The channel up key
 * @property {String} KEY_CHAN_UP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_CHAN_UP = "ChannelUp";

/**
 * The channel down key
 * @property {String} KEY_CHAN_DOWN
 */
o5.platform.input.BaseKeyMap.prototype.KEY_CHAN_DOWN = "ChannelDown";

/**
 * The volume down key
 * @property {String} KEY_VOL_DOWN
 */
o5.platform.input.BaseKeyMap.prototype.KEY_VOL_DOWN = "VolumeDown";

/**
 * The volume up key
 * @property {String} KEY_VOL_UP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_VOL_UP = "VolumeUp";

/**
 * The mute key
 * @property {String} KEY_MUTE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_MUTE = "Mute";

/**
 * The red key
 * @property {String} KEY_RED
 */
o5.platform.input.BaseKeyMap.prototype.KEY_RED = "Red";

/**
 * The green key
 * @property {String} KEY_GREEN
 */
o5.platform.input.BaseKeyMap.prototype.KEY_GREEN = "Green";

/**
 * The yellow key
 * @property {String} KEY_YELLOW
 */
o5.platform.input.BaseKeyMap.prototype.KEY_YELLOW = "Yellow";

/**
 * The blue key
 * @property {String} KEY_BLUE
 */
o5.platform.input.BaseKeyMap.prototype.KEY_BLUE = "Blue";

/**
 * The sleep key
 * @property {String} KEY_SLEEP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SLEEP = "sleep";

/**
 * The power key
 * @property {String} KEY_POWER
 */
o5.platform.input.BaseKeyMap.prototype.KEY_POWER = "power";

/**
 * The page up key
 * @property {String} KEY_PG_UP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PG_UP = "pgup";

/**
 * The page back key
 * @property {String} KEY_PG_BACK
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PG_BACK = "pgback";

/**
 * The page forward key
 * @property {String} KEY_PG_FWD
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PG_FWD = "pgfwd";

/**
 * The page down key
 * @property {String} KEY_PG_DOWN
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PG_DOWN = "pgdown";

/**
 * The picture format key
 * @property {String} KEY_PICTURE_FORMAT
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PICTURE_FORMAT = "picture_format";

/**
 * The next channel key
 * @property {String} KEY_NEXT_CHANNEL
 */
o5.platform.input.BaseKeyMap.prototype.KEY_NEXT_CHANNEL = "next_channel";

/**
 * The previous channel key
 * @property {String} KEY_PREVIOUS_CHANNEL
 */
o5.platform.input.BaseKeyMap.prototype.KEY_PREVIOUS_CHANNEL = "prev_channel";

/**
 * The settings key
 * @property {String} KEY_SETTINGS
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SETTINGS = "settings";

/**
 * The VOD key
 * @property {String} KEY_VOD
 */
o5.platform.input.BaseKeyMap.prototype.KEY_VOD = "vod";

/**
 * The AUX key
 * @property {String} KEY_AUX
 */
o5.platform.input.BaseKeyMap.prototype.KEY_AUX = "aux";

/**
 * The content key
 * @property {String} KEY_CONTENT
 */
o5.platform.input.BaseKeyMap.prototype.KEY_CONTENT = "content";

/**
 * The games key
 * @property {String} KEY_GAMES
 */
o5.platform.input.BaseKeyMap.prototype.KEY_GAMES = "games";

/**
 * The delete key
 * @property {String} KEY_DEL
 */
o5.platform.input.BaseKeyMap.prototype.KEY_DEL = "delete";

/**
 * The channel flip key
 * @property {String} KEY_CHAN_FLIP
 */
o5.platform.input.BaseKeyMap.prototype.KEY_CHAN_FLIP = "channel_flip";

/**
 * The TV VOD key
 * @property {String} KEY_TV_VIDEO_ON_DEMAND
 */
o5.platform.input.BaseKeyMap.prototype.KEY_TV_VIDEO_ON_DEMAND = "video_on_demand";

/**
 * The SEARCH key
 * @property {String} KEY_SEARCH
 */
o5.platform.input.BaseKeyMap.prototype.KEY_SEARCH = "search";

/**
 * The VIEW key
 * @property {String} KEY_VIEW
 */
o5.platform.input.BaseKeyMap.prototype.KEY_VIEW = "view";


/* eslint-disable quote-props */
// Default mapping
o5.platform.input.BaseKeyMap.prototype._KEYMAP = {
    0x00030: o5.platform.input.BaseKeyMap.prototype.KEY_ZERO,
    0x00031: o5.platform.input.BaseKeyMap.prototype.KEY_ONE,
    0x00032: o5.platform.input.BaseKeyMap.prototype.KEY_TWO,
    0x00033: o5.platform.input.BaseKeyMap.prototype.KEY_THREE,
    0x00034: o5.platform.input.BaseKeyMap.prototype.KEY_FOUR,
    0x00035: o5.platform.input.BaseKeyMap.prototype.KEY_FIVE,
    0x00036: o5.platform.input.BaseKeyMap.prototype.KEY_SIX,
    0x00037: o5.platform.input.BaseKeyMap.prototype.KEY_SEVEN,
    0x00038: o5.platform.input.BaseKeyMap.prototype.KEY_EIGHT,
    0x00039: o5.platform.input.BaseKeyMap.prototype.KEY_NINE,
         42: o5.platform.input.BaseKeyMap.prototype.KEY_STAR,
      62724: o5.platform.input.BaseKeyMap.prototype.KEY_HASH,
    0x00026: o5.platform.input.BaseKeyMap.prototype.KEY_UP,
    0x00028: o5.platform.input.BaseKeyMap.prototype.KEY_DOWN,
    0x00025: o5.platform.input.BaseKeyMap.prototype.KEY_LEFT,
    0x00027: o5.platform.input.BaseKeyMap.prototype.KEY_RIGHT,
      61479: o5.platform.input.BaseKeyMap.prototype.KEY_TV,
      61487: o5.platform.input.BaseKeyMap.prototype.KEY_RADIO,
    0x00024: o5.platform.input.BaseKeyMap.prototype.KEY_HOME,
      61538: o5.platform.input.BaseKeyMap.prototype.KEY_EXIT,
      62725: o5.platform.input.BaseKeyMap.prototype.KEY_EXIT,
        601: o5.platform.input.BaseKeyMap.prototype.KEY_EXIT,
    0xe0112: o5.platform.input.BaseKeyMap.prototype.KEY_MOVIES,
    0x00043: o5.platform.input.BaseKeyMap.prototype.KEY_PVR,
      61468: o5.platform.input.BaseKeyMap.prototype.KEY_PVR,
      61455: o5.platform.input.BaseKeyMap.prototype.KEY_POWER,
        409: o5.platform.input.BaseKeyMap.prototype.KEY_POWER,
    0x0004B: o5.platform.input.BaseKeyMap.prototype.KEY_SETTINGS,
      61472: o5.platform.input.BaseKeyMap.prototype.KEY_SUBTITLE,
        460: o5.platform.input.BaseKeyMap.prototype.KEY_SUBTITLE,
    0xe0111: o5.platform.input.BaseKeyMap.prototype.KEY_GUIDE,
      61467: o5.platform.input.BaseKeyMap.prototype.KEY_GUIDE,
        458: o5.platform.input.BaseKeyMap.prototype.KEY_GUIDE,
      62720: o5.platform.input.BaseKeyMap.prototype.KEY_GUIDE, // Guide button mapping for Sam 7231 box.
    0x0005A: o5.platform.input.BaseKeyMap.prototype.KEY_PICTURE_FORMAT,
    0x00055: o5.platform.input.BaseKeyMap.prototype.KEY_VOD,
      61451: o5.platform.input.BaseKeyMap.prototype.KEY_OK,
         13: o5.platform.input.BaseKeyMap.prototype.KEY_OK,
      61512: o5.platform.input.BaseKeyMap.prototype.KEY_BACK,
        166: o5.platform.input.BaseKeyMap.prototype.KEY_BACK,
          8: o5.platform.input.BaseKeyMap.prototype.KEY_BACK, // Computer keyboard's Backspace key
      61458: o5.platform.input.BaseKeyMap.prototype.KEY_MENU,
         18: o5.platform.input.BaseKeyMap.prototype.KEY_MENU,
         93: o5.platform.input.BaseKeyMap.prototype.KEY_MENU,
      61492: o5.platform.input.BaseKeyMap.prototype.KEY_AUX,
      61516: o5.platform.input.BaseKeyMap.prototype.KEY_VOL_UP,
        175: o5.platform.input.BaseKeyMap.prototype.KEY_VOL_UP,
      61517: o5.platform.input.BaseKeyMap.prototype.KEY_VOL_DOWN,
        174: o5.platform.input.BaseKeyMap.prototype.KEY_VOL_DOWN,
      61510: o5.platform.input.BaseKeyMap.prototype.KEY_CHAN_UP,
        427: o5.platform.input.BaseKeyMap.prototype.KEY_CHAN_UP,
      61511: o5.platform.input.BaseKeyMap.prototype.KEY_CHAN_DOWN,
        428: o5.platform.input.BaseKeyMap.prototype.KEY_CHAN_DOWN,
      61526: o5.platform.input.BaseKeyMap.prototype.KEY_RECORD,
        416: o5.platform.input.BaseKeyMap.prototype.KEY_RECORD,
      61506: o5.platform.input.BaseKeyMap.prototype.KEY_RED,
        403: o5.platform.input.BaseKeyMap.prototype.KEY_RED,
      61507: o5.platform.input.BaseKeyMap.prototype.KEY_GREEN,
        404: o5.platform.input.BaseKeyMap.prototype.KEY_GREEN,
      61508: o5.platform.input.BaseKeyMap.prototype.KEY_YELLOW,
        405: o5.platform.input.BaseKeyMap.prototype.KEY_YELLOW,
      61509: o5.platform.input.BaseKeyMap.prototype.KEY_BLUE,
        406: o5.platform.input.BaseKeyMap.prototype.KEY_BLUE,
      61522: o5.platform.input.BaseKeyMap.prototype.KEY_STOP,
        178: o5.platform.input.BaseKeyMap.prototype.KEY_STOP,
      61520: o5.platform.input.BaseKeyMap.prototype.KEY_PLAY_PAUSE,
        179: o5.platform.input.BaseKeyMap.prototype.KEY_PLAY_PAUSE,
      61521: o5.platform.input.BaseKeyMap.prototype.KEY_PLAY,
        250: o5.platform.input.BaseKeyMap.prototype.KEY_PLAY,
         19: o5.platform.input.BaseKeyMap.prototype.KEY_PAUSE,
      61530: o5.platform.input.BaseKeyMap.prototype.KEY_FFW,
        417: o5.platform.input.BaseKeyMap.prototype.KEY_FFW,
      61513: o5.platform.input.BaseKeyMap.prototype.KEY_FFW,
        167: o5.platform.input.BaseKeyMap.prototype.KEY_FFW,
      61529: o5.platform.input.BaseKeyMap.prototype.KEY_REW,
        412: o5.platform.input.BaseKeyMap.prototype.KEY_REW,
      61532: o5.platform.input.BaseKeyMap.prototype.KEY_SKIP_FW,
        176: o5.platform.input.BaseKeyMap.prototype.KEY_SKIP_FW,
      61531: o5.platform.input.BaseKeyMap.prototype.KEY_SKIP_REW,
        177: o5.platform.input.BaseKeyMap.prototype.KEY_SKIP_REW,
      61466: o5.platform.input.BaseKeyMap.prototype.KEY_FAVOURITES,
        171: o5.platform.input.BaseKeyMap.prototype.KEY_FAVOURITES,
      61490: o5.platform.input.BaseKeyMap.prototype.KEY_TELETEXT,
      61495: o5.platform.input.BaseKeyMap.prototype.KEY_AUDIO,
      62721: o5.platform.input.BaseKeyMap.prototype.KEY_SEARCH,
      62722: o5.platform.input.BaseKeyMap.prototype.KEY_VIEW,
      61460: o5.platform.input.BaseKeyMap.prototype.KEY_INFO,
        457: o5.platform.input.BaseKeyMap.prototype.KEY_INFO,
      61518: o5.platform.input.BaseKeyMap.prototype.KEY_MUTE,
        173: o5.platform.input.BaseKeyMap.prototype.KEY_MUTE,
        127: o5.platform.input.BaseKeyMap.prototype.KEY_DEL, // For TCH remote only
         46: o5.platform.input.BaseKeyMap.prototype.KEY_DEL,
      62723: o5.platform.input.BaseKeyMap.prototype.KEY_TCH_VIEW,
        114: o5.platform.input.BaseKeyMap.prototype.KEY_RED, // F3
        115: o5.platform.input.BaseKeyMap.prototype.KEY_GREEN, //F4
        116: o5.platform.input.BaseKeyMap.prototype.KEY_YELLOW, //F5
        117: o5.platform.input.BaseKeyMap.prototype.KEY_BLUE //F6
};

/**
 * Returns the name of the platform this key map represents
 * @method getPlatform
 * @return {String} Platform identifier
 */
o5.platform.input.BaseKeyMap.prototype.getPlatform = function getPlatform () {
    return this._PLATFORM;
};

/**
 * Returns the variant of the platform the key map represents
 * @method getPlatformVariant
 * @return {String} Platform variant identifier
 */
o5.platform.input.BaseKeyMap.prototype.getPlatformVariant = function getPlatformVariant () {
    return this._PLATFORM_VARIANT;
};

/**
 * Returns the actual key constant for the key code. For example,
 * key code 37 returns KEY_LEFT.
 * @method getKey
 * @param {String} key The key code of the key to retrieve.
 * @return {String} Key Constant derived from the key code
 */
o5.platform.input.BaseKeyMap.prototype.getKey = function getKey (key) {
    return this._KEYMAP[key];
};

/**
 * Returns the key map object containing the mappings
 * between key codes and keys
 * @method getKeyMap
 * @return {Object} key map object
 * @private
 */
o5.platform.input.BaseKeyMap.prototype.getKeyMap = function getKeyMap () {
    return this._KEYMAP;
};
