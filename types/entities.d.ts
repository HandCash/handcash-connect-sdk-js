export interface ExchangeRate {
   fiatSymbol: string;
   rate: number;
   exchangeRateVersion: string;
   estimatedExpireDate: string;
}

export interface KeyPair {
   privateKey: string;
   publicKey: string;
}

export interface SpendableBalance {
   spendableSatoshiBalance: number;
   spendableFiatBalance: number;
   currencyCode: string;
}

export interface UserBalance {
   satoshiBalance: number;
   fiatBalance: number;
   currencyCode: string;
}

export interface PaymentRequestItem {
   destination: string;
   currencyCode: string;
   sendAmount: number;
   tags?: [];
}

export interface TransactionParticipant {
   type: string;
   alias: string;
   displayName: number;
   profilePictureUrl: string;
   tags: string[];
}

export interface Attachment {
   value: string | object;
   format: 'base64' | 'hex' | 'json';
}

export interface PaymentResult {
   transactionId: string;
   note: string;
   appAction: string;
   time: number;
   type: string;
   satoshiFees: number;
   satoshiAmount: number;
   fiatExchangeRate: number;
   fiatCurrencyCode: string;
   participants: TransactionParticipant[];
   attachments: Attachment[];
   rawTransactionHex?: string;
}

export interface PaymentParameters {
   description?: string;
   appAction?: string;
   payments: PaymentRequestItem[];
   attachment?: Attachment;
}

export interface UserPublicProfile {
   id: string;
   handle: string;
   paymail: string;
   displayName: string;
   avatarUrl: string;
   localCurrencyCode: string;
   bitcoinUnit: string;
   createdAt: string;
}

export interface UserPrivateProfile {
   phoneNumber: string;
   email: string;
}

export interface UserProfile {
   publicProfile: UserPublicProfile;
   privateProfile: UserPrivateProfile;
}

export interface DataSignature {
   publicKey: string;
   signature: string;
}

export interface DataSignatureParameters {
   value: string | object;
   format: "hex" | "base64" | "utf-8";
}

export type CurrencyCode = "AED"
   | "AFN"
   | "ALL"
   | "AMD"
   | "ANG"
   | "AOA"
   | "ARS"
   | "AUD"
   | "AWG"
   | "AZN"
   | "BAM"
   | "BBD"
   | "BDT"
   | "BGN"
   | "BHD"
   | "BIF"
   | "BMD"
   | "BND"
   | "BOB"
   | "BOV"
   | "BRL"
   | "BSD"
   | "BTN"
   | "BWP"
   | "BYN"
   | "BZD"
   | "CAD"
   | "CDF"
   | "CHE"
   | "CHF"
   | "CHW"
   | "CLF"
   | "CLP"
   | "CNY"
   | "COP"
   | "COU"
   | "CRC"
   | "CUC"
   | "CUP"
   | "CVE"
   | "CZK"
   | "DJF"
   | "DKK"
   | "DOP"
   | "DZD"
   | "EGP"
   | "ERN"
   | "ETB"
   | "EUR"
   | "FJD"
   | "FKP"
   | "GBP"
   | "GEL"
   | "GHS"
   | "GIP"
   | "GMD"
   | "GNF"
   | "GTQ"
   | "GYD"
   | "HKD"
   | "HNL"
   | "HRK"
   | "HTG"
   | "HUF"
   | "IDR"
   | "ILS"
   | "INR"
   | "IQD"
   | "IRR"
   | "ISK"
   | "JMD"
   | "JOD"
   | "JPY"
   | "KES"
   | "KGS"
   | "KHR"
   | "KMF"
   | "KPW"
   | "KRW"
   | "KWD"
   | "KYD"
   | "KZT"
   | "LAK"
   | "LBP"
   | "LKR"
   | "LRD"
   | "LSL"
   | "LYD"
   | "MAD"
   | "MDL"
   | "MGA"
   | "MKD"
   | "MMK"
   | "MNT"
   | "MOP"
   | "MRU"
   | "MUR"
   | "MVR"
   | "MWK"
   | "MXN"
   | "MXV"
   | "MYR"
   | "MZN"
   | "NAD"
   | "NGN"
   | "NIO"
   | "NOK"
   | "NPR"
   | "NZD"
   | "OMR"
   | "PAB"
   | "PEN"
   | "PGK"
   | "PHP"
   | "PKR"
   | "PLN"
   | "PYG"
   | "QAR"
   | "RON"
   | "RSD"
   | "RUB"
   | "RWF"
   | "SAR"
   | "SBD"
   | "SCR"
   | "SDG"
   | "SEK"
   | "SGD"
   | "SHP"
   | "SLL"
   | "SOS"
   | "SRD"
   | "SSP"
   | "STN"
   | "SVC"
   | "SYP"
   | "SZL"
   | "THB"
   | "TJS"
   | "TMT"
   | "TND"
   | "TOP"
   | "TRY"
   | "TTD"
   | "TWD"
   | "TZS"
   | "UAH"
   | "UGX"
   | "USD"
   | "USN"
   | "UYI"
   | "UYU"
   | "UYW"
   | "UZS"
   | "VES"
   | "VND"
   | "VUV"
   | "WST"
   | "XAF"
   | "XAG"
   | "XAU"
   | "XBA"
   | "XBB"
   | "XBC"
   | "XBD"
   | "XCD"
   | "XDR"
   | "XOF"
   | "XPD"
   | "XPF"
   | "XPT"
   | "XSU"
   | "XTS"
   | "XUA"
   | "XXX"
   | "YER"
   | "ZAR"
   | "ZMW"
   | "ZWL";
