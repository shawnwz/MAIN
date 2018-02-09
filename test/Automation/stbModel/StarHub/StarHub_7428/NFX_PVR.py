# -*- coding: UTF-8 -*-
'''
Kunwang, created on October 19th, 2017
2017-10-20:
    Added method launch_SMARTTV_MyRecordings
2017-10-23:
    Abstracted method PVR_IsMyRecordingLaunched
2017-10-24:
    Added new method 'PVR_RecordingSchedules_IsFocusedOngoing'
'''
from stbModel.StarHub.StarHub_7428.NFX_ROOT import NFX_ROOT


class NFX_PVR(NFX_ROOT):
    def __init__(self, frame):
        super(NFX_PVR, self).__init__(frame)
        return


    def launch_SMARTTV_Menu(self):
        '''
        Pre-condition:
            STB is in LIVE
        Post-condition:
            Smart-TV menu is launched
        '''
        self.pressKey("Smarttv", capScreen = True)

        region_SMARTTV_MY = self.ocr_sets["SMARTTV_MAIN_MY_Region"]
        region_SMARTTV_RECORDINGS = self.ocr_sets["SMARTTV_MAIN_RECORDINGS_Region"]

        v_img = self.capture_screen_as_image()
        v_str = self.frame.ocr_screen(v_img, region_SMARTTV_MY)
        if v_str != "MY":
            #try again
            v_str = self.frame.ocr_screen(v_img, region_SMARTTV_MY)
            if v_str != "MY":
                self.reportFail("Not see option of 'MY RECORDINGS'")

        v_str = self.frame.ocr_screen(v_img, region_SMARTTV_RECORDINGS)
        if v_str != "RECORDINGS":
            #try again
            v_str = self.frame.ocr_screen(v_img, region_SMARTTV_RECORDINGS)
            if v_str != "MY":
                self.reportFail("Not see option of 'MY RECORDINGS'")
        return
    
    def launch_SMARTTV_MyRecordings(self):
        '''
        Pre-condition:
            STB is in LIVE
        Post-condition:
            [My Recordings] is launched
        '''
        self.launch_SMARTTV_Menu()
        self.pressKey("Ok", delay = 6, capScreen = True)

        if self.PVR_IsMyRecordingLaunched() == False:
            self.reportFail("Failed to launch [MY RECORDINGS]!")
        return
    
    
    def launch_SMARTTV_RecordingSchedules(self):
        '''
        Pre-condition:
            STB is in LIVE
        Post-condition:
            [Recording Schedules] is launched
        '''
        self.launch_SMARTTV_Menu()
        self.pressKey("Right", delay = 2, capScreen = True)
        self.pressKey("Ok", delay = 10, capScreen = True)

        if self.PVR_IsRecordingSchedulesLaunched() == False:
            self.reportFail("Failed to launch [RECORDING SCHEDULES]!")
        return


    #************************************************************************************************
    def PVR_IsMyRecordingLaunched(self):
        '''
        Pre-condition:
            STB is under [My Recordings] page
        Post-condition:
            Return True, if verification passed; Return False if otherwise.
        '''
        isLaunched = False
        region_MYRECORDINGS_launched = self.ocr_sets["MYRECORDINGS_title_Region"]

        v_img = self.capture_screen_as_image()
        v_str = self.ocr_screen(v_img, region_MYRECORDINGS_launched)
        if v_str == "MY RECORDINGS":
            isLaunched = True
        else:
            #try again
            v_str = self.frame.ocr_screen(v_img, region_MYRECORDINGS_launched)
            if v_str == "MY RECORDINGS":
                isLaunched = False
            else:
                isLaunched = False
        return isLaunched
    
    def PVR_IsRecordingSchedulesLaunched(self):
        '''
        Pre-condition:
            STB is under [Recording Schedules] page
        Post-condition:
            Return True, if verification passed; Return False if otherwise.
        '''
        isLaunched = False
        region_RECORDINGSCHEDULES_launched = self.ocr_sets["RECORDINGSCHEDULES_title_Region"]
        expected_text = "RECORDING SCHEDULES"
        
        v_img = self.capture_screen_as_image()
        v_str = self.ocr_screen(v_img, region_RECORDINGSCHEDULES_launched)
        if v_str == expected_text:
            isLaunched = True
        else:
            #try again
            v_str = self.frame.ocr_screen(v_img, region_RECORDINGSCHEDULES_launched)
            if v_str == expected_text:
                isLaunched = False
            else:
                isLaunched = False
        return isLaunched
    
    def PVR_RecordingSchedules_HasScheduleItem(self):
        '''
        Pre-condition:
            STB is under LIVE
        Post-condition:
            Return True, if find schedule item under [Recording Schedules];
            Return False if otherwise.
        '''
        self.launch_SMARTTV_RecordingSchedules()
        self.pressKey("Down", delay = 2, capScreen = True)
        return self.PVR_RecordingSchedules_HasNextScheduleItem()
    
    def PVR_RecordingSchedules_HasNextScheduleItem(self):
        '''
        Pre-condition:
            STB is under [Recording Schedules] page
            Focused on 'Go to My Recordings' or some other reservation item, not on '+New Recording'
        Post-condition:
            Return True, if there is still one more schdule-item below currently focused item;
            Return False if otherwise.
        '''
        hasNext = False
        region_NextItemCHID = self.ocr_sets["RECORDINGSCHEDULES_ScheduleItemCHID_Region"]
        
        v_img = self.capture_screen_as_image()
        v_str = self.ocr_screen(v_img, region_NextItemCHID)
        if v_str.startswith("Ch"):
            hasNext = True
        return hasNext

    
    def PVR_RecordingSchedules_IsFocusedOngoing(self):
        '''
        Pre-condition:
            STB is under [Recording Schedules] page
        Post-condition:
            Return True, if the focused schedule-item is an ongoing recording;
            Return False if otherwise.
        '''
        retVal = False
        bar = 60
        region_OngoingIcon = self.img_sets["RECORDINGSCHEDULES_OngoingIcon"]
        
        v_img = self.capture_screen_as_image()
        retVal = self.compare_image(v_img, region_OngoingIcon)

        if retVal <= bar:
            retVal = True
        return retVal
    
