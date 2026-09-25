import { I18nProvider } from './i18n-provider';
import { detectLanguage } from './server';

export const LangProvider = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const lang = await detectLanguage();

  return <I18nProvider lang={lang}>{children}</I18nProvider>;
};
