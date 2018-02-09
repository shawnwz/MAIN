'''
Created on Nov 02, 2017

@author: yangyang
'''
#-*- conding=utf-8 -*-
import paramiko
import os
import traceback
from datetime import datetime
import shutil
import tarfile
import bz2
import time
from bottle import *

nfs_local_dir = r'/home/StormTest/flash/build/Foxtel/daily_build/7268'
zImage_dir = r'/home/StormTest/flash/zImage'
file_need_backup = os.path.join(nfs_local_dir, 'romfs')
backuped_file = os.path.join(nfs_local_dir, 'romfs_backup') 
               
def delet_file(file):
    remove_file = ''
    try:
        if os.path.exists(file):
            remove_file = file
            if os.path.isdir(file):
                shutil.rmtree(file)                
            else:                
                os.remove(file)
        else:
            print "'{0}' not exits!".format(file)
    except Exception as e:
        print traceback.print_exc()
        print "exception message: ", e.message
    finally:
        return remove_file       

def backup_last_file( file_need_backup ):
    backuped_file = ''
    try:
        if os.path.exists(file_need_backup):
            backuped_file = file_need_backup + '_backup'
            if os.path.exists(backuped_file):
                delet_file(backuped_file)
            print "backuped_file: ", backuped_file
            os.rename(file_need_backup, backuped_file)
            print "backup done!"
        else:
            print "the file '{0}' not exists!".format(file_need_backup)
    except Exception as e:
        print traceback.print_exc()
        print "exception message: ", e.message 
    finally:
        return backuped_file       

def creat_build_vrsion_file(image_folder, build_version): 
    build_vrsion_file = ''
    try:
        build_vrsion_file = os.path.join(image_folder, build_version)
        fp = open(build_vrsion_file, 'w')
        fp.close
        print "creat build vrsion file '{0}' done!".format(build_vrsion_file)
    except Exception as e:
        print traceback.print_exc()
        print "exception message: ", e.message 
    finally:
        return build_vrsion_file     

def unzip_replace_daily_build(zip_file):  
    ret = False
    try:  
        print "begain unzip file '{0}.".format(zip_file)
        cmd = "tar -xjf {0}".format(zip_file)
        print "untar cmd: ", cmd
        os.system(cmd)
        print "unzip file '{0}' done.".format(zip_file)        
        ret = True
    except Exception as e:
        print traceback.print_exc()
        print "exception message: ", e.message     
    finally:
        return ret 

@route('/nfs_service/:build_version', methods=['GET'])   
def unzip_daily_build_to_nsf_server( build_version ):
    ret = "upzip fail"
    try:  
        delet_file(backuped_file)
        backup_last_file(file_need_backup)
        image_file_list = os.listdir(nfs_local_dir)
        for image in image_file_list:
            print image
            if image.endswith('.tar.bz2'):
                unzip_replace_daily_build(os.path.join(nfs_local_dir,image))
                creat_build_vrsion_file(file_need_backup, build_version)
            if image == 'zImage':
                shutil.copyfile(os.path.join(nfs_local_dir,image), zImage_dir) 
        os.system("chmod 777 -R {0} * ".format(nfs_local_dir))
        if os.path.exists(file_need_backup):
            ret = "upzip pass"              
    except Exception as e:
        print traceback.print_exc()
        print "exception message: ", e.message  
    finally:
        return ret
    

if __name__ == "__main__":   
    nfs_server_host = '10.15.35.8'       
    run(host = nfs_server_host, port=8080)