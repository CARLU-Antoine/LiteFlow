const fs = require('fs').promises;
const path = require('path');

const commande_file_bash = path.join(__dirname, '..', 'json/commandes_bash.json');
const commande_file_powershell = path.join(__dirname, '..', 'json/commandes_powershell.json');

class CommandesService {
  constructor() {}

  // ====================================
  // Vérifie que le fichier existe, sinon le crée
  // ====================================
  async verifierFile(file) {
    try {
      // Vérifie si le dossier existe
      const dir = path.dirname(file);
      await fs.mkdir(dir, { recursive: true });

      // Vérifie si le fichier existe
      await fs.access(file);
    } catch {
      // Si le fichier n'existe pas, le créer avec un tableau vide
      await fs.writeFile(file, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  // ====================================
  // Commande bash
  // ====================================
  async getCommandes(type) {

    if(type === "bash"){
      await this.verifierFile(commande_file_bash);
      const data = await fs.readFile(commande_file_bash, 'utf-8');
      return JSON.parse(data);
    }else if(type === "powershell"){
      await this.verifierFile(commande_file_powershell);
      const data = await fs.readFile(commande_file_powershell, 'utf-8');
      return JSON.parse(data);
    }

  }

  // ====================================
  // Ajout d'une commande dans le bon json
  // ====================================
  async addCommande(type, id, cmd, description) {
    // Récupérer les commandes existantes
    const commandes = await this.getCommandes(type);

    commandes.push({
      id:id,
      commande: cmd,
      description: description
    });

    const file = type === 'bash' ? commande_file_bash : commande_file_powershell;

    await this.verifierFile(file);

    await fs.writeFile(file, JSON.stringify(commandes, null, 2), 'utf-8');
  }

 // ====================================
// suppression d'une commande dans le bon json
// ====================================
async deleteCommande(type, id) {
  const commandes = await this.getCommandes(type);

  const commandesFiltrees = commandes.filter(cmd => cmd.id !== Number(id));

  const file = type === 'bash' ? commande_file_bash : commande_file_powershell;

  await this.verifierFile(file);

  await fs.writeFile(file, JSON.stringify(commandesFiltrees, null, 2), 'utf-8');
}


}

module.exports = new CommandesService();
