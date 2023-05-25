import { createContext } from 'react';

const LanguageContext = createContext();
const { Provider: LanguageProvider } = LanguageContext;

export { LanguageProvider, LanguageContext };