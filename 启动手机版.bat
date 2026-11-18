@echo off
chcp 65001 >nul
title 知识闯关 - 手机版
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto NONODE

echo.
echo 正在启动知识闯关手机版，请稍等...
echo.
node "tools\serve.js"

echo.
echo 服务已停止。
pause
exit /b

:NONODE
echo.
echo 没有找到 Node.js。
echo.
echo 请先安装 Node.js（https://nodejs.org），安装后重新双击本文件。
echo 或者改用其他方式：把整个文件夹传到手机，用支持本地网页的浏览器打开 index.html。
echo.
pause