'use client';

import i18next from 'i18next';
import React, { useState, useEffect } from 'react';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import { i18nOptions } from './config-locales';

const init = { ...i18nOptions(), detection: { caches: ['cookie'] } };

if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string, ns: string) => import(`./langs/${lang}/${ns}.json`)
      )
    )
    .init(init);
}

export function I18nProvider({
  lang,
  children,
}: {
  lang?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (lang && i18next.language !== lang) {
      i18next.changeLanguage(lang);
    }
  }, [lang]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <Provider i18n={i18next}>{children}</Provider>;
}
