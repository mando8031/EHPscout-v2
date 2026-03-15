const BASE = "https://www.thebluealliance.com/api/v3";

const headers = {
  "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY
};

async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers });

    if (!res.ok) {
      console.error("TBA request failed:", res.status);
      return [];
    }

    const data = await res.json();

    console.log("TBA response:", data);

    return data;

  } catch (err) {
    console.error("TBA fetch error:", err);
    return [];
  }
}

export async function getEvents(year) {
  return safeFetch(`${BASE}/events/${year}`);
}

export async function getMatches(eventKey) {
  return safeFetch(`${BASE}/event/${eventKey}/matches`);
}
