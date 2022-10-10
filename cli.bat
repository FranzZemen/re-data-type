@echo off
IF %1 EQU data (node publish/cli %1=%2) ELSE (node publish/cli %1)

