# -*- coding: UTF-8 -*-
'''
Kunwang, created on November 3rd, 2017
'''

import getopt
import sys

from O_framework import O_framework

#deps: FOXTEL_0005_Default_Focus_After_Launch_Home_Screen.py
def test_body(test_stb):
    '''
    Test point:
        When 'Home' focused, 'suggested' is displayed 'Home'
    Test steps:
        1. Launch Home screen
        2. Focus on 'Home'
    Expected:
        'Suggested' displayed under 'Home'
	'''
    test_stb.launch_HomeScreen()

    if test_stb.homefocused_get_first_category() != "Suggested":
        test_stb.reportFail("Suggested not displayed!")

if __name__ == '__main__':
    OPTS, ARGS = getopt.getopt(sys.argv[1:], "d:r:")
    FRAMEWORK = O_framework.O_framework(OPTS[0][1], OPTS[1][1])
    exit(FRAMEWORK.launch_test(test_body))
