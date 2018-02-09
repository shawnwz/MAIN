'''
Danmin, created on October 31th, 2017
2017-11-01:
	Fix the typo
'''
	
	
import getopt
import sys

from O_framework import O_framework

def test_body(test_stb):
	#launch the home-screen    
	test_stb.launch_HomeScreen()
	
	#option 'home' should be focused automatically.
	if test_stb.is_HOME_Focused() is False:
		test_stb.reportFail("HOME not focused!")

if __name__ == '__main__':   
    opts, args = getopt.getopt(sys.argv[1:], "d:r:") 
    log_folder = opts[0][1]
    slot_id = opts[1][1]
    
    framework = O_framework.O_framework(log_folder, slot_id)
    v_ret = framework.launch_test(test_body)
    exit(v_ret)
