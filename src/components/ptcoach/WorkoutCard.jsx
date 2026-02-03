import React from 'react';
import { Save, Printer, Download, FileText, FileSpreadsheet, File, PlayCircle, RefreshCw, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { exportToPDF, exportToExcel, exportToWord } from '../../utils/workoutExport';
import { motion } from 'framer-motion';

const WorkoutCard = ({
  workout,
  showExportMenu,
  setShowExportMenu,
  showFeedback,
  setShowFeedback,
  onSave,
  onSwapExercise,
  onFeedback,
}) => {
  return (
    <motion.div
      key={workout.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-600 pb-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {workout.title}
        </h3>
        <div className="flex gap-2 items-center">
          <button onClick={onSave} className="p-2 text-gray-500 hover:text-marine-red transition-colors" title="Save Workout">
            <Save size={18} />
          </button>
          <button onClick={() => window.print()} className="p-2 text-gray-500 hover:text-marine-red transition-colors" title="Print Card">
            <Printer size={18} />
          </button>
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 text-gray-500 hover:text-marine-red transition-colors flex items-center gap-1"
              title="Export Workout"
            >
              <Download size={18} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-50 min-w-[140px]">
                <button
                  onClick={async () => { try { await exportToPDF(workout); } catch (e) { console.error('PDF export failed:', e); alert('Export failed. Please try again.'); } setShowExportMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileText size={16} className="text-red-600" /> PDF
                </button>
                <button
                  onClick={async () => { try { await exportToExcel(workout); } catch (e) { console.error('Excel export failed:', e); alert('Export failed. Please try again.'); } setShowExportMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileSpreadsheet size={16} className="text-green-600" /> Excel
                </button>
                <button
                  onClick={async () => { try { await exportToWord(workout); } catch (e) { console.error('Word export failed:', e); alert('Export failed. Please try again.'); } setShowExportMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <File size={16} className="text-blue-600" /> Word
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {workout.blocks.map((block, bIdx) => (
        <div key={bIdx} className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-marine-red border-l-4 border-marine-red pl-3">
            {block.name}
          </h4>
          <div className="grid gap-3">
            {block.exercises.map((ex, idx) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white">{ex.name}</span>
                      <span className="text-xs bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 text-gray-500">
                        {ex.equipment}
                      </span>
                    </div>
                    {/* Prescription Display */}
                    {ex.prescription && (
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="bg-marine-red/10 text-marine-red px-2 py-0.5 rounded font-medium">
                          {ex.prescription.sets} x {ex.prescription.reps}
                        </span>
                        {ex.prescription.rest !== '0s' && (
                          <span className="text-gray-500">
                            Rest: {ex.prescription.rest}
                          </span>
                        )}
                        {ex.prescription.notes && (
                          <span className="text-gray-400 italic text-xs hidden sm:inline">
                            {ex.prescription.notes}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => onSwapExercise(bIdx, idx)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Swap Exercise"
                    >
                      <RefreshCw size={18} />
                    </button>
                    {ex.url && (
                      <a
                        href={ex.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-marine-red hover:bg-white rounded-full transition-colors"
                        title="Watch Demo"
                      >
                        <PlayCircle size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Feedback Loop */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        {!showFeedback && !workout.feedback ? (
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full py-2 text-sm text-gray-500 hover:text-marine-red transition-colors underline"
          >
            Complete Workout & Provide Feedback
          </button>
        ) : workout.feedback ? (
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
            <p className="flex items-center justify-center gap-2 font-semibold text-green-800">
              <CheckCircle size={18} /> AAR Submitted
            </p>
            <p className="text-xs text-green-600 mt-1">
              Rating: {workout.feedback.rating === 'good' ? 'Good to Go' : 'Too Hard'}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center"
          >
            <p className="font-semibold text-gray-900 dark:text-white mb-3">How was the mission?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => onFeedback('good')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:border-marine-red hover:text-marine-red transition-all"
              >
                <ThumbsUp size={18} /> Good to Go
              </button>
              <button
                onClick={() => onFeedback('hard')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
              >
                <ThumbsDown size={18} /> Too Hard
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Feedback helps optimize your future cards.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WorkoutCard;
