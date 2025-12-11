const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const compileLatex = async (req, res) => {
    let tempDir;
    try {
        const { latex } = req.body;
        if (!latex) {
            return res.status(400).json({ message: 'LaTeX content is required' });
        }

        console.log('Compiling LaTeX using local pdflatex...');
        console.log('LaTeX content length:', latex.length);

        // Create a temporary directory for compilation
        tempDir = path.join(__dirname, '../temp', `compile_${Date.now()}`);
        await fs.mkdir(tempDir, { recursive: true });

        // Write LaTeX content to a temporary file
        const tempFile = path.join(tempDir, 'resume.tex');
        await fs.writeFile(tempFile, latex, 'utf-8');
        console.log('Wrote LaTeX to:', tempFile);

        // Compile LaTeX to PDF (run twice for references)
        const pdflatexCmd = `pdflatex -interaction=nonstopmode -halt-on-error -output-directory="${tempDir}" "${tempFile}"`;

        try {
            console.log('Running pdflatex first pass...');
            await execPromise(pdflatexCmd, { cwd: tempDir });

            console.log('Running pdflatex second pass...');
            await execPromise(pdflatexCmd, { cwd: tempDir });
        } catch (compileError) {
            console.error('pdflatex compilation error:', compileError.message);

            // Try to read the log file for error details
            try {
                const logFile = path.join(tempDir, 'resume.log');
                const logContent = await fs.readFile(logFile, 'utf-8');
                const errorMatch = logContent.match(/!(.*)/);
                const errorMsg = errorMatch ? errorMatch[1] : 'LaTeX compilation failed';
                throw new Error(errorMsg);
            } catch (logError) {
                throw new Error('LaTeX compilation failed. Check your syntax.');
            }
        }

        // Read the generated PDF
        const pdfPath = path.join(tempDir, 'resume.pdf');
        console.log('Reading PDF from:', pdfPath);

        const pdfContent = await fs.readFile(pdfPath);
        console.log('PDF size:', pdfContent.length, 'bytes');

        // Clean up temporary files
        await fs.rm(tempDir, { recursive: true, force: true });

        // Send PDF back to client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=resume.pdf');
        res.setHeader('Content-Length', pdfContent.length);
        res.send(pdfContent);

        console.log('Compilation successful!');

    } catch (error) {
        console.error('Compilation error:', error.message);

        // Clean up on error
        if (tempDir) {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError.message);
            }
        }

        res.status(500).json({
            message: 'Failed to compile LaTeX',
            error: error.message
        });
    }
};

module.exports = {
    compileLatex
};