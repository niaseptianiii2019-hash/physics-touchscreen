import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Search, BrainCircuit, Activity, BookOpen, Layers, 
  Wrench, CheckCircle2, ChevronRight, ChevronLeft, 
  Cpu, Zap, Smartphone, Sparkles, Award
} from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Inter', sans-serif;
    background-color: #0F172A;
    color: #F8FAFC;
    overflow: hidden;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  /* Glassmorphism */
  .glass {
    background: rgba(30, 41, 59, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .glass-card {
    background: linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
    backdrop-filter: blur(16px);
    border: 1px solid rgba(56, 189, 248, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  }

  .glass-button {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(56, 189, 248, 0.8));
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease;
  }
  
  .glass-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(56, 189, 248, 0.5);
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(37, 99, 235, 0.9));
  }
  
  .glass-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(30, 41, 59, 0.8);
    box-shadow: none;
  }

  /* Animations */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .animate-float { animation: float 3s ease-in-out infinite; }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
    50% { box-shadow: 0 0 35px rgba(56, 189, 248, 0.8); }
  }
  .animate-pulse-glow { animation: pulse-glow 2s infinite; }

  @keyframes field-move {
    0% { stroke-dashoffset: 24; }
    100% { stroke-dashoffset: 0; }
  }
  .animate-field { animation: field-move 1s linear infinite; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  /* Background Particles */
  .bg-particle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.8) 0%, rgba(37,99,235,0) 70%);
    opacity: 0.3;
    pointer-events: none;
  }

  /* Custom Slider */
  input[type=range] {
    -webkit-appearance: none;
    background: transparent;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #38BDF8;
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 0 10px rgba(56,189,248,0.8);
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
  }
`;

// --- COMPONENTS ---

const Background = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0F172A]">
    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[120px]"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/20 blur-[120px]"></div>
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Floating Particles */}
    {[...Array(15)].map((_, i) => (
      <div 
        key={i} 
        className="bg-particle animate-float"
        style={{
          width: Math.random() * 100 + 50 + 'px',
          height: Math.random() * 100 + 50 + 'px',
          left: Math.random() * 100 + 'vw',
          top: Math.random() * 100 + 'vh',
          animationDuration: (Math.random() * 5 + 5) + 's',
          animationDelay: (Math.random() * 5) + 's'
        }}
      />
    ))}
  </div>
);

const Capa = ({ message, mood = 'normal' }) => {
  // Keep Capa minimized by default so it never blocks the learning content.
  // Students can click the bot to open/close the guidance bubble.
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <div
      className="fixed z-[100] flex flex-col items-end gap-2 max-w-[92vw] sm:max-w-sm"
      style={{ bottom: window.innerWidth < 640 ? '0.8rem' : '1.25rem', right: window.innerWidth < 640 ? '0.8rem' : '1.25rem' }}
    >
      {message && !isMinimized && (
        <div className="glass p-4 rounded-2xl text-sm font-medium shadow-2xl relative border-blue-500/30 w-[min(300px,calc(100vw-2rem))] fade-in">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            className="absolute -top-2 -right-2 bg-slate-800 text-slate-300 hover:text-white rounded-full p-1.5 border border-slate-500 z-10 transition-colors shadow-lg"
            title="Close Capa guidance"
            aria-label="Close Capa guidance"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <p className="text-blue-100 leading-relaxed pr-1">{message}</p>
        </div>
      )}

      <button
        type="button"
        className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative cursor-pointer group transition-transform ${isMinimized ? 'opacity-90 hover:opacity-100 hover:scale-110' : 'animate-float'}`}
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? "Open Capa guidance" : "Minimize Capa guidance"}
        aria-label={isMinimized ? "Open Capa guidance" : "Minimize Capa guidance"}
      >
        <span className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity"></span>
        <span className="w-full h-full glass-card rounded-full flex items-center justify-center border-blue-400 relative overflow-hidden">
          <span className="flex gap-2">
            <span className={`w-2 h-3 bg-cyan-300 rounded-full ${mood === 'happy' ? 'animate-pulse' : ''}`}></span>
            <span className={`w-2 h-3 bg-cyan-300 rounded-full ${mood === 'happy' ? 'animate-pulse' : ''}`}></span>
          </span>
          <span className="absolute top-1 w-1 h-2 bg-blue-400 rounded-t-full"></span>
        </span>
      </button>
    </div>
  );
};

// --- PAGES / STEPS ---

const Step1Landing = ({ onNext }) => (
  <div className="flex flex-col h-full p-8 fade-in max-w-6xl mx-auto overflow-y-auto">
    <div className="text-center mb-8">
      <div className="glass px-4 py-1 rounded-full text-cyan-400 text-sm font-bold tracking-widest uppercase mb-5 inline-flex items-center gap-2">
        <Zap size={16} /> Physics Touchscreen
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">TOUCHSCREEN</span> MYSTERY
      </h1>
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
        Explore the physics behind capacitive touchscreen technology through observation and investigation.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
      <div className="glass-card p-7 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <BookOpen className="text-cyan-400" />
          <h2 className="text-2xl font-bold">Learning Objectives</h2>
        </div>
        <p className="text-slate-300 mb-4">After completing this learning activity, you will be able to:</p>
        <ol className="space-y-3 text-slate-300 list-decimal list-inside leading-relaxed">
          <li>Explain the working principle of capacitive touch screens using the concept of parallel plate capacitors based on the results of phenomenon analysis and investigation in a scientific and correct manner.</li>
          <li>Analyze the influence of plate area (A), distance between plates (d), and dielectric material (ε) on the capacitance of parallel plate capacitors based on the data from the Virtual Capacitor Lab simulation investigation correctly.</li>
          <li>Analyze the mathematical relationship between the data from the investigation results correctly.</li>
        </ol>
      </div>

      <div className="glass-card p-7 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <Play className="text-cyan-400" />
          <h2 className="text-2xl font-bold">How to Use</h2>
        </div>
        <p className="text-slate-300 leading-relaxed mb-5">
          Follow each phase in sequence and interact with the simulations to explore the physics behind capacitive touchscreens.
        </p>
        <div className="border border-dashed border-cyan-500/30 rounded-2xl p-6 text-center">
          <Play size={32} className="mx-auto mb-3 text-cyan-400" />

          <p className="font-semibold text-slate-200 mb-2">Physics Touchscreen Tutorial</p>
          <p className="text-sm text-slate-500 mt-2">Watch the tutorial video to learn how to navigate and use each phase of this learning media.</p>

          <a
          href="https://youtu.be/_Tmt3FdO_sY"
          target="_blank"
          rel="nooper noreferrer"
          classNama="inline-flex items-center gap-2 rounded-full bg cyan-500 px-6 py-3 fontbold text-white shadow-Lg transition hover:scale-1-5 hover-bg-cyan-400"
          >
            <Play size={18} fill="currentColor"/>
            Watch Tutorial Video
          </a>
        </div>
      </div>
    </div>

    <div className="flex justify-center mt-8">
      <button onClick={onNext} className="glass-button px-10 py-4 rounded-full text-lg font-bold flex items-center gap-3 animate-pulse-glow">
        START LEARNING <ChevronRight size={24} />
      </button>
    </div>
  </div>
);

const Step2Observe = ({ onNext, setGlobalXp }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [tested, setTested] = useState([]);

  const handleTest = (item) => {
    setActiveItem(item);
    if (!tested.includes(item)) {
      setTested([...tested, item]);
      setGlobalXp(prev => prev + 25);
    }
  };

  const allTested = tested.length === 3;

  return (
    <div className="flex flex-col h-full p-8 fade-in max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 text-cyan-400">
        <Search className="text-blue-500" /> Observation Phase
      </h2>
      <p className="text-slate-300 mb-3">Interact with the smartphone prototype using different objects.</p>

      <div className="glass-card p-4 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-bold text-cyan-300">Observation Task</p>
          <p className="text-sm text-slate-400">Test all three objects and observe how the touchscreen responds to each one.</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold border shrink-0 ${allTested ? 'bg-green-500/15 border-green-400/40 text-green-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
          {tested.length}/3 objects tested
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-12 items-center">
        {/* Smartphone Simulator */}
        <div className="flex justify-center relative">
          <div className="w-48 sm:w-56 md:w-64 
          
          h-[380px] sm:h-[430px] md:h-[500px] glass-card rounded-[3rem] border-8 border-slate-800 p-2 relative shadow-2xl flex flex-col justify-center items-center overflow-hidden">
            <div className="absolute top-4 w-20 h-4 bg-slate-800 rounded-full"></div>
            
            <div className={`transition-all duration-500 transform ${activeItem ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
               {activeItem === 'finger' || activeItem === 'stylus' ? (
                 <div className="text-center text-green-400">
                   <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                     <CheckCircle2 size={48} />
                   </div>
                   <h3 className="font-bold text-xl">Touch Detected</h3>
                 </div>
               ) : activeItem === 'plastic' ? (
                 <div className="text-center text-red-400">
                   <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                     <div className="w-12 h-1 bg-red-500 rotate-45 absolute rounded"></div>
                     <div className="w-12 h-1 bg-red-500 -rotate-45 absolute rounded"></div>
                   </div>
                   <h3 className="font-bold text-xl">No Response</h3>
                 </div>
               ) : (
                 <div className="text-slate-500 text-center">Awaiting Input...</div>
               )}
            </div>

            {/* Simulated interaction animations */}
            {activeItem && (
               <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-400/10 rounded-full animate-ping"></div>
               </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">Test Objects:</h3>
            <div className="space-y-4">
              <button 
                onClick={() => handleTest('finger')}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${activeItem === 'finger' ? 'bg-blue-500/20 border-blue-400' : 'glass border-transparent hover:border-slate-500'}`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">☝️</div>
                <div className="text-left"><p className="font-bold">Human Finger</p><p className="text-sm text-slate-400">Biological conductor</p></div>
                {tested.includes('finger') && <CheckCircle2 className="ml-auto text-green-400" size={20}/>}
              </button>
              
              <button 
                onClick={() => handleTest('plastic')}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${activeItem === 'plastic' ? 'bg-blue-500/20 border-blue-400' : 'glass border-transparent hover:border-slate-500'}`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">🖊️</div>
                <div className="text-left"><p className="font-bold">Plastic Pen</p><p className="text-sm text-slate-400">Insulator</p></div>
                {tested.includes('plastic') && <CheckCircle2 className="ml-auto text-green-400" size={20}/>}
              </button>

              <button 
                onClick={() => handleTest('stylus')}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${activeItem === 'stylus' ? 'bg-blue-500/20 border-blue-400' : 'glass border-transparent hover:border-slate-500'}`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">🪄</div>
                <div className="text-left"><p className="font-bold">Capacitive Stylus</p><p className="text-sm text-slate-400">Metallic/Conductive tip</p></div>
                {tested.includes('stylus') && <CheckCircle2 className="ml-auto text-green-400" size={20}/>}
              </button>
            </div>
          </div>

          {allTested ? (
            <div className="fade-in bg-blue-900/40 border border-blue-500/30 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-green-300">
                <CheckCircle2 size={20} />
                <p className="font-bold">Observation Complete!</p>
              </div>
              <p className="text-slate-300 mb-4">You have tested all three objects. You may now continue to the investigation phase.</p>
              <button onClick={onNext} className="glass-button w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2">
                Continue to Investigation <ChevronRight size={20}/>
              </button>
            </div>
          ) : (
            <div className="glass px-5 py-4 rounded-2xl border border-slate-700/70">
              <p className="text-sm font-semibold text-slate-300">You must test all three objects before continuing to the next phase.</p>
            </div>
          )}
        </div>
      </div>
      <Capa message={allTested ? "Great! You have explored all three objects. Now let's investigate the physics behind the phenomenon." : "Try testing all three objects to see how the screen reacts."} mood={allTested ? 'happy' : 'normal'} />
    </div>
  );
};

const Step3Prepare = ({ onNext }) => (
  <div className="flex flex-col min-h-full py-8 px-4 sm:px-8 fade-in max-w-6xl mx-auto items-center justify-center overflow-y-auto">
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 text-cyan-400 mb-4">
        <BrainCircuit size={28} />
        <span className="font-bold uppercase tracking-widest">Investigation Preparation</span>
      </div>
      <h2 className="text-4xl font-bold mb-4">Formulate Your Hypotheses</h2>
      <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
        Three factors will be investigated in the Virtual Capacitor Lab. Predict their effects in your Student Worksheet before testing them.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-5 w-full max-w-5xl mb-7">
      {/* Plate Area */}
      <div className="glass-card p-5 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-cyan-400/10 blur-2xl"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
            <Layers className="text-cyan-300" size={24} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Factor 01</span>
        </div>
        <h3 className="text-xl font-bold mb-1">Plate Area</h3>
        <p className="text-sm text-slate-400 mb-5">A</p>
        <div className="h-24 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-center relative overflow-hidden">
          <div className="w-28 h-8 rounded-md bg-cyan-400/70 border border-cyan-200/70 shadow-[0_0_20px_rgba(34,211,238,0.25)]"></div>
          <div className="absolute left-8 right-8 bottom-3 border-t border-dashed border-cyan-300/60"></div>
          <span className="absolute bottom-0.5 text-[10px] text-cyan-200">larger / smaller surface</span>
        </div>
      </div>

      {/* Plate Distance */}
      <div className="glass-card p-5 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-blue-400/10 blur-2xl"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center">
            <ChevronUpDownIcon />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Factor 02</span>
        </div>
        <h3 className="text-xl font-bold mb-1">Plate Distance</h3>
        <p className="text-sm text-slate-400 mb-5">d</p>
        <div className="h-24 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-center relative">
          <div className="w-28 flex flex-col gap-8 items-center">
            <div className="w-28 h-2 rounded-full bg-blue-400 border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
            <div className="w-28 h-2 rounded-full bg-slate-300 border border-white/70 shadow-[0_0_15px_rgba(148,163,184,0.2)]"></div>
          </div>
          <div className="absolute right-8 top-5 bottom-5 border-l border-dashed border-blue-300/70"></div>
          <div className="absolute right-5 top-5 bottom-5 flex flex-col justify-between text-[10px] text-blue-200">
            <span>↕</span><span>↕</span>
          </div>
        </div>
      </div>

      {/* Dielectric Material */}
      <div className="glass-card p-5 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-purple-400/10 blur-2xl"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
            <Sparkles className="text-purple-300" size={24} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Factor 03</span>
        </div>
        <h3 className="text-xl font-bold mb-1">Dielectric Material</h3>
        <p className="text-sm text-slate-400 mb-5">ε</p>
        <div className="h-24 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-center gap-2">
          <div className="w-8 h-14 rounded-md bg-slate-300/80 border border-white/60"></div>
          <div className="w-8 h-14 rounded-md bg-purple-400/60 border border-purple-200/60 shadow-[0_0_18px_rgba(192,132,252,0.25)]"></div>
          <div className="w-8 h-14 rounded-md bg-blue-400/60 border border-blue-200/60"></div>
        </div>
      </div>
    </div>

    <div className="glass-card p-6 rounded-3xl w-full max-w-5xl mb-6 border-cyan-500/20">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
          <BookOpen className="text-cyan-300" size={21} />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Your Task</h3>
          <p className="text-slate-300 leading-relaxed">
            Write your three hypotheses in the <span className="text-cyan-300 font-semibold">Student Worksheet</span>. Predict what will happen to capacitance when each factor is changed. Keep your predictions for comparison with the investigation results.
          </p>
        </div>
      </div>
    </div>

    <div className="glass px-6 py-4 rounded-2xl w-full max-w-5xl mb-6 border-cyan-500/30 text-center">
      <p className="text-cyan-300 font-semibold">📝 Complete the three hypothesis statements in your Student Worksheet before starting the simulation.</p>
    </div>

    <button onClick={onNext} className="glass-button px-10 py-4 rounded-full text-lg font-bold flex items-center gap-3">
      I HAVE WRITTEN MY HYPOTHESES <ChevronRight size={24}/>
    </button>

    <Capa message="Your hypotheses are predictions—not answers. Use the Virtual Capacitor Lab to test your ideas with evidence." />
  </div>
);

const ChevronUpDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300">
    <path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/><path d="M12 4v16"/>
  </svg>
);

const Step4Investigate = ({ onNext, setGlobalXp }) => {
  const AREA_TARGETS = [25, 50, 75, 100];
  const DISTANCE_TARGETS = [10, 20, 30, 40];
  const MATERIAL_TARGETS = ['air', 'plastic', 'glass'];

  const [area, setArea] = useState(0);
  const [distance, setDistance] = useState(0);
  const [dielectric, setDielectric] = useState(1);
  const [materialName, setMaterialName] = useState('air');
  const [testedArea, setTestedArea] = useState(new Set());
  const [testedDistance, setTestedDistance] = useState(new Set());
  const [testedMaterial, setTestedMaterial] = useState(new Set());
  const [completed, setCompleted] = useState(false);

  const markArea = (value) => {
    setArea(value);
    if (AREA_TARGETS.includes(value)) setTestedArea(prev => new Set(prev).add(value));
  };

  const markDistance = (value) => {
    setDistance(value);
    if (DISTANCE_TARGETS.includes(value)) setTestedDistance(prev => new Set(prev).add(value));
  };

  const markMaterial = (name, value) => {
    setMaterialName(name);
    setDielectric(value);
    setTestedMaterial(prev => new Set(prev).add(name));
  };

  const allExplored =
    testedArea.size === AREA_TARGETS.length &&
    testedDistance.size === DISTANCE_TARGETS.length &&
    testedMaterial.size === MATERIAL_TARGETS.length;

  useEffect(() => {
    if (allExplored && !completed) {
      setCompleted(true);
      setGlobalXp(prev => prev + 150);
    }
  }, [allExplored, completed, setGlobalXp]);

  const capacitance = distance === 0 ? "—" : ((dielectric * area) / distance).toFixed(2);

  const ProgressPills = ({ values, tested }) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {values.map(value => {
        const done = tested.has(value);
        return (
          <span key={value} className={`px-2.5 py-1 rounded-full text-xs font-bold border ${done ? 'bg-green-500/15 border-green-400/40 text-green-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
            {done ? '✓ ' : ''}{value}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-full p-8 fade-in max-w-7xl mx-auto overflow-y-auto">
      <div className="mb-5">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-cyan-400">
          <Activity className="text-blue-500" /> Virtual Capacitor Lab
        </h2>
        <p className="text-slate-300 mt-2">Investigate the relationship between capacitance and the three factors in your hypotheses.</p>
      </div>

      <div className="glass-card p-5 rounded-2xl mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h3 className="font-bold text-lg">Investigation Progress</h3>
          <span className={`text-sm font-bold ${allExplored ? 'text-green-400' : 'text-cyan-300'}`}>
            {testedArea.size}/{AREA_TARGETS.length} Area · {testedDistance.size}/{DISTANCE_TARGETS.length} Distance · {testedMaterial.size}/{MATERIAL_TARGETS.length} Material
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><p className="text-sm font-semibold text-slate-300">Plate Area</p><ProgressPills values={AREA_TARGETS} tested={testedArea} /></div>
          <div><p className="text-sm font-semibold text-slate-300">Plate Distance</p><ProgressPills values={DISTANCE_TARGETS} tested={testedDistance} /></div>
          <div><p className="text-sm font-semibold text-slate-300">Dielectric Material</p><ProgressPills values={MATERIAL_TARGETS.map(x => x[0].toUpperCase()+x.slice(1))} tested={new Set([...testedMaterial].map(x => x[0].toUpperCase()+x.slice(1)))} /></div>
        </div>
      </div>

      <div className="glass px-6 py-4 rounded-2xl border-cyan-500/50 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-200 mb-1 font-mono uppercase tracking-wider">Live Reading</p>
          <p className="text-xs text-slate-400">Current capacitance</p>
        </div>
        <div className="text-3xl md:text-4xl font-mono font-bold text-cyan-400">{capacitance} <span className="text-xl">pF</span></div>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-8 min-h-[420px]">
        <div className="glass-card p-6 rounded-3xl space-y-7 flex flex-col justify-center relative z-10">
          <div>
            <label className="flex justify-between font-bold mb-2"><span>Plate Area (A)</span><span className="text-cyan-400">{area} mm²</span></label>
            <input type="range" min="0" max="100" step="1" value={area} onChange={(e) => markArea(Number(e.target.value))} className="w-full" />
            <div className="flex gap-2 mt-2">{AREA_TARGETS.map(v => <button key={v} onClick={() => markArea(v)} className={`text-xs px-2 py-1 rounded-md ${area===v ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{v}</button>)}</div>
          </div>

          <div>
            <label className="flex justify-between font-bold mb-2"><span>Plate Distance (d)</span><span className="text-cyan-400">{distance} mm</span></label>
            <input type="range" min="0" max="40" step="1" value={distance} onChange={(e) => markDistance(Number(e.target.value))} className="w-full" />
            <div className="flex gap-2 mt-2">{DISTANCE_TARGETS.map(v => <button key={v} onClick={() => markDistance(v)} className={`text-xs px-2 py-1 rounded-md ${distance===v ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{v}</button>)}</div>
          </div>

          <div>
            <label className="font-bold mb-2 block">Material Between Plates</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => markMaterial('air',1)} className={`py-2 rounded-lg text-sm transition-all ${dielectric === 1 ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Air</button>
              <button onClick={() => markMaterial('plastic',3.4)} className={`py-2 rounded-lg text-sm transition-all ${dielectric === 3.4 ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Plastic</button>
              <button onClick={() => markMaterial('glass',10)} className={`py-2 rounded-lg text-sm transition-all ${dielectric === 10 ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Glass</button>
            </div>
            
          </div>
        </div>

        <div className="lg:col-span-2 glass p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/80 shadow-inner min-h-[420px]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent pointer-events-none"></div>
          <div className="relative flex flex-col items-center justify-center h-64 w-full perspective-[1000px]">
            <div className="absolute bg-blue-400/80 border-2 border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center justify-center overflow-hidden transition-all duration-300 ease-out" style={{width:`${area*3}px`,height:'20px',transform:`translateY(-${distance*1.5}px) rotateX(60deg) rotateZ(-45deg)`,borderRadius:'4px'}}>
              <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-1 opacity-50 p-1">{[...Array(Math.floor(area/5))].map((_,i)=><span key={i} className="text-[10px] font-bold text-white">+</span>)}</div>
            </div>
            {dielectric > 1 && <div className="absolute transition-all duration-300 ease-out pointer-events-none" style={{width:`${area*3}px`,height:`${distance*3}px`,background:dielectric===3.4?'rgba(168,85,247,0.2)':'rgba(56,189,248,0.2)',transform:'translateY(0) rotateX(60deg) rotateZ(-45deg)',borderLeft:'1px solid rgba(255,255,255,0.1)',borderRight:'1px solid rgba(255,255,255,0.1)'}}></div>}
            <svg className="absolute w-full h-full pointer-events-none" style={{transform:'rotateX(60deg) rotateZ(-45deg)'}}>
              {[...Array(Math.floor(area/10))].map((_,i)=><line key={i} x1="50%" y1={`calc(50% - ${distance*1.5}px)`} x2="50%" y2={`calc(50% + ${distance*1.5}px)`} stroke="rgba(56,189,248,0.4)" strokeWidth="1" strokeDasharray="4 4" className="animate-field" style={{transform:`translateX(${(i-Math.floor(area/20))*10}px)`}} />)}
            </svg>
            <div className="absolute bg-slate-400/80 border-2 border-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.5)] flex items-center justify-center overflow-hidden transition-all duration-300 ease-out" style={{width:`${area*3}px`,height:'20px',transform:`translateY(${distance*1.5}px) rotateX(60deg) rotateZ(-45deg)`,borderRadius:'4px'}}>
              <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-1 opacity-50 p-1">{[...Array(Math.floor(area/5))].map((_,i)=><span key={i} className="text-[10px] font-bold text-white">-</span>)}</div>
            </div>
          </div>

          <div className="mt-5 text-center relative z-10">
            {allExplored ? (
              <div className="fade-in bg-green-900/30 border border-green-500/30 p-5 rounded-2xl">
                <p className="text-green-300 font-bold mb-3">✓ Investigation Complete!</p>
                <p className="text-slate-300 text-sm mb-4">You have investigated all required values for the three factors. Use your observations to complete the Student Worksheet.</p>
                <button onClick={onNext} className="glass-button px-7 py-3 rounded-full font-bold flex items-center gap-2 mx-auto">Continue to Pattern Recognition <ChevronRight size={18}/></button>
              </div>
            ) : (
              <div className="glass px-5 py-3 rounded-xl">
                <p className="text-cyan-300 font-semibold">Complete all three investigations before continuing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Capa message={allExplored ? "Excellent! You have collected the evidence needed to test your hypotheses. Use your Student Worksheet evidence to identify the physical relationships in the next phase." : "Change each variable and test every required value. You cannot continue until all three investigations are complete."} mood={allExplored ? 'happy' : 'normal'} />
    </div>
  );
};

const Step5Analyze = ({ onNext, setGlobalXp }) => {
  const [ans1, setAns1] = useState(null);
  const [ans2, setAns2] = useState(null);
  const [ans3, setAns3] = useState(null);
  
  const [hasVerified, setHasVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleVerify = () => {
    const correct = ans1 === 'increase' && ans2 === 'decrease' && ans3 === 'affects';
    setIsCorrect(correct);
    setHasVerified(true);
    
    if (correct) {
      setGlobalXp(prev => prev + 150);
    } else {
      setGlobalXp(prev => prev + 50); // Partial XP for trying, allows progression
    }
  };

  const getButtonStyle = (ans, value) => {
    if (hasVerified && ans === value) {
       return isCorrect ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-blue-900/50 border-cyan-400 text-white';
    }
    if (ans === value) return 'bg-blue-900/50 border-cyan-400 text-white';
    return 'glass border-slate-600 hover:border-cyan-400 text-slate-300';
  };

  return (
    <div className="flex flex-col h-full p-8 fade-in max-w-4xl mx-auto justify-center">
      <h2 className="text-4xl font-bold mb-2 text-center text-cyan-400">Pattern Recognition</h2>
      <p className="text-slate-300 mb-8 text-center text-lg">Based on your lab evidence, identify and verify the physical relationships.</p>

      <div className="space-y-6 mb-8">
        <div className="glass-card p-6 rounded-3xl text-lg flex flex-col md:flex-row items-center gap-4 justify-between">
          <p>1. As the Plate Area (A) increases, the Capacitance...</p>
          <div className="flex gap-4">
            <button disabled={hasVerified} onClick={() => setAns1('increase')} className={`px-6 py-2 rounded-lg font-bold border transition-all ${getButtonStyle(ans1, 'increase')}`}>Increases</button>
            <button disabled={hasVerified} onClick={() => setAns1('decrease')} className={`px-6 py-2 rounded-lg font-bold border transition-all ${getButtonStyle(ans1, 'decrease')}`}>Decreases</button>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl text-lg flex flex-col md:flex-row items-center gap-4 justify-between">
          <p>2. As the Distance (d) increases, the Capacitance...</p>
          <div className="flex gap-4">
            <button disabled={hasVerified} onClick={() => setAns2('increase')} className={`px-6 py-2 rounded-lg font-bold border transition-all ${getButtonStyle(ans2, 'increase')}`}>Increases</button>
            <button disabled={hasVerified} onClick={() => setAns2('decrease')} className={`px-6 py-2 rounded-lg font-bold border transition-all ${getButtonStyle(ans2, 'decrease')}`}>Decreases</button>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl text-lg flex flex-col md:flex-row items-center gap-4 justify-between">
          <p>3. Changing the material between the plates...</p>
          <div className="flex gap-4">
            <button disabled={hasVerified} onClick={() => setAns3('affects')} className={`px-6 py-2 rounded-lg font-bold border transition-all ${getButtonStyle(ans3, 'affects')}`}>Affects Capacitance</button>
            <button disabled={hasVerified} onClick={() => setAns3('no_effect')} className={`px-6 py-2 rounded-lg font-bold border transition-all ${getButtonStyle(ans3, 'no_effect')}`}>Has No Effect</button>
          </div>
        </div>
      </div>

      <div className="flex justify-center h-24">
        {!hasVerified ? (
          <button 
            disabled={!ans1 || !ans2 || !ans3} 
            onClick={handleVerify} 
            className="glass-button px-8 py-3 rounded-xl font-bold transition-all"
          >
             Verify Patterns
          </button>
        ) : (
          <div className="flex flex-col items-center fade-in">
             {!isCorrect && <p className="text-red-400 font-bold mb-2">Patterns incorrect, but recorded as hypothesis. Let's proceed.</p>}
             <button onClick={onNext} className="glass-button px-10 py-4 rounded-full text-xl font-bold flex items-center gap-2">
               Synthesize Equation <Sparkles size={24}/>
             </button>
          </div>
        )}
      </div>

      <Capa 
        message={
          hasVerified && isCorrect ? "Perfect! Direct proportionality for Area, inverse for Distance, and the material matters too." : 
          hasVerified && !isCorrect ? "Not quite perfect. The real patterns are: Area increases Capacitance, Distance decreases Capacitance, and Material affects Capacitance." : 
          "Use the evidence you gathered in the Virtual Capacitor Lab and your Student Worksheet to identify the relationships, then verify."
        }
        mood={hasVerified && isCorrect ? 'happy' : 'normal'}
      />
    </div>
  );
};


const Step6Discover = ({ onNext }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex flex-col min-h-full py-8 px-4 sm:px-8 fade-in max-w-6xl mx-auto items-center justify-center">
      <h2 className="text-3xl font-bold mb-4 text-cyan-400">The Capacitance Equation</h2>
      <p className="text-slate-300 mb-8 text-center text-lg max-w-3xl">
        Your investigation showed that capacitance depends on the plate area, plate separation, and dielectric material.
        These relationships can be represented mathematically by the capacitance equation.
      </p>
      
      <div className="w-full glass-card py-12 px-4 sm:px-6 rounded-[3rem] mb-16 relative group border-cyan-500/50 hover:border-cyan-400 transition-all flex justify-center max-w-full overflow-x-auto no-scrollbar">
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[3rem] pointer-events-none"></div>
        
        {/* Responsive Text Size to prevent clipping */}
        <div className="flex items-center text-2xl min-[400px]:text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-white tracking-wider relative z-10 w-full justify-center whitespace-nowrap min-w-max">
          <span>C</span>
          <span className="mx-2 sm:mx-6 md:mx-8 text-cyan-500">=</span>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-4 border-b-2 sm:border-b-4 border-cyan-500 pb-2 sm:pb-4 mb-2 sm:mb-4">
               <span 
                 onMouseEnter={() => setHovered('epsilon')} onMouseLeave={() => setHovered(null)}
                 className={`cursor-pointer transition-all duration-300 ${hovered === 'epsilon' ? 'text-blue-400 scale-110 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]' : 'text-slate-300 hover:text-white'}`}
               >
                 ε
               </span>
               <span 
                 onMouseEnter={() => setHovered('area')} onMouseLeave={() => setHovered(null)}
                 className={`cursor-pointer transition-all duration-300 ${hovered === 'area' ? 'text-green-400 scale-110 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]' : 'text-slate-300 hover:text-white'}`}
               >
                 A
               </span>
            </div>
            <span 
              onMouseEnter={() => setHovered('distance')} onMouseLeave={() => setHovered(null)}
              className={`cursor-pointer transition-all duration-300 ${hovered === 'distance' ? 'text-red-400 scale-110 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]' : 'text-slate-300 hover:text-white'}`}
            >
              d
            </span>
          </div>
        </div>

        {/* Dynamic Tooltip */}
        <div className="absolute bottom-3 left-0 right-0 text-center h-8 sm:h-12 z-20">
          {hovered === 'epsilon' && <p className="text-blue-400 font-bold fade-in text-xs sm:text-xl">Permittivity (Material Property from your lab)</p>}
          {hovered === 'area' && <p className="text-green-400 font-bold fade-in text-xs sm:text-xl">Area of the plates (Directly Proportional)</p>}
          {hovered === 'distance' && <p className="text-red-400 font-bold fade-in text-xs sm:text-xl">Distance between plates (Inversely Proportional)</p>}
        </div>
      </div>

      <button onClick={onNext} className="glass-button px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 mt-4 relative z-30">
        Connect to Technology <Smartphone size={20}/>
      </button>

      <Capa message="Connect the variables in the equation to the patterns you observed in the Virtual Capacitor Lab." mood="happy"/>
    </div>
  );
};

const Step7Tech = ({ onNext }) => {
  const [showFinger, setShowFinger] = useState(false);

  return (
    <div className="flex flex-col h-full p-8 fade-in max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 text-cyan-400">
        <Cpu className="text-blue-500" /> Technology Explained
      </h2>
      <p className="text-slate-300 mb-8">Now, let's return to the touchscreen and connect your findings to the technology.</p>

      <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
        {/* Exploded View Animation */}
        <div className="relative h-[500px] w-full flex items-center justify-center perspective-[1200px]">
          
          <div className="relative w-64 h-96" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateZ(-30deg)' }}>
            
            {/* Layer 1: Glass */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl transition-all duration-700 ease-in-out" style={{ transform: showFinger ? 'translateZ(100px)' : 'translateZ(80px)' }}>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full"></div>
            </div>

            {/* Layer 2: ITO Grid (Capacitors) */}
            <div className="absolute inset-0 bg-blue-900/30 border border-blue-400/50 rounded-3xl transition-all duration-700 ease-in-out flex flex-col justify-between p-4" style={{ transform: showFinger ? 'translateZ(50px)' : 'translateZ(40px)' }}>
               <div className="grid grid-cols-4 grid-rows-6 w-full h-full gap-1 opacity-60">
                 {[...Array(24)].map((_, i) => (
                   <div key={i} className={`border border-blue-400/30 rounded-sm transition-all duration-300 ${showFinger && i === 9 ? 'bg-cyan-400/80 shadow-[0_0_20px_#22d3ee] scale-110' : ''}`}></div>
                 ))}
               </div>
            </div>

            {/* Layer 3: Display */}
            <div className="absolute inset-0 bg-slate-800 border border-slate-600 rounded-3xl transition-all duration-700 ease-in-out overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 p-4">
                 <div className="w-full h-full border border-white/5 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              </div>
            </div>

            {/* Simulated Finger approach */}
            <div 
              className={`absolute top-1/4 left-1/4 w-12 h-12 bg-rose-300/80 rounded-full blur-sm transition-all duration-1000 ease-out z-50 pointer-events-none flex items-center justify-center`}
              style={{ 
                transform: showFinger ? 'translateZ(120px) scale(1)' : 'translateZ(300px) scale(0)',
                opacity: showFinger ? 1 : 0
              }}
            >
              {/* Field stealing visualization */}
              <svg className="absolute w-32 h-32 -left-10 -top-10 animate-spin-slow">
                 <circle cx="64" cy="64" r="30" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 8" />
              </svg>
            </div>

          </div>
        </div>

        {/* Explanation Text */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4 text-white">Projected Capacitive Touch</h3>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              The screen contains a grid of microscopic capacitors made of Indium Tin Oxide (ITO). They hold a steady electrostatic field.
            </p>
            <div className="p-4 bg-blue-900/40 rounded-xl border border-blue-500/30">
              <p className="font-mono text-cyan-300 font-bold mb-2">&gt; The Biological Conductor</p>
              <p className="text-slate-300">
                Because the human body is conductive (filled with saltwater), bringing your finger close acts as a <strong>third plate</strong>. 
                Your finger "steals" some of the electric charge, altering the capacitance (C) at that specific grid intersection.
              </p>
            </div>
            <button 
              onClick={() => setShowFinger(!showFinger)}
              className="mt-8 glass-button w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              {showFinger ? 'Remove Finger' : 'Simulate Touch'} <Zap size={20}/>
            </button>
          </div>

          {showFinger && (
            <div className="flex justify-end fade-in">
              <button onClick={onNext} className="text-cyan-400 font-bold flex items-center gap-2 hover:text-white transition-colors">
                Next: Engineering Challenge <ChevronRight/>
              </button>
            </div>
          )}
        </div>
      </div>
      <Capa message="Look closely! The plastic pen didn't work earlier because it's an insulator—it can't 'steal' charge and change the capacitance!" />
    </div>
  );
};

const Step8Challenge = ({ onNext, setGlobalXp }) => {
  const [selected, setSelected] = useState(null);
  const [hasTested, setHasTested] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleTest = () => {
    if (selected === 2) {
      setIsSuccess(true);
      setGlobalXp(prev => prev + 300);
    } else {
      setIsSuccess(false);
      setGlobalXp(prev => prev + 50); // Minor XP for participating, but allows continuing
    }
    setHasTested(true);
  };

  const getCardStyle = (id) => {
    if (hasTested && id === 2 && isSuccess) return 'bg-green-900/50 border-green-500 ring-2 ring-green-400';
    if (selected === id) return 'bg-blue-900/50 border-cyan-400';
    return 'glass hover:border-cyan-400 border-transparent';
  };

  return (
    <div className="flex flex-col min-h-full py-8 px-4 sm:px-8 fade-in max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-cyan-400 mb-2">
          <Wrench className="text-blue-500" /> Engineering Challenge
        </h2>
        <p className="text-slate-300">Apply your knowledge to solve a real-world design problem.</p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border-red-500/30 relative overflow-hidden mb-8 shadow-[0_4px_30px_rgba(239,68,68,0.2)]">
        <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
        <h3 className="text-2xl font-bold mb-4">Problem: The Winter Glove</h3>
        
        <p className="text-base sm:text-lg text-slate-300 mb-4">
          <strong>Scenario:</strong> Imagine it is freezing outside. You are wearing thick winter gloves and try to answer an urgent call, but your smartphone screen completely ignores your touch.
        </p>
        <p className="text-base sm:text-lg text-slate-300 mb-4">
          <strong>The Physics:</strong> Ordinary gloves are thick electrical insulators. They block your finger from acting as a conductive plate and drastically increase the distance (d) to the screen's internal ITO grid.
        </p>
        <p className="text-base sm:text-lg text-slate-300 mb-6">
          According to the formula <strong>C = εA/d</strong>, increasing this distance (d) makes the capacitance (C) drop so tremendously low that the controller fails to detect it.
        </p>
        <div className="font-bold text-white bg-blue-900/40 p-5 rounded-xl border border-blue-500/30">
          Your task as an engineer: Select the most effective redesign to ensure the touchscreen can still detect the tiny capacitance changes caused by a gloved finger.
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <button 
          disabled={hasTested}
          onClick={() => setSelected(1)}
          className={`p-6 rounded-2xl border text-left transition-all ${getCardStyle(1)} flex flex-col h-full`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-4 font-bold shrink-0">A</div>
          <h4 className="font-bold mb-2">Increase Glass Thickness</h4>
          <p className="text-sm text-slate-400">Make the screen thicker to conduct more electricity.</p>
        </button>

        <button 
          disabled={hasTested}
          onClick={() => setSelected(2)}
          className={`p-6 rounded-2xl border text-left transition-all ${getCardStyle(2)} flex flex-col h-full`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-4 font-bold shrink-0">B</div>
          <h4 className="font-bold mb-2">Increase Controller Sensitivity</h4>
          <p className="text-sm text-slate-400">Program the chip to detect much smaller changes in Capacitance.</p>
        </button>

        <button 
          disabled={hasTested}
          onClick={() => setSelected(3)}
          className={`p-6 rounded-2xl border text-left transition-all ${getCardStyle(3)} flex flex-col h-full`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-4 font-bold shrink-0">C</div>
          <h4 className="font-bold mb-2">Decrease Grid Area (A)</h4>
          <p className="text-sm text-slate-400">Make the capacitors smaller to focus the charge.</p>
        </button>
      </div>

      <div className="flex flex-col items-center min-h-[7rem] justify-center mt-4 mb-8">
        {!hasTested ? (
          <button 
            disabled={!selected} 
            onClick={handleTest} 
            className="glass-button px-10 py-3 rounded-xl font-bold transition-all"
          >
             Test Prototype
          </button>
        ) : (
          <div className="flex flex-col items-center fade-in text-center">
            <p className={`${isSuccess ? 'text-green-400' : 'text-red-400'} font-bold mb-6 text-lg sm:text-xl max-w-3xl`}>
              {isSuccess 
                ? 'Design Successful! This is exactly how "Glove Mode" works.' 
                : 'Simulation Failed. The redesign did not work. Controller sensitivity is the true solution, but your attempt has been recorded. Let\'s proceed.'}
            </p>
            <button onClick={onNext} className="glass-button px-10 py-4 rounded-full font-bold flex items-center gap-2">
              Final Reflection <ChevronRight size={20}/>
            </button>
          </div>
        )}
      </div>

      <Capa 
        message={
          hasTested && isSuccess ? "You're a natural engineer!" : 
          hasTested && !isSuccess ? "Incorrect design. If distance (d) increases, C drops. The hardware must be far more sensitive to read it." : 
          "Select a design proposal and test your prototype."
        } 
        mood={hasTested && isSuccess ? 'happy' : 'normal'}
      />
    </div>
  );
};

const Step9Reflection = ({ xp, setGlobalXp }) => {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);

  const checkReport = () => {
    const textLower = text.toLowerCase();
    const keywords = ['capacitance', 'conductor', 'insulator', 'charge', 'electric', 'dielectric', 'field', 'distance', 'area', 'equation'];
    const matches = keywords.filter(kw => textLower.includes(kw));

    let xpToAward = 0;
    let finalFeedback = "";

    // Authentic evaluation: allow submission regardless of correctness
    if (matches.length >= 3) {
      xpToAward = 200 + (matches.length * 30);
      finalFeedback = "Outstanding analysis! You successfully utilized multiple scientific concepts to accurately explain the phenomenon.";
    } else if (matches.length > 0) {
      xpToAward = 100;
      finalFeedback = "Good effort! Your report touched on key ideas, but reviewing concepts like 'insulator' and 'capacitance' would make your reasoning much stronger.";
    } else {
      xpToAward = 50;
      finalFeedback = "Your report was submitted, but it missed the core scientific concepts. A true engineer relies on evidence-based terminology like 'capacitance' or 'conductors'. Keep learning!";
    }

    setEarnedXP(xpToAward);
    setGlobalXp(prev => prev + xpToAward);
    setFeedback(finalFeedback);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-full py-8 px-4 sm:px-8 fade-in max-w-4xl mx-auto items-center justify-center">
      
      {!submitted ? (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="w-full glass-card p-6 sm:p-8 rounded-3xl mb-8 relative border border-transparent">
             <BookOpen className="absolute -top-6 -left-6 w-12 h-12 text-cyan-400 bg-slate-900 rounded-full p-2 shadow-lg" />
             <h2 className="text-3xl font-bold mb-6 text-center text-white">Mission Report</h2>
             <p className="text-lg text-slate-300 mb-4">
               To officially complete this mission, submit your final analysis of the original phenomenon:
             </p>
             <div className="font-bold text-cyan-300 text-lg sm:text-xl text-center p-4 bg-slate-900/50 rounded-xl mb-6 border border-cyan-900/50">
               "Why can a finger operate a smartphone while a plastic pen cannot?"
             </div>

             <textarea 
               className="w-full h-48 bg-slate-900/80 border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 resize-none shadow-inner"
               placeholder="Formulate your explanation here..."
               value={text}
               onChange={(e) => setText(e.target.value)}
             ></textarea>
             
             <div className="flex justify-end mt-6">
                <button 
                  disabled={text.trim().length < 5}
                  onClick={checkReport} 
                  className="glass-button px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Final Report
                </button>
             </div>
          </div>
          <Capa message="Synthesize everything you've learned. Provide evidence-based reasoning just like a real engineer!" />
        </div>
      ) : (
        <div className="text-center fade-in max-w-2xl w-full">
           <div className="relative inline-block mb-6">
             <div className="absolute inset-0 bg-cyan-400 blur-[50px] opacity-50 rounded-full"></div>
             <Award size={100} className="text-cyan-400 relative z-10 animate-float" />
           </div>
           <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
             MISSION ACCOMPLISHED
           </h1>
           <p className="text-xl text-slate-300 mb-6">Young Physics Engineer</p>
           
           <div className="glass-card p-6 rounded-2xl mb-8 border-cyan-500/30">
              <h3 className="font-bold text-cyan-300 mb-2 uppercase tracking-wide text-sm">Evaluation Feedback</h3>
              <p className="text-slate-200 text-lg">{feedback}</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-center items-center gap-2">
                <span className="text-slate-400">Report Score:</span>
                <span className="font-mono font-bold text-green-400">+{earnedXP} XP</span>
              </div>
           </div>
           
           <div className="glass px-8 py-4 rounded-full inline-flex items-center gap-4 border-cyan-500/50 justify-center">
             <span className="text-slate-400 text-lg">Total Mission XP Earned:</span>
             <span className="text-3xl font-mono font-bold text-cyan-400">{xp} XP</span>
           </div>
           
           <Capa message="Mission fully evaluated! You didn't just memorize physics today—you discovered it. See you on the next mission!" mood="happy" />
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [step, setStep] = useState(1);
  const [xp, setXp] = useState(0);

  const nextStep = () => {
    if (step < 9) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="relative min-h-[100dvh] w-full flex flex-col text-slate-50 overflow-hidden font-sans select-none">
        <Background />

        {step > 1 && (
          <header className="h-16 sm:h-20 w-full flex items-center justify-between px-8 relative z-40 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button onClick={prevStep} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Previous phase">
                <ChevronLeft size={24} />
              </button>
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center gap-2">
                <Layers size={18} className="text-blue-400"/>
                PHX-EDU-CORE
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out" style={{ width: `${(step / 9) * 100}%` }}></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider hidden sm:flex">
                <span>Observe</span><span>Investigate</span><span>Apply</span>
              </div>
            </div>

            <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2 border-cyan-500/30 shrink-0">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="font-mono font-bold text-cyan-300">{xp}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">XP</span>
            </div>
          </header>
        )}

        <main className="flex-1 relative overflow-y-auto overflow-x-hidden scroll-smooth pb-24 md:pb-32">
          {step === 1 && <Step1Landing onNext={nextStep} />}
          {step === 2 && <Step2Observe onNext={nextStep} setGlobalXp={setXp} />}
          {step === 3 && <Step3Prepare onNext={nextStep} />}
          {step === 4 && <Step4Investigate onNext={nextStep} setGlobalXp={setXp} />}
          {step === 5 && <Step5Analyze onNext={nextStep} setGlobalXp={setXp} />}
          {step === 6 && <Step6Discover onNext={nextStep} />}
          {step === 7 && <Step7Tech onNext={nextStep} />}
          {step === 8 && <Step8Challenge onNext={nextStep} setGlobalXp={setXp} />}
          {step === 9 && <Step9Reflection xp={xp} setGlobalXp={setXp} />}
        </main>
      </div>
    </>
  );
}