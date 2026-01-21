/**
 * Philosophy Content
 * ==================
 * 
 * Artistic values and creative principles for the Philosophy section.
 * Structured as chapters for progressive disclosure.
 */

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

export const philosophy = {
  title: 'Creative Philosophy',
  tagline: 'The principles behind the sound.',
  
  chapters: [
    {
      id: 'intention',
      order: 1,
      title: 'Intention Over Accident',
      tags: ['process', 'intention'],
      content: normalizeText(`Every sound exists for a reason. Nothing is random. The goal isn't 
        to stumble upon something good—it's to know exactly why something works 
        and to replicate that understanding across everything you create.`),
      pullQuote: normalizeText(`The goal isn't to stumble upon something good—it's to know why.`),
    },
    {
      id: 'systems',
      order: 2,
      title: 'Systems Thinking',
      tags: ['systems', 'workflow'],
      content: normalizeText(`Music production is a system. Inputs, processes, outputs. Once you 
        see it that way, everything becomes optimizable. Workflows become templates. 
        Templates become knowledge. Knowledge becomes instinct.`),
      pullQuote: normalizeText('Workflows become templates. Templates become knowledge.'),
    },
    {
      id: 'evolution',
      order: 3,
      title: 'Continuous Evolution',
      tags: ['growth', 'discipline'],
      content: normalizeText(`The sound you made yesterday should feel like a stepping stone, 
        not a ceiling. Growth isn't optional—it's the whole point. Master the 
        fundamentals, then break them with purpose.`),
      pullQuote: normalizeText('Master the fundamentals, then break them with purpose.'),
    },
    {
      id: 'identity',
      order: 4,
      title: 'Signature Sound',
      tags: ['identity', 'voice'],
      content: normalizeText(`Anyone can learn the tools. What separates artists is identity. 
        The unique fingerprint that makes your work unmistakably yours. This 
        isn't about being different—it's about being authentic.`),
      pullQuote: normalizeText('What separates artists is identity.'),
    },
  ],
};

/**
 * Get chapter by ID
 */
export function getChapterById(id) {
  return philosophy.chapters.find(chapter => chapter.id === id);
}
