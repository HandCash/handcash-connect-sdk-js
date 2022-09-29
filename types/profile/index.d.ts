import Entities = require("../entities");
import HandCashConnectService = require("../api/handcash_connect_service");

declare class Profile {
   constructor(handCashConnectService: HandCashConnectService);

   handCashConnectService: HandCashConnectService;

   getCurrentProfile(): Promise<Entities.UserPublicProfile>;

   getPublicProfilesByHandle(handles: string[]): Promise<Entities.UserPublicProfile[]>;

   getFriends(): Promise<Entities.UserPublicProfile[]>;

   getPermissions(): Promise<any>;

   getEncryptionKeypair(): Promise<Entities.KeyPair>;

   signData(dataSignatureParameters: Entities.DataSignatureParameters): Promise<Entities.DataSignature>;
}

export = Profile;
