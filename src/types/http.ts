import { z } from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const JsonSchemaZ: z.ZodType<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(JsonSchemaZ), z.record(JsonSchemaZ)])
);

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export const QueryParamsZ = z.record(z.string());
export type QueryParams = z.infer<typeof QueryParamsZ>;
export type HttpBody = z.infer<typeof JsonSchemaZ>;
export type RequestParams = {
	method: HttpMethod;
	body?: string;
	headers?: Record<string, string>;
};
