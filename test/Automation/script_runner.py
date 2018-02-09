# -*- coding: UTF-8 -*-
'''
Kunwang, created on October 30th, 2017
2017-11-01, Kunwang:
    Implemented the method 'run_script'
'''
import subprocess
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

class ScriptRunner(object):
    '''
    Runner to execute test scripts
    '''
    def __init__(self, logger):
        '''
        Use the assigned logger to initialize the runner.
        '''
        self.logger = logger
        return

    def run_script(self, script_name, folder_name, slot_id):
        '''
        Pre-condition:
            The script has been copied into the same folder as this runner.
            This runner doesn't hold the responsibility of copying the script.
        Post-condition:
            Return the execution result: Pass/Fail/Error
        Parameters:
            script_name: The script for this runner to execute.
            folder_name: The folder for the script to save its log.
            slot_id: The slot on which the script to be executed on.
        '''
        #Add trace to self-log.
        self.logger.writeLine("Test: {0}, log-dir: {1}, slot_id = {2}".format(script_name, folder_name, slot_id))

        #execute test
        str_command = r"python {0} -d {1} -r {2}".format(script_name, folder_name, slot_id)
        process = subprocess.Popen(str_command.strip(), shell=True)
        process.wait()

        #Record the result
        temp_result = "Pass"
        if process.returncode == 1:
            temp_result = "Fail"
        if process.returncode == 2:
            temp_result = "Error"
        return temp_result
