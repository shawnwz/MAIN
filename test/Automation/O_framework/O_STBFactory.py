# -*- coding: UTF-8 -*-

'''
Kunwang, created on October 2th, 2017
'''
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from stbModel.StarHub.StarHub_7428 import STB_NFX_RH
from stbModel.Foxtel.Foxtel_7268 import FOXTEL_7268

class O_STBFactory:
    def __init__(self):
        pass

    @staticmethod
    def getSTB(config_item, framework):
        '''
        Parameters:
            config_item: Dictionary that holds the configuration.
            framework: Framework underlying the STB.
        Post-condition:
            Returns the STB object according to config_item['stb_model']
        '''
        if config_item['stb_model'] == '7428':
            return STB_NFX_RH.STB_NFX_RH(framework)
        elif config_item['stb_model'] == '7268':
            return FOXTEL_7268.FOXTEL_7268(framework)
        else:
            return None
        
        
