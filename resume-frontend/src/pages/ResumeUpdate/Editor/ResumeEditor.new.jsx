import React, { useState } from 'react';
import Split from 'react-split';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@monaco-editor/react";
import { Document, Page, pdfjs } from 'react-pdf';
import { useToast } from "@/components/ui/use-toast";
import { 
  FileDown,
  Share2,
  History,
  Save,
  Play,
  Settings,
  Loader2,
  X
} from "lucide-react";
import axiosInstance from "@/utils/AxiosInstance";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const defaultTemplate = `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{a4paper,margin=1in}

\\begin{document}
\\centerline{\\huge\\textbf{Your Name}}
\\vspace{0.5em}
\\centerline{\\textit{Email: your.email@example.com | Phone: (123) 456-7890}}
\\vspace{1em}

\\section*{Education}
\\textbf{University Name} \\hfill 20XX - 20XX
\\\\Bachelor of Science in Computer Science
\\\\GPA: X.XX/4.00

\\section*{Experience}
\\textbf{Company Name} \\hfill Month 20XX - Present
\\\\Software Engineer
\\begin{itemize}
  \\item Developed and maintained...
  \\item Implemented features...
  \\item Collaborated with team...
\\end{itemize}

\\section*{Skills}
\\textbf{Programming Languages:} Java, Python, JavaScript, C++
\\\\\\textbf{Technologies:} React, Node.js, Docker, Git
\\\\\\textbf{Soft Skills:} Team Leadership, Problem Solving, Communication

\\section*{Projects}
\\textbf{Project Name} \\hfill [GitHub]
\\begin{itemize}
  \\item Developed a...
  \\item Implemented...
  \\item Resulted in...
\\end{itemize}

\\end{document}`;

const ResumeEditor = () => {
  const { toast } = useToast();
  const [latexContent, setLatexContent] = useState(defaultTemplate);
  const [visualContent, setVisualContent] = useState('');
  const [activeTab, setActiveTab] = useState('code');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Convert HTML to LaTeX
  const convertHtmlToLatex = (html) => {
    return html
      .replace(/<h1>(.*?)<\/h1>/g, '\\section*{$1}')
      .replace(/<h2>(.*?)<\/h2>/g, '\\subsection*{$1}')
      .replace(/<strong>(.*?)<\/strong>/g, '\\textbf{$1}')
      .replace(/<em>(.*?)<\/em>/g, '\\textit{$1}')
      .replace(/<ul>(.*?)<\/ul>/g, '\\begin{itemize}$1\\end{itemize}')
      .replace(/<li>(.*?)<\/li>/g, '\\item $1')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/&nbsp;/g, ' ');
  };

  // Handle LaTeX compilation
  const handleCompile = async () => {
    try {
      setIsCompiling(true);
      const response = await axiosInstance.post('/api/compile', {
        latex: latexContent
      }, {
        responseType: 'blob'
      });
      
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
      toast({
        title: "Compilation successful",
        description: "Your LaTeX document has been compiled to PDF.",
      });
    } catch (error) {
      toast({
        title: "Compilation failed",
        description: error.message || "There was an error compiling your document.",
        variant: "destructive",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  // Handle document save
  const handleSave = async () => {
    try {
      await axiosInstance.post('/api/resume/save', {
        latex: latexContent,
        html: visualContent,
      });
      toast({
        title: "Document saved",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error.message || "There was an error saving your document.",
        variant: "destructive",
      });
    }
  };

  // Handle document sharing
  const handleShare = () => {
    const shareableLink = `${window.location.origin}/resume/share/${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Link copied",
      description: "Shareable link has been copied to clipboard.",
    });
  };

  // Handle PDF download
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle ATS analysis
  const handleAtsAnalysis = async () => {
    try {
      const response = await axiosInstance.post('/api/ats-analysis', {
        resumeContent: latexContent
      });
      setAtsScore(response.data);
      toast({
        title: "ATS Analysis Complete",
        description: "Your resume has been analyzed for ATS compatibility.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error.message || "There was an error analyzing your resume.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b p-2 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCompile}
            disabled={isCompiling}
          >
            {isCompiling ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isCompiling ? "Compiling..." : "Compile"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
            disabled={!pdfUrl}
          >
            <FileDown className="w-4 h-4 mr-1" />
            Download PDF
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleAtsAnalysis}
          >
            Generate ATS Score
          </Button>
          <Button variant="ghost" size="icon">
            <History className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <Split
          sizes={[50, 50]}
          minSize={300}
          gutterSize={8}
          gutterStyle={() => ({
            backgroundColor: '#f3f4f6',
            cursor: 'col-resize'
          })}
          className="split h-[calc(100vh-4rem)]"
        >
          {/* Left Panel - Editor */}
          <div className="h-full overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="w-full justify-start px-4 bg-white border-b">
                <TabsTrigger value="code">LaTeX Editor</TabsTrigger>
                <TabsTrigger value="visual">Visual Editor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="h-[calc(100vh-8rem)] border-r">
                <Editor
                  height="100%"
                  defaultLanguage="latex"
                  value={latexContent}
                  onChange={setLatexContent}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                    fontSize: 14,
                    fontFamily: "'Fira Code', monospace",
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'boundary',
                  }}
                />
              </TabsContent>

              <TabsContent value="visual" className="h-[calc(100vh-8rem)] border-r">
                <div 
                  className="w-full h-full p-6 prose max-w-none overflow-y-auto"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const content = e.currentTarget.innerHTML;
                    setVisualContent(content);
                    setLatexContent(convertHtmlToLatex(content));
                  }}
                  dangerouslySetInnerHTML={{ __html: visualContent }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="h-full bg-white">
            <div className="h-full flex flex-col">
              <div className="border-b p-2 flex items-center justify-between bg-white">
                <div className="text-sm text-gray-500">
                  {numPages ? `Page ${pageNumber} of ${numPages}` : 'Preview'}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                    disabled={pageNumber >= (numPages || 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-auto bg-gray-50">
                {pdfUrl ? (
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    className="flex justify-center"
                  >
                    <Page
                      pageNumber={pageNumber}
                      className="shadow-lg"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {isCompiling ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <p>Compiling your LaTeX document...</p>
                      </div>
                    ) : (
                      <p>Preview will appear here after compilation</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Split>
      </div>

      {/* ATS Score Panel */}
      {atsScore && (
        <div className="fixed bottom-0 right-0 w-80 bg-white border-l border-t shadow-lg rounded-tl-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">ATS Analysis</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAtsScore(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="prose max-w-none">
              <div className="mb-4">
                <div className="text-2xl font-bold text-center">
                  {atsScore.score}/100
                </div>
                <div className="text-sm text-gray-500 text-center">
                  ATS Compatibility Score
                </div>
              </div>
              <div className="space-y-2">
                {atsScore.suggestions?.map((suggestion, index) => (
                  <p key={index} className="text-sm">
                    {suggestion}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;