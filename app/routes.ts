import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('api/set-locale', 'routes/api.set-locale.ts'),
  route('api/set-theme', 'routes/api.set-theme.ts'),
  route('*', 'routes/404/route.tsx'),
] satisfies RouteConfig;
