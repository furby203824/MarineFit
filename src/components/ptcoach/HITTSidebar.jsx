import React from 'react';
import { ExternalLink, Phone, Mail } from 'lucide-react';

const HITTSidebar = () => {
  return (
    <div className="space-y-6">
      <div className="card bg-marine-red text-white">
        <h2 className="text-white text-xl font-bold mb-4">HITT Methodology</h2>
        <p className="text-red-100 mb-4 leading-relaxed">
          Semper Fit's HITT is a comprehensive, combat-focused Strength and Conditioning program specifically for Marines.
          Aiming to make Marines <strong>COMBAT FIT. COMBAT READY.</strong>
        </p>
        <div className="space-y-3 mt-6">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <h3 className="text-marine-gold text-sm font-bold uppercase mb-1">For FFIs</h3>
            <p className="text-xs text-red-50">Consult your installation HITT Coordinator for programming help.</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <h3 className="text-marine-gold text-sm font-bold uppercase mb-1">For Commanders</h3>
            <p className="text-xs text-red-50">Ask about unit support and dedicated strength professionals.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
          <ExternalLink size={20} className="text-marine-red" />
          Resources
        </h3>
        <ul className="space-y-3">
          <li>
            <a href="https://www.usmc-mccs.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-marine-red transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <ExternalLink size={14} />
              </div>
              <span className="font-medium">Local MCCS Website</span>
            </a>
          </li>
          <li>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-2">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Phone size={14} />
              </div>
              <span className="font-medium">703-432-0732</span>
            </div>
          </li>
          <li>
            <a href="mailto:Lynda.Rummel@usmc-mccs.org" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-marine-red transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Mail size={14} />
              </div>
              <span className="font-medium text-sm truncate">Lynda.Rummel@usmc-mccs.org</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HITTSidebar;
