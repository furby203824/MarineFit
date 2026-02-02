import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";

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

const setColors = [
  "#C8102E", // Marine Red
  "#E8453C",
  "#F28C28",
  "#D4A017",
  "#8B7D3C",
];

const setLabels = ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"];

export const MaxRepFinder = ({ onSelectWeek }) => {
  const [maxReps, setMaxReps] = useState("");
  const [result, setResult] = useState(null);

  const calculate = (val) => {
    setMaxReps(val);
    if (!val || isNaN(val) || parseInt(val) < 3) {
      setResult(null);
      if (onSelectWeek) onSelectWeek(null);
      return;
    }
    const max = parseInt(val);
    const target = max - 2;

    if (target < 3) {
      setResult({ message: `${max} - 2 = ${target}. Build to at least 5 pull-ups before starting.`, weeks: [] });
      if (onSelectWeek) onSelectWeek(null);
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
    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 mb-8">
      <div className="font-bebas text-lg tracking-wider text-marine-red mb-2">
        FIND YOUR STARTING WEEK
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        Do a max set of pull-ups. Enter your number. Subtract 2 from your max and match it to the Set 1 reps for your starting week.
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            MAX PULL-UPS:
          </span>
          <input
            type="number"
            min="3"
            max="40"
            value={maxReps}
            onChange={(e) => calculate(e.target.value)}
            placeholder="0"
            className="w-16 p-2 bg-gray-900 border-2 border-marine-red/40 rounded-lg text-white text-lg font-mono font-bold text-center focus:outline-none focus:border-marine-red"
          />
        </div>
      </div>
      {result && (
        <div className="mt-4 p-3 bg-marine-red/10 rounded-lg border-l-4 border-marine-red flex items-center justify-between flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="font-mono font-bold text-marine-red text-sm">
            {result.message}
          </span>
        </div>
      )}
    </div>
  );
};

const PullupProgram = () => {
    const [highlightedWeek, setHighlightedWeek] = useState(null);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <Trophy className="text-yellow-500" size={24} />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recon Pull-up Progression</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">38-week linear progression program to max out your pull-ups.</p>
                    </div>
                </div>

                <MaxRepFinder onSelectWeek={setHighlightedWeek} />

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">Week</th>
                                {setLabels.map((label, i) => (
                                    <th key={i} className="px-4 py-3 text-center" style={{ color: setColors[i] }}>{label}</th>
                                ))}
                                <th className="px-4 py-3 rounded-tr-lg text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {programData.map((week) => (
                                <tr 
                                    key={week.week} 
                                    className={`
                                        transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50
                                        ${highlightedWeek === week.week ? 'bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-400/50' : ''}
                                    `}
                                >
                                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                                        Week {week.week}
                                    </td>
                                    {week.sets.map((reps, i) => (
                                        <td key={i} className="px-4 py-3 text-center font-mono font-medium text-gray-700 dark:text-gray-300">
                                            {reps}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right font-bold text-marine-red">
                                        {week.total}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PullupProgram;
