import { I18nConfig, resources } from '@/locales';
import { createCookie } from 'react-router';
import { RemixI18Next } from 'remix-i18next/server';

const isDEV = import.meta.env.DEV;
const maxAge = 60 * 60 * 24 * 365;

export const i18nCookie = createCookie('lng', {
  path: '/',
  sameSite: 'lax',
  secure: !isDEV,
  maxAge,
  httpOnly: true,
});

export const i18nServer = new RemixI18Next({
  detection: {
    supportedLanguages: I18nConfig.supportedLngs,
    fallbackLanguage: I18nConfig.fallbackLng,
    cookie: i18nCookie,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    resources,
    ...I18nConfig,
  },
});
