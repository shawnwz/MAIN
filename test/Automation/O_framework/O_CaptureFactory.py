# -*- coding: UTF-8 -*-
'''
Kunwang, created on October 20th, 2017
2017-10-27:
    Added support to use webdriver as the capture device for FOXTEL project.
2017-10-30:
    Change to use config_item for webdriver
'''
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from Capture.O_HDMICapture_TCUB5A0 import O_HDMICapture_TCUB5A0
from Capture.FOXTEL7268_WebdriverCapture import WebdriverCapture7268

class O_CaptureFactory:
    def __init__(self):
        pass
    
    @staticmethod
    def getCaptureDevice(config_item):
        '''
        Parameters:
            config_item:
                Dictionary that holds the configuration for the device, maybe different for different devices.
        '''
        if config_item['devID'] == 'TCUB5A0':
            log_folder = config_item['log_folder']
            isCaptureVideo = config_item['isCaptureVideo']
            isCaptureScreen = config_item['isCaptureScreen']
            return O_HDMICapture_TCUB5A0(log_folder, isCaptureVideo, isCaptureScreen)
        elif config_item['devID'] == 'Webdriver':
            return WebdriverCapture7268(config_item)
        else:
            return None
