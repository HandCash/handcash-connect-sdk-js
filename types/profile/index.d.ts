export = Profile;
declare class Profile {
    constructor(handCashConnectService: any);
    handCashConnectService: any;
    getCurrentProfile(): Promise<any>;
    getPublicProfilesByHandle(handles: any): Promise<any>;
    getFriends(): Promise<any>;
    getPermissions(): Promise<any>;
    getEncryptionKeypair(): Promise<{
        publicKey: any;
        privateKey: any;
    }>;
    signData(dataSignatureParameters: any): Promise<any>;
}
