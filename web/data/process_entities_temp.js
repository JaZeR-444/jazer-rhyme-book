const fs = require('fs');
const path = require('path');

const entitiesFile = "C:\\2026 — JaZeR Mainframe\\1st Edition Webpages Completed\\JaZeR Rhyme Book\\web\\dist\\data\\00_INBOX\\entities.json";
const baseDir = "C:\\2026 — JaZeR Mainframe\\1st Edition Webpages Completed\\JaZeR Rhyme Book\\web\\dist\\data";

const data = JSON.parse(fs.readFileSync(entitiesFile, 'utf8'));

// Helper to slugify
const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

// Mapping logic
const getCategoryDir = (catName, itemName) => {
    // Manual overrides/logic based on analysis
    if (catName === "Cultural Figures & Icons") {
        if (["Mozart", "Prince", "Zeppelin (Led Zeppelin)", "Don McLean", "The Beatles"].some(n => itemName.includes(n))) return "music";
        if (["Gretzky", "Allen Iverson", "Michael Jordan"].some(n => itemName.includes(n))) return "sports"; 
        if (itemName.includes("James Bond")) return "cinema";
        return "people";
    }
    if (catName === "Fictional & Mythic Characters") {
        if (["Hercules", "Hades", "Jack (and the Beanstalk)", "Pandora", "The Wizard (of Oz)", "Peter Pan"].some(n => itemName.includes(n))) return "mythology-legend";
        if (["Lucy Diamond"].some(n => itemName.includes(n))) return "music";
        if (["Pac-Man"].some(n => itemName.includes(n))) return "internet-culture";
        if (["The Bees"].some(n => itemName.includes(n))) return "rituals-symbols";
        return "cinema"; // Default for characters
    }
    if (catName === "Geographic & Spatial Entities") return "places";
    if (catName === "Brands & Artifacts") {
        if (["Air Force Uno"].some(n => itemName.includes(n))) return "vehicles";
        if (["Starlink", "FL Studio", "Java"].some(n => itemName.includes(n))) return "tech";
        if (["Swisher House"].some(n => itemName.includes(n))) return "music";
        return "brands";
    }
    if (catName === "The \"Team\" (Internal/Crew)") return "people";
    
    return "people"; // Fallback
};

data.categories.forEach(cat => {
    cat.items.forEach(item => {
        const targetDirName = getCategoryDir(cat.category_name, item.name);
        const targetDir = path.join(baseDir, targetDirName, "entities");
        
        // Ensure dir exists (it should, but safety first)
        if (!fs.existsSync(targetDir)) {
            console.log(`Directory not found: ${targetDir}`);
            return;
        }

        const slug = slugify(item.name);
        const filePath = path.join(targetDir, `${slug}.json`);

        if (fs.existsSync(filePath)) {
            console.log(`Skipping existing: ${filePath}`);
            return;
        }

        // Construct Content
        const content = {
            id: slug,
            type: targetDirName,
            name: item.name,
            aliases: [],
            era: "Unknown",
            tags: [cat.category_name],
            one_liner: item.symbolism || item.meaning || item.significance || item.description || "",
            angles: [],
            bar_seeds: item.key_reference ? [item.key_reference] : (item.context ? [item.context] : []),
            known_for: [],
            vibe: "",
            signature_items: [],
            quotables_short: [],
            controversy_flags: [],
            related_ids: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sources: []
        };

        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        console.log(`Created: ${filePath}`);
    });
});
