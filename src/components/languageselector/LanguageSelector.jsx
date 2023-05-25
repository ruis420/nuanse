import React, { useContext, useEffect } from 'react';
import { LanguageContext } from '../../contexts/languagecontext/LanguageContext';
import CustomSelect from '../customselect/CustomSelect';

const LanguageSelector = () => {
  const { setSelectedLanguage } = useContext(LanguageContext);
  const languages = ['English', 'Français', 'Español', '日本語', 'Русский', '한국어', '中文'];  

  useEffect(() => {
    setSelectedLanguage('English');
  }, [setSelectedLanguage]);

  return (
    <CustomSelect options={languages} onSelect={setSelectedLanguage} />
  );
};

export default LanguageSelector;