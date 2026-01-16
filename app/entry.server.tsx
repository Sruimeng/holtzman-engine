import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onAllReady() {
          const body = new PassThrough();
          const stream = new ReadableStream({
            start(controller) {
              body.on('data', (chunk) => controller.enqueue(chunk));
              body.on('end', () => controller.close());
              body.on('error', (err) => controller.error(err));
            },
          });

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
      },
    );

    setTimeout(abort, 5000);
  });
}
