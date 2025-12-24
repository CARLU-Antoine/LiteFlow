export async function fetchCommandes(type) {
  const response = await fetch(`api/commandes?typeOs=${type}`);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();

  return json;
}

export async function ajouterCommande(type, commande,description) {

  const response = await fetch('/api/ajouter-commandes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeOs:type,
      cmd: commande,
      description:description
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Erreur HTTP: ${response.status}`);
  }

  return await response.json();
}
