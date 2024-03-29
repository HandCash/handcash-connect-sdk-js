# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.8.3] - 2024-03-29
-   Added param `appSecret` to the `HandCashMinter` constructor.

## [0.8.2] - 2024-03-19
-   Added field `externalId` in items so that they can be referenced externally.
-   Added feature to burn and create items in a single call via `minter.burnAndCreateItemsOrder({...})`. 

## [0.8.1] - 2024-03-13
-   Get item by origin via `account.items.getItemByOrigin('origin')`.
-   Arbitrary parameter in `minter.createItemsOrder({ uid: 'custom', ...})` to include a custom reference in the order.

## [0.8.0] - 2024-02-06

-   Webhook types changed: webhook types have been changed to be more consistent with the rest of the SDK. Check the [webhooks migration guide](docs/webhooksMigration.md) for more information.

## [0.7.8] - 2024-01-26
-   Extend transaction participant type to include `id` property.

## [0.7.7] - 2024-01-05

-   HandCash Webhooks: added types and signature verification.

## [0.7.6] - 2023-12-14

-   HandCash Minter: create items with a single call.
-   Updated type definitions.

## [0.7.5] - 2023-11-27

-   Use ESBuild as the bundler.
-   Improved error propagation to include the original error message.
-   Updated type definitions.

## [0.7.4] - 2023-09-19

-   Support `imageHighResUrl` in the media schema for items.

## [0.7.3] - 2023-08-09

-   Extended HandCashMinter to retrieve the items in an order.

## [0.7.2] - 2023-08-04

-   Added support for image URL to the collection definitions.

## [0.7.1] - 2023-08-04

-   Improved error handling and propagation.
-   Upload collection images before sending the request to create them.

## [0.7.0] - 2023-07-31

-   Added `HandCashMinter` component to inscribe 1Sat Ordinals.
-   Added `account.items` component to interact with the user items.

## [0.6.15] - 2023-04-27

-   Fix serialization issue affecting some endpoints.

## [0.6.14] - 2023-04-22

-   Better `Attachment` type definition.

## [0.6.13] - 2023-04-22

-   Set `content-type` header as `application/json` for every HTTP request.

## [0.6.12] - 2023-04-14

-   New function in profile to get app permissions along with the app id (`getPermissionsInfo`).

## [0.6.11] - 2023-04-11

-   Fix string conversion causing an issue with `getEncryptionKeypair()`

## [0.6.10] - 2023-03-31

-   Fix data type transformation causing an issue with `getEncryptionKeypair()`

## [0.6.9] - 2023-01-06

-   Added missing types definitions - `"BSV"` in `CurrencyCode`.
-   Exported hidden types: `PaymentRequestItem`, `Attachment`, `TransactionParticipant`.

## [0.6.8] - 2022-12-05

-   Downgraded `nanoid` to have CommonJS support
-   Fixed query parameters formatting int the get public profiles by aliases endpoint

## [0.6.3] - 2022-11-29

-   Add `oauth-nonce` to the headers to avoid errors when creating multiple requests with the same `oauth-timestamp` in headers.

## [0.6.2] - 2022-11-15

-   Fully rewritten in TS.
-   Packaging/building process with Vite.
-   Fast tests using Vitest.
-   Smaller package size.
-   ESM & CJS support.
-   Documentation (Jsdoc) for all core functions and classes of the SDK.

> 🙏🏻 Credits to [trgsv](https://github.com/trgsv)

## [0.5.0] - 2022-09-29

-   Improve typescript definitions
-   Add [new feature](https://docs.handcash.io/docs/create-accounts) to create new accounts directly from apps
-   Fix bug when requesting multiple profiles [#31](https://github.com/HandCash/handcash-connect-sdk-js/pull/31)

> 🙏🏻 Credits to [krisarsov](https://github.com/krisarsov)

## [0.4.3] - 2022-06-21

-   Fix typescript definition for `PaymentParameters`

## [0.4.2] - 2022-05-18

-   Add typescript definitions `index.d.ts`!
-   Add tags to the payment items: `wallet.pay({ payments: [{ destination: 'satoshi', tags: ['tag1', 'tag2'], currencyCode: 'USD', sendAmount: 0.05}] });`

> 🙏🏻 Credits to [Alvin](https://github.com/irkaal)

## [0.4.1] - 2022-03-25

-   Use production environment by default in the SDK initialization.
-   Extend `HandCashOwner` (RUN extension) to return the NFT locations.

## [0.4.0] - 2022-03-17

-   Change SDK initialization to define `appSecret`.
-   Revert `clientUrl` so it redirects to app.handcash.io instead of handcash.io.

## [0.3.1] - 2022-02-06

-   Extend `Wallet` to expose the user total balance via `account.wallet.getTotalBalance()`.

## [0.3.0] - 2022-01-07

-   Update `clientUrl` so it redirects to handcash.io instead of app.handcash.io
-   Fix issues with some endpoints using HTTP GET with a body as it's not supported by some browsers.

## [0.2.9-beta] - 2021-09-01

-   Extend `HandCashOwner.nextOwner()` with an optional alias `HandCashOwner.nextOwner(alias)`.

## [0.2.8-beta] - 2021-08-23

-   Include app-secret in the headers for the run extension endpoints.

## [0.2.7-beta] - 2021-07-23

-   Improve JSDoc for better auto-completion
-   Improve error feedback when using wrong auth tokens: "Missing authToken" and "Invalid authToken".
-   Method to get the change spend limits URL via `handCashConnect.getChangeSpendLimitsUrl()`
-   Beta features: `HandCashPurse` and `HandCashOwner` to integrate HandCash Connect with RUN.

## [0.2.6] - 2021-04-9

-   Add feature in wallet to retrieve an exchange rate for a given fiat currency code.

## [0.2.5] - 2021-04-9

-   Add extra query parameters to the redirection URL so when the user is redirected back to the app these parameters are included.
-   Expose `bitcoinUnit` as part of users' public profile.

## [0.2.7-beta] - 2021-07-23

-   Improve JSDoc for better auto-completion
-   Improve error feedback when using wrong auth tokens: "Missing authToken" and "Invalid authToken".
-   Method to get the change spend limits URL via `handCashConnect.getChangeSpendLimitsUrl()`
-   Beta features: `HandCashPurse` and `HandCashOwner` to integrate HandCash Connect with RUN.

## [0.2.6] - 2021-04-9

-   Add feature in wallet to retrieve an exchange rate for a given fiat currency code.

## [0.2.5] - 2021-04-9

-   Add extra query parameters to the redirection URL so when the user is redirected back to the app these parameters are included.
-   Expose `bitcoinUnit` as part of users' public profile.

## [0.2.4] - 2021-03-17

-   Improve error propagation so `HandCashApiError` does not wrap generic errors as they lose the stack trace and other important details.
-   Replace deprecated `@std/esm` by `esm`.

## [0.2.3] - 2020-12-17

-   Fixed wrong signature issue affecting browser integration.

## [0.2.2] - 2020-12-14

-   Initial release
