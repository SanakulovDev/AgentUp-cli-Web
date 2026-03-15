import {
  Layers,
  Monitor,
  Box,
  Database,
  Users,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

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

export const Features = () => (
  <section id="features" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for modern workflows.</h2>
        <p className="text-slate-400">Everything you need to make AI agents understand your project perfectly.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(f => (
          <div key={f.title} className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all group">
            <f.icon className={cn("w-10 h-10 mb-6 transition-transform group-hover:scale-110", f.color)} />
            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
