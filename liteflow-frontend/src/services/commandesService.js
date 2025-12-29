export async function fetchCommandes() {
  const response = await fetch(`api/commandes`);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();

  return json;
}

export async function ajouterCommande(type, id, commande,description) {

  const response = await fetch('/api/ajouter-commandes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeOs:type,
      id:id,
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

export async function supprimerCommande(type, id) {
  const response = await fetch(`/api/supprimer-commandes/${id}?typeOs=${encodeURIComponent(type)}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Erreur HTTP: ${response.status}`);
  }

  return await response.json();
}

export async function fetchOptimiserPc(sudoPassword = null) {
  const response = await fetch('/api/optimiser-pc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sudoPassword })
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const json = await response.json();
  return json;
}