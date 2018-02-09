'''
Kunwang, created on November 6th, 2017
'''
	
	
import getopt
import sys

from O_framework import O_framework

#deps: FOXTEL_0005_Default_Focus_After_Launch_Home_Screen.py
def test_body(test_stb):	
	#Launch the home-screen
	test_stb.launch_HomeScreen()
	
	#Move focus
	test_stb.pressKey("Down", capScreen = True)
	
	#Verify the focus
	if test_stb.homefocused_get_first_category() != "Suggested":
		test_stb.reportFail("Not focused on 'Suggested'!")

if __name__ == '__main__':   
    opts, args = getopt.getopt(sys.argv[1:], "d:r:") 
    log_folder = opts[0][1]
    slot_id = opts[1][1]
    
    framework = O_framework.O_framework(log_folder, slot_id)
    v_ret = framework.launch_test(test_body)
    exit(v_ret)
