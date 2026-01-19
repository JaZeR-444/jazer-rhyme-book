/**
 * JaZeR Dictionary Phase 2 Curation Script
 * 
 * Goal: Reduce from 4,937 to ~3,500 words
 * - Remove non-JaZeR-aligned vocabulary
 * - Add missing motif words from ABOUT_JAZER.md
 * - Rebuild manifest
 * 
 * Usage:
 *   node execute-phase2-curation.js --dry-run   # Preview changes
 *   node execute-phase2-curation.js             # Execute changes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRY_RUN = process.argv.includes('--dry-run');
const DICTIONARY_PATH = path.join(__dirname, 'public', 'dictionary');
const MANIFEST_PATH = path.join(DICTIONARY_PATH, 'MASTER-DICTIONARY-MANIFEST.json');

// ============================================================
// PROTECTED WORDS - Never remove these
// ============================================================

const PROTECTED_WORDS = new Set([
  // Core JaZeR Motifs (from ABOUT_JAZER.md)
  'beam', 'light', 'color', 'signal', 'transmission', 'static', 'cosmic', 'home',
  'doorway', 'night', 'drive', 'highway', 'dashboard', 'glow', 'pressure', 'power',
  'scoreboard', 'momentum', 'focus', 'future', 'city', 'neon', 'sky', 'builder',
  'climb', 'pulse', 'lift', 'landing', 'calm', 'storm',
  
  // Light/Signal
  'shimmer', 'prism', 'skyline', 'horizon', 'halo', 'ember', 'flare',
  'gradient', 'starlight', 'spark', 'ray', 'bright', 'shine',
  
  // Sound
  'thrum', 'hum', 'echo', 'ripple', 'click', 'hiss', 'swell', 'drop', 'rush',
  'boom', 'bass', 'beat', 'hook', 'rhythm', 'melody', 'harmony', 'tempo',
  
  // Texture
  'smooth', 'crisp', 'velvet', 'glassy', 'warm', 'soft', 'clean', 'weighty',
  'airy', 'grounded', 'glowing',
  
  // Motion
  'rise', 'drift', 'glide', 'surge', 'loop', 'coast', 'land', 'orbit', 'flow',
  'arc', 'launch', 'bounce', 'cruise', 'roll', 'slide',
  
  // Road/Night Drive
  'road', 'lane', 'headlights', 'mirror', 'window', 'engine', 'curve', 'asphalt',
  
  // Sports/Game
  'clock', 'huddle', 'whistle', 'baseline', 'overtime', 'season', 'jersey', 'arena',
  'bullpen', 'champion', 'stamina', 'grind', 'victory', 'win',
  
  // Weather/Storm
  'thunder', 'lightning', 'rain', 'fog', 'clouds', 'wind', 'flood', 'clear',
  
  // Tech/Transmission
  'frequency', 'channel', 'code', 'circuit', 'waveform', 'antenna',
  
  // Home/Belonging
  'keys', 'room', 'table', 'lamp', 'hallway', 'porch', 'frame', 'floor',
  'roof', 'shelter',
  
  // Studio/Craft
  'mic', 'booth', 'console', 'pads', 'fader', 'cable', 'screen', 'session',
  'verse', 'bars', 'track', 'record', 'album', 'single', 'sample', 'mix',
  
  // Contrast Pairing Words
  'black', 'noise', 'clarity', 'shadow', 'doubt', 'cold', 'lost', 'found',
  'closed', 'open', 'fade',
  
  // Hip-hop Energy Words
  'fire', 'flames', 'hot', 'ice', 'icy', 'heat', 'burn', 'blaze', 'ignite', 'lit',
  'flash', 'dark', 'crash', 'fly', 'soar', 'float', 'hustle', 'push', 'pull',
  'jump', 'leap', 'sway', 'triumph', 'king', 'queen', 'crown', 'throne', 'reign',
  'empire', 'legacy', 'legend', 'icon', 'goat', 'boss', 'chief', 'captain',
  'leader', 'pioneer', 'visionary', 'struggle', 'fight', 'battle', 'war',
  'warrior', 'soldier', 'survive', 'overcome', 'conquer', 'defeat', 'resilient',
  'strong', 'strength', 'force', 'might', 'muscle', 'iron', 'steel',
  'street', 'block', 'hood', 'urban', 'concrete', 'pavement', 'corner',
  'avenue', 'boulevard', 'alley', 'district', 'zone', 'turf',
  'money', 'cash', 'bread', 'dough', 'paper', 'bank', 'stack', 'bands',
  'racks', 'profit', 'wealth', 'rich', 'fortune', 'treasure', 'gold',
  'love', 'hate', 'pain', 'joy', 'peace', 'hope', 'fear', 'trust', 'faith',
  'pride', 'humble', 'real', 'raw', 'truth',
  'time', 'moment', 'second', 'minute', 'hour', 'day', 'morning', 'evening',
  'dawn', 'dusk', 'midnight', 'noon', 'forever',
  'sun', 'moon', 'star', 'cloud', 'ocean', 'wave', 'mountain', 'valley',
  'river', 'forest', 'desert', 'jungle', 'earth', 'water',
  'way', 'say', 'play', 'stay', 'pay', 'may', 'lay',
  'game', 'fame', 'name', 'same', 'flame', 'claim', 'aim',
  'feel', 'deal', 'steal', 'heal', 'reveal', 'appeal', 'meal',
  'mind', 'find', 'kind', 'blind', 'behind', 'bind',
  'soul', 'goal', 'control', 'whole', 'bowl', 'role', 'pole',
  'sick', 'dope', 'fresh', 'hard', 'heavy', 'tight', 'loose', 'wild', 'crazy', 'mad',
  
  // Protected Locations (JaZeR-relevant)
  'austin', 'chicago', 'texas'
]);

// ============================================================
// REMOVAL CRITERIA
// ============================================================

// Technical/Corporate Jargon
const TECH_CORPORATE = new Set([
  'accessed', 'accessing', 'accession', 'accrued', 'accumulate', 'addendum',
  'administered', 'administrative', 'advisory', 'affiliated', 'aggregate',
  'albeit', 'algorithm', 'allocate', 'allocated', 'amendment', 'amortize',
  'annotation', 'annuity', 'appendix', 'appendices', 'applicable', 'appraisal',
  'arbitration', 'arbitrary', 'archival', 'ascertain', 'asserted', 'assertion',
  'assessment', 'assignee', 'bandwidth', 'benchmark', 'benchmarks', 'bilateral',
  'bipartisan', 'bylaw', 'bylaws', 'calibrate', 'calibrated', 'capitalized',
  'categorical', 'certifiable', 'certification', 'circumvent', 'codified',
  'collateral', 'collateralized', 'commenced', 'commencing', 'commodities',
  'compensate', 'compensated', 'compliance', 'compounded', 'comprise', 'comprised',
  'concurrence', 'consecutive', 'consolidated', 'consortium', 'constituted',
  'contingent', 'contractual', 'convened', 'correlate', 'correlated', 'corresponds',
  'counterpart', 'cumulative', 'database', 'deductible', 'deferral', 'deferred',
  'deficiency', 'denominated', 'depreciate', 'depreciated', 'depreciation',
  'designate', 'designated', 'determinant', 'deviation', 'disbursement',
  'disclaimed', 'disclaimer', 'discretionary', 'disseminate', 'disseminated',
  'diversified', 'duly', 'effectuate', 'efficacy', 'elapsed', 'eligibility',
  'encompass', 'encompasses', 'encumber', 'encumbered', 'endorse', 'enumerate',
  'enumerated', 'equitable', 'escalate', 'escalated', 'eschew', 'escrowed',
  'evaluated', 'evidenced', 'exacerbate', 'excepted', 'excludable', 'executable',
  'exempted', 'expedite', 'expenditure', 'expiration', 'expunge', 'extenuate',
  'fiduciary', 'finalized', 'foreclosure', 'formulate', 'formulated', 'forthcoming',
  'forthwith', 'fulfillment', 'functionality', 'governance', 'grantor', 'grievance',
  'herein', 'hereinafter', 'heretofore', 'hypothetical', 'implemented', 'implication',
  'imputed', 'incidental', 'incurred', 'indemnify', 'indemnified', 'indenture',
  'indicative', 'inefficiencies', 'infrastructure', 'initialized', 'instituted',
  'insurable', 'intercompany', 'interdependent', 'interim', 'inventory', 'irrevocable',
  'itemized', 'jurisdictional', 'leasehold', 'lessor', 'lessee', 'liabilities',
  'liquidate', 'liquidated', 'litigation', 'mandated', 'mandatory', 'materiality',
  'maturity', 'memorandum', 'mitigate', 'mitigated', 'modification', 'monetize',
  'negotiate', 'negotiated', 'noncompliance', 'nonexempt', 'nonrecurring',
  'notwithstanding', 'obligated', 'obligor', 'obtainable', 'occurrence', 'offsetting',
  'omitted', 'originated', 'origination', 'outlays', 'overarching', 'oversight',
  'parameterized', 'payable', 'percentile', 'permissible', 'pertaining', 'predetermined',
  'predominantly', 'prefunded', 'prepaid', 'prerequisite', 'prescriptive', 'prevailing',
  'prioritize', 'prioritized', 'procedural', 'procure', 'procured', 'procurement',
  'prorated', 'prospectus', 'provisioned', 'pursuant', 'quantifiable', 'quantified',
  'quasi', 'ratification', 'reacquired', 'reallocate', 'reallocated', 'receivable',
  'reconcile', 'reconciled', 'reconfigure', 'reconfigured', 'recoverable', 'rectify',
  'redacted', 'redeemable', 'redeemed', 'redemption', 'redundancy', 'refundable',
  'reimburse', 'reimbursed', 'reimbursement', 'reinstate', 'reinstated', 'reiterate',
  'reliance', 'remittance', 'remuneration', 'renegotiate', 'renegotiated', 'repayable',
  'reportable', 'rescind', 'rescinded', 'restructure', 'restructured', 'restructuring',
  'resultant', 'retainer', 'retrospective', 'revocable', 'sanctioned', 'scalable',
  'scalability', 'segregate', 'segregated', 'sequentially', 'serviceable', 'signatory',
  'stakeholder', 'stipulate', 'stipulated', 'stockholder', 'subcontract', 'subcontracted',
  'subordinate', 'subordinated', 'subparagraph', 'subpoena', 'subrogation', 'subsection',
  'subsequently', 'subsidiary', 'substantiate', 'substantiated', 'substituted', 'summarily',
  'supersede', 'superseded', 'supplemental', 'terminate', 'terminated', 'thereafter',
  'thereof', 'thereto', 'throughput', 'transact', 'transacted', 'transferable',
  'transitioned', 'underwrite', 'underwritten', 'unencumbered', 'unfunded', 'unilateral',
  'unsecured', 'utilized', 'validate', 'validated', 'variance', 'vested', 'viability',
  'waiver', 'warranted', 'whereabouts', 'whereby', 'wherein', 'withdrawal', 'withholding',
  'workload', 'writeoff', 'yearend', 'interface', 'linker', 'hardware', 'derivative',
  'integral', 'regression', 'variable', 'quartile', 'workgroup'
]);

// Scientific/Medical Terms
const SCIENTIFIC_MEDICAL = new Set([
  'abietic', 'acetate', 'acetic', 'acinous', 'acrolein', 'adenine', 'adipose',
  'aerobia', 'aerobic', 'aerodone', 'aetiology', 'agglutinate', 'albumin', 'aldehyde',
  'algae', 'alkaline', 'alkaloid', 'allele', 'amoeba', 'amoebic', 'amylase',
  'anabolic', 'anaerobic', 'anatomical', 'androgen', 'anemia', 'anemic', 'aneurysm',
  'antigen', 'antimicrobial', 'antiseptic', 'aorta', 'aortic', 'apoptosis', 'aqueous',
  'arthritis', 'asbestos', 'asphyxia', 'atrophy', 'auditory', 'auricular', 'autoimmune',
  'autopsy', 'axon', 'bacillus', 'bacteria', 'bacterial', 'benign', 'bicep', 'biopsy',
  'biosynthesis', 'bronchial', 'bronchitis', 'calcium', 'calorie', 'carbohydrate',
  'carcinogen', 'carcinogenic', 'cardiac', 'cardiovascular', 'cartilage', 'catalyst',
  'catalytic', 'catheter', 'cellular', 'cellulose', 'cerebral', 'cervical', 'chloride',
  'chlorophyll', 'cholesterol', 'chromosome', 'circulatory', 'coagulate', 'cochlear',
  'collagen', 'congenital', 'cortex', 'cortical', 'cranial', 'cytoplasm', 'dehydration',
  'dermal', 'dermatology', 'dextrose', 'dialysis', 'diastolic', 'digestive', 'dilate',
  'dilated', 'dioxide', 'dissect', 'diuretic', 'dna', 'dopamine', 'dorsal', 'eczema',
  'edema', 'electrode', 'electrolyte', 'embryo', 'embryonic', 'endocrine', 'enzyme',
  'enzymatic', 'epidemiology', 'epidermal', 'epilepsy', 'epithelial', 'erythrocyte',
  'esophagus', 'estrogen', 'etiology', 'eukaryote', 'excretion', 'exoskeleton',
  'femoral', 'femur', 'fetal', 'fibrosis', 'fluoride', 'follicle', 'fungi', 'fungal',
  'gallbladder', 'gastric', 'gastrointestinal', 'gene', 'genetic', 'genome', 'genomic',
  'geriatric', 'gland', 'glandular', 'glucose', 'glutamate', 'glycerin', 'glycogen',
  'gonad', 'gynecology', 'hemoglobin', 'hemorrhage', 'hepatic', 'hepatitis', 'hereditary',
  'hernia', 'histamine', 'histology', 'hormone', 'hormonal', 'hydrate', 'hydration',
  'hydroxide', 'hypertension', 'hyperthyroid', 'hypothalamus', 'hypothermia',
  'immunology', 'implant', 'incision', 'incubate', 'inflammation', 'ingest', 'injection',
  'insulin', 'intestinal', 'intravenous', 'iodine', 'isotope', 'keratin', 'kidney',
  'lactate', 'lactose', 'larva', 'larvae', 'laryngeal', 'larynx', 'lesion', 'leukemia',
  'leukocyte', 'ligament', 'lipid', 'lobe', 'lumbar', 'lymph', 'lymphatic', 'lymphocyte',
  'malignant', 'mammal', 'mammary', 'mandible', 'membrane', 'meningitis', 'menstrual',
  'metabolic', 'metabolism', 'metastasis', 'microbe', 'microbial', 'microorganism',
  'mitochondria', 'mitosis', 'molecule', 'molecular', 'morphology', 'mucous', 'mucus',
  'mutation', 'myocardial', 'nasal', 'neonatal', 'nephrology', 'neural', 'neurology',
  'neuron', 'neurotransmitter', 'nitrate', 'nitrogen', 'nucleic', 'nucleus', 'nutrient',
  'obstetric', 'ocular', 'oncology', 'optic', 'optical', 'organism', 'orthopedic',
  'osmosis', 'osseous', 'osteoporosis', 'ovarian', 'ovary', 'oxide', 'oxidize', 'oxygen',
  'pancreas', 'pancreatic', 'parasite', 'parasitic', 'pathogen', 'pathogenic', 'pathology',
  'pediatric', 'pelvic', 'pelvis', 'peptide', 'peristalsis', 'peritoneal', 'pharynx',
  'phenotype', 'phosphate', 'photosynthesis', 'physiology', 'pigment', 'pituitary',
  'plasma', 'platelet', 'pneumonia', 'pollinate', 'polymer', 'potassium', 'prenatal',
  'primate', 'probiotic', 'progesterone', 'prokaryote', 'prostate', 'protein', 'protoplasm',
  'protozoa', 'psychiatric', 'psychiatry', 'pulmonary', 'pupil', 'pyloric', 'radiation',
  'reagent', 'receptor', 'recessive', 'rectum', 'reflex', 'renal', 'replicate',
  'reproductive', 'respiration', 'respiratory', 'retina', 'retinal', 'rheumatoid',
  'ribonucleic', 'ribosome', 'rna', 'sacrum', 'saline', 'saliva', 'salivary', 'sarcoma',
  'scalpel', 'sclerosis', 'secretion', 'sedative', 'seizure', 'semen', 'sensory', 'sepsis',
  'serology', 'serum', 'skeletal', 'sodium', 'soluble', 'solute', 'somatic', 'specimen',
  'spectrometry', 'sperm', 'spinal', 'spleen', 'staphylococcus', 'sterile', 'sterilize',
  'steroid', 'stimulus', 'streptococcus', 'subcutaneous', 'sulfate', 'surgical',
  'sympathetic', 'symptom', 'symptomatic', 'synapse', 'syndrome', 'synthesis', 'systemic',
  'systolic', 'tendon', 'testicular', 'testosterone', 'therapeutic', 'therapy', 'thoracic',
  'thorax', 'thyroid', 'tissue', 'topical', 'toxic', 'toxicity', 'toxin', 'trachea',
  'transfusion', 'transplant', 'trauma', 'traumatic', 'tumor', 'ulcer', 'ultrasound',
  'umbilical', 'urea', 'ureter', 'urethra', 'urinalysis', 'urinary', 'urology', 'uterine',
  'uterus', 'vaccine', 'vascular', 'vein', 'venous', 'ventricle', 'ventricular', 'vertebra',
  'vertebrae', 'viral', 'virology', 'visceral', 'vitamin', 'vitreous', 'xray', 'zygote',
  'lux', 'volt', 'watt', 'quark', 'niche', 'reduction'
]);

// Brand Names
const BRAND_NAMES = new Set([
  'adobe', 'alibaba', 'amazon', 'amc', 'amd', 'android', 'apple', 'asus', 'audi',
  'bentley', 'bmw', 'boeing', 'burberry', 'cadillac', 'canon', 'cartier', 'caterpillar',
  'chanel', 'chevrolet', 'chrysler', 'cisco', 'citibank', 'cocacola', 'colgate', 'compaq',
  'dell', 'disney', 'dodge', 'dolce', 'dunkin', 'ebay', 'epson', 'ericsson', 'espn',
  'exxon', 'facebook', 'fedex', 'ferrari', 'fiat', 'ford', 'fujitsu', 'gabbana',
  'gillette', 'gmail', 'google', 'gucci', 'harley', 'heineken', 'hermes', 'hewlett',
  'hitachi', 'honda', 'hotmail', 'hp', 'hsbc', 'huawei', 'hyundai', 'ibm', 'ikea',
  'intel', 'iphone', 'jaguar', 'jeep', 'jpmorgan', 'kawasaki', 'kfc', 'kia', 'kodak',
  'kohls', 'kpmg', 'kraft', 'lamborghini', 'landrover', 'lenovo', 'lexus', 'linkedin',
  'loreal', 'louisvuitton', 'lowes', 'lufthansa', 'marriott', 'mastercard', 'matsushita',
  'mazda', 'mcdonald', 'mcdonalds', 'mercedes', 'microsoft', 'mitsubishi', 'motorola',
  'msn', 'nestle', 'netflix', 'nintendo', 'nissan', 'nokia', 'nordstrom', 'nvidia',
  'oracle', 'packard', 'panasonic', 'paypal', 'pepsi', 'pepsico', 'pfizer', 'philips',
  'pinterest', 'playstation', 'porsche', 'prada', 'qualcomm', 'raytheon', 'reebok',
  'renault', 'rolex', 'samsung', 'sap', 'seiko', 'siemens', 'snapchat', 'sony', 'spotify',
  'sprint', 'starbucks', 'subaru', 'suzuki', 'tesco', 'tesla', 'texaco', 'tiffany',
  'tiktok', 'tmobile', 'toshiba', 'toyota', 'twitter', 'uber', 'unilever', 'ups',
  'verizon', 'versace', 'viacom', 'visa', 'vodafone', 'volkswagen', 'volvo', 'vuitton',
  'walmart', 'walgreens', 'wendys', 'whatsapp', 'whirlpool', 'wikipedia', 'wix',
  'wordpress', 'xbox', 'xerox', 'yahoo', 'yamaha', 'youtube', 'zara'
]);

// Obscure/Archaic Words
const OBSCURE_ARCHAIC = new Set([
  'abacas', 'abbesses', 'abjure', 'ablaut', 'ablative', 'abnegate', 'abscond',
  'abstemious', 'abstruse', 'accede', 'accost', 'accoutre', 'acerbest', 'achete',
  'acolyte', 'acquiesce', 'adage', 'adjudge', 'adjure', 'adumbrate', 'aegis',
  'aedicula', 'aefaldy', 'aeon', 'aequi', 'affray', 'afrit', 'agathism', 'aghast',
  'agneaux', 'agueweed', 'ainhum', 'akaakai', 'akawai', 'albizzia', 'alegar',
  'aljamia', 'almuce', 'alogia', 'alphorns', 'alpinia', 'altin', 'alumines', 'alvine',
  'alya', 'amabel', 'ambreate', 'amel', 'amidated', 'amiles', 'amoebeum', 'amoebous',
  'amolish', 'amphorae', 'anabatic', 'anapnoic', 'anareta', 'ancilia', 'anfeeld',
  'ankoli', 'antepast', 'anthemis', 'antiar', 'antilogs', 'antiship', 'antjar',
  'apnoea', 'apodal', 'apothegm', 'appurtenance', 'arauan', 'aralie', 'archness',
  'argent', 'argolic', 'arguta', 'armenoid', 'aroast', 'arrear', 'arrogate',
  'arsenism', 'artcraft', 'asamblea', 'ascoma', 'ascula', 'aseity', 'asimen',
  'asoka', 'assay', 'assays', 'assoin', 'assurge', 'astilbe', 'atresic', 'atrypa',
  'auantic', 'aubades', 'auctors', 'auronal', 'auslaute', 'auxocyte', 'avarish',
  'avion', 'awny', 'axolotls', 'azides', 'azotate', 'baalish', 'baalshem', 'bablah',
  'babudom', 'bachel', 'bached', 'bagobo', 'baignet', 'baizes', 'bajau', 'balanism',
  'baldric', 'barbal', 'barauna', 'bardship', 'baronage', 'barratry', 'bason',
  'bassinet', 'bathetic', 'bathos', 'battue', 'bauxite', 'beadle', 'beatific',
  'becalm', 'bedaub', 'bedizen', 'beget', 'begrime', 'beguile', 'behest', 'beleaguer',
  'belie', 'bellicose', 'benefice', 'benison', 'bequeath', 'bequest', 'berate',
  'bereave', 'beseech', 'besmirch', 'betoken', 'betrothal', 'bevy', 'bilious',
  'bivouac', 'blandish', 'blaspheme', 'bloat', 'boatswain', 'bodkin', 'boggle',
  'boll', 'bolster', 'bombast', 'bonhomie', 'bootless', 'botch', 'bough', 'bowdlerize',
  'brackish', 'braggadocio', 'bray', 'brazier', 'breech', 'brine', 'bristle',
  'broach', 'brocade', 'bromide', 'brood', 'browbeat', 'bruit', 'buffet', 'bulwark',
  'bumptious', 'bungle', 'burgeon', 'buttress', 'anon', 'thee', 'thou', 'unto',
  'whilst', 'yea', 'hitherto', 'wherefore', 'heretofore', 'thence', 'whence',
  'nay', 'marry', 'imperative', 'upon'
]);

// Geographic Proper Nouns (except Austin, Chicago, Texas)
const GEOGRAPHIC = new Set([
  'aberdeen', 'adriatic', 'aegean', 'afghan', 'africa', 'african', 'alabama',
  'alameda', 'alaska', 'albania', 'albany', 'alberta', 'albuquerque', 'algeria',
  'algiers', 'allegheny', 'amsterdam', 'anchorage', 'andalusia', 'andean', 'andes',
  'andorra', 'angola', 'angolan', 'antarctic', 'antigua', 'antilles', 'appalachian',
  'arabia', 'arabian', 'arctic', 'argentina', 'arizona', 'arkansas', 'armenia',
  'armenian', 'asia', 'asian', 'asians', 'athens', 'atlanta', 'atlantic', 'auckland',
  'austria', 'austrian', 'bahamas', 'bahrain', 'baja', 'bali', 'balkan', 'balkans',
  'baltic', 'baltimore', 'banff', 'bangladesh', 'barbados', 'barbuda', 'barcelona',
  'bavarian', 'beijing', 'beirut', 'belgian', 'belgium', 'belgrade', 'belize',
  'bengal', 'berlin', 'bermuda', 'bhutan', 'birmingham', 'bolivia', 'bolivian',
  'bombay', 'bonn', 'bosnia', 'bosnian', 'boston', 'botswana', 'brazil', 'brazilian',
  'brisbane', 'britain', 'british', 'bronx', 'brooklyn', 'brunei', 'brussels',
  'bucharest', 'budapest', 'buenos', 'buffalo', 'bulgaria', 'bulgarian', 'burma',
  'burmese', 'burundi', 'cairo', 'calcutta', 'calgary', 'california', 'cambodia',
  'cambodian', 'cambridge', 'cameroon', 'canada', 'canadian', 'canberra', 'canton',
  'caribbean', 'carolina', 'casablanca', 'caspian', 'catalonia', 'celtic', 'chad',
  'charlotte', 'chilean', 'china', 'chinese', 'cincinnati', 'cleveland', 'colombia',
  'colombian', 'colorado', 'columbia', 'connecticut', 'copenhagen', 'corsica',
  'costa', 'croatia', 'croatian', 'cuba', 'cuban', 'cyprus', 'czech', 'czechoslovakia',
  'dallas', 'damascus', 'danish', 'danube', 'delaware', 'delhi', 'denmark', 'denver',
  'detroit', 'dominican', 'dubai', 'dublin', 'dutch', 'ecuador', 'edinburgh',
  'edmonton', 'egypt', 'egyptian', 'england', 'english', 'eritrea', 'estonia',
  'estonian', 'ethiopia', 'ethiopian', 'europe', 'european', 'fiji', 'fijian',
  'finland', 'finnish', 'florence', 'florida', 'france', 'frankfurt', 'french',
  'gabon', 'gambia', 'geneva', 'genoa', 'georgia', 'georgian', 'german', 'germany',
  'ghana', 'ghanaian', 'gibraltar', 'glasgow', 'greece', 'greek', 'greenland',
  'grenada', 'guam', 'guatemala', 'guatemalan', 'guinea', 'guyana', 'haiti',
  'haitian', 'hamburg', 'hamilton', 'hanoi', 'harlem', 'havana', 'hawaii', 'hawaiian',
  'hebrew', 'helsinki', 'himalayan', 'himalayas', 'holland', 'hollywood', 'honduras',
  'honduran', 'hongkong', 'honolulu', 'houston', 'hungarian', 'hungary', 'iceland',
  'icelandic', 'idaho', 'illinois', 'india', 'indian', 'indiana', 'indianapolis',
  'indonesia', 'indonesian', 'iowa', 'iran', 'iranian', 'iraq', 'iraqi', 'ireland',
  'irish', 'israel', 'israeli', 'istanbul', 'italian', 'italy', 'ivory', 'jacksonville',
  'jamaica', 'jamaican', 'japan', 'japanese', 'java', 'jerusalem', 'jordan',
  'jordanian', 'kansas', 'karachi', 'kashmir', 'kazakh', 'kazakhstan', 'kentucky',
  'kenya', 'kenyan', 'kiev', 'korea', 'korean', 'kosovo', 'kuwait', 'kuwaiti',
  'kyoto', 'laos', 'laotian', 'latin', 'latvia', 'latvian', 'lebanese', 'lebanon',
  'liberia', 'liberian', 'libya', 'libyan', 'liechtenstein', 'lima', 'lisbon',
  'lithuania', 'lithuanian', 'liverpool', 'london', 'louisiana', 'louisville',
  'luxembourg', 'macedonian', 'madagascar', 'madrid', 'maine', 'malawi', 'malaysia',
  'malaysian', 'maldives', 'mali', 'malta', 'maltese', 'manchester', 'manhattan',
  'manila', 'manitoba', 'marseille', 'maryland', 'massachusetts', 'mauritius',
  'mediterranean', 'melbourne', 'memphis', 'mexican', 'mexico', 'miami', 'michigan',
  'milan', 'milwaukee', 'minneapolis', 'minnesota', 'mississippi', 'missouri',
  'moldovan', 'monaco', 'mongolia', 'mongolian', 'montana', 'montreal', 'moroccan',
  'morocco', 'moscow', 'mozambique', 'mumbai', 'munich', 'myanmar', 'namibia',
  'naples', 'nashville', 'nebraska', 'nepal', 'nepalese', 'netherlands', 'nevada',
  'newark', 'newcastle', 'newfoundland', 'nicaragua', 'nicaraguan', 'niger',
  'nigeria', 'nigerian', 'nile', 'nordic', 'norfolk', 'normandy', 'norway',
  'norwegian', 'nottingham', 'oakland', 'oceania', 'ohio', 'oklahoma', 'olympia',
  'oman', 'omani', 'ontario', 'oregon', 'orlando', 'osaka', 'oslo', 'ottawa',
  'oxford', 'pacific', 'pakistan', 'pakistani', 'palestine', 'palestinian', 'panama',
  'panamanian', 'papua', 'paraguay', 'paraguayan', 'paris', 'parisian', 'pennsylvania',
  'persia', 'persian', 'peru', 'peruvian', 'philadelphia', 'philippine', 'philippines',
  'phoenix', 'pittsburgh', 'poland', 'polish', 'polynesia', 'polynesian', 'portland',
  'porto', 'portugal', 'portuguese', 'prague', 'princeton', 'providence', 'prussia',
  'prussian', 'pueblo', 'punjab', 'punjabi', 'qatar', 'qatari', 'quebec', 'queens',
  'queensland', 'rhodesia', 'richmond', 'rio', 'riyadh', 'romania', 'romanian',
  'rome', 'roman', 'rotterdam', 'russia', 'russian', 'rwanda', 'rwandan', 'sacramento',
  'sahara', 'saharan', 'samoa', 'samoan', 'sardinia', 'saskatchewan', 'saudi',
  'savannah', 'scandinavia', 'scandinavian', 'scotland', 'scottish', 'seattle',
  'senegal', 'senegalese', 'seoul', 'serbia', 'serbian', 'shanghai', 'siberia',
  'siberian', 'sicily', 'sierra', 'singapore', 'singaporean', 'slavic', 'slovakia',
  'slovakian', 'slovenia', 'slovenian', 'sofia', 'somalia', 'somali', 'spain',
  'spanish', 'stockholm', 'strasbourg', 'sudan', 'sudanese', 'sumatra', 'suriname',
  'swaziland', 'sweden', 'swedish', 'swiss', 'switzerland', 'sydney', 'syria',
  'syrian', 'tahiti', 'tahitian', 'taipei', 'taiwan', 'taiwanese', 'tajikistan',
  'tampa', 'tanzania', 'tanzanian', 'tehran', 'telugu', 'tennessee', 'thai',
  'thailand', 'thames', 'tibet', 'tibetan', 'togo', 'tokyo', 'toronto', 'trinidad',
  'tripoli', 'tucson', 'tulsa', 'tunis', 'tunisia', 'tunisian', 'turkey', 'turkish',
  'turkmenistan', 'tuscany', 'uganda', 'ugandan', 'ukraine', 'ukrainian', 'ulster',
  'uruguay', 'uruguayan', 'utah', 'uzbek', 'uzbekistan', 'vancouver', 'vatican',
  'venezuela', 'venezuelan', 'venice', 'venetian', 'vermont', 'vienna', 'vietnam',
  'vietnamese', 'virginia', 'wales', 'welsh', 'warsaw', 'washington', 'wellington',
  'winnipeg', 'wisconsin', 'wyoming', 'yemen', 'yemeni', 'yokohama', 'york',
  'yugoslavia', 'yugoslavian', 'yukon', 'zambia', 'zambian', 'zanzibar', 'zealand',
  'zimbabwe', 'zimbabwean', 'zurich'
]);

// Legal Jargon
const LEGAL_JARGON = new Set([
  'deposition', 'injunction', 'judicial', 'judiciary', 'jurisdiction', 'quorum',
  'whereas', 'compliance', 'plaintiff', 'defendant', 'subpoena', 'litigation',
  'arbitration', 'indemnify', 'lien', 'affidavit', 'adjudicate', 'appellate',
  'depose', 'enjoin', 'estoppel', 'habeas', 'mandamus', 'prima', 'facie',
  'pro', 'bono', 'qui', 'tam', 'res', 'judicata', 'stare', 'decisis', 'tort',
  'tortious', 'venue', 'voir', 'dire'
]);

// Anti-JaZeR Energy Words
const ANTI_JAZER = new Set([
  'arrogant', 'gossip', 'malice', 'rumor', 'useless', 'vicious', 'fake', 'fraud',
  'bitter', 'petty', 'cynical', 'spiteful', 'vindictive', 'resentful', 'jealous',
  'envious', 'hostile', 'aggressive', 'violent', 'cruel', 'brutal', 'savage',
  'merciless', 'ruthless', 'heartless', 'callous', 'insensitive', 'uncaring',
  'selfish', 'greedy', 'stingy', 'miserly', 'cowardly', 'spineless', 'weak',
  'pathetic', 'pitiful', 'worthless', 'meaningless', 'pointless', 'hopeless',
  'helpless', 'defenseless', 'vulgar', 'obscene', 'lewd', 'sleazy', 'slimy',
  'shady', 'sketchy', 'suspicious', 'deceitful', 'deceptive', 'manipulative',
  'exploitative', 'abusive', 'oppressive', 'tyrannical', 'despotic', 'dictatorial'
]);

// ============================================================
// MISSING MOTIF WORDS TO ADD
// ============================================================

const MOTIF_WORDS_TO_ADD = [
  { word: 'starlight', definition: 'Light from the stars; cosmic illumination that guides through darkness.' },
  { word: 'gradient', definition: 'A smooth transition between colors or states; the spectrum of change.' },
  { word: 'ember', definition: 'A glowing fragment; warmth that persists even as the fire fades.' },
  { word: 'thrum', definition: 'A low, continuous rhythmic sound or vibration; the pulse beneath the surface.' },
  { word: 'hiss', definition: 'The sound of static or escaping air; interference before clarity.' },
  { word: 'swell', definition: 'A gradual increase in volume or intensity; the wave building to crest.' },
  { word: 'velvet', definition: 'Soft, luxurious texture; smoothness that invites touch.' },
  { word: 'glassy', definition: 'Smooth and reflective like glass; sleek and polished.' },
  { word: 'weighty', definition: 'Having substance and importance; gravitas that demands attention.' },
  { word: 'airy', definition: 'Light and spacious; breathing room for ideas to expand.' },
  { word: 'drift', definition: 'To move gently without effort; floating through moments.' },
  { word: 'glide', definition: 'To move smoothly and effortlessly; grace in motion.' },
  { word: 'coast', definition: 'To move without exertion; momentum carrying you forward.' },
  { word: 'orbit', definition: 'To circle around something; the gravity that keeps you close.' },
  { word: 'arc', definition: 'A curved trajectory; the path of rise and return.' },
  { word: 'headlights', definition: 'Beams cutting through darkness; the signal that leads the way.' },
  { word: 'asphalt', definition: 'The road beneath wheels; the foundation of the journey.' },
  { word: 'curve', definition: 'A bend in the road; the turn before the straightaway.' },
  { word: 'huddle', definition: 'Coming together for strategy; the team moment before action.' },
  { word: 'baseline', definition: 'The foundation line; the starting point for measurement.' },
  { word: 'bullpen', definition: 'The preparation space; where you warm up before the moment.' },
  { word: 'overtime', definition: 'Extra time beyond the expected; going the distance.' },
  { word: 'fog', definition: 'Obscured vision; the unclear before clarity breaks through.' },
  { word: 'flood', definition: 'Overwhelming abundance; when it all comes at once.' },
  { word: 'frequency', definition: 'The wavelength of transmission; the channel you tune to.' },
  { word: 'channel', definition: 'The path of communication; the route the signal travels.' },
  { word: 'waveform', definition: 'The shape of sound; the visual language of audio.' },
  { word: 'antenna', definition: 'The receiver of signals; tuned to catch what others miss.' },
  { word: 'circuit', definition: 'A connected path; the loop that completes the signal.' },
  { word: 'hallway', definition: 'The transition space between rooms; moving between moments.' },
  { word: 'porch', definition: 'The threshold space; where inside meets outside.' },
  { word: 'frame', definition: 'The structure that holds; the border that defines.' },
  { word: 'lamp', definition: 'A warm light source; the glow that makes a room feel like home.' }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
    return true;
  }
  return false;
}

function getLetterFromWord(word) {
  return word[0].toUpperCase();
}

function shouldRemove(word) {
  const w = word.toLowerCase();
  
  // Never remove protected words
  if (PROTECTED_WORDS.has(w)) {
    return { remove: false, reason: 'Protected JaZeR vocabulary' };
  }
  
  // Check removal categories
  if (TECH_CORPORATE.has(w)) {
    return { remove: true, reason: 'Technical/corporate jargon', priority: 1 };
  }
  if (SCIENTIFIC_MEDICAL.has(w)) {
    return { remove: true, reason: 'Scientific/medical term', priority: 1 };
  }
  if (BRAND_NAMES.has(w)) {
    return { remove: true, reason: 'Brand name', priority: 2 };
  }
  if (OBSCURE_ARCHAIC.has(w)) {
    return { remove: true, reason: 'Obscure/archaic word', priority: 2 };
  }
  if (LEGAL_JARGON.has(w)) {
    return { remove: true, reason: 'Legal jargon', priority: 2 };
  }
  if (GEOGRAPHIC.has(w)) {
    return { remove: true, reason: 'Geographic proper noun', priority: 3 };
  }
  if (ANTI_JAZER.has(w)) {
    return { remove: true, reason: 'Anti-JaZeR energy', priority: 1 };
  }
  
  // Pattern-based removal for long formal words
  if (w.length > 12 && /tion$|ment$|ness$|ity$|ism$|ology$|ical$|ious$/.test(w)) {
    return { remove: true, reason: 'Long formal/academic suffix', priority: 4 };
  }
  
  // Very long words
  if (w.length > 14) {
    return { remove: true, reason: 'Excessively long word', priority: 5 };
  }
  
  return { remove: false, reason: 'Passes all filters' };
}

function createWordMd(word, definition) {
  const syllables = word.length <= 4 ? 1 : word.length <= 7 ? 2 : 3;
  
  return `# WORD: ${word.charAt(0).toUpperCase() + word.slice(1)}

## Meaning (plain):
${definition}

## Rap meaning (how I'd say it):
${definition}

## Syllables:
${syllables} (${word})

## Part of speech:
noun / verb / adjective

## Synonyms:
[to be curated]

## Antonyms:
[to be curated]

## Rhyme ideas (end / slant / multi):
[to be curated]

## 3 bar-ready examples:
1. [to be curated]
2. [to be curated]
3. [to be curated]

## 3 punchline angles:
1. [to be curated]
2. [to be curated]
3. [to be curated]

## Tags:
JaZeR-motif
`;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                      JAZER DICTIONARY PHASE 2 CURATION                        ║');
console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made\n');
}

// Load manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
const originalCount = manifest.totalWords;

console.log(`📊 Current word count: ${originalCount}`);
console.log(`🎯 Target word count: ~3,500\n`);

// Analyze all words
const toRemove = [];
const toKeep = [];

Object.entries(manifest.letters).forEach(([letter, data]) => {
  data.words.forEach(entry => {
    const result = shouldRemove(entry.word);
    if (result.remove) {
      toRemove.push({
        word: entry.word,
        path: entry.path,
        letter,
        ...result
      });
    } else {
      toKeep.push({
        word: entry.word,
        path: entry.path,
        letter
      });
    }
  });
});

// Sort by priority
toRemove.sort((a, b) => a.priority - b.priority);

// Group by reason for summary
const byReason = {};
toRemove.forEach(w => {
  byReason[w.reason] = byReason[w.reason] || [];
  byReason[w.reason].push(w);
});

console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ REMOVAL BREAKDOWN BY CATEGORY                                                 │');
console.log('├────────────────────────────────────────────────────────────────────────────────┤');
Object.entries(byReason).forEach(([reason, words]) => {
  console.log(`│ ${reason}: ${words.length}`.padEnd(79) + '│');
});
console.log('├────────────────────────────────────────────────────────────────────────────────┤');
console.log(`│ TOTAL TO REMOVE: ${toRemove.length}`.padEnd(79) + '│');
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

// Check for missing motif words
const existingWords = new Set(toKeep.map(w => w.word.toLowerCase()));
toRemove.forEach(w => existingWords.add(w.word.toLowerCase())); // Include words before removal

const missingMotifs = MOTIF_WORDS_TO_ADD.filter(m => !existingWords.has(m.word.toLowerCase()));
const presentMotifs = MOTIF_WORDS_TO_ADD.filter(m => existingWords.has(m.word.toLowerCase()));

console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ MISSING MOTIF WORDS TO ADD                                                    │');
console.log('├────────────────────────────────────────────────────────────────────────────────┤');
if (missingMotifs.length === 0) {
  console.log('│ All motif words already present!'.padEnd(79) + '│');
} else {
  missingMotifs.forEach(m => {
    console.log(`│ + ${m.word}`.padEnd(79) + '│');
  });
}
console.log('├────────────────────────────────────────────────────────────────────────────────┤');
console.log(`│ TOTAL TO ADD: ${missingMotifs.length}`.padEnd(79) + '│');
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

// Calculate projected final count
const projectedCount = originalCount - toRemove.length + missingMotifs.length;
console.log(`📊 Projected final count: ${projectedCount}\n`);

// Execute changes
const stats = {
  removed: 0,
  added: 0,
  errors: [],
  removedEntries: [],
  addedEntries: []
};

if (!DRY_RUN) {
  console.log('🗑️  Executing removals...');
  
  for (const entry of toRemove) {
    const wordPath = path.join(DICTIONARY_PATH, entry.letter, '01_Words', entry.word);
    
    try {
      if (deleteFolderRecursive(wordPath)) {
        stats.removed++;
        stats.removedEntries.push(entry.word);
        if (stats.removed % 100 === 0) {
          console.log(`   Removed ${stats.removed} words...`);
        }
      }
    } catch (err) {
      stats.errors.push(`Failed to remove ${entry.word}: ${err.message}`);
    }
  }
  
  console.log(`   ✓ Removed ${stats.removed} words\n`);
  
  console.log('📝 Adding missing motif words...');
  
  for (const motif of missingMotifs) {
    const letter = getLetterFromWord(motif.word);
    const wordDir = path.join(DICTIONARY_PATH, letter, '01_Words', motif.word);
    
    try {
      if (!fs.existsSync(wordDir)) {
        fs.mkdirSync(wordDir, { recursive: true });
      }
      
      const wordMdPath = path.join(wordDir, 'word.md');
      fs.writeFileSync(wordMdPath, createWordMd(motif.word, motif.definition));
      
      stats.added++;
      stats.addedEntries.push(motif.word);
      console.log(`   + Added: ${motif.word}`);
    } catch (err) {
      stats.errors.push(`Failed to add ${motif.word}: ${err.message}`);
    }
  }
  
  console.log(`   ✓ Added ${stats.added} words\n`);
  
  // Update manifest
  console.log('📋 Updating manifest...');
  
  // Remove entries from manifest
  for (const word of stats.removedEntries) {
    const letter = getLetterFromWord(word);
    if (manifest.letters[letter]) {
      manifest.letters[letter].words = manifest.letters[letter].words.filter(
        w => w.word !== word
      );
      manifest.letters[letter].count = manifest.letters[letter].words.length;
    }
  }
  
  // Add new entries to manifest
  for (const word of stats.addedEntries) {
    const letter = getLetterFromWord(word);
    if (!manifest.letters[letter]) {
      manifest.letters[letter] = { count: 0, words: [] };
    }
    manifest.letters[letter].words.push({
      word: word,
      path: `${letter}/01_Words/${word}/word.md`
    });
    manifest.letters[letter].count = manifest.letters[letter].words.length;
  }
  
  // Recalculate total
  let newTotal = 0;
  for (const letter of Object.keys(manifest.letters)) {
    newTotal += manifest.letters[letter].count;
  }
  manifest.totalWords = newTotal;
  
  // Save updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`   ✓ Manifest updated\n`);
}

// Summary
console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                              EXECUTION SUMMARY                                ║');
console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ BEFORE vs AFTER                                                               │');
console.log('├────────────────────────────────────────────────────────────────────────────────┤');
if (DRY_RUN) {
  console.log(`│ Original count:     ${originalCount}`.padEnd(79) + '│');
  console.log(`│ Would remove:       ${toRemove.length}`.padEnd(79) + '│');
  console.log(`│ Would add:          ${missingMotifs.length}`.padEnd(79) + '│');
  console.log(`│ Projected final:    ${projectedCount}`.padEnd(79) + '│');
} else {
  console.log(`│ Original count:     ${originalCount}`.padEnd(79) + '│');
  console.log(`│ Words removed:      ${stats.removed}`.padEnd(79) + '│');
  console.log(`│ Words added:        ${stats.added}`.padEnd(79) + '│');
  console.log(`│ Final count:        ${manifest.totalWords}`.padEnd(79) + '│');
}
console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');

if (stats.errors.length > 0) {
  console.log('⚠️  ERRORS:');
  for (const err of stats.errors) {
    console.log(`   - ${err}`);
  }
}

// Save execution log
const logPath = path.join(__dirname, 'phase2-curation-log.json');
fs.writeFileSync(logPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  dryRun: DRY_RUN,
  originalCount,
  toRemove: toRemove.map(w => ({ word: w.word, reason: w.reason })),
  toAdd: missingMotifs.map(m => m.word),
  stats: DRY_RUN ? { removed: 0, added: 0 } : stats
}, null, 2));

console.log(`📁 Execution log saved to: ${logPath}`);

if (DRY_RUN) {
  console.log('\n💡 Run without --dry-run to execute changes.');
}
