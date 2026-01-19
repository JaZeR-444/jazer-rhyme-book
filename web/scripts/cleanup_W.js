import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "wac", "wachuset", "waddied", "waddings", "waddly", "waefu", "wafery", 
  "wagener", "wagger", "wains", "wakeners", "wal", "walkmill", "walksman", 
  "wambais", "wanlas", "wanwordy", "wardite", "wardmaid", "warnt", 
  "warpwise", "warsled", "warworks", "wastine", "wat", "wavably", 
  "wavement", "waybird", "weatings", "wedder", "weedish", "weilang", 
  "weism", "welcher", "welladay", "wellsian", "wenchel", "wende", "wennier", 
  "whabby", "whangees", "wharfie", "whatness", "wheals", "wheen", "wheeping", 
  "whenso", "wherves", "whetile", "whilend", "whilkut", "whinnel", "whirried", 
  "whiskin", "whiteys", "wholely", "whooshed", "wicca", "widdles", "wiikite", 
  "wilga", "wiliest", "willywaw", "wimple", "windage", "winkling", "winme", 
  "winzemen", "wirings", "wiros", "wiseling", "witchuck", "withgang", 
  "withhele", "withspar", "withvine", "witlet", "witloof", "witten", "woan", 
  "wobster", "wodenism", "wollomai", "wongen", "woodgrub", "workshy", 
  "wormils", "worrited", "wouch", "woustour", "wraiths", "wrappage", "wrig", 
  "writhy", "wrothly", "wurmal", "wurrup", "wurzel",

  // Random Names/Places (Non-JaZeR)
  "wagner", "wakefield", "wallace", "wallis", "walsh", "walter", "walton", 
  "warren", "warsaw", "warwick", "washington", "waterford", "waterloo", 
  "watkins", "watson", "wayne", "webb", "webster", "wendy", "werner", 
  "wesley", "wesleyan", "westfield", "westham", "westin", "weston", 
  "westwood", "wheaton", "whitney", "wichita", "wilhelm", "wilkes", 
  "wilkins", "willard", "willie", "willis", "wilmington", "wilson", 
  "wilton", "wiltshire", "wimbledon", "winchester", "windsor", "winnie", 
  "winnipeg", "winslow", "worcester", "wyatt", "wyndham", "wyoming",

  // Boring Corporate/Admin/General Junk
  "waiver", "walmart", "warrant", "warranties", "webcams", "webcast", 
  "webdesign", "webeye", "webhosting", "webinar", "weblogic", "weblogs", 
  "webmail", "webmaster", "webmasters", "webmd", "webmin", "webpage", 
  "webring", "websites", "websphere", "wellbutrin", "wks", "wlan", "wmd", 
  "wordpress", "worldcat", "wsop", "wto", "wwe", "wwf", "wwii", "www",

  // Inappropriate
  "whores"
];

const wordsDir = path.resolve('public', 'dictionary', 'W', '01_Words');

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
