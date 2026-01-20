# Project Structure Guide

## 📁 Root Directory Organization

### ✅ Core Application Files
- **README.md** - Main project overview and documentation
- **CHANGELOG.md** - Version history and change log
- **package.json** - Node.js dependencies
- **package-lock.json** - Locked dependency versions
- **index.html** - GitHub Pages redirect/landing page
- **word_bank.json** - Primary dictionary database
- **word_bank_backup.json** - Dictionary backup

### 📂 Main Folders

#### **docs/** - Project Documentation (Comprehensive)
Organized documentation for every aspect of the project.

**Subfolders:**
- **about/** - Project background (ABOUT_JAZER.md)
- **guides/** - Implementation guides and recommendations
- **ai-integration/** - AI tool integration documentation

**Key Files:**
- TO-DO.md - Master project tracking
- VALIDATION_REPORT.md - Latest completion audit (85%)
- FEATURE_COMPLETION_STATUS.md - Feature status by phase
- IMPLEMENTATION_GUIDE.md - Implementation instructions
- COMPREHENSIVE_IMPROVEMENT_PLAN.md - 7-phase roadmap

#### **assets/** - Media & Visual Assets
Logo and icon files for the project.
- JaZeR Rhyme Book Logo (450 x 150 px).svg
- JaZeR Master Hub Icon (100 x 100 px).svg

#### **web/** - React Web Application
Main frontend application source code.
- src/ - React components and pages
- public/ - Static assets including PWA files
- vite.config.js - Build configuration

#### **src/** - CLI & Data Processing
Command-line tools and data processing scripts.
- cli/ - CLI commands
- scripts/ - Build and utility scripts
- scripts_legacy/ - Archived old scripts

#### **scripts/** - Utility Scripts
Maintenance and utility scripts.
- cleanup_root.bat
- finish_migration.bat / finish_migration.ps1
- restore_names.bat

#### **archive/** - Archived Content
Legacy and archived files.

#### **knowledge_base/** - Reference Materials
Project reference and knowledge base files.

#### **system/** - System Configuration
System-level configuration files.

### 🔧 GitHub Configuration
- **.github/workflows/** - CI/CD automation
- **.github/icon.svg** - GitHub profile icon
- **.github/logo.svg** - Project logo
- **.gitignore** - Git ignore rules

### 📦 Node Modules
- **node_modules/** - Installed npm dependencies

---

## 🗂️ Complete Directory Tree

```
JaZeR Rhyme Book/
│
├── 📄 Documentation & Config (Root)
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── PROJECT_STRUCTURE.md
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── word_bank.json
│   └── word_bank_backup.json
│
├── 📚 docs/
│   ├── README.md (navigation guide)
│   ├── TO-DO.md
│   ├── VALIDATION_REPORT.md
│   ├── FEATURE_COMPLETION_STATUS.md
│   ├── COMPLETION_SUMMARY.md
│   ├── SESSION_COMPLETION_SUMMARY.md
│   ├── IMPLEMENTATION_GUIDE.md
│   ├── COMPREHENSIVE_IMPROVEMENT_PLAN.md
│   ├── PHASE_1_COMPLETION.md
│   ├── QUICK_START_PHASE_1.md
│   ├── UI-UX-TODO.md
│   ├── Clean_Directory_To-Do_List.md
│   ├── about/
│   │   └── ABOUT_JAZER.md
│   ├── guides/
│   │   ├── QUICK_START_GUIDE.md
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   └── SITE_ENHANCEMENT_RECOMMENDATIONS.md
│   └── ai-integration/
│       ├── CLAUDE.md
│       ├── CLAUDE CLI - MASTER BUILD PROMPT.md
│       ├── AGENTS.md
│       ├── GEMINI.md
│       └── QWEN.md
│
├── 🎨 assets/
│   ├── JaZeR Rhyme Book Logo (450 x 150 px).svg
│   └── JaZeR Master Hub Icon (100 x 100 px).svg
│
├── 💻 web/
│   ├── src/ (React application)
│   │   ├── components/ (58+ React components)
│   │   ├── pages/ (Home, Dictionary, Search, Stats, etc.)
│   │   ├── lib/ (Utility libraries)
│   │   ├── hooks/ (Custom hooks)
│   │   └── styles/ (Global & accessibility styles)
│   ├── public/ (PWA manifest, service worker)
│   ├── vite.config.js
│   └── package.json
│
├── 🔧 src/
│   ├── cli/
│   │   └── jazer-cli.js
│   ├── scripts/
│   │   ├── build/
│   │   ├── data/
│   │   ├── utils/
│   │   └── maintenance/
│   └── scripts_legacy/ (archived)
│
├── 🛠️ scripts/
│   ├── cleanup_root.bat
│   ├── finish_migration.bat
│   ├── finish_migration.ps1
│   └── restore_names.bat
│
├── 📋 archive/
├── 📖 knowledge_base/
├── ⚙️ system/
│
├── 🔗 .github/
│   ├── workflows/
│   ├── icon.svg
│   └── logo.svg
│
├── 📦 node_modules/
└── .gitignore
```

---

## 🎯 Quick File Access

### Getting Started
- docs/guides/QUICK_START_GUIDE.md
- docs/about/ABOUT_JAZER.md
- README.md

### Project Status
- docs/VALIDATION_REPORT.md
- docs/FEATURE_COMPLETION_STATUS.md
- docs/TO-DO.md

### Implementation
- docs/IMPLEMENTATION_GUIDE.md
- docs/COMPREHENSIVE_IMPROVEMENT_PLAN.md
- web/src/components/

### Development
- web/src/
- src/cli/
- scripts/

---

## 📊 Project Statistics

- **Completion**: 85%
- **Components**: 58+
- **Lines of Code**: 15,000+
- **Files Organized**: 15 documentation files
- **Assets**: 2 high-quality SVG files
- **Phases Completed**: 5.5 out of 7

---

## ✅ Organization Summary

| Category | Location | Count |
|----------|----------|-------|
| Core Docs | docs/ | 15 files |
| Topic-Specific | docs/*/ | 9 files |
| Assets | assets/ | 2 images |
| Web Components | web/src/ | 58+ files |
| Scripts | src/ + scripts/ | 30+ files |
| GitHub Config | .github/ | workflows + assets |

---

## 🔄 File Organization Benefits

✅ **Cleaner Root** - Only essential files remain
✅ **Better Navigation** - Docs organized by topic
✅ **Asset Management** - All media in one location
✅ **Easy Scaling** - Room for growth
✅ **Professional Structure** - Industry-standard layout
✅ **CI/CD Ready** - GitHub workflows organized

---

**Last Updated**: January 20, 2026
**Structure Version**: 2.0
