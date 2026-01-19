import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "fa", "fados", "fagging", "failsoft", "fairlike", "falerno", "falisci", 
  "falsen", "fanegada", "fantasts", "faqfaq", "fas", "fasciate", "fatiha", 
  "fatuus", "faucial", "faultage", "feck", "fecula", "feedhead", "feedy", 
  "femality", "fenagler", "fencible", "feof", "feoffed", "feoffs", "feres", 
  "ferlied", "ferulas", "festuca", "fetal", "fetchers", "fetichic", "fewsome", 
  "fiancing", "fibrose", "fidges", "figurae", "filaree", "filate", "filme", 
  "finalis", "finalism", "finny", "fioricet", "fistwise", "fitcher", "flabrum", 
  "flatcars", "flateria", "flaught", "fleadock", "fleche", "flingy", "flots", 
  "floyt", "fluate", "fluellin", "fluidal", "fno", "fogo", "foiter", 
  "foliator", "folkmote", "folkvang", "folliful", "fomit", "fonnish", 
  "fontanel", "footler", "footpad", "fordoes", "forecome", "foreflap", 
  "forelook", "foreturn", "foreuse", "foreview", "forkmen", "forzato", 
  "fossage", "fpo", "fprintf", "framea", "frailes", "frenums", "frisker", 
  "frizers", "frizes", "froom", "frownful", "frumpish", "fsa", "fta", 
  "fumiest", "functus", "funditor", "fundungi", "funest", "funiform", 
  "furcates", "furcula", "furicane", "furlers", "furmenty", "fusile", 
  "fussock", "fusulae", "futhorcs", "futhork", "futtah", "fw", "fwd", "fx",

  // Random Names/Places (Non-JaZeR)
  "fairfax", "fairfield", "fargo", "farmington", "fayette", "felix", 
  "ferguson", "fernando", "ferris", "fiji", "finland", "finn", "finnish", 
  "fischer", "florence", "floyd", "francesco", "franco", "franklin", 
  "franz", "frauen", "frederic", "fresno", "frey", "frigga", "fritz", 
  "fujifilm",

  // Boring Corporate/Admin/General Junk
  "facsimile", "facilities", "factoring", "federal", "federation", "fema", 
  "fha", "financials", "fiscal", "fiscs", "formally", "fortran", "franchise",

  // Inappropriate
  "footjob", "fuck", "fuckers", "fuckin", "fucking"
];

const wordsDir = path.join('public', 'dictionary', 'F', '01_Words');

console.log('Starting cleanup of F dictionary...');

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

console.log(`\nCleanup complete. Total folders removed: ${removedCount}`);
console.log('Next step: Run "npm run prepare" to update the site.');
