import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Activity, Calculator, Heart, Shield, Moon, Sun, Utensils, Home,
  ChevronRight, Dumbbell, Users, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';

const NavItem = ({ to, icon: Icon, label, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="w-full">
      <div
        className={twMerge(
          "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-marine-red/10 text-marine-red font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        <Icon size={20} className={clsx(isActive ? "text-marine-red" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200")} />

        {isOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}

        {isActive && isOpen && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-0 w-1 h-8 bg-marine-red rounded-l-full"
          />
        )}
      </div>
    </Link>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-50 flex items-center justify-between px-4 no-print">
        <span className="font-bold text-xl text-marine-red flex items-center gap-2">
          <span className="text-2xl">⚓</span> MarineFit
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 dark:text-gray-300">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 240 : 80 }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 shadow-sm transition-colors duration-200 no-print"
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
          <div className={twMerge("flex items-center gap-2 overflow-hidden", !isOpen && "justify-center w-full")}>
            <span className="text-2xl">⚓</span>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-xl text-gray-900 dark:text-white tracking-tight"
              >
                Marine<span className="text-marine-red">Fit</span>
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <div className={clsx("text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3", !isOpen && "text-center")}>
            {isOpen ? "Menu" : "..."}
          </div>

          <NavItem to="/" icon={Home} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/pt-coach" icon={Activity} label="PT Coach" isOpen={isOpen} />
          <NavItem to="/exercises" icon={Library} label="Exercise Library" isOpen={isOpen} />
          <NavItem to="/pft-prep" icon={Calculator} label="PFT/CFT Prep" isOpen={isOpen} />
          <NavItem to="/body-comp" icon={Heart} label="Body Comp" isOpen={isOpen} />

          <div className="my-4 border-t border-gray-100 dark:border-gray-700" />

          <div className={clsx("text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3", !isOpen && "text-center")}>
            {isOpen ? "Wellness" : "..."}
          </div>

          <NavItem to="/nutrition" icon={Utensils} label="Nutrition" isOpen={isOpen} />
          <NavItem to="/injury-prevention" icon={Shield} label="Injury Prev" isOpen={isOpen} />
          <NavItem to="/sleep" icon={Moon} label="Sleep" isOpen={isOpen} />
        </div>

        {/* Theme Toggle & Collapse */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className={twMerge(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              !isOpen && "justify-center"
            )}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {isOpen && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {isOpen ? <div className="flex items-center gap-2 text-sm">Collapse <ChevronRight className="rotate-180" size={16}/></div> : <ChevronRight size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40 mt-16"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="bg-white dark:bg-gray-800 w-3/4 h-full p-4 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-2">
                 <NavItem to="/" icon={Home} label="Dashboard" isOpen={true} />
                 <NavItem to="/pt-coach" icon={Activity} label="PT Coach" isOpen={true} />
                 <NavItem to="/exercises" icon={Library} label="Exercise Library" isOpen={true} />
                 <NavItem to="/pft-prep" icon={Calculator} label="PFT/CFT Prep" isOpen={true} />
                 <NavItem to="/body-comp" icon={Heart} label="Body Comp" isOpen={true} />
                 <NavItem to="/nutrition" icon={Utensils} label="Nutrition" isOpen={true} />
                 <NavItem to="/injury-prevention" icon={Shield} label="Injury Prev" isOpen={true} />
                 <NavItem to="/sleep" icon={Moon} label="Sleep" isOpen={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
