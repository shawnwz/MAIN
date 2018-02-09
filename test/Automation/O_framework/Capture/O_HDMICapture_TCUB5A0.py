'''
Created on 2017-08-22

@author: kunwang
'''

import pythoncom
import time

from ctypes import *        

class O_HDMICapture_TCUB5A0():
    def __init__(self, log_folder = ".", isCaptureVideo = False, isCaptureScreen = True):
        #used to on/off video/screen capture.
        self.isCaptureVideo = isCaptureVideo
        self.isCaptureScreen = isCaptureScreen
        self.hdmi_device = c_long(0)

        
        #initialize com object
        self.QCAP = CDLL('QCAP.X64.DLL')
        pythoncom.CoInitialize()
        self.QCAP.QCAP_CREATE("QP0204 USB", 0 , 0 , byref(self.hdmi_device) , 1 , 0)
        '''
        self.QCAP.QCAP_SET_VIDEO_HARDWARE_ENCODER_PROPERTY(self.hdmi_device, 0,
                                                            0,
                                                            1, #self.QCAP.QCAP_RECORD_MODE_CBR,
                                                            8000,
                                                            36 * 1024 * 1024,
                                                            30, 0, 0, 
                                                            0, #self.QCAP.QCAP_DOWNSCALE_MODE_1_2,
                                                            0, 0)
        '''
        
        self.QCAP.QCAP_RUN(self.hdmi_device)

        time.sleep(10)
        self.QCAP.QCAP_SET_VIDEO_RECORD_PROPERTY(self.hdmi_device, 0, 0, 0, 1, 8000, 36 * 1024 * 1024, 30, 0, 0, 0)
        self.QCAP.QCAP_SET_AUDIO_RECORD_PROPERTY(self.hdmi_device, 0, 0, 1)           

        self.folderName = log_folder
        pass

    def capture_screen(self):
        tick_return = -1
        tick = int(time.time() * 100)
        str_path = "{0}\\{1}.jpg".format(self.folderName, tick)
        retval = self.QCAP.QCAP_SNAPSHOT_JPG(self.hdmi_device, str_path , 80, 0)
        
        if retval != 0:
            #retry
            tick = int(time.time() * 100)
            str_path = "{0}\\{1}.jpg".format(self.folderName, tick)
            retval = self.QCAP.QCAP_SNAPSHOT_JPG(self.hdmi_device, str_path , 80, 0)

        #success
        if retval == 0:            
            tick_return = tick

        return tick_return

    def start(self):           
        if self.isCaptureVideo == True:
            out_path = "{0}\\output.mp4".format(self.folderName)
            self.QCAP.QCAP_START_RECORD(self.hdmi_device, 0, out_path, 7, 0, 0, 0, 0)
        return

    def stop(self):            
        if self.isCaptureVideo == True:
            self.QCAP.QCAP_STOP_RECORD(self.hdmi_device, 0, 1, 0)
        
        self.QCAP.QCAP_STOP(self.hdmi_device)
        self.QCAP.QCAP_DESTROY(self.hdmi_device)
        pythoncom.CoUninitialize()
        return
        
        
        
        
        
        
        
        
        
        
        
        
