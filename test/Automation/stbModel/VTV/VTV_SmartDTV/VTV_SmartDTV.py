'''
Created on Jan 10, 2017

@author: kunwang
'''

import time

class VTV_SmartDTV:
    def __init__(self, frame):
        self.frame = frame
        self.redrat_command = "D:\\_Doc\\Project_Netflix_P2\\RR_CLI_V3.01\\RR_CLI.exe RedRat-0 -output D:\\_Doc\\Project_Netflix_P2\\RR_CLI_V3.01\\Starhub.xml -device \"VTV_SmarDTV_4k\" -signal "
        self.key_delay = 2 #default: wait 2-seconds before next operation after each key-press
    
    #If not specified, wait for self.key_delay after the press.
    #If not specified, capture screen-shot automatically after wait period.
    def pressKey(self, strKey, delay = 0, capScreen = True):
        self.frame.personalTrace("VTV_SmartDTV.pressKey(): enter. strKey = {0}, delay = {1}".format(strKey, delay))
        #mapping between framework & red-rat
        mapping = {
                   #1st line
                   #"Audio": "Audio",    
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
                   
                   #"*": "Star",
                   #"Resolution": "Resolution",
                   
                   #"Favourite": "Favourite",
                   #"VOD": "PPV.VOD",
                   #"Interactive": "Interactive",
                   #"Livetv": "TV",
                   
                   "Info": "Info",
                   "Menu": "Menu",
                   "TV_Guide": "TV-Guide",
                   
                   #"Vol+": "Volume_Up",
                   #"Vol-": "Volume_Down",
                   "Up": "Up",
                   "Down": "Down",     
                   "Left": "Left",
                   "Right": "Right",
                   "Ok": "OK",
                   "Channel+": "Program+",
                   "Channel-": "Program-",
                   
                   #"Backup": "Back",     
                   #"Smarttv": "SmartTV",
                   "Exit": "Exit",  
                        
                   #color keys
                   "Red": "Red",
                   "Green": "Green",     
                   "Yellow": "Yellow",
                   "Blue": "Blue",      
                   
                   #PVR control
                   #"Rew": "Rewind",
                   #"Record": "Record",
                   #"FFwd": "forward",
                   #"Play": "Play",
                   #"Pause": "Pause",
                   #"<<|": "Previous",
                   #"Stop": "Stop",
                   #">>|": "next",
                   }
        
        #find the mapped signal
        str_Signal = mapping[strKey]
        self.frame.personalTrace("VTV_SmartDTV.pressKey(): signal mapped: {0}".format(str_Signal))
        
        #create the command string & send the signal via red-rat
        str_cmd = self.redrat_command + str_Signal
        tmp_ret = self.frame.send_signal(str_cmd)
        
        if tmp_ret == False:
            tmp_ret = True
            
        if delay == 0: 
            delay = self.key_delay
        
        self.frame.personalTrace("VTV_SmartDTV.pressKey(): wait for {0}s.".format(delay))
        time.sleep(delay)
        
        if capScreen == True:
            self.frame.personalTrace("VTV_SmartDTV.pressKey(): capturing screen.")
            self.frame.capture_screen()
            
        self.frame.personalTrace("VTV_SmartDTV.pressKey(): exit.")
    
    def wait(self, seconds, capScreen = True):
        self.frame.personalTrace("VTV_SmartDTV.wait(): enter. seconds = {0}, capScreen = {1}.".format(seconds, capScreen))
        time.sleep(seconds)
        if capScreen == True:
            self.frame.personalTrace("VTV_SmartDTV.wait(): capturing screen.")
            self.frame.capture_screen()
        self.frame.personalTrace("VTV_SmartDTV.wait(): exit.")
