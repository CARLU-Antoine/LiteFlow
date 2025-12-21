export async function fetchNetwork() {
  const API_URL = '/api/network';
  
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();

  return json;
}
