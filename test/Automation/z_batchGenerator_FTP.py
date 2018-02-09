'''
Created on Apr 18th, 2017
@author: kunwang
'''

import getopt
import sys

#Logic:
#    given the path of the log-file, this file will:
#        a. Read the content of the log-file 
#        b. Generate the temporary-batch-file to upload proper files to FTP
#        c. Append invoking statement to the temporary-batch-file into the upload-batch-file.
#Parameters:    
#    -d: directory where the log-file locates
#Example:
#    python z_batchGenerator_FTP.py -d logDir -r upload_bat
if __name__ == '__main__': 
    opts, args = getopt.getopt(sys.argv[1:], "d:r:")         
    folderName = opts[0][1]
        
    ftp_assigned_root = "Kun"
    ftp_log_folder = "OnSite_AutoLogs"
    
    #The batch file used to upload log-files to server. 
    #This file will be automatically generated during the execution.
    ftp_upload_filename = opts[1][1]
    
    #img_log_only = True:     The captured video will NOT be uploaded to server.
    #img_log_only = False:    The catpured video will be uploaded to server.
    img_log_only = True
    
    #append the command to batch file, to upload files to ftp
    f_ftp_specialName = r"ftp_tmp_{0}.bat".format(folderName)
    f_ftp_special = open(r"{0}".format(f_ftp_specialName), "a")
    f_ftp_special.write("open ftp.nagra.com\n")
    f_ftp_special.write("user shubgw Lp99v2KQ\n")
    f_ftp_special.write("prompt\n")
    f_ftp_special.write("cd {0}\n".format(ftp_assigned_root))
    f_ftp_special.write("cd {0}\n".format(ftp_log_folder))
    
    f_ftp_special.write("mkdir {0}\n".format(folderName))            
    f_ftp_special.write("cd {0}\n".format(folderName))
    f_ftp_special.write("lcd {0}\n".format(folderName))
    
    #read the images used by the html-log-file.
    ana_filename = r"{0}\stdout.txt".format(folderName)
    f_in = open(ana_filename, "r")
    for line in f_in:
        if line.startswith('2') != True:
            continue
        arr_tmp = line.split(':')
        if arr_tmp[1] == "SCR":
            path_tmp = line.split(' ')
            path_tmp = path_tmp[-1]
            
            #add ftp command to upload this image.
            f_ftp_special.write("mput {0}\n".format(path_tmp.strip()))
    if img_log_only == False:
        f_ftp_special.write("mput *.avi\n")
    
    f_ftp_special.write("mput *.gif\n")
    f_ftp_special.write("mput *.png\n")
    f_ftp_special.write("mput *.html\n")
    f_ftp_special.write("mput stdout.txt\n")
    f_ftp_special.write("cd ..\n")
    f_ftp_special.write("lcd ..\n")
    f_ftp_special.write("bye\n")
    f_ftp_special.close()
    
    #append command to main.bat to invoke this bat
    f_ftp = open(ftp_upload_filename, "a")
    f_ftp.write("ftp -n -s:\"{0}\"\n".format(f_ftp_specialName))
    f_ftp.close()
    
    