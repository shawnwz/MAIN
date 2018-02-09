'''
Kunwang, created on Mar 22, 2017
2017-08-30:
    Added methods to record & update execution status

'''
import os
import re

class TestScript(object):
    def __init__(self):
        #name of the script
        self.name = "None"
        
        #scripts that depends on this one
        self.deps = []
        
        #Review status:
        #    No: Not reviewed yet
        #    In-progress: scripts depends on this one are being reviewed
        #    Done: This one, and scripts depends on this one have all been reviewed.
        self.revieweStatus = "No"

        #Execution result:
        #   None:   Initial value, no meaning
        #   Pass:   Executed and passed
        #   Fail:   Executed and failed
        #   Block:  The script it depends on is 'fail' or 'block'
        #   Error:  Unexpected error occurs during the execution. Something need to be fixed by QA
        self.executionStatus = "None"
        
        
#Pre-condition:
#    There is one folder containing ALL the python-test-scripts. They make the test-system.
#    There is one array containing the names of the python-scripts for current plan.
#    If script-B should be executed after script-A, then script-B will have one line to define this relationship.
#Post-condition:
#    The scripts for current plan are ordered so that script-A is prior-to script-B, if script-B is defined to be exeucted after script-A.
#Example usage:
    '''
        arr_Tests = ['a.python', 'b.python'] #some array containing scripts for current plan.
        folder_store = "TestSuite"    #some folder contains all the scripts that make the test-system.
        
        #build the ralationship among the scripts
        scheduler = O_scheduler.O_scheduler(folder_store, arr_Tests)    
        scheduler.buildGraph()
        scheduler.orderingGraph()
        scheduler.refine_ordering()
        
        #if error found
        if len(scheduler.errMessages) > 0:
            for errMsg in scheduler.errMessages:
                print("Error while building execution ordering: {0}\n".format(errMsg))
            exit()
        else:        
            for item in scheduler.order:
                print '\t' + item
        exit()
    '''
class O_scheduler():
    #Parameters:
    #    addr: folder that contains all the scripts, relative-path
    #    arrScripts: script in current-plan
    def __init__(self, addr, arrScripts = []):
        self.name = "Scheduler"
        
        self.arr_scripts = arrScripts
        
        addr = addr.strip()
        if len(addr) == 0:
            #current folder
            self.addr = "."
        else:
            self.addr = addr
        
        self.errMessages = []
        self.graph = {}
        self.to_consider = {}
        self.order = []
        self.cycle_detail = []
        
        #initial the files to be considered for current plan        
        if len(self.arr_scripts) == 0:
            self.errMessages.append("The plan contains 0 scripts.")
            self.to_consider = {}
        else:
            for fscript in self.arr_scripts:
                #check that it is python script. 
                #remove '\n'            
                fscript = fscript.strip('\n')  
                result = re.match( r'[A-Za-z]\w*[.][p][y]$', fscript, re.I)  
                if not result:
                    #plan contains illegal file-name
                    self.errMessages.append("{0} is not a valid python script name.".format(fscript))
                else:                    
                    tmp_path = r"{0}\{1}".format(self.addr, fscript)
                    if not os.path.exists(tmp_path):
                        #plan refers to a non-existing script.
                        self.errMessages.append("{0} doesn't exist, but is provided in the plan.".format(tmp_path))
                    else:
                        self.to_consider[fscript] = "Y"
        return
    
    #Post-condition:
    #    Build graph for all the scripts under self.addr
    def buildGraph(self):
        #Error if target folder doesn't exist
        if not os.path.exists(self.addr):
            self.errMessages.append("Folder {0} doesn't exist.".format(self.addr))
        else:
            #initial the graph with valid python script files in the folder.
            #this is mandatory, since the dependency-information in the script should be 'reversed' when building the graph.
            list_files = os.listdir(self.addr)
            for n_file in list_files:
                if os.path.splitext(n_file)[1] == '.py':
                    if os.path.splitext(n_file)[0] != "__init__":                
                        #Initialize TestScript item to hold the information
                        scr_tmp = TestScript();
                        scr_tmp.name = n_file;
                        scr_tmp.deps = []
                        self.graph[n_file] = scr_tmp
                        
            #now process each file in the graph to insert the dependency information.
            for n_file in self.graph.keys():
                current_processed = self.graph[n_file]
                tmp_path = r"{0}\{1}".format(self.addr, current_processed.name)
                
                #process the file line-by-line to find the dependency information
                #dependency information should be defined before line 'def test_body(frame):' for easy to find.
                #format should like: #deps: NFX_001_Test.py, NFX_001_Test.py
                f = open(tmp_path, "r")
                f_lines = f.readlines()
                if len(f_lines) != 0:
                    isFinished = False
                    for tmp_line in f_lines:
                        if isFinished == False:                                    
                            tmp_line = tmp_line.strip('\n')
                            tmp_line = tmp_line.strip()
                            
                            result = re.match( r'#deps: ', tmp_line, re.I)
                            if not result:
                                #check for the end-condition
                                result = re.match( r'def test_body(frame)', tmp_line, re.I)
                                if result:
                                    isFinished = True
                            else:
                                #find it
                                tmp_line = tmp_line[6:].replace(" ", "").strip()
                                if len(tmp_line) > 0:
                                    tmp_line = tmp_line.split(',')
                                    if len(tmp_line) > 0:
                                        for tmp_deps in tmp_line:
                                            if self.graph.has_key(tmp_deps):
                                                self.graph[tmp_deps].deps.append(current_processed.name)
                                            else:
                                                self.errMessages.append("{0} has one in-valid dependency: {1}.".format(current_processed.name, tmp_deps))
                                    
                f.close()
        return
    
    #Post-condition:
    #    if cycle detected, return array that describes the cycle
    def cycleDectect_recursive(self, obj_tmp, path_dict):    
        cycle_tmp = []
        #mark it as being reviewing.
        obj_tmp.revieweStatus = "In-progress"
        
        
        #get scripts that depends on it
        for id_tmp in obj_tmp.deps:
            dep_tmp = id_tmp
            
            path_dict[obj_tmp.name] = "N/A"
            if(self.graph[dep_tmp].revieweStatus == "No"):
                path_dict[obj_tmp.name] = dep_tmp            
                cycle_tmp = self.cycleDectect_recursive(self.graph[dep_tmp], path_dict)
                if(len(cycle_tmp) != 0):
                    return cycle_tmp
            else:
                if(self.graph[dep_tmp].revieweStatus == "In-progress"):
                    #find cycle         
                    cycle_tmp = []
                    cycle_tmp.append(dep_tmp)
    
                    cycle_flag = dep_tmp
                    while(path_dict[cycle_flag] != "N/A"):
                        cycle_flag = path_dict[cycle_flag] 
                        cycle_tmp.append(cycle_flag)
                    
                    cycle_tmp.append(dep_tmp)
                    return cycle_tmp
        
        obj_tmp.revieweStatus = "Done"
        return cycle_tmp
    
    #Post-condition:
    #    return cycle_found == True, if cycle detected.
    #    self.cycle_detail will contain the cycle information, if detected.
    def cycleDectect(self):
        cycle_found = False
        self.cycle_detail = []
        path_dict = {}
        for item in self.graph.keys():
            if cycle_found == False:
                scr_tmp = self.graph[item]
                if scr_tmp.revieweStatus == "No":
                    self.cycle_detail = self.cycleDectect_recursive(scr_tmp, path_dict)
                    if len(self.cycle_detail) != 0:      
                        cycle_found = True
        return cycle_found

    #Pre-condition:
    #    buildGraph() should have been called to build the graph
    #Post-condition:
    #    Generate Topology ordering of the graph, into self.order.
    #Exception:
    #    If cycle detected, self.order will be kept empty.
    def orderingGraph(self):
        self.order = []
        
        if self.cycleDectect() == True:
            #cycle found
            self.errMessages.append("Found cycle in the graph: {0}".format(self.cycle_detail))
        else:        
            #no cycle
            #re-set review status:        
            for item in self.graph.keys():
                scr_tmp = self.graph[item]
                scr_tmp.revieweStatus = "No"
                
            #ordering
            for item in self.graph.keys():
                scr_tmp = self.graph[item]
                if scr_tmp.revieweStatus == "No":
                    self.topo_order_recursive(scr_tmp)
        return
    
    #Pre-condition:
    #    orderingGraph() should have been invoked to generate the order of the graph
    #Post-condition:
    #    script that are not in current-plan are remove from the order.
    #    self.order will only contains those scripts that has value == Y in self.to_consider, in-case some script in the graph not included in current plan.
    def refine_ordering(self):
        tmp_order = []
        
        #the whole graph has been ordered, now we need to remove those not in current plan from the order.
        for item in self.order:
            if self.to_consider.has_key(item):
                tmp_order.append(item)
        self.order = tmp_order
        return
    
    def topo_order_recursive(self, obj_tmp):    
        #mark it as being reviewed.
        obj_tmp.revieweStatus = "Done"
        
        #get scripts that depends on it
        for id_tmp in obj_tmp.deps:
            dep_tmp = id_tmp
            
            if(self.graph[dep_tmp].revieweStatus == "No"):         
                self.topo_order_recursive(self.graph[dep_tmp])
        
        obj_tmp.revieweStatus = "Done"
        self.order.insert(0, obj_tmp.name)
        return

    def updateExecutionResult(self, obj_tmp):
        if obj_tmp.executionStatus == "Pass" or obj_tmp.executionStatus == "Error" or obj_tmp.executionStatus == "None":
            return

        for id_tmp in obj_tmp.deps:
            self.graph[id_tmp].executionStatus = "Block"
            self.updateExecutionResult(self.graph[id_tmp])
        return
            
            
            
            
            
            
            
            
            
            
            
            
            
            