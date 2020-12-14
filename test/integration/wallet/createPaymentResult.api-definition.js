module.exports = {
   'transactionId': 'string',
   'rawTransactionHex': 'string',
   'type': 'string',
   'note': 'string',
   'appAction': 'string',
   'time': 'number',
   'satoshiFees': 'number',
   'satoshiAmount': 'number',
   'fiatExchangeRate': 'number',
   'fiatCurrencyCode': 'string',
   'participants': [{
      'type': 'string',
      'alias': 'string',
      'displayName': 'string',
      'profilePictureUrl': 'string',
      'responseNote': 'string',
   }],
   'attachments': [{
      'format': 'string',
      'value': 'any',
   }],
};
