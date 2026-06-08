import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Minimal local type definitions for Vercel serverless function handlers.
 *
 * These mirror the public `VercelRequest` / `VercelResponse` types from the
 * `@vercel/node` package. They are imported with `import type` only, so they
 * are erased at compile time — there is no runtime dependency. Defining them
 * locally keeps the heavyweight `@vercel/node` builder (and its transitive
 * dev-only dependencies) out of the project; the Vercel platform supplies the
 * real builder and request/response objects at deploy time.
 */

export type VercelRequestQuery = { [key: string]: string | string[] };
export type VercelRequestCookies = { [key: string]: string };
export type VercelRequestBody = any;

export interface VercelRequest extends IncomingMessage {
  query: VercelRequestQuery;
  cookies: VercelRequestCookies;
  body: VercelRequestBody;
}

export interface VercelResponse extends ServerResponse {
  send: (body: any) => VercelResponse;
  json: (jsonBody: any) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
  redirect: (statusCodeOrUrl: string | number, url?: string) => VercelResponse;
}
