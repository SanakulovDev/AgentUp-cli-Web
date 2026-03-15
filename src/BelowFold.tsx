import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout,
  Database,
  Box,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  FileCode,
  Folder,
  Monitor,
  Layers,
  Users,
  Zap,
  Coffee,
  Github,
  Sparkles,
  Code,
  Globe,
  Cpu,
  Shield,
  Rocket,
  Loader2
} from 'lucide-react';
import { cn } from './lib/utils';

const LANGUAGE_STACK: Record<string, { versions: string[]; frameworks: string[] }> = {
  TypeScript: {
    versions: ['5.4', '5.3', '5.2', '5.0', '4.9'],
    frameworks: ['Next.js', 'Nuxt', 'Remix', 'SvelteKit', 'Astro', 'NestJS', 'Express']
  },
  JavaScript: {
    versions: ['ES2024', 'ES2023', 'ES2022'],
    frameworks: ['Next.js', 'Nuxt', 'Express', 'Fastify', 'Remix']
  },
  Python: {
    versions: ['3.12', '3.11', '3.10', '3.9'],
    frameworks: ['FastAPI', 'Django', 'Flask', 'Starlette']
  },
  Go: {
    versions: ['1.22', '1.21', '1.20'],
    frameworks: ['Gin', 'Echo', 'Fiber', 'Chi']
  },
  Rust: {
    versions: ['1.77', '1.76', '1.75'],
    frameworks: ['Axum', 'Actix-web', 'Rocket', 'Warp']
  },
  Java: {
    versions: ['21', '17', '11'],
    frameworks: ['Spring Boot', 'Quarkus', 'Micronaut']
  },
  Kotlin: {
    versions: ['2.0', '1.9', '1.8'],
    frameworks: ['Spring Boot', 'Ktor']
  },
  PHP: {
    versions: ['8.3', '8.2', '8.1'],
    frameworks: ['Laravel', 'Symfony', 'Slim']
  },
  Ruby: {
    versions: ['3.3', '3.2', '3.1'],
    frameworks: ['Rails', 'Sinatra', 'Hanami']
  },
  'C#': {
    versions: ['12', '11', '10'],
    frameworks: ['ASP.NET Core', 'Blazor', 'Minimal API']
  },
  Swift: {
    versions: ['5.10', '5.9'],
    frameworks: ['Vapor', 'Hummingbird']
  }
};

export const InteractivePreview = () => {
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
  const [aiContent, setAiContent] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);

  const generateWithAI = useCallback(async () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return;

    setAiLoading(true);
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
              content: `You are an expert at generating AI coding agent configuration files. Generate the content for a "${selectedFile}" file based on the project configuration provided. Output ONLY the file content, no explanations or markdown code blocks. Make it professional, detailed, and production-ready.`
            },
            {
              role: 'user',
              content: `Generate the "${selectedFile}" file for this project:
- Project: ${config.projectName}
- Description: ${config.description}
- Language: ${config.language} v${config.version}
- Framework: ${config.framework}
- Database: ${config.database} v${config.dbVersion}
- Docker: ${config.docker ? 'enabled' : 'disabled'}
- IDE: ${config.ide}
- AI Providers: ${config.providers.join(', ')}
- Agent Roles: ${config.roles.join(', ')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      setAiContent(prev => ({ ...prev, [selectedFile]: content }));
    } catch {
      // silently fail, user can retry
    } finally {
      setAiLoading(false);
    }
  }, [selectedFile, config]);

  // Auto-generate with debounce when config or selectedFile changes
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    if (!process.env.GROQ_API_KEY) return;
    // Clear any existing AI content for this file so it regenerates
    setAiContent(prev => {
      const next = { ...prev };
      delete next[selectedFile];
      return next;
    });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      generateWithAI();
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedFile, config]);

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

  const handleLanguageChange = (lang: string) => {
    const stack = LANGUAGE_STACK[lang];
    setConfig(prev => ({
      ...prev,
      language: lang,
      version: stack.versions[0],
      framework: stack.frameworks[0]
    }));
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
                <label htmlFor="cfg-name" className="block text-xs font-medium text-slate-400 mb-2">PROJECT NAME</label>
                <input
                  id="cfg-name"
                  type="text"
                  value={config.projectName}
                  onChange={(e) => setConfig({...config, projectName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="cfg-desc" className="block text-xs font-medium text-slate-400 mb-2">DESCRIPTION</label>
                <textarea
                  id="cfg-desc"
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label htmlFor="cfg-ide" className="block text-xs font-medium text-slate-400 mb-2">PRIMARY IDE</label>
                <select
                  id="cfg-ide"
                  value={config.ide}
                  onChange={(e) => setConfig({...config, ide: e.target.value})}
                  className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option>Cursor</option>
                  <option>VS Code</option>
                  <option>PhpStorm</option>
                  <option>Zed</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cfg-lang" className="block text-xs font-medium text-slate-400 mb-2">LANGUAGE</label>
                  <select
                    id="cfg-lang"
                    value={config.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {Object.keys(LANGUAGE_STACK).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="cfg-ver" className="block text-xs font-medium text-slate-400 mb-2">VERSION</label>
                  <select
                    id="cfg-ver"
                    value={config.version}
                    onChange={(e) => setConfig({...config, version: e.target.value})}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {LANGUAGE_STACK[config.language]?.versions.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cfg-fw" className="block text-xs font-medium text-slate-400 mb-2">FRAMEWORK</label>
                  <select
                    id="cfg-fw"
                    value={config.framework}
                    onChange={(e) => setConfig({...config, framework: e.target.value})}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {LANGUAGE_STACK[config.language]?.frameworks.map(fw => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="cfg-db" className="block text-xs font-medium text-slate-400 mb-2">DATABASE</label>
                  <select
                    id="cfg-db"
                    value={config.database}
                    onChange={(e) => setConfig({...config, database: e.target.value})}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
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
                  <span id="docker-label" className="text-sm font-medium text-white">Docker</span>
                </div>
                <button
                  role="switch"
                  aria-checked={config.docker}
                  aria-labelledby="docker-label"
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

              <fieldset>
                <legend className="block text-xs font-medium text-slate-400 mb-2">AI PROVIDERS</legend>
                <div className="flex flex-wrap gap-2" role="group" aria-label="AI provider selection">
                  {allProviders.map(p => (
                    <button
                      key={p}
                      aria-pressed={config.providers.includes(p)}
                      onClick={() => toggleProvider(p)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        config.providers.includes(p)
                          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-300"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="block text-xs font-medium text-slate-400 mb-2">AGENT ROLES</legend>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Agent role selection">
                  {allRoles.map(r => (
                    <button
                      key={r}
                      aria-pressed={config.roles.includes(r)}
                      onClick={() => toggleRole(r)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        config.roles.includes(r)
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-300"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </fieldset>
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
                <span className="ml-4 text-xs font-mono text-slate-400">agent-up ~ {selectedFile}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* File Tree Sidebar */}
              <div className="w-56 border-r border-white/10 bg-black/20 p-3 overflow-y-auto shrink-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Explorer</p>
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
                                        selectedFile === child.name ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
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
                            selectedFile === item.name ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
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
                <div className="flex items-center justify-between px-6 py-2 border-b border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-mono text-slate-400">{selectedFile}</span>
                    {aiContent[selectedFile] && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">AI</span>
                    )}
                  </div>
                  <button
                    onClick={generateWithAI}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {aiLoading ? 'Generating...' : 'Generate with AI'}
                  </button>
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
                        {aiContent[selectedFile] || getFileContent(selectedFile)}
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

export const Features = () => {
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

export const HowItWorks = () => {
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
              <div className="text-6xl font-black text-white/10 absolute -top-8 -left-2 select-none">{s.step}</div>
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

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is Agent Up the same as AgentUp, agent up, or agentupcli?",
      a: "Yes. Agent Up, AgentUp, agent up, and agentupcli all refer to the same CLI package published as agentup-cli on npm."
    },
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
    },
    {
      q: "How do I create a CLAUDE.md file for my project?",
      a: "Run npx agentup-cli@latest init in your project root. Agent Up will analyze your tech stack and automatically generate a comprehensive CLAUDE.md file with project context, coding conventions, available commands, and architecture guidelines tailored to your codebase."
    },
    {
      q: "What is the difference between CLAUDE.md and AGENTS.md?",
      a: "CLAUDE.md is specifically designed for Claude Code (Anthropic's CLI agent) and contains project-specific instructions. AGENTS.md is a universal AI agent context file that works across multiple providers — it defines team roles, tech stack details, and development conventions that any AI coding assistant can reference."
    },
    {
      q: "How do I set up .cursorrules for Cursor IDE?",
      a: "Agent Up generates both the legacy .cursorrules file and the newer .cursor/rules/*.mdc format automatically. Just run agentup-cli init, select Cursor as your IDE, and it will create glob-scoped rule files with your project's coding standards, framework conventions, and preferred patterns."
    },
    {
      q: "Does Agent Up work with Next.js, React, Vue, or Angular?",
      a: "Yes, Agent Up automatically detects your frontend framework from package.json and generates framework-specific rules. For Next.js it includes App Router conventions, for React it adds component patterns, and for Vue/Angular it includes their respective best practices in all generated files."
    },
    {
      q: "Can I use Agent Up with GitHub Copilot or Codeium?",
      a: "While Agent Up primarily generates files for Claude Code and Cursor, the AGENTS.md and CLAUDE.md files provide universal project context that any AI coding assistant — including GitHub Copilot, Codeium, Windsurf, and others — can use to understand your project better."
    },
    {
      q: "How do I configure AI agent roles in Agent Up?",
      a: "During the interactive setup, you can select predefined roles like Architect, Frontend, Backend, DevOps, and Fullstack. Each role gets specific instructions in the generated files, defining responsibilities, code review focus areas, and technology-specific guidelines."
    },
    {
      q: "Does Agent Up support Python, Go, or Rust projects?",
      a: "Yes, Agent Up is language-agnostic. It detects your project's primary language and generates appropriate context files with language-specific linting rules, type checking configuration, package management commands, and framework conventions for Python (Django, FastAPI), Go, Rust, and more."
    },
    {
      q: "How do I update generated files when my project changes?",
      a: "Simply run agentup-cli init again. Agent Up reads your .agentup.json configuration and regenerates all context files based on your current project state. You can also manually edit the generated files — Agent Up won't overwrite your customizations unless you explicitly regenerate."
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
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", openIndex === i && "rotate-180")} />
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

export const WhatGetsGenerated = () => {
  const files = [
    {
      name: 'CLAUDE.md',
      icon: Sparkles,
      color: 'text-orange-400',
      bg: 'from-orange-500/20 to-orange-500/5',
      desc: 'The CLAUDE.md file provides project context, coding conventions, and architecture guidelines to Claude Code. It tells Claude about your tech stack, directory structure, available commands, and code style preferences so every response is project-aware.'
    },
    {
      name: 'AGENTS.md',
      icon: Users,
      color: 'text-blue-400',
      bg: 'from-blue-500/20 to-blue-500/5',
      desc: 'AGENTS.md defines role-based AI agent instructions. It specifies agent responsibilities (frontend, backend, DevOps, architect), team conventions, and project-specific guidelines that any AI coding assistant can reference.'
    },
    {
      name: '.cursorrules',
      icon: Code,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/20 to-cyan-500/5',
      desc: 'The .cursorrules file configures Cursor IDE AI behavior. It sets coding standards, preferred patterns, framework-specific conventions, and project rules that Cursor uses to generate contextually accurate code suggestions.'
    },
    {
      name: '.cursor/rules/*.mdc',
      icon: FileCode,
      color: 'text-violet-400',
      bg: 'from-violet-500/20 to-violet-500/5',
      desc: 'Cursor rule files (.mdc format) provide granular, glob-scoped instructions. Each rule targets specific file patterns and contains project-specific coding standards, making AI suggestions precise for different parts of your codebase.'
    },
    {
      name: '.claude/rules/*.md',
      icon: Shield,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/20 to-emerald-500/5',
      desc: 'Claude Code rule files define verification steps, code review checklists, and automated guidelines. They ensure Claude follows your team\'s quality standards, testing requirements, and deployment procedures.'
    },
    {
      name: '.agentup.json',
      icon: Cpu,
      color: 'text-pink-400',
      bg: 'from-pink-500/20 to-pink-500/5',
      desc: 'The Agent Up configuration file stores your project metadata, stack details, AI provider preferences, and agent role definitions. Run agentup-cli again to regenerate all context files from this single source of truth.'
    }
  ];

  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Agent Up generates for you</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">One command creates all the AI agent configuration files your project needs. Every file is tailored to your tech stack, IDE, and team preferences.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((f, i) => (
            <div key={i} className={cn("p-6 rounded-2xl border border-white/10 bg-gradient-to-br", f.bg)}>
              <div className="flex items-center gap-3 mb-4">
                <f.icon className={cn("w-6 h-6", f.color)} />
                <h3 className="text-lg font-bold text-white font-mono">{f.name}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SupportedTools = () => {
  const categories = [
    {
      title: 'AI Coding Agents',
      icon: Sparkles,
      tools: [
        { name: 'Claude Code', desc: 'Anthropic\'s CLI agent for autonomous coding with CLAUDE.md and .claude/rules support' },
        { name: 'Cursor AI', desc: 'AI-first code editor with .cursorrules and .cursor/rules integration' },
        { name: 'OpenAI Codex', desc: 'OpenAI\'s code generation agent with AGENTS.md context support' },
        { name: 'Google Gemini', desc: 'Google\'s AI model with multi-modal code understanding capabilities' },
        { name: 'GitHub Copilot', desc: 'AI pair programmer that benefits from structured project context files' },
        { name: 'Codeium / Windsurf', desc: 'Free AI code completion engine with rules file support' }
      ]
    },
    {
      title: 'IDEs & Editors',
      icon: Monitor,
      tools: [
        { name: 'Cursor', desc: 'AI-native code editor with built-in .cursorrules and .mdc rule support' },
        { name: 'VS Code', desc: 'Microsoft\'s editor with .vscode/settings.json and extensions configuration' },
        { name: 'JetBrains (PhpStorm, WebStorm, IntelliJ)', desc: 'Full .idea workspace and project configuration generation' },
        { name: 'Zed', desc: 'High-performance editor with .zed/settings.json AI configuration' },
        { name: 'Neovim', desc: 'Terminal-based editor with project-level configuration support' }
      ]
    },
    {
      title: 'Frameworks & Languages',
      icon: Globe,
      tools: [
        { name: 'Next.js / React / Vue / Angular / Svelte', desc: 'Frontend framework detection with component and routing conventions' },
        { name: 'Node.js / Express / Fastify / NestJS', desc: 'Backend framework rules including API patterns and middleware setup' },
        { name: 'TypeScript / JavaScript / Python / Go / Rust', desc: 'Language-specific type checking, linting, and code style rules' },
        { name: 'Django / Flask / FastAPI / Laravel / Rails', desc: 'Full-stack framework conventions with ORM and migration patterns' },
        { name: 'Tailwind CSS / CSS Modules / Styled Components', desc: 'Styling framework preferences and design system conventions' }
      ]
    },
    {
      title: 'DevOps & Databases',
      icon: Database,
      tools: [
        { name: 'Docker / Docker Compose', desc: 'Container configuration with Dockerfile and compose service context' },
        { name: 'PostgreSQL / MySQL / MongoDB / SQLite', desc: 'Database-specific schema, migration, and query optimization rules' },
        { name: 'Prisma / Drizzle / TypeORM / Sequelize', desc: 'ORM configuration with model generation and migration conventions' },
        { name: 'GitHub Actions / GitLab CI / Jenkins', desc: 'CI/CD pipeline context for AI-assisted workflow automation' },
        { name: 'Vercel / Netlify / AWS / Firebase', desc: 'Deployment platform conventions and environment configuration' }
      ]
    }
  ];

  return (
    <section className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Works with your entire stack</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Agent Up detects your project's technology stack and generates optimized AI context files for every tool you use — from IDE to deployment platform.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center gap-3 mb-6">
                <cat.icon className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">{cat.title}</h3>
              </div>
              <ul className="space-y-4">
                {cat.tools.map((tool, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-white">{tool.name}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{tool.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const UseCases = () => {
  const cases = [
    {
      icon: Rocket,
      title: 'New project setup',
      desc: 'Starting a new project? Run agentup-cli init to instantly scaffold CLAUDE.md, AGENTS.md, and IDE-specific rules. Skip the manual file creation and get AI agents productive from the first commit.',
      code: 'npx agentup-cli@latest init'
    },
    {
      icon: Users,
      title: 'Team onboarding',
      desc: 'Ensure every developer on your team works with the same AI context. Agent Up generates standardized configuration files that keep Claude Code, Cursor, and Codex aligned with your project conventions.',
      code: 'git add CLAUDE.md AGENTS.md .cursor/'
    },
    {
      icon: Code,
      title: 'Multi-agent workflows',
      desc: 'Define specialized AI agent roles — architect, frontend, backend, DevOps — each with their own context and rules. Agent Up creates role-specific instructions so each agent focuses on what it does best.',
      code: 'roles: [Architect, Frontend, Backend]'
    },
    {
      icon: Globe,
      title: 'Open source projects',
      desc: 'Make your open source project AI-contributor friendly. Generated CLAUDE.md and AGENTS.md files help AI coding agents understand your codebase structure, contribution guidelines, and coding standards instantly.',
      code: 'cat CLAUDE.md  # Full project context'
    },
    {
      icon: Cpu,
      title: 'Monorepo configuration',
      desc: 'Working with a monorepo? Agent Up detects multiple packages and generates separate context rules for each workspace, ensuring AI agents understand package boundaries and shared dependencies.',
      code: 'agentup-cli init --workspace packages/*'
    },
    {
      icon: Shield,
      title: 'CI/CD integration',
      desc: 'Integrate Agent Up into your CI pipeline to keep AI context files up-to-date. Automatically regenerate CLAUDE.md and .cursorrules when your package.json, tsconfig, or Docker configuration changes.',
      code: 'agentup-cli generate --ci'
    }
  ];

  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for every developer workflow</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Whether you're a solo developer or part of a large team, Agent Up adapts to how you work with AI coding agents.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all group">
              <c.icon className="w-8 h-8 text-cyan-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="text-lg font-bold text-white mb-3">{c.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{c.desc}</p>
              <div className="p-2.5 bg-black/40 rounded-lg border border-white/10 font-mono text-xs text-emerald-400">
                $ {c.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
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
          <p className="text-sm text-slate-400 leading-relaxed">
            Automating the bridge between your code and AI agents. Built for the next generation of developers.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">Product</h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="https://www.npmjs.com/package/agentup-cli" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">CLI Reference</a></li>
            <li><a href="#demo" className="hover:text-white transition-colors">Integrations</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">Resources</h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Community</a></li>
            <li><a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">Support</h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="https://buymeacoffee.com/bjsuizgoxc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Buy Me a Coffee</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <p>&copy; 2026 Agent Up. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="https://github.com/SanakulovDev/agentup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://buymeacoffee.com/bjsuizgoxc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </div>
  </footer>
);
