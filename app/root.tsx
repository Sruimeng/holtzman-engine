import { useTranslation } from 'react-i18next';
import { data, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { useChangeLanguage } from 'remix-i18next/react';
import { PreventFlashOnWrongTheme, Theme, ThemeProvider, useTheme } from 'remix-themes';
import 'virtual:uno.css';
import { i18nCookie, i18nServer } from './.server/i18n.server';
import { themeSessionResolver } from './.server/theme.server';
import { Canonical, DefaultErrorBoundary } from './components';
import './root.css';

export const links = () => {
  return [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ];
};

export const loader = async ({ request }: any) => {
  const { getTheme } = await themeSessionResolver(request);
  const theme = getTheme() || Theme.DARK;
  const locale = await i18nServer.getLocale(request);
  const headers = new Headers();
  headers.append('Set-Cookie', await i18nCookie.serialize(locale));
  return data({ locale, theme }, { headers });
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [theme] = useTheme();

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)} data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta />
        <Links />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
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

const AppWithProviders = () => {
  const { theme, locale } = useLoaderData();
  useChangeLanguage(locale);

  return (
    <ThemeProvider specifiedTheme={theme} themeAction="/api/set-theme">
      <App />
    </ThemeProvider>
  );
};

export const ErrorBoundary: React.FC = () => {
  try {
    return (
      <ThemeProvider specifiedTheme={Theme.DARK} themeAction="/api/set-theme">
        <DefaultErrorBoundary />
      </ThemeProvider>
    );
  } catch {
    return null;
  }
};

export default AppWithProviders;
