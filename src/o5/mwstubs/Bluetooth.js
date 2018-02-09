/**
 * Stub for BLUETOOTH: CCOM.Bluetooth
 * @ignore
 */
CCOM.Bluetooth = new (function Bluetooth()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.Bluetooth";
	// var _MY_NAME_SPACE = "bluetooth",
	this._id = CCOM.stubs.uuid();
	// events in xml
	this._EVENT_ON_BT_STATE_CHANGED = "onBtStateChanged";
	this._EVENT_ON_DEVICE_FOUND = "onDeviceFound";
	this._EVENT_ON_SSP_REQUEST = "onSspRequest";
	this._EVENT_ON_PIN_REQUEST = "onPinRequest";
	this._EVENT_ON_CHARACTERISTIC_NOTIFICATION = "onCharacteristicNotification";
	this._EVENT_ON_ADAPTER_PLUG_STATUS = "onAdapterPlugStatus";
	this._EVENT_ON_DEVICE_FOUND_WITH_SERVICES = "onDeviceFoundWithServices";
	this._EVENT_ON_CMD_NOTIFICATION = "onCmdNotification";
	this._EVENT_ON_LE_SCAN_RESULT ="onLeScanResult";
	this._EVENT_ON_RCU_STATE_CHANGED ="onRcuStateChanged";
	
	// events from methods
	this._EVENT_BT_REQUEST_OK = "btRequestOK";
	this._EVENT_BT_REQUEST_FAILED = "btRequestFailed";
	this._EVENT_LIST_BONDED_DEVICES_OK = "listBondedDevicesOK";
	this._EVENT_LIST_BONDED_DEVICES_FAILED = "listBondedDevicesFailed";
	this._EVENT_QUERY_DEVICE_SERVICES_OK = "queryDeviceServicesOK";
	this._EVENT_QUERY_DEVICE_SERVICES_FAILED = "queryDeviceServicesFailed";
	this._EVENT_REGISTER_LE_DEVICE_OK = "registerLeDeviceOK";
	this._EVENT_REGISTER_LE_DEVICE_FAILED = "registerLeDeviceFailed";
	this._EVENT_UNREGISTER_LE_DEVICE_OK = "unregisterLeDeviceOK";
	this._EVENT_UNREGISTER_LE_DEVICE_FAILED = "unregisterLeDeviceFailed";
	this._EVENT_LIST_CHARACTERISTICS_OK = "listCharacteristicsOK";
	this._EVENT_LIST_CHARACTERISTICS_FAILED = "listCharacteristicsFailed";
	this._EVENT_READ_CHARACTERISTIC_OK = "readCharacteristicOK";
	this._EVENT_READ_CHARACTERISTIC_FAILED = "readCharacteristicFailed";
	this._EVENT_WRITE_CHARACTERISTIC_OK = "writeCharacteristicOK";
	this._EVENT_WRITE_CHARACTERISTIC_FAILED = "writeCharacteristicFailed";
	this._EVENT_REGISTER_NOTIFY_CHARACTERISTIC_OK = "registerNotifyCharacteristicOK";
	this._EVENT_REGISTER_NOTIFY_CHARACTERISTIC_FAILED = "registerNotifyCharacteristicFailed";
	this._EVENT_UNREGISTER_NOTIFY_CHARACTERISTIC_OK = "unregisterNotifyCharacteristicOK";
	this._EVENT_UNREGISTER_NOTIFY_CHARACTERISTIC_FAILED = "unregisterNotifyCharacteristicFailed";
	this._EVENT_LIST_DESCRIPTORS_OK = "listDescriptorsOK";
	this._EVENT_LIST_DESCRIPTORS_FAILED = "listDescriptorsFailed";
	this._EVENT_READ_DESCRIPTOR_OK = "readDescriptorOK";
	this._EVENT_READ_DESCRIPTOR_FAILED = "readDescriptorFailed";
	this._EVENT_WRITE_DESCRIPTOR_OK = "writeDescriptorOK";
	this._EVENT_WRITE_DESCRIPTOR_FAILED = "writeDescriptorFailed";
	this._EVENT_SEND_HID_REPORT_FAILED="sendHidReportFailed";
	this._EVENT_LIST_CONNECTED_DEVICES_OK = "listConnectedDevicesOK";
	this._EVENT_LIST_CONNECTED_DEVICES_FAILED = "listConnectedDevicesFailed";
	this._EVENT_DISCOVER_WITH_SERVICES_OK = "discoverWithServicesOK";
	this._EVENT_DISCOVER_WITH_SERVICES_FAILED = "discoverWithServicesFailed";

	this._supportedEvents = [
		this._EVENT_ON_BT_STATE_CHANGED,
		this._EVENT_ON_DEVICE_FOUND,
		this._EVENT_ON_SSP_REQUEST,
		this._EVENT_ON_PIN_REQUEST,
		this._EVENT_ON_CHARACTERISTIC_NOTIFICATION,
		this._EVENT_ON_ADAPTER_PLUG_STATUS,
		this._EVENT_ON_DEVICE_FOUND_WITH_SERVICES,
		this._EVENT_ON_CMD_NOTIFICATION,
		this._EVENT_BT_REQUEST_OK,
		this._EVENT_BT_REQUEST_FAILED,
		this._EVENT_LIST_BONDED_DEVICES_OK,
		this._EVENT_LIST_BONDED_DEVICES_FAILED,
		this._EVENT_QUERY_DEVICE_SERVICES_OK,
		this._EVENT_QUERY_DEVICE_SERVICES_FAILED,
		this._EVENT_REGISTER_LE_DEVICE_OK,
		this._EVENT_REGISTER_LE_DEVICE_FAILED,
		this._EVENT_UNREGISTER_LE_DEVICE_OK,
		this._EVENT_UNREGISTER_LE_DEVICE_FAILED,
		this._EVENT_LIST_CHARACTERISTICS_OK,
		this._EVENT_LIST_CHARACTERISTICS_FAILED,
		this._EVENT_READ_CHARACTERISTIC_OK,
		this._EVENT_READ_CHARACTERISTIC_FAILED,
		this._EVENT_WRITE_CHARACTERISTIC_OK,
		this._EVENT_WRITE_CHARACTERISTIC_FAILED,
		this._EVENT_REGISTER_NOTIFY_CHARACTERISTIC_OK,
		this._EVENT_REGISTER_NOTIFY_CHARACTERISTIC_FAILED,
		this._EVENT_UNREGISTER_NOTIFY_CHARACTERISTIC_OK,
		this._EVENT_UNREGISTER_NOTIFY_CHARACTERISTIC_FAILED,
		this._EVENT_LIST_DESCRIPTORS_OK,
		this._EVENT_LIST_DESCRIPTORS_FAILED,
		this._EVENT_READ_DESCRIPTOR_OK,
		this._EVENT_READ_DESCRIPTOR_FAILED,
		this._EVENT_WRITE_DESCRIPTOR_OK,
		this._EVENT_WRITE_DESCRIPTOR_FAILED,
		this._EVENT_LIST_CONNECTED_DEVICES_OK,
		this._EVENT_LIST_CONNECTED_DEVICES_FAILED,
		this._EVENT_DISCOVER_WITH_SERVICES_OK,
		this._EVENT_DISCOVER_WITH_SERVICES_FAILED
	];

	var deviceDetailforLowenergy = new Object();
	var bondedDeviceDetails = {
	};

	deviceDetailforLowenergy.bondedDeviceDetails = bondedDeviceDetails;

	var btDeviceDetails = [
	];

	var btDetails = new Object();

	var btDetailsforbond = new Object();
	var deviceDetails = {
	};

	btDetailsforbond.deviceDetails = deviceDetails;

	var bondedListforlistok = {};
	var bondedList = [ {
	} ];

	bondedListforlistok.bondedList = bondedList;

	var bondedListforfailed = new Object();
	var error = {
		message : "bluetooth::No bonded devices",
		name : "RequestInProgress",
		domain : "com.opentv.bluetooth"
	};
	bondedListforfailed.error = error;

	var bondedListforfailedAdapter = new Object();
	var error = {
		message : "bluetooth::Bluetooth adapter is not enabled",
		name : "RequestInProgress",
		domain : "com.opentv.bluetooth"
	};
	bondedListforfailedAdapter.error = error;

	var btServiceRecordforfailed = new Object();
	var error = {
		message : "bluetooth::No query device services",
		name : "RequestInProgress",
		domain : "com.opentv.bluetooth"
	};
	btServiceRecordforfailed.error = error;

	var registerLeDeviceFailederror = new Object();
	var error = {
		message : "bluetooth::Invalid parameter. bdAddr is NULL.",
		name : "InvalidAddress",
		domain : "com.opentv.bluetooth"
	};
	registerLeDeviceFailederror.error = error;
	
	var unregisterFlag;
	var registerFlag;

	// methodType
	this.SET_DISCOVERY_STATE = 0;
	this.SET_BOND_STATE = 1;
	this.SET_CONNECTION_STATE = 2;
	this.SSP_REPLY = 3;
	this.PIN_REPLY = 4;
	this.SEND_CMD = 5;
	this.GET_CMD_STATUS = 6;
	this.SET_LE_SCAN_STATE= 7;
	// stateChangeType
	this.ADAPTER_STATE_CHANGED = 0;
	this.DISCOVERY_STATE_CHANGED = 1;
	this.BOND_STATE_CHANGED = 2;
	this.CONNECTION_STATE_CHANGED = 3;
	// btSSPVariant
	this.BT_SSP_VARIANT_PASSKEY_CONFIRMATION = 0;
	this.BT_SSP_VARIANT_PASSKEY_ENTRY = 1;
	this.BT_SSP_VARIANT_PASSKEY_CONSENT = 2;
	this.BT_SSP_VARIANT_PASSKEY_NOTIFICATION = 3;
	// errorCode
	this.BT_STATUS_SUCCESS = 0;
	this.BT_STATUS_FAIL = 1;
	this.BT_STATUS_NOT_READY = 2;
	this.BT_STATUS_NOMEM = 3;
	this.BT_STATUS_BUSY = 4;
	this.BT_STATUS_DONE = 5;
	this.BT_STATUS_UNSUPPORTED = 6;
	this.BT_STATUS_PARM_INVALID = 7;
	this.BT_STATUS_UNHANDLED = 8;
	this.BT_STATUS_AUTH_FAILURE = 9;
	this.BT_STATUS_RMT_DEV_DOWN = 10;
	this.BT_STATUS_AUTH_REJECTED = 11;
	this.BT_STATUS_BAD_SERVICE = 12;
	// btDeviceType
	this.BT_DEVICE_DEVTYPE_BREDR = 1;
	this.BT_DEVICE_DEVTYPE_BLE = 2;
	// btWriteType
	this.WRITE_WITHOUT_RESPONSE = 0x1;
	this.WRITE_DEFAULT = 0x2;
	//btReportType
   	this.HID_REPORT_INPUT= 1;
   	this.HID_REPORT_OUTPUT=2;
   	this.HID_REPORT_FEATURE=3;

	/*
	 * //btProfiles BLUETOOTH_UUID_HIDHOST: 1124, BLUETOOTH_UUID_AUDIO_SINK: 0x00110B, BLUETOOTH_UUID_HANDSFREE: 0x00111E, //btGattServices
	 * GATT_SERVICE_ALERT_NOTIFICATION_SERVICE: 1811, GATT_SERVICE_AUTOMATION_IO: 1815, GATT_SERVICE_BATTERY_SERVICE: 0x180F,
	 * GATT_SERVICE_BLOOD_PRESSURE: 1810, GATT_SERVICE_BODY_COMPOSITION: 0x181B, GATT_SERVICE_BOND_MANAGEMENT: 0x181E,
	 * GATT_SERVICE_CONTINUOUS_GLUCOSE_MONITORING: 0x181F, GATT_SERVICE_CURRENT_TIME_SERVICE: 1805, GATT_SERVICE_CYCLING_POWER: 1818,
	 * GATT_SERVICE_CYCLING_SPEED_AND_CADENCE: 1816, GATT_SERVICE_DEVICE_INFORMATION: 0x180A, GATT_SERVICE_ENVIRONMENTAL_SENSING: 0x181A,
	 * GATT_SERVICE_GENERIC_ACCESS: 1800, GATT_SERVICE_GENERIC_ATTRIBUTE: 1801, GATT_SERVICE_GLUCOSE: 1808, GATT_SERVICE_HEALTH_THERMOMETER:
	 * 1809, GATT_SERVICE_HEART_RATE: 0x180D, GATT_SERVICE_HTTP_PROXY: 1823, GATT_SERVICE_HUMAN_INTERFACE_DEVICE: 1812,
	 * GATT_SERVICE_IMMEDIATE_ALERT: 1802, GATT_SERVICE_INDOOR_POSITIONING: 1821, GATT_SERVICE_INTERNET_PROTOCOL_SUPPORT: 1820,
	 * GATT_SERVICE_LINK_LOSS: 1803, GATT_SERVICE_LOCATION_AND_NAVIGATION: 1819, GATT_SERVICE_NEXT_DST_CHANGE_SERVICE: 1807,
	 * GATT_SERVICE_OBJECT_TRANSFER: 1825, GATT_SERVICE_PHONE_ALERT_STATUS_SERVICE: 0x180E, GATT_SERVICE_PULSE_OXIMETER: 1822,
	 * GATT_SERVICE_REFERENCE_TIME_UPDATE_SERVICE: 1806, GATT_SERVICE_RUNNING_SPEED_AND_CADENCE: 1814, GATT_SERVICE_SCAN_PARAMETERS: 1813,
	 * GATT_SERVICE_TRANSPORT_DISCOVERY: 1824, GATT_SERVICE_TX_POWER: 1804, GATT_SERVICE_USER_DATA: 0x181C, GATT_SERVICE_WEIGHT_SCALE:
	 * 0x181D, //btGattCharacteristics GATT_CHARACTERISTIC_AEROBIC_HEART_RATE_LOWER_LIMIT: 0x2AA7, GATT_CHARACTERISTIC_CGM_SESSION_RUN_TIME:
	 * 0x2AAB, GATT_CHARACTERISTIC_CGM_SESSION_START_TIME: 0x2AAA, GATT_CHARACTERISTIC_CGM_SPECIFIC_OPS_CONTROL_POINT: 0x2AAC,
	 * GATT_CHARACTERISTIC_CGM_STATUS: 0x2AA9, GATT_CHARACTERISTIC_CSC_FEATURE: 0x2A5C, GATT_CHARACTERISTIC_CSC_MEASUREMENT: 0x2A5B,
	 * GATT_CHARACTERISTIC_CURRENT_TIME: 0x2A2B, GATT_CHARACTERISTIC_CYCLING_POWER_CONTROL_POINT: 0x2A66,
	 * GATT_CHARACTERISTIC_CYCLING_POWER_FEATURE: 0x2A65, GATT_CHARACTERISTIC_CYCLING_POWER_MEASUREMENT: 0x2A63,
	 * GATT_CHARACTERISTIC_CYCLING_POWER_VECTOR: 0x2A64, GATT_CHARACTERISTIC_DATABASE_CHANGE_INCREMENT: 0x2A99,
	 * GATT_CHARACTERISTIC_DATE_OF_BIRTH: 0x2A85, GATT_CHARACTERISTIC_DATE_OF_THRESHOLD_ASSESSMENT: 0x2A86, GATT_CHARACTERISTIC_DATE_TIME:
	 * 0x2A08, GATT_CHARACTERISTIC_DAY_DATE_TIME: 0x2A0A, GATT_CHARACTERISTIC_DAY_OF_WEEK: 0x2A09,
	 * GATT_CHARACTERISTIC_DESCRIPTOR_VALUE_CHANGED: 0x2A7D, GATT_CHARACTERISTIC_DEVICE_NAME: 0x2A00, GATT_CHARACTERISTIC_DEW_POINT: 0x2A7B,
	 * GATT_CHARACTERISTIC_DIGITAL: 0x2A56, GATT_CHARACTERISTIC_DST_OFFSET: 0x2A0D, GATT_CHARACTERISTIC_ELEVATION: 0x2A6C,
	 * GATT_CHARACTERISTIC_EMAIL_ADDRESS: 0x2A87, GATT_CHARACTERISTIC_EXACT_TIME_256: 0x2A0C,
	 * GATT_CHARACTERISTIC_FAT_BURN_HEART_RATE_LOWER_LIMIT: 0x2A88, GATT_CHARACTERISTIC_FAT_BURN_HEART_RATE_UPPER_LIMIT: 0x2A89,
	 * GATT_CHARACTERISTIC_FIRMWARE_REVISION_STRING: 0x2A26, GATT_CHARACTERISTIC_FIRST_NAME: 0x2A8A,
	 * GATT_CHARACTERISTIC_FIVE_ZONE_HEART_RATE_LIMITS: 0x2A8B, GATT_CHARACTERISTIC_FLOOR_NUMBER: 0x2AB2, GATT_CHARACTERISTIC_GENDER:
	 * 0x2A8C, GATT_CHARACTERISTIC_GLUCOSE_FEATURE: 0x2A51, GATT_CHARACTERISTIC_GLUCOSE_MEASUREMENT: 0x2A18,
	 * GATT_CHARACTERISTIC_GLUCOSE_MEASUREMENT_CONTEXT: 0x2A34, GATT_CHARACTERISTIC_GUST_FACTOR: 0x2A74,
	 * GATT_CHARACTERISTIC_HARDWARE_REVISION_STRING: 0x2A27, GATT_CHARACTERISTIC_HEART_RATE_CONTROL_POINT: 0x2A39,
	 * GATT_CHARACTERISTIC_HEART_RATE_MAX: 0x2A8D, GATT_CHARACTERISTIC_HEART_RATE_MEASUREMENT: 0x2A37, GATT_CHARACTERISTIC_HEAT_INDEX:
	 * 0x2A7A, GATT_CHARACTERISTIC_HEIGHT: 0x2A8E, GATT_CHARACTERISTIC_HID_CONTROL_POINT: 0x2A4C, GATT_CHARACTERISTIC_HID_INFORMATION:
	 * 0x2A4A, GATT_CHARACTERISTIC_HIP_CIRCUMFERENCE: 0x2A8F, GATT_CHARACTERISTIC_HTTP_CONTROL_POINT: 0x2ABA,
	 * GATT_CHARACTERISTIC_HTTP_ENTITY_BODY: 0x2AB9, GATT_CHARACTERISTIC_HTTP_HEADERS: 0x2AB7, GATT_CHARACTERISTIC_HTTP_STATUS_CODE: 0x2AB8,
	 * GATT_CHARACTERISTIC_HTTPS_SECURITY: 0x2ABB, GATT_CHARACTERISTIC_HUMIDITY: 0x2A6F,
	 * GATT_CHARACTERISTIC_IEEE_11073_20601_REGULATORY_CERTIFICATION_DATA_LIST: 0x2A2A,
	 * GATT_CHARACTERISTIC_INDOOR_POSITIONING_CONFIGURATION: 0x2AAD, GATT_CHARACTERISTIC_INTERMEDIATE_CUFF_PRESSURE: 0x2A36,
	 * GATT_CHARACTERISTIC_INTERMEDIATE_TEMPERATURE: 0x2A1E, GATT_CHARACTERISTIC_IRRADIANCE: 0x2A77, GATT_CHARACTERISTIC_LANGUAGE: 0x2AA2,
	 * GATT_CHARACTERISTIC_LAST_NAME: 0x2A90, GATT_CHARACTERISTIC_LATITUDE: 0x2AAE, GATT_CHARACTERISTIC_LN_CONTROL_POINT: 0x2A6B,
	 * GATT_CHARACTERISTIC_LN_FEATURE: 0x2A6A, GATT_CHARACTERISTIC_LOCAL_EAST_COORDINATE: 0x2AB1,
	 * GATT_CHARACTERISTIC_LOCAL_NORTH_COORDINATE: 0x2AB0, GATT_CHARACTERISTIC_LOCAL_TIME_INFORMATION: 0x2A0F,
	 * GATT_CHARACTERISTIC_LOCATION_AND_SPEED: 0x2A67, GATT_CHARACTERISTIC_LOCATION_NAME: 0x2AB5, GATT_CHARACTERISTIC_LONGITUDE: 0x2AAF,
	 * GATT_CHARACTERISTIC_MAGNETIC_DECLINATION: 0x2A2C, GATT_CHARACTERISTIC_MAGNETIC_FLUX_DENSITY_2D: 0x2AA0,
	 * GATT_CHARACTERISTIC_MAGNETIC_FLUX_DENSITY_3D: 0x2AA1, GATT_CHARACTERISTIC_MANUFACTURER_NAME_STRING: 0x2A29,
	 * GATT_CHARACTERISTIC_MAXIMUM_RECOMMENDED_HEART_RATE: 0x2A91, GATT_CHARACTERISTIC_MEASUREMENT_INTERVAL: 0x2A21,
	 * GATT_CHARACTERISTIC_MODEL_NUMBER_STRING: 0x2A24, GATT_CHARACTERISTIC_NAVIGATION: 0x2A68, GATT_CHARACTERISTIC_NEW_ALERT: 0x2A46,
	 * GATT_CHARACTERISTIC_OBJECT_ACTION_CONTROL_POINT: 0x2AC5, GATT_CHARACTERISTIC_OBJECT_CHANGED: 0x2AC8,
	 * GATT_CHARACTERISTIC_OBJECT_FIRST_CREATED: 0x2AC1, GATT_CHARACTERISTIC_OBJECT_ID: 0x2AC3, GATT_CHARACTERISTIC_OBJECT_LAST_MODIFIED:
	 * 0x2AC2, GATT_CHARACTERISTIC_OBJECT_LIST_CONTROL_POINT: 0x2AC6, GATT_CHARACTERISTIC_OBJECT_LIST_FILTER: 0x2AC7,
	 * GATT_CHARACTERISTIC_OBJECT_NAME: 0x2ABE, GATT_CHARACTERISTIC_OBJECT_PROPERTIES: 0x2AC4, GATT_CHARACTERISTIC_OBJECT_SIZE: 0x2AC0,
	 * GATT_CHARACTERISTIC_OBJECT_TYPE: 0x2ABF, GATT_CHARACTERISTIC_OTS_FEATURE: 0x2ABD,
	 * GATT_CHARACTERISTIC_PERIPHERAL_PREFERRED_CONNECTION_PARAMETERS: 0x2A04, GATT_CHARACTERISTIC_PERIPHERAL_PRIVACY_FLAG: 0x2A02,
	 * GATT_CHARACTERISTIC_PLX_CONTINUOUS_MEASUREMENT: 0x2A5F, GATT_CHARACTERISTIC_PLX_FEATURES: 0x2A60,
	 * GATT_CHARACTERISTIC_PLX_SPOT_CHECK_MEASUREMENT: 0x2A5E, GATT_CHARACTERISTIC_PNP_ID: 0x2A50, GATT_CHARACTERISTIC_POLLEN_CONCENTRATION:
	 * 0x2A75, GATT_CHARACTERISTIC_POSITION_QUALITY: 0x2A69, GATT_CHARACTERISTIC_PRESSURE: 0x2A6D, GATT_CHARACTERISTIC_PROTOCOL_MODE:
	 * 0x2A4E, GATT_CHARACTERISTIC_RAINFALL: 0x2A78, GATT_CHARACTERISTIC_RECONNECTION_ADDRESS: 0x2A03,
	 * GATT_CHARACTERISTIC_RECORD_ACCESS_CONTROL_POINT: 0x2A52, GATT_CHARACTERISTIC_REFERENCE_TIME_INFORMATION: 0x2A14,
	 * GATT_CHARACTERISTIC_REPORT: 0x2A4D, GATT_CHARACTERISTIC_REPORT_MAP: 0x2A4B, GATT_CHARACTERISTIC_RESTING_HEART_RATE: 0x2A92,
	 * GATT_CHARACTERISTIC_RINGER_CONTROL_POINT: 0x2A40, GATT_CHARACTERISTIC_RINGER_SETTING: 0x2A41, GATT_CHARACTERISTIC_RSC_FEATURE:
	 * 0x2A54, GATT_CHARACTERISTIC_RSC_MEASUREMENT: 0x2A53, GATT_CHARACTERISTIC_SC_CONTROL_POINT: 0x2A55,
	 * GATT_CHARACTERISTIC_SCAN_INTERVAL_WINDOW: 0x2A4F, GATT_CHARACTERISTIC_SCAN_REFRESH: 0x2A31, GATT_CHARACTERISTIC_SENSOR_LOCATION:
	 * 0x2A5D, GATT_CHARACTERISTIC_SERIAL_NUMBER_STRING: 0x2A25, GATT_CHARACTERISTIC_SERVICE_CHANGED: 0x2A05,
	 * GATT_CHARACTERISTIC_SOFTWARE_REVISION_STRING: 0x2A28, GATT_CHARACTERISTIC_SPORT_TYPE_FOR_AEROBIC_AND_ANAEROBIC_THRESHOLDS: 0x2A93,
	 * GATT_CHARACTERISTIC_SUPPORTED_NEW_ALERT_CATEGORY: 0x2A47, GATT_CHARACTERISTIC_SUPPORTED_UNREAD_ALERT_CATEGORY: 0x2A48,
	 * GATT_CHARACTERISTIC_SYSTEM_ID: 0x2A23, GATT_CHARACTERISTIC_TDS_CONTROL_POINT: 0x2ABC, GATT_CHARACTERISTIC_TEMPERATURE: 0x2A6E,
	 * GATT_CHARACTERISTIC_TEMPERATURE_MEASUREMENT: 0x2A1C, GATT_CHARACTERISTIC_TEMPERATURE_TYPE: 0x2A1D,
	 * GATT_CHARACTERISTIC_THREE_ZONE_HEART_RATE_LIMITS: 0x2A94, GATT_CHARACTERISTIC_TIME_ACCURACY: 0x2A12, GATT_CHARACTERISTIC_TIME_SOURCE:
	 * 0x2A13, GATT_CHARACTERISTIC_TIME_UPDATE_CONTROL_POINT: 0x2A16, GATT_CHARACTERISTIC_TIME_UPDATE_STATE: 0x2A17,
	 * GATT_CHARACTERISTIC_TIME_WITH_DST: 0x2A11, GATT_CHARACTERISTIC_TIME_ZONE: 0x2A0E, GATT_CHARACTERISTIC_TRUE_WIND_DIRECTION: 0x2A71,
	 * GATT_CHARACTERISTIC_TRUE_WIND_SPEED: 0x2A70, GATT_CHARACTERISTIC_TWO_ZONE_HEART_RATE_LIMIT: 0x2A95,
	 * GATT_CHARACTERISTIC_TX_POWER_LEVEL: 0x2A07, GATT_CHARACTERISTIC_UNCERTAINTY: 0x2AB4, GATT_CHARACTERISTIC_UNREAD_ALERT_STATUS: 0x2A45,
	 * GATT_CHARACTERISTIC_URI: 0x2AB6, GATT_CHARACTERISTIC_USER_CONTROL_POINT: 0x2A9F, GATT_CHARACTERISTIC_USER_INDEX: 0x2A9A,
	 * GATT_CHARACTERISTIC_UV_INDEX: 0x2A76, GATT_CHARACTERISTIC_VO2_MAX: 0x2A96, GATT_CHARACTERISTIC_WAIST_CIRCUMFERENCE: 0x2A97,
	 * GATT_CHARACTERISTIC_WEIGHT: 0x2A98, GATT_CHARACTERISTIC_WEIGHT_MEASUREMENT: 0x2A9D, GATT_CHARACTERISTIC_WEIGHT_SCALE_FEATURE: 0x2A9E,
	 * GATT_CHARACTERISTIC_WIND_CHILL: 0x2A79, //btGattDescriptors GATT_DESCRIPTOR_CHARACTERISTIC_EXTENDED_PROPERTIES: 2900,
	 * GATT_DESCRIPTOR_CHARACTERISTIC_USER_DESCRIPTION: 2901, GATT_DESCRIPTOR_CLIENT_CHARACTERISTIC_CONFIGURATION: 2902,
	 * GATT_DESCRIPTOR_SERVER_CHARACTERISTIC_CONFIGURATION: 2903, GATT_DESCRIPTOR_CHARACTERISTIC_PRESENTATION_FORMAT: 2904,
	 * GATT_DESCRIPTOR_CHARACTERISTIC_AGGREGATE_FORMAT: 2905, GATT_DESCRIPTOR_VALID_RANGE: 2906, GATT_DESCRIPTOR_EXTERNAL_REPORT_REFERENCE:
	 * 2907, GATT_DESCRIPTOR_REPORT_REFERENCE: 2908, GATT_DESCRIPTOR_NUMBER_OF_DIGITALS: 2909, GATT_DESCRIPTOR_VALUE_TRIGGER_SETTING:
	 * 0x290A, GATT_DESCRIPTOR_ENVIRONMENTAL_SENSING_CONFIGURATION: 0x290B, GATT_DESCRIPTOR_ENVIRONMENTAL_SENSING_MEASUREMENT: 0x290C,
	 * GATT_DESCRIPTOR_ENVIRONMENTAL_SENSING_TRIGGER_SETTING: 0x290D, GATT_DESCRIPTOR_TIME_TRIGGER_SETTING: 0x290E,
	 * 
	 */
	// btCmdStatus
	this.BT_MICROPHONE_DEACTIVATED = 0;
	this.BT_MICROPHONE_ACTIVATED = 1;

	// btCmd
	this.ACTIVATE_MICROPHONE = 0;

	//btRcuState
	this.RCU_SCANNING  		  = 0;
	this.RCU_NOT_PAIRED 	  = 1;
	this.RCU_CONNECTED  	  = 2;
	this.RCU_CONNECTING 	  = 3;
	this.RCU_CONNECT_FAILED = 4;
	this.RCU_CONFLICT		    = 5;

	this.btRequest = function(mType, parameters)
	{
		var hdl = CCOM.stubs.getHandle();
		var btDetails = new Object();
		var deviceDetails = {

		};

		btDetails.deviceDetails = deviceDetails;
		// var btDetails = {
		/*
		 * statusType: _obj.DISCOVERY_STATE_CHANGED, deviceDetails: {state: 1, bdAddr: "", bdName: "", uuid: "" }, btErrorCode:
		 * _obj.BT_STATUS_SUCCESS,
		 */
		// };
		/*
		 * var deviceDetail = new Object(); var bondedDeviceDetails = { bdAddr: "ff:ff:ff:ff:ff:ff", bdName: "BoomBand", deviceType: 1 };
		 * 
		 * deviceDetail.bondedDeviceDetails = bondedDeviceDetails;
		 */

		var btDetailsforsspRequest = {

		};

		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);

		switch (mType)
		{
		case 0:
			if (result.keyValue == true)
			{
				btDetails.statusType = this.DISCOVERY_STATE_CHANGED;
				btDetails.btErrorCode = this.BT_STATUS_SUCCESS;
				deviceDetails.state = 1;
				deviceDetails.bdAddr = "";
				deviceDetails.bdName = "";
				deviceDetails.uuid = "";
				// btDeviceDetails.push(btDetails);
				// console.log(btDeviceDetails);
				onBtStateChanged(btDetails);

				bondedDeviceDetails.bdAddr = "ff:ff:ff:ff:ff:ff";
				bondedDeviceDetails.bdName = "GTP3100";
				bondedDeviceDetails.deviceType = 1;
				// btDeviceDetails.push(deviceDetailforLowenergy);
				// console.log(btDeviceDetails);
				onDeviceFound(deviceDetailforLowenergy);

				bondedDeviceDetails.bdAddr = "xx:xx:xx:xx:xx:xx";
				bondedDeviceDetails.bdName = "BoomBand";
				bondedDeviceDetails.deviceType = 2;
				// btDeviceDetails.push(deviceDetailforLowenergy);
				// console.log(btDeviceDetails);
				onDeviceFound(deviceDetailforLowenergy);
			}
			else
			{
				btDetails.statusType = this.ADAPTER_STATE_CHANGED;
				btDetails.btErrorCode = this.BT_STATUS_SUCCESS;
				deviceDetails.bdName = this.cur_dev.bdName;
				deviceDetails.bdAddr = cur_dev.bdAddr;
				deviceDetails.state = 0;
				deviceDetails.uuid = "";
				btDeviceDetails.push(btDetails);
				onBtStateChanged(btDetails);
			}

			break;
		case 1:
			if (result.keyValue == true)
			{
				if (parameters.action == true)
				{
					if (btDeviceDetails.length <= 1)
					{
						for (var i = 0; i < btDeviceDetails.length; i++)
						{
							if (parameters.bdAddr == btDeviceDetails[i].deviceDetails.bdAddr)
							{
								_frame_add_msg("Device is already bonded");
								return false;
							}

						}
					}
					else if (btDeviceDetails.length >= 1)
					{
						for (var i = 0; i < btDeviceDetails.length - 2; i++)
						{
							if (parameters.bdAddr == btDeviceDetails[i].deviceDetails.bdAddr)
							{ // Bonded device checking
								_frame_add_msg("Device is already bonded");
								return false;
							}

						}
					}
					else
					{
						for (var i = 0; i < btDeviceDetails.length - 1; i++)
						{
							if (parameters.bdAddr == btDeviceDetails[i].deviceDetails.bdAddr)
							{
								_frame_add_msg("Device is already bonded");
								return false;
							}

						}
					}

					btDetailsforsspRequest.bdName = cur_dev.bdName;
					btDetailsforsspRequest.bdAddr = parameters.bdAddr;
					// btDetails2.sspVariant = 0;
					btDetailsforsspRequest.passKey = 1234;

					onSspRequest(btDetailsforsspRequest);

					if (parameters.bdAddr == "ff:ff:ff:ff:ff:ff")
					{
						btDetails.statusType = this.BOND_STATE_CHANGED;
						btDetails.btErrorCode = this.BT_STATUS_SUCCESS;
						deviceDetails.bdName = cur_dev.bdName; // Bond Device
						deviceDetails.bdAddr = parameters.bdAddr;
						deviceDetails.state = 1;
						deviceDetails.uuid = "";
						btDeviceDetails.push(btDetails);
						console.log(btDeviceDetails);
						onBtStateChanged(btDetails);
					}
					else
					{
						btDetails.statusType = this.BOND_STATE_CHANGED;
						btDetails.btErrorCode = this.BT_STATUS_SUCCESS;
						deviceDetails.bdName = cur_dev.bdName;
						deviceDetails.bdAddr = parameters.bdAddr; // Bond Device
						deviceDetails.state = 1;
						deviceDetails.uuid = "";
						btDeviceDetails.push(btDetails);
						console.log(btDeviceDetails);
						onBtStateChanged(btDetails);
					}

				}
				else
				{
					btDetails.statusType = this.BOND_STATE_CHANGED;
					btDetails.btErrorCode = this.BT_STATUS_SUCCESS;
					deviceDetails.bdName = cur_dev.bdName;
					deviceDetails.bdAddr = parameters.bdAddr;
					deviceDetails.state = 0;
					deviceDetails.uuid = ""; // Unbond device
					if (btDeviceDetails.length >= 0)
					{
						btDeviceDetails.pop(btDetails);
					}
					if (btDeviceDetails.length == 1)
					{
						btDeviceDetails.pop(btDetails);
					}
					console.log(btDeviceDetails);
					onBtStateChanged(btDetails);
				}
			}
			else
			{
				btDetails.statusType = this.ADAPTER_STATE_CHANGED;
				btDetails.btErrorCode = this.BT_STATUS_SUCCESS;
				deviceDetails.bdName = cur_dev.bdName; // Adapter Off state
				deviceDetails.bdAddr = cur_dev.bdAddr;
				deviceDetails.state = 0;
				deviceDetails.uuid = "";
				btDeviceDetails.push(btDetails);
				onBtStateChanged(btDetails);
			}
			break;

		case 2:
			if (result.keyValue == true)
			{
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BT_REQUEST_OK, {
					target : this,
					handle : hdl
				});
				return hdl;
			}
			else
			{
				btDetails.statusType = this.ADAPTER_STATE_CHANGED;
				btDetails.btErrorCode = this.BT_STATUS_SUCCESS; // Adapter Off state
				deviceDetails.bdName = cur_dev.bdName;
				deviceDetails.bdAddr = cur_dev.bdAddr;
				deviceDetails.state = 0;
				deviceDetails.uuid = "";
				btDeviceDetails.push(btDetails);
				onBtStateChanged(btDetails);
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BT_REQUEST_FAILED, {
					target : this,
					handle : hdl,
					error : {
						domain : "com.opentv.bluetooth",
						name : "BluetoothAdapterDisabled",
						message : "Bluetooth adapter is not enabled in configman."
					}
				});
				return hdl;
			}
			break;
		case 3:
			btDetailsforsspRequest.bdName = cur_dev.bdName;
			btDetailsforsspRequest.bdAddr = parameters.accept;
			btDetailsforsspRequest.sspVariant = 0;
			btDetailsforsspRequest.passKey = 1234;
			onSspRequest(btDetailsforsspRequest);
			break;

		}// end switch

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BT_REQUEST_OK, {
			target : this,
			handle : hdl
		});
		return hdl;

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BT_REQUEST_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "DeviceDiscoveryIncomplete",
				message : "Device discovery should precede creating a bond with the device."
			}
		});
		return hdl;

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_BT_REQUEST_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "BluetoothAdapterDisabled",
				message : "Bluetooth adapter is not enabled in configman."
			}
		});
		return hdl;

	};

	/**
	 * @method listBondedDevices
	 * @param {Object}
	 *            bondedList
	 * @return {Object} bondedList List of bonded devices
	 */
	this.listBondedDevices = function()
	{
		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);
		var hdl = CCOM.stubs.getHandle();

		console.log(JSON.stringify(btDeviceDetails));
		if (result.keyValue == true)
		{
			if (btDeviceDetails.length == 0)
			{
				return bondedListforfailed;
			}
			else if (btDeviceDetails.length > 0)
			{
				for (var i = 0; i < btDeviceDetails.length; i++)
				{
					for (var j = 0; j < bondedList.length; j++)
					{
						if (btDeviceDetails.length <= 1)
						{
							if (btDeviceDetails[i].deviceDetails.bdName == "GTP3100")
							{
								bondedList[j].bdName = btDeviceDetails[i].deviceDetails.bdName;
								bondedList[j].bdAddr = btDeviceDetails[i].deviceDetails.bdAddr;
								bondedList[j].deviceType = 1;
							}
							else
							{
								bondedList[j].bdName = btDeviceDetails[i].deviceDetails.bdName;
								bondedList[j].bdAddr = btDeviceDetails[i].deviceDetails.bdAddr;
								bondedList[j].deviceType = 2;
							}
							btDeviceDetails.push(bondedListforlistok);
							console.log(JSON.stringify(btDeviceDetails));
							return bondedListforlistok;
						}
						else
						{
							if (btDeviceDetails[i].deviceDetails.bdName == "GTP3100")
							{
								bondedList[j].bdName = btDeviceDetails[i].deviceDetails.bdName;
								bondedList[j].bdAddr = btDeviceDetails[i].deviceDetails.bdAddr;
								bondedList[j].deviceType = 1;
							}
							else
							{
								bondedList[j].bdName = btDeviceDetails[i].deviceDetails.bdName;
								bondedList[j].bdAddr = btDeviceDetails[i].deviceDetails.bdAddr;
								bondedList[j].deviceType = 2;
							}
							btDeviceDetails.push(bondedListforlistok);
							console.log(JSON.stringify(btDeviceDetails));
							return bondedListforlistok;
						}
					}
				}
			}
			else
			{

				listBondedDevicesFailed(bondedListforfailed);

			}
			return false;
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LIST_BONDED_DEVICES_OK, {
				target : this,
				handle : hdl,
				bondedList : btDeviceDetails[2]
			});
			return hdl;
		}
		else
		{
			btDetailsforbond.statusType = this.ADAPTER_STATE_CHANGED;
			btDetailsforbond.btErrorCode = this.BT_STATUS_SUCCESS;
			deviceDetails.bdName = cur_dev.bdName;
			deviceDetails.bdAddr = cur_dev.bdAddr;
			deviceDetails.state = 0;
			deviceDetails.uuid = "";
			btDeviceDetails.push(btDetailsforbond);
			onBtStateChanged(btDetailsforbond);
			return bondedListforfailedAdapter;
			listBondedDevicesFailed(bondedListforfailedAdapter);
		}

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LIST_BONDED_DEVICES_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "RequestInProgress",
				message : "New request made after retrieve-bonded-devices is in progress."
			}
		});
		return hdl;
	};

	/**
	 * @method queryDeviceServices
	 * @param {String}
	 *            bdAddr Device address of the bluetooth device
	 * @return {Object} serviceList List of services supported by the requested bluetooth device
	 */
	this.queryDeviceServices = function(bdAddr)
	{
		var hdl = CCOM.stubs.getHandle();
		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);
		var btServiceRecord = {};
		var serviceList = [ {

		} ];

		btServiceRecord.serviceList = serviceList;
		if (bdAddr == bdAddr)
		{

			if (result.keyValue == true)
			{
				if (btDeviceDetails.length == 0)
				{
					return btServiceRecordforfailed;
				}
				else if (btDeviceDetails.length > 0)
				{
					for (var i = 0; i < btDeviceDetails.length; i++)
					{
						for (var j = 0; j < serviceList.length; j++)
						{
							if (bdAddr == "ff:ff:ff:ff:ff:ff")
							{
								btServiceRecord.bdAddr = btDeviceDetails[i].deviceDetails.bdAddr;
								serviceList[j].uuid = "180d";
								serviceList[j].instanceId = "";
								serviceList[j].isPrimary = "";
								serviceList[j].serviceId = "";
							}
							else
							{
								btServiceRecord.bdAddr = btDeviceDetails[i].deviceDetails.bdAddr;
								serviceList[j].uuid = "1800";
								serviceList[j].instanceId = 0;
								serviceList[j].isPrimary = true;
								serviceList[j].serviceId = "{1800,0,1}";
							}
							btDeviceDetails.push(btServiceRecord);
							console.log(JSON.stringify(btDeviceDetails));
							// queryDeviceServicesOK(btServiceRecord);
							// return btServiceRecord;
							CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_QUERY_DEVICE_SERVICES_OK, {
								target : this,
								handle : hdl,
								bdAddr : bdAddr,
								serviceList : btServiceRecord.serviceList
							});
							return hdl;
						}
					}
				}
				else
				{

					queryDeviceServicesFailed(btServiceRecordforfailed);

				}

			}
			else
			{
				btDetailsforbond.statusType = this.ADAPTER_STATE_CHANGED;
				btDetailsforbond.btErrorCode = this.BT_STATUS_SUCCESS;
				deviceDetails.bdName = cur_dev.bdName;
				deviceDetails.bdAddr = cur_dev.bdAddr;
				deviceDetails.state = 0;
				deviceDetails.uuid = "";
				btDeviceDetails.push(btDetailsforbond);
				onBtStateChanged(btDetailsforbond);
				queryDeviceServicesFailed(bondedListforfailedAdapter);
				// return bondedListforfailedAdapter;
				// queryDevicesFailed(bondedListforfailedAdapter);
			}

		}

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_QUERY_DEVICE_SERVICES_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "InvalidAddress",
				message : "Invalid parameter. bdAddr is NULL."
			}
		});
		return hdl;

	};

	/**
	 * @method registerLeDevice
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * 
	 */
	this.registerLeDevice = function(bdAddr)
	{
		var hdl = CCOM.stubs.getHandle();
		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);

		if (result.keyValue == true)
		{
			if (bdAddr == bdAddr)
			{
				unregisterFlag = false;
				// registerLeDeviceOK(bdAddr);
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REGISTER_LE_DEVICE_OK, {
					target : this,
					handle : hdl
				});
				return hdl;
			}
			else
			{
				unregisterFlag = true;
				registerLeDeviceFailed(registerLeDeviceFailederror);
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REGISTER_LE_DEVICE_FAILED, {
					target : this,
					handle : hdl,
					error : {
						domain : "com.opentv.bluetooth",
						name : "InvalidAddress",
						message : "Invalid parameter. bdAddr is NULL."
					}
				});
				return hdl;
			}
		}
		else
		{
			btDetailsforbond.statusType = this.ADAPTER_STATE_CHANGED;
			btDetailsforbond.btErrorCode = this.BT_STATUS_SUCCESS;
			deviceDetails.bdName = cur_dev.bdName;
			deviceDetails.bdAddr = cur_dev.bdAddr;
			deviceDetails.state = 0;
			deviceDetails.uuid = "";
			btDeviceDetails.push(btDetailsforbond);
			onBtStateChanged(btDetailsforbond);
			// return bondedListforfailedAdapter;

		}
		// registerLeDeviceFailed(bondedListforfailedAdapter);
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REGISTER_LE_DEVICE_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "BluetoothAdapterDisabled",
				message : "Bluetooth adapter is not enabled in configman."
			}
		});
		return hdl;

	};

	/**
	 * @method unregisterLeDevice
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * 
	 */

	this.unregisterLeDevice = function(bdAddr)
	{
		var hdl = CCOM.stubs.getHandle();
		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);

		if (result.keyValue == true)
		{
			if (bdAddr == bdAddr)
			{
				unregisterFlag = true;
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UNREGISTER_LE_DEVICE_OK, {
					target : this,
					handle : hdl
				});
				return hdl;
			}
			else
			{
				unregisterFlag = false;
				unregisterLeDeviceFailed(registerLeDeviceFailederror);
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REGISTER_LE_DEVICE_FAILED, {
					target : this,
					handle : hdl,
					error : {
						domain : "com.opentv.bluetooth",
						name : "InvalidAddress",
						message : "Invalid parameter. bdAddr is NULL."
					}
				});
				return hdl;
			}
		}
		else
		{
			btDetailsforbond.statusType = this.ADAPTER_STATE_CHANGED;
			btDetailsforbond.btErrorCode = this.BT_STATUS_SUCCESS;
			deviceDetails.bdName = cur_dev.bdName;
			deviceDetails.bdAddr = cur_dev.bdAddr;
			deviceDetails.state = 0;
			deviceDetails.uuid = "";
			btDeviceDetails.push(btDetailsforbond);
			onBtStateChanged(btDetailsforbond);

		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UNREGISTER_LE_DEVICE_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "BluetoothAdapterDisabled",
				message : "Bluetooth adapter is not enabled in configman."
			}
		});
		return hdl;
	};

	/**
	 * @method listCharacteristics
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * @return {Object} characteristicList List of characteristics of a service belonging to a bluetooth device
	 */
	this.listCharacteristics = function(bdAddr, serviceId)
	{
		var hdl = CCOM.stubs.getHandle();
		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);
		var btCharacteristicRecord = new Object();
		var characteristicList = [ {

		} ];

		btCharacteristicRecord.characteristicList = characteristicList;
		if (bdAddr == cur_dev.bdAddr && serviceId == "{1800,0,1}")
		{
			if (result.keyValue == true)
			{

				if (btDeviceDetails.length == 0)
				{
					return btServiceRecordforfailed;
				}
				if (btDeviceDetails.length > 0)
				{
					for (var i = 0; i < btDeviceDetails.length; i++)
					{
						for (var j = 0; j < characteristicList.length; j++)
						{
							characteristicList[j].uuid = "2a00";
							characteristicList[j].instanceId = 1;
							characteristicList[j].characteristicId = "{2a00,1}";
							characteristicList[j].properties = 10;
							btDeviceDetails.push(btCharacteristicRecord);
							console.log(JSON.stringify(btDeviceDetails));
							// listCharacteristicsOK(btCharacteristicRecord);
							CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LIST_CHARACTERISTICS_OK, {
								target : this,
								handle : hdl,
								characteristicList : characteristicList
							});
							return hdl;
						}
					}
				}

			}
			else
			{
				btDetailsforbond.statusType = this.ADAPTER_STATE_CHANGED;
				btDetailsforbond.btErrorCode = this.BT_STATUS_SUCCESS;
				deviceDetails.bdName = cur_dev.bdName;
				deviceDetails.bdAddr = cur_dev.bdAddr;
				deviceDetails.state = 0;
				deviceDetails.uuid = "";
				btDeviceDetails.push(btDetailsforbond);
				onBtStateChanged(btDetailsforbond);
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LIST_CHARACTERISTICS_FAILED, {
					target : this,
					handle : hdl,
					error : {
						domain : "com.opentv.bluetooth",
						name : "BluetoothAdapterDisabled",
						message : "Bluetooth adapter is not enabled in configman."
					}
				});
				return hdl;

			}
		}
		else
		{

			// listCharacteristicsFailed(btServiceRecordforfailed);
			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LIST_CHARACTERISTICS_FAILED, {
				target : this,
				handle : hdl,
				error : {
					domain : "com.opentv.bluetooth",
					name : "InvalidAddress",
					message : "Invalid parameter. bdAddr is NULL."
				}
			});
			return hdl;
		}

	};

	/**
	 * @method readCharacteristic
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * 
	 * @param {String}
	 *            characteristicId Characteristic id of the requested characteristic
	 * 
	 * @param {String}
	 *            value Value of the characteristic requested
	 * @return {Number} valueType Type of the characteristic
	 * 
	 */
	this.readCharacteristic = function(bdAddr, serviceId, characteristicId)
	{
		var hdl = CCOM.stubs.getHandle();
		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);
		var readValue = {

		/* value: "BoomBand" */
		};

		if (bdAddr == cur_dev.bdAddr && serviceId == cur_dev.serviceList[cur_service].serviceId && characteristicId == characteristicId)
		{
			if (result.keyValue == true)
			{
				// if(registerFlag && unregisterFlag){
				if (!unregisterFlag)
				{

					if (btDeviceDetails.length == 0)
					{
						return btServiceRecordforfailed;
					}
					if (btDeviceDetails.length > 0)
					{
						for (var i = 0; i < btDeviceDetails.length; i++)
						{
							readValue.value = "426f6f6d42616e64";
							btDeviceDetails.push(readValue);
							// console.log(JSON.stringify(readValue);
							CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_READ_CHARACTERISTIC_OK, {
								target : this,
								handle : hdl,
								value : readValue.value
							});
							return hdl;

						}
					}
					// }
				}
				else
				{
					CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_READ_CHARACTERISTIC_FAILED, {
						target : this,
						handle : hdl,
						error : {
							domain : "com.opentv.bluetooth",
							name : "UnregisteredDevice",
							message : "Bluetooth low-energy device is not registered."
						}
					});
					return hdl;

				}
			}
			else
			{
				btDetailsforbond.statusType = this.ADAPTER_STATE_CHANGED;
				btDetailsforbond.btErrorCode = this.BT_STATUS_SUCCESS;
				deviceDetails.bdName = cur_dev.bdName;
				deviceDetails.bdAddr = cur_dev.bdAddr;
				deviceDetails.state = 0;
				deviceDetails.uuid = "";
				btDeviceDetails.push(btDetailsforbond);
				onBtStateChanged(btDetailsforbond);

			}

			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_READ_CHARACTERISTIC_FAILED, {
				target : this,
				handle : hdl,
				error : {
					domain : "com.opentv.bluetooth",
					name : "BluetoothAdapterDisabled",
					message : "Bluetooth adapter is not enabled in configman."
				}
			});
			return hdl;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_READ_CHARACTERISTIC_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "InvalidAddress",
				message : "Invalid parameter. bdAddr is NULL."
			}
		});
		return hdl;
	};

	/**
	 * @method writeCharacteristic
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * 
	 * @param {String}
	 *            characteristicId Characteristic id of the requested characteristic
	 * 
	 * @param {String}
	 *            value Value of the characteristic requested
	 * @param {Number}
	 *            valueType Type of the characteristic
	 * 
	 */
	this.writeCharacteristic = function(bdAddr, serviceId, characteristicId, value, writeType)
	{
		var hdl = CCOM.stubs.getHandle();
		var btStatePath = "/system/opentv/bluetooth/adapterState";
		var result = CCOM.ConfigManager.getValue(btStatePath);

		if (bdAddr == cur_dev.bdAddr && serviceId == cur_dev.serviceList[cur_service].serviceId && characteristicId == characteristicId
				&& value == value && writeType == writeType)
		{
			if (result.keyValue == true)
			{
				if (!unregisterFlag)
				{

					CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_WRITE_CHARACTERISTIC_OK, {
						target : this,
						handle : hdl
					});
					return hdl;

				}
				else
				{
					CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_WRITE_CHARACTERISTIC_FAILED, {
						target : this,
						handle : hdl,
						error : {
							domain : "com.opentv.bluetooth",
							name : "UnregisteredDevice",
							message : "Bluetooth low-energy device is not registered."
						}
					});
					return hdl;

				}

			}
			else
			{
				btDetailsforbond.statusType = this.ADAPTER_STATE_CHANGED;
				btDetailsforbond.btErrorCode = this.BT_STATUS_SUCCESS;
				deviceDetails.bdName = cur_dev.bdName;
				deviceDetails.bdAddr = cur_dev.bdAddr;
				deviceDetails.state = 0;
				deviceDetails.uuid = "";
				btDeviceDetails.push(btDetailsforbond);
				onBtStateChanged(btDetailsforbond);

			}

			CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_WRITE_CHARACTERISTIC_FAILED, {
				target : this,
				handle : hdl,
				error : {
					domain : "com.opentv.bluetooth",
					name : "BluetoothAdapterDisabled",
					message : "Bluetooth adapter is not enabled in configman."
				}
			});
			return hdl;
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_WRITE_CHARACTERISTIC_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.bluetooth",
				name : "InvalidAddress",
				message : "Invalid parameter. bdAddr is NULL."
			}
		});
		return hdl;

	};

	/**
	 * @method registerNotifyCharacteristic
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * @param {String}
	 *            characteristicId Characteristic id of the requested characteristic
	 */
	this.registerNotifyCharacteristic = function(bdAddr, serviceId, characteristicId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method unregisterNotifyCharacteristic
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * @param {String}
	 *            characteristicId Characteristic id of the requested characteristic
	 */
	this.unregisterNotifyCharacteristic = function(bdAddr, serviceId, characteristicId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method listDescriptors
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * 
	 * @param {String}
	 *            characteristicId Characteristic id of the requested characteristic
	 * 
	 * @return {Object} descriptorList List of descriptors of the requested characteristic belonging to a bluetooth device
	 */
	this.listDescriptors = function(bdAddr, serviceId, characteristicId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method readDescriptor
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * 
	 * @param {String}
	 *            characteristicId Characteristic id of the requested characteristic
	 * 
	 * @param {String}
	 *            descriptorId Descriptor id of the requested descriptor
	 * 
	 * @param {String}
	 *            value Value of the requested descriptor
	 * 
	 * @return {Number} valueType Type of the descriptor
	 * 
	 */
	this.readDescriptor = function(bdAddr, serviceId, characteristicId, descriptorId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method writeDescriptor
	 * @param {String}
	 *            bdAddr Device address of the bluetooth low energy device
	 * @param {String}
	 *            serviceId Service id of supported service of a bluetooth device
	 * 
	 * @param {String}
	 *            characteristicId Characteristic id of the requested characteristic
	 * 
	 * @param {String}
	 *            descriptorId Descriptor id of the requested descriptor
	 * 
	 * @param {String}
	 *            value New Value of the requested descriptor
	 * 
	 * @param {Number}
	 *            valueType Type of the descriptor
	 * 
	 */
	this.writeDescriptor = function(bdAddr, serviceId, characteristicId, descriptorId, value, writeType)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.listConnectedDevices = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};
	this.discoverWithServices = function(action)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getRcuState = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getRcuConflicts = function()
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Bluetooth",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	/**
	 * @method addEventListener
	 * @param {String}
	 *            eventName The name of the event to listen for
	 * @param {Function}
	 *            eventHandler The event handler function to be called when an event occurs
	 * @return {Object} An empty object indicates success; otherwise failure.
	 */
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
})();
