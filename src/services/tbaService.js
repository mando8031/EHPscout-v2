const API_KEY = process.env.REACT_APP_TBA_KEY;
const BASE_URL = "https://www.thebluealliance.com/api/v3";

export async function getEvents(year) {
  const res = await fetch(`${BASE_URL}/events/${year}`, {
    headers: {
      "X-TBA-Auth-Key": API_KEY
    }
  });

  return res.json();
}

export async function getMatches(eventKey) {
  if (!eventKey) return [];

  const res = await fetch(`${BASE_URL}/event/${eventKey}/matches`, {
    headers: {
      "X-TBA-Auth-Key": API_KEY
    }
  });

  const data = await res.json();

  // ✅ CRITICAL: ensure it's an array
  if (!Array.isArray(data)) {
    console.error("TBA error:", data);
    return [];
  }

  return data;
}
