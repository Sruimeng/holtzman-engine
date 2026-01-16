import { I18nConfig } from '@/locales';
import i18next from '@/locales/lib/i18next';
import { I18nextProvider, initReactI18next } from '@/locales/lib/react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-fetch-backend';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { getInitialNamespaces } from 'remix-i18next/client';

async function hydrate() {
  await i18next
    .use(initReactI18next)
    .use(Backend)
    .use(LanguageDetector)
    .init({
      ...I18nConfig,
      ns: getInitialNamespaces(),
      detection: {
        order: ['htmlTag'],
        caches: [],
      },
      backend: {
        loadPath: '/api/set-locale?lng={{lng}}&ns={{ns}}',
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
