import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import translationService from '../services/translationService';

const LanguageSelector = ({ 
  currentLanguage, 
  onLanguageChange, 
  className = '',
  size = 'medium' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const dropdownRef = useRef(null);

  // Load supported languages on component mount
  useEffect(() => {
    const languages = translationService.getSupportedLanguages();
    setSupportedLanguages(languages);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  // Find current language details
  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage) || 
                     supportedLanguages.find(lang => lang.code === 'en');

  // Size variations
  const sizeClasses = {
    small: {
      button: 'px-2 py-1 text-sm',
      dropdown: 'text-sm',
      icon: 'w-3 h-3',
      flag: 'text-sm'
    },
    medium: {
      button: 'px-3 py-2',
      dropdown: '',
      icon: 'w-4 h-4',
      flag: 'text-base'
    },
    large: {
      button: 'px-4 py-3 text-lg',
      dropdown: 'text-lg',
      icon: 'w-5 h-5',
      flag: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Language Selector Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          ${currentSize.button}
          bg-white/90 backdrop-blur-sm border-2 border-gray-200 
          rounded-xl flex items-center justify-between gap-2
          hover:border-blue-300 hover:bg-white/95
          focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400
          transition-all duration-200 shadow-sm hover:shadow-md
          min-w-[120px]
        `}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          <Globe className={`${currentSize.icon} text-gray-600`} />
          <span className={`${currentSize.flag}`} aria-hidden="true">
            {currentLang?.flag}
          </span>
          <span className="font-medium text-gray-700 hidden sm:inline">
            {currentLang?.name}
          </span>
          <span className="font-medium text-gray-700 sm:hidden">
            {currentLang?.code.toUpperCase()}
          </span>
        </div>
        <ChevronDown 
          className={`${currentSize.icon} text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute top-full left-0 mt-2 
              bg-white rounded-xl shadow-xl border border-gray-200
              min-w-full w-max z-50 overflow-hidden
              ${currentSize.dropdown}
            `}
            role="menu"
            aria-label="Language options"
          >
            {supportedLanguages.map((language) => (
              <motion.button
                key={language.code}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                onClick={() => handleLanguageSelect(language.code)}
                className={`
                  w-full px-4 py-3 text-left flex items-center justify-between
                  hover:bg-gray-50 transition-colors duration-150
                  ${currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                  first:rounded-t-xl last:rounded-b-xl
                `}
                role="menuitem"
                aria-current={currentLanguage === language.code ? 'true' : 'false'}
              >
                <div className="flex items-center gap-3">
                  <span className={`${currentSize.flag}`} aria-hidden="true">
                    {language.flag}
                  </span>
                  <span className="font-medium">
                    {language.name}
                  </span>
                  {language.code !== 'en' && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {language.code.toUpperCase()}
                    </span>
                  )}
                </div>
                {currentLanguage === language.code && (
                  <Check className={`${currentSize.icon} text-blue-600`} />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator (optional) */}
      {supportedLanguages.length === 0 && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-sm">Loading languages...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;