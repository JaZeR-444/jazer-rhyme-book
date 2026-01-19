import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "xa", "xalostockite", "xanthan", "xanthane", "xanthans", "xanthate", 
  "xanthein", "xantheins", "xanthene", "xanthian", "xanthic", "xanthid", 
  "xanthide", "xanthidium", "xanthin", "xanthindaba", "xanthine", 
  "xanthines", "xanthins", "xanthinuria", "xanthism", "xanthite", 
  "xanthium", "xanthiuria", "xanthochroi", "xanthochroid", "xanthodont", 
  "xanthogenic", "xanthoma", "xanthomatous", "xanthometer", "xanthone", 
  "xanthopicrin", "xanthopsia", "xanthosoma", "xanthoura", "xanthous", 
  "xanthoxalis", "xanthoxenite", "xanthuria", "xanthydrol", "xanthyl", 
  "xantippe", "xarque", "xat", "xaverian", "xb", "xc", "xcl", "xctl", "xd", 
  "xda", "xdiv", "xe", "xebec", "xebecs", "xed", "xema", "xemacs", "xeme", 
  "xenacanthine", "xenagogue", "xenagogy", "xenarchi", "xenarthrous", 
  "xenelasy", "xenia", "xenial", "xenian", "xenias", "xenic", "xenical", 
  "xenically", "xenicidae", "xenicus", "xenium", "xenoblast", 
  "xenocratean", "xenocryst", "xenocrystic", "xenocyst", "xenoderm", 
  "xenodocheion", "xenodochia", "xenodochium", "xenodochy", "xenogamies", 
  "xenogamous", "xenogamy", "xenogeneic", "xenogenesis", "xenogenetic", 
  "xenogenic", "xenogenies", "xenogenous", "xenogeny", "xenoglossia", 
  "xenograft", "xenolite", "xenolith", "xenolithic", "xenoliths", 
  "xenomania", "xenomaniac", "xenomi", "xenomorpha", "xenoparasite", 
  "xenopeltidae", "xenophile", "xenophilous", "xenophobe", "xenophobes", 
  "xenophobia", "xenophobian", "xenophobic", "xenophobism", "xenophonic", 
  "xenophontean", "xenophontic", "xenophontine", "xenophora", 
  "xenophoran", "xenophoridae", "xenophya", "xenoplastic", "xenopodid", 
  "xenopodidae", "xenopodoid", "xenopsylla", "xenopteran", "xenopteri", 
  "xenopterygii", "xenorhynchus", "xenosaurus", "xenote", "xenotime", 
  "xenotropic", "xenurus", "xenyl", "xenylamine", "xerafin", "xeransis", 
  "xeranthemum", "xerantic", "xeraphin", "xerarch", "xerasia", "xeres", 
  "xeric", "xeriff", "xerocline", "xeroderma", "xerodermatic", 
  "xerodermia", "xerodermic", "xerogel", "xerographer", "xerographic", 
  "xerography", "xeroma", "xeromata", "xeromenia", "xeromorph", 
  "xeromorphic", "xeromorphous", "xeronate", "xeronic", "xerophagia", 
  "xerophagy", "xerophil", "xerophilous", "xerophily", "xerophobous", 
  "xerophthalmy", "xerophyllum", "xerophyte", "xerophytic", 
  "xeroprinting", "xerosere", "xeroses", "xerosis", "xerostomia", 
  "xerotes", "xerotherm", "xerothermic", "xerotic", "xerotocia", "xerus", 
  "xeruses", "xf", "xi", "xicak", "xicaque", "xii", "xiii", "ximenia", 
  "xina", "xinca", "xint", "xipe", "xiphias", "xiphiid", "xiphioid", 
  "xiphisterna", "xiphisternal", "xiphisternum", "xiphistna", "xiphisura", 
  "xiphisuran", "xiphiura", "xiphius", "xiphocostal", "xiphodon", 
  "xiphodynia", "xiphoidian", "xiphopagic", "xiphopagous", "xiphopagus", 
  "xiphosterna", "xiphosternum", "xiphosura", "xiphosuran", "xiphosuridae", 
  "xiphosurous", "xiphosurus", "xiphous", "xiphura", "xiphydriid", 
  "xiphydriidae", "xiraxara", "xis", "xiv", "xix", "xlibs", "xm", "xml", 
  "xoana", "xoanon", "xoanona", "xonotlite", "xoops", "xosa", "xr", "xref", 
  "xs", "xsl", "xslt", "xt", "xu", "xurel", "xv", "xvi", "xvid", "xvii", 
  "xviii", "xw", "xx", "xxi", "xxii", "xxiii", "xxiv", "xxv", "xyla", 
  "xylan", "xylans", "xylanthrax", "xylaria", "xylariaceae", "xylate", 
  "xyleborus", "xyletic", "xylia", "xylic", "xylidic", "xylidin", 
  "xylidine", "xylidines", "xylidins", "xylina", "xylinid", "xylite", 
  "xylitol", "xylitols", "xylitone", "xylo", "xylobalsamum", "xylocarp", 
  "xylocarpous", "xylocarps", "xylocopa", "xylocopid", "xylogen", 
  "xylograph", "xylographer", "xylographic", "xylography", "xyloid", 
  "xyloidin", "xyloidine", "xylol", "xylology", "xylols", "xyloma", 
  "xylomancy", "xylomas", "xylomata", "xylometer", "xylon", "xylonic", 
  "xylonite", "xylonitrile", "xylophagan", "xylophage", "xylophagid", 
  "xylophagidae", "xylophagous", "xylophagus", "xylophilous", 
  "xylophones", "xylophonist", "xylophonists", "xylopia", "xyloplastic", 
  "xylopolist", "xyloquinone", "xylorcin", "xylorcinol", "xyloses", 
  "xylosid", "xyloside", "xylosma", "xylostroma", "xylotile", "xylotomic", 
  "xylotomical", "xylotomies", "xylotomist", "xylotomous", "xylotrya", 
  "xyloyl", "xylyl", "xylylene", "xylylic", "xylyls", "xyphoid", 
  "xyrichthys", "xyrid", "xyridaceae", "xyridaceous", "xyridales", "xyris", 
  "xyst", "xyster", "xysters", "xysti", "xystoi", "xystos", "xysts", 
  "xystum", "xystus",

  // Random Names/Places (Non-JaZeR)
  "xavier",

  // Boring Corporate/Admin/General Junk
  "x-height", "xl", "xxl",

  // Inappropriate
  "x-wife", "xnxx", "xxx", "xxxx"
];

const wordsDir = path.resolve('public', 'dictionary', 'X', '01_Words');

console.log(`Cleaning up: ${wordsDir}`);

if (!fs.existsSync(wordsDir)) {
  console.error('Error: Directory does not exist.');
  process.exit(1);
}

let removedCount = 0;
let failCount = 0;

targets.forEach(target => {
  const targetPath = path.join(wordsDir, target);
  if (fs.existsSync(targetPath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`- Removed: ${target}`);
      removedCount++;
    } catch (err) {
      console.error(`! Error removing ${target}: ${err.message}`);
      failCount++;
    }
  }
});

console.log(`\nCleanup complete.`);
console.log(`Removed: ${removedCount}`);
console.log(`Failed: ${failCount}`);
