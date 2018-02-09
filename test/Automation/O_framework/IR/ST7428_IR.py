# -*- coding: UTF-8 -*-

'''
Kunwang, created on October 23th, 2017
'''
import subprocess

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

class ST7428_IR(object):
    def __init__(self, config_item):
        self.redrat_command = "_RR_CLI_V3.01\\RR_CLI.exe RedRat-{0} -output _RR_CLI_V3.01\\Starhub.xml -device \"Starhub\" -signal ".format(config_item["redrat_id"])
        return

    def sendKey(self, strKey):
        #mapping the key into signal
        str_Signal = self.mappingKeyToSignal(strKey)
        #build the signal
        str_cmd = self.redrat_command + str_Signal
        #send the signal
        self.send_signal(str_cmd)
        return

    def mappingKeyToSignal(self, strKey):
        #mapping between framework & red-rat
        mapping = {
                   #1st line
                   "Audio": "Audio",    
                   "Mute": "Mute",
                   "Power": "Power",
                   
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
                   "0": "0",
                   "*": "Star",
                   "Resolution": "Resolution",
                   
                   "Favourite": "Favourite",
                   "VOD": "PPV.VOD",
                   "Interactive": "Interactive",
                   "Livetv": "TV",
                   
                   "Info": "Info",
                   "Menu": "Menu",
                   "TV_Guide": "TV-Guide",
                   
                   "Vol+": "Volume_Up",
                   "Vol-": "Volume_Down",
                   "Up": "Up",
                   "Down": "Down",     
                   "Left": "Left",
                   "Right": "Right",
                   "Ok": "OK",
                   "Channel+": "Program+",
                   "Channel-": "Program-",
                   
                   "Backup": "Back",     
                   "Smarttv": "SmartTV",
                   "Exit": "Exit",  
                        
                   #color keys
                   "Red": "Red",
                   "Green": "Green",     
                   "Yellow": "Yellow",
                   "Blue": "Blue",      
                   
                   #PVR control
                   "Rew": "Rewind",
                   "Record": "Record",
                   "FFwd": "forward",
                   "Play": "Play",
                   "Pause": "Pause",
                   "<<|": "Previous",
                   "Stop": "Stop",
                   ">>|": "next",
                   }
        
        #find the mapped signal
        str_Signal = mapping[strKey]
        return str_Signal    
    
    def send_signal(self, str_command):
        process = subprocess.Popen(str_command.strip(), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)     
        process.wait() 


