/**
 * Stub for MediaLibrary: CCOM.MediaLibrary, a singleton introduced since v5.0.0
 * @ignore
 */
CCOM.MediaLibrary = new (function MediaLibrary ()
{
	//"use strict";
	this._TOTAL_HARD_DRIVE_SPACE = 1024;
	this._FREE_HARD_DRIVE_SPACE = 512;
	this._MY_NAME_SPACE = "CCOM.MediaLibrary";
	this._id = CCOM.stubs.uuid();
	// events in xml
	this._EVENT_ON_AUTHORIZATION = "onAuthorization";
	this._EVENT_ON_CONTENT_MODIFIED = "onContentModified";
	this._EVENT_ON_DISK_SPACE_ALERT = "onDiskSpaceAlert";
	this._EVENT_ON_MEDIA_CHANGED = "onMediaChanged";
	this._EVENT_ON_MEDIA_HANDLED = "onMediaHandled";
	this._EVENT_ON_MEDIA_SCANNED = "onMediaScanned";
	this._EVENT_ON_FILES_SCANNED = "onFilesScanned";
  	this._EVENT_ON_PARTITION_SYNC = "onPartitionSync";
	this._EVENT_ON_WHITE_LIST_CHANGED = "onWhiteListChanged";
	this._EVENT_ON_PROVISION = "onProvision";
	// events from methods
	this._EVENT_DELETE_CONTENT_OK = "deleteContentOK";
	this._EVENT_DELETE_CONTENT_FAILED = "deleteContentFailed";
	this._EVENT_GET_ASSOCIATED_MEDIA_OK = "getAssociatedMediaOK";
	this._EVENT_GET_ASSOCIATED_MEDIA_FAILED = "getAssociatedMediaFailed";
	this._EVENT_GET_STB_MODE_OK = "getStbModeOK";
	this._EVENT_GET_STB_MODE_FAILED = "getStbModeFailed";
	this._EVENT_GET_TOTAL_PARTITION_SPACE_OK = "getTotalPartitionSpaceOK";
	this._EVENT_GET_TOTAL_PARTITION_SPACE_FAILED = "getTotalPartitionSpaceFailed";
	this._EVENT_GET_FREE_PARTITION_SPACE_OK = "getFreePartitionSpaceOK";
	this._EVENT_GET_FREE_PARTITION_SPACE_FAILED = "getFreePartitionSpaceFailed";
	this._EVENT_UPDATE_ENTRY_OK = "updateEntryOK";
	this._EVENT_UPDATE_ENTRY_FAILED = "updateEntryFailed";
	this._EVENT_UPSERT_ENTRY_OK = "upsertEntryOK";
	this._EVENT_UPSERT_ENTRY_FAILED = "upsertEntryFailed";
	this._EVENT_ASSOCIATE_MEDIUM_OK = "associateMediumOK";
	this._EVENT_ASSOCIATE_MEDIUM_FAILED = "associateMediumFailed";
	this._EVENT_FORMAT_MEDIUM_FAILED="formatMediumfailed";
	this._EVENT_DISASSOCIATE_MEDIUM_OK = "disassociateMediumOK";  //otv:deprecated="5.1.2"
	this._EVENT_DISASSOCIATE_MEDIUM_FAILED = "disassociateMediumFailed"; //otv:deprecated="5.1.2"
	this._EVENT_GET_ALL_CONNECTED_MEDIA_OK = "getAllConnectedMediaOK";
	this._EVENT_GET_ALL_CONNECTED_MEDIA_FAILED = "getAllConnectedMediaFailed";
	this._EVENT_GET_ASSOCIATED_MEDIA_ID_OK = "getAssociatedMediaIdOK";
	this._EVENT_GET_ASSOCIATED_MEDIA_ID_FAILED = "getAssociatedMediaIdFailed";
	this._EVENT_LOAD_MEDIUM_OK = "loadMediumOK";
	this._EVENT_LOAD_MEDIUM_FAILED = "loadMediumFailed";
	this._EVENT_UNLOAD_MEDIUM_OK = "unloadMediumOK";
	this._EVENT_UNLOAD_MEDIUM_FAILED = "unloadMediumFailed";
	this._EVENT_AUTHORIZE_CONTENT_OK = "authorizeContentOK";
	this._EVENT_AUTHORIZE_CONTENT_FAILED = "authorizeContentFailed";
	this._EVENT_GET_AUTHORIZATION_STATUS_OK = "getAuthorizationStatusOK";
	this._EVENT_GET_AUTHORIZATION_STATUS_FAILED = "getAuthorizationStatusFailed";
	this._EVENT_GET_PROVISION_STATUS_OK = "getProvisionStatusOK";
	this._EVENT_GET_PROVISION_STATUS_FAILED = "getProvisionStatusFailed";
	this._EVENT_INITIATE_PROVISIONING_OK = "initiateProvisioningOK";
	this._EVENT_INITIATE_PROVISIONING_FAILED = "initiateProvisioningFailed";
	this._EVENT_REMOVE_MEDIUM_OK = "removeMediumOK";
	this._EVENT_REMOVE_MEDIUM_FAILED = "removeMediumFailed";
	this._EVENT_TAG_MEDIUM_OK = "tagMediumOK";
	this._EVENT_TAG_MEDIUM_FAILED = "tagMediumFailed";
	this._EVENT_UNTAG_MEDIUM_OK = "untagMediumOK";
	this._EVENT_UNTAG_MEDIUM_FAILED = "untagMediumFailed";
	this._EVENT_ABORT_LOAD_MEDIUM_OK = "abortLoadMediumOK";
	this._EVENT_ABORT_LOAD_MEDIUM_FAILED = "abortLoadMediumFailed";
	this._EVENT_LIST_FILES_OK = "listFilesOK";
	this._EVENT_LIST_FILES_FAILED = "listFilesFailed";
	this._EVENT_SCAN_FILES_OK = "scanFilesOK";
	this._EVENT_SCAN_FILES_FAILED = "scanFilesFailed";
	this._EVENT_ABORT_SCAN_FILES_OK = "abortScanFilesOK";
	this._EVENT_ABORT_SCAN_FILES_FAILED = "abortScanFilesFailed";
	this._EVENT_UNLOAD_FILES_OK = "unloadFilesOK";
	this._EVENT_UNLOAD_FILES_FAILED = "unloadFilesFailed";
	this._EVENT_CREATE_BOOKMARK_ENTRY_OK = "createBookmarkEntryOK";
	this._EVENT_CREATE_BOOKMARK_ENTRY_FAILED = "createBookmarkEntryFailed";
	this._EVENT_UPDATE_BOOKMARK_ENTRY_OK = "updateBookmarkEntryOK";
	this._EVENT_UPDATE_BOOKMARK_ENTRYF_AILED = "updateBookmarkEntryFailed";
	this._EVENT_DELETE_BOOKMARK_ENTRY_OK = "deleteBookmarkEntryOK";
	this._EVENT_DELETE_BOOKMARK_ENTRY_FAILED = "deleteBookmarkEntryFailed";
	this._EVENT_GET_BOOKMARK_ENTRIES_OK = "getBookmarkEntriesOK";
	this._EVENT_GET_BOOKMARK_ENTRIES_FAILED = "getBookmarkEntriesFailed";
	this._EVENT_GET_ACTUAL_DURATION_OK = "getActualDurationOK";
	this._EVENT_GET_ACTUAL_DURATION_FAILED = "getActualDurationFailed";
	this._EVENT_GET_ALBUM_ART_OK = "getAlbumArtOK";
	this._EVENT_GET_ALBUM_ART_FAILED = "getAlbumArtFailed";
	this._EVENT_ABORT_LOAD_MEDIUM_FAILED="abortLoadMediumFailed";
	this._EVENT_SBORT_SCAN_FILES_FAILED="abortScanFilesFailed";
    this._EVENT_UNLOAD_FILES_FAILED="unloadFilesFailed";
    this._EVENT_UPDATE_BOOKMARK_ENTRY_FAILED="updateBookmarkEntryFailed ";
    this._EVENT_DELETEBOOKMARKENTRY_FAILED="deleteBookmarkEntryFailed";
    this._EVENT_GET_BOOKMARK_ENTRIES_FAILED="getBookmarkEntriesFailed";
	this._supportedEvents = [
		this._EVENT_ON_AUTHORIZATION,
		this._EVENT_ON_CONTENT_MODIFIED,
		this._EVENT_ON_DISK_SPACE_ALERT,
		this._EVENT_ON_MEDIA_CHANGED,
		this._EVENT_ON_MEDIA_HANDLED,
		this._EVENT_ON_MEDIA_SCANNED,
		this._EVENT_ON_FILES_SCANNED,
		this._EVENT_ON_WHITE_LIST_CHANGED,
		this._EVENT_ON_PROVISION,
		this._EVENT_DELETE_CONTENT_OK,
		this._EVENT_DELETE_CONTENT_FAILED,
		this._EVENT_GET_ASSOCIATED_MEDIA_OK,
		this._EVENT_GET_ASSOCIATED_MEDIA_FAILED,
		this._EVENT_GET_STB_MODE_OK,
		this._EVENT_GET_STB_MODE_FAILED,
		this._EVENT_GET_TOTAL_PARTITION_SPACE_OK,
		this._EVENT_GET_TOTAL_PARTITION_SPACE_FAILED,
		this._EVENT_GET_FREE_PARTITION_SPACE_OK,
		this._EVENT_GET_FREE_PARTITION_SPACE_FAILED,
		this._EVENT_UPDATE_ENTRY_OK,
		this._EVENT_UPDATE_ENTRY_FAILED,
		this._EVENT_UPSERT_ENTRY_OK,
		this._EVENT_UPSERT_ENTRY_FAILED,
		this._EVENT_ASSOCIATE_MEDIUM_OK,
		this._EVENT_ASSOCIATE_MEDIUM_FAILED,
		this._EVENT_DISASSOCIATE_MEDIUM_OK,  //otv:deprecated="5.1.2"
		this._EVENT_DISASSOCIATE_MEDIUM_FAILED, //otv:deprecated="5.1.2"
		this._EVENT_GET_ALL_CONNECTED_MEDIA_OK,
		this._EVENT_GET_ALL_CONNECTED_MEDIA_FAILED,
		this._EVENT_GET_ASSOCIATED_MEDIA_ID_OK,
		this._EVENT_GET_ASSOCIATED_MEDIA_ID_FAILED,
		this._EVENT_LOAD_MEDIUM_OK,
		this._EVENT_LOAD_MEDIUM_FAILED,
		this._EVENT_UNLOAD_MEDIUM_OK,
		this._EVENT_UNLOAD_MEDIUM_FAILED,
		this._EVENT_AUTHORIZE_CONTENT_OK,
		this._EVENT_AUTHORIZE_CONTENT_FAILED,
		this._EVENT_GET_AUTHORIZATION_STATUS_OK,
		this._EVENT_GET_AUTHORIZATION_STATUS_FAILED,
		this._EVENT_GET_PROVISION_STATUS_OK,
		this._EVENT_GET_PROVISION_STATUS_FAILED,
		this._EVENT_INITIATE_PROVISIONING_OK,
		this._EVENT_INITIATE_PROVISIONING_FAILED,
		this._EVENT_REMOVE_MEDIUM_OK,
		this._EVENT_REMOVE_MEDIUM_FAILED,
		this._EVENT_TAG_MEDIUM_OK,
		this._EVENT_TAG_MEDIUM_FAILED,
		this._EVENT_UNTAG_MEDIUM_OK,
		this._EVENT_UNTAG_MEDIUM_FAILED,
		this._EVENT_ABORT_LOAD_MEDIUM_OK,
		this._EVENT_ABORT_LOAD_MEDIUM_FAILED,
		this._EVENT_LIST_FILES_OK,
		this._EVENT_LIST_FILES_FAILED,
		this._EVENT_SCAN_FILES_OK,
		this._EVENT_SCAN_FILES_FAILED,
		this._EVENT_ABORT_SCAN_FILES_OK,
		this._EVENT_ABORT_SCAN_FILES_FAILED,
		this._EVENT_UNLOAD_FILES_OK,
		this._EVENT_UNLOAD_FILES_FAILED,
		this._EVENT_CREATE_BOOKMARK_ENTRY_OK,
		this._EVENT_CREATE_BOOKMARK_ENTRY_FAILED,
		this._EVENT_UPDATE_BOOKMARK_ENTRY_OK,
		this._EVENT_UPDATE_BOOKMARK_ENTRYF_AILED,
		this._EVENT_DELETE_BOOKMARK_ENTRY_OK,
		this._EVENT_DELETE_BOOKMARK_ENTRY_FAILED,
		this._EVENT_GET_BOOKMARK_ENTRIES_OK,
		this._EVENT_GET_BOOKMARK_ENTRIES_FAILED,
		this._EVENT_GET_ACTUAL_DURATION_OK,
		this._EVENT_GET_ACTUAL_DURATION_FAILED,
		this._EVENT_GET_ALBUM_ART_OK,
		this._EVENT_GET_ALBUM_ART_FAILED,
		this._EVENT_GET_ALBUM_ART_FAILED,
		this._EVENT_ABORT_LOAD_MEDIUM_FAILED,
		this._EVENT_SBORT_SCAN_FILES_FAILED,
        this._EVENT_UNLOAD_FILES_FAILED,
        this._EVENT_UPDATE_BOOKMARK_ENTRY_FAILED,
        this._EVENT_DELETEBOOKMARKENTRY_FAILED,
        this._EVENT_GET_BOOKMARK_ENTRIES_FAILED
	];
	
	/*
	 * The object exists since the beginning (v5.0.0)
	 */
	//ContentModifyType
	this.AVAILABLE                         = 2;
	this.DELETED                           = 3;
	this.UNKNOWN                           = 1;
	//DiskSpaceEventType
	this.RED_ALERT_EXCEEDED                = 1;
	//FsCode
	this.INVALID                           = 0;
	this.FAT32                             = 11;
	this.FAT32X                            = 12;
	this.FAT16_OVER_32M                    = 6;
	this.FAT16_UPTO_32M                    = 4;
	this.SFS                               = 143;
	this.NTFS                              = 7;
	//SFS
	this.ASSOCIATE                         = 1;
	this.MOUNT                             = 2;
	this.MediumCommand                     = 4;
	//MediumMode
	this.ZAPPER0                           = 1;
	this.ZAPPER1                           = 2;
	this.PVR                               = 3;
	//PartitionStatus
	//INVALID                         = 0;
	this.UNMOUNTING                        = 3;
	this.UNMOUNT_FAILED                    = 4;
	this.UNMOUNTED                         = 5;
	this.BUSY                              = 6;
	this.MOUNTED                           = 7;
	this.MOUNT_FAILED                      = 8;
	this.FORMAT_REQUIRED                   = 9;
	this.FSCK_STARTED                      = 10;
	this.FORMAT_FAILED                     = 11;
	this.NOT_IN_HOME_DOMAIN                = 12;
	//mediaScanResult //MediaSyncResult
	this.databaseFull                      = 1;
	this.diskError                         = 2;
	this.internalError                     = 3;
	this.normal                            = 0;
	//mediaScanState
	this.SCAN_STARTED                      = 1;
	this.SCAN_STOPPED                      = 2;
	this.SCAN_ONGOING                      = 3;
	this.SCAN_ABORTED                      = 4;
        //MediaSyncState
    this.SYNC_STARTED                      = 1;
	this.SYNC_DONE	                       = 2;
	this.SYNC_ONGOING                      = 3;
	this.SYNC_ABORTED                      = 4;
	//AuthorizationStatus
	this.AUTHORIZATION_SUCCESS             = 0;
	this.AUTHORIZATION_FAILURE             = 1;
	this.AUTHORIZATION_NOT_HOME_DOMAIN     = 2;
	this.AUTHORIZATION_NETWORK_ERROR       = 3;
	this.AUTHORIZATION_CONNECTION_ERROR    = 4;
	this.AUTHORIZATION_STATUS_PENDING      = 5;
	//MediumAction
	//ASSOCIATE                         = 1;
	this.DISASSOCIATE                      = 2;
	this.FORMAT                            = 3;
	//MediumReason
	this.NONE                              = 0;
	this.NOT_HOME_DOMAIN                   = 1;
	this.FAILED_TO_READ_METADATA           = 2;
	this.CANNOT_DETERMINE_HOME_DOMAIN      = 3;
	this.TOO_MANY_DRIVES                   = 4;
	this.USER_REQUESTED_REMOVAL            = 5;
	this.FORCED_REMOVAL                    = 6;
	this.DISK_SHARING_NOT_ALLOWED          = 7;
	this.MEDIUM_RECENTLY_FORMATTED         = 8;
	this.PARTITIONS_NOT_RECOGNIZED         = 9;
	this.MEDIUM_READY_AFTER_STANDBY        = 10;
	this.MEDIUM_WHITELIST_STATUS_CHANGED   = 11;
	this.NOT_SUPPORTED                     = 12;


	//ProvisionStatus
	this.PROVISION_CONNECTION_ERROR        = 4;
	this.PROVISION_FAILURE                 = 1;
	this.PROVISION_NETWORK_ERROR           = 3;
	this.PROVISION_NOT_HOME_DOMAIN         = 2;
	this.PROVISION_STATUS_PENDING          = 5;
	this.PROVISION_SUCCESS                 = 0;
	//WhiteListStatus
	this.DO_NOT_CARE                       = 0;
	this.IN_LIST                           = 1;
	this.NOT_IN_LIST                       = 2;
	//MediumEvent
	this.PLUGGED                           = 1;
	this.UNPLUGGED                         = 2;
	this.SAFESHUTDOWNCOMPLETE              = 3;
	this.MEDIUM_READY                      = 4;
	this.MEDIUM_REJECTED                   = 5;
	this.MEDIUM_WAITING_FOR_EVENT          = 6;
	this.MEDIUM_NOT_RECOGNIZED             = 7;
	this.MEDIUM_NOT_ASSOCIATED             = 8;
	// BusType
	this.BUS_TYPE_UNKNOWN                  = 0;
	this.BUS_TYPE_ATA                      = 1;
	this.BUS_TYPE_USB                      = 2;
	// MediumHandledReason
	this.NORMAL                            = 0;
	this.INVALID_PARAMETER                 = 1;
	this.MEMORY_ERROR                      = 2;
	this.DRIVE_NOT_SUPPORTED               = 3;
	this.DRIVE_BEING_REMOVED               = 4;
	this.FORMAT_ERROR                      = 5;
	// FileType
	this.SUPPORTED_IMAGE                   = 1;
	this.SUPPORTED_AUDIO                   = 2;
	this.SUPPORTED_VIDEO                   = 4;
	this.SUPPORTED_SUBTITLE                = 8;
	this.OTHER                             = 0x10;
	this.DIRECTORY                         = 0x20;
	this.ALL_TYPES                         = 0x3f;

			
	this.listFiles = function(path, fileType, infoFlag, pattern)
	{
		var hdl = CCOM.stubs.getHandle();
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LIST_FILES_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.scanFiles = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SCAN_FILES_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.createBookmarkEntry = function(medialibId, bookmarkDef)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CREATE_BOOKMARK_ENTRY_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getActualDuration = function(medialibId)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ACTUAL_DURATION_OK, {
			target : this,
			handle : hdl,
			duration : 60
		});
		return hdl;
	};

	this.getAlbumArt = function(medialibId)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ALBUM_ART_OK, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.deleteContent = function(medialibId, purgeMetaData)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_CONTENT_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getAssociatedMedia = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ASSOCIATED_MEDIA_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getStbMode = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_STB_MODE_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getTotalPartitionSpace = function(partitionName)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TOTAL_PARTITION_SPACE_OK, {
			target : this,
			handle : hdl,
			totalSpace : this._TOTAL_HARD_DRIVE_SPACE
		});
		return hdl;
	};

	this.getFreePartitionSpace = function(partitionName)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_FREE_PARTITION_SPACE_OK, {
			target : this,
			handle : hdl,
			freeSpace : this._FREE_HARD_DRIVE_SPACE
		});
		return hdl;
	};

	this.updateEntry = function(medialibId, mediaInfo)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPDATE_ENTRY_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.upsertEntry = function(medialibId, mediaInfo)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPSERT_ENTRY_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	// otv:deprecated="5.1.2"
	this.disassociateMedium = function(mediumID, force, flags)
	{
		this.logDeprecated();
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DISASSOCIATE_MEDIUM_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				message : "Warning:This API is deprecated. "
			}
		});
		return hdl;
	};
	
	this.abortLoadMedium = function(){
	 	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,this._EVENT_ABORT_LOAD_MEDIUM_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.MediaLibrary",
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
    };
       
    this.abortScanFiles = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_SBORT_SCAN_FILES_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.MediaLibrary",
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
    };

    this.unloadFiles = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UNLOAD_FILES_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.MediaLibrary",
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
    };

    this.updateBookmarkEntry = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,this._EVENT_UPDATE_BOOKMARK_ENTRY_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.MediaLibrary",
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
    };
        
   	this.deleteBookmarkEntry  = function(){
   		this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(_id, _MY_NAME_SPACE,_EVENT_DELETEBOOKMARKENTRY_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.MediaLibrary",
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
    };
            
    this.getBookmarkEntries   = function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE,this._EVENT_GET_BOOKMARK_ENTRIES_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.MediaLibrary",
				message: "Warning:This API is not implemented. "
			}
		});
		return hdl;
    };

    this.formatMedium =  function(){
    	this.logWarning("This API has not been implemented yet!");
        var hdl = CCOM.stubs.getHandle();
        CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_FORMAT_MEDIUM_FAILED, {
			target: this,
			handle: hdl,
			error: {
				domain: "com.opentv.MediaLibrary",
				message: "Warning:This API is not implemented. "
				}
		});
		this.logInfo("This API has been added in 5.2.1!.");
		return hdl;
    };
     

	this.addEventListener = function(event, callback)
	{
		if (-1 === this._supportedEvents.indexOf(event))
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};

	this.removeEventListener = function(event, callback)
	{
		if (-1 === this._supportedEvents.indexOf(event))
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};

	this.getEntryRSByQuery = function(properties, criteria, mediaType, orderBy)
	{
		return CCOM.Scheduler.getTasksRSByQuery(properties, criteria, orderBy);
	};

	this.associateMedium = function(command, mediumName)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ASSOCIATE_MEDIUM_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getAllConnectedMedia = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ALL_CONNECTED_MEDIA_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getAssociatedMediaId = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_ASSOCIATED_MEDIA_ID_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.loadMedium = function(mediumID, recursive, force)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_LOAD_MEDIUM_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.unloadMedium = function(mediumID)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UNLOAD_MEDIUM_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.authorizeContent = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_AUTHORIZE_CONTENT_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getAuthorizationStatus = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_AUTHORIZATION_STATUS_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.getProvisionStatus = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_PROVISION_STATUS_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.initiateProvisioning = function()
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_INITIATE_PROVISIONING_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.removeMedium = function(mediumID)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_REMOVE_MEDIUM_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.tagMedium = function(mediumId, tagId, value)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_TAG_MEDIUM_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};

	this.untagMedium = function(mediumId, tagId)
	{
		var hdl = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UNTAG_MEDIUM_FAILED, {
			target : this,
			handle : hdl,
			error : {
				domain : "com.opentv.MediaLibrary",
				name : "GenericError",
				message : ""
			}
		});
		return hdl;
	};
})();
