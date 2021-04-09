# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
