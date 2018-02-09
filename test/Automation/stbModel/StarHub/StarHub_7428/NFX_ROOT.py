# -*- coding: UTF-8 -*-
'''
Created on 2017-08-24
@auther: kunwang

2017-08-24:
    Abstract class to maintain the structure of the framework.
    Module-class can derive from this and use the virtual methods to define their functionalities
2017-08-24:
    Added self.ocr_sets to hold the ORC regions used during test.
    Added region 'Banner_CurrentChannelID_Region'
2017-10-18:
    Added the method to verify time in 24-hours format
2017-10-19:
    Added the method 'reportFail'
    Added new metod 'capture_screen_as_image'
2017-10-23:
    Added new method 'ocr_screen'
2017-10-24:
    Added new method 'compare_image' to suppor image comparision
'''

import re
class NFX_ROOT(object):
    #Subclass should implement this method to specify the initiating conditions
    def __init__(self, theFramework):
        self.frame = theFramework
        self.source_folder = r'stbModel\StarHub\StarHub_7428\Resources'
        
        self.ocr_sets = {}
        self.ocr_sets["Banner_CurrentChannelID_Region"] = (183, 786, 183 + 85, 786 + 48)
        self.ocr_sets["Banner_CurrentChannelName_Region"] = (435, 702, 435 + 212, 702 + 42)
        self.ocr_sets["Banner_CurrentEventStartTime_Region"] = (430, 740, 430 + 142, 740 + 66)
        self.ocr_sets["Banner_NextEventStartTime_Region"] = (1132, 753, 1132 + 110, 753 + 51)

        self.ocr_sets["MainMenu_OnDemand_Region"] = (740, 789, 740 + 422, 789 + 74)
        
        self.ocr_sets["GeneralSettings_Title_Region"] = (183, 210, 183 + 339, 210 + 51)
        self.ocr_sets["GeneralSettings_OptionValue_Region"] = (1020, 467, 1020 + 347, 467 + 48)
        self.ocr_sets["GeneralSettings_OptionName_Region"] = (507, 465, 507 + 452, 465 + 51)        
        self.ocr_sets["GeneralSettings_DeactiveNetflix_OptionName_Region"] = (650, 466, 650 + 187, 466 + 46)
        
        self.ocr_sets["SMARTTV_MAIN_MY_Region"] = (899, 718, 899 + 118, 718 + 72)
        self.ocr_sets["SMARTTV_MAIN_RECORDINGS_Region"] = (750, 803, 750 + 427, 803 + 66)
        self.ocr_sets["MYRECORDINGS_title_Region"] = (195, 218, 195 + 286, 218 + 44)
        self.ocr_sets["RECORDINGSCHEDULES_title_Region"] = (195, 215, 195 + 406, 215 + 43)
        self.ocr_sets["RECORDINGSCHEDULES_ScheduleItemCHID_Region"] = (1012, 628, 1012 + 114, 628 + 46)

        self.img_sets = {}
        self.img_sets["RECORDINGSCHEDULES_OngoingIcon"] = "RECORDINGSCHEDULES_OngoingIcon_951_543.jpg"

        #options provided under [General Settings], starts from 'Display Date/Time', using [Up] key.
        #Cannot support 'Deactivate Netflix', due to OCR issue. Use 'Deactivate Netﬂix' instead
        self.generalSettings_Options = ["Display Date/Time", u"Deactivate Netﬂix", "Enable Power Saving Mode", 
                "Enable Picture-In-Guide", "User Login Upon Boot Up",
                "Background", "Resolution", "Dolby Digital", "Auto Load Ch Apps", 
                "Time Format", "Preferred Subtitles", 
                "Preferred Audio", "Preferred Language", "Guide Style", "Info Bar Duration"]

    #What will happend when keys pressed?
    def pressKey(self, strKey, delay = 0, capScreen = True):
        raise Exception("Method pressKeys() NOT implemented!")

    #What to do when user need to wait for some seconds?
    def wait(self, seconds, capScreen = True):
        raise Exception("Method wait() NOT implemented!")
    
    #How to log the trace for this STB?
    def personalTrace(self, logcontent, log_type = "Debug"):
        raise Exception("Method personalTrace() NOT implemented!")

    #Post-condition:
    #   Return True, if pStr feeds 24-hour format
    #   Return False, if otherwise
    def isTime_24Hr_Format(self, pStr):
        retVal = False
        
        result = re.match( r'[012][0-9]:[012345][0-9]', pStr, re.I)
        if result:
            retVal = True
        else:
            #in-case ':' is OCR'ed to be '2'
            result = re.match( r'[012][0-9]2[012345][0-9]', pStr, re.I)
            if result:
                retVal = True
        return retVal

    def reportFail(self, strMsg):
        self.frame.reportFail(strMsg)

    def capture_screen_as_image(self):
        return self.frame.capture_screen_as_image()

    def ocr_screen(self, v_img, v_region):
        return self.frame.ocr_screen(v_img, v_region)

    def compare_image(self, v_img, source_file):
        return self.frame.compare_image(self.source_folder, source_file, v_img)
        
    
        
