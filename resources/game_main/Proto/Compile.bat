@echo off
set CurrentDir=%~dp0
set ProtoDir=%CurrentDir%
set CppOutDir=%CurrentDir%..\cpp
set JavaOutDir=D:\my-github\server3.0\message\src
set PbDir=%CurrentDir%..\pb
set DestPbDir=%CurrentDir%..\EncryptDestPb
set NewDestPbDir=%CurrentDir%..\EncryptNewDestPbDir

set ANT_HOME=%CurrentDir%\..\apache-ant-1.9.3
set PATH=%ANT_HOME%\bin;%PATH%

color 0e

echo CurrentDir:        [%CurrentDir%]
echo ProtoDir:          [%ProtoDir%]
echo C++ OutputDir:     [%CppOutDir%]
echo Java OutputDir:    [%JavaOutDir%]
echo PbDir:             [%PbDir%]
echo DestPbDir:         [%DestPbDir%]

echo Start compile proto file

cd /d "%CurrentDir%"
setlocal enabledelayedexpansion
for /f "delims=" %%i in ('dir /a-d /b *.proto') do (
    set pbname=%%i
    set pbname=!pbname:~0,-5!pb
    protoc -I %CurrentDir% --descriptor_set_out ../pb/!pbname! %ProtoDir%%%i
)
rem PbEncrypt.exe

rem del /q %DestPbDir%\*.*
rem xcopy %PbDir% %DestPbDir%
rem del /q %NewDestPbDir%\*.*
rem xcopy %PbDir% %NewDestPbDir%

for /f "delims=" %%i in ('dir /a-d /b /s *.proto') do (
rem protoc.exe --proto_path=%ProtoDir% --cpp_out=%CppOutDir% --java_out=%JavaOutDir%\message\src "%%i" )
protoc.exe --proto_path=%ProtoDir% --java_out=%JavaOutDir% "%%i" )
echo Start build java message
cd %JavaOutDir%
call ant -S jar
pause