'''
Kunwang, created on 2017-08-30
2017-08-30:
    Added the call to base init method.
'''
from stbModel.StarHub.StarHub_7428.NFX_ROOT import NFX_ROOT


class NFX_SETTINGS(NFX_ROOT):
    def __init__(self, frame):
        super(NFX_SETTINGS, self).__init__(frame)
        return

    #Post-condition:
    #   Go to [General Settings] and focus on the specified option.
    #Parameter:
    #   strOption:  The target option to be focused on. 
    #               It should be one of the options defined in self.generalSettings_Options.
    #               Special procedure provided if strOption == 'Deactivate Netflix'
    #Exception:
    #   Report test fail, if strOption not expected, or failed to focus on it.
    def generalSettings_FocusOnOption(self, strOption):
        self.personalTrace("NFX_SETTINGS.generalSettings_FocusOnOption() enter. strOption = {0}.".format(strOption))

        counter = 0
        max_counter = len(self.generalSettings_Options)
        while counter < max_counter:
            if self.generalSettings_Options[counter] == strOption:
                break
            counter += 1
        
        region_OptionName = self.ocr_sets["GeneralSettings_OptionName_Region"]
        if counter == max_counter:
            if strOption == "Deactivate Netflix":
                region_OptionName = self.ocr_sets["GeneralSettings_DeactiveNetflix_OptionName_Region"]
                strOption = "Deactivate"
                counter = 1
            else:
                #Invalid parameter
                self.frame.reportFail("Wrong parameter provided!")
        
        self.launch_GeneralSettings()
        while counter > 0:
            self.pressKey("Up", capScreen = False)
            counter -= 1
        
        v_strOption = self.frame.ocr_currentScreen(region_OptionName)
        if v_strOption != strOption:
            #try again
            self.pressKey("Up", capScreen = False)
            self.pressKey("Down", capScreen = False)
            v_strOption = self.frame.ocr_currentScreen(region_OptionName)
            if v_strOption != strOption:
                self.frame.reportFail("Failed focus on '{0}'!".format(strOption))

        self.personalTrace("NFX_SETTINGS.generalSettings_FocusOnOption() exit.")
        return

    #Pre-condition:
    #   STB is now on LIVE
    #Post-condition:
    #   Value of strOption changed to be strValue
    def generalSettings_SetOptionValue(self, strOption, strValue):
        self.personalTrace("NFX_SETTINGS.generalSettings_SetOptionValue() enter. strOption = {0}, strValue = {1}.".format(strOption, strValue))
        self.generalSettings_FocusOnOption(strOption)
        region_OptionValue = self.ocr_sets["GeneralSettings_OptionValue_Region"]

        v_valueOnFocus = self.frame.ocr_currentScreen(region_OptionValue)
        v_currentValue = v_valueOnFocus
        while v_currentValue != strValue:
            self.pressKey("Right", capScreen = False)
            v_currentValue = self.frame.ocr_currentScreen(region_OptionValue)
            if v_currentValue == v_valueOnFocus:
                #already a cycle
                self.frame.reportFail("Not found value '{0}'!".format(strValue))        

        self.personalTrace("NFX_SETTINGS.generalSettings_SetOptionValue() exit.")
        return
    
    def launch_MainMenu(self):
        self.personalTrace("NFX_SETTINGS.launch_MainMenu() enter.")

        self.navigateToLIVE()
        self.pressKey("Menu", capScreen = True)

        region_OnDemand = self.ocr_sets["MainMenu_OnDemand_Region"]
        v_str = self.frame.ocr_currentScreen(region_OnDemand)
        if v_str != "ON DEMAND":
            #try again
            v_str = self.frame.ocr_currentScreen(region_OnDemand)
            if v_str != "ON DEMAND":
                self.frame.reportFail("Not see option of 'On Demand'")
        self.personalTrace("NFX_SETTINGS.launch_MainMenu() exit.")
        return
    
    def launch_GeneralSettings(self):
        self.personalTrace("NFX_SETTINGS.launch_GeneralSettings() enter.")
        
        self.launch_MainMenu()
        self.pressKey("Right", capScreen = False)
        self.pressKey("Right", capScreen = False)
        self.pressKey("Right", capScreen = False)
        self.pressKey("Right", capScreen = False)
        self.pressKey("Ok", capScreen = False)
        self.pressKey("Ok", capScreen = True)
        
        region_Title = self.ocr_sets["GeneralSettings_Title_Region"]
        v_str = self.frame.ocr_currentScreen(region_Title)
        if v_str != "GENERAL SETTINGS":
            #try again
            v_str = self.frame.ocr_currentScreen(region_Title)
            if v_str != "GENERAL SETTINGS":
                self.frame.reportFail("Failed to launch [General Settings]")
        self.personalTrace("NFX_SETTINGS.launch_GeneralSettings() exit.")
        return
    
    