# Creating HandCash Accounts

To create a new HandCash account programmatically, you'll need to follow these steps:

1. Request an email verification code
2. Generate an authentication key pair
3. Verify the email code
4. Create the account

Here's a complete example:

```typescript

const handCashConnect = new HandCashConnect({
 appId: handcashAppId,
 appSecret: handcashAppSecret
});

// 1. Request an email verification code
const email = 'app.review@handcash.io';
const requestId = await handCashConnect.requestEmailCode(email);

// 2. Generate an authentication key pair
const keyPair = handCashConnect.generateAuthenticationKeyPair();

// 3. Verify the email code
const verificationCode = '12345678';
await handCashConnect.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);

// 4. Create the account
await handCashConnect.createAccount({
 accessPublicKey: keyPair.publicKey,
    email,
});

// Use the SDK as usual
const cloudAccount = handCashConnect.getAccountFromAuthToken(keyPair.privateKey);
const profileFromAuthToken = await cloudAccount.profile.getCurrentProfile();
```

## Next steps
After creating the new account, store the `keyPair.privateKey` in a safe place. It will allow you to access the user account later on.

Don't worry if you lose the access key. You can still redirect the user to HandCash to grant access to your application. It will give you a new access token.

> For more details, follow the instructions to connect existing HandCash accounts to your application.