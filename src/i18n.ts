import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

import LanguageDetector from 'i18next-browser-languagedetector'
// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

import localeDE from './assets/locales/de.json'
import localeEN from './assets/locales/en.json'

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    whitelist: ['de', 'en'],
    debug: true, // TODO: Remove if tested
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    resources: {
      de: { translation: localeDE },
      en: { translation: localeEN },
    },
  })


export default i18n
