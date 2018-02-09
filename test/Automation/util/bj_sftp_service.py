import paramiko
import os
import traceback
from datetime import datetime
import shutil
import tarfile
import bz2
import time
import requests

host ='sftp-bej.nagra.com'
port = 22
username = 'apac_ce'
password = '8ney3T6nV'
sftp_local_dir = r'Y:\Foxtel\daily_build\7268'
remote_dir = r'/apac_ce/FOXTEL/daily_builds/sdk_foxtel_puck' 

class SFTP_Service():
    def __init__(self, host, port, username, password, local_dir, default_remote_dir, timeout = 60):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.local_dir = local_dir
        self.default_remote_dir = default_remote_dir
        self.timeout = timeout
        self.sf = None
        self.sftp = None
        self.file_list = []
        
    def __del__(self):
        if self.sf != None:
            self.sf.close()
        
    def login(self):
        try:
            self.sf = paramiko.Transport((self.host, self.port))
            print "connect success!"
            self.sf.connect(username = self.username, password = self.password)
            self.sftp = paramiko.SFTPClient.from_transport(self.sf)
            print "log in success!"
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message

    def list_files(self, path=''):
        remote_path = ''
        dir_list = []
        try:
            if self.sftp != None:
                if self.default_remote_dir not in path:
                    remote_path = "{0}/{1}".format(self.default_remote_dir, path)
                else:
                    remote_path = path
                print "remote_path: ", remote_path
                dir_list = self.sftp.listdir_attr(remote_path)                    
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message    
        finally:
            return remote_path , dir_list

    def download_file(self, remotefile, local_dir=''):
        download_ret = False
        download_file = ''
        try:
            remote_file_name = os.path.basename(remotefile)
            print "remote_file_name: ", remote_file_name
            if local_dir == '':
                local_dir = self.local_dir
                print "local_dir: ",local_dir
            if not os.path.exists(local_dir):
                os.makedirs(local_dir, 0777)
            if os.path.isdir(local_dir) and os.path.exists(local_dir):
                local_file = os.path.join(local_dir, remote_file_name)
                print "local_file: ", local_file
                self.sftp.get(remotefile, local_file)
                print "download"      
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message    
        finally:
            return download_ret, download_file       
    
    def found_daily_latest_build(self, daily_build_folder ,daily_date=datetime.now()):
        latest_build_folder = ''
        try:
            #print type(daily_date)
            latest_build_st_mtime = 0
            latest_build = None
            if not isinstance(daily_date, str):
                daily_date = daily_date.strftime('%Y-%m-%d')
                print daily_date
            ret = self.list_files(daily_build_folder)
            daily_build_root_path = ret[0]
            daily_build_list = ret[1]
            print daily_build_list
            for folder in daily_build_list:            
                if daily_date in folder.filename:
                    print folder.filename, folder.st_mtime
                    if folder.st_mtime > latest_build_st_mtime:
                        latest_build_st_mtime = folder.st_mtime
                        latest_build = folder
            if latest_build != None:
                latest_build_folder = "{0}/{1}".format(daily_build_root_path, latest_build.filename)                           
                print "latest_build: ", latest_build.filename, latest_build.st_mtime
            else:
                print "not find the latest build !"            
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message    
        finally:
            print "latest_build_folder: ", latest_build_folder
            return latest_build_folder        
            
    def download_daily_latest_build(self, daily_build_folder ,daily_date=datetime.now()):
        download_flag = False 
        latest_build_folder = ""
        print "daily_date: ", daily_date        
        try:
            latest_build_folder = self.found_daily_latest_build(daily_build_folder ,daily_date=daily_date)
            print "latest_build_folder: ", latest_build_folder
            ret = self.list_files(path=latest_build_folder+'/images')        
            iamge_file_path = ret[0]
            image_file_list = ret[1]
            print image_file_list
            for f in image_file_list:
                if '.img' not in f.filename:
                    remotefile = "{0}/{1}".format(iamge_file_path, f.filename)
                    self.download_file(remotefile, self.local_dir)
            download_flag = True
        except Exception as e:
            print traceback.print_exc()
            print "exception message: ", e.message    
        finally:
            return download_flag, latest_build_folder

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
  
def upload_daily_build_to_nsf_server(daily_date=datetime.now().strftime('%Y-%m-%d')):
    build_version = ''
    try:  
        print "test"
        tar_file = os.path.join(sftp_local_dir, 'nfsroot-7268a0.tar.bz2')  
        print tar_file                 
        delet_file(tar_file)
        time.sleep(3)
        SFTP = SFTP_Service(host, port, username, password, sftp_local_dir, remote_dir)
        SFTP.login()  
        ret = SFTP.download_daily_latest_build(remote_dir, daily_date)
        build_version = os.path.split(ret[1])[1]
        print build_version
        if ret[0] == True:
            print "download build '{0} done!".format(build_version) 
        else:
            print "download build '{0} fail!".format(build_version)                      
    except Exception as e:
        print traceback.print_exc()
        print "exception message: ", e.message  
    finally:
        return build_version
        

def call_nfs_service_unzip_file(build_version):
    ret = False
    try:
        server_host='10.15.35.8'
        server_port=8080
        url = "http://{0}:{1}/nfs_service/{2}".format(server_host, server_port, build_version)
        print url
        nfs_response = requests.get(url)        
        if nfs_response.status_code == 404:
            print "Can't call sft service by '{0}'!  Response [404]".format(url)
        else:
            unzip_ret = nfs_response.content
            print "unzip result:", unzip_ret  
            if unzip_ret == "upzip pass":
                ret = True    
    except Exception as e:
        print e.message
    finally:
        return ret

def update_unzip_nsf_server(daily_date=datetime.now().strftime('%Y-%m-%d')):
    print "daily_date:", daily_date
    build_version = upload_daily_build_to_nsf_server(daily_date)
    print build_version
    if build_version != "" and call_nfs_service_unzip_file(build_version):
        return True        
    else:
        return False  
          
if __name__ == "__main__":
    update_unzip_nsf_server()
    #upload_daily_build_to_nsf_server()
