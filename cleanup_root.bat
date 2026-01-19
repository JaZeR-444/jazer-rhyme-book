@echo off
setlocal enabledelayedexpansion
echo Starting Project Cleanup...

:: Define target directories
set "scriptsDir=99_SCRIPTS"
set "docsDir=docs"
set "assetsDir=assets"

:: Create assets directory if it doesn't exist
if not exist "%assetsDir%" (
    mkdir "%assetsDir%"
    echo Created %assetsDir% directory.
)

:: 1. Delete redundant scripts (already exist in 99_SCRIPTS/)
echo Deleting redundant scripts...
for %%f in (
    "add_50_a_words.py"
    "add_v_words_2.py"
    "add_w_words_2.py"
    "add_x_words_2.py"
    "add_y_words_2.py"
    "add_z_words_2.py"
    "add_zxywv_words.py"
    "auto_expand_dictionary.py"
    "create_rap_hub.py"
    "copy_audio.js"
) do (
    if exist "%%~f" (
        del /f /q "%%~f"
        echo Deleted: %%~f
    )
)

:: 2. Delete redundant docs (already exist in docs/)
echo Deleting redundant docs...
for %%f in (
    "CLAUDE CLI - MASTER BUILD PROMPT.md"
    "IMPLEMENTATION_SUMMARY.md"
    "QUICK_START_GUIDE.md"
    "SITE_ENHANCEMENT_RECOMMENDATIONS.md"
) do (
    if exist "%%~f" (
        del /f /q "%%~f"
        echo Deleted: %%~f
    )
)

:: 3. Move unique documentation to docs/
echo Moving documentation...
for %%f in (
    "AGENTS.md"
    "CLAUDE.md"
    "GEMINI.md"
    "QWEN.md"
) do (
    if exist "%%~f" (
        move /y "%%~f" "%docsDir%\"
        echo Moved to %docsDir%: %%~f
    )
)

:: 4. Move utility scripts to 99_SCRIPTS/
echo Moving utility scripts...
for %%f in (
    "remove_words.js"
    "verify_removal.js"
    "remove_words.bat"
    "copy_files.bat"
) do (
    if exist "%%~f" (
        move /y "%%~f" "%scriptsDir%\"
        echo Moved to %scriptsDir%: %%~f
    )
)

:: 5. Move logos/icons to assets/
echo Moving icons...
if exist "JaZeR*.svg" (
    move /y "JaZeR*.svg" "%assetsDir%\"
    echo Moved JaZeR SVGs to assets.
)

:: 6. Cleanup tmp folders
echo Removing temporary items...
for /d %%i in (tmpclaude-*) do (
    rd /s /q "%%i"
    echo Removed: %%i
)
if exist "test_delete.txt" del "test_delete.txt"
if exist "cleanup_root.ps1" del "cleanup_root.ps1"

echo.
echo Cleanup complete! Your root directory is now organized.
pause
