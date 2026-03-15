import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout,
  Box,
  ChevronRight,
  FileCode,
  Folder,
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

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
    frameworks: ['.NET 8', '.NET 7', 'Blazor']
  },
  Swift: {
    versions: ['5.10', '5.9', '5.8'],
    frameworks: ['Vapor', 'Hummingbird']
  }
};

const ALL_PROVIDERS = ['Claude', 'Cursor', 'Codex', 'Gemini'] as const;
const ALL_ROLES = ['Architect', 'Frontend', 'Backend', 'DevOps', 'Fullstack'] as const;

interface Config {
  projectName: string;
  description: string;
  ide: string;
  language: string;
  version: string;
  framework: string;
  docker: boolean;
  database: string;
  dbVersion: string;
  providers: string[];
  roles: string[];
}

const IDE_FOLDER_MAP: Record<string, { name: string; children: { name: string; type: 'file' }[] }> = {
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

function getFileContent(filename: string, config: Config): string {
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
}

export const InteractivePreview = () => {
  const [config, setConfig] = useState<Config>({
    projectName: 'My Awesome Project',
    description: 'A modern full-stack application',
    ide: 'Cursor',
    language: 'TypeScript',
    version: '5.4',
    framework: 'Next.js',
    docker: true,
    database: 'PostgreSQL',
    dbVersion: '16',
    providers: ['Claude', 'Cursor', 'Gemini'],
    roles: ['Architect', 'Frontend', 'Backend']
  });

  const [selectedFile, setSelectedFile] = useState('AGENTS.md');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ '.claude': true, '.cursor': true });
  const [aiContent, setAiContent] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isFirstRender = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAIContent = useCallback(async (file: string, cfg: Config) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAiLoading(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert at generating AI coding agent configuration files. Generate the content for a "${file}" file based on the project configuration provided. Output ONLY the file content, no explanations or markdown code blocks. Make it professional, detailed, and production-ready.`
            },
            {
              role: 'user',
              content: `Generate the "${file}" file for this project:
- Project: ${cfg.projectName}
- Description: ${cfg.description}
- Language: ${cfg.language} v${cfg.version}
- Framework: ${cfg.framework}
- Database: ${cfg.database} v${cfg.dbVersion}
- Docker: ${cfg.docker ? 'enabled' : 'disabled'}
- IDE: ${cfg.ide}
- AI Providers: ${cfg.providers.join(', ')}
- Agent Roles: ${cfg.roles.join(', ')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      setAiContent(prev => ({ ...prev, [file]: content }));
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
    } finally {
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!process.env.GROQ_API_KEY) return;

    setAiContent(prev => {
      const { [selectedFile]: _, ...rest } = prev;
      return rest;
    });

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const delay = isFirstRender.current ? 0 : 800;
    isFirstRender.current = false;

    debounceRef.current = setTimeout(() => {
      fetchAIContent(selectedFile, config);
    }, delay);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [selectedFile, config, fetchAIContent]);

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

  const ideFolder = IDE_FOLDER_MAP[config.ide];

  const fileTree = useMemo(() => [
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
  ], [ideFolder]);

  const allFileNames = useMemo(() =>
    fileTree.flatMap(item =>
      item.type === 'folder' ? (item.children?.map(c => c.name) || []) : [item.name]
    ), [fileTree]);

  useEffect(() => {
    if (!allFileNames.includes(selectedFile)) {
      setSelectedFile('AGENTS.md');
    }
  }, [allFileNames, selectedFile]);

  const displayKey = useRef(0);
  const prevFile = useRef(selectedFile);
  if (prevFile.current !== selectedFile) {
    displayKey.current += 1;
    prevFile.current = selectedFile;
  }

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
                  onChange={(e) => setConfig(prev => ({ ...prev, projectName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="cfg-desc" className="block text-xs font-medium text-slate-400 mb-2">DESCRIPTION</label>
                <textarea
                  id="cfg-desc"
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label htmlFor="cfg-ide" className="block text-xs font-medium text-slate-400 mb-2">PRIMARY IDE</label>
                <select
                  id="cfg-ide"
                  value={config.ide}
                  onChange={(e) => setConfig(prev => ({ ...prev, ide: e.target.value }))}
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
                    onChange={(e) => setConfig(prev => ({ ...prev, version: e.target.value }))}
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
                    onChange={(e) => setConfig(prev => ({ ...prev, framework: e.target.value }))}
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
                    onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
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
                  onClick={() => setConfig(prev => ({ ...prev, docker: !prev.docker }))}
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
                  {ALL_PROVIDERS.map(p => (
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
                  {ALL_ROLES.map(r => (
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
                  {fileTree.map(item => (
                    <div key={item.name}>
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
                                  {item.children?.map(child => (
                                    <button
                                      key={child.name}
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
                    onClick={() => fetchAIContent(selectedFile, config)}
                    disabled={aiLoading}
                    aria-label="Generate file content with AI"
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
                      key={displayKey.current}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {aiContent[selectedFile] || getFileContent(selectedFile, config)}
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
