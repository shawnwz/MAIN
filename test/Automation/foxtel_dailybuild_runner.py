# -*- coding: UTF-8 -*-
'''
Kunwang, created on November 8th, 2017
'''
import traceback
import subprocess
import time
from bottle import *
import logging
import thread

logging.basicConfig(level = logging.DEBUG,
                    format ="%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s",
                    datafmt ="%Y-%m-%d %H-%M-%S",
                    filename = "foxtel_dailybuild_runner.log",
                    filemode = "w"
                    )

def foxtel_daily_build_process():
    try: 
        #delete ''
        str_command = r"echo >runner_busy.txt"
        logging.debug(str_command)
        ret = subprocess.Popen(str_command.strip(), shell=True).wait()
        logging.debug(ret)        
                      
        #delete old log-files
        str_command = r"del Log\*.txt"
        logging.debug(str_command)
        ret = subprocess.Popen(str_command.strip(), shell=True).wait()
        logging.debug(ret)
        
        #prepare the schedule to flash the STB
        str_command = r"type TestSuite\schedule_flash7268nfs.txt > execution_schedule.txt"
        logging.debug(str_command)
        ret = subprocess.Popen(str_command.strip(), shell=True).wait()
        logging.debug(ret)
        
        #invoke O_runner for the 1st time
        str_command = r"python O_runner.py"
        logging.debug(str_command)
        ret = subprocess.Popen(str_command.strip(), shell=True).wait()
        logging.debug("return flash result: {0}".format(ret))
        #time.sleep(60)
    
        #prepare the schedule
        str_command = r"type TestSuite\schedule_sanity.txt > execution_schedule.txt"
        logging.debug(str_command)
        ret = subprocess.Popen(str_command.strip(), shell=True).wait()
        logging.debug(ret)
        
        #invoke O_runner for the 2nd time
        str_command = r"python O_runner.py"
        logging.debug(str_command)
        ret = subprocess.Popen(str_command.strip(), shell=True).wait()
        logging.debug(ret)
                       
    except Exception as e:
        print e.message 
        logging.debug(traceback.print_exc())
    finally:
        #create file runner_free.txt to mark runner status
        str_command = r"del runner_busy.txt"
        logging.debug(str_command)
        ret = subprocess.Popen(str_command.strip(), shell=True).wait()
        logging.debug(ret)        

@route('/foxtel_daily_testing', methods=['GET'])
def kick_off_foxtel_daily():
    if not os.path.exists(r"runner_busy.txt"):    
        thread.start_new_thread(foxtel_daily_build_process, ())
        logging.debug(r"Krunner is free, get foxtel_daily_testing notify.")
        return "True"
    else:
        logging.debug(r"Krunner is busy, refuse this foxtel_daily_testing notify.")
        return "False"
    

if __name__ == '__main__':    
    nfs_server_host = '10.12.2.244'       
    run(host = nfs_server_host, port=8080)

