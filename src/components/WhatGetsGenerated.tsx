import {
  Sparkles,
  Users,
  Code,
  FileCode,
  Shield,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

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

export const WhatGetsGenerated = () => (
  <section className="py-24 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Agent Up generates for you</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">One command creates all the AI agent configuration files your project needs. Every file is tailored to your tech stack, IDE, and team preferences.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(f => (
          <div key={f.name} className={cn("p-6 rounded-2xl border border-white/10 bg-gradient-to-br", f.bg)}>
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
