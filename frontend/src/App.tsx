import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeDream, streamSynthesis } from './api/dreamApi';
import type { DreamAnalysis } from './types/dream';

// The Onboarding Seeds
const DREAM_SEEDS = [
  "I was walking through a forest where the trees were made of clocks, and the leaves were falling upwards.",
  "I was in a house that kept expanding, and every door I opened led back to my childhood bedroom.",
  "I was swimming in a deep black ocean, but I could breathe perfectly, and glowing geometric shapes floated past me."
];

export default function App() {
  const [dreamText, setDreamText] = useState('');
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [synthesis, setSynthesis] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.length < 20) return;

    setAnalysis(null);
    setSynthesis('');
    setError(null);
    setIsAnalyzing(true);
    setIsSynthesizing(true);

    analyzeDream(dreamText)
      .then((data) => setAnalysis(data))
      .catch((err) => setError("The dreamer is resting. The AI might be temporarily unavailable or out of tokens. Please try again later."))
      .finally(() => setIsAnalyzing(false));

    streamSynthesis(
      dreamText,
      (token) => setSynthesis((prev) => prev + token)
    )
      .catch((err) => console.error("Stream error:", err))
      .finally(() => setIsSynthesizing(false));
  };

  return (
    <main className="min-h-screen bg-aurora text-slate-200 relative selection:bg-amethyst/30">
      <div className="noise-overlay" />
      
      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 space-y-16">
        
        {/* Header */}
        <header className="text-center space-y-4 pt-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-[0.3em] text-amethyst uppercase font-medium">
            A Jungian Exploration
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif text-white tracking-tight">
            Dream Weaver
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 font-light max-w-md mx-auto">
            Uncover the symbols, archetypes, and hidden narratives within your subconscious.
          </motion.p>
        </header>

        {/* Input Form & Seeds */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto space-y-6">
          
          {/* Example Seeds (Onboarding) */}
          {!analysis && !isAnalyzing && (
            <div className="flex flex-col space-y-3">
              <span className="text-xs text-slate-500 uppercase tracking-widest text-center">Need inspiration?</span>
              <div className="flex flex-wrap justify-center gap-3">
                {DREAM_SEEDS.map((seed, i) => (
                  <button 
                    key={i}
                    onClick={() => setDreamText(seed)}
                    className="px-4 py-2 text-xs bg-midnight-800 hover:bg-midnight-700 border border-white/5 rounded-full transition-colors text-slate-300 hover:text-white"
                  >
                    {seed.split(' ').slice(0, 4).join(' ')}...
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amethyst/50 to-gold/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-midnight-800 border border-white/5 rounded-2xl p-2">
              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="I was walking through a forest where the trees were made of clocks..."
                className="w-full h-40 p-6 bg-transparent text-white placeholder-slate-600 font-serif text-xl leading-relaxed focus:outline-none resize-none"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between items-center px-6 py-4 border-t border-white/5">
                <span className={`text-xs tracking-wider uppercase ${dreamText.length > 0 && dreamText.length < 20 ? 'text-rose-400' : 'text-slate-500'}`}>
                  {dreamText.length} / 20 chars
                </span>
                <button
                  type="submit"
                  disabled={dreamText.length < 20 || isAnalyzing}
                  className="px-8 py-3 bg-white text-black hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 rounded-full text-sm font-semibold tracking-wide transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Weaving...
                    </>
                  ) : (
                    'Reveal Meaning'
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Error State (Editorial Style) */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto p-6 border-l-2 border-rose-500 bg-rose-950/20 text-rose-200 text-sm font-light text-center">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Layout */}
        <div className="space-y-24">
          <AnimatePresence mode="wait">
            
            {/* SKELETON LOADER (The Vibe Coding Fix) */}
            {isAnalyzing && !analysis && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16 animate-pulse">
                <div className="text-center space-y-6">
                  <div className="h-10 w-2/3 bg-white/5 rounded-lg mx-auto"></div>
                  <div className="flex justify-center gap-3">
                    <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                    <div className="h-6 w-24 bg-white/5 rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-8 space-y-6">
                    <div className="h-4 w-32 bg-white/5 rounded mb-8"></div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="h-24 bg-white/5 rounded-lg"></div>
                      <div className="h-24 bg-white/5 rounded-lg"></div>
                      <div className="h-24 bg-white/5 rounded-lg"></div>
                      <div className="h-24 bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="md:col-span-4 space-y-6">
                    <div className="h-4 w-32 bg-white/5 rounded mb-8"></div>
                    <div className="h-8 bg-white/5 rounded"></div>
                    <div className="h-8 bg-white/5 rounded"></div>
                    <div className="h-8 bg-white/5 rounded"></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ACTUAL RESULTS */}
            {analysis && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-16"
              >
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-serif italic text-white/90">
                    "{analysis.title}"
                  </h2>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {analysis.archetypes.map((tag) => (
                      <span key={tag} className="px-4 py-1.5 border border-amethyst/30 text-amethyst/90 text-xs tracking-widest uppercase rounded-full bg-amethyst/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-8 space-y-8">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] border-b border-white/10 pb-4">
                      The Symbols
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                      {analysis.symbols.map((sym, i) => (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} key={sym.name} className="space-y-2 group">
                          <span className="font-serif text-2xl text-white group-hover:text-gold transition-colors">{sym.name}</span>
                          <p className="text-sm text-slate-400 leading-relaxed font-light">{sym.meaning}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-8">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] border-b border-white/10 pb-4">
                      Emotional Resonance
                    </h3>
                    <div className="space-y-6">
                      {analysis.emotions.map((emo, i) => (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} key={emo.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300 font-medium">{emo.name}</span>
                            <span className="text-slate-500 text-xs">{emo.intensity}/10</span>
                          </div>
                          <div className="h-1 w-full bg-midnight-700 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${emo.intensity * 10}%` }} transition={{ delay: 0.6, duration: 1 }} className="h-full bg-gradient-to-r from-amethyst to-gold" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="max-w-3xl mx-auto space-y-12 pt-8">
                  <div className="space-y-6">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] text-center">Interpretation</h3>
                    <p className="font-serif text-2xl leading-relaxed text-slate-300 text-center italic">
                      {analysis.interpretation}
                    </p>
                  </div>
                  <div className="bg-midnight-800/50 border border-white/5 p-8 rounded-2xl">
                    <h3 className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-4 text-center">Practical Advice</h3>
                    <p className="text-center text-slate-300 font-light leading-relaxed">
                      {analysis.advice}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {(isSynthesizing || synthesis) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto border-l-2 border-amethyst/50 pl-8 py-4">
              <h3 className="text-xs font-semibold text-amethyst uppercase tracking-[0.2em] mb-4">Closing Reflection</h3>
              <p className="font-serif text-xl leading-loose text-slate-400 italic whitespace-pre-wrap">
                {synthesis}
                {isSynthesizing && <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-amethyst/80"></span>}
              </p>
            </motion.div>
          )}
        </div>

      </div>
    </main>
  );
}