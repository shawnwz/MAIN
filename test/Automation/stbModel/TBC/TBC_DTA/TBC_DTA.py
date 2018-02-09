'''
Created on Jan 10, 2017

@author: kunwang
'''

import DTA_Settings
import time


class TBC_DTA(DTA_Settings.DTA_Settings):
    def __init__(self, frame):                
        self.frame = frame
        
        if self.frame.redrat_id != "0":
            self.redrat_command = "_RR_CLI_V3.01\\RR_CLI.exe RedRat-{0} -output _RR_CLI_V3.01\\SignalDB_TBC.xml -device \"TBC\" -signal ".format(self.frame.redrat_id)
        else:               
            self.redrat_command = "_RR_CLI_V3.01\\RR_CLI.exe RedRat-0 -output _RR_CLI_V3.01\\SignalDB_TBC.xml -device \"TBC\" -signal "
        
        self.key_delay = 2 #default: wait 2-seconds before next operation after each key-press
    
    #If not specified, wait for self.key_delay after the press.
    #If not specified, capture screen-shot automatically after wait period.
    def pressKey(self, strKey, delay = 0, capScreen = True):
        self.personalTrace("TBC_DTA.pressKey(): enter. strKey = {0}, delay = {1}".format(strKey, delay))
        #mapping between framework & red-rat
        mapping = {                   
                   #digits
                   "0": "0",
                   "1": "1",
                   "2": "2",
                   "3": "3",
                   "4": "4",
                   "5": "5",
                   "6": "6",
                   "7": "7",
                   "8": "8",
                   "9": "9",

                   "Back":"Back",
                   "Blue":"Blue",
                   "Channel-":"Channel-",
                   "Channel+":"Channel+",
                   "Down":"Down",
                   
                   "Exit":"Exit",
                   "FF":"FF",
                   "FR":"FR",
                   "Green":"Green",
                   "Guide":"Guide",

                   "Left":"Left",
                   "Menu":"Menu",
                   "Mute":"Mute",

                   "Ok":"Ok",
                   "Play":"Play",
                   "Power":"Power",

                   "Red":"Red",
                   "Right":"Right",
                   "Stop":"STOP",

                   "Up":"Up",
                   "Vol-":"Vol-",
                   "Vol+":"Vol+",

                   "Yellow":"Yellow",
                   
                   "Info":"Info"                   
                   }
        
        #find the mapped signal
        str_Signal = mapping[strKey]
        self.personalTrace("TBC_DTA.pressKey(): signal mapped: {0}".format(str_Signal))
        
        #create the command string & send the signal via red-rat
        str_cmd = self.redrat_command + str_Signal
        tmp_ret = self.frame.send_signal(str_cmd)
        
        if tmp_ret == False:
            tmp_ret = True
            
        if delay == 0: 
            delay = self.key_delay
        
        self.personalTrace("TBC_DTA.pressKey(): wait for {0}s.".format(delay))
        time.sleep(delay)
        
        if capScreen == True:
            self.personalTrace("TBC_DTA.pressKey(): capturing screen.")
            self.frame.capture_screen()
            
        self.personalTrace("TBC_DTA.pressKey(): exit.")
    
    def wait(self, seconds, capScreen = True):
        self.personalTrace("TBC_DTA.wait(): enter. seconds = {0}, capScreen = {1}.".format(seconds, capScreen))
        time.sleep(seconds)
        if capScreen == True:
            self.personalTrace("TBC_DTA.wait(): capturing screen.")
            self.frame.capture_screen()
        self.personalTrace("TBC_DTA.wait(): exit.")
        
        
    def personalTrace(self, logcontent):
        self.frame.personalTrace(logcontent)
        return
