import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Activity, Calculator, Heart, Shield, Moon, Sun, Utensils, Home,
  ChevronRight, Dumbbell, Users, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';

const NavItem = ({ to, icon: Icon, label, isOpen, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="w-full" onClick={onClick}>
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
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Desktop sidebar expanded/collapsed
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // Mobile drawer open/closed
  const { theme, toggleTheme } = useTheme();

  // Close mobile drawer on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer when clicking a nav link
  const handleMobileNavClick = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Skip to content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-marine-red focus:text-white focus:rounded-lg focus:outline-none"
      >
        Skip to content
      </a>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-50 flex items-center justify-between px-4 no-print">
        <span className="font-bold text-xl text-marine-red flex items-center gap-2">
          <span className="text-2xl">⚓</span> MarineFit
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 text-gray-600 dark:text-gray-300"
            aria-label={mobileDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileDrawerOpen}
          >
            {mobileDrawerOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarExpanded ? 240 : 80 }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 shadow-sm transition-colors duration-200 no-print"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
          <div className={twMerge("flex items-center gap-2 overflow-hidden", !sidebarExpanded && "justify-center w-full")}>
            <span className="text-2xl">⚓</span>
            {sidebarExpanded && (
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
          <div className={clsx("text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3", !sidebarExpanded && "text-center")}>
            {sidebarExpanded ? "Menu" : "..."}
          </div>

          <NavItem to="/" icon={Home} label="Dashboard" isOpen={sidebarExpanded} />
          <NavItem to="/pt-coach" icon={Activity} label="PT Coach" isOpen={sidebarExpanded} />
          <NavItem to="/exercises" icon={Library} label="Exercise Library" isOpen={sidebarExpanded} />
          <NavItem to="/pft-prep" icon={Calculator} label="PFT/CFT Prep" isOpen={sidebarExpanded} />
          <NavItem to="/body-comp" icon={Heart} label="Body Comp" isOpen={sidebarExpanded} />

          <div className="my-4 border-t border-gray-100 dark:border-gray-700" />

          <div className={clsx("text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3", !sidebarExpanded && "text-center")}>
            {sidebarExpanded ? "Wellness" : "..."}
          </div>

          <NavItem to="/nutrition" icon={Utensils} label="Nutrition" isOpen={sidebarExpanded} />
          <NavItem to="/injury-prevention" icon={Shield} label="Injury Prev" isOpen={sidebarExpanded} />
          <NavItem to="/sleep" icon={Moon} label="Sleep" isOpen={sidebarExpanded} />
        </div>

        {/* Theme Toggle & Collapse */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className={twMerge(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              !sidebarExpanded && "justify-center"
            )}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarExpanded && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarExpanded}
          >
            {sidebarExpanded ? <div className="flex items-center gap-2 text-sm">Collapse <ChevronRight className="rotate-180" size={16}/></div> : <ChevronRight size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40 mt-16"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="bg-white dark:bg-gray-800 w-3/4 h-full p-4 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-2">
                 <NavItem to="/" icon={Home} label="Dashboard" isOpen={true} onClick={handleMobileNavClick} />
                 <NavItem to="/pt-coach" icon={Activity} label="PT Coach" isOpen={true} onClick={handleMobileNavClick} />
                 <NavItem to="/exercises" icon={Library} label="Exercise Library" isOpen={true} onClick={handleMobileNavClick} />
                 <NavItem to="/pft-prep" icon={Calculator} label="PFT/CFT Prep" isOpen={true} onClick={handleMobileNavClick} />
                 <NavItem to="/body-comp" icon={Heart} label="Body Comp" isOpen={true} onClick={handleMobileNavClick} />
                 <NavItem to="/nutrition" icon={Utensils} label="Nutrition" isOpen={true} onClick={handleMobileNavClick} />
                 <NavItem to="/injury-prevention" icon={Shield} label="Injury Prev" isOpen={true} onClick={handleMobileNavClick} />
                 <NavItem to="/sleep" icon={Moon} label="Sleep" isOpen={true} onClick={handleMobileNavClick} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
