import {
  Rocket,
  Users,
  Code,
  Globe,
  Cpu,
  Shield
} from 'lucide-react';

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

export const UseCases = () => (
  <section className="py-24 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for every developer workflow</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Whether you're a solo developer or part of a large team, Agent Up adapts to how you work with AI coding agents.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map(c => (
          <div key={c.title} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all group">
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
