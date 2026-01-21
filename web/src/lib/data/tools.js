/**
 * Tools & Workflow Data
 * =====================
 * 
 * Defines the creative infrastructure: DAWs, plugins, hardware.
 * Organized by category for the Tools Deck section.
 */

export const toolCategories = [
  {
    id: 'daws',
    name: 'DAW',
    description: 'Digital Audio Workstations',
    tools: [
      {
        id: 'fl-studio',
        name: 'FL Studio',
        role: 'Primary DAW',
        since: 2018,
        description: 'The creative command center. Where all the magic happens.',
        proficiency: 'Master',
        icon: 'daw',
        links: [],
      },
    ],
  },
  {
    id: 'synths',
    name: 'Synthesizers',
    description: 'Virtual Instruments',
    tools: [
      {
        id: 'serum',
        name: 'Serum',
        role: 'Lead Synth',
        since: 2018,
        description: 'Wavetable beast for aggressive leads and pads.',
        proficiency: 'Expert',
        icon: 'synth',
        links: [],
      },
      {
        id: 'vital',
        name: 'Vital',
        role: 'Texture Synth',
        since: 2021,
        description: 'Modern spectral synthesis for evolving textures.',
        proficiency: 'Expert',
        icon: 'synth',
        links: [],
      },
      {
        id: 'phaseplant',
        name: 'Phaseplant',
        role: 'Sound Design',
        since: 2022,
        description: 'Modular environment for complex sound design.',
        proficiency: 'Advanced',
        icon: 'synth',
        links: [],
      },
    ],
  },
  {
    id: 'effects',
    name: 'Effects',
    description: 'Processing & Mixing',
    tools: [
      {
        id: 'fabfilter-pro-q',
        name: 'FabFilter Pro-Q 3',
        role: 'EQ',
        since: null,
        description: 'Surgical precision EQ for mixing.',
        proficiency: null,
        icon: 'effect',
        links: [],
      },
      {
        id: 'ozone',
        name: 'iZotope Ozone',
        role: 'Mastering',
        since: null,
        description: 'AI-assisted mastering suite.',
        proficiency: null,
        icon: 'effect',
        links: [],
      },
    ],
  },
  {
    id: 'hardware',
    name: 'Hardware',
    description: 'Physical Controllers',
    tools: [
      {
        id: 'mpk-mini',
        name: 'AKAI MPK Mini MK3',
        role: 'MIDI Controller',
        since: null,
        description: 'Portable performance controller for hands-on control.',
        proficiency: null,
        icon: 'hardware',
        links: [],
      },
    ],
  },
];

/**
 * Flatten all tools into a single array
 */
export function getAllTools() {
  return toolCategories.flatMap(cat => 
    cat.tools.map(tool => ({ ...tool, category: cat.id }))
  );
}

/**
 * Get tool by ID
 */
export function getToolById(id) {
  return getAllTools().find(tool => tool.id === id);
}
