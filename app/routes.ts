import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/boardroom/route.tsx'),
  route('*', 'routes/404/route.tsx'),
] satisfies RouteConfig;
