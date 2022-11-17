export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type QueryParams = Record<string, string>;
export type HttpBody = Record<string, unknown>;
export type RequestParams = {
	method: HttpMethod;
	body?: string;
	headers?: Record<string, string>;
};
