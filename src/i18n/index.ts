import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhTranslations from './locales/zh.json';
import enTranslations from './locales/en.json';

const resources = {
  'zh-CN': {
    translation: zhTranslations
  },
  'en-US': {
    translation: enTranslations
  }
};

// 配置语言检测选项
const DETECTION_OPTIONS = {
  // 按顺序检测语言
  order: ['localStorage', 'navigator'],

  // 缓存用户选择的语言到localStorage
  caches: ['localStorage'],

  // 要检查的localStorage键名
  lookupLocalStorage: 'sage-chat-language'
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    },
    detection: DETECTION_OPTIONS
  });

export default i18n;
