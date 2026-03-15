import { ChevronRight } from 'lucide-react';

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

export const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-slate-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple workflow.</h2>
        <p className="text-slate-400">From zero to AI-ready in less than 60 seconds.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <div key={s.step} className="relative">
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
