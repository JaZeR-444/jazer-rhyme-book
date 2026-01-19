import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "sagesse", "saggered", "saliaric", "salite", "saltman", "samh", "sansara", 
  "santon", "sao", "saponify", "saraad", "sarlyk", "satiably", "sca", 
  "scacchic", "scat", "schwartz", "sclerosis", "scoffer", "scups", "seether", 
  "selfly", "sepose", "servlet", "ses", "sexe", "sextan", "sgml", "shamming", 
  "shamuses", "shaugh", "shechem", "sheetage", "shenshai", "shilly", 
  "shippens", "shives", "shog", "shophar", "shoq", "shrike", "shyster", "sic", 
  "siest", "sifaka", "silva", "sirras", "sitzbath", "skilly", "skither", 
  "skyugle", "slocker", "slotten", "smtp", "snickle", "snowshed", "socht", 
  "somitic", "somner", "sonances", "soom", "soporate", "sotnia", "souari", 
  "sowans", "spargers", "spinnery", "spirable", "sprose", "squabs", "squama", 
  "stadie", "stambha", "starken", "steever", "stinkpot", "stodge", "stomode", 
  "strati", "stratify", "subcubic", "subduple", "subslots", "subsolar", 
  "sundang", "susliks", "swf",

  // Random Names/Places (Non-JaZeR)
  "sacramento", "sakai", "salisbury", "samsung", "santiago", "saskatoon", 
  "savannah", "scotia", "seneca", "serbian", "seville", "seychelles", 
  "shapiro", "shelby", "shelley", "simpsons", "singh", "sinon", "spokane", 
  "spongebob", "stafford", "stanley", "stapelia", "stein", "steiner", 
  "steptoe", "steve", "stockton", "strauss", "suzanne", "swarovski", 
  "symantec",

  // Boring Corporate/Admin/General/Medical Junk
  "sbin", "scanner", "scanners", "schedule", "scheduling", "schema", 
  "scholars", "securities", "sediments", "selects", "semester", "seminar", 
  "sensible", "sequences", "series", "servos", "settlers", "shareware", 
  "simplicity", "simplified", "situation", "smokers", "smugmug", "snp", 
  "softcover", "sogdian", "soldat", "solder", "solvent", "soviet", 
  "specialty", "spectate", "spreadsheet", "spp", "stability", "statutory", 
  "sterile", "sti", "sto", "subgroup", "subpart", "subroutine", "subscriber", 
  "subset", "subsidiary", "subsidies", "substrates", "subsystem", "subtitles", 
  "subtotal", "subunit", "suburban", "sucked", "sudoku", "suffix", 
  "suggestion", "suicide", "sulfur", "superpages", "supervise", "survey", 
  "surveyed", "surveying", "symptom", "symptoms", "syncing", "synthesis"
];

const wordsDir = path.resolve('public', 'dictionary', 'S', '01_Words');

console.log('Starting cleanup of S dictionary...');

let removedCount = 0;
targets.forEach(target => {
  const targetPath = path.join(wordsDir, target);
  if (fs.existsSync(targetPath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`- Removed: ${target}`);
      removedCount++;
    } catch (err) {
      console.error(`! Failed to remove ${target}:`, err.message);
    }
  }
});

console.log(`
Cleanup complete. Total folders removed: ${removedCount}`);
console.log('Next step: Run "npm run prepare" at the end of all batch cleanups.');
