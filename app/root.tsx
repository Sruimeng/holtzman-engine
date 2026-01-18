import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import 'virtual:uno.css';
import './root.css';

export const links = () => [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }];

export default function App() {
  return (
    <html lang="zh-CN" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
