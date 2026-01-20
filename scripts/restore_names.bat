@echo off
echo Restoring standard folder names...

:: Rename github to .github
if exist "docs_and_assets\github" (
    ren "docs_and_assets\github" ".github"
    echo Restored: docs_and_assets\.github
)

:: Rename meta to _meta
if exist "knowledge_base\meta" (
    ren "knowledge_base\meta" "_meta"
    echo Restored: knowledge_base\_meta
)

:: Rename claude to .claude
if exist "system\claude" (
    ren "system\claude" ".claude"
    echo Restored: system\.claude
)

echo.
echo Naming restoration complete!
pause
