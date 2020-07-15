// This example uses Express to handle HTTP requests
const express = require('express');
const app = express();

// Parse HTTP bodies as JSON
app.use(express.json());

app.post('/webhooks', function(req, resp) {
  // Notification signature: 'gf6sy...wOFw9Gw='
  // Note: Signature is truncated for illustration
  const signature = req.header('x-square-signature');

  /*
  webhook notification body
  {
    "merchant_id": "6VEKB6...",
    "type": "webhooks.test_notification",
    "event_id": "44db71b7-c20a-416e-428a-fd8e1837e4f5",
    "created_at": "2019-07-31T17:10:55.49604564Z",
    "data": {
      "type": "webhooks",
      "id": "8e4600d9-7e6c-44d5-8942-31fb7e45ef0e"
    }
  }
  */
  const body = JSON.stringify(req.body);

  // Send a 200 response to indicate success
  resp.sendStatus(200);
});

app.listen(3000, () => console.log('listening for webhooks on port 3000'));

// The crypto module provides cryptographic functionality
const crypto = require('crypto');

function isValidSignature(body, url, signature) {
  // Concatenate your notification URL and
  // the JSON body of the webhook notification
  const combined = url + body;

  // Webhook subscription signature key defined in dev portal for app 
  // webhook listener endpoint: https://webhook.site/my-listener-endpoint
  // Note: Signature key is truncated for illustration
  const signatureKey = 'NuDpPd0pp0L2PEvLKi7_Nw';

  // Generate the HMAC-SHA1 signature of the string
  // signed with your webhook signature key
  const hmac = crypto.createHmac('sha1', signatureKey);
  hmac.write(combined)
  hmac.end()
  const checkHash = hmac.read().toString('base64');
    
  // Compare HMAC-SHA1 signatures.
  if (checkHash === signature) {
    console.log('Validation success!');
  } else {
    console.log('Validation error.');
  }
}