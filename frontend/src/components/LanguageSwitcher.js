'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${i18n.language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        EN
      </Button>
      <Button
        onClick={() => changeLanguage('bn')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${i18n.language === 'bn' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        BN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;