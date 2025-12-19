import React, { useState, useEffect, useRef } from 'react';
import Split from 'react-split';
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import toast from 'react-hot-toast';
import axiosInstance from "@/utils/AxiosInstance";
import { parseSyncTeX, estimateLineFromPosition } from '@/utils/synctexParser';
import '@/styles/split.css';
import {
  FileDown,
  Save,
  Play,
  Loader2,
  Sparkles,
  BarChart3,
  Home
} from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';

// Default LaTeX template
const defaultTemplate = `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\geometry{a4paper,margin=0.75in}

\\begin{document}

\\begin{center}
{\\huge\\textbf{Your Name}}\\\\[0.3em]
{\\large Software Engineer}\\\\[0.5em]
\\href{mailto:your.email@example.com}{your.email@example.com} | 
\\href{tel:+1234567890}{+1 (234) 567-890} | 
\\href{https://linkedin.com/in/yourprofile}{LinkedIn} | 
\\href{https://github.com/yourusername}{GitHub}
\\end{center}

\\section*{Summary}
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading cross-functional teams.

\\section*{Experience}
\\textbf{Senior Software Engineer} \\hfill Jan 2021 -- Present\\\\
\\textit{Tech Company Inc., San Francisco, CA}
\\begin{itemize}[noitemsep,topsep=0pt]
    \\item Led development of microservices architecture serving 1M+ users
    \\item Improved application performance by 40\\% through optimization
    \\item Mentored 5 junior developers and conducted code reviews
\\end{itemize}

\\vspace{0.5em}
\\textbf{Software Engineer} \\hfill Jun 2019 -- Dec 2020\\\\
\\textit{Startup Co., New York, NY}
\\begin{itemize}[noitemsep,topsep=0pt]
    \\item Built RESTful APIs using Node.js and Express
    \\item Implemented CI/CD pipelines reducing deployment time by 60\\%
    \\item Collaborated with product team to define technical requirements
\\end{itemize}

\\section*{Education}
\\textbf{Bachelor of Science in Computer Science} \\hfill 2015 -- 2019\\\\
\\textit{University Name, City, State}\\\\
GPA: 3.8/4.0

\\section*{Skills}
\\textbf{Languages:} JavaScript, TypeScript, Python, Java\\\\
\\textbf{Frontend:} React, Vue.js, HTML/CSS, Tailwind CSS\\\\
\\textbf{Backend:} Node.js, Express, Django, Spring Boot\\\\
\\textbf{Databases:} MongoDB, PostgreSQL, Redis\\\\
\\textbf{Tools:} Git, Docker, Kubernetes, AWS, CI/CD

\\section*{Projects}
\\textbf{E-commerce Platform}
\\begin{itemize}[noitemsep,topsep=0pt]
    \\item Built full-stack e-commerce application with React and Node.js
    \\item Integrated Stripe payment processing and email notifications
    \\item Deployed on AWS with auto-scaling and load balancing
\\end{itemize}

\\end{document}`;

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [latexContent, setLatexContent] = useState(defaultTemplate);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [synctexData, setSynctexData] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [clickToEditMode, setClickToEditMode] = useState(false);
  const editorRef = useRef(null);

  // Load resume on mount
  useEffect(() => {
    if (id) {
      loadResume();
    }
  }, [id]);

  const loadResume = async () => {
    try {
      const response = await axiosInstance.get(`/api/resume/${id}`);
      if (response.data && response.data.latexContent) {
        setLatexContent(response.data.latexContent);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume');
    }
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const response = await axiosInstance.post('/api/compile',
        { latex: latexContent }
      );

      // Response now contains { pdf: base64, synctex: base64 }
      const { pdf, synctex } = response.data;

      // Convert base64 PDF to blob
      const pdfBinary = atob(pdf);
      const pdfArray = new Uint8Array(pdfBinary.length);
      for (let i = 0; i < pdfBinary.length; i++) {
        pdfArray[i] = pdfBinary.charCodeAt(i);
      }
      const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });

      // Create PDF URL
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(pdfBlob));

      // Store SyncTeX data
      if (synctex) {
        setSynctexData(synctex);
        console.log('SyncTeX data received');
      }

      toast.success('Compiled successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Compilation failed. Check your LaTeX syntax.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.put(`/api/resume/${id}`, {
        latexContent: latexContent
      });
      toast.success('Resume saved!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'resume.pdf';
      link.click();
      toast.success('Downloaded!');
    } else {
      toast.error('Please compile first');
    }
  };

  const handleATSScore = async () => {
    try {
      toast.loading('Analyzing resume...');
      const response = await axiosInstance.post('/api/ai/score', {
        resumeContent: latexContent
      });
      setAtsScore(response.data);
      setShowAtsModal(true);
      toast.dismiss();
      toast.success('Analysis complete!');
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error('Failed to analyze resume');
    }
  };

  const handleAISuggestions = async () => {
    try {
      toast.loading('Generating suggestions...');
      const response = await axiosInstance.post('/api/ai/suggestions', {
        latexContent: latexContent
      });
      setAiSuggestions(response.data.suggestions);
      setShowSuggestionsModal(true);
      toast.dismiss();
      toast.success('Suggestions ready!');
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error('Failed to generate suggestions');
    }
  };

  // Handle PDF click for SyncTeX
  const handlePdfClick = (event) => {
    if (!editorRef.current) {
      console.log('Editor ref not available');
      return;
    }

    console.log('PDF clicked!');

    // Get the overlay div that was clicked
    const overlay = event.currentTarget;
    const rect = overlay.getBoundingClientRect();

    // Calculate relative position
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const relativeY = y / rect.height;

    console.log('Click position:', { x, y, relativeY });

    // Convert screen pixels to PDF points (A4: 595x842 points)
    const pdfX = Math.floor((x / rect.width) * 595);
    const pdfY = Math.floor(842 - (y / rect.height) * 842); // Flip Y-axis
    console.log('PDF points:', { pdfX, pdfY });

    let lineNumber = null;

    if (synctexData) {
      // Try SyncTeX first
      try {
        console.log('Trying SyncTeX...');
        lineNumber = parseSyncTeX(synctexData, 1, pdfX, pdfY);
        console.log('SyncTeX returned line:', lineNumber);
      } catch (error) {
        console.error('SyncTeX error:', error);
      }
    }

    // Fallback to section-based
    if (!lineNumber) {
      console.log('Using fallback section-based navigation');
      lineNumber = estimateLineFromPosition(latexContent, relativeY);
      console.log('Estimated line:', lineNumber);
    }

    if (lineNumber && editorRef.current) {
      console.log('Jumping to line:', lineNumber);
      editorRef.current.revealLineInCenter(lineNumber);
      editorRef.current.setPosition({ lineNumber, column: 1 });
      editorRef.current.focus();
      toast.success(`Jumped to line ${lineNumber}`);
    }
  };

  // Handle editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };


  return (
    <div className="h-screen flex flex-col bg-yellow-50">
      {/* Top Toolbar */}
      <div className="h-16 border-b bg-black flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer hover:bg-gray-900 p-2 rounded"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>
          <div className="font-bold text-xl text-yellow-400 flex items-center gap-2">
            <span className="text-yellow-300">REMUS</span> Editor
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleCompile} disabled={isCompiling} className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black border-none">
            {isCompiling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Compile
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black border-none">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
          <Button size="sm" disabled={!pdfUrl} onClick={handleDownload} className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black border-none">
            <FileDown className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button size="sm" onClick={handleATSScore} className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black border-none">
            <BarChart3 className="w-4 h-4 mr-2" /> ATS Score
          </Button>
          <Button size="sm" onClick={handleAISuggestions} className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black border-none">
            <Sparkles className="w-4 h-4 mr-2" /> AI Suggestions
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        <Split
          className="split flex-1 flex"
          sizes={[50, 50]}
          minSize={400}
          gutterSize={8}
        >
          {/* LaTeX Editor */}
          <div className="h-full bg-white flex flex-col">
            <div className="px-4 py-2 bg-gray-50 border-b">
              <h3 className="text-sm font-medium text-gray-700">LaTeX Source</h3>
            </div>
            <Editor
              height="100%"
              defaultLanguage="latex"
              value={latexContent}
              onChange={setLatexContent}
              onMount={handleEditorDidMount}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>

          {/* PDF Preview */}
          <div className="h-full bg-gray-100 p-6 flex flex-col">
            <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden relative">
              {pdfUrl ? (
                <>
                  {/* Toggle Button */}
                  <button
                    onClick={() => setClickToEditMode(!clickToEditMode)}
                    className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${clickToEditMode
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    title={clickToEditMode ? 'Click-to-edit enabled' : 'Click-to-edit disabled'}
                  >
                    {clickToEditMode ? '✓ Edit Mode' : 'Edit Mode'}
                  </button>

                  <div
                    className="relative w-full h-full"
                    onClick={clickToEditMode ? handlePdfClick : undefined}
                    style={{ cursor: clickToEditMode ? 'crosshair' : 'default' }}
                  >
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full border-none"
                      title="PDF Preview"
                      style={{ pointerEvents: clickToEditMode ? 'none' : 'auto' }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                  <FileDown className="w-16 h-16 opacity-20" />
                  <p className="text-lg font-medium">Click "Compile" to generate preview</p>
                  <p className="text-sm">Edit the LaTeX code on the left and compile to see changes</p>
                </div>
              )}
            </div>
          </div>
        </Split>
      </div>

      {/* ATS Score Modal */}
      {showAtsModal && atsScore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAtsModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">ATS Score Analysis</h2>
            <div className="mb-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">{atsScore.score}/100</div>
              <div className="text-gray-600">Your resume's ATS compatibility score</div>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">{atsScore.analysis}</pre>
            </div>
            <Button onClick={() => setShowAtsModal(false)} className="mt-4">Close</Button>
          </div>
        </div>
      )}

      {/* AI Suggestions Modal */}
      {showSuggestionsModal && aiSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSuggestionsModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              AI Improvement Suggestions
            </h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">{aiSuggestions}</pre>
            </div>
            <Button onClick={() => setShowSuggestionsModal(false)} className="mt-4">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;
