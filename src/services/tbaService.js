const BASE_URL = "https://www.thebluealliance.com/api/v3";

// Load API key from environment variables
const API_KEY = process.env.REACT_APP_TBA_KEY;

// Debug: confirm key loaded
console.log("Loaded TBA API Key:", API_KEY ? "YES" : "NO");

// Request headers
const headers = {
  "X-TBA-Auth-Key": API_KEY || ""
};

// Safe fetch wrapper
async function safeFetch(url) {

  console.log("Requesting:", url);

  try {

    const response = await fetch(url, { headers });

    console.log("Response status:", response.status);

    if (!response.ok) {
      console.error("TBA request failed:", response.status);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn("Unexpected response format:", data);
      return [];
    }

    console.log("Received items:", data.length);

    return data;

  } catch (error) {

    console.error("TBA fetch error:", error);

    return [];

  }

}

// Load all events for a year
export async function getEvents(year) {

  return safeFetch(`${BASE_URL}/events/${year}/simple`);

}

// Load matches for an event
export async function getMatches(eventKey) {

  return safeFetch(`${BASE_URL}/event/${eventKey}/matches`);

}
