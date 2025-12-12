import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import toast from 'react-hot-toast';
import axiosInstance from "@/utils/AxiosInstance";
import '@/styles/split.css';
import {
  FileDown,
  Save,
  Play,
  Loader2,
  Sparkles,
  BarChart3
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
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

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
        { latex: latexContent },
        { responseType: 'blob' }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(pdfBlob));
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
          >
            ← Back
          </button>
          <div className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <span className="text-amber-500">REMUS</span> Editor
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCompile} disabled={isCompiling} className="cursor-pointer">
            {isCompiling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Compile
          </Button>
          <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving} className="cursor-pointer">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
          <Button variant="outline" size="sm" disabled={!pdfUrl} onClick={handleDownload} className="cursor-pointer">
            <FileDown className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleATSScore} className="cursor-pointer">
            <BarChart3 className="w-4 h-4 mr-2" /> ATS Score
          </Button>
          <Button variant="outline" size="sm" onClick={handleAISuggestions} className="cursor-pointer">
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
            <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
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
