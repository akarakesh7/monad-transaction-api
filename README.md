# Monad Transactions Proxy

A Cloudflare Worker that serves as a proxy for fetching transaction data from the Thirdweb API for the Monad blockchain.

## Features

- Fetches transaction data for a specified wallet address
- Supports pagination
- CORS enabled for specified origins
- API key protection

## Deployment

### Prerequisites

- Cloudflare account
- Thirdweb API Client ID
- Node.js and npm installed

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.dev.vars` file with your environment variables:
   ```
   THIRDWEB_CLIENT_ID=your-client-id-here
   API_KEY=your-api-key-here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment to Cloudflare

#### Using Wrangler CLI

1. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy the worker:
   ```bash
   npm run deploy
   ```

3. Configure the environment variables in the Cloudflare dashboard.

## API Usage

The worker exposes the following endpoint:

- `/?address={wallet-address}&page={page-number}&limit={items-per-page}`: Get transaction data

All requests require authentication with one of the following methods:
- `X-API-Key` header matching your `API_KEY`
- `api_key` query parameter matching your `API_KEY`

### Example Request

```
GET /?address=0x1234...&page=1&limit=100
X-API-Key: your-api-key
```

### Example Response

```json
{
  "success": true,
  "data": {
    "result": [...],
    "result_count": 100
  },
  "pagination": {
    "currentPage": 1,
    "limit": 100,
    "total": 250
  }
}
``` 