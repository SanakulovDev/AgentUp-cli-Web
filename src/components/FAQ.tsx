import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

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

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white">{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", openIndex === i && "rotate-180")} />
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
