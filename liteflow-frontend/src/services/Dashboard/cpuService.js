export async function fetchCPUData() {
  const API_URL = '/api/cpu';
  
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();
  if (!json || !json.data || !Array.isArray(json.data)) {
    throw new Error("Format de données invalide");
  }

  // json.data = [[timestamp, user, system, idle], ...]
  const userSeries = [];
  const systemSeries = [];

  json.data.forEach((dataPoint) => {
    if (Array.isArray(dataPoint) && dataPoint.length >= 3) {
      const timestamp = dataPoint[0] * 1000; // Convertir en millisecondes
      const userCPU = dataPoint[1];
      const systemCPU = dataPoint[2];

      if (timestamp && userCPU !== null && systemCPU !== null) {
        userSeries.push([timestamp, userCPU]);
        systemSeries.push([timestamp, systemCPU]);
      }
    }
  });

  return {
    userSeries,
    systemSeries
  };
}
