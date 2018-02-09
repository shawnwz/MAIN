# -*- coding: UTF-8 -*-

'''
Kunwang, created on October 27th, 2017
'''
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from ST7428_IR import ST7428_IR
from FOXTEL7268_IR import FOXTEL7268_IR

class O_IRFactory:
    def __init__(self):
        pass
    
    @staticmethod
    def getIRDevice(config_item):
        '''
        Parameters:
            config_item:    Dictionary that holds the configuration.
        '''
        if config_item['stb_model'] is '7428':
            return ST7428_IR(config_item)
        elif config_item['stb_model'] is '7268':
            return FOXTEL7268_IR(config_item)
        else:
            return None
