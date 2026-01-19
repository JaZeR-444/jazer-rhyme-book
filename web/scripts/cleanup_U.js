import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "ua", "ub", "uc", "ud", "udaler", "udell", "udi", "ue", "uf", "ug", "ugarono", 
  "uglis", "uglisome", "ugsome", "uh", "ui", "uigur", "uily", "ul", "ulan", 
  "ulcus", "ullages", "ulnaria", "uloborus", "ulonata", "ulorrhea", "ulpanim", 
  "ult", "ultima", "ulto", "ultram", "uma", "umbellet", "umbra", "umbrere", 
  "umd", "uml", "ummps", "umstroke", "un", "una", "unactual", "unadd", 
  "unaffied", "unaflow", "unageing", "unambush", "unapart", "unaverse", 
  "unbailed", "unbarded", "unbeget", "unbilled", "unbiting", "unbog", 
  "unbolden", "unboldly", "unbrazen", "unc", "uncabled", "uncall", 
  "uncapper", "uncinch", "uncoffle", "uncouth", "uncubic", "und", "undef", 
  "underhew", "undersee", "undewily", "undimly", "undines", "undirect", 
  "undog", "undowned", "undp", "undrossy", "une", "unegal", "unempty", 
  "unevilly", "unfeued", "unfiend", "unfilm", "unfine", "unfiring", 
  "unfleece", "unfleshy", "unfluted", "unfool", "unfudged", "unfuming", 
  "unfussed", "ungarbed", "unglib", "ungood", "ungospel", "ungrip", 
  "unguenta", "ungula", "ungutted", "unhairer", "unhallow", "unhaunt", 
  "unhedge", "unheld", "unhelved", "unhinged", "unhip", "unhobble", 
  "unhued", "unhurted", "uni", "unionic", "uniprotkb", "unjocose", 
  "unjoyful", "unkill", "unkink", "unknight", "unknow", "unlitten", 
  "unmeth", "unmoaned", "unnagged", "unnearly", "unnoting", "uno", 
  "unopaque", "unousted", "unovert", "unpanged", "unpaving", "unpawn", 
  "unpegged", "unplaned", "unpope", "unquert", "unram", "unraspy", 
  "unread", "unreave", "unricked", "unrisked", "unrobbed", "unroller", 
  "unroof", "unsabred", "unsacked", "unsewing", "unshaky", "unshells", 
  "unshined", "unship", "unshore", "unsigned", "unskin", "unsoaped", 
  "unsodden", "unsoggy", "unsoled", "unsomber", "unspent", "unswathe", 
  "untamed", "unteam", "unthaw", "untrig", "untubbed", "untuning", 
  "unvoting", "unwaked", "unwaning", "unwarmed", "unwelded", "unwild", 
  "unwildly", "unwilling", "unwiped", "unwise", "unwived", "unwon", 
  "upbear", "upborne", "upbrast", "upc", "updarted", "updry", "upflung", 
  "upframe", "upgather", "upgirded", "upheaved", "uphroes", "upjet", 
  "uplooker", "uppiles", "upprop", "upraught", "uprear", "uprend", 
  "upseize", "upspring", "upsweeps", "uptable", "upwall", "ur", "urali", 
  "uranisms", "uranium", "urates", "urazin", "urdee", "urea", "urfirnis", 
  "urge", "urged", "urginea", "uri", "uriah", "urinary", "urine", "urines", 
  "url", "urls", "urn", "urnful", "urning", "urologic", "urology", 
  "urotoxin", "urucum", "uruisg", "urw", "us", "usa", "usage", "usaid", 
  "usb", "usc", "usd", "usda", "usenet", "usent", "usgs", "usheress", 
  "usherism", "usps", "usr", "uss", "ussr", "usualism", "ut", "utc", 
  "uteruses", "utf", "util", "utils", "utp", "uts", "uu", "uv", 
  "uvanite", "uvate", "uw", "ux", "uxorial",

  // Random Names/Places (Non-JaZeR)
  "uae", "ubc", "uber", "ubuntu", "ucla", "uganda", "ukraine", "ukrainian", 
  "ulster", "ulsters", "ulysses", "umatilla", "unicef", "unicode", "union", 
  "unions", "united", "unix", "upstage", "uruguay", "utah", "uzbekistan",

  // Boring Corporate/Admin/General/Medical Junk
  "ubiquitous", "udp", "uefa", "unabridged", "unanimous", "underage", 
  "underarm", "underwater", "underwear", "underworld", "unemployed", 
  "unesco", "unicef", "uniform", "uniformly", "uniforms", "uninstall", 
  "uninsured", "university", "unofficial", "untitled", "usability", 
  "usable", "username", "userpic", "usual", "usually", "utensils", 
  "utility", "utilities", "utilize", "utilized", "utilizes", "utilizing",

  // Inappropriate
  "upskirt", "upskirts"
];

const wordsDir = path.resolve('public', 'dictionary', 'U', '01_Words');

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
