import pako from 'pako';

/**
 * Parse SyncTeX data to find LaTeX line number from PDF coordinates
 * @param {string} synctexBase64 - Base64 encoded SyncTeX.gz file
 * @param {number} page - PDF page number (1-indexed)
 * @param {number} x - X coordinate on PDF page
 * @param {number} y - Y coordinate on PDF page
 * @returns {number|null} - Line number in LaTeX source, or null if not found
 */
export function parseSyncTeX(synctexBase64, page, x, y) {
    try {
        console.log('Parsing SyncTeX with coords:', { page, x, y });

        // Decode base64
        const compressed = Uint8Array.from(atob(synctexBase64), c => c.charCodeAt(0));

        // Decompress gzip
        const decompressed = pako.ungzip(compressed, { to: 'string' });

        console.log('SyncTeX decompressed, length:', decompressed.length);
        console.log('First 500 chars:', decompressed.substring(0, 500));

        // Parse SyncTeX format - looking for vertical boxes (v) and horizontal boxes (h)
        const lines = decompressed.split('\n');
        let currentPage = 0;
        let bestMatch = null;
        let minDistance = Infinity;
        let matchCount = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Track current page - format: {page_number
            if (line.startsWith('{')) {
                const pageMatch = line.match(/\{(\d+)/);
                if (pageMatch) {
                    currentPage = parseInt(pageMatch[1]);
                }
            }

            // Look for position records on the target page
            // Format can be: h<x>,<y>:<line>:<column> or v<x>,<y>:<line>:<column>
            if (currentPage === page && (line.startsWith('h') || line.startsWith('v') || line.startsWith('x'))) {
                // Try different SyncTeX formats
                const match = line.match(/[hvx](-?\d+),(-?\d+):(\d+):(\d+)/) ||
                    line.match(/[hvx](-?\d+),(-?\d+),(-?\d+):(\d+)/);

                if (match) {
                    const pdfX = parseInt(match[1]);
                    const pdfY = parseInt(match[2]);
                    const lineNum = parseInt(match[3]);

                    // Calculate distance
                    const distance = Math.sqrt(
                        Math.pow(pdfX - x, 2) +
                        Math.pow(pdfY - y, 2)
                    );

                    matchCount++;

                    if (distance < minDistance) {
                        minDistance = distance;
                        bestMatch = lineNum;
                    }
                }
            }
        }

        console.log('SyncTeX matches found:', matchCount);
        console.log('Best match line:', bestMatch, 'distance:', minDistance);

        return bestMatch;
    } catch (error) {
        console.error('SyncTeX parsing error:', error);
        return null;
    }
}

/**
 * Simplified section-based fallback when SyncTeX is not available
 * @param {string} latexContent - Full LaTeX source code
 * @param {number} relativeY - Relative Y position (0-1) on PDF
 * @returns {number} - Estimated line number
 */
export function estimateLineFromPosition(latexContent, relativeY) {
    const lines = latexContent.split('\n');

    // Common LaTeX sections in typical resume order
    const sections = [
        { pattern: /\\begin{center}|\\centerline.*\\textbf/, name: 'header', weight: 0.05 },
        { pattern: /\\section\*{Summary}/, name: 'summary', weight: 0.15 },
        { pattern: /\\section\*{.*Experience}/, name: 'experience', weight: 0.35 },
        { pattern: /\\section\*{Education}/, name: 'education', weight: 0.65 },
        { pattern: /\\section\*{Skills}/, name: 'skills', weight: 0.80 },
        { pattern: /\\section\*{Projects}/, name: 'projects', weight: 0.90 }
    ];

    // Find the section closest to the click position
    let bestSection = null;
    let minDiff = Infinity;

    for (const section of sections) {
        const diff = Math.abs(section.weight - relativeY);
        if (diff < minDiff) {
            minDiff = diff;
            bestSection = section;
        }
    }

    // Find the line number for this section
    if (bestSection) {
        for (let i = 0; i < lines.length; i++) {
            if (bestSection.pattern.test(lines[i])) {
                console.log('Fallback: Found section', bestSection.name, 'at line', i + 1);
                return i + 1; // Monaco uses 1-based indexing
            }
        }
    }

    // Fallback: estimate based on relative position
    const estimatedLine = Math.max(1, Math.floor(lines.length * relativeY));
    console.log('Fallback: Estimated line', estimatedLine, 'from relativeY', relativeY);
    return estimatedLine;
}
