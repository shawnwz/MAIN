# -*- coding: UTF-8 -*-
'''
Kunwang, created on November 8th, 2017
'''
import subprocess
import time
from bottle import *
import requests
import traceback

def call_foxtel_daily_testing_service():
    ret = False
    try:
        server_host='10.12.2.244'
        server_port=8080
        #http://10.12.2.244:8080/foxtel_daily_testing
        url = "http://{0}:{1}/foxtel_daily_testing".format(server_host, server_port)
        print url
        foxtel_response = requests.get(url)        
        if foxtel_response.status_code == 404:
            print "Can't call foxtel daily testing service by '{0}'!  Response [404]".format(url)
        else:
            ret = foxtel_response.content
            print "foxtel_response:", ret  
            if ret == "True":
                print "foxtel daily testing start!"
                ret = True
            else:
                print "foxtel daily testing error!"
    except Exception as e:
        print e.message
    finally:
        return ret
    
    
if __name__ == '__main__':    
    call_foxtel_daily_testing_service()

