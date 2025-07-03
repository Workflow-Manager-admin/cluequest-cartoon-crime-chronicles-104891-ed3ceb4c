//
// Freepik API Service Utility for React Frontend (game_frontend)
//
// This service provides helper functions for making authenticated requests
// to the Freepik API using the provided API key.
//
// Usage:
// import freepikApi from './services/freepikApi';
// freepikApi.searchImages(query, options).then(...);
//
// Documentation: https://developers.freepik.com/
//

const FREEPIK_API_BASE_URL = "https://api.freepik.com/v1/"; // See Freepik docs for correct endpoints
const FREEPIK_API_KEY = "FPSXea76cd23d3f1cbe367c46ca0681847d3";

/**
 * Helper for making HTTP requests to the Freepik API with authentication headers.
 * @param {string} endpoint - API endpoint path, e.g. "resources/search"
 * @param {object} params - Query params object
 * @returns {Promise<object>} API response JSON
 */
async function freepikRequest(endpoint, params = {}) {
  // Build query string
  const url = new URL(`${FREEPIK_API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  // Set up headers for Freepik
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${FREEPIK_API_KEY}`
  };

  // PUBLIC_INTERFACE
  // Main fetch call
  const resp = await fetch(url, {
    headers
  });

  if (!resp.ok) {
    // Provide more debug info in error
    const errorText = await resp.text();
    throw new Error(
      `Freepik API error (${resp.status}): ${errorText || resp.statusText}`
    );
  }
  return resp.json();
}

// PUBLIC_INTERFACE
/**
 * Search images/photos/vectors on Freepik by keyword.
 * See https://developers.freepik.com/docs for supported query params.
 *
 * @param {string} query - Search term
 * @param {object} options - Optional search/filter options (limit, page, etc.)
 * @returns {Promise<object>} - Search result object
 */
async function searchImages(query, options = {}) {
  if (!query) throw new Error("Missing search query");
  // Adjust endpoint and params according to the Freepik API documentation.
  return freepikRequest("resources/search", {
    q: query,
    ...options
  });
}

// PUBLIC_INTERFACE
/**
 * Get details for a specific Freepik asset by its ID.
 * @param {string} assetId - The Freepik asset/resource ID
 * @returns {Promise<object>} Asset details object
 */
async function getAssetDetails(assetId) {
  if (!assetId) throw new Error("Missing asset ID");
  // Make sure to use the correct endpoint for asset lookup (adjust if needed)
  return freepikRequest(`resources/${encodeURIComponent(assetId)}`);
}

/**
 * Exported API for use throughout the React app.
 */
const freepikApi = {
  searchImages,
  getAssetDetails
};

export default freepikApi;
