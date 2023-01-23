type Literal = string | number | boolean | null;
export type Json = Literal | { [key: string]: Json } | Json[];

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type QueryParams = Record<string, string>;
export type HttpBody = Json;
export type RequestParams = {
	method: HttpMethod;
	body?: string;
	headers?: Record<string, string>;
};
