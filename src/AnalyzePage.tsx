import { useState, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Upload,
  FileText,
  Github,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Copy,
  Check
} from 'lucide-react';
import { cn } from './lib/utils';

interface Suggestion {
  type: 'improvement' | 'warning' | 'addition';
  title: string;
  description: string;
  original?: string;
  suggested?: string;
}

interface AnalysisResult {
  score: number;
  summary: string;
  suggestions: Suggestion[];
  improvedContent: string;
}

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Agent Up</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="text-slate-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </nav>
);

const SuggestionIcon = ({ type }: { type: Suggestion['type'] }) => {
  switch (type) {
    case 'improvement':
      return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'addition':
      return <Info className="w-4 h-4 text-emerald-400" />;
  }
};

const suggestionColor: Record<Suggestion['type'], string> = {
  improvement: 'border-cyan-500/30 bg-cyan-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  addition: 'border-emerald-500/30 bg-emerald-500/5'
};

export default function AnalyzePage() {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'improved'>('suggestions');

  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.mdc') && !file.name.endsWith('.txt')) {
      setError('Please upload a .md, .mdc, or .txt file');
      return;
    }

    setFileName(file.name);
    setError('');
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.mdc') && !file.name.endsWith('.txt')) {
      setError('Please upload a .md, .mdc, or .txt file');
      return;
    }

    setFileName(file.name);
    setError('');
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  }, []);

  const analyzeFile = useCallback(async () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || !fileContent) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert at analyzing and improving AI coding agent configuration files (CLAUDE.md, AGENTS.md, .cursorrules, etc.).

Analyze the provided file and return a JSON response with this exact structure:
{
  "score": <number 1-100 rating the file quality>,
  "summary": "<brief overall assessment>",
  "suggestions": [
    {
      "type": "improvement" | "warning" | "addition",
      "title": "<short title>",
      "description": "<detailed explanation>",
      "original": "<original text snippet if applicable, or null>",
      "suggested": "<suggested replacement text if applicable, or null>"
    }
  ],
  "improvedContent": "<the full improved version of the file>"
}

Types:
- "improvement": something that exists but can be made better
- "warning": potential issues or anti-patterns
- "addition": missing sections or content that should be added

Provide 3-8 actionable suggestions. Output ONLY valid JSON, no markdown code blocks.`
            },
            {
              role: 'user',
              content: `Analyze this "${fileName}" file and provide improvement suggestions:\n\n${fileContent}`
            }
          ],
          temperature: 0.5,
          max_tokens: 4096,
          response_format: { type: 'json_object' }
        })
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      const parsed = JSON.parse(content) as AnalysisResult;
      setAnalysis(parsed);
      setActiveTab('suggestions');
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fileContent, fileName]);

  const copyImproved = useCallback(() => {
    if (!analysis?.improvedContent) return;
    navigator.clipboard.writeText(analysis.improvedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [analysis]);

  const clearFile = () => {
    setFileContent('');
    setFileName('');
    setAnalysis(null);
    setError('');
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const scoreRingColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-400';
    if (score >= 60) return 'stroke-amber-400';
    return 'stroke-red-400';
  };

  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-4">
              <Sparkles className="w-3 h-3" /> AI-Powered Analysis
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Analyze Your Config File
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upload your CLAUDE.md, AGENTS.md, or .cursorrules file and get AI-powered suggestions to improve it.
            </p>
          </div>

          {/* Upload Area */}
          {!fileContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/[0.02] transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1">Drop your file here or click to browse</p>
                  <p className="text-sm text-slate-500">Supports .md, .mdc, .txt files</p>
                </div>
                <input
                  type="file"
                  accept=".md,.mdc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Or paste content */}
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider">or paste content</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <textarea
                  placeholder="Paste your CLAUDE.md or AGENTS.md content here..."
                  onChange={(e) => {
                    if (e.target.value) {
                      setFileContent(e.target.value);
                      setFileName('pasted-content.md');
                    }
                  }}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono"
                />
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* File info bar */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium text-white">{fileName}</span>
                  <span className="text-xs text-slate-500">{fileContent.length} characters</span>
                </div>
                <div className="flex items-center gap-3">
                  {!loading && (
                    <button
                      onClick={analyzeFile}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="w-4 h-4" />
                      {analysis ? 'Re-analyze' : 'Analyze'}
                    </button>
                  )}
                  {loading && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-slate-300">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </div>
                  )}
                  <button
                    onClick={clearFile}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Original file content */}
                <div className="glass rounded-2xl overflow-hidden flex flex-col max-h-[600px]">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-400">{fileName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 ml-auto">ORIGINAL</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{fileContent}</pre>
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="glass rounded-2xl overflow-hidden flex flex-col max-h-[600px]">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <div className="flex gap-1">
                      <button
                        onClick={() => setActiveTab('suggestions')}
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded transition-colors",
                          activeTab === 'suggestions' ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-300"
                        )}
                      >
                        Suggestions
                      </button>
                      <button
                        onClick={() => setActiveTab('improved')}
                        disabled={!analysis}
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded transition-colors",
                          activeTab === 'improved' ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-300",
                          !analysis && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        Improved Version
                      </button>
                    </div>
                    {activeTab === 'improved' && analysis && (
                      <button
                        onClick={copyImproved}
                        className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {!analysis && !loading && (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Sparkles className="w-10 h-10 text-slate-600 mb-3" />
                        <p className="text-sm text-slate-500">Click "Analyze" to get AI-powered suggestions</p>
                      </div>
                    )}

                    {loading && (
                      <div className="flex flex-col items-center justify-center h-full p-8">
                        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                        <p className="text-sm text-slate-400">Analyzing your file...</p>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {analysis && activeTab === 'suggestions' && (
                        <motion.div
                          key="suggestions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 space-y-4"
                        >
                          {/* Score */}
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" className="stroke-white/10" />
                                <circle
                                  cx="32" cy="32" r="28" fill="none" strokeWidth="4"
                                  strokeDasharray={`${(analysis.score / 100) * 176} 176`}
                                  strokeLinecap="round"
                                  className={scoreRingColor(analysis.score)}
                                />
                              </svg>
                              <span className={cn("absolute inset-0 flex items-center justify-center text-lg font-bold", scoreColor(analysis.score))}>
                                {analysis.score}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white mb-1">Quality Score</p>
                              <p className="text-xs text-slate-400">{analysis.summary}</p>
                            </div>
                          </div>

                          {/* Suggestions list */}
                          <div className="space-y-3">
                            {analysis.suggestions.map((s, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={cn("p-4 rounded-xl border", suggestionColor[s.type])}
                              >
                                <div className="flex items-start gap-3">
                                  <SuggestionIcon type={s.type} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white mb-1">{s.title}</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                                    {s.original && (
                                      <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                                        <p className="text-[10px] uppercase text-red-400 mb-1 font-medium">Current</p>
                                        <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap">{s.original}</pre>
                                      </div>
                                    )}
                                    {s.suggested && (
                                      <div className="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                                        <p className="text-[10px] uppercase text-emerald-400 mb-1 font-medium">Suggested</p>
                                        <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">{s.suggested}</pre>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {analysis && activeTab === 'improved' && (
                        <motion.div
                          key="improved"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4"
                        >
                          <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {analysis.improvedContent}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
