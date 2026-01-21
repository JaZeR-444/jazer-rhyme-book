import { useEffect } from 'react';

/**
 * usePageTitle - Hook to update document.title for accessibility
 * Screen readers announce the page title when navigating
 *
 * @param {string} title - The page title to display
 * @param {boolean} [includeAppName=true] - Whether to append " - JaZeR Rhyme Book"
 */
export function usePageTitle(title, includeAppName = true) {
  useEffect(() => {
    const fullTitle = includeAppName ? `${title} - JaZeR Rhyme Book` : title;
    document.title = fullTitle;

    // Cleanup: restore default title on unmount if desired
    return () => {
      document.title = 'JaZeR Rhyme Book';
    };
  }, [title, includeAppName]);
}
