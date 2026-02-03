import React from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const SwapExerciseModal = ({
  trapRef,
  swapTarget,
  searchQuery,
  setSearchQuery,
  filteredExercises,
  onConfirmSwap,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        ref={trapRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Swap Exercise</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Replacing: <span className="font-semibold text-gray-700 dark:text-gray-300">{swapTarget.currentExercise.name}</span>
            <span className="ml-2 text-xs bg-marine-red/10 text-marine-red px-2 py-0.5 rounded">
              {swapTarget.currentExercise.category}
            </span>
          </p>
          {swapTarget.currentExercise.prescription && (
            <p className="text-xs text-gray-400 mb-3">
              Prescription will be preserved: {swapTarget.currentExercise.prescription.sets} x {swapTarget.currentExercise.prescription.reps}, Rest: {swapTarget.currentExercise.prescription.rest}
            </p>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search exercises in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No alternative exercises available for this category with your current equipment selection.
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onConfirmSwap(ex)}
                  disabled={ex.id === swapTarget.currentExercise.id}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    ex.id === swapTarget.currentExercise.id
                      ? 'bg-marine-red/10 border-marine-red cursor-not-allowed'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-transparent hover:border-marine-red'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{ex.name}</span>
                        {ex.id === swapTarget.currentExercise.id && (
                          <span className="text-xs bg-marine-red text-white px-1.5 py-0.5 rounded">Current</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                          {ex.equipment}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          ex.difficulty === 1 ? 'bg-green-100 text-green-700' :
                          ex.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Lvl {ex.difficulty}
                        </span>
                      </div>
                    </div>
                    {ex.id !== swapTarget.currentExercise.id && (
                      <RefreshCw size={18} className="text-marine-red" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwapExerciseModal;
