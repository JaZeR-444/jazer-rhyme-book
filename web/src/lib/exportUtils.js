/**
 * exportUtils.js
 *
 * Utility functions for exporting content to files (TXT, JSON, Markdown).
 * Provides reusable download functionality across the application.
 */

/**
 * Trigger a file download with the given content
 * @param {string} content - The file content
 * @param {string} filename - The desired filename
 * @param {string} mimeType - The MIME type (e.g., 'text/plain', 'application/json')
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export workspace as Markdown
 * @param {string} workspaceText - The exported workspace text (from exportWorkspace())
 */
export function exportWorkspaceAsMarkdown(workspaceText) {
  downloadFile(workspaceText, `verse-board-${Date.now()}.md`, 'text/markdown');
}

/**
 * Export writing content as plain text
 * @param {string} content - The writing content
 */
export function exportAsText(content) {
  downloadFile(content, `writing-${Date.now()}.txt`, 'text/plain');
}

/**
 * Export writing content with metadata as JSON
 * @param {string} content - The writing content
 * @param {object} metadata - Metadata to include in the export
 */
export function exportAsJSON(content, metadata = {}) {
  const exportData = {
    content,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString()
    }
  };

  downloadFile(
    JSON.stringify(exportData, null, 2),
    `writing-${Date.now()}.json`,
    'application/json'
  );
}
