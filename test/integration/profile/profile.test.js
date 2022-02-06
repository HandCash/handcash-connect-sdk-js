const chai = require('../../chai_extensions');
chai.use(require('chai-as-promised'));
const publicProfileApiDefinition = require('./publicUserProfile.api-definition');
const privateProfileApiDefinition = require('./privateUserProfile.api-definition');
const encryptionKeypairApiDefinition = require('./encryptionKeypair.api-definition');
const signatureApiDefinition = require('./signature.api-definition');

const { HandCashConnect, Environments, Permissions } = require('../../../src/index');

const { expect } = chai;

describe('# Profile - Integration Tests', () => {
   before(async () => {
      const authToken = process.env.test_authToken;
      this.cloudAccount = new HandCashConnect('appId', Environments.iae).getAccountFromAuthToken(authToken);
   });

   it('should get user public profile', async () => {
      const publicProfile = await this.cloudAccount.profile.getCurrentProfile()
         .then(profile => profile.publicProfile);

      expect.definitionToMatch(publicProfileApiDefinition, publicProfile);
   });

   it('should get user private profile', async () => {
      const privateProfile = await this.cloudAccount.profile.getCurrentProfile()
         .then(profile => profile.privateProfile);

      expect.definitionToMatch(privateProfileApiDefinition, privateProfile);
   });

   it('should get user friends list', async () => {
      const friends = await this.cloudAccount.profile.getFriends();
      expect(friends)
         .to
         .be
         .an('array');
      expect.definitionToMatch(publicProfileApiDefinition, friends[0]);
   });

   it('should get public user profiles by handle', async () => {
      const publicProfiles = await this.cloudAccount.profile.getPublicProfilesByHandle(['tester']);

      expect(publicProfiles)
         .to
         .be
         .an('array')
         .and
         .have
         .length(1);
      expect.definitionToMatch(publicProfileApiDefinition, publicProfiles[0]);
   });

   it('should get current user permissions', async () => {
      const userPermissions = await this.cloudAccount.profile.getPermissions();

      expect(userPermissions)
         .to
         .contain(
            Permissions.Pay,
            Permissions.UserPublicProfile,
            Permissions.UserPrivateProfile,
            Permissions.Friends,
            Permissions.Decryption,
            Permissions.SignData,
            Permissions.ReadBalance,
         );
   });

   it('should get user encryption keypair', async () => {
      const encryptionKeypair = await this.cloudAccount.profile.getEncryptionKeypair();

      expect.definitionToMatch(encryptionKeypairApiDefinition, encryptionKeypair);
   });

   it('should sign a message', async () => {
      const signature = await this.cloudAccount.profile.signData({
         format: 'utf-8',
         value: 'hey folks!',
      });

      expect.definitionToMatch(signatureApiDefinition, signature);
   });
});
