const STORAGE_KEY = "scouting_data";

export function saveScoutEntry(entry) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  existing.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getScoutEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function clearScoutEntries() {
  localStorage.removeItem(STORAGE_KEY);
}
