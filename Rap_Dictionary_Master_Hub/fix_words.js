const https = require('https');
const fs = require('fs');
const path = require('path');

const wordsToFix = ['abandon', 'ability', 'absolute', 'abstract', 'academy'];

async function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (e) => reject(e));
    });
}

async function getDictionaryData(word) {
    const data = await fetchJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!data || !data[0]) return null;
    const entry = data[0];
    return {
        meaning: entry.meanings[0].definitions[0].definition,
        pos: entry.meanings[0].partOfSpeech,
        synonyms: entry.meanings[0].synonyms.slice(0, 5).join(', '),
        antonyms: entry.meanings[0].antonyms.slice(0, 5).join(', ')
    };
}

async function getDatamuseData(word) {
    const data = await fetchJson(`https://api.datamuse.com/words?rel_rhy=${word}&max=10&md=sp`);
    const syllablesData = await fetchJson(`https://api.datamuse.com/words?sp=${word}&max=1&md=sp`);
    
    let syllables = 0;
    if (syllablesData && syllablesData[0]) {
        syllables = syllablesData[0].numSyllables;
    }

    const rhymes = data ? data.map(w => w.word).join(', ') : '';
    return { syllables, rhymes };
}

function generateRapContent(word, meaning) {
    return {
        rapMeaning: `Used to describe ${meaning.toLowerCase().replace(/\.$/, '')} in a bar.`,
        examples: [
            `${word.charAt(0).toUpperCase() + word.slice(1)} in my cadence, heavy like a drumline.`,
            `I move with ${word}, every step a headline.`,
            `${word.charAt(0).toUpperCase() + word.slice(1)} on the mic, watch the room align.`
        ],
        angles: [
            `Power/control imagery`,
            `Scale/impact flex`,
            `Momentum/pressure metaphor`
        ]
    };
}

async function fixWord(word) {
    console.log(`Fixing: ${word}...`);
    try {
        const dict = await getDictionaryData(word);
        const dm = await getDatamuseData(word);
        
        if (!dict) {
            console.log(`Could not find dictionary data for ${word}`);
            return;
        }

        const rap = generateRapContent(word, dict.meaning);
        
        const content = `# WORD: ${word.charAt(0).toUpperCase() + word.slice(1)}

## Meaning (plain):
${dict.meaning}

## Rap meaning (how I'd say it):
${rap.rapMeaning}

## Syllables:
${dm.syllables} (${word})

## Part of speech:
${dict.pos}

## Synonyms:
${dict.synonyms}

## Antonyms:
${dict.antonyms}

## Rhyme ideas (end / slant / multi):
END: ${dm.rhymes} / SLANT: / MULTI: ${word} mode, ${word} codes, ${word} road

## 3 bar-ready examples:
1. ${rap.examples[0]}
2. ${rap.examples[1]}
3. ${rap.examples[2]}

## 3 punchline angles:
1. ${rap.angles[0]}
2. ${rap.angles[1]}
3. ${rap.angles[2]}

## Tags:
relatable, common
`;

        const letter = word[0].toUpperCase();
        const filePath = path.join(letter, '01_Words', word, 'word.md');
        fs.writeFileSync(filePath, content);
        console.log(`Saved ${filePath}`);
    } catch (e) {
        console.error(`Error fixing ${word}:`, e.message);
    }
}

async function main() {
    for (const word of wordsToFix) {
        await fixWord(word);
        await new Promise(r => setTimeout(r, 1000)); // Rate limiting
    }
}

main();
