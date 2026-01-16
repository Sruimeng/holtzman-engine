import { resources } from '@/locales';
import { data } from 'react-router';
import { z } from 'zod';

export async function loader({ request }: any) {
  const url = new URL(request.url);

  const lng = z
    .string()
    .refine((lng): lng is keyof typeof resources => Object.keys(resources).includes(lng))
    .parse(url.searchParams.get('lng'));

  const namespaces = resources[lng];

  const ns = z
    .string()
    .refine((ns): ns is keyof typeof namespaces => {
      return Object.keys(resources[lng]).includes(ns);
    })
    .parse(url.searchParams.get('ns'));

  const headers = new Headers();

  // On production, we want to add cache headers to the response
  if (import.meta.env.PROD) {
    headers.set(
      'Cache-Control',
      'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
    );
  }

  return data(namespaces[ns], { headers });
}
