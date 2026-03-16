const BASE_URL = "https://www.thebluealliance.com/api/v3";

const API_KEY = process.env.REACT_APP_TBA_KEY;

// show whether the key exists
console.log("TBA API KEY VALUE:", API_KEY);

const headers = {
  "X-TBA-Auth-Key": API_KEY
};

async function safeFetch(url) {

  console.log("Fetching URL:", url);

  try {

    const response = await fetch(url, { headers });

    console.log("HTTP Status:", response.status);

    const data = await response.json();

    console.log("Full API response:", data);

    return data;

  } catch (error) {

    console.error("Fetch failed:", error);

    return [];

  }

}

export async function getEvents(year) {

  return safeFetch(`${BASE_URL}/events/${year}/simple`);

}

export async function getMatches(eventKey) {

  return safeFetch(`${BASE_URL}/event/${eventKey}/matches`);

}
