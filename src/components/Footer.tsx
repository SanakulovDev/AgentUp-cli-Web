import { Zap, Coffee } from 'lucide-react';

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
