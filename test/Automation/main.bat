ftp -n -s:"ftp_opt.bat" 

if "%1%"=="debug" goto B
if "%1%"=="schedule" goto A


:A
copy TestSuite\execution_schedule.txt
goto start_run

:B
copy TestSuite\debug.txt execution_schedule.txt /y
goto start_run

:start_run

python O_runner.py

ftp_uploads.bat
ftp_uploads.bat
ftp_uploads.bat
