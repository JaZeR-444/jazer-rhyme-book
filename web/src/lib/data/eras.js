/**
 * Era Data Configuration
 * ======================
 * 
 * Defines the musical eras for the timeline section.
 * Each era represents a distinct creative phase with:
 * - Identity: name, years, sonic signature
 * - Visual: color scheme, representative imagery
 * - Content: key projects, influences, tools
 */

export const eras = [
  {
    id: 'genesis',
    name: 'Genesis',
    yearStart: 2018,
    yearEnd: 2020,
    sonicSignature: 'Raw Energy',
    description: 'The beginning. Learning the craft, finding the sound, building foundations.',
    color: 'hsl(200, 80%, 50%)',
    projects: [
      { id: 'project-001', title: 'First Steps', type: 'EP' },
      { id: 'project-002', title: 'Early Experiments', type: 'Singles' },
    ],
    tools: ['FL Studio', 'Serum', 'Massive'],
    influences: ['Electronic Pioneers', 'Bass Music'],
  },
  {
    id: 'evolution',
    name: 'Evolution',
    yearStart: 2021,
    yearEnd: 2023,
    sonicSignature: 'Refined Chaos',
    description: 'Growth phase. Developing signature techniques, expanding sonic palette.',
    color: 'hsl(160, 70%, 45%)',
    projects: [
      { id: 'project-003', title: 'Breakthrough', type: 'Album' },
      { id: 'project-004', title: 'Collaborations', type: 'Features' },
    ],
    tools: ['FL Studio', 'Serum', 'Vital', 'Phaseplant'],
    influences: ['Sound Design Masters', 'Genre Blenders'],
  },
  {
    id: 'current',
    name: 'Ascension',
    yearStart: 2024,
    yearEnd: null, // Ongoing
    sonicSignature: 'System Mastery',
    description: 'Current era. Full creative control, distinctive voice, expanding horizons.',
    color: 'hsl(280, 70%, 55%)',
    projects: [
      { id: 'project-005', title: 'Master Flow', type: 'Album' },
      { id: 'project-006', title: 'Live Experience', type: 'Performance' },
    ],
    tools: ['FL Studio', 'Custom Workflows', 'AI-Assisted Tools'],
    influences: ['System Thinking', 'Live Performance'],
  },
];

/**
 * Get era by ID
 */
export function getEraById(id) {
  return eras.find(era => era.id === id);
}

/**
 * Get current era (ongoing)
 */
export function getCurrentEra() {
  return eras.find(era => era.yearEnd === null);
}
