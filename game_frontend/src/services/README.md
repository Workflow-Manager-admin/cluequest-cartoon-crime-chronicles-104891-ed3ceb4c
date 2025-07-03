# Freepik API Service Utility

This folder contains utilities for integrating the Freepik API with the game_frontend React app.

- `freepikApi.js`: Service module for authenticated requests to the Freepik API (search, fetch asset details, etc.).
  - Exposes public methods:
    - `searchImages(query, options)`
    - `getAssetDetails(assetId)`
- Uses API key authentication (Bearer token).
- See https://developers.freepik.com/ for official docs and endpoint details.

## Usage Example

```js
import freepikApi from './services/freepikApi';

freepikApi.searchImages("detective", {limit: 10})
  .then(results => console.log(results))
  .catch(err => console.error(err));
```

Update the endpoints and parameters in `freepikApi.js` as necessary based on Freepik's latest API documentation.

**Security Note:** 
Never expose sensitive API keys in production builds for public frontend apps. For production, consider routing requests via your own backend.

