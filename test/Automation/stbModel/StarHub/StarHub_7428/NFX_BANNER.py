'''
Kunwang, created on 2017-08-30
2017-08-30:
    Added the call to base init method.
2017-10-16:
    Added the method to get end time of current even on Banner
    Abstracted the method to verify time in 24-hours fomat to supper class
'''
import re
from stbModel.StarHub.StarHub_7428.NFX_ROOT import NFX_ROOT

class NFX_BANNER(NFX_ROOT):
    def __init__(self, frame):
        super(NFX_BANNER, self).__init__(frame)
        return

    #Pre-condition:
    #   STB is in LIVE-TV
    #Post-condition:
    #   OCR & return the start-time of current-event.
    #   STB is in LIVE-TV
    def banner_getCurrentEventStartTime(self):
        self.personalTrace("NFX_BANNER.banner_getCurrentEventStartTime() enter.")
        strRet = ""

        #launch banner and do the OCR
        region_EventStartTime = self.ocr_sets["Banner_CurrentEventStartTime_Region"]
        self.pressKey("Info", capScreen = False)
        strRet = self.frame.ocr_currentScreen(region_EventStartTime)    

        if(len(strRet) == 0):
            self.frame.reportFail("Not proper data for REX compare!")
        if self.isTime_24Hr_Format(strRet) == False:
            self.frame.reportFail("ORC result is not a time value in 24HH format!")

        self.navigateToLIVE()
        self.personalTrace("NFX_BANNER.banner_getCurrentEventStartTime() exit.")
        return strRet

    #Pre-condition:
    #   STB is in LIVE-TV
    #Post-condition:
    #   OCR & return the end-time of current-event.
    #   STB is in LIVE-TV
    def banner_getCurrentEventEndTime(self):
        self.personalTrace("NFX_BANNER.banner_getCurrentEventEndTime() enter.")
        strRet = ""

        #launch banner and do the OCR
        region_EventEndTime = self.ocr_sets["Banner_NextEventStartTime_Region"]
        self.pressKey("Info", capScreen = False)
        strRet = self.frame.ocr_currentScreen(region_EventEndTime)    

        if(len(strRet) == 0):
            self.frame.reportFail("Not proper data for REX compare!")
        if self.isTime_24Hr_Format(strRet) == False:
            self.frame.reportFail("ORC result is not a time value in 24HH format!")

        self.navigateToLIVE()
        self.personalTrace("NFX_BANNER.banner_getCurrentEventEndTime() exit.")
        return strRet
    
    
