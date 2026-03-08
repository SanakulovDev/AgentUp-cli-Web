import { useState, lazy, Suspense } from 'react';
import {
  Zap,
  FileCode,
  Github,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { cn } from './lib/utils';

const LazyBelowFold = lazy(() => import('./BelowFold').then(m => ({
  default: () => (
    <>
      <m.InteractivePreview />
      <m.Features />
      <m.WhatGetsGenerated />
      <m.SupportedTools />
      <m.HowItWorks />
      <m.UseCases />
      <m.FAQ />
      <m.Footer />
    </>
  )
})));

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Agent Up</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#demo" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Demo</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Workflow</a>
          <a href="#faq" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="text-slate-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.npmjs.com/package/agentup-cli" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors">
            Get Started
          </a>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  const [copied, setCopied] = useState(false);
  const command = "npx agentup-cli@latest init";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-40 right-0 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            v0.1.0 is now live
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Generate AI agent context <br />
            <span className="text-gradient">automatically.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Agent Up is a CLI tool that scaffolds AI coding agent configuration for modern development workflows. Stop manually maintaining context files.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="https://www.npmjs.com/package/agentup-cli" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-center">
              View Demo
            </a>
          </div>

          <div className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center justify-between gap-4 bg-[#0a0f1d] border border-white/10 rounded-xl p-4 font-mono text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-emerald-500">$</span>
                <span>{command}</span>
              </div>
              <button
                onClick={copyToClipboard}
                aria-label="Copy command to clipboard"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProblemSection = () => (
  <section className="py-24 border-y border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            The manual context <br />
            <span className="text-slate-400">maintenance nightmare.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Developers today spend hours manually writing and updating instruction files for different AI agents. It's repetitive, inconsistent, and easy to forget.
          </p>
          <ul className="space-y-4">
            {[
              "Maintaining separate rules for Claude and Cursor",
              "Inconsistent project descriptions across files",
              "Outdated environment context in AGENTS.md",
              "Manual scaffolding for every new project"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <div className="mt-1 p-1 bg-red-500/10 rounded">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "CLAUDE.md", color: "from-orange-500/20 to-orange-500/5" },
            { name: "AGENTS.md", color: "from-blue-500/20 to-blue-500/5" },
            { name: ".cursorrules", color: "from-cyan-500/20 to-cyan-500/5" },
            { name: ".claude/rules", color: "from-purple-500/20 to-purple-500/5" }
          ].map((file, i) => (
            <div key={i} className={cn("p-6 rounded-2xl border border-white/10 bg-gradient-to-br flex flex-col items-center justify-center gap-3", file.color)}>
              <FileCode className="w-8 h-8 opacity-50" />
              <span className="text-sm font-mono text-slate-400">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <Suspense fallback={<div className="py-24" />}>
          <LazyBelowFold />
        </Suspense>
      </main>
    </div>
  );
}
