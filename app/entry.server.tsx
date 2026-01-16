import { i18nServer } from '@/.server/i18n.server';
import { I18nConfig, resources } from '@/locales';
import { createInstance } from '@/locales/lib/i18next';
import { I18nextProvider, initReactI18next } from '@/locales/lib/react-i18next';
import { createReadableStreamFromReadable } from '@react-router/node';
import { isbot } from 'isbot';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import type { EntryContext, HandleErrorFunction } from 'react-router';
import { ServerRouter } from 'react-router';

export const streamTimeout = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady';

  const i18next = createInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(routerContext);

  await i18next.use(initReactI18next).init({
    ...I18nConfig,
    resources,
    lng,
    ns,
  });

  return new Promise((resolve, reject) => {
    let shellRendered = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18next}>
        <ServerRouter context={routerContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) console.error(error);
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}

export const handleError: HandleErrorFunction = (error, { request }) => {
  if (!request.signal.aborted) {
    console.error(error);
  }
};
