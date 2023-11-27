export default class HandCashConnectApiError extends Error {
	message: string;

	path: string;

	method: string;

	httpStatusCode: number;

	info: string;

	constructor(params: {
		method: string;
		path: string;
		httpStatusCode: number;
		message: string;
		info: string;
		stack?: string;
	}) {
		super(params.message);
		this.method = params.method;
		this.path = params.path;
		this.httpStatusCode = params.httpStatusCode;
		this.message = params.message;
		this.info = params.info;
		this.stack = params.stack;
	}

	toString() {
		return JSON.stringify(this);
	}
}
