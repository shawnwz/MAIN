'''
Kunwang, created on Jan 10, 2017
2017-08-29:
    Added the function to do OCR on captured screen.
2017-08-30:
    Flag to indicate the test result.
    test_result = "Error", if exception caught when executing 'test_body'
    Added method to allow user to report that test is failed.
    Added method 'ocr_currentScreen' as a new tool to OCR screen.
2017-10-18:
    Integrated with O_LogUtil
2017-10-19:
    Added new method capture_screen_as_image
2017-10-23:
    Abstracted the IR device
2017-10-24:
    Added the new method 'compare_image'
2017-10-26:
    Added the support for using slots
    Now there is no need to create stb instance in the test-script, the framework will hold it.
2017-10-27:
    Abstracted the IR into factory
    Added the support to use Webdriver as the IR device.
    Conver image_region to RGB before saving it, in method ocr_screen. To avoid exception.
2017-10-30:
    Abstracted stb_ip as parameter for webdriver
    Webdriver doesn't use red-rat, comment out the un-used line
2017-11-01, Kunwang:
    Abstracted the definition of slots into another file.
2017-11-07, Yangyang:
    Add power controler device.
'''
import time
import traceback
import O_ImageUtil
import O_LogUtil

from PIL import Image
from slots_definition import SLOTS
from O_CaptureFactory import O_CaptureFactory
from O_STBFactory import O_STBFactory
from IR.O_IRFactory import O_IRFactory
from Power.O_PCM import PowerControler

class O_framework(object):
    '''
    Class that handles the low-level implementation.
    '''
    def __init__(self, log_folder, slot_id="1"):
        #dictionary for holding traces
        self.dict_trace = []
        #Pass, Fail, Error, default to be Pass
        self.test_result = "Pass"
        #random folder to store the files
        self.folder_name = log_folder
        #flag used to special process of the 1st section
        self.first_section = True

        #load the slot configuration
        self.slot_id = int(slot_id)

        #redrat to be used
        #self.redrat_id = slots[self.slot_id]["redrat_id"]

        #re-direct stdout
        self.logger = O_LogUtil.O_LogUtil(self.folder_name + "\\stdout.txt", pOverwrite=True)

        self.config_item = SLOTS[self.slot_id]
        self.config_item['log_folder'] = self.folder_name

        self.capture_device = O_CaptureFactory.getCaptureDevice(self.config_item)
        #if using webdriver to send key, then captureDevice is also the IR device
        if self.config_item["IR_device"] is 'Webdriver':
            self.ir_device = self.capture_device
        else:
            self.ir_device = O_IRFactory.getIRDevice(self.config_item)

        self.imageUtil = O_ImageUtil.O_ImageUtil()
        
        if self.config_item.has_key("pcm_info"):
            self.power_controler = PowerControler(self.config_item)
        else:
            self.power_controler = None        
        return

    #Kunwang, 2017-03-02
    #Pre: None
    #Post: Indicates that one new test-section(test-step) is started.
    #Details:
    #    sectionName is the name of the section(step), if not specified, default value applied.
    def addCheckPoint(self, expected="un-defined"):
        self.add_trace(expected, log_type="CHK")

    #returns the tick(screen file name), if success.
    #returns -1, if otherwise
    def capture_screen(self):
        self.add_trace("capture_screen(): enter.", log_type="Debug")

        tick = -1
        tick = self.capture_device.capture_screen()

        self.add_trace("capture_screen(): {0}.jpg".format(tick), log_type="Debug")
        self.add_trace("capture_screen(): {0}.jpg".format(tick), log_type="Screen")
        self.add_trace("capture_screen(): exit.", log_type="Debug")
        return tick

    def compare_image(self, source_folder, source_file, screen_image):
        '''
        Kunwang, 2017-10-24
        Post-condition:
            Returns the difference computed for the screen and the sample
        '''
        self.add_trace("compare_image(): enter. source_file = {0}".format(source_file), log_type="Debug")
        #load the image from the source file
        str_filename = "{0}\\{1}".format(source_folder, source_file)
        v_source = Image.open(str_filename)

        tick = int(time.time() * 100)
        str_path = "{0}\\{1}.jpg".format(self.folder_name, tick)
        v_source.save(str_path, "JPEG", quality=95)
        self.add_trace("compare_image(): source saved to {0}.jpg".format(tick), log_type="Debug")
        self.add_trace("compare_image(): {0}.jpg".format(tick), log_type="Screen")

        #compute the region information using the source_file
        v_arr = source_file.split('.')
        if len(v_arr) != 2:
            self.reportFail("Source file name in wrong format! Should be name_x_y.z")
            return None
        v_arr = v_arr[0].split('_')
        if len(v_arr) < 3:
            self.reportFail("Source file name in wrong format! Should be name_x_y.z")
            return None

        v1 = int(v_arr[-2])
        v2 = int(v_arr[-1])
        v_size = v_source.size

        #crop the screen_image
        region = (v1, v2, v1 + v_size[0], v2 + v_size[1])
        self.add_trace("compare_image(): use {0} to crop.".format(region), log_type="Debug")
        img_region = screen_image.crop(region)

        tick = int(time.time() * 100)
        str_path = "{0}\\{1}.jpg".format(self.folder_name, tick)
        img_region = img_region.convert('RGB')
        img_region.save(str_path, "JPEG", quality=95)
        self.add_trace("compare_image(): saved crop to {0}.jpg".format(tick), log_type="Debug")
        self.add_trace("compare_image(): {0}.jpg".format(tick), log_type="Screen")

        #overlay the region for human analysis
        img_overlay = self.imageUtil.overlayImage(img_region, v_source)

        tick = int(time.time() * 100)
        str_path = "{0}\\{1}.jpg".format(self.folder_name, tick)
        img_overlay.save(str_path, "JPEG", quality=95)
        self.add_trace("compare_image(): saved overlay to {0}.jpg".format(tick), log_type="Debug")
        self.add_trace("compare_image(): {0}.jpg".format(tick), log_type="Screen")

        #compute the difference and return
        ret_val = self.imageUtil.diffImage(img_region, v_source)
        self.add_trace("compare_image(): exit. ret_val = {0}".format(ret_val), log_type="Debug")
        return ret_val

    def capture_screen_as_image(self):
        '''
        Post-condition:
            Capture current and return it as an image object, if success.
            Throw exception, if failed.
        '''
        self.add_trace("capture_screen_as_image(): enter.", log_type="Debug")
        v_img = None
        tick = self.capture_screen()

        if tick != -1:
            #open the screen-shot
            str_filename = "{0}\\{1}.jpg".format(self.folder_name, tick)
            v_img = Image.open(str_filename)
        else:
            self.reportFail("Screen not captured!")
        return v_img

    def launch_test(self, test_body):
        '''
        Create the STB instance and run the test method.
        '''
        self.add_trace("launch_test(): enter.", log_type="Debug")

        #start capture device
        self.capture_device.start()

        try:
            #create stb instance
            stb = O_STBFactory.getSTB(self.config_item, self)
            #execute steps
            test_body(stb)
        except Exception, e:
            #exception is not expected during execution.
            if str(e).startswith("Failure:"):
                self.test_result = "Fail"
            else:
                self.test_result = "Error"

            self.add_trace("launch_test(): {0}.".format(str(e)), log_type="ERR")
            self.add_trace("launch_test(): {0}.".format(traceback.format_exc()), log_type="ERR")

        #stop capture device
        self.capture_device.stop()

        #append end-section mark
        self.add_trace("SEN", log_type="SEN")
        self.add_trace("launch_test(): exit. Result = {0}".format(self.test_result), log_type="Debug")

        v_ret = 0
        if self.test_result == "Fail":
            v_ret = 1
        if self.test_result == "Error":
            v_ret = 2
        return v_ret

    def ocr_screen(self, image, region):
        '''
        Kunwang, 2017-08-29
        Pre-condition:
           image:  the image to be processed
           region: region of the image to be OCR'ed
        Post-condition:
           Return "", if failed or nothing read.
           Reture the content of the region if otherwise.
           Region-of-the-image is cropped and saved for trace.
        '''
        self.add_trace("ocr_screen(): enter. region = {0}".format(region), log_type="Debug")
        ret_str = ""
        img_region = image.crop(region)

        #save the region to some image.
        #and write the information to log for debug.
        tick = int(time.time() * 100)
        str_path = "{0}\\{1}.jpg".format(self.folder_name, tick)
        img_output = img_region.convert('RGB')
        img_output.save(str_path, "JPEG", quality=95)
        self.add_trace("ocr_screen(): saved crop to {0}.jpg".format(tick), log_type="Debug")
        self.add_trace("ocr_screen(): {0}.jpg".format(tick), log_type="Screen")

        #do the ocr
        ret_str = self.imageUtil.ocrImage(img_region)
        self.add_trace("ocr_screen(): exit, ret_str = {0}".format(ret_str), log_type="Debug")
        return ret_str

    def ocr_currentScreen(self, region):
        '''
        Kunwang, 2017-08-30
        Pre-condition:
           region: region of the image to be OCR'ed
        Post-condition:
           Return "", if failed or nothing read.
           Reture the content of the region if otherwise.
           Current-screen and its-region are saved for trace.
        '''
        self.add_trace("ocr_currentScreen(): enter. region = {0}".format(region), log_type="Debug")
        ret_str = ""

        time.sleep(1)
        tick = self.capture_screen()
        if tick != -1:
            #open the screen-shot
            str_filename = "{0}\\{1}.jpg".format(self.folder_name, tick)
            v_img = Image.open(str_filename)
            ret_str = self.ocr_screen(v_img, region)

        self.add_trace("ocr_currentScreen(): exit, ret_str = {0}".format(ret_str), log_type="Debug")
        return ret_str

    def add_trace(self, log_str, log_type="Log"):
        '''
        Kunwang, 2017-01-10
        Pre: None
        Post: The log-string is printed with '-------' suffixes for easy debug.
        Details:
            If log_type == "Log" or log_type == "Debug" , it will be simple log output.
            If log_type == "Screen", then log_str should be a file-path to some picture.
            If log_type == "Error", log_str will be some error-message that need special attention.
            If log_type == "SEC", one simple log-output to indicate starting of one new section.
            If log_type == "SEN", then one simple log-output to indicate ending of one new section.
            If log_type == "CHK", then one simple log-output to indicate check-point
        '''
        flag_debug = True
        str_out = ""
        log_str = log_str.replace('\n', '')
        if flag_debug:
            if log_type == "Log":
                str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":LOG:", log_str)
            else:
                if log_type == "Error":
                    str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":ERR:", log_str)
                else:
                    if log_type == "Screen":
                        str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":SCR:", log_str)
                    else:
                        if log_type == "Debug":
                            str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":DBG:", log_str)
                        else:
                            if log_type == "SEC":
                                str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":SEC:", log_str)
                            else:
                                if log_type == "SEN":
                                    str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":SEN:", log_str)
                                else:
                                    if log_type == "CHK":
                                        str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":CHK:", log_str)
                                    else:
                                        str_out = "{0}{1}{2}".format(time.strftime('%Y-%m-%d %H-%M-%S',time.localtime(time.time())),":ERR:", log_str)
       
        self.logger.writeLine(str_out)
        print str_out
        return

    def pressKey(self, strKey):
        '''
        Send the specified key to the STB
        '''
        self.add_trace("pressKey(): enter. strKey = {0}".format(strKey), log_type="Debug")
        self.ir_device.sendKey(strKey)
        self.add_trace("pressKeys(): exit.")
        return

    def reportFail(self, strmsg):
        '''
        Mark the test to be failed
        '''
        self.add_trace("reportFail(): Case reported to be failed!", log_type="ERR")
        raise Exception("Failure: {0}".format(strmsg))

    def start_log_section(self, section_name="No name"):
        '''
        Kunwang, 2017-03-02
        Pre: None
        Post: Indicates that one new test-section(test-step) is started.
        Details:
            section_name is the name of the section(step), if not specified, default value applied.
        '''
        self.add_trace(section_name, log_type="SEC")

    def power_off(self):
        '''
        Yangyang, 2017-11-07
        Pre-condition: The slot need define power controler device in slots_defintion    
        Post-condition: None
        Details: Power off the slot
        '''
        if self.power_controler is not None:
            return self.power_controler.power_off_slot()
        else:
            return False
            
    def power_on(self):
        '''
        Yangyang, 2017-11-07
        Pre-condition: The slot need define power controler device in slots_defintion    
        Post-condition: None
        Details: Power on the slot
        '''        
        if self.power_controler is not None:
            return self.power_controler.power_on_slot()
        else:
            return False
            
            