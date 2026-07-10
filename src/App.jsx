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
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-expand when a new message arrives
  useEffect(() => {
    setIsMinimized(false);
  }, [message]);

  return (
    <div 
      className="fixed z-[100] flex items-end gap-4 max-w-[85vw] sm:max-w-sm fade-in transition-all duration-300"
      style={{ bottom: '1.5rem', right: '1.5rem' }}
    >
      {message && !isMinimized && (
        <div className="glass p-4 rounded-2xl rounded-br-none text-sm font-medium shadow-2xl relative border-blue-500/30 mb-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            className="absolute -top-3 -right-3 bg-slate-800 text-slate-300 hover:text-white rounded-full p-1 border border-slate-500 z-10 transition-colors shadow-lg"
            title="Minimize AI Assistant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <p className="text-blue-100 leading-relaxed pr-2">{message}</p>
        </div>
      )}
      <div 
        className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative cursor-pointer group transition-transform ${isMinimized ? 'opacity-80 hover:opacity-100 hover:scale-110' : 'animate-float'}`}
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? "Expand AI Assistant" : "Minimize AI Assistant"}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
        <div className="w-full h-full glass-card rounded-full flex items-center justify-center border-blue-400 relative overflow-hidden">
          {/* Eyes */}
          <div className="flex gap-2">
            <div className={`w-2 h-3 bg-cyan-300 rounded-full ${mood === 'happy' ? 'animate-pulse' : ''}`}></div>
            <div className={`w-2 h-3 bg-cyan-300 rounded-full ${mood === 'happy' ? 'animate-pulse' : ''}`}></div>
          </div>
          {/* Antenna */}
          <div className="absolute top-1 w-1 h-2 bg-blue-400 rounded-t-full"></div>
        </div>
      </div>
    </div>
  );
};

// --- PAGES / STEPS ---

const Step1Landing = ({ onNext }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 fade-in relative">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full"></div>
    <div className="glass px-4 py-1 rounded-full text-cyan-400 text-sm font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
      <Zap size={16} /> Physics Engineering Mission
    </div>
    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
      THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">TOUCHSCREEN</span><br/>MYSTERY
    </h1>
    <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl font-light">
      Millions use it daily. Few understand it. <br/> Put on your engineer's hat and uncover the invisible forces at your fingertips.
    </p>
    <button onClick={onNext} className="glass-button px-10 py-5 rounded-full text-xl font-bold flex items-center gap-3 animate-pulse-glow">
      START THE MISSION <ChevronRight size={24} />
    </button>
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
      <p className="text-slate-300 mb-8">Interact with the smartphone prototype using different objects.</p>

      <div className="flex-1 grid md:grid-cols-2 gap-12 items-center">
        {/* Smartphone Simulator */}
        <div className="flex justify-center relative">
          <div className="w-64 h-[500px] glass-card rounded-[3rem] border-8 border-slate-800 p-2 relative shadow-2xl flex flex-col justify-center items-center overflow-hidden">
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

          {allTested && (
            <div className="fade-in bg-blue-900/40 border border-blue-500/30 p-6 rounded-2xl">
              <p className="text-xl font-medium mb-4">"What is the smartphone actually detecting if it ignores pressure from the plastic pen?"</p>
              <button onClick={onNext} className="glass-button w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2">
                Formulate Hypothesis <ChevronRight size={20}/>
              </button>
            </div>
          )}
        </div>
      </div>
      <Capa message={allTested ? "Interesting! Both the finger and metallic stylus work, but the plastic doesn't. Why? (Psst... You can drag me if I'm in the way!)" : "Try testing all three objects to see how the screen reacts."} mood={allTested ? 'happy' : 'normal'} />
    </div>
  );
};

const Step3Predict = ({ onNext, setGlobalXp }) => {
  const [selected, setSelected] = useState(null);

  const options = [
    { id: 'heat', title: 'Heat Signature', desc: 'The screen detects body temperature.', icon: '🔥' },
    { id: 'pressure', title: 'Micro-Pressure', desc: 'It detects very slight physical pushes.', icon: '👇' },
    { id: 'electric', title: 'Electrical Properties', desc: 'It detects conductive materials.', icon: '⚡' },
    { id: 'moisture', title: 'Moisture', desc: 'It senses sweat or humidity from skin.', icon: '💧' }
  ];

  const handleSelect = (id) => {
    if (!selected) setGlobalXp(prev => prev + 50); // XP awarded for making a choice
    setSelected(id);
  };

  return (
    <div className="flex flex-col h-full p-8 fade-in max-w-5xl mx-auto items-center justify-center">
      <h2 className="text-4xl font-bold mb-4 text-center">What is your hypothesis?</h2>
      <p className="text-slate-300 mb-12 text-center max-w-2xl text-lg">Based on the observation, select the most scientifically logical explanation for how the touchscreen detects a touch.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {options.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
              selected === opt.id ? 'ring-4 ring-cyan-400 scale-105 bg-blue-900/50' : 'hover:scale-105 hover:bg-slate-800/50'
            }`}
          >
            <div className="text-4xl mb-4">{opt.icon}</div>
            <h3 className="text-xl font-bold mb-2">{opt.title}</h3>
            <p className="text-slate-400">{opt.desc}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fade-in">
          <button onClick={onNext} className="glass-button px-8 py-4 rounded-full font-bold flex items-center gap-2 text-lg">
            Test Hypothesis in the Lab <ChevronRight size={24}/>
          </button>
        </div>
      )}
      
      <Capa 
        message={selected ? "A good scientist always starts with a hypothesis! Now we need to design an experiment to test it. To the lab!" : "Take a guess! There are no wrong answers in a hypothesis, only opportunities to test your logic."} 
        mood={selected ? 'happy' : 'normal'}
      />
    </div>
  );
};

const Step4Investigate = ({ onNext, setGlobalXp }) => {
  const [area, setArea] = useState(50);
  const [distance, setDistance] = useState(25);
  const [dielectric, setDielectric] = useState(1); 
  
  const [explored, setExplored] = useState(new Set());
  const [bonusAwarded, setBonusAwarded] = useState(false); 

  const handleInteraction = (type) => {
    setExplored(prev => new Set(prev).add(type));
  };

  const capacitance = ((dielectric * area) / distance).toFixed(2);
  const hasExploredAll = explored.has('area') && explored.has('distance') && explored.has('material');
  
  useEffect(() => {
    if (area === 100 && distance === 5 && dielectric === 10 && !bonusAwarded) {
      setBonusAwarded(true);
      setGlobalXp(prev => prev + 150);
    }
  }, [area, distance, dielectric, bonusAwarded, setGlobalXp]);

  return (
    <div className="flex flex-col h-full p-8 fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-cyan-400">
            <Activity className="text-blue-500" /> Virtual Capacitor Lab
          </h2>
          <p className="text-slate-300 mt-2">Investigate the variables that affect a device's ability to store electrical charge (Capacitance).</p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl border-cyan-500/50">
          <p className="text-sm text-cyan-200 mb-1 font-mono uppercase">Live Reading</p>
          <div className="text-4xl font-mono font-bold text-cyan-400">
            {capacitance} <span className="text-xl">pF</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="glass-card p-6 rounded-3xl space-y-8 flex flex-col justify-center relative z-10">
          <div>
            <label className="flex justify-between font-bold mb-2">
              <span>Plate Area (A)</span>
              <span className="text-cyan-400">{area} mm²</span>
            </label>
            <input 
              type="range" min="10" max="100" value={area} 
              onChange={(e) => { setArea(Number(e.target.value)); handleInteraction('area'); }} 
              className="w-full" 
            />
            <p className="text-xs text-slate-400 mt-2">Controls the size of the conductive plates.</p>
          </div>

          <div>
            <label className="flex justify-between font-bold mb-2">
              <span>Plate Distance (d)</span>
              <span className="text-cyan-400">{distance} mm</span>
            </label>
            <input 
              type="range" min="5" max="50" value={distance} 
              onChange={(e) => { setDistance(Number(e.target.value)); handleInteraction('distance'); }} 
              className="w-full" 
            />
            <p className="text-xs text-slate-400 mt-2">Controls the gap between the plates.</p>
          </div>

          <div>
            <label className="font-bold mb-2 block">Material Between Plates</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => { setDielectric(1); handleInteraction('material'); }} className={`py-2 rounded-lg text-sm transition-all ${dielectric === 1 ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Air</button>
              <button onClick={() => { setDielectric(3.4); handleInteraction('material'); }} className={`py-2 rounded-lg text-sm transition-all ${dielectric === 3.4 ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Plastic</button>
              <button onClick={() => { setDielectric(10); handleInteraction('material'); }} className={`py-2 rounded-lg text-sm transition-all ${dielectric === 10 ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Glass</button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Changes the insulating substance in the gap.</p>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/80 shadow-inner">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative flex flex-col items-center justify-center h-64 w-full perspective-[1000px]">
            {/* Top Plate (+) */}
            <div 
              className="absolute bg-blue-400/80 border-2 border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center justify-center overflow-hidden transition-all duration-300 ease-out"
              style={{
                width: `${area * 3}px`,
                height: '20px',
                transform: `translateY(-${distance * 1.5}px) rotateX(60deg) rotateZ(-45deg)`,
                borderRadius: '4px'
              }}
            >
               <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-1 opacity-50 p-1">
                 {[...Array(Math.floor(area/5))].map((_, i) => <span key={i} className="text-[10px] font-bold text-white">+</span>)}
               </div>
            </div>

            {/* Dielectric representation */}
            {dielectric > 1 && (
              <div 
                className="absolute transition-all duration-300 ease-out pointer-events-none"
                style={{
                  width: `${area * 3}px`,
                  height: `${distance * 3}px`,
                  background: dielectric === 3.4 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(56, 189, 248, 0.2)', // Purple for plastic, Blue for glass
                  transform: `translateY(0) rotateX(60deg) rotateZ(-45deg)`,
                  borderLeft: '1px solid rgba(255,255,255,0.1)',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                }}
              ></div>
            )}

            {/* Electric Field Lines */}
            <svg className="absolute w-full h-full pointer-events-none" style={{ transform: 'rotateX(60deg) rotateZ(-45deg)' }}>
                {[...Array(Math.floor(area/10))].map((_, i) => (
                  <line 
                    key={i}
                    x1="50%" y1={`calc(50% - ${distance * 1.5}px)`}
                    x2="50%" y2={`calc(50% + ${distance * 1.5}px)`}
                    stroke="rgba(56, 189, 248, 0.4)" 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-field"
                    style={{ transform: `translateX(${(i - Math.floor(area/20)) * 10}px)` }}
                  />
                ))}
            </svg>

            {/* Bottom Plate (-) */}
            <div 
              className="absolute bg-slate-400/80 border-2 border-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.5)] flex items-center justify-center overflow-hidden transition-all duration-300 ease-out"
              style={{
                width: `${area * 3}px`,
                height: '20px',
                transform: `translateY(${distance * 1.5}px) rotateX(60deg) rotateZ(-45deg)`,
                borderRadius: '4px'
              }}
            >
               <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-1 opacity-50 p-1">
                 {[...Array(Math.floor(area/5))].map((_, i) => <span key={i} className="text-[10px] font-bold text-white">-</span>)}
               </div>
            </div>
          </div>
          
          {hasExploredAll && (
             <div className="absolute bottom-6 right-6 fade-in z-50">
               <button onClick={onNext} className="glass-button px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                 Analyze Data <ChevronRight size={18}/>
               </button>
             </div>
          )}
        </div>
      </div>
      <Capa 
        message={bonusAwarded ? "Maximum capacitance achieved! You've gathered excellent evidence." : hasExploredAll ? "You've successfully tested Area, Distance, and Material. Ready to analyze the data?" : "To collect valid evidence, make sure you test changing the Area, Distance, AND the Material."} 
        mood={bonusAwarded ? 'happy' : 'normal'}
      />
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
      <p className="text-slate-300 mb-8 text-center text-lg">Based on your lab evidence, verify the physical relationships.</p>

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
          "Use the evidence you gathered to select the correct relationships, then verify."
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
        You discovered that Area (A), Distance (d), and the Material all affect capacitance. 
        Scientists represent the material's property as <strong className="text-blue-400">Permittivity (ε)</strong>. 
        Together, they form the fundamental equation governing all capacitors.
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
        See Inside a Touchscreen <Smartphone size={20}/>
      </button>

      <Capa message="Hover over the variables! You just derived the equation based entirely on your own evidence." mood="happy"/>
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
      <p className="text-slate-300 mb-8">How does a smartphone use Capacitance to detect your touch?</p>

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

  // Prevent default scroll behavior
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div className="relative w-screen h-screen flex flex-col text-slate-50 overflow-hidden font-sans select-none">
        <Background />

        {/* Global Header / HUD */}
        {step > 1 && (
          <header className="h-20 w-full flex items-center justify-between px-8 relative z-40 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button onClick={prevStep} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft size={24} />
              </button>
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center gap-2">
                <Layers size={18} className="text-blue-400"/>
                PHX-EDU-CORE
              </div>
            </div>

            {/* Progress Indicator */}
        <div className="flex-1 max-w-md mx-8">
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
             <div 
               className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out"
               style={{ width: `${(step / 9) * 100}%` }}
             ></div>
           </div>
           <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider hidden sm:flex">
             <span>Observe</span>
             <span>Investigate</span>
             <span>Apply</span>
           </div>
        </div>

        {/* XP Counter */}
        <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2 border-cyan-500/30 shrink-0">
           <Sparkles size={16} className="text-cyan-400" />
           <span className="font-mono font-bold text-cyan-300">{xp}</span>
           <span className="text-xs text-slate-400 hidden sm:inline">XP</span>
        </div>
      </header>
    )}

    {/* Main Content Area */}
    <main className="flex-1 relative overflow-y-auto overflow-x-hidden scroll-smooth pb-40 md:pb-48">
      {step === 1 && <Step1Landing onNext={nextStep} />}
      {step === 2 && <Step2Observe onNext={nextStep} setGlobalXp={setXp} />}
          {step === 3 && <Step3Predict onNext={nextStep} setGlobalXp={setXp} />}
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