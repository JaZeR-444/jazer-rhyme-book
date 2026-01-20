$content = Get-Content -Path "MASTER-WORDS-INDEX.md" -Raw

$manifest = @{
    totalWords = 0
    letters = @{}
}

# Regex for letter sections
# Matches ## Words Starting with `A` up to the next ## or end of file
$letterMatches = [regex]::Matches($content, '## Words Starting with `?([A-Z])`?[^]*?(?=## Words Starting with|$)')

foreach ($match in $letterMatches) {
    $letter = $match.Groups[1].Value
    $sectionContent = $match.Value
    
    $manifest.letters[$letter] = @{
        count = 0
        words = @()
    }
    
    # Regex for word entries
    # 1. [ability](A/01_Words/ability/word.md)
    $wordMatches = [regex]::Matches($sectionContent, '\d+\. \[([^\]]+)\]\(([^\)]+)\)')
    
    foreach ($wordMatch in $wordMatches) {
        $word = $wordMatch.Groups[1].Value
        $path = $wordMatch.Groups[2].Value
        
        $manifest.letters[$letter].words += @{
            word = $word
            path = $path
        }
        $manifest.letters[$letter].count++
        $manifest.totalWords++
    }
}

$json = $manifest | ConvertTo-Json -Depth 10
Set-Content -Path "MASTER-DICTIONARY-MANIFEST.json" -Value $json
Write-Host "Generated manifest with $($manifest.totalWords) words."
