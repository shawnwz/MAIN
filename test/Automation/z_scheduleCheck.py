'''
Created on Jan 12, 2017

@author: kunwang
'''

from O_framework import O_scheduler

#Usage:
#    1. Change the values of 'schedule_file_name' and 'scripts_folder'
#    2. Run the script to see the result.
if __name__ == '__main__':     
    schedule_file_name = "execution_schedule.txt"
    scripts_folder = "TestSuite" 
    
    f_schedule = open(schedule_file_name, "r")
    arr_Tests = f_schedule.readlines()
    
    print "Input plan:"
    for item in arr_Tests:
        print '\t' + item.strip('\n')
        
    #build the ralationship among the scripts
    scheduler = O_scheduler.O_scheduler(scripts_folder, arr_Tests)    
    scheduler.buildGraph()
    scheduler.orderingGraph()
    
    #if error found
    if len(scheduler.errMessages) > 0:
        for errMsg in scheduler.errMessages:
            print("Error: {0}\n".format(errMsg))
    else:
        print "Successfully built & ordered the graph. "
        
        print "Graph built:"
        for key in scheduler.graph.keys():
            graph_item = scheduler.graph[key]            
            print "\t" + graph_item.name + ": " , graph_item.deps
            
        print "Consider list:"
        for key in scheduler.to_consider.keys():
            print "\t", key
            
        print "Generated order:"
        for item in scheduler.order:
            print '\t' + item
            
        scheduler.refine_ordering()
        print "Refined order:"
        for item in scheduler.order:
            print '\t' + item
