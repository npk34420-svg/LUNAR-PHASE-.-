
import React, { useState, useEffect, useMemo } from 'react';
import { MoonDisplay } from './components/MoonDisplay';
import { OrbitSimulator } from './components/OrbitSimulator';
import { getMoonData, getMoonDataByPhase } from './utils/lunarMath';
import { MoonData } from './types';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeMoonData, setActiveMoonData] = useState<MoonData>(getMoonData(new Date()));
  const [viewMode, setViewMode] = useState<'MAIN' | 'SIMULATOR'>('MAIN');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Custom Selector State for Simulator
  const [customType, setCustomType] = useState<'WAXING' | 'WANING'>('WAXING');
  const [customKram, setCustomKram] = useState<number>(8);

  useEffect(() => {
    setActiveMoonData(getMoonData(new Date(selectedDate)));
  }, [selectedDate]);

  const handleCustomSelect = () => {
    const data = getMoonDataByPhase(customType === 'WAXING', customKram);
    setActiveMoonData(data);
  };

  const cycleMoons = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const age = (i / 30) * 29.53;
      const illumination = (1 - Math.cos((age / 29.53) * 2 * Math.PI)) / 2;
      const isWaxing = age <= 14.765;
      return { age, illumination, isWaxing, index: i };
    });
  }, []);

  const handleMoonClick = (m: any) => {
    const kramValue = m.index <= 15 ? (Math.round((m.index / 15) * 15) || 1) : (Math.round(((m.index - 15) / 15) * 15) || 1);
    const label = m.index <= 15 ? `ขึ้น ${kramValue} ค่ำ` : `แรม ${kramValue} ค่ำ`;
    
    setActiveMoonData({
      age: m.age,
      illumination: m.illumination,
      isWaxing: m.isWaxing,
      phaseName: m.isWaxing ? "ข้างขึ้น" : "ข้างแรม",
      dayLabel: label
    });
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      {/* Landing Page Content */}
      <div className={`transition-all duration-700 w-full flex flex-col items-center ${isDetailOpen ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'}`}>
        <header className="text-center mt-8 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-4 drop-shadow-2xl">
            LUNAR <span className="text-blue-400">PHASES</span>
          </h1>
          <p className="text-blue-200/50 uppercase tracking-[0.3em] text-sm">เลือกดวงจันทร์เพื่อเริ่มต้นการสำรวจ</p>
        </header>

        <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">
          {/* Central Hint */}
          <div className="absolute z-0 text-center pointer-events-none">
             <div className="w-32 h-32 rounded-full border border-blue-400/10 animate-[ping_3s_infinite] absolute inset-0"></div>
             <div className="relative p-8 rounded-full bg-slate-900/40 backdrop-blur-sm border border-white/5">
                <span className="text-xs text-blue-300/40 block mb-1">CURRENT PHASE</span>
                <span className="text-xl font-bold text-white block">30 DAYS CYCLE</span>
             </div>
          </div>

          {cycleMoons.map((m, idx) => {
            const angle = (idx / 30) * 360 - 90;
            const radius = 260; // Larger circle for landing
            return (
              <div 
                key={idx}
                className="absolute cursor-pointer group"
                style={{
                  transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
                }}
                onClick={() => handleMoonClick(m)}
              >
                <div className="relative transition-all duration-500 group-hover:scale-150">
                  <MoonDisplay 
                    illumination={m.illumination} 
                    isWaxing={m.isWaxing} 
                    size={42} 
                    glow={false}
                  />
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:ring-4 group-hover:ring-blue-400/50 group-hover:shadow-[0_0_20px_rgba(96,165,250,0.8)] transition-all"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Overlay / Sub-view */}
      {isDetailOpen && (
        <div className="w-full max-w-6xl animate-in fade-in zoom-in duration-500 flex flex-col items-center">
          {/* Navigation Bar */}
          <div className="w-full flex justify-between items-center mb-8 px-4 py-3 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <button 
              onClick={() => setIsDetailOpen(false)}
              className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors px-4 py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span>กลับหน้าหลัก</span>
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('MAIN')}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${viewMode === 'MAIN' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`}
              >
                ดูรายละเอียด
              </button>
              <button 
                onClick={() => setViewMode('SIMULATOR')}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${viewMode === 'SIMULATOR' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`}
              >
                แบบจำลองวงโคจร
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-md border border-blue-500/20 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-blue-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  เลือกวันที่ต้องการสำรวจ
                </h3>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-900 border border-blue-400/30 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-4"
                />
                <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-300/10 text-center">
                  <p className="text-5xl font-black text-white mb-2">{activeMoonData.dayLabel}</p>
                  <p className="text-blue-300 font-medium tracking-widest uppercase">{activeMoonData.phaseName}</p>
                </div>
              </div>

              {viewMode === 'SIMULATOR' && (
                <div className="bg-slate-800/40 backdrop-blur-md border border-indigo-500/20 rounded-3xl p-6 shadow-xl animate-in slide-in-from-left duration-500">
                  <h3 className="text-lg font-bold text-indigo-100 mb-4">ปรับแต่งแบบจำลอง</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-slate-900 rounded-xl">
                      <button 
                        onClick={() => setCustomType('WAXING')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${customType === 'WAXING' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                      >ข้างขึ้น</button>
                      <button 
                        onClick={() => setCustomType('WANING')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${customType === 'WANING' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                      >ข้างแรม</button>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>1 ค่ำ</span>
                        <span className="text-blue-400">{customKram} ค่ำ</span>
                        <span>15 ค่ำ</span>
                      </div>
                      <input 
                        type="range" min="1" max="15" 
                        value={customKram} 
                        onChange={(e) => setCustomKram(parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <button 
                      onClick={handleCustomSelect}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      อัปเดตแบบจำลอง
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Display Area */}
            <div className="lg:col-span-8 bg-slate-800/30 border border-white/5 rounded-3xl p-8 min-h-[500px] flex items-center justify-center relative overflow-hidden">
               {viewMode === 'MAIN' ? (
                 <div className="flex flex-col items-center animate-in zoom-in duration-700">
                   <div className="relative">
                     <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
                     <MoonDisplay illumination={activeMoonData.illumination} isWaxing={activeMoonData.isWaxing} size={280} glow={true} />
                   </div>
                   <div className="mt-12 text-center max-w-md">
                     <p className="text-blue-100 text-lg leading-relaxed">
                       ในคืนนี้ ดวงจันทร์ปรากฏเป็น <span className="text-blue-400 font-bold">{activeMoonData.dayLabel}</span> โดยมีความสว่างประมาณ <span className="text-blue-400 font-bold">{Math.round(activeMoonData.illumination * 100)}%</span> ของพื้นที่ทั้งหมด
                     </p>
                   </div>
                 </div>
               ) : (
                 <div className="w-full animate-in fade-in duration-500">
                   <OrbitSimulator age={activeMoonData.age} />
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      {!isDetailOpen && (
        <footer className="mt-auto mb-8 text-slate-600 text-xs font-mono uppercase tracking-widest">
          Created for Space Enthusiasts • {new Date().getFullYear()}
        </footer>
      )}
    </div>
  );
};

export default App;
