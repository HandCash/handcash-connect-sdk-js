export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type QueryParams = Record<string, string | number | object>;
export type HttpBody = Record<string, unknown>;
