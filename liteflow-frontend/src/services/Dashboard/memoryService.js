export async function fetchMemory() {
  const API_URL = '/api/memory';
  
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();

  return json;
}
