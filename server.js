require('dotenv').config();

const express = require('express');

const crypto = require('crypto-js');

const buffer = require('buffer');

const app = express();

// Store raw body string from buffer.
app.use(
  express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// Update the path to point to your webhook processing endpoint.
app.post('/webhooks/pressable', (request, response) => {
  // Get signature from request header.
  const signature = request.headers['header-key-provided-in-documention'];

  // Shared key from Pressable.
  const sharedKey = 'shared-key-provided-on-profile-page';

  // Rsaw body as a string.
  const rawBody = request.rawBody;

  // Verifying signature.
  const isVerified = crypto.HmacSHA256(rawBody, sharedKey) == signature;

  // Output the result.
  console.log(`Is signature verified: ${isVerified}`);

  // Return 200 to MyPressable Control Panel.
	response.status(200).end();
});

app.get('/', (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'});

  response.end(`
    <h1>Pressable Webhook Signature Sample</h1>
    <p>Ready for requests</p>
    <p>
      <a href="https://pressable.com">Pressable Managed WordPress Hosting</a>
    </p>
  `);
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running... visit localhost:${process.env.PORT}`)
});
