import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "ka", "kaberu", "kafa", "kafilia", "kagura", "kahar", "kai", "kaik", 
  "kailyard", "kain", "kaingin", "kaiserin", "kaitaka", "kakas", "kaleidic", 
  "kalmias", "kalmuk", "kalpa", "kalpaks", "kam", "kamahi", "kamaloka", 
  "kamian", "kammalan", "kan", "kandol", "kantian", "kanwar", "kaoline", 
  "kapas", "kapote", "kappa", "kapur", "kara", "karakul", "karatas", 
  "karatto", "karpas", "karroo", "karstic", "karsts", "karwar", "kaser", 
  "kashered", "kashira", "kashrut", "kashruts", "kassite", "kassu", "katat", 
  "katipo", "katrinka", "kauravas", "kauris", "kavas", "kavass", "kawika", 
  "kazak", "ke", "kebbocks", "keckle", "keder", "kedger", "kedgeree", 
  "kedlock", "keelfat", "kees", "kefirs", "kegelers", "kegler", "kekchi", 
  "kelder", "kelima", "kelkoo", "kell", "kellion", "keltics", "kemancha", 
  "kemb", "kenmark", "keno", "kenotism", "kenotron", "kerugma", "kerve", 
  "keta", "ketazine", "ketose", "keup", "kev", "khafajeh", "khaiki", 
  "khasi", "khedive", "khir", "khond", "khulda", "ki", "kia", "kialee", 
  "kiangan", "kibber", "kibbling", "kiblahs", "kidcote", "kiefekil", 
  "kikoi", "kilah", "killow", "kimmo", "kinah", "kinase", "kindlers", 
  "kindrend", "kineses", "kinesic", "kinnery", "kino", "kinoo", "kinot", 
  "kintar", "kioway", "kipage", "kipe", "kippin", "kipskins", "kirns", 
  "kirombo", "kishen", "kists", "kitab", "kitabis", "kitching", "kithes", 
  "kithogue", "kittel", "kittling", "kittly", "kittock", "kitysol", "kj", 
  "kk", "kl", "klosh", "klosse", "knabble", "knarred", "knet", "knopite", 
  "knopweed", "knorhmn", "knorria", "knurry", "knyazi", "ko", "kobi", "koch", 
  "koh", "kohlrabi", "koines", "kokam", "koklass", "kokoon", "kokos", "kola", 
  "kolach", "kolsun", "kolush", "konak", "konkani", "konohiki", "kontakia", 
  "kontakt", "koodoos", "koorka", "kootcha", "kopfring", "korai", "korait", 
  "korakan", "koranic", "koroa", "kos", "kotal", "kotoite", "kotoko", 
  "koumises", "kouros", "kowbird", "kp", "kpx", "kr", "kraaling", 
  "kraunhia", "krausite", "kreis", "kreuzer", "krigia", "krubis", 
  "krumhorn", "ks", "ksar", "kt", "kthibh", "ku", "kubera", "kuei", "kues", 
  "kufiyeh", "kuichua", "kukeri", "kukoline", "kulimit", "kumbi", "kumshaw", 
  "kumyses", "kunbi", "kurajong", "kuranko", "kurtas", "kurumaya", 
  "kurveyor", "kusha", "kustenau", "kutchin", "kv", "kvarner", "kvases", 
  "kvm", "kw", "kwacha", "kwamme", "kwela", "kx", "ky", "kyklopes", 
  "kylikes", "kymogram", "kyocera", "kyte", "kz",

  // Random Names/Places (Non-JaZeR)
  "kalamazoo", "kansas", "kanye", "kaplan", "karen", "karl", "kashmir", 
  "kate", "katherine", "kathleen", "kathryn", "kathy", "katie", "katrina", 
  "katy", "katz", "kauai", "kaufman", "kawasaki", "kazakhstan", "keith", 
  "keller", "kelley", "kellogg", "kelly", "kendall", "kennedy", "kenneth", 
  "kenny", "kensington", "kent", "kentucky", "kenwood", "kenya", "kerala", 
  "kerman", "kerr", "kerry", "kevin", "kiev", "kijiji", "kiley", "kim", 
  "kimberly", "kirby", "kiribati", "kirk", "kirsten", "kissimmee", "klaus", 
  "klein", "knox", "knoxville", "kobe", "kodak", "kona", "kondo", "kong", 
  "konica", "korea", "korean", "korn", "kosovo", "kramer", "kremlin", 
  "krishna", "kristen", "kristin", "kruger", "kuala", "kumar", "kurt", 
  "kuwait", "kwanza", "kyle", "kylie", "kyoto", "kyrgyzstan",

  // Boring Corporate/Admin/General Junk
  "kb", "kbps", "kbytes", "kc", "kd", "kde", "kg", "kh", "khz", "km", "kms"
];

const wordsDir = path.join('public', 'dictionary', 'K', '01_Words');

console.log('Starting cleanup of K dictionary...');

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
