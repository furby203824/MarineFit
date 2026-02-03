import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Trophy, Target, BarChart2 } from "lucide-react";

const programData = [
  { week: 1, sets: [6, 5, 5, 4, 3], total: 23 },
  { week: 2, sets: [7, 6, 5, 4, 4], total: 26 },
  { week: 3, sets: [8, 6, 5, 5, 4], total: 28 },
  { week: 4, sets: [8, 7, 5, 5, 5], total: 30 },
  { week: 5, sets: [9, 7, 6, 5, 5], total: 32 },
  { week: 6, sets: [10, 7, 6, 6, 5], total: 34 },
  { week: 7, sets: [10, 8, 6, 6, 6], total: 36 },
  { week: 8, sets: [11, 8, 7, 6, 6], total: 38 },
  { week: 9, sets: [12, 8, 7, 7, 6], total: 40 },
  { week: 10, sets: [12, 9, 7, 7, 7], total: 42 },
  { week: 11, sets: [13, 9, 8, 7, 7], total: 44 },
  { week: 12, sets: [14, 9, 8, 8, 7], total: 46 },
  { week: 13, sets: [14, 10, 8, 8, 8], total: 48 },
  { week: 14, sets: [15, 10, 9, 8, 8], total: 50 },
  { week: 15, sets: [16, 10, 9, 9, 8], total: 52 },
  { week: 16, sets: [16, 11, 9, 9, 9], total: 54 },
  { week: 17, sets: [17, 11, 10, 9, 9], total: 56 },
  { week: 18, sets: [18, 11, 10, 10, 9], total: 58 },
  { week: 19, sets: [18, 12, 10, 10, 10], total: 60 },
  { week: 20, sets: [19, 12, 11, 10, 10], total: 62 },
  { week: 21, sets: [20, 12, 11, 11, 10], total: 64 },
  { week: 22, sets: [20, 13, 11, 11, 11], total: 66 },
  { week: 23, sets: [21, 13, 12, 11, 11], total: 68 },
  { week: 24, sets: [22, 13, 12, 12, 11], total: 70 },
  { week: 25, sets: [22, 14, 12, 12, 12], total: 72 },
  { week: 26, sets: [23, 14, 13, 12, 12], total: 74 },
  { week: 27, sets: [24, 14, 13, 13, 12], total: 76 },
  { week: 28, sets: [24, 15, 13, 13, 13], total: 78 },
  { week: 29, sets: [25, 15, 14, 13, 13], total: 80 },
  { week: 30, sets: [26, 15, 14, 14, 13], total: 82 },
  { week: 31, sets: [26, 16, 14, 14, 14], total: 84 },
  { week: 32, sets: [27, 16, 15, 14, 14], total: 86 },
  { week: 33, sets: [28, 16, 15, 15, 14], total: 88 },
  { week: 34, sets: [28, 17, 15, 15, 15], total: 90 },
  { week: 35, sets: [29, 17, 16, 15, 15], total: 92 },
  { week: 36, sets: [30, 17, 16, 16, 15], total: 94 },
  { week: 37, sets: [30, 18, 16, 16, 16], total: 96 },
  { week: 38, sets: [31, 18, 17, 16, 16], total: 98 },
];

// Gradient colors from Marine Red to Gold/Sand
const barColors = [
  "linear-gradient(90deg, #C8102E 0%, #a60d26 100%)", // Deep Red
  "linear-gradient(90deg, #D62E2E 0%, #b82525 100%)", // Lighter Red
  "linear-gradient(90deg, #E65C23 0%, #c44d1d 100%)", // Orange-Red
  "linear-gradient(90deg, #F08C1A 0%, #cf7815 100%)", // Orange-Gold
  "linear-gradient(90deg, #F9B208 0%, #d49706 100%)", // Gold
];

export const MaxRepFinder = ({ onSelectWeek }) => {
  const [maxReps, setMaxReps] = useState("");
  const [result, setResult] = useState(null);

  const calculate = (val) => {
    setMaxReps(val);
    if (!val || isNaN(val) || parseInt(val) < 3) {
      setResult(null);
      return;
    }
    const max = parseInt(val);
    const target = max - 2;

    if (target < 3) {
      setResult({ message: `${max} - 2 = ${target}. Build to at least 5 pull-ups before starting.`, weeks: [] });
      return;
    }
    if (target > 31) {
      setResult({ message: `${max} - 2 = ${target}. You exceed the program. Start at Week 38.`, weeks: [38] });
      if (onSelectWeek) onSelectWeek(38);
      return;
    }

    const matches = programData.filter((w) => w.sets[0] === target);
    if (matches.length > 0) {
      const weekNums = matches.map((m) => m.week);
      const weekList = matches.map((m) => `Week ${m.week}`).join(" or ");
      setResult({ message: `${max} - 2 = ${target}  →  Start at ${weekList}`, weeks: weekNums });
      if (onSelectWeek) onSelectWeek(weekNums[0]);
    } else {
      const closest = programData.reduce((prev, curr) =>
        Math.abs(curr.sets[0] - target) < Math.abs(prev.sets[0] - target) ? curr : prev
      );
      setResult({ message: `${max} - 2 = ${target}. Closest: Week ${closest.week} (Set 1 = ${closest.sets[0]})`, weeks: [closest.week] });
      if (onSelectWeek) onSelectWeek(closest.week);
    }
  };

  return (
    <div className="bg-[#0d1821] border border-[#C8102E]/30 rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8102E]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="font-bebas text-lg tracking-wider text-[#C8102E] mb-2 flex items-center gap-2">
        <Target size={20} />
        FIND YOUR STARTING WEEK
      </div>
      <div className="font-plex-sans text-sm text-gray-400 mb-4 leading-relaxed max-w-2xl">
        Enter your max set of pull-ups. The calculator will subtract 2 reps to determine your starting "Set 1" volume.
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 bg-black/20 p-2 pr-4 rounded-lg border border-gray-800">
          <span className="font-plex-sans text-xs font-bold text-gray-500 uppercase tracking-wider pl-2">
            Max Reps
          </span>
          <input
            type="number"
            min="3"
            max="40"
            value={maxReps}
            onChange={(e) => calculate(e.target.value)}
            placeholder="0"
            className="w-16 bg-transparent text-white text-xl font-plex-mono font-bold text-center focus:outline-none border-b-2 border-[#C8102E] pb-1"
          />
        </div>
        
        {result && (
          <div className="flex-1 animate-in fade-in slide-in-from-left-2">
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-[#C8102E]/10 border border-[#C8102E]/30 text-[#ff4d4d] font-plex-mono text-sm font-bold">
              {result.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WeekSlider = ({ weeks, selectedWeek, onSelectWeek }) => {
  const scrollContainerRef = useRef(null);

  // Auto-scroll to selected week
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedEl = scrollContainerRef.current.querySelector(`[data-week="${selectedWeek}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedWeek]);

  const maxTotal = 98; // Max reps in week 38

  return (
    <div 
      ref={scrollContainerRef}
      className="flex gap-2 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {weeks.map((week) => {
        const isSelected = selectedWeek === week.week;
        const heightPercent = (week.total / maxTotal) * 100;
        
        return (
          <button
            key={week.week}
            data-week={week.week}
            onClick={() => onSelectWeek(week.week)}
            className={`
              relative group flex-shrink-0 w-14 flex flex-col items-center gap-2 snap-center transition-all duration-300
              ${isSelected ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}
            `}
          >
            {/* Total Label */}
            <span className={`
              text-xs font-plex-mono font-bold transition-colors
              ${isSelected ? 'text-white' : 'text-gray-500'}
            `}>
              {week.total}
            </span>

            {/* Bar Container */}
            <div className={`
              w-full h-32 rounded-lg relative overflow-hidden transition-all duration-300
              ${isSelected ? 'bg-gray-800 ring-2 ring-[#C8102E] ring-offset-2 ring-offset-[#0d1821]' : 'bg-gray-800/50'}
            `}>
              {/* Fill Bar */}
              <div 
                className={`
                  absolute bottom-0 left-0 w-full transition-all duration-500 ease-out
                  ${isSelected ? 'bg-[#C8102E]' : 'bg-gray-600'}
                `}
                style={{ height: `${Math.max(15, heightPercent)}%` }}
              ></div>
            </div>

            {/* Week Label */}
            <span className={`
              text-xs font-bebas tracking-wider transition-colors
              ${isSelected ? 'text-[#C8102E]' : 'text-gray-500'}
            `}>
              W{week.week}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const WeekDetail = ({ weekData, phase }) => {
  if (!weekData) return null;

  const maxSetReps = Math.max(...weekData.sets);
  
  // Calculate relative widths based on the max rep in this specific week (for better visual scaling)
  // Or use global max (31 reps) to show true scale? 
  // Let's use a local max relative to 35 for good visuals.
  const scaleMax = 35;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-baseline gap-4 mb-8">
        <h2 className="text-4xl font-bebas text-white tracking-wide">
          WEEK {weekData.week}
        </h2>
        <span className="text-gray-500 font-plex-mono text-sm">
          Phase {phase} of II
        </span>
      </div>

      <div className="bg-[#0d1821] rounded-2xl p-6 border border-gray-800 shadow-xl">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
          Set Breakdown
        </h3>
        
        <div className="space-y-6">
          {weekData.sets.map((reps, index) => (
            <div key={index} className="relative">
              <div className="flex items-center gap-4 mb-2">
                <span className={`
                  w-12 text-xs font-bold uppercase tracking-wider text-right
                  ${index === 0 ? 'text-[#C8102E]' : 'text-[#F9B208]'}
                `}>
                  Set {index + 1}
                </span>
                
                <div className="flex-1 h-10 bg-gray-800/30 rounded-md overflow-hidden relative group">
                  <div 
                    className="h-full rounded-r-md flex items-center justify-end px-3 transition-all duration-700 ease-out origin-left hover:brightness-110"
                    style={{ 
                      width: `${(reps / scaleMax) * 100}%`,
                      background: barColors[index]
                    }}
                  >
                    <span className="font-bebas text-lg text-white drop-shadow-md">
                      {reps}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PullupProgram = () => {
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [viewPhase, setViewPhase] = useState(1); // 1 or 2

    // Derived state
    const isPhase1 = viewPhase === 1;
    const currentWeeks = isPhase1 
      ? programData.slice(0, 19) 
      : programData.slice(19, 38);

    const activeWeekData = programData.find(w => w.week === selectedWeek) || programData[0];

    // Handlers
    const handleWeekSelect = (week) => {
      setSelectedWeek(week);
      // Auto-switch phase if needed
      if (week <= 19 && viewPhase !== 1) setViewPhase(1);
      if (week > 19 && viewPhase !== 2) setViewPhase(2);
    };

    const handlePhaseSwitch = (phase) => {
      setViewPhase(phase);
      // Auto-select first week of that phase
      if (phase === 1 && selectedWeek > 19) setSelectedWeek(1);
      if (phase === 2 && selectedWeek <= 19) setSelectedWeek(20);
    };

    return (
        <div className="space-y-6 bg-[#090f14] p-6 rounded-xl min-h-[600px] text-gray-100">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h3 className="text-2xl font-bebas tracking-wide text-white flex items-center gap-3">
                        <Trophy className="text-[#C8102E]" size={24} />
                        Recon Pull-up Progression
                    </h3>
                    <p className="font-plex-sans text-sm text-gray-400 mt-1">
                      38-week linear progression program
                    </p>
                </div>

                {/* Phase Toggles */}
                <div className="flex bg-[#0d1821] p-1 rounded-lg border border-gray-800">
                  <button
                    onClick={() => handlePhaseSwitch(1)}
                    className={`
                      px-4 py-2 rounded-md text-sm font-bebas tracking-wider transition-all
                      ${viewPhase === 1 
                        ? 'bg-[#C8102E] text-white shadow-lg shadow-red-900/20' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                    `}
                  >
                    WEEKS 1-19
                  </button>
                  <button
                    onClick={() => handlePhaseSwitch(2)}
                    className={`
                      px-4 py-2 rounded-md text-sm font-bebas tracking-wider transition-all
                      ${viewPhase === 2 
                        ? 'bg-[#C8102E] text-white shadow-lg shadow-red-900/20' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                    `}
                  >
                    WEEKS 20-38
                  </button>
                </div>
            </div>

            {/* Max Rep Finder Tool */}
            <MaxRepFinder onSelectWeek={handleWeekSelect} />

            {/* Week Slider */}
            <div className="relative">
              <WeekSlider 
                weeks={currentWeeks} 
                selectedWeek={selectedWeek} 
                onSelectWeek={handleWeekSelect} 
              />
              {/* Fade edges */}
              <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#090f14] to-transparent pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#090f14] to-transparent pointer-events-none"></div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gray-800 my-4"></div>

            {/* Detailed View */}
            <WeekDetail weekData={activeWeekData} phase={viewPhase === 1 ? "I" : "II"} />
        </div>
    );
};

export default PullupProgram;
