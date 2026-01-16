import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import 'virtual:uno.css';
import { Canonical, DefaultErrorBoundary } from './components';
import { STORAGE_KEYS } from './constants/static/storage';
import './root.css';

type Theme = 'light' | 'dark';

export const links = () => {
  return [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ];
};

const useClientTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
  };

  return [theme, toggleTheme] as const;
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [theme] = useClientTheme();

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)} data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('${STORAGE_KEYS.THEME}');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
        <Canonical />
      </head>
      <body className="select-none">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export const ErrorBoundary: React.FC = () => {
  return <DefaultErrorBoundary />;
};

export default App;
