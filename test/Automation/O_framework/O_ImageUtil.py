# -*- coding: UTF-8 -*-

'''
Kunwang, created on September 20, 2017

Pre-conditions:
    a. Using 'pip install pillow'
    b. Using 'pip install pyocr'
    c. Install 'tesseract-ocr-setup-3.02.02.exe'

2017-09-20:
    Method to do ocr
2017-09-21:
    Methods to do overlay and diff
    Referenced: http://www.cnblogs.com/fnng/p/4881102.html
'''
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

#import functools
import math
import operator

from PIL import Image
import pyocr

class O_ImageUtil:
    def __init__(self):
        tools = pyocr.get_available_tools()[:]
        if len(tools) == 0:
            raise Exception("Failed to load OCR tool.")
        self.tool = tools[0]
        return

    def ocrImage(self, img_region):
        ret_str = ""        
        ret_str = self.tool.image_to_string(img_region, lang = "eng")
        ret_str = ret_str.strip()

        '''   
        try:
            ret_str = ret_str.encode(encoding='ascii')
        except Exception, e:
            ret_str = ""
        '''
        return ret_str

    #Pre-condition:
    #   img1 & img2 are the image objects to be processed.
    #   The can be generated from file, from capture device, from crop-of existing image object.
    # Post-condition:
    #   Overlay img1 with img2 and return the result image.
    def overlayImage(self, img1, img2):
        if img1 is None or img2 is None:
            raise ValueError("None is used for image overlay!")
        img1 = img1.convert('RGBA')
        img2 = img2.convert('RGBA')
        img_overlap = Image.blend(img1, img2, 0.5)
        return img_overlap.convert('RGB')
    
    #Post-condition:
    #   Compute and return the difference of the two image objects.
    def diffImage(self, img1, img2):
        h1 = img1.histogram()
        h2 = img2.histogram()
        return  math.sqrt(reduce(operator.add,  list(map(lambda a,b: (a-b)**2, h1, h2)))/len(h1) )
    

        
        
        
        
        
