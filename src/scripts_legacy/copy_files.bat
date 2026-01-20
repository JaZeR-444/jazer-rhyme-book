@echo off
if not exist "web\public\audio" mkdir "web\public\audio"
xcopy /E /Y "Instrumentals-For-Rhyme-Book" "web\public\audio\"
echo Done.

