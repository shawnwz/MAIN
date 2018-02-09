'''
Kunwang, created on 2017-10-27
2017-10-30:
    Abstracted stb_ip as parameter for webdriver
2017-11-02, Kunwang:
    Using switch_to_active_element() to get the element for sending keys.
'''

import pythoncom
import time
import subprocess


import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from selenium import webdriver
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.keys import Keys

from ctypes import *        

class WebdriverCapture7268():
    def __init__(self, config_item):
        self.folderName = config_item["log_folder"]
        self.stb_ip = config_item["stb_ip"] #"10.12.3.43:2999"

        #kill any old process        
        str_command = "taskkill /f /t /im otvwebkitdriver_debug.exe"
        tmp_process = subprocess.Popen(str_command.strip(), shell=True)
        tmp_process.wait()

        #str_command = "C:\\Automation_workspace\\_webkit\\otvwebkitdriver_debug.exe --port=9515 --whitelisted-ips --verbose"
        str_command = "_webkit\\otvwebkitdriver_debug.exe --port=9515 --whitelisted-ips" # --verbose
        self.process = subprocess.Popen(str_command.strip(), shell=True)

        time.sleep(6)
        options = ChromeOptions()
        options.add_experimental_option("debuggerAddress", self.stb_ip)
        self.driver = webdriver.Remote(command_executor='http://localhost:9515', desired_capabilities = options.to_capabilities())

        return

    def capture_screen(self):
        tick_return = -1
        tick = int(time.time() * 100)
        str_path = "{0}\\{1}.jpg".format(self.folderName, tick)
        retval = self.driver.get_screenshot_as_file(str_path)

        if retval is True:
            tick_return = tick

        return tick_return

    def start(self):        
        return

    def stop(self):            
        self.driver.quit()
        self.process.kill()  
        str_command = "taskkill /f /t /im otvwebkitdriver_debug.exe"
        tmp_process = subprocess.Popen(str_command.strip(), shell=True)
        tmp_process.wait()
        return

    def sendKey(self, strKey):
        some_elemt = self.driver.switch_to_active_element()
        if strKey == "Right":
            some_elemt.send_keys(Keys.ARROW_RIGHT)
            return
        if strKey == "Left":
            some_elemt.send_keys(Keys.ARROW_LEFT)
            return
        if strKey == "Up":
            some_elemt.send_keys(Keys.UP)
            return
        if strKey == "Down":
            some_elemt.send_keys(Keys.DOWN)
            return
        
        
        
        
        
        
        
        
        
        
        
        
