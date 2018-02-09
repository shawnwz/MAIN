'''
Kunwang, created on October 26th, 2017
2017-11-01:
    Added the method 'launch_HomeScreen()'
    Added the method 'is_LIBRARY_Focused()', 'is_LIBRARY_focused_img()'
    Added the method 'is_ONDEMAND_Focused()', 'is_ONDEMAND_focused_img()'
    Added the method 'is_STORE_Focused()', 'is_STORE_focused_img()'
    Raised the bar for image-compare to be '500', especially for on-demand
2017-11-06, Kunwang:
    Added the method 'verify_home_apprearance_when_entered()'
    Added the method 'homefocused_get_first_category()'
    Added the method 'homefocused_get_first_category()'
    Added the method 'is_suggested_focused()'
    Added the method 'is_trending_focused()'
    Added the method 'is_highlights_focused()'
2017-11-07, Kunwang:
    Added the method 'home_is_play_icon_shown()'
'''
import FOXTEL_ROOT


class FOXTEL_SETTINGS(FOXTEL_ROOT.FOXTEL_ROOT):
    def __init__(self, framework):
        super(FOXTEL_SETTINGS, self).__init__(framework)
        return
    
    def launch_MainMenu(self):        
        self.pressKey("Right", capScreen = True)
        self.pressKey("Right", capScreen = True)
        self.pressKey("Right", capScreen = True)
        return
    
    def launch_HomeScreen(self):
        '''
        Pre-condition:
            N/A
        Post-condition:
            Launch the home-screen.
        '''
        self.pressKey("Up", capScreen = False)
        self.pressKey("Up", capScreen = False)
        self.pressKey("Up", capScreen = False)
        self.pressKey("Up", capScreen = False)
        self.pressKey("Up", capScreen = False)
        self.pressKey("Up", capScreen = False)
        self.pressKey("Up", capScreen = False)
        self.pressKey("Up", capScreen = True)
        self.pressKey("Left", capScreen = False)
        self.pressKey("Left", capScreen = False)
        self.pressKey("Left", capScreen = False)
        self.pressKey("Left", capScreen = False)
        self.pressKey("Left", capScreen = False)
        self.pressKey("Left", capScreen = False)
        self.pressKey("Left", capScreen = False)
        self.pressKey("Left", delay = 6, capScreen = True)
        return
        

    def navi_MainMenu(self):
        self.pressKey("Right", capScreen = True)
        return
    #*************************************************************************************
    def homefocused_get_first_category(self):
        ret_val = ""
        
        temp_region = self.ocr_sets["HOME_focused_firstcategory_region"]
        img = self.capture_screen_as_image()
        ret_val = self.ocr_screen(img, temp_region)
        
        return ret_val

    def homefocused_get_second_category(self):
        ret_val = ""
        
        temp_region = self.ocr_sets["HOME_focused_secondcategory_region"]
        img = self.capture_screen_as_image()
        ret_val = self.ocr_screen(img, temp_region)
        
        return ret_val
    #*************************************************************************************
    def is_HOME_Focused(self):
        return self.is_HomeScreenItem_focused_img("Home")
    
    def is_TVGUIDE_Focused(self):
        return self.is_HomeScreenItem_focused_img("Tv Guide")
    
    def is_LIBRARY_Focused(self):
        return self.is_HomeScreenItem_focused_img("Library")
    
    def is_ONDEMAND_Focused(self):
        return self.is_HomeScreenItem_focused_img("On Demand")
    
    def is_STORE_Focused(self):
        return self.is_HomeScreenItem_focused_img("Store")
    
    def is_APPS_Focused(self):
        return self.is_HomeScreenItem_focused_img("Apps")
    
    def is_SEARCH_Focused(self):
        return self.is_HomeScreenItem_focused_img("Search")
    
    def is_OPTION_Focused(self):
        return self.is_HomeScreenItem_focused_img("Option")
    
    def is_HomeScreenItem_focused_img(self, strItem):
        ret_val = False
        bar = 300
        
        theKey = "Home"
        if strItem == "Home":
            theKey = "Main_Home_Focused"
        elif strItem == "Tv Guide":
            theKey = "Main_TVGuide_Focused"
        elif strItem == "Library":
            theKey = "Main_Library_Focused"
        elif strItem == "On Demand":
            theKey = "Main_OnDemand_Focused"
            bar = 500
        elif strItem == "Store":
            theKey = "Main_STORE_Focused"
        elif strItem == "Apps":
            theKey = "Main_APPS_Focused"
        elif strItem == "Search":
            theKey = "Main_SEARCH_Focused"
        elif strItem == "Option":
            theKey = "Main_OPTION_Focused"

        region_img = self.img_sets[theKey]
        img = self.capture_screen_as_image()
        result = self.compare_image(img, region_img)

        if result <= bar:
            ret_val = True

        return ret_val
    
    def is_suggested_focused(self):
        '''
        Pre-condition:
            User entered 'Home' and move focus on its sub-menu 'Suggested'
        Post-condition:
            Return True, if 'Suggested' is focused
            Return False, if otherwise
        '''
        ret_val = False
        if self.homefocused_get_first_category() == "Suggested":
            ret_val = True

        return ret_val
    
    def is_trending_focused(self):
        '''
        Pre-condition:
            User entered 'Home' and move focus on its sub-menu 'Trending'
        Post-condition:
            Return True, if 'Trending' is focused
            Return False, if otherwise
        '''
        ret_val = False
        if self.homefocused_get_first_category() == "Trending":
            ret_val = True

        return ret_val
    
    def is_highlights_focused(self):
        '''
        Pre-condition:
            User entered 'Home' and move focus on its sub-menu 'Highlights'
        Post-condition:
            Return True, if 'Highlights' is focused
            Return False, if otherwise
        '''
        ret_val = False
        if self.homefocused_get_first_category() == "Highlights":
            ret_val = True

        return ret_val
    
    def is_highlights_focused(self):
        '''
        Pre-condition:
            User entered 'Home' and move focus on its sub-menu 'Highlights'
        Post-condition:
            Return True, if 'Highlights' is focused
            Return False, if otherwise
        '''
        ret_val = False
        if self.homefocused_get_first_category() == "Highlights":
            ret_val = True

        return ret_val
        
    def is_HOME_focused_webdriver(self):
        ret_val = False

        self.capture_screen_as_image()
        element = self.framework.captureDevice.driver.find_element_by_class_name('portal-menu-item-home')
        v_str = element.text

        if "focused" in element.get_attribute("class"):
            ret_val = True

        return ret_val
        
    def home_is_play_icon_shown(self):
        '''
        Pre-condition:
            Home entered, focus on some event
        Post-condition:
            Return True, if see the play icon
            Return False, if otherwise
        '''
        ret_val = False
        bar = 30

        #we use 5 images to make the decision.
        region_img_1 = self.img_sets["Home_PlayIcon_A"]
        region_img_2 = self.img_sets["Home_PlayIcon_B"]
        region_img_3 = self.img_sets["Home_PlayIcon_C"]
        region_img_4 = self.img_sets["Home_PlayIcon_D"]
        region_img_5 = self.img_sets["Home_PlayIcon_E"]
        
        img = self.capture_screen_as_image()
        result_1 = self.compare_image(img, region_img_1)
        result_2 = self.compare_image(img, region_img_2)
        result_3 = self.compare_image(img, region_img_3)
        result_4 = self.compare_image(img, region_img_4)
        result_5 = self.compare_image(img, region_img_5)

        if result_1 <= bar and result_2 <= bar and result_3 <= bar and result_4 <= bar and result_5 <= bar:
            ret_val = True

        return ret_val
    
    def home_is_title_inside_outside_match(self):
        '''
        Pre-condition:
            User enters 'Home' and focus on some event
        Post-condition:
            Compared the titles displayed inside/outside the rectangle of the event.
            Return True, if match
            Return False, if otherwise
        '''
        ret_val = False
        
        region_1 = self.ocr_sets["HOME_focused_event_title_inside_rectangle"]
        region_2 = self.ocr_sets["HOME_focused_event_title_outside_rectangle"]
        img = self.capture_screen_as_image()

        val_1 = self.ocr_screen(img, region_1)
        val_2 = self.ocr_screen(img, region_2)
        
        if val_1 == val_2:
            ret_val = True
        
        return ret_val
    #*************************************************************************************
    def verify_home_apprearance_when_entered(self):
        ret_val = False
        bar = 200

        region_img = self.img_sets["Home_Appearance_Entered"]
        img = self.capture_screen_as_image()
        result = self.compare_image(img, region_img)

        if result <= bar:
            ret_val = True

        return  ret_val
    
        
