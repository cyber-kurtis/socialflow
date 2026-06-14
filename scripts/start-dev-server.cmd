@echo off
cd /d "%~dp0.."
set PORT=3000
echo Starting SocialFlow dev server from %CD% > dev-server.log
"C:\Program Files\nodejs\npm.cmd" run dev >> dev-server.log 2>> dev-server.err.log
echo Dev server stopped with exit code %ERRORLEVEL% >> dev-server.log
