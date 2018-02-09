# -*- coding: UTF-8 -*-

'''
Created on Nov 06, 2017

@author: yangyang
Login to the ePDU to control the power of stb.
'''

import telnetlib
import time
import traceback


class PC_CMD(object):
    LOGON = "@@@@\015\012"
    LOGOUT = "LO\015\012"
    ALLOFF = "A00\015\012"
    ALLON = "A10\015\012"
    STATE = "DX0\015\012"
    ON_SLOT = "N0{0}\015\012"
    OFF_SLOT = "F0{0}\015\012"

class PowerControler(object):
    def __init__(self, config_item):
        pcm_info = config_item['pcm_info']
        self.host = pcm_info['host']
        self.port =  pcm_info['port']
        self.timeout =  pcm_info['timeout']
        self.port_no = pcm_info['pc_port_no']
        self.telnet = None
                    
    def __del__(self):
        if self.telnet != None:
            self.telnet.sock.close()
        
    def login_to_pw(self, retry_count=3):
        try:
            if retry_count < 0:
                print "try to telnet to {0}:{1} failed 3 times!".format(self.host, self.port)
                return False
            else:
                print "try to telnet to {0}:{1}.".format(self.host, self.port)
                self.telnet = telnetlib.Telnet()                
                self.telnet.open(self.host, self.port, self.timeout)               
                print "log in with : {0}".format(PC_CMD.LOGON)
                self.telnet.write(PC_CMD.LOGON)
                log_in_buffer = self.telnet.read_until('IPC ONLINE!', timeout=10)
                #print "log_in_buffer:", log_in_buffer
                if 'IPC ONLINE!' in log_in_buffer:
                    print "log in success!"
                    return True
                else:
                    print "log in failed!"
                    retry_count = retry_count - 1
                    return self.login_to_pw(retry_count)
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message
            print "log in failed!"
            retry_count = retry_count - 1
            return self.login_to_pw(retry_count)


    def power_on_slot(self):
        ret = False
        try:            
            ret = self.login_to_pw()
            if ret:
                self.telnet.write(PC_CMD.ON_SLOT.format(self.port_no))
                log_in_buffer = self.telnet.read_until("OUTLET {0} ON".format(self.port_no))
                #print "log_in_buffer:", log_in_buffer
                if "OUTLET {0} ON".format(self.port_no) in log_in_buffer:
                    ret = True
                    print " power on slot {0} done!".format(self.port_no)
                else:
                    print " power on slot {0} failed!".format(self.port_no)
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message
        finally:           
            return ret        


    def power_off_slot(self):
        ret = False
        try:            
            ret = self.login_to_pw()
            if ret:
                self.telnet.write(PC_CMD.OFF_SLOT.format(self.port_no))
                log_in_buffer = self.telnet.read_until("OUTLET {0} OFF".format(self.port_no))
                #print "log_in_buffer:", log_in_buffer
                if "OUTLET {0} OFF".format(self.port_no) in log_in_buffer:
                    ret = True
                    print " power off slot {0} done!".format(self.port_no)
                else:
                    print " power off slot {0} failed!".format(self.port_no)
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message
        finally:           
            return ret       

    def reboot_slot(self, delay=5):
        ret = False
        try:            
            ret = self.login_to_pw()
            if ret:
                off_ret = self.power_off_slot()
                time.sleep(delay)
                on_ret = self.power_on_slot()                
                if on_ret and off_ret :
                    ret = True
                    print " reboot port {0} done!".format(self.port_no)
                else:
                    print " reboot port {0} failed!".format(self.port_no)                    
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message
        finally:           
            return ret  

if __name__ == "__main__":
    host = '10.12.2.240'
    port = 24
    timeout = 30 
    
    PWC = PowerControler(host, port, timeout)
    PWC.reboot_slot(1)
#     PWC.power_on_slot(1)
#     time.sleep(3)
#     PWC.power_off_slot(1)
#     telnet = telnetlib.Telnet(host, port)
#     print telnet
#     telnet.set_debuglevel(debuglevel=10)
#     #print telnet
#     #telnet.open(host='10.12.3.6')
#     print r"try to telnet to {0}:{1}.".format(host, port)
#     time.sleep(2)
#     telnet.write("@@@@\015\012")
#     #telnet.write(username + r"\n")
# #     print r"enter username : {0}".format(username)
#     telnet.read_until("IPC ONLINE!")
#     telnet.write('F01\015\012')
#     print "log in "
#     telnet.sock.close()
#     
    
   