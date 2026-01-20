/**
 * Export Formats Library
 * Provides utilities for exporting content to various formats
 */

export async function exportToPDF(content, metadata = {}) {
  const lines = content.split('\n');
  const title = metadata.title || 'Untitled';
  const author = metadata.author || 'JaZeR';
  const date = new Date().toLocaleDateString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @page { margin: 1in; }
        body {
          font-family: 'Georgia', serif;
          line-height: 1.8;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 2em;
          border-bottom: 2px solid #333;
          padding-bottom: 1em;
        }
        .title { font-size: 24pt; font-weight: bold; }
        .meta { font-size: 10pt; color: #666; margin-top: 0.5em; }
        .content {
          white-space: pre-wrap;
          font-size: 12pt;
          line-height: 2;
        }
        .footer {
          margin-top: 2em;
          padding-top: 1em;
          border-top: 1px solid #ddd;
          font-size: 9pt;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${title}</div>
        <div class="meta">By ${author} • ${date}</div>
      </div>
      <div class="content">${content}</div>
      <div class="footer">
        Generated with JaZeR Rhyme Book • ${metadata.wordCount || 0} words
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '-')}.html`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert('HTML file downloaded. Open in browser and print to PDF.');
}

export function exportToGoogleDocs(content, metadata = {}) {
  const title = metadata.title || 'Untitled';
  const encodedContent = encodeURIComponent(content);
  
  const googleDocsUrl = `https://docs.google.com/document/create?title=${encodeURIComponent(title)}&body=${encodedContent}`;
  
  window.open(googleDocsUrl, '_blank');
}

export function exportToTwitter(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const threads = [];
  let currentThread = '';
  
  for (const line of lines) {
    if ((currentThread + '\n' + line).length > 280) {
      if (currentThread) threads.push(currentThread);
      currentThread = line;
    } else {
      currentThread = currentThread ? currentThread + '\n' + line : line;
    }
  }
  
  if (currentThread) threads.push(currentThread);
  
  const threadText = threads
    .map((tweet, idx) => `[${idx + 1}/${threads.length}]\n${tweet}`)
    .join('\n\n---\n\n');
  
  const blob = new Blob([threadText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `twitter-thread-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  const firstTweet = threads[0].slice(0, 280);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet)}`;
  
  if (confirm('Thread prepared! Would you like to open Twitter to post?')) {
    window.open(twitterUrl, '_blank');
  }
}

export function exportToInstagram(content) {
  const maxLength = 2200;
  let formatted = content;
  
  if (formatted.length > maxLength) {
    formatted = formatted.slice(0, maxLength - 3) + '...';
  }
  
  formatted = formatted
    .split('\n\n')
    .map(para => para.trim())
    .filter(Boolean)
    .join('\n.\n');
  
  formatted = `${formatted}\n\n---\n📝 Written with JaZeR Rhyme Book\n#lyrics #hiphop #writing`;
  
  navigator.clipboard.writeText(formatted).then(() => {
    alert('Caption copied to clipboard! Ready to paste in Instagram.');
  }).catch(() => {
    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-caption-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export function exportToMarkdown(content, metadata = {}) {
  const title = metadata.title || 'Untitled';
  const author = metadata.author || 'JaZeR';
  const date = new Date().toLocaleDateString();
  
  const markdown = `# ${title}

**Author:** ${author}  
**Date:** ${date}  
**Words:** ${metadata.wordCount || 0}

---

${content}

---

*Generated with JaZeR Rhyme Book*
`;
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '-')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
