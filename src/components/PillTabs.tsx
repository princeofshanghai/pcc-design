import React from 'react';
import { motion } from 'framer-motion';
import './PillTabs.css';

interface TabOption {
  key: string;
  label: string;
}

interface PillTabsProps {
  options: TabOption[];
  selected: string;
  onChange: (key: string) => void;
}

const PillTabs: React.FC<PillTabsProps> = ({ options, selected, onChange }) => {
  return (
    <div className="pill-tabs-container">
      {options.map(option => (
        <button
          key={option.key}
          className={`pill-tab ${selected === option.key ? 'active' : ''}`}
          onClick={() => onChange(option.key)}
        >
          {option.label}
          {selected === option.key && (
            <motion.div 
              className="active-pill-indicator" 
              layoutId="activePill"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default PillTabs; 