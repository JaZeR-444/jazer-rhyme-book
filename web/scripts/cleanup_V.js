import fs from 'fs';
import path from 'path';

const targets = [
  // Obscure/Technical Clutter
  "va", "vaagmaer", "vac", "vacantry", "vacuoles", "vadimony", "vadis", 
  "vagient", "vaginant", "vail", "vaio", "vakeels", "valancy", "valetdom", 
  "valgoid", "validous", "valium", "valvules", "vambrace", "vambrash", 
  "vamplate", "vanillic", "vanitory", "vanner", "vapulate", "var", "vara", 
  "vardapet", "variadic", "varistor", "vasal", "vascular", "vaudism", "vavs", 
  "vawntie", "vbulletin", "vcd", "vdata", "ve", "vedanta", "venae", 
  "vendues", "veneres", "venesia", "venines", "venkisen", "venlin", 
  "ventages", "venter", "ventrine", "venturi", "venular", "venusty", "veps", 
  "ver", "veratral", "verd", "verditer", "verisign", "verisms", "veritas", 
  "verlag", "vermicle", "vermoulu", "vernant", "verrugas", "vers", "versa", 
  "verseman", "versemen", "versipel", "vert", "verts", "vertugal", "verus", 
  "vesicae", "vesicate", "vesicle", "vestral", "vestuary", "vi", 
  "viability", "viagra", "vialed", "viand", "viators", "vibists", 
  "vibrissa", "vic", "viceroy", "vicodin", "victal", "vicus", "videnda", 
  "vidry", "vidua", "vierling", "viet", "vietminh", "viewier", "vignin", 
  "vigoroso", "vii", "viii", "vili", "vilicate", "vilifier", "ville", 
  "villus", "vims", "vin", "vinasse", "vinelike", "vinter", "vinylic", 
  "viola", "violine", "vioxx", "viperoid", "viremias", "viremic", "virgula", 
  "virilism", "virls", "viroses", "virtuosi", "virtuoso", "vis", "visarga", 
  "visie", "visitation", "vitellin", "vitium", "vituline", "vivda", 
  "vivific", "vivo", "vivos", "vivre", "viz", "vizards", "vizoring", "vl", 
  "vlan", "vm", "vn", "vo", "voc", "vocative", "voicers", "voidless", 
  "voiture", "vol", "volary", "volata", "volemite", "volenti", "volently", 
  "voltes", "vols", "vomitos", "von", "voor", "vor", "voracity", "vorlages", 
  "vorspiel", "vos", "votally", "vous", "vowers", "vowline", "vox", "voyer", 
  "vr", "vrilling", "vs", "vsnet", "vt", "vu", "vugg", "vulturn", "vv", "vx",

  // Random Names/Places (Non-JaZeR)
  "valencia", "valentine", "valentines", "valentino", "valerie", "vallarta", 
  "vancouver", "vanderbilt", "vanessa", "vanuatu", "vassar", "vatican", 
  "vaughan", "vaughn", "vauxhall", "vega", "vegas", "venetian", "venezuela", 
  "venice", "ventura", "venus", "vera", "verde", "vermont", "vern", 
  "vernon", "verona", "veronica", "versace", "vespucci", "vesuvius", 
  "vicki", "vickie", "victor", "victoria", "victorian", "vienna", 
  "vietnam", "vietnamese", "viking", "vikings", "vince", "vincent", 
  "vinci", "vinny", "virginia", "virgil", "vladimir", "vodafone", "volvo", 
  "vuitton",

  // Boring Corporate/Admin/General/Medical Junk
  "vacancies", "vacancy", "vacation", "vacations", "vaccine", "vaccines", 
  "val", "validate", "validated", "validation", "validity", "valuation", 
  "van", "vance", "vanities", "vanity", "variations", "varied", "varies", 
  "varietal", "varieties", "variety", "varsity", "varying", "vb", "vc", 
  "vcr", "vector", "vectors", "vegetable", "vegetables", "vegetarian", 
  "vegetation", "vending", "vendor", "vendors", "verb", "verbal", 
  "verbatim", "verdict", "verified", "verify", "verifying", "verizon", 
  "version", "versions", "versus", "vest", "vested", "vests", "veteran", 
  "veterans", "veterinary", "veto", "vga", "vhf", "vhs", "vice", 
  "vicinity", "videogames", "videotape", "violation", "violations", 
  "violence", "viral", "virtual", "virtually", "virus", "viruses", "visa", 
  "visas", "visibility", "visible", "visit", "visited", "visiting", 
  "visitor", "visitors", "visits", "vitamin", "vitamins", "vocational", 
  "voicemail", "voip", "voluntary", "volunteer", "volunteers", "voting", 
  "voucher", "vouchers", "vp", "vpn", "vulnerable",

  // Inappropriate
  "vagina", "vaginal", "vaginas", "sexually", "sexy", "livesex", "voyeur", 
  "voyeurs", "voyeurweb", "vulva", "vomiting"
];

const wordsDir = path.resolve('public', 'dictionary', 'V', '01_Words');

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
