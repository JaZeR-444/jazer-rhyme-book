import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "ya", "yaba", "yabber", "yabbie", "yack", "yadayim", "yade", "yaffed", 
  "yaffing", "yaffs", "yaghourt", "yagis", "yagnob", "yaguaza", "yahan", 
  "yahoodom", "yahuskin", "yahveh", "yairds", "yaje", "yaka", "yakan", 
  "yakka", "yakmak", "yakman", "yakut", "yallaer", "yamacraw", "yamalkas", 
  "yamanai", "yamassee", "yamato", "yamens", "yamilke", "yammadji", "yamun", 
  "yamuns", "yancopin", "yangs", "yangtao", "yankeefy", "yanolite", 
  "yanqui", "yanquis", "yantra", "yaourti", "yapa", "yapness", "yapock", 
  "yapok", "yapon", "yapons", "yaqui", "yarak", "yariyari", "yark", "yarke", 
  "yarm", "yarmulka", "yarner", "yarrow", "yarrows", "yarry", "yarth", 
  "yaruran", "yashiro", "yashmac", "yashmak", "yatagan", "yate", "yates", 
  "yatigan", "yauds", "yauped", "yautias", "yawls", "yawners", "yawney", 
  "yawpings", "yawps", "yawshrub", "yawweed", "yaxche", "yaya", "yazata", 
  "yazoo", "yclad", "yclept", "yealing", "yealings", "yean", "yeared", 
  "yearend", "yearful", "yeat", "yeather", "yecchy", "yech", "yedding", 
  "yederly", "yeech", "yeggmen", "yeld", "yeldrine", "yeldring", "yelloch", 
  "yelm", "yelver", "yemschik", "yengeese", "yeni", "yenisei", "yenite", 
  "yenning", "yentas", "yente", "yentnite", "yeorling", "yephede", 
  "yerava", "yerb", "yerbales", "yerga", "yerking", "yern", "yertchuk", 
  "yerva", "yeshiva", "yeshivah", "yeso", "yesso", "yest", "yetlin", 
  "yett", "yeuks", "yeven", "yez", "yezidi", "yfacks", "yferre", "yid", 
  "yiddishist", "yildun", "yills", "yilt", "yince", "yins", "yird", 
  "yirds", "yirk", "yirn", "yirring", "yirths", "ylem", "ylems", "yn", 
  "yobbos", "yobs", "yocco", "yochel", "yock", "yocking", "yodelist", 
  "yodelling", "yodelline", "yodh", "yods", "yogeeism", "yogh", "yoghs", 
  "yogin", "yogini", "yoginis", "yogis", "yoho", "yojan", "yojana", 
  "yojuane", "yokehold", "yokeless", "yokeline", "yokelism", "yokelry", 
  "yokemates", "yokewise", "yokewood", "yokozunas", "yolden", "yoldia", 
  "yomin", "yomud", "yoncopin", "yonker", "yont", "yook", "yorker", 
  "yorkist", "yot", "yote", "youl", "youngan", "youpons", "yourn", 
  "yourt", "yoven", "yowden", "yowes", "yowies", "yowing", "yowlring", 
  "yows", "yowt", "ypsiloid", "yquem", "yr", "yrbk", "yrs", "yttria", 
  "yttrias", "yttriferous", "yu", "yuans", "yuapin", "yuchi", "yucker", 
  "yucking", "yug", "yuga", "yugas", "yugoslavian", "yukaghir", "yukkel", 
  "yulan", "yuleblock", "yuman", "yunker", "yupons", "yurok", "yurta", 
  "yurts", "yurucare", "yuruk", "yurupary", "yustaga", "yuzluk", "yy", 
  "yyyy",

  // Random Names/Places (Non-JaZeR)
  "yakima", "yale", "yamaha", "yankee", "yankees", "yankton", "yemen", 
  "yosemite", "yukon",

  // Boring Corporate/Admin/General Junk
  "y", "yd", "yds", "ye", "ymca"
];

const wordsDir = path.resolve('public', 'dictionary', 'Y', '01_Words');

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
