export declare class Environment {
    apiEndpoint: string;
    clientUrl: string;
    trustholderEndpoint: string;
}

export default class Environments {
    static prod: Environment;
    static beta: Environment;
    static iae: Environment;
}
