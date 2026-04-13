const API_KEY = process.env.REACT_APP_TBA_KEY || null;
const BASE_URL = "https://www.thebluealliance.com/api/v3";

export async function getEvents(year) {
  try {
    const headers = {};
    if (API_KEY) {
      headers["X-TBA-Auth-Key"] = API_KEY;
    }
    
    const res = await fetch(`${BASE_URL}/events/${year}`, {
      headers
    });

    const data = await res.json();
    
    // Ensure it's an array
    if (!Array.isArray(data)) {
      console.error("[v0] TBA events error:", data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("[v0] Failed to fetch events:", error);
    return [];
  }
}

export async function getMatches(eventKey) {
  if (!eventKey) return [];

  const headers = {};
  if (API_KEY) {
    headers["X-TBA-Auth-Key"] = API_KEY;
  }

  const res = await fetch(`${BASE_URL}/event/${eventKey}/matches`, {
    headers
  });

  const data = await res.json();

  // ✅ CRITICAL: ensure it's an array
  if (!Array.isArray(data)) {
    console.error("TBA error:", data);
    return [];
  }

  return data;
}
