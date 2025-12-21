export async function fetchSystemInfo() {
  const API_URL = '/api/system-info';
  
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();

  return json;
}
