export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type QueryParams = Record<string, string>;
export type HttpBody = Record<string, unknown>;
export type RequestParams = {
	url: string;
	requestInit: RequestInit;
};
