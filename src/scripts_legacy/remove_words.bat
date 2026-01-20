@echo off
setlocal enabledelayedexpansion

REM Words to remove from the definiteRemove list
set "words=kraft wellington bandwidth database derivative hardware integral interface linker quartile regression throughput variable variance compliance deposition injunction judicial judiciary jurisdiction quorum thereof whereas workgroup anon thee thou unto whilst yea arrogant gossip malice rumor useless vicious quark lux volt watt niche reduction abstract"

set "dictPath=C:\2026 → JaZeR Mainframe\1st Edition Webpages Completed\JaZeR Rhyme Book\web\public\dictionary"
set "count=0"

echo Starting removal process...

for %%w in (!words!) do (
    REM Get the first letter of the word
    set "word=%%w"
    set "letter=!word:~0,1!"
    
    REM Convert to uppercase
    for /f "usebackq" %%c in (`powershell -command "!letter!.ToUpper()"`) do set "upperLetter=%%c"
    
    set "wordDir=!dictPath!\!upperLetter!\01_Words\!word!"
    
    if exist "!wordDir!" (
        echo Removing !wordDir! ...
        rmdir /s /q "!wordDir!"
        if !errorlevel! equ 0 (
            echo   ^| Successfully removed !word!
            set /a count+=1
        ) else (
            echo   ^| Error removing !word!
        )
    ) else (
        echo !wordDir! not found
    )
)

echo.
echo Removal process completed!
echo Removed !count! directories
pause