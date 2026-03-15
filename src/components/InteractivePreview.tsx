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
    versions: ['8.4', '8.3', '8.2', '8.1', '8.0', '7.4'],
    frameworks: ['Laravel', 'Symfony', 'Yii2', 'Slim', 'CodeIgniter', 'CakePHP']
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

const DATABASE_VERSIONS: Record<string, string[]> = {
  PostgreSQL: ['17', '16', '15', '14', '13', '12'],
  MySQL: ['9.0', '8.4', '8.0', '5.7'],
  SQLite: ['3.45', '3.44', '3.43', '3.42'],
  MongoDB: ['8.0', '7.0', '6.0', '5.0'],
  MariaDB: ['11.4', '11.2', '10.11', '10.6', '10.5'],
  Redis: ['7.4', '7.2', '7.0', '6.2'],
  'SQL Server': ['2022', '2019', '2017'],
  Oracle: ['23c', '21c', '19c']
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

function getFilePrompt(file: string): string {
  const prompts: Record<string, string> = {
    'AGENTS.md': `Generate an AGENTS.md file. This file defines AI agent roles, responsibilities, and team conventions.
Include ONLY:
- Project name and brief description
- Tech stack summary (language, framework, database)
- Defined agent roles with their specific responsibilities
- Development commands (install, dev, build, lint, test)
- Code conventions and standards for the team
Do NOT include generic filler text or obvious statements.`,

    'CLAUDE.md': `Generate a CLAUDE.md file. This file provides instructions specifically for Claude Code (Anthropic's CLI agent).
Include ONLY:
- Project overview (1-2 sentences)
- Available CLI commands with descriptions
- Tech stack and architecture notes
- Key file paths and directory structure hints
- Code style rules specific to this stack
- What to avoid or be careful about
Do NOT repeat what's in AGENTS.md. Focus on Claude-specific guidance.`,

    '.agentup.json': `Generate an .agentup.json config file. This is the source-of-truth configuration for Agent Up CLI.
Output valid JSON with: name, description, stack (language, version, framework, database, docker), ide, providers, roles.
Keep it minimal and machine-readable.`,

    'settings.json': `Generate a .claude/settings.json file. This configures Claude Code permissions.
Output valid JSON with:
- permissions.allow: list of allowed tool patterns (e.g. "Bash(npm run *)", "Read", "Write", "Edit")
- permissions.deny: list of denied patterns (e.g. "Bash(rm -rf *)")
- model: the Claude model to use
Keep it concise and security-focused.`,

    'rules/project-core.md': `Generate a .claude/rules/project-core.md file. This defines core project rules for Claude Code.
Include ONLY:
- Language and framework version constraints
- Key architectural patterns to follow
- Import/export conventions
- Component/module structure rules
- Database query patterns
Keep each rule actionable and specific. No generic advice.`,

    'rules/verification.md': `Generate a .claude/rules/verification.md file. This defines verification steps Claude must run before completing tasks.
Include ONLY:
- Pre-commit checks (lint, type-check, build)
- Testing requirements
- Security checks if applicable
- Docker health checks if Docker is enabled
Keep it as a numbered checklist. Be specific to the stack.`,

    'rules/00-project-core.mdc': `Generate a .cursor/rules/00-project-core.mdc file for Cursor IDE.
Start with YAML frontmatter: description and globs (target file patterns).
Then include:
- Framework-specific coding patterns
- Component structure rules
- Naming conventions
- Import ordering rules
Keep rules actionable and specific to the stack. No generic filler.`,

    'README.md': `Generate a .cursor/README.md file explaining the Cursor rules setup.
Keep it brief: what the rules do, how to add new ones, and file naming conventions.`,

    'extensions.json': `Generate a .vscode/extensions.json file with recommended VS Code extensions.
Output valid JSON. Only include extensions directly relevant to the specified tech stack.`,

    'workspace.xml': `Generate a .idea/workspace.xml file for JetBrains IDE.
Output valid XML with project type and language level settings. Keep it minimal.`,

    'misc.xml': `Generate a .idea/misc.xml file for JetBrains IDE.
Output valid XML with JavaScript/TypeScript language level. Keep it minimal.`
  };

  return prompts[file] || `Generate the "${file}" configuration file. Output ONLY the file content, no explanations. Be concise and relevant to the project stack.`;
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
    dbVersion: '17',
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

  const fetchAllFiles = useCallback(async (files: string[], cfg: Config) => {
    const apiUrl = process.env.GROQ_API_URL;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiUrl || !apiKey) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAiLoading(true);
    setAiContent({});

    const userContext = `Project: ${cfg.projectName}
Description: ${cfg.description}
Language: ${cfg.language} v${cfg.version}
Framework: ${cfg.framework}
Database: ${cfg.database} v${cfg.dbVersion}
Docker: ${cfg.docker ? 'enabled' : 'disabled'}
IDE: ${cfg.ide}
AI Providers: ${cfg.providers.join(', ')}
Agent Roles: ${cfg.roles.join(', ')}`;

    try {
      const results = await Promise.allSettled(
        files.map(async (file) => {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: getFilePrompt(file) },
                { role: 'user', content: userContext }
              ],
              temperature: 0.7,
              max_tokens: 4096
            })
          });
          if (!res.ok) throw new Error('API request failed');
          const data = await res.json();
          return { file, content: data.choices?.[0]?.message?.content || '' };
        })
      );

      if (controller.signal.aborted) return;

      const newContent: Record<string, string> = {};
      for (const result of results) {
        if (result.status === 'fulfilled') {
          newContent[result.value.file] = result.value.content;
        }
      }
      setAiContent(newContent);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
    } finally {
      if (!controller.signal.aborted) setAiLoading(false);
    }
  }, []);


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

  const handleDatabaseChange = (db: string) => {
    const versions = DATABASE_VERSIONS[db];
    setConfig(prev => ({
      ...prev,
      database: db,
      dbVersion: versions[0]
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

  // Generate all files when config changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchAllFiles(allFileNames, config);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, allFileNames, fetchAllFiles]);

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
                    onChange={(e) => handleDatabaseChange(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {Object.keys(DATABASE_VERSIONS).map(db => (
                      <option key={db} value={db}>{db}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="cfg-dbver" className="block text-xs font-medium text-slate-400 mb-2">DB VERSION</label>
                <select
                  id="cfg-dbver"
                  value={config.dbVersion}
                  onChange={(e) => setConfig(prev => ({ ...prev, dbVersion: e.target.value }))}
                  className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {DATABASE_VERSIONS[config.database]?.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
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
                    onClick={() => fetchAllFiles(allFileNames, config)}
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
                      {aiContent[selectedFile] ? (
                        <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {aiContent[selectedFile]}
                        </pre>
                      ) : aiLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mb-3" />
                          <p className="text-sm text-slate-400">Generating content...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <Sparkles className="w-8 h-8 text-slate-600 mb-3" />
                          <p className="text-sm text-slate-500 mb-1">No content yet</p>
                          <p className="text-xs text-slate-600">Change any config option to auto-generate</p>
                        </div>
                      )}
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
