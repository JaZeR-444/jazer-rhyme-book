import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targets = [
  // Obscure/Technical Clutter
  "za", "zaberma", "zabra", "zabtie", "zacatec", "zacatons", "zaddik", 
  "zaddikim", "zadokite", "zaffar", "zaffars", "zaffers", "zaffre", 
  "zaffre", "zaguan", "zain", "zakah", "zakat", "zakuska", "zalophus", 
  "zamarra", "zamarras", "zamarro", "zamenis", "zamorine", "zanjona", 
  "zantiot", "zanyism", "zanyship", "zapara", "zaparan", "zapatero", 
  "zaphara", "zaphetic", "zapota", "zapote", "zaptiahs", "zaptoeca", 
  "zarf", "zarnec", "zattare", "zaxes", "zayat", "zayins", "zealotic", 
  "zebec", "zebrina", "zebulun", "zeburro", "zecchins", "zechin", "zees", 
  "zef", "zeidae", "zein", "zeks", "zelant", "zelatrix", "zelkovas", 
  "zeme", "zemeism", "zemindar", "zemstva", "zemstvo", "zenaga", "zendic", 
  "zendo", "zendos", "zenick", "zenography", "zenonian", "zenonic", 
  "zentner", "zenu", "zeolites", "zeolitize", "zeolitized", "zeoscope", 
  "zephyrless", "zephyry", "zerda", "zeroeth", "zetetic", "zeuglodon", 
  "zeuglodontia", "zeuzera", "zhmud", "zibeline", "zibelines", "zibeths", 
  "ziega", "ziff", "ziffs", "ziganka", "zihar", "zikurat", "zill", 
  "zilla", "zilpah", "zimmi", "zimmy", "zincid", "zincify", "zincifying", 
  "zincke", "zincked", "zincography", "zincoid", "zincum", "zincuret", 
  "zindabad", "zindiq", "zinebs", "zingano", "zingaro", "zingerone", 
  "zingiber", "zinjanthropi", "zinnwaldite", "zionite", "zionward", "zipa", 
  "ziphian", "ziphioid", "zippeite", "zirai", "zirak", "ziram", "zircite", 
  "zirian", "zithern", "zithers", "zits", "zittern", "zizyphus", "zizzle", 
  "zloties", "zloty", "zlotych", "zlotys", "zoacum", "zoantharia", 
  "zoarces", "zocco", "zoccolo", "zod", "zoea", "zoeas", "zogo", 
  "zoharist", "zoism", "zokor", "zolaism", "zolotnik", "zombi", "zonality", 
  "zonate", "zonda", "zongora", "zonic", "zonite", "zonitid", "zonitidae", 
  "zonitoides", "zonochlorite", "zonoid", "zonolimnetic", "zonoskeleton", 
  "zonta", "zontian", "zonule", "zonules", "zonure", "zooblast", "zoochem", 
  "zoochemical", "zoochemy", "zoocoenocyte", "zoocytial", "zoofilia", 
  "zoogamy", "zoogenic", "zoogeog", "zooglea", "zoogleas", "zoogloea", 
  "zoogloeae", "zoogonic", "zoogony", "zoografting", "zoographer", 
  "zooid", "zooids", "zoolater", "zoolite", "zoological", "zoologizing", 
  "zoomancy", "zoomania", "zoomastigoda", "zoometric", "zoomorph", 
  "zoonist", "zoonitic", "zoonomia", "zoonomist", "zoonotic", 
  "zoopantheon", "zooparasitic", "zooperal", "zooperist", "zoopery", 
  "zoophaga", "zoophagan", "zoophagineae", "zoophilia", "zoophilist", 
  "zoophilitic", "zoophobe", "zoophobes", "zoophobous", "zoophori", 
  "zoophysical", "zoophysicist", "zoophyta", "zoophyte", "zoophytes", 
  "zoophytical", "zoophytoid", "zoos", "zoosperm", "zoospermatic", 
  "zoosperms", "zoosporocyst", "zoothecial", "zootheist", "zoothome", 
  "zootic", "zootoca", "zootomical", "zootoxin", "zooty", "zootype", 
  "zootypic", "zoozoo", "zope", "zophorus", "zoque", "zoril", "zorillos", 
  "zoroastrians", "zorotypus", "zosteriform", "zosterops", "zosters", 
  "zouaves", "zoysias", "zu", "zubr", "zuffolo", "zugzwang", "zulinde", 
  "zulkadah", "zuluize", "zum", "zunyite", "zur", "zurlite", "zus", 
  "zuurveldt", "zwinglian", "zwinglianism", "zwitterionic", "zyga", 
  "zygadenin", "zygadenus", "zygaena", "zygaenid", "zygion", "zygite", 
  "zygnemaceous", "zygodactyle", "zygogenesis", "zygogenetic", 
  "zygolabialis", "zygomata", "zygomorphous", "zygophoric", "zygophyte", 
  "zygopleural", "zygopterides", "zygopteris", "zygopterous", "zygosphenal", 
  "zygote", "zygotes", "zygotic", "zymogene", "zymoid", "zymologic", 
  "zymolysis", "zymosans", "zymotechnic", "zymotic", "zymotoxic", 
  "zyrenian", "zyzomys", "zz",

  // Random Names/Places (Non-JaZeR)
  "zaire", "zambezi", "zambia", "zambo", "zealand", "zelda", "zhang", 
  "zimbabwe", "zurich",

  // Boring Corporate/Admin/General/Medical Junk
  "zdnet", "zoloft", "zshops", "zyban",

  // Acronyms
  "zh"
];

const wordsDir = path.resolve(__dirname, 'public', 'dictionary', 'Z', '01_Words');

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
