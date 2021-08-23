# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.2.8-beta] - 2021-08-23
- Include app-secret in the headers for the run extension endpoints.

## [0.2.7-beta] - 2021-07-23

- Improve JSDoc for better auto-completion
- Improve error feedback when using wrong auth tokens: "Missing authToken" and "Invalid authToken".
- Method to get the change spend limits URL via `handCashConnect.getChangeSpendLimitsUrl()`
- Beta features: `HandCashPurse` and `HandCashOwner` to integrate HandCash Connect with RUN.

## [0.2.6] - 2021-04-9

- Add feature in wallet to retrieve an exchange rate for a given fiat currency code.

## [0.2.5] - 2021-04-9

- Add extra query parameters to the redirection URL so when the user is redirected back to the app these parameters are included.
- Expose `bitcoinUnit` as part of users' public profile.

## [0.2.7-beta] - 2021-07-23

- Improve JSDoc for better auto-completion
- Improve error feedback when using wrong auth tokens: "Missing authToken" and "Invalid authToken".
- Method to get the change spend limits URL via `handCashConnect.getChangeSpendLimitsUrl()`
- Beta features: `HandCashPurse` and `HandCashOwner` to integrate HandCash Connect with RUN.

## [0.2.6] - 2021-04-9

- Add feature in wallet to retrieve an exchange rate for a given fiat currency code.

## [0.2.5] - 2021-04-9

- Add extra query parameters to the redirection URL so when the user is redirected back to the app these parameters are included.
- Expose `bitcoinUnit` as part of users' public profile.

## [0.2.4] - 2021-03-17

- Improve error propagation so `HandCashApiError` does not wrap generic errors as they lose the stack trace and other important details.
- Replace deprecated `@std/esm` by `esm`.

## [0.2.3] - 2020-12-17

- Fixed wrong signature issue affecting browser integration.

## [0.2.2] - 2020-12-14

Initial release
