'''
Created on Jun 12, 2017

@author: kunwang
'''

import TBC_STB
class DTA_Settings(TBC_STB.TBC_STB):
    '''
    classdocs
    '''


    def __init__(self):
        pass

        
    def goto_TVSetting_ParentalControl(self):        
        self.goto_TVSetting()
        self.pressKey("Right", delay = 3, capScreen = True)

    def goto_TVSetting_PreferSetup(self):        
        self.goto_TVSetting_ParentalControl()
        self.pressKey("Down", delay = 3, capScreen = True)
        self.pressKey("Down", delay = 3, capScreen = True)
        self.pressKey("Down", delay = 3, capScreen = True)

    def goto_TVSetting_PreferSetup_DefaultLanguage(self):        
        self.goto_TVSetting_PreferSetup()
        self.pressKey("Right", delay = 3, capScreen = True)
        
    def goto_TVSetting(self):        
        self.pressKey("Menu", capScreen = False)
        
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Up", delay = 3, capScreen = False)
        self.pressKey("Up", delay = 3, capScreen = True)
        
        
    def goto_STBInformation(self):        
        self.pressKey("Menu", capScreen = False)
        
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Up", capScreen = False)

        self.pressKey("Right", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        
        self.pressKey("Right", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)

        self.pressKey("Right", capScreen = True)
        
    def goto_FactoryReset(self):        
        self.pressKey("Menu", capScreen = False)
        
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Up", capScreen = False)

        self.pressKey("Right", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Right", capScreen = False)
        
        self.pressKey("7", capScreen = False)
        self.pressKey("7", capScreen = False)
        self.pressKey("7", capScreen = False)
        self.pressKey("6", capScreen = False)
        
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = False)
        self.pressKey("Down", capScreen = True)

        
