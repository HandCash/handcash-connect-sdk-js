## Install

`npm i @handcash/handcash-connect`

## Initialize the SDK

To start, you will need to create an instance of `HandCashConnect`. This object allows you to interact with the SDK.

A `HandCashConnect` requires a `appId` that represents your application.

```javascript
const { HandCashConnect } = require('@handcash/handcash-connect');

const handCashConnect = new HandCashConnect('your-app-id');
```

## Accessing User Accounts
In order to access to user account and trigger payments on their behalf, you need to obtain an `authToken` that represents such permissions. You can find more about [the user authorization process](https://handcash.github.io/handcash-connect-sdk-js-beta-docs/#/user-authorization).

1) Get the `redirectionUrl` that redirects to HandCash to obtain the `authToken`
2) Redirect the user to the `redirectionUrl`.

```javascript
const redirectionUrl = handCashConnect.getRedirectionUrl();
```

3) Once the user is redirected back to your app with the authToken, you are ready to go!

```javascript
const account = handCashConnect.getAccountFromAuthToken(authToken);
`````

## Your first payment

The following code shows how to make a simple payment:

```javascript
const { HandCashConnect } = require('@handcash/handcash-connect');

const handCashConnect = new HandCashConnect('your-app-id');
const account = handCashConnect.getAccountFromAuthToken(authToken);

const paymentParameters = {
  description: 'Hold my beer!🍺',
  appAction: 'drink'
  payments: [
    { to: 'eyeone', currency: 'USD', amount: 0.25 },
    { to: 'apagut', currency: 'EUR', amount: 0.05 },
    { to: 'satoshi', currency: 'SAT', amount: 50000 }
  ]
};

const paymentResult = await account.wallet.pay(paymentParameters);
console.log(paymentResult);
```

```json
{
   "transactionId":"0a25cc07953de261e2f7dbc3601a61d4e74f96b99cd55c0755df9b9888cdccbc",
   "note":"Hold my beer!🍺",
   "appAction":"drink",
   "type":"send",
   "time":1599223479,
   "satoshiFees":288,
   "satoshiAmount":5332,
   "fiatExchangeRate":165.4370470109637,
   "fiatCurrencyCode":"EUR",
   "participants":[
      {
         "type":"user",
         "alias":"eyeone",
         "displayName":"Eye One",
         "profilePictureUrl":"https://handcash-cloud-production.herokuapp.com/users/profilePicture/eyeone",
      },
      {
         "type":"user",
         "alias":"apagut",
         "displayName":"Alex",
         "profilePictureUrl":"https://handcash-cloud-production.herokuapp.com/users/profilePicture/apagut",
      },
      {
         "type":"user",
         "alias":"satoshi",
         "displayName":"Satoshi Nakamoto",
         "profilePictureUrl":"https://handcash-cloud-production.herokuapp.com/users/profilePicture/satoshi",
      }
   ],
   "attachments":[],
}
```
