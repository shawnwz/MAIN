'''
Kunwang, created on October 27th, 2017
'''

import getopt
import sys

from O_framework import O_framework

def test_body(test_stb):
    test_stb.wait(seconds = 3, capScreen = True)


if __name__ == '__main__':   
    opts, args = getopt.getopt(sys.argv[1:], "d:r:") 
    log_folder = opts[0][1]
    slot_id = opts[1][1]
    
    framework = O_framework.O_framework(log_folder, slot_id)
    v_ret = framework.launch_test(test_body)
    exit(v_ret)
