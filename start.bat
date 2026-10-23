@echo off
cd /d %~dp0

set /a PORT=8000 + %RANDOM% %% 1000

start /b python -m http.server %PORT%
timeout /t 1 /nobreak >nul
start http://localhost:%PORT%/index.html

pause