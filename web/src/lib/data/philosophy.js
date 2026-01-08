/**
 * Philosophy Content
 * ==================
 * 
 * Artistic values and creative principles for the Philosophy section.
 * Structured as chapters for progressive disclosure.
 */

export const philosophy = {
  title: 'Creative Philosophy',
  tagline: 'The principles behind the sound.',
  
  chapters: [
    {
      id: 'intention',
      title: 'Intention Over Accident',
      content: `Every sound exists for a reason. Nothing is random. The goal isn't 
        to stumble upon something good—it's to know exactly why something works 
        and to replicate that understanding across everything you create.`,
      pullQuote: `The goal isn't to stumble upon something good—it's to know why.`,
    },
    {
      id: 'systems',
      title: 'Systems Thinking',
      content: `Music production is a system. Inputs, processes, outputs. Once you 
        see it that way, everything becomes optimizable. Workflows become templates. 
        Templates become knowledge. Knowledge becomes instinct.`,
      pullQuote: 'Workflows become templates. Templates become knowledge.',
    },
    {
      id: 'evolution',
      title: 'Continuous Evolution',
      content: `The sound you made yesterday should feel like a stepping stone, 
        not a ceiling. Growth isn't optional—it's the whole point. Master the 
        fundamentals, then break them with purpose.`,
      pullQuote: 'Master the fundamentals, then break them with purpose.',
    },
    {
      id: 'identity',
      title: 'Signature Sound',
      content: `Anyone can learn the tools. What separates artists is identity. 
        The unique fingerprint that makes your work unmistakably yours. This 
        isn't about being different—it's about being authentic.`,
      pullQuote: 'What separates artists is identity.',
    },
  ],
};

/**
 * Get chapter by ID
 */
export function getChapterById(id) {
  return philosophy.chapters.find(chapter => chapter.id === id);
}
