// Handle PDF click for SyncTeX
const handlePdfClick = (event) => {
    if (!synctexData || !editorRef.current) {
        // Fallback to section-based navigation
        const iframe = event.target.closest('iframe');
        if (!iframe) return;

        const rect = iframe.getBoundingClientRect();
        const relativeY = (event.clientY - rect.top) / rect.height;
        const lineNumber = estimateLineFromPosition(latexContent, relativeY);

        editorRef.current.revealLineInCenter(lineNumber);
        editorRef.current.setPosition({ lineNumber, column: 1 });
        editorRef.current.focus();

        toast.success(`Jumped to line ${lineNumber}`);
        return;
    }

    // SyncTeX-based navigation (more accurate)
    try {
        const iframe = event.target.closest('iframe');
        if (!iframe) return;

        const rect = iframe.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const page = 1; // Assuming single page for now

        const lineNumber = parseSyncTeX(synctexData, page, x, y);

        if (lineNumber) {
            editorRef.current.revealLineInCenter(lineNumber);
            editorRef.current.setPosition({ lineNumber, column: 1 });
            editorRef.current.focus();
            toast.success(`Jumped to line ${lineNumber}`);
        } else {
            // Fallback
            const relativeY = y / rect.height;
            const estimatedLine = estimateLineFromPosition(latexContent, relativeY);
            editorRef.current.revealLineInCenter(estimatedLine);
            editorRef.current.setPosition({ lineNumber: estimatedLine, column: 1 });
            editorRef.current.focus();
        }
    } catch (error) {
        console.error('PDF click error:', error);
    }
};

// Handle editor mount
const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
};
