# LiteFlow

LiteFlow est une application desktop pour le monitoring et l’optimisation des PC, développée avec React.js, Node.js et Electron. Elle permet de suivre les performances de votre ordinateur et de gérer les ressources système en temps réel.
Fonctionnalités
Dashboard en temps réel : CPU, RAM, disque et réseau, avec WebSocket pour un suivi instantané.
Optimisation du PC : commandes système et export Excel.
Nettoyage du disque : fichiers temporaires et cache navigateur.
Désinstallation d’applications : suppression rapide des programmes inutiles.
VPN & Hotspot : configuration VPN et partage de connexion.
API Node.js avec Swagger pour tester les endpoints.
Technologie
Frontend : React.js + Material-UI
Backend : Node.js + WebSocket
Desktop : Electron
Librairies principales : systeminformation, xlsx, swagger-ui-express

### Dashboard
<img width="2994" height="1594" alt="image" src="https://github.com/user-attachments/assets/a12dd055-00be-4db2-b773-7747cb2321b5" />

### Page pour optimiser le PC
<img width="2990" height="1602" alt="image" src="https://github.com/user-attachments/assets/e66a7bfe-4029-4fc7-b6d2-7625398f7ce9" />

### Page pour nettoyer le PC
<img width="2996" height="1598" alt="image" src="https://github.com/user-attachments/assets/18aef506-0cc6-4cb3-b0c4-07d68c55687d" />

### Page pour désinstaller une application
<img width="3006" height="1598" alt="image" src="https://github.com/user-attachments/assets/13e0e414-4ef1-45e6-8159-c488bdac3f74" />

### Page pour configurer le VPN
<img width="3002" height="1598" alt="image" src="https://github.com/user-attachments/assets/74fed8e1-6846-45a7-bbdd-c8ee57a4e758" />

### Informations du PC
<img width="3002" height="1600" alt="image" src="https://github.com/user-attachments/assets/ac15f8b5-46c1-4f55-a265-e8c58b649cfd" />

### Endpoints
<img width="3022" height="1720" alt="image" src="https://github.com/user-attachments/assets/d53c75f6-cc45-4ab5-8226-da7b112ce0f3" />

# Installation

```Commandes
# Cloner le dépôt
git clone https://github.com/CARLU-Antoine/LiteFlow.git
cd LiteFlow

# Backend
cd liteflow-backend
npm install
npm run dev

# Frontend
cd ../liteflow-frontend
npm install
npm run dev

# Desktop (Electron)
npm run dev:electron
