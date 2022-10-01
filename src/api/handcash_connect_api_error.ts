export default class HandCashConnectApiError extends Error {
	httpStatusCode: number;

	info: string;

	constructor(httpStatusCode: number, message: string, info: string) {
		super();
		this.httpStatusCode = httpStatusCode;
		this.message = message;
		this.info = info;
	}

	toString() {
		return JSON.stringify(this);
	}
}
