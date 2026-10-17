@echo off
chcp 65001 >nul
title HTB Certified Defensive Security Analyst
cd /d "%~dp0"

py -3 -c "import sys" >nul 2>&1
if %errorlevel%==0 (
  py -3 server.py %*
  goto end
)

python -c "import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)" >nul 2>&1
if %errorlevel%==0 (
  python server.py %*
  goto end
)

wsl -e python3 -c "import sys" >nul 2>&1
if %errorlevel%==0 (
  echo Khong thay Python tren Windows - chay bang Python trong WSL...
  start "" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:8765/"
  wsl -e python3 server.py --host 0.0.0.0 --no-browser %*
  goto end
)

echo.
echo [!] Khong tim thay Python 3 tren may.
echo     Cai Python tai https://www.python.org/downloads/
echo     (nho tick "Add python.exe to PATH"), roi chay lai start.bat.
echo.

:end
pause
