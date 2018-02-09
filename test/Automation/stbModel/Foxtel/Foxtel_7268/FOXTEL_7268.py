'''
Kunwang, created on October 26th, 2017
'''

import FOXTEL_SETTINGS
import time

class FOXTEL_7268(FOXTEL_SETTINGS.FOXTEL_SETTINGS):
    def __init__(self, framework):
        super(FOXTEL_7268, self).__init__(framework)
        self.key_delay = 3 #default: wait 3-seconds before next operation after each key-press
    
    #If not specified, wait for self.key_delay after the press.
    #If not specified, capture screen-shot automatically after wait period.
    def pressKey(self, strKey, delay = 0, capScreen = True):        
        self.framework.pressKey(strKey)
        if delay == 0: 
            delay = self.key_delay

        time.sleep(delay)
        
        if capScreen == True:
            self.framework.capture_screen()
        return
    
    def wait(self, seconds, capScreen = True):
        time.sleep(seconds)
        if capScreen == True:
            self.framework.capture_screen()
        return

    def printTrace(self, logcontent, log_type = "Debug"):
        self.framework.personalTrace(logcontent, log_type = "Debug")
        return
