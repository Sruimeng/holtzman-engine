import { createCookieSessionStorage } from 'react-router';
import { createThemeSessionResolver } from 'remix-themes';

const isDEV = import.meta.env.DEV;

export const themeSession = createCookieSessionStorage({
  cookie: {
    secrets: ['s3cret1'],
    name: 'theme',
    path: '/',
    sameSite: 'lax',
    secure: !isDEV,
    httpOnly: true,
  },
});

export const themeSessionResolver = createThemeSessionResolver(themeSession);
