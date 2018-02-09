# -*- coding: UTF-8 -*-
'''
Kunwang, created on October 26th, 2017
2017-11-01:
    Added the source file 'Home_Focused_35_35.jpg'
    Added the source file 'Library_Focused_379_35.jpg'
    Added the source file 'OnDemand_focused_538_35.jpg'
    Added the source file self.img_sets["Main_STORE_Focused"]
    Added the source file self.img_sets["Main_APPS_Focused"]
    Added the source file self.img_sets["Main_SEARCH_Focused"] = "Search_Focused_1042_30.jpg"
    Added the source file self.img_sets["Main_OPTION_Focused"] = "Option_Focused_1130_30.jpg"
2017-11-06, Kunwang:
    Added the source file self.img_sets["Home_Appearance_Entered"] = "HomeAppearance_WhenEntered_39_27.jpg"
    Added region self.ocr_sets["HOME_focused_firstcategory_region"]
    Added region self.ocr_sets["HOME_focused_secondcategory_region"]
2017-11-07, Kunwang:
    Added source files:    
        self.img_sets["Home_PlayIcon_A"] = "Home_PlayIconA_192_232.jpg"
        self.img_sets["Home_PlayIcon_B"] = "Home_PlayIconB_189_264.jpg"
        self.img_sets["Home_PlayIcon_C"] = "Home_PlayIconC_169_236.jpg"
        self.img_sets["Home_PlayIcon_D"] = "Home_PlayIconD_188_212.jpg"
        self.img_sets["Home_PlayIcon_E"] = "Home_PlayIconE_221_232.jpg"
    Added region:
        self.ocr_sets["HOME_focused_event_title_inside_rectangle"] = (57, 289, 57 + 281, 289 + 33)
        self.ocr_sets["HOME_focused_event_title_outside_rectangle"] = (59, 356, 59 + 275, 356 + 39)
2017-11-07, Yangyang
    Added functions:
    power_off()
    power_off()
        
'''

import re
class FOXTEL_ROOT(object):
    #Subclass should implement this method to specify the initiating conditions
    def __init__(self, theFramework):
        self.framework = theFramework
        self.source_folder = r'stbModel\Foxtel\Foxtel_7268\Resources'
        
        self.ocr_sets = {}
        self.ocr_sets["HOME_focused_region"] = (35, 35, 35 + 113, 35 + 48)
        self.ocr_sets["HOME_focused_firstcategory_region"] = (60, 110, 60 + 200, 110 + 46)
        self.ocr_sets["HOME_focused_secondcategory_region"] = (55, 385, 55 + 206, 385 + 39)
        self.ocr_sets["HOME_focused_event_title_inside_rectangle"] = (57, 289, 57 + 281, 289 + 33)
        self.ocr_sets["HOME_focused_event_title_outside_rectangle"] = (59, 356, 59 + 275, 356 + 39)

        self.img_sets = {}
        self.img_sets["Main_TVGuide_Focused"] = "TVGuide_Focused_180_34.jpg"
        self.img_sets["Main_Home_Focused"] = "Home_Focused_35_35.jpg"
        self.img_sets["Main_Library_Focused"] = "Library_Focused_379_35.jpg"
        self.img_sets["Main_OnDemand_Focused"] = "OnDemand_focused_538_35.jpg"
        self.img_sets["Main_STORE_Focused"] = "Store_Focused_789_35.jpg"
        self.img_sets["Main_APPS_Focused"] = "Apps_Focused_922_35.jpg"
        self.img_sets["Main_SEARCH_Focused"] = "Search_Focused_1042_30.jpg"
        self.img_sets["Main_OPTION_Focused"] = "Option_Focused_1130_30.jpg"
        self.img_sets["Home_Appearance_Entered"] = "HomeAppearance_WhenEntered_39_27.jpg"
        self.img_sets["Home_PlayIcon_A"] = "Home_PlayIconA_192_232.jpg"
        self.img_sets["Home_PlayIcon_B"] = "Home_PlayIconB_189_264.jpg"
        self.img_sets["Home_PlayIcon_C"] = "Home_PlayIconC_169_236.jpg"
        self.img_sets["Home_PlayIcon_D"] = "Home_PlayIconD_188_212.jpg"
        self.img_sets["Home_PlayIcon_E"] = "Home_PlayIconE_221_232.jpg"


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
        self.framework.reportFail(strMsg)

    def capture_screen_as_image(self):
        return self.framework.capture_screen_as_image()

    def ocr_screen(self, v_img, v_region):
        return self.framework.ocr_screen(v_img, v_region)

    def compare_image(self, v_img, source_file):
        return self.framework.compare_image(self.source_folder, source_file, v_img)
        
    def power_off(self):
        return self.framework.power_off()
    
    def power_on(self): 
        return self.framework.power_on()
    
