/**
 * Dictionary Cleanup Audit Script
 * Audits all target entries for MOVE and REMOVE operations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DICTIONARY_PATH = path.join(__dirname, 'public', 'dictionary');
const MANIFEST_PATH = path.join(DICTIONARY_PATH, 'MASTER-DICTIONARY-MANIFEST.json');

// TARGETS - A) MOVE to PHRASES (hyphenated entries)
const MOVE_TARGETS = [
  'anthem-like',
  'dialed-in',
  'win-win',
  'yes-man',
  'yin-yang',
  'yo-yo',
  'your-highness',
  'zenith-point',
  'zero-sum',
];

// TARGETS - B) REMOVE (very short utility words)
const REMOVE_UTILITY = [
  'ah', 'am', 'ax', 'go', 'if', 'in', 'no', 'of', 'on', 'or', 'ox', 'up', 'we', 'yi', 'yo',
];

// TARGETS - C) REMOVE (inflection duplicates; keep base lemma)
const REMOVE_INFLECTION_C = [
  { word: 'abandoned', base: 'abandon' },
  { word: 'achieves', base: 'achieve' },
  { word: 'achieving', base: 'achieve' },
  { word: 'activists', base: 'activist' },
  { word: 'added', base: 'add' },
  { word: 'allegedly', base: 'alleged' },
  { word: 'balances', base: 'balance' },
  { word: 'bathing', base: 'bath' },
  { word: 'blandly', base: 'bland' },
  { word: 'blitzes', base: 'blitz' },
  { word: 'bonuses', base: 'bonus' },
  { word: 'brushes', base: 'brush' },
  { word: 'cakes', base: 'cake' },
  { word: 'canceled', base: 'cancel' },
  { word: 'calling', base: 'call' },
  { word: 'clearly', base: 'clear' },
  { word: 'dances', base: 'dance' },
  { word: 'damned', base: 'damn' },
  { word: 'deeply', base: 'deep' },
  { word: 'deleting', base: 'delete' },
  { word: 'directly', base: 'direct' },
  { word: 'gases', base: 'gas' },
  { word: 'tangs', base: 'tang' },
  { word: 'uncovered', base: 'uncover' },
  { word: 'undergoing', base: 'undergo' },
  { word: 'unusually', base: 'unusual' },
  { word: 'valleys', base: 'valley' },
  { word: 'valued', base: 'value' },
  { word: 'values', base: 'value' },
  { word: 'vibrating', base: 'vibrate' },
  { word: 'vertically', base: 'vertical' },
  { word: 'viewed', base: 'view' },
];

// D1) Adverb-to-adjective / derived-form duplicates
const REMOVE_D1_ADVERBS = [
  { word: 'currently', base: 'current' },
  { word: 'entirely', base: 'entire' },
  { word: 'evenly', base: 'even' },
  { word: 'explicitly', base: 'explicit' },
  { word: 'fairly', base: 'fair' },
  { word: 'firmly', base: 'firm' },
  { word: 'freshly', base: 'fresh' },
  { word: 'genuinely', base: 'genuine' },
  { word: 'ghostly', base: 'ghost' },
  { word: 'gladly', base: 'glad' },
  { word: 'globally', base: 'global' },
  { word: 'greatly', base: 'great' },
  { word: 'hardly', base: 'hard' },
  { word: 'highly', base: 'high' },
  { word: 'hopefully', base: 'hopeful' },
  { word: 'ideally', base: 'ideal' },
  { word: 'indirectly', base: 'indirect' },
  { word: 'inherently', base: 'inherent' },
  { word: 'jadedly', base: 'jaded' },
  { word: 'kindly', base: 'kind' },
  { word: 'largely', base: 'large' },
  { word: 'lightly', base: 'light' },
  { word: 'literally', base: 'literal' },
  { word: 'locally', base: 'local' },
  { word: 'loosely', base: 'loose' },
  { word: 'loudly', base: 'loud' },
  { word: 'lowly', base: 'low' },
  { word: 'mainly', base: 'main' },
  { word: 'massively', base: 'massive' },
  { word: 'mentally', base: 'mental' },
  { word: 'merely', base: 'mere' },
  { word: 'mostly', base: 'most' },
  { word: 'narrowly', base: 'narrow' },
  { word: 'nearly', base: 'near' },
  { word: 'neatly', base: 'neat' },
  { word: 'notably', base: 'notable' },
  { word: 'oddly', base: 'odd' },
  { word: 'openly', base: 'open' },
  { word: 'partially', base: 'partial' },
  { word: 'perfectly', base: 'perfect' },
  { word: 'physically', base: 'physical' },
  { word: 'plainly', base: 'plain' },
  { word: 'politely', base: 'polite' },
  { word: 'purely', base: 'pure' },
  { word: 'quickly', base: 'quick' },
  { word: 'quietly', base: 'quiet' },
  { word: 'rarely', base: 'rare' },
  { word: 'really', base: 'real' },
  { word: 'recently', base: 'recent' },
  { word: 'repeatedly', base: 'repeated' },
  { word: 'roughly', base: 'rough' },
  { word: 'ruggedly', base: 'rugged' },
  { word: 'securely', base: 'secure' },
  { word: 'sharply', base: 'sharp' },
  { word: 'shortly', base: 'short' },
  { word: 'simply', base: 'simple' },
  { word: 'slowly', base: 'slow' },
  { word: 'softly', base: 'soft' },
  { word: 'solely', base: 'sole' },
  { word: 'strongly', base: 'strong' },
  { word: 'suddenly', base: 'sudden' },
  { word: 'tightly', base: 'tight' },
  { word: 'truly', base: 'true' },
  { word: 'utterly', base: 'utter' },
];

// D2) -ing form duplicates (keep base verb)
const REMOVE_D2_ING = [
  { word: 'abandoning', base: 'abandon' },
  { word: 'absorbing', base: 'absorb' },
  { word: 'accepting', base: 'accept' },
  { word: 'accessing', base: 'access' },
  { word: 'accusing', base: 'accuse' },
  { word: 'acquiring', base: 'acquire' },
  { word: 'acting', base: 'act' },
  { word: 'adapting', base: 'adapt' },
  { word: 'adding', base: 'add' },
  { word: 'aiming', base: 'aim' },
  { word: 'allowing', base: 'allow' },
  { word: 'alarming', base: 'alarm' },
  { word: 'aligning', base: 'align' },
  { word: 'analyzing', base: 'analyze' },
  { word: 'anchoring', base: 'anchor' },
  { word: 'announcing', base: 'announce' },
  { word: 'answering', base: 'answer' },
  { word: 'apologizing', base: 'apologize' },
  { word: 'appearing', base: 'appear' },
  { word: 'applying', base: 'apply' },
  { word: 'arranging', base: 'arrange' },
  { word: 'arriving', base: 'arrive' },
  { word: 'asking', base: 'ask' },
  { word: 'assessing', base: 'assess' },
  { word: 'assisting', base: 'assist' },
  { word: 'assuming', base: 'assume' },
  { word: 'attacking', base: 'attack' },
  { word: 'attempting', base: 'attempt' },
  { word: 'attending', base: 'attend' },
  { word: 'attracting', base: 'attract' },
  { word: 'auditing', base: 'audit' },
  { word: 'avoiding', base: 'avoid' },
  { word: 'awakening', base: 'awaken' },
  { word: 'balancing', base: 'balance' },
  { word: 'banking', base: 'bank' },
  { word: 'beating', base: 'beat' },
  { word: 'becoming', base: 'become' },
  { word: 'beginning', base: 'begin' },
  { word: 'believing', base: 'believe' },
  { word: 'belonging', base: 'belong' },
  { word: 'bending', base: 'bend' },
  { word: 'blocking', base: 'block' },
  { word: 'blowing', base: 'blow' },
  { word: 'breaking', base: 'break' },
  { word: 'bringing', base: 'bring' },
  { word: 'building', base: 'build' },
  { word: 'burning', base: 'burn' },
  { word: 'buying', base: 'buy' },
  { word: 'calling', base: 'call' },
  { word: 'calming', base: 'calm' },
  { word: 'camping', base: 'camp' },
  { word: 'caring', base: 'care' },
  { word: 'carrying', base: 'carry' },
  { word: 'casting', base: 'cast' },
  { word: 'catching', base: 'catch' },
  { word: 'causing', base: 'cause' },
  { word: 'challenging', base: 'challenge' },
  { word: 'changing', base: 'change' },
  { word: 'charging', base: 'charge' },
  { word: 'chasing', base: 'chase' },
  { word: 'checking', base: 'check' },
  { word: 'choosing', base: 'choose' },
  { word: 'cleaning', base: 'clean' },
  { word: 'clearing', base: 'clear' },
  { word: 'climbing', base: 'climb' },
  { word: 'closing', base: 'close' },
  { word: 'coaching', base: 'coach' },
  { word: 'collecting', base: 'collect' },
  { word: 'combining', base: 'combine' },
  { word: 'coming', base: 'come' },
  { word: 'comparing', base: 'compare' },
  { word: 'competing', base: 'compete' },
  { word: 'completing', base: 'complete' },
  { word: 'confirming', base: 'confirm' },
  { word: 'connecting', base: 'connect' },
  { word: 'considering', base: 'consider' },
  { word: 'continuing', base: 'continue' },
];

// D3) -ed form duplicates (keep base verb)
const REMOVE_D3_ED = [
  { word: 'agreed', base: 'agree' },
  { word: 'aimed', base: 'aim' },
  { word: 'aligned', base: 'align' },
  { word: 'allowed', base: 'allow' },
  { word: 'appeared', base: 'appear' },
  { word: 'applied', base: 'apply' },
  { word: 'arranged', base: 'arrange' },
  { word: 'arrived', base: 'arrive' },
  { word: 'asked', base: 'ask' },
  { word: 'assumed', base: 'assume' },
  { word: 'attacked', base: 'attack' },
  { word: 'attempted', base: 'attempt' },
  { word: 'avoided', base: 'avoid' },
  { word: 'balanced', base: 'balance' },
  { word: 'believed', base: 'believe' },
  { word: 'belonged', base: 'belong' },
  { word: 'blocked', base: 'block' },
  { word: 'blamed', base: 'blame' },
  { word: 'booked', base: 'book' },
  { word: 'boosted', base: 'boost' },
  { word: 'borrowed', base: 'borrow' },
  { word: 'bounded', base: 'bound' },
  { word: 'breached', base: 'breach' },
  { word: 'broadened', base: 'broaden' },
  { word: 'burned', base: 'burn' },
  { word: 'calmed', base: 'calm' },
  { word: 'carried', base: 'carry' },
  { word: 'caused', base: 'cause' },
  { word: 'challenged', base: 'challenge' },
  { word: 'changed', base: 'change' },
  { word: 'charged', base: 'charge' },
  { word: 'checked', base: 'check' },
  { word: 'cleaned', base: 'clean' },
  { word: 'cleared', base: 'clear' },
  { word: 'closed', base: 'close' },
  { word: 'coached', base: 'coach' },
  { word: 'collected', base: 'collect' },
  { word: 'combined', base: 'combine' },
  { word: 'compared', base: 'compare' },
  { word: 'completed', base: 'complete' },
  { word: 'confirmed', base: 'confirm' },
  { word: 'connected', base: 'connect' },
  { word: 'considered', base: 'consider' },
  { word: 'continued', base: 'continue' },
  { word: 'copied', base: 'copy' },
];

// D4) Plural -ies duplicates (keep singular noun)
const REMOVE_D4_IES = [
  { word: 'academies', base: 'academy' },
  { word: 'apologies', base: 'apology' },
  { word: 'babies', base: 'baby' },
  { word: 'batteries', base: 'battery' },
  { word: 'charities', base: 'charity' },
  { word: 'companies', base: 'company' },
  { word: 'countries', base: 'country' },
  { word: 'dynasties', base: 'dynasty' },
  { word: 'enemies', base: 'enemy' },
  { word: 'families', base: 'family' },
  { word: 'fantasies', base: 'fantasy' },
  { word: 'glories', base: 'glory' },
  { word: 'harmonies', base: 'harmony' },
  { word: 'industries', base: 'industry' },
  { word: 'injuries', base: 'injury' },
  { word: 'journeys', base: 'journey' },
  { word: 'melodies', base: 'melody' },
  { word: 'memories', base: 'memory' },
  { word: 'mysteries', base: 'mystery' },
  { word: 'parties', base: 'party' },
];

// D5) Simple -es duplicates (keep base)
const REMOVE_D5_ES = [
  { word: 'announces', base: 'announce' },
  { word: 'approaches', base: 'approach' },
  { word: 'balances', base: 'balance' },
  { word: 'benches', base: 'bench' },
  { word: 'boxes', base: 'box' },
  { word: 'brushes', base: 'brush' },
  { word: 'closes', base: 'close' },
  { word: 'coaches', base: 'coach' },
  { word: 'confuses', base: 'confuse' },
  { word: 'crosses', base: 'cross' },
];

// D6) -ves plural duplicates (keep singular)
const REMOVE_D6_VES = [
  { word: 'calves', base: 'calf' },
  { word: 'elves', base: 'elf' },
  { word: 'halves', base: 'half' },
  { word: 'knives', base: 'knife' },
  { word: 'leaves', base: 'leaf' },
  { word: 'wolves', base: 'wolf' },
];

// D7) Simple -s plural duplicates (keep singular noun)
const REMOVE_D7_S = [
  { word: 'adults', base: 'adult' },
  { word: 'advisors', base: 'advisor' },
  { word: 'amateurs', base: 'amateur' },
  { word: 'anchors', base: 'anchor' },
  { word: 'appeals', base: 'appeal' },
];

function getLetterFromWord(word) {
  return word[0].toUpperCase();
}

function checkEntryExists(word) {
  const letter = getLetterFromWord(word);
  const wordPath = path.join(DICTIONARY_PATH, letter, '01_Words', word);
  const wordMdPath = path.join(wordPath, 'word.md');
  
  const folderExists = fs.existsSync(wordPath);
  const mdExists = fs.existsSync(wordMdPath);
  
  return {
    folderExists,
    mdExists,
    path: folderExists ? `${letter}/01_Words/${word}/word.md` : null
  };
}

function auditTargets() {
  const results = {
    move: [],
    remove: [],
    summary: {
      totalMoveTargets: 0,
      moveFound: 0,
      moveMissing: 0,
      totalRemoveTargets: 0,
      removeFound: 0,
      removeMissing: 0,
    }
  };
  
  // Audit MOVE targets
  console.log('=== AUDITING MOVE TARGETS (Hyphenated Entries) ===\n');
  for (const word of MOVE_TARGETS) {
    const status = checkEntryExists(word);
    const entry = {
      target: word,
      action: 'MOVE',
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: ''
    };
    
    if (status.folderExists && !status.mdExists) {
      entry.notes = 'Folder exists but word.md missing';
    }
    
    results.move.push(entry);
    results.summary.totalMoveTargets++;
    if (status.folderExists) {
      results.summary.moveFound++;
    } else {
      results.summary.moveMissing++;
    }
  }
  
  // Audit all REMOVE targets
  console.log('=== AUDITING REMOVE TARGETS ===\n');
  
  // B) Utility words
  for (const word of REMOVE_UTILITY) {
    const status = checkEntryExists(word);
    results.remove.push({
      target: word,
      action: 'REMOVE',
      category: 'B-utility',
      base: null,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // C) Inflection duplicates
  for (const item of REMOVE_INFLECTION_C) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'C-inflection',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base lemma "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // D1) Adverbs
  for (const item of REMOVE_D1_ADVERBS) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'D1-adverb',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // D2) -ing forms
  for (const item of REMOVE_D2_ING) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'D2-ing',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // D3) -ed forms
  for (const item of REMOVE_D3_ED) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'D3-ed',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // D4) -ies plurals
  for (const item of REMOVE_D4_IES) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'D4-ies',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // D5) -es plurals
  for (const item of REMOVE_D5_ES) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'D5-es',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // D6) -ves plurals
  for (const item of REMOVE_D6_VES) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'D6-ves',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  // D7) -s plurals
  for (const item of REMOVE_D7_S) {
    const status = checkEntryExists(item.word);
    const baseStatus = checkEntryExists(item.base);
    results.remove.push({
      target: item.word,
      action: 'REMOVE',
      category: 'D7-s',
      base: item.base,
      baseExists: baseStatus.folderExists,
      currentPath: status.path || 'N/A',
      status: status.folderExists ? 'found' : 'missing',
      notes: !baseStatus.folderExists ? `WARNING: base "${item.base}" not found!` : ''
    });
    results.summary.totalRemoveTargets++;
    if (status.folderExists) results.summary.removeFound++;
    else results.summary.removeMissing++;
  }
  
  return results;
}

function printAuditReport(results) {
  console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                        DICTIONARY CLEANUP AUDIT REPORT                        ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');
  
  // MOVE targets table
  console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ A) MOVE TO PHRASES (Hyphenated Entries)                                       │');
  console.log('├──────────────────┬────────┬───────────────────────────────────┬───────────────┤');
  console.log('│ Target           │ Action │ Current Path                      │ Status        │');
  console.log('├──────────────────┼────────┼───────────────────────────────────┼───────────────┤');
  
  for (const entry of results.move) {
    const target = entry.target.padEnd(16);
    const action = entry.action.padEnd(6);
    const path = (entry.currentPath || 'N/A').substring(0, 33).padEnd(33);
    const status = entry.status.padEnd(13);
    console.log(`│ ${target} │ ${action} │ ${path} │ ${status} │`);
  }
  console.log('└──────────────────┴────────┴───────────────────────────────────┴───────────────┘\n');
  
  // REMOVE targets by category
  console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ B-D) REMOVE TARGETS                                                           │');
  console.log('├──────────────────┬────────────┬──────────────┬─────────┬───────────────────────┤');
  console.log('│ Target           │ Category   │ Base Lemma   │ Status  │ Notes                 │');
  console.log('├──────────────────┼────────────┼──────────────┼─────────┼───────────────────────┤');
  
  for (const entry of results.remove) {
    const target = entry.target.substring(0, 16).padEnd(16);
    const cat = (entry.category || '').padEnd(10);
    const base = (entry.base || '-').substring(0, 12).padEnd(12);
    const status = entry.status.padEnd(7);
    const notes = (entry.notes || '').substring(0, 21).padEnd(21);
    console.log(`│ ${target} │ ${cat} │ ${base} │ ${status} │ ${notes} │`);
  }
  console.log('└──────────────────┴────────────┴──────────────┴─────────┴───────────────────────┘\n');
  
  // Summary
  console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SUMMARY                                                                       │');
  console.log('├────────────────────────────────────────────────────────────────────────────────┤');
  console.log(`│ MOVE Targets:   ${results.summary.totalMoveTargets} total, ${results.summary.moveFound} found, ${results.summary.moveMissing} missing`.padEnd(79) + '│');
  console.log(`│ REMOVE Targets: ${results.summary.totalRemoveTargets} total, ${results.summary.removeFound} found, ${results.summary.removeMissing} missing`.padEnd(79) + '│');
  console.log('└────────────────────────────────────────────────────────────────────────────────┘\n');
  
  // Warnings
  const warnings = results.remove.filter(e => e.notes && e.notes.startsWith('WARNING'));
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (base lemmas not found):');
    for (const w of warnings) {
      console.log(`   - ${w.target} -> ${w.base}`);
    }
  }
}

// Run the audit
const results = auditTargets();
printAuditReport(results);

// Save results to JSON for later use
const outputPath = path.join(__dirname, 'audit_results.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`\n📁 Full audit results saved to: ${outputPath}`);
