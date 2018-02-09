'''
Danmin, created on October 31th, 2017
2017-11-01, Kunwang:
	Refined the steps.
'''
	
	
import getopt
import sys

from O_framework import O_framework

def test_body(test_stb):    
	#Launch the home-screen
	test_stb.launch_HomeScreen()
	
	#Press left/right to do some movement
	test_stb.pressKey("Right", delay = 10, capScreen = True)
	
	#Verify that home is focused.
	if test_stb.is_TVGUIDE_Focused() is False:
		test_stb.reportFail("TV Guide is not focused!")

if __name__ == '__main__':   
    opts, args = getopt.getopt(sys.argv[1:], "d:r:") 
    log_folder = opts[0][1]
    slot_id = opts[1][1]
    
    framework = O_framework.O_framework(log_folder, slot_id)
    v_ret = framework.launch_test(test_body)
    exit(v_ret)
