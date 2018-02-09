'''
Created on Jan 12, 2017

@author: kunwang
'''

import getopt
import os
import subprocess
import sys

#Supported flags:    
#    SEC: start of section(step)
#    SEN: end of section(step)
#    DBG: debug output for developer
#    ERR: error while execution
#    LOG: general log for log-file reader(QA)
#    SCR: tag to include screen-link
#    CHK: info to help log-file-reader to high-light the check point
if __name__ == '__main__': 
    opts, args = getopt.getopt(sys.argv[1:], "d:")         
    folderName = opts[0][1]
    
    log_filename = r"{0}\stdout.txt".format(folderName)
    f_in = open(log_filename, "r")
    
    html_file = r"{0}\logfile.html".format(folderName)
    if os.path.exists(html_file):
        os.remove(html_file)
        
    html_file_tmp = r"{0}\logfile.tmp".format(folderName)
    if os.path.exists(html_file_tmp):
        os.remove(html_file_tmp)
    f_out = open(html_file_tmp, "a")
    
    #start from 0
    node_id = 0
    

    #copy items used for log-file
    str_command = r"copy O_framework\hideLevel.png {0}".format(folderName)
    process = subprocess.Popen(str_command.strip(), shell=True)      
    process.wait()
    str_command = r"copy O_framework\showLevel.png {0}".format(folderName)
    process = subprocess.Popen(str_command.strip(), shell=True)      
    process.wait()
    str_command = r"copy O_framework\treeview-sprite.gif {0}".format(folderName)
    process = subprocess.Popen(str_command.strip(), shell=True)      
    process.wait()
    str_command = r"copy O_framework\log_header.txt {0}".format(folderName)
    process = subprocess.Popen(str_command.strip(), shell=True)      
    process.wait()
    
    #write contents
    for line in f_in:
        if line.startswith('2') != True:
            continue
        
        arr_tmp = line.split(':')
        f_out.write("<row>")         
        
        if arr_tmp[1] == "SEC":            
            #increase node_id firstly
            node_id = node_id + 1
            #start of section
            if node_id == 1:
                #the 1st section, add node-div-mark directly
                f_out.write("<div class = 'node collapsed' nodeid = '{0}'>".format(node_id))
                #add title of the node
                f_out.write("<div class = 'nodetitle nodetitle-pass' nodeid = '{0}'>".format(node_id))
                f_out.write("{0}".format(line[len(arr_tmp[0]) + 5:]))
                f_out.write("</div>")
                f_out.write("<div class = 'nodecontent'>")
            else:
                #not the 1st section, add end-of-div for the last section
                f_out.write("</div>")
                f_out.write("</div>")
                f_out.write("<div class = 'node collapsed' nodeid = '{0}'>".format(node_id))
                #add title of the node
                f_out.write("<div class = 'nodetitle nodetitle-pass' nodeid = '{0}'>".format(node_id))
                f_out.write("{0}".format(line[len(arr_tmp[0]) + 5:]))
                f_out.write("</div>")
                f_out.write("<div class = 'nodecontent'>")
        else:                   
            if arr_tmp[1] == "SEN" and node_id != 0:
                #there is at-least one section, need to close it.
                #if node_id == 0, there is no section, just ignore this mark
                f_out.write("</div>")
                f_out.write("</div>")
            else:                    
                if arr_tmp[1] == "DBG":
                    #debug info, use console
                    f_out.write("<p class = 'console'>")     
                    #add time-stamp
                    f_out.write("<span class = 'ts'>{0}</span>".format(arr_tmp[0]))     
                    #add message
                    f_out.write("<span class = 'msg'>{0}<br></span>".format(line[len(arr_tmp[0]) + 5:]))
                    #close mark
                    f_out.write("</p>")
                else:
                    if arr_tmp[1] == "ERR":
                        #error, use error
                        f_out.write("<p class = 'error'>")     
                        #add time-stamp
                        f_out.write("<span class = 'ts'>{0}</span>".format(arr_tmp[0]))     
                        #add message
                        f_out.write("<span class = 'msg'>{0}<br></span>".format(line[len(arr_tmp[0]) + 5:]))
                        #close mark
                        f_out.write("</p>")
                    else:
                        if arr_tmp[1] == "LOG":
                            #log, use info
                            f_out.write("<p class = 'info'>")     
                            #add time-stamp
                            f_out.write("<span class = 'ts'>{0}</span>".format(arr_tmp[0])) 
                            #add message
                            f_out.write("<span class = 'msg'>{0}<br></span>".format(line[len(arr_tmp[0]) + 5:]))
                            #close mark
                            f_out.write("</p>")
                        else:
                            if arr_tmp[1] == "SCR":
                                #screen, use off
                                f_out.write("<p class = 'off'>")     
                                path_tmp = line.split(' ')
                                f_out.write("<img src = '{0}'  align = 'middle'/>".format(path_tmp[-1]))
                                #close mark
                                f_out.write("</p>")
                            else:
                                if arr_tmp[1] == "CHK":
                                    #check point, use warning
                                    f_out.write("<p class = 'warning'>")     
                                    #add time-stamp
                                    f_out.write("<span class = 'ts'>{0}</span>".format(arr_tmp[0])) 
                                    #add message
                                    f_out.write("<span class = 'msg'>{0}<br></span>".format(line[len(arr_tmp[0]) + 5:]))
                                    #close mark
                                    f_out.write("</p>")
                                
    
    f_in.close()
    
    
    f_out.write("</div>")
    f_out.write("</div>")
    f_out.write("</body>")
    f_out.write("</html>")
    f_out.close()
    
    #link files
    str_command = r"type {0}\log_header.txt {0}\logfile.tmp >> {0}\logfile.html".format(folderName)
    process = subprocess.Popen(str_command.strip(), shell=True)      
    process.wait()
    
    
    