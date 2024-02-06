# Webhooks migration

## Background

- The item events serializer was inadvertently changed to a serializer intended exclusively for
  wallet use.
- Consequently, the `itemTransfer` data in the `item_listing_payment_completed` event began returning in a format that
  is confusing and non-intuitive.
- Notably, Champions TCG has implemented royalty payments around the current format, and Transmira has adjusted their
  integration to this format.

## Solution

For the `item_listing_payment_completed` event:

- The payload will include both the current data and the correctly formatted data in a more intuitive format.
- `data.items[].to` will contain information about the entity that has sold the NFT.
- `data.items[].from` will contain information about the entity that has purchased the NFT.
- `payment` will detail the exact payment made for the item sale.
- `data.id` is the identifier for the item transfer.
- `data.label` indicates the action of the itemTransfer, with possible values being `marketSell` or `send`. Note
  that `buy` and `marketBuy` actions are not sent as webhooks.

For the `items_transferred` event:

- It is understood that this webhook is not currently used in production.
- The webhook body will conform to the following type definition:

`ItemTransfer` Type Definition
---

```typescript
type ItemTransfer = {
   id: string;
   label: string;
   payment?: ItemPayment;
   items: ItemTransferResult[];
   createdAt: string;
};

type ItemPayment = {
   transactionId: string;
   currencyCode: string;
   amount: number;
   fiatEquivalent: {
      currencyCode: string;
      amount: number;
   };
};

type ItemTransferResult = {
   to: TransactionParticipant;
   from: TransactionParticipant;
   origin: string;
   name: string;
   imageUrl: string;
};
```

## Real Examples of Changes

### Item Sold Event

#### Current Payload

```json
{
  "event": "item_listing_payment_completed",
  "applicationId": "817f191e330a19629de750eb",
  "apiVersion": "1.0",
  "created": "2024-02-01T16:11:55.058Z",
  "data": {
    "transactionRecord": {
      "transactionId": "bfc2c5f53b8684ecaaaea9ecfe2b6bea4a7435947cb412b787968ef5048e600a",
      "note": "Fairy of the Moonlight",
      "type": "receive",
      "time": 1706803914,
      "satoshiFees": 0,
      "satoshiAmount": 5000,
      "fiatExchangeRate": 330,
      "fiatCurrencyCode": "USD",
      "participants": [
        {
          "type": "user",
          "id": "65bbc2c3cbc6a1bfffb4b617",
          "alias": "user_tss03",
          "displayName": "User Tss 03",
          "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
          "avatarMetadata": {
            "rarityLabel": "Mythic",
            "color": "#000000",
            "origin": "someorigin_0"
          },
          "responseNote": "",
          "amount": 0,
          "tags": []
        }
      ],
      "attachments": []
    },
    "items": [
      {
        "id": "65bbc2cacbc6a1bfffb4b8b1",
        "collection": {
          "id": "65bbc2c3cbc6a1bfffb4b645"
        },
        "user": {
          "avatarMetadata": {}
        },
        "app": {
          "id": "817f191e330a19629de750eb"
        },
        "origin": "5780d6946e5694ac93f8360309c6037e195d4afd0e89089619c47448a7d82389_1",
        "name": "Fairy of the Moonlight",
        "imageUrl": "https://res.cloudinary.com/hn8pdtayf/image/upload/v1679911515/dashboard/hqw2p8tps1hbt3yxle3t.jpg",
        "rarity": "Rare",
        "color": "#21bbea",
        "attributes": [
          {
            "name": "edition",
            "value": "First",
            "displayType": "string"
          },
          {
            "name": "generation",
            "value": 1,
            "displayType": "string"
          },
          {
            "name": "championNumber",
            "value": 1,
            "displayType": "number"
          },
          {
            "name": "totalQuantity",
            "value": 33,
            "displayType": "number"
          },
          {
            "name": "element",
            "value": "Fire",
            "displayType": "string"
          },
          {
            "name": "ability",
            "value": "Inferno",
            "displayType": "string"
          },
          {
            "name": "manaCost",
            "value": 2,
            "displayType": "number"
          },
          {
            "name": "health",
            "value": 3,
            "displayType": "number"
          },
          {
            "name": "attack",
            "value": 3,
            "displayType": "number"
          },
          {
            "name": "color",
            "value": "#ed5025",
            "displayType": "color"
          }
        ],
        "royalties": [],
        "isHandcashCreated": true,
        "isVerified": true,
        "isListing": true,
        "itemListing": {
          "id": "65bbc2cacbc6a1bfffb4b8c5",
          "status": "sold",
          "currencyCode": "BSV",
          "price": 0.001,
          "denominatedIn": "BSV",
          "fiatEquivalent": {
            "amount": 0.33,
            "currencyCode": "USD"
          },
          "paymentRequestUrl": "https://pay.handcash.io/65bbc2cacbc6a1bfffb4b8cb?domain=iae-app.handcash.io",
          "paymentRequestId": "65bbc2cacbc6a1bfffb4b8cb"
        },
        "count": 1,
        "isCurrentUser": false
      }
    ],
    "itemTransfer": {
      "referencedUserId": "65bbc2c3cbc6a1bfffb4b616",
      "transactionId": "6ec246342ddc5834f99fe5e1ee1e42788c9ccfdc480d43d6a38fb46b2f272be6",
      "transferItems": [
        {
          "direction": "send",
          "origin": "5780d6946e5694ac93f8360309c6037e195d4afd0e89089619c47448a7d82389_1",
          "participant": {
            "type": "user",
            "name": "user_tss03"
          }
        }
      ]
    }
  }
}
```

### Item Sold Event

#### New Payload

```json

{
  "event": "item_listing_payment_completed",
  "applicationId": "817f191e330a19629de750eb",
  "apiVersion": "1.0",
  "created": "2024-02-01T17:05:58.135Z",
  "data": {
    "transactionRecord": {
      "transactionId": "2582c8e5364b151343bbcea576a7411b052e227288f251d0bb40028314af59ea",
      "note": "Fairy of the Moonlight",
      "type": "receive",
      "time": 1706807157,
      "satoshiFees": 0,
      "satoshiAmount": 5000,
      "fiatExchangeRate": 330,
      "fiatCurrencyCode": "USD",
      "participants": [
        {
          "type": "user",
          "id": "65bbcf6bcf7a2c32e3d8a7c0",
          "alias": "user_tss03",
          "displayName": "User Tss 03",
          "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
          "avatarMetadata": {
            "rarityLabel": "Mythic",
            "color": "#000000",
            "origin": "someorigin_0"
          },
          "responseNote": "",
          "tags": []
        }
      ],
      "attachments": []
    },
    "items": [
      {
        "to": {
          "type": "user",
          "id": "65bbcf6bcf7a2c32e3d8a7c0",
          "alias": "user_tss03",
          "displayName": "User Tss 03",
          "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
          "avatarMetadata": {},
          "responseNote": "",
          "tags": []
        },
        "from": {
          "type": "user",
          "id": "65bbcf6bcf7a2c32e3d8a7bf",
          "alias": "user_tss02",
          "displayName": "User Tss 02",
          "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
          "avatarMetadata": {},
          "responseNote": "",
          "tags": []
        },
        "origin": "5780d6946e5694ac93f8360309c6037e195d4afd0e89089619c47448a7d82389_1",
        "name": "Fairy of the Moonlight",
        "imageUrl": "https://res.cloudinary.com/hn8pdtayf/image/upload/v1679911515/dashboard/hqw2p8tps1hbt3yxle3t.jpg",
        "id": "65bbcf74cf7a2c32e3d8aa5a",
        "collection": {
          "id": "65bbcf6bcf7a2c32e3d8a7ee"
        },
        "user": {
          "avatarMetadata": {}
        },
        "app": {
          "id": "817f191e330a19629de750eb"
        },
        "rarity": "Rare",
        "color": "#21bbea",
        "attributes": [
          {
            "name": "edition",
            "value": "First",
            "displayType": "string"
          },
          {
            "name": "generation",
            "value": 1,
            "displayType": "string"
          },
          {
            "name": "championNumber",
            "value": 1,
            "displayType": "number"
          },
          {
            "name": "totalQuantity",
            "value": 33,
            "displayType": "number"
          },
          {
            "name": "element",
            "value": "Fire",
            "displayType": "string"
          },
          {
            "name": "ability",
            "value": "Inferno",
            "displayType": "string"
          },
          {
            "name": "manaCost",
            "value": 2,
            "displayType": "number"
          },
          {
            "name": "health",
            "value": 3,
            "displayType": "number"
          },
          {
            "name": "attack",
            "value": 3,
            "displayType": "number"
          },
          {
            "name": "color",
            "value": "#ed5025",
            "displayType": "color"
          }
        ],
        "royalties": [],
        "isHandcashCreated": true,
        "isVerified": true,
        "isListing": true,
        "itemListing": {
          "id": "65bbcf75cf7a2c32e3d8aa6e",
          "status": "sold",
          "currencyCode": "BSV",
          "price": 0.001,
          "denominatedIn": "BSV",
          "fiatEquivalent": {
            "amount": 0.33,
            "currencyCode": "USD"
          },
          "paymentRequestUrl": "https://pay.handcash.io/65bbcf75cf7a2c32e3d8aa74?domain=iae-app.handcash.io",
          "paymentRequestId": "65bbcf75cf7a2c32e3d8aa74"
        },
        "count": 1,
        "isCurrentUser": false
      }
    ],
    "itemTransfer": {
      "referencedUserId": "65bbcf6bcf7a2c32e3d8a7bf",
      "transactionId": "6ec246342ddc5834f99fe5e1ee1e42788c9ccfdc480d43d6a38fb46b2f272be6",
      "transferItems": [
        {
          "direction": "send",
          "origin": "5780d6946e5694ac93f8360309c6037e195d4afd0e89089619c47448a7d82389_1",
          "participant": {
            "type": "user",
            "name": "user_tss03"
          }
        }
      ]
    },
    "id": "65bbcf76cf7a2c32e3d8abff",
    "label": "marketSell",
    "payment": {
      "currencyCode": "BSV",
      "amount": 0.00091,
      "fiatEquivalent": {
        "currencyCode": "USD",
        "amount": 0.3003
      }
    },
    "createdAt": "2024-02-01T17:05:58.064Z"
  }
}
```

### Send Item Event

#### Current Payload

```json
{
  "event": "items_transferred",
  "applicationId": "817f191e330a19629de750eb",
  "apiVersion": "1.0",
  "created": "2024-02-01T16:13:37.156Z",
  "data": {
    "itemTransfer": {
      "referencedUserId": "65bbc32abebf07dcacc25c9a",
      "transactionId": "538ae468d411330c94ffbf547e290d89ef850eda21fa2be8a125e68a5f7eb735",
      "transferItems": [
        {
          "direction": "send",
          "origin": "1e8708cfd4cd98297c6268afce98072e12556ebbe2ac0d6bb0fb9fe8b39b0d16_0",
          "participant": {
            "type": "user",
            "name": "BBG"
          }
        },
        {
          "direction": "send",
          "origin": "5780d6946e5694ac93f8360309c6037e195d4afd0e89089619c47448a7d82389_1",
          "participant": {
            "type": "user",
            "name": "user_tss03"
          }
        }
      ]
    }
  }
}
```

#### New Payload

```json
{
  "event": "items_transferred",
  "applicationId": "817f191e330a19629de750eb",
  "apiVersion": "1.0",
  "created": "2024-02-01T16:21:09.749Z",
  "data": {
    "itemTransfer": {
      "id": "65bbc4f5ce6f7dff7db9389a",
      "label": "send",
      "items": [
        {
          "to": {
            "type": "user",
            "id": "507e181e810c19729de860ea",
            "alias": "BBG",
            "displayName": "User Tss 01",
            "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
            "avatarMetadata": {},
            "responseNote": "",
            "tags": []
          },
          "from": {
            "type": "user",
            "id": "65bbc4e9ce6f7dff7db935ae",
            "alias": "user_tss02",
            "displayName": "User Tss 02",
            "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
            "avatarMetadata": {},
            "responseNote": "",
            "tags": []
          },
          "origin": "1e8708cfd4cd98297c6268afce98072e12556ebbe2ac0d6bb0fb9fe8b39b0d16_0"
        },
        {
          "to": {
            "type": "user",
            "id": "65bbc4e9ce6f7dff7db935af",
            "alias": "user_tss03",
            "displayName": "User Tss 03",
            "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
            "avatarMetadata": {},
            "responseNote": "",
            "tags": []
          },
          "from": {
            "type": "user",
            "id": "65bbc4e9ce6f7dff7db935ae",
            "alias": "user_tss02",
            "displayName": "User Tss 02",
            "profilePictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
            "avatarMetadata": {},
            "responseNote": "",
            "tags": []
          },
          "origin": "5780d6946e5694ac93f8360309c6037e195d4afd0e89089619c47448a7d82389_1"
        }
      ],
      "createdAt": "2024-02-01T16:21:09.675Z"
    }
  }
}
```
