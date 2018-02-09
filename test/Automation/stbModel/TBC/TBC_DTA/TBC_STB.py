'''
Created on Jan 10, 2017

@author: kunwang
'''

class TBC_STB():
    def __init__(self):     
        self.redrat_command = "_RR_CLI_V3.01\\RR_CLI.exe RedRat-0 -output _RR_CLI_V3.01\\SignalDB_TBC.xml -device \"TBC\" -signal "
        self.key_delay = 2 #default: wait 2-seconds before next operation after each key-press
        
    def pressKey(self, strKey, delay = 0, capScreen = True):
        raise Exception("Method NOT implemented!")
        pass
    
    def wait(self, seconds, capScreen = True):
        raise Exception("Method NOT implemented!")
        pass
        
    def personalTrace(self, logcontent):
        raise Exception("Method NOT implemented!")
        pass
