import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Zap, 
  Layout, 
  Database, 
  Box, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Folder, 
  Github,
  Monitor,
  Layers,
  Users,
  ArrowRight,
  Copy,
  Check,
  Coffee
} from 'lucide-react';
import { cn } from './lib/utils';

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
          <a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
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
            <span className="text-slate-500">maintenance nightmare.</span>
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

const InteractivePreview = () => {
  const allProviders = ['Claude', 'Cursor', 'Codex', 'Gemini'] as const;
  const allRoles = ['Architect', 'Frontend', 'Backend', 'DevOps', 'Fullstack'] as const;

  const [config, setConfig] = useState({
    projectName: 'My Awesome Project',
    description: 'A modern full-stack application',
    ide: 'Cursor',
    language: 'TypeScript',
    version: '5.4',
    framework: 'Next.js',
    docker: true,
    database: 'PostgreSQL',
    dbVersion: '16',
    providers: ['Claude', 'Cursor', 'Gemini'] as string[],
    roles: ['Architect', 'Frontend', 'Backend'] as string[]
  });

  const [selectedFile, setSelectedFile] = useState('AGENTS.md');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ '.claude': true, '.cursor': true });

  const toggleProvider = (p: string) => {
    setConfig(prev => ({
      ...prev,
      providers: prev.providers.includes(p) ? prev.providers.filter(x => x !== p) : [...prev.providers, p]
    }));
  };

  const toggleRole = (r: string) => {
    setConfig(prev => ({
      ...prev,
      roles: prev.roles.includes(r) ? prev.roles.filter(x => x !== r) : [...prev.roles, r]
    }));
  };

  const toggleFolder = (name: string) => {
    setExpandedFolders(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const ideFolderMap: Record<string, { name: string; children: { name: string; type: 'file' }[] }> = {
    'Cursor': {
      name: '.cursor',
      children: [
        { name: 'README.md', type: 'file' },
        { name: 'rules/00-project-core.mdc', type: 'file' }
      ]
    },
    'VS Code': {
      name: '.vscode',
      children: [
        { name: 'settings.json', type: 'file' },
        { name: 'extensions.json', type: 'file' }
      ]
    },
    'PhpStorm': {
      name: '.idea',
      children: [
        { name: 'workspace.xml', type: 'file' },
        { name: 'misc.xml', type: 'file' }
      ]
    },
    'Zed': {
      name: '.zed',
      children: [
        { name: 'settings.json', type: 'file' }
      ]
    }
  };

  const ideFolder = ideFolderMap[config.ide];

  const fileTree = [
    { name: 'AGENTS.md', type: 'file' as const },
    { name: 'CLAUDE.md', type: 'file' as const },
    { name: '.agentup.json', type: 'file' as const },
    {
      name: '.claude',
      type: 'folder' as const,
      children: [
        { name: 'settings.json', type: 'file' as const },
        { name: 'rules/project-core.md', type: 'file' as const },
        { name: 'rules/verification.md', type: 'file' as const }
      ]
    },
    ...(ideFolder ? [{
      name: ideFolder.name,
      type: 'folder' as const,
      children: ideFolder.children.map(c => ({ ...c, type: 'file' as const }))
    }] : [])
  ];

  const allFileNames = fileTree.flatMap(item =>
    item.type === 'folder' ? (item.children?.map(c => c.name) || []) : [item.name]
  );

  useEffect(() => {
    if (!allFileNames.includes(selectedFile)) {
      setSelectedFile('AGENTS.md');
    }
  }, [config.ide]);

  const getFileContent = (filename: string) => {
    const dbOrmMap: Record<string, string> = {
      'PostgreSQL': 'Prisma / pg',
      'MySQL': 'Prisma / mysql2',
      'SQLite': 'better-sqlite3',
      'MongoDB': 'Mongoose'
    };
    switch (filename) {
      case 'AGENTS.md':
        return `# ${config.projectName}

## Description
${config.description}

## Tech Stack
- Language: ${config.language} v${config.version}
- Framework: ${config.framework}
- Database: ${config.database} v${config.dbVersion}
- ORM/Driver: ${dbOrmMap[config.database] || 'N/A'}${config.docker ? '\n- Container: Docker + docker-compose' : ''}

## Development Commands
- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Lint: npm run lint

## AI Providers
${config.providers.map(p => `- ${p}`).join('\n')}

## Agent Roles
${config.roles.map(r => `- ${r}`).join('\n')}

## Conventions
- Use ${config.language} strict mode
- Follow ${config.framework} best practices
- ${config.docker ? 'All services run in Docker containers' : 'Run services locally'}`;
      case 'CLAUDE.md':
        return `# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project: ${config.projectName}
${config.description}

## Commands
- \`npm run dev\` - Start dev server
- \`npm run build\` - Production build
- \`npm run lint\` - Type check

## Stack
- ${config.language} v${config.version} + ${config.framework}
- ${config.database} v${config.dbVersion}
- IDE: ${config.ide}${config.docker ? '\n- Docker enabled' : ''}

## Architecture
Refer to .claude/rules/ for detailed instructions.`;
      case '.agentup.json':
        return JSON.stringify({
          name: config.projectName,
          description: config.description,
          stack: {
            language: { name: config.language, version: config.version },
            framework: config.framework,
            database: { name: config.database, version: config.dbVersion },
            docker: config.docker
          },
          ide: config.ide,
          providers: config.providers,
          roles: config.roles
        }, null, 2);
      case 'settings.json':
        return JSON.stringify({
          permissions: {
            allow: ["Bash(npm run *)", "Read", "Write", "Edit", "Glob", "Grep"],
            deny: ["Bash(rm -rf *)"]
          },
          model: "claude-sonnet-4-20250514"
        }, null, 2);
      case 'rules/project-core.md':
        return `# Project Core Rules

## ${config.projectName}
- Language: ${config.language} v${config.version}
- Framework: ${config.framework}
- Database: ${config.database}
${config.docker ? '- All services containerized via Docker\n- Use docker-compose for local dev' : ''}

## Code Style
- Use strict ${config.language} configuration
- Prefer functional components and hooks
- Follow ${config.framework} conventions`;
      case 'rules/verification.md':
        return `# Verification Rules

Before completing any task:
1. Run \`npm run lint\` to verify types
2. Run \`npm run build\` to ensure no build errors
3. Test affected functionality manually${config.docker ? '\n4. Verify Docker containers are healthy' : ''}`;
      case 'rules/00-project-core.mdc':
        return `---
description: Core project rules for ${config.projectName}
globs: ["**/*.${config.language === 'TypeScript' ? 'ts,tsx' : 'js,jsx'}"]
---

# ${config.projectName}

Stack: ${config.language} v${config.version} + ${config.framework}
Database: ${config.database} v${config.dbVersion}${config.docker ? '\nDocker: enabled' : ''}

## Guidelines
- Follow ${config.framework} project structure
- Use ${config.language} strict mode
- Write clean, maintainable code`;
      case 'extensions.json':
        return JSON.stringify({
          recommendations: [
            "dbaeumer.vscode-eslint",
            "esbenp.prettier-vscode",
            ...(config.language === 'TypeScript' ? ["ms-vscode.vscode-typescript-next"] : []),
            ...(config.docker ? ["ms-azuretools.vscode-docker"] : [])
          ]
        }, null, 2);
      case 'workspace.xml':
        return `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ProjectType">
    <option name="id" value="Web" />
  </component>
  <!-- ${config.projectName} -->
  <!-- ${config.language} v${config.version} + ${config.framework} -->
</project>`;
      case 'misc.xml':
        return `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="JavaScriptSettings">
    <option name="languageLevel" value="${config.language === 'TypeScript' ? 'TypeScript' : 'ES6'}" />
  </component>
</project>`;
      default:
        if (filename === 'settings.json' && config.ide !== 'Cursor') {
          const ideSettings: Record<string, object> = {
            'VS Code': {
              "editor.formatOnSave": true,
              "editor.defaultFormatter": "esbenp.prettier-vscode",
              "typescript.tsdk": "node_modules/typescript/lib",
              ...(config.docker ? { "docker.defaultRegistryPath": "" } : {})
            },
            'Zed': {
              "language_overrides": {
                [config.language]: { "formatter": "prettier" }
              },
              "lsp": { "typescript-language-server": { "enabled": true } }
            }
          };
          return JSON.stringify(ideSettings[config.ide] || {}, null, 2);
        }
        return `// Generated by Agent Up\n// Configuration for ${config.projectName}`;
    }
  };

  return (
    <section id="demo" className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Configuration Studio</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Customize your project settings and watch Agent Up generate context files in real time.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel: Form */}
          <div className="lg:col-span-4 glass rounded-2xl p-6 overflow-y-auto max-h-[780px]">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Layout className="w-4 h-4 text-cyan-400" /> Project Config
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">PROJECT NAME</label>
                <input
                  type="text"
                  value={config.projectName}
                  onChange={(e) => setConfig({...config, projectName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">DESCRIPTION</label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">PRIMARY IDE</label>
                <select
                  value={config.ide}
                  onChange={(e) => setConfig({...config, ide: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option>Cursor</option>
                  <option>VS Code</option>
                  <option>PhpStorm</option>
                  <option>Zed</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">LANGUAGE</label>
                  <input
                    type="text"
                    value={config.language}
                    onChange={(e) => setConfig({...config, language: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">VERSION</label>
                  <input
                    type="text"
                    value={config.version}
                    onChange={(e) => setConfig({...config, version: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">FRAMEWORK</label>
                  <input
                    type="text"
                    value={config.framework}
                    onChange={(e) => setConfig({...config, framework: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">DATABASE</label>
                  <select
                    value={config.database}
                    onChange={(e) => setConfig({...config, database: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option>PostgreSQL</option>
                    <option>MySQL</option>
                    <option>SQLite</option>
                    <option>MongoDB</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Box className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Docker</span>
                </div>
                <button
                  onClick={() => setConfig({...config, docker: !config.docker})}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative",
                    config.docker ? "bg-emerald-500" : "bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                    config.docker ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">AI PROVIDERS</label>
                <div className="flex flex-wrap gap-2">
                  {allProviders.map(p => (
                    <button
                      key={p}
                      onClick={() => toggleProvider(p)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        config.providers.includes(p)
                          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                          : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">AGENT ROLES</label>
                <div className="flex flex-wrap gap-2">
                  {allRoles.map(r => (
                    <button
                      key={r}
                      onClick={() => toggleRole(r)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        config.roles.includes(r)
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: File Tree & Preview */}
          <div className="lg:col-span-8 glass rounded-2xl overflow-hidden flex flex-col max-h-[780px]">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="ml-4 text-xs font-mono text-slate-500">agent-up ~ {selectedFile}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* File Tree Sidebar */}
              <div className="w-56 border-r border-white/10 bg-black/20 p-3 overflow-y-auto shrink-0">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3 px-2">Explorer</p>
                <div className="space-y-0.5">
                  {fileTree.map((item, i) => (
                    <div key={i}>
                      {item.type === 'folder' ? (
                        <div>
                          <button
                            onClick={() => toggleFolder(item.name)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-slate-400 text-sm hover:bg-white/5 rounded-md transition-colors"
                          >
                            <ChevronRight className={cn("w-3 h-3 transition-transform", expandedFolders[item.name] && "rotate-90")} />
                            <Folder className="w-4 h-4 text-cyan-400/70" />
                            <span>{item.name}</span>
                          </button>
                          <AnimatePresence>
                            {expandedFolders[item.name] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-5 space-y-0.5 mt-0.5">
                                  {item.children?.map((child, ci) => (
                                    <button
                                      key={ci}
                                      onClick={() => setSelectedFile(child.name)}
                                      className={cn(
                                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                                        selectedFile === child.name ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                      )}
                                    >
                                      <FileCode className="w-3.5 h-3.5" /> <span className="truncate">{child.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedFile(item.name)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                            selectedFile === item.name ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                          )}
                        >
                          <FileCode className="w-3.5 h-3.5" /> {item.name}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Preview */}
              <div className="flex-1 bg-black/40 overflow-y-auto">
                <div className="flex items-center gap-2 px-6 py-2 border-b border-white/10 bg-white/[0.02]">
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-mono text-slate-400">{selectedFile}</span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedFile + JSON.stringify(config)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {getFileContent(selectedFile)}
                      </pre>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      title: "Multi-provider support",
      desc: "Native support for Claude Code, Cursor, Codex, Gemini, and Antigravity ecosystems.",
      icon: Layers,
      color: "text-blue-400"
    },
    {
      title: "IDE-aware scaffolding",
      desc: "Generates IDE-specific rules and settings for Cursor, VS Code, Zed, and JetBrains.",
      icon: Monitor,
      color: "text-cyan-400"
    },
    {
      title: "Docker-aware config",
      desc: "Automatically includes container context and deployment rules if Docker is detected.",
      icon: Box,
      color: "text-emerald-400"
    },
    {
      title: "Database context",
      desc: "Injects schema awareness and query optimization rules based on your DB engine.",
      icon: Database,
      color: "text-orange-400"
    },
    {
      title: "Role-based setup",
      desc: "Define specialized agents for frontend, backend, or architecture roles automatically.",
      icon: Users,
      color: "text-purple-400"
    },
    {
      title: "Consistent onboarding",
      desc: "Ensure every developer on your team has the same AI context from day one.",
      icon: CheckCircle2,
      color: "text-pink-400"
    }
  ];

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for modern workflows.</h2>
          <p className="text-slate-400">Everything you need to make AI agents understand your project perfectly.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all group">
              <f.icon className={cn("w-10 h-10 mb-6 transition-transform group-hover:scale-110", f.color)} />
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Run the CLI",
      desc: "Execute the init command in your project root.",
      code: "agentup-cli init"
    },
    {
      step: "02",
      title: "Answer Questions",
      desc: "Tell Agent Up about your stack, IDE, and AI providers.",
      code: "Interactive Prompt..."
    },
    {
      step: "03",
      title: "Generate Files",
      desc: "Agent Up scaffolds all required context and rule files.",
      code: "Creating .cursor/rules..."
    },
    {
      step: "04",
      title: "Start Coding",
      desc: "Your AI agents now have full project awareness.",
      code: "Happy coding!"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple workflow.</h2>
          <p className="text-slate-400">From zero to AI-ready in less than 60 seconds.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="text-6xl font-black text-white/5 absolute -top-8 -left-2 select-none">{s.step}</div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 mb-6">{s.desc}</p>
                <div className="p-3 bg-black/40 rounded-lg border border-white/10 font-mono text-xs text-cyan-400">
                  {s.code}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 -right-4 translate-x-1/2">
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need to run npm install every time?",
      a: "No, you only need to run Agent Up once to scaffold the files. You can run it again if your project configuration changes significantly."
    },
    {
      q: "Does Agent Up support Cursor and Claude?",
      a: "Yes! It generates specific rules for both. For Cursor, it creates .cursor/rules (.mdc files), and for Claude, it creates .claude/rules (.md files)."
    },
    {
      q: "Can I use it in existing projects?",
      a: "Absolutely. Agent Up will detect your existing stack and generate the appropriate context files without overwriting your source code."
    },
    {
      q: "Does it support Docker-based projects?",
      a: "Yes, it includes a specific toggle for Docker. If enabled, it adds container-specific instructions so AI agents understand your dev environment."
    },
    {
      q: "Is it free to use?",
      a: "Agent Up is an open-source CLI tool. You can use it for free in any project."
    }
  ];

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white">{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", openIndex === i && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/5 bg-black/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to level up your <br />AI development?</h2>
          <p className="text-slate-400">Join thousands of developers automating their agent context.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="https://www.npmjs.com/package/agentup-cli" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all text-center">
            Get Started Now
          </a>
          <a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-center">
            Star on GitHub
          </a>
          <a href="https://buymeacoffee.com/bjsuizgoxc" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold rounded-xl hover:bg-yellow-500/20 transition-all text-center flex items-center justify-center gap-2">
            <Coffee className="w-5 h-5" /> Buy Me a Coffee
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/5">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400" />
            <span className="text-xl font-bold text-white">Agent Up</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Automating the bridge between your code and AI agents. Built for the next generation of developers.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">CLI Reference</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            <li><a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <p>© 2026 Agent Up. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
          <a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <InteractivePreview />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
