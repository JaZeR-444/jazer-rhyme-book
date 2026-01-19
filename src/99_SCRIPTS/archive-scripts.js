#!/usr/bin/env node
/**
 * Archive Legacy Scripts
 * Moves one-time migration scripts to archive directory
 *
 * Usage: node archive-scripts.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const ARCHIVE_DIR = path.join(ROOT_DIR, 'archive', 'migration_scripts');
const SCRIPTS_DIR = path.join(ROOT_DIR, 'src', '99_SCRIPTS');
const WEB_SCRIPTS_DIR = path.join(ROOT_DIR, 'web', 'scripts');

// Scripts to archive (one-time migration scripts)
const SCRIPTS_TO_ARCHIVE = [
  // Python migration scripts
  'add_50_a_words.py',
  'add_zxywv_words.py',
  'add_z_words_2.py',
  'add_x_words_2.py',
  'add_y_words_2.py',
  'add_w_words_2.py',
  'add_v_words_2.py',
  'cleanup_migration.py',
  'scaffold_new_domains.py',
  'create_rap_hub.py',
  'auto_expand_dictionary.py',
  'generate_tree.py',
  // JavaScript migration scripts
  'fix_data.js',
  'fix_data_v2.js',
  'fix_data_final.js',
  'fix_schemas.js',
  'remove_words.js',
  'remove_definite_words.js',
  'verify_removal.js',
  'restore_from_dist.js',
  'copy_audio.js',
  // BAT files
  'copy_files.bat',
  'remove_words.bat',
  'cleanup_root.bat',
  'restore_names.bat'
];

// Web cleanup scripts to archive (letter-specific)
const WEB_CLEANUP_SCRIPTS = [
  'cleanup_A.js',
  'cleanup_A_v2.js',
  'cleanup_B.js',
  'cleanup_C.js',
  'cleanup_D.js',
  'cleanup_E.js',
  'cleanup_F.js',
  'cleanup_G.js',
  'cleanup_H.js',
  'cleanup_I.js',
  'cleanup_J.js',
  'cleanup_K.js',
  'cleanup_L.js',
  'cleanup_M.js',
  'cleanup_N.js',
  'cleanup_O.js',
  'cleanup_P.js',
  'cleanup_Q.js',
  'cleanup_R.js',
  'cleanup_S.js',
  'cleanup_T.js',
  'cleanup_U.js',
  'cleanup_V.js',
  'cleanup_W.js',
  'cleanup_X.js',
  'cleanup_Y.js',
  'cleanup_Z.js'
];

// Scripts to KEEP (still useful)
const KEEP_SCRIPTS = [
  // Core build scripts
  'sync-data.js',
  'prepare-web-data.js',
  'build-graph-data.js',
  'build-indexes.js',
  'validate.js',
  'test-parser.js',
  // New unified scripts
  'prepare-hub.js',
  // Web scripts
  'buildData.js',
  'generate-metadata.js',
  'rebuild-manifest.js',
  'regenerate-index.js',
  'generate_dictionary_schema.js',
  'generate_schema.js',
  'execute_cleanup.js',
  'execute-phase2-curation.js',
  'execute-phase3-vibe-curation.js',
  'create_jazer_words.js',
  'audit_dictionary_cleanup.js',
  'temp_curate_a_words.js',
  'scan-tracks.js',
  'test-rhyme.js',
  'cleanup_master_words_index.js',
  'cleanup_tmp_files.js',
  'cleanup_all.js',
  'eslint.config.js',
  'vite.config.js'
];

function archiveScripts(dryRun = true) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  📦 Archive Legacy Scripts');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  const allToArchive = [...SCRIPTS_TO_ARCHIVE, ...WEB_CLEANUP_SCRIPTS];
  let archived = 0;
  let skipped = 0;
  let notFound = 0;

  // Create archive directory
  if (!dryRun) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  // Archive root scripts
  console.log('Processing root scripts...');
  for (const script of SCRIPTS_TO_ARCHIVE) {
    const srcPath = path.join(SCRIPTS_DIR, script);
    if (!fs.existsSync(srcPath)) {
      console.log(`  ⏭ ${script} - not found`);
      notFound++;
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would archive: ${script}`);
      archived++;
    } else {
      const destPath = path.join(ARCHIVE_DIR, script);
      fs.copyFileSync(srcPath, destPath);
      fs.unlinkSync(srcPath);
      console.log(`  ✅ Archived: ${script}`);
      archived++;
    }
  }

  // Archive web scripts
  console.log('\nProcessing web scripts...');
  const webArchiveDir = path.join(ARCHIVE_DIR, 'web_cleanup_scripts');
  if (!dryRun) {
    fs.mkdirSync(webArchiveDir, { recursive: true });
  }

  for (const script of WEB_CLEANUP_SCRIPTS) {
    const srcPath = path.join(WEB_SCRIPTS_DIR, script);
    if (!fs.existsSync(srcPath)) {
      console.log(`  ⏭ ${script} - not found`);
      notFound++;
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would archive: ${script}`);
      archived++;
    } else {
      const destPath = path.join(webArchiveDir, script);
      fs.copyFileSync(srcPath, destPath);
      fs.unlinkSync(srcPath);
      console.log(`  ✅ Archived: ${script}`);
      archived++;
    }
  }

  // Create archive manifest
  if (!dryRun) {
    const manifest = {
      archivedAt: new Date().toISOString(),
      rootScripts: SCRIPTS_TO_ARCHIVE.length,
      webScripts: WEB_CLEANUP_SCRIPTS.length,
      totalArchived: archived,
      note: 'These are one-time migration scripts. See src/99_SCRIPTS/prepare-hub.js for current build process.'
    };
    fs.writeFileSync(path.join(ARCHIVE_DIR, 'ARCHIVE_MANIFEST.json'), JSON.stringify(manifest, null, 2));
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ${dryRun ? '[DRY RUN] ' : ''}Archive Complete`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Archived: ${archived}`);
  console.log(`  Not found: ${notFound}`);
  console.log('');
  if (!dryRun) {
    console.log(`  Archive location: ${ARCHIVE_DIR}`);
    console.log('');
    console.log('  To restore scripts, copy from archive back to original locations.');
  }
}

// Check for --dry-run flag
const dryRun = process.argv.includes('--dry-run');
archiveScripts(dryRun);
