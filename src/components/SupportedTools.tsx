import {
  Sparkles,
  Monitor,
  Globe,
  Database,
  CheckCircle2
} from 'lucide-react';

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

export const SupportedTools = () => (
  <section className="py-24 bg-slate-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Works with your entire stack</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Agent Up detects your project's technology stack and generates optimized AI context files for every tool you use — from IDE to deployment platform.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {categories.map(cat => (
          <div key={cat.title} className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3 mb-6">
              <cat.icon className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">{cat.title}</h3>
            </div>
            <ul className="space-y-4">
              {cat.tools.map(tool => (
                <li key={tool.name} className="flex items-start gap-3">
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
