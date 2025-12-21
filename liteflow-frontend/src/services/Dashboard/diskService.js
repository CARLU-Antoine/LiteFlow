export async function fetchDisk() {
  const API_URL = '/api/disk';
  
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();

  return json;
}
