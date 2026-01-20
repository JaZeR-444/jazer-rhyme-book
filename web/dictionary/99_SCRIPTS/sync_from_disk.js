const fs = require('fs');
const path = require('path');

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const dictionaryRoot = '.'; // Current directory

function calculateWordStats(words) {
    if (words.length === 0) {
        return {
            total: 0,
            avgLength: 0,
            shortest: '',
            longest: '',
            lengthDistribution: {}
        };
    }

    let totalLength = 0;
    let shortestWord = words[0];
    let longestWord = words[0];
    const lengthDistribution = {};

    words.forEach(word => {
        totalLength += word.length;
        if (word.length < shortestWord.length) {
            shortestWord = word;
        }
        if (word.length > longestWord.length) {
            longestWord = word;
        }

        const len = word.length;
        lengthDistribution[len] = (lengthDistribution[len] || 0) + 1;
    });

    const avgLength = (totalLength / words.length).toFixed(2);

    return {
        total: words.length,
        avgLength: parseFloat(avgLength),
        shortest: shortestWord,
        longest: longestWord,
        lengthDistribution: lengthDistribution
    };
}

function generateMasterWordsIndex() {
    let masterIndexContent = `# MASTER WORDS INDEX

> A-Z master index for the JaZeR Rhyme Book word vault.  
> Links resolve to each word’s \`word.md\` entry inside its letter directory.

## Hero Dashboard
> High-level ledger for every letter so the inventory stays in sync with JaZeR standards.  Delta measures the deviation from the 70-word anchor so action items stand out in one glance.  

|:--------:|------:|----:|-----------:|---------:|---------------:|
| Letter   | Total |  Δ  | Avg length | Shortest | Longest        |          
|:--------:|:-----:|:---:|:----------:|:--------:|:--------------:|
`;

    let totalWordsOverall = 0;
    const letterData = {};

    for (const letter of letters) {
        const letterPath = path.join(dictionaryRoot, letter, '01_Words');
        let actualWords = [];
        if (fs.existsSync(letterPath)) {
            actualWords = fs.readdirSync(letterPath, { withFileTypes: true })
                            .filter(dirent => dirent.isDirectory())
                            .map(dirent => dirent.name);
        }
        actualWords.sort(); // Ensure consistent order

        const stats = calculateWordStats(actualWords);
        const delta = stats.total - 70;

        masterIndexContent += `| ${letter}        |    ${String(stats.total).padEnd(3)} | ${String(delta).padStart(3)} | ${String(stats.avgLength).padEnd(10)} | \`${String(stats.shortest).padEnd(6)}\` | \`${String(stats.longest).padEnd(14)}\` |\n`;
        
        totalWordsOverall += stats.total;
        letterData[letter] = {
            words: actualWords,
            stats: stats
        };
    }

    masterIndexContent += `|:--------:|:-----:|:---:|:----------:|:--------:|:--------------:|

|:----------------------:| 
|        **TOTAL**       |  
|:----------------------:|   
|Words      |  *${totalWordsOverall}*   |
|Δ          |   *${totalWordsOverall - (letters.length * 70)}*    |
|Avg length |   *${(Object.values(letterData).reduce((sum, data) => sum + data.stats.avgLength * data.stats.total, 0) / totalWordsOverall).toFixed(2)}*   |
|:----------------------:| 

---

## Integrity Checks (Header-Level)

Use this checklist whenever you regenerate the index:

- [ ] **Grand Total** equals the sum of all per-letter totals (currently: \`${totalWordsOverall}\`).
- [ ] Each letter section’s **Length distribution sums to Total words**.
- [ ] Header totals match each letter’s section totals (no stale header counts).
- [ ] No duplicate words across letters; no duplicates within the same letter.
- [ ] Link paths follow \`LETTER/01_Words/<word>/word.md\` consistently.

---
`;

    for (const letter of letters) {
        const data = letterData[letter];
        masterIndexContent += `## Words Starting with 	este${letter}	este

### Summary

- **Total words:** 	este${data.stats.total}	este
- **Average length:** 	este${data.stats.avgLength}	este
- **Shortest word:** _${data.stats.shortest || 'N/A'}_ 
- **Longest word:** _${data.stats.longest || 'N/A'}_ 

### Length Distribution

| Letters | Count |
| :-----: | ----: |
`;
        const sortedLengths = Object.keys(data.stats.lengthDistribution).sort((a, b) => parseInt(a) - parseInt(b));
        sortedLengths.forEach(len => {
            masterIndexContent += `| ${String(len).padEnd(7)}| ${String(data.stats.lengthDistribution[len]).padStart(5)} |\n`;
        });
        masterIndexContent += `
> Integrity check: distribution totals = **${data.stats.total}**

---

### Words (${letter})
`;
        data.words.forEach((word, index) => {
            masterIndexContent += `${index + 1}. [${word}](${letter}/01_Words/${word}/word.md)\n`;
        });
        masterIndexContent += `
> End of **${letter}** section — **${data.stats.total} words**

---
`;
    }

    fs.writeFileSync(path.join(dictionaryRoot, 'MASTER-WORDS-INDEX.md'), masterIndexContent, 'utf8');
    console.log('MASTER-WORDS-INDEX.md updated.');

    // Update MASTER-DICTIONARY-MANIFEST.json
    const newManifest = {
        totalWords: totalWordsOverall,
        letters: {}
    };

    for (const letter of letters) {
        const data = letterData[letter];
        newManifest.letters[letter] = {
            count: data.stats.total,
            words: data.words.map(word => ({
                word: word,
                path: `${letter}/01_Words/${word}/word.md`
            }))
        };
    }

    fs.writeFileSync(path.join(dictionaryRoot, 'MASTER-DICTIONARY-MANIFEST.json'), JSON.stringify(newManifest, null, 2), 'utf8');
    console.log('MASTER-DICTIONARY-MANIFEST.json updated.');
}

generateMasterWordsIndex();
