# -*- coding: UTF-8 -*-

'''
Kunwang, created on October 27th, 2017
'''
import subprocess

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from selenium.webdriver.common.keys import Keys

class FOXTEL7268_IR_Webdriver(object):
    def __init__(self, theDriver):
        self.driver = theDriver
        return

    def sendKey(self, strKey):
        if strKey == "Right":
            some_elemt = otv_web_driver.find_element_by_id('portalMenu')
            some_elemt.send_keys(Keys.ARROW_RIGHT)
            return
        '''
        #mapping the key into signal
        str_Signal = self.mappingKeyToSignal(strKey)
        #build the signal
        str_cmd = self.redrat_command + str_Signal
        #send the signal
        self.send_signal(str_cmd)
        '''
        return

    def mappingKeyToSignal(self, strKey):
        #mapping between framework & red-rat
        mapping = {
                   #1st line
                   "AV": "AV",    
                   "FOXTEL": "FOXTEL",
                   "TV_Guide": "TV_Guide",
                   "OnDemand": "OnDemand",
                   "Active": "Active",
                   "Planner": "Planner",
                   "Setup": "Setup",
                   "Info": "Info",
                   
                   "Vol+": "Vol+",
                   "Vol-": "Vol-",
                   "Up": "Up",
                   "Down": "Down",     
                   "Left": "Left",
                   "Right": "Right",
                   "Select": "Select",
                   "CH+": "CH+",
                   "CH-": "CH-",

                   "Mute":"Mute",
                   "Back":"Back",
                   "Help":"Help",
                   
                   #PVR control
                   "Rewind": "Rewind",
                   "Forward": "Forward",
                   "Pause": "Pause",
                   "Play": "Play",
                   "Record":"Record",
                   "Stop": "Stop",
                   
                   #color keys
                   "Red": "Red",
                   "Green": "Green",     
                   "Yellow": "Yellow",
                   "Blue": "Blue",    
                   
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
                   }
        
        #find the mapped signal
        str_Signal = mapping[strKey]
        return str_Signal    
    
    def send_signal(self, str_command):
        process = subprocess.Popen(str_command.strip(), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)     
        process.wait() 


