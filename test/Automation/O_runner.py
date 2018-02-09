# -*- coding: UTF-8 -*-
'''
Kunwang, created on Jan 12, 2017
2017-08-30:
    Added the logic to check test result, using return code.
2017-11-01, Kunwang:
    Abstracted the execution action into script runner.
    Remove the code to process FTP related work.
2017-11-03, Kunwang:
    Added time-stamp into the name of the log file.
    Remove the code used to delete old log file.
    Adjust the output format of the plan/execution-order in log file.
'''

import datetime
import os
import subprocess
import time

from O_framework import O_scheduler
from O_framework import O_LogUtil
from script_runner import ScriptRunner

#no space allowed for test_name!
#test_name should start with [a-zA-z], only contain [a-zA-z0-9_]
ARR_TEST = ["NFX_001_Test.py",]

if __name__ == '__main__':
    ###
    ###    parameters
    ###
    #which redrat to be used for the cases driven by this runner.
    slot_id = "1"

    #The folder where all the scripts saved-in.
    #Graph will be created for these scripts to define there relative-execution order.
    folder_store = "TestSuite"

    #The file contains the test-scripts to be executed.
    #The scripts will be executed following their order in the calculated graph.
    schedule_file_name = "execution_schedule.txt"

    #The log-file that will be used to store the trace of the whole execution.
    LOG_FILENAME = r"Log\{0}_runner_log.txt".format(datetime.datetime.now().strftime("%Y%m%d%H%M"))
    LOGGER = O_LogUtil.O_LogUtil(LOG_FILENAME, pOverwrite=False)

    #Add error-message to execution-log, if schedule-file not found.
    if not os.path.exists(schedule_file_name):
        LOGGER.writeLine("Expected schedule-file {0} not found!".format(schedule_file_name))
    else:
        SCHEDULE_FILE = open(schedule_file_name, "r")
        ARR_TEST = SCHEDULE_FILE.readlines()
        SCHEDULE_FILE.close()

    #Add the scheduled scripts into execution-log, for trace.
    LOGGER.writeLine("Input plan:")
    for item in ARR_TEST:
        LOGGER.writeLine(item.strip('\n'))

    #Build the ralationship among the scripts
    #Ordering the scripts
    #Mapping the ordering with the scheduled cases to get the final execution plan
    SCHEDULER = O_scheduler.O_scheduler(folder_store, ARR_TEST)
    SCHEDULER.buildGraph()
    SCHEDULER.orderingGraph()
    SCHEDULER.refine_ordering()

    #if error found
    if SCHEDULER.errMessages:
        for errMsg in SCHEDULER.errMessages:
            LOGGER.writeLine("Error: {0}".format(errMsg))
        exit()
    else:
        ARR_TEST = SCHEDULER.order
        #Add the final ordering to execution-log, for trace.
        LOGGER.writeLine("Execution order:")
        for item in ARR_TEST:
            LOGGER.writeLine(item.strip('\n'))

    #ARR_TEST now contains the final-execution-plan:
    #    a. the format-check has been done for each item.
    #    b. the defined script must exists in folder_store.
    #process to execution each script defined in ARR_TEST
    for item in ARR_TEST:
        item = item.strip('\n')

        #case not run
        if SCHEDULER.graph[item].executionStatus == "None":
            #create folder for traces
            str_tmp = item.split('.')[0]
            folderName = "log_" + str(int(time.time() * 100)) + "_" + str_tmp
            os.mkdir(folderName)

            #copy test script out-of-testSuite into current-folder.
            str_command = r"copy {0}\{1}".format(folder_store, item)
            process = subprocess.Popen(str_command.strip(), shell=True)
            process.wait()

            #use runner to execute the test script
            temp_runner = ScriptRunner(LOGGER)
            str_tmpResult = temp_runner.run_script(item, folderName, slot_id)

            #update the status in the schedule
            SCHEDULER.graph[item].executionStatus = str_tmpResult
            SCHEDULER.updateExecutionResult(SCHEDULER.graph[item])

            #delete test script
            str_command = r"del {0}".format(item)
            process = subprocess.Popen(str_command.strip(), shell=True)
            process.wait()

            #generate html log-file
            str_command = r"python z_logCollector.py -d {0}".format(folderName)
            process = subprocess.Popen(str_command.strip(), shell=True)
            process.wait()
    #write results to log-file
    LOGGER.writeLine("Execution result:")
    for tmp_key in ARR_TEST:
        tmp_key = tmp_key.strip('\n')
        tmp_item = SCHEDULER.graph[tmp_key]
        LOGGER.writeLine("{0}, {1}".format(tmp_key, tmp_item.executionStatus))

    #print execution log on console
    str_command = r"type %s"%LOG_FILENAME
    subprocess.Popen(str_command.strip(), shell=True).wait()
