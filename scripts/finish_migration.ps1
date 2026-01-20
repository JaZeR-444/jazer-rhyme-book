# JaZeR Rhyme Book - Finish Migration Script
# This script cleans up the old directories after files have been migrated to src/scripts/

$root = Get-Location

Write-Host "Cleaning up old directories..." -ForegroundColor Cyan

# 1. Remove src/web
if (Test-Path "src/web") {
    Write-Host "Removing src/web..."
    Remove-Item -Path "src/web" -Recurse -Force
    Write-Host "✓ src/web removed" -ForegroundColor Green
}

# 2. Rename src/99_SCRIPTS to src/scripts_legacy (instead of deleting immediately for safety)
if (Test-Path "src/99_SCRIPTS") {
    Write-Host "Renaming src/99_SCRIPTS to src/scripts_legacy..."
    if (Test-Path "src/scripts_legacy") {
        Remove-Item -Path "src/scripts_legacy" -Recurse -Force
    }
    Rename-Item -Path "src/99_SCRIPTS" -NewName "scripts_legacy"
    Write-Host "✓ src/99_SCRIPTS moved to src/scripts_legacy" -ForegroundColor Green
}

Write-Host "`nMigration cleanup complete! You can now use the organized src/scripts/ directory." -ForegroundColor Cyan
Write-Host "You can manually delete src/scripts_legacy after verifying everything works."
