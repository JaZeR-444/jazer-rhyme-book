import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "ra", "rabban", "rac", "radzimir", "raftlike", "raif", "ramulous", "rao", 
  "raphanus", "rappen", "ras", "rashlike", "realgars", "rebag", "reballot", 
  "rebellow", "rebids", "rebozo", "rebukers", "recherche", "recleans", 
  "redecait", "redpolls", "redust", "refilms", "refledge", "refont", 
  "refresco", "reged", "reglows", "regulize", "rehaul", "rehinge", "reknits", 
  "relictae", "reliver", "remora", "remorate", "rennases", "reoffset", 
  "reomit", "repass", "repowder", "reprune", "reroll", "res", "resgat", 
  "resiance", "ressala", "resweep", "retotal", "rhabdus", "rhamnose", 
  "rhenic", "rifty", "rincon", "rinkite", "riverain", "roosers", "rootworm", 
  "roter", "rounspik", "roups", "rumness", "rumpot", "russene", "ruttier", 
  "ry", "ryen",

  // Random Names/Places (Non-JaZeR)
  "rachel", "rafael", "ralph", "rama", "ramones", "randolph", "renault", 
  "rene", "renee", "remington", "reno", "renwick", "rhode", "rhodes", 
  "richardson", "richland", "ripley", "rivera", "robbie", "robert", 
  "roberto", "robin", "rockford", "rockville", "rodney", "rogers", 
  "roland", "romania", "romeo", "ronnie", "roosevelt", "rosa", "rosaceae", 
  "rosenberg", "roswell", "roth", "rowan", "rowling", "russell", "russia", 
  "russians", "ruth", "rutherford", "rwanda",

  // Boring Corporate/Admin/General/Medical Junk
  "rbi", "rcs", "readme", "realtor", "realty", "reasonable", "reasoning", 
  "receipts", "recently", "receptors", "recession", "recruited", "recruiter", 
  "recruits", "referendum", "referring", "refers", "regulated", 
  "regulators", "rehearsal", "remortgage", "removable", "remover", 
  "reporting", "reports", "repository", "republican", "researcher", 
  "researchers", "residency", "resident", "resides", "residual", 
  "residues", "resister", "resistor", "resources", "resp", "respondent", 
  "retirement", "retriever", "revenue", "reviewers", "revision", 
  "revolution", "rfc", "rfp", "rgb", "rheumatoid", "rms", "roulette", 
  "rpc", "rss", "rtf", "rts", "rupee",

  // Sports Teams (Non-JaZeR)
  "redskins"
];

const wordsDir = path.resolve('public', 'dictionary', 'R', '01_Words');

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

console.log(`
Cleanup complete.`);
console.log(`Removed: ${removedCount}`);
console.log(`Failed: ${failCount}`);
