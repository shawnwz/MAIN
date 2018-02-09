# -*- coding: UTF-8 -*-

'''
Kunwang, created on October 13, 2017

Pre-conditions:
    N/A

2017-10-13:
    Referenced: http://blog.163.com/db_lobster/blog/static/9639092200922511442177/
'''

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import codecs
import os

class O_LogUtil:

    #Parameters:
    #   pLogfile: path to the log file, including file name
    #   pOverwrite: remove the old file, if true; append to the file, if otherwise.
    def __init__(self, pLogfile, pOverwrite = True):
        self.logfile = pLogfile

        if pOverwrite == True:
            if os.path.exists(self.logfile):
                os.remove(self.logfile)

    #Post-condition:
    #   Append the content to the log file.
    #   All the content will be put into one-line
    def writeLine(self, pContent):
        log_str = pContent.replace('\n', '')
        log_str = log_str + '\n'

        f = codecs.open(self.logfile, "a", "utf-8")
        f.write(unicode(log_str, "utf-8"))
        f.close()
    

        
        
        
        
        
