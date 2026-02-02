import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calculator, Heart, Shield, Moon, Utensils, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const DashboardCard = ({ to, icon: Icon, title, desc, color }) => (
  <motion.div variants={item}>
    <Link to={to} className="group block h-full">
      <div className="h-full bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${color}`} />
        
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10 text-opacity-100`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-marine-red transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            {desc}
          </p>
          
          <div className="flex items-center text-sm font-semibold text-marine-red opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            Open Module <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-marine-red to-red-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-marine-gold opacity-10 rounded-full -ml-12 -mb-12 blur-2xl" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Semper Fit, Semper Ready</h1>
          <p className="text-red-100 text-lg md:text-xl mb-8 leading-relaxed">
            The comprehensive digital command center for Marine Corps physical readiness, health optimization, and combat fitness.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/pt-coach" className="px-6 py-3 bg-white text-marine-red rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Generate Workout
            </Link>
            <Link to="/pft-prep" className="px-6 py-3 bg-marine-gold/20 backdrop-blur-sm text-white border border-white/20 rounded-lg font-bold hover:bg-marine-gold/30 transition-colors">
              Calculate Score
            </Link>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <DashboardCard 
          to="/pt-coach" 
          icon={Activity} 
          title="PT Coach" 
          desc="AI-powered HITT workout generation based on your goals and available equipment."
          color="bg-blue-500"
        />
        <DashboardCard 
          to="/pft-prep" 
          icon={Calculator} 
          title="PFT/CFT Prep" 
          desc="Calculate scores, track progress, and plan your path to a First Class score."
          color="bg-green-500"
        />
        <DashboardCard 
          to="/body-comp" 
          icon={Heart} 
          title="Body Composition" 
          desc="DoD compliant Waist-to-Height Ratio (WHtR) calculator and compliance check."
          color="bg-purple-500"
        />
        <DashboardCard 
          to="/nutrition" 
          icon={Utensils} 
          title="Nutrition Guide" 
          desc="Fuel your performance with mission-ready meal planning and macro tracking."
          color="bg-orange-500"
        />
        <DashboardCard 
          to="/injury-prevention" 
          icon={Shield} 
          title="Injury Prevention" 
          desc="Pre-habilitation routines, mobility work, and injury management resources."
          color="bg-red-500"
        />
        <DashboardCard 
          to="/sleep" 
          icon={Moon} 
          title="Sleep Optimizer" 
          desc="Maximize recovery with science-backed sleep strategies and tracking."
          color="bg-indigo-500"
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
