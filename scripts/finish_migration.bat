@echo off
echo Cleaning up old directories...

if exist "src\web" (
    echo Removing src\web...
    rd /s /q "src\web"
)

if exist "src\99_SCRIPTS" (
    echo Renaming src\99_SCRIPTS to src\scripts_legacy...
    if exist "src\scripts_legacy" rd /s /q "src\scripts_legacy"
    move "src\99_SCRIPTS" "src\scripts_legacy"
)

echo Cleanup complete!
pause
