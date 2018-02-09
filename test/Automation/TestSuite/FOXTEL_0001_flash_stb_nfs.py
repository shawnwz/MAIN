'''
Kunwang, created on October 27th, 2017
'''

import getopt
import sys
from O_framework import O_framework
from datetime import datetime
from util import bj_sftp_service

def reboot_stb(test_stb, delay=5):
     off_ret = test_stb.power_off()
     test_stb.wait(delay, capScreen = False)
     on_ret = test_stb.power_on()
     if not (off_ret and on_ret):
         test_stb.reportFail("Reboot Stb failed!")
 
def check_build_version():
     return True

def test_body(test_stb):
    if bj_sftp_service.update_unzip_nsf_server():
        for i in range(1):    
            reboot_stb(test_stb)
            test_stb.wait(60 * 5, capScreen = False)
        test_stb.wait(1, capScreen = True)
        if check_build_version() is False:
            test_stb.reportFail("The Build version not match!")
    else:
        test_stb.reportFail("Failed to flash and boot-up the STB!")

if __name__ == '__main__':   
    opts, args = getopt.getopt(sys.argv[1:], "d:r:") 
    log_folder = opts[0][1]
    slot_id = opts[1][1]
    
    framework = O_framework.O_framework(log_folder, slot_id)
    v_ret = framework.launch_test(test_body)
    exit(v_ret)
