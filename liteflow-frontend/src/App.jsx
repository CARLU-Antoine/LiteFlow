import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/navbar.jsx';
import Dashboard from './components/Dashboard/dashboard.jsx';
import OptimiserPc from './components/Optimiser-pc/optimiser-pc.jsx';
import CommandesOptimisation from './components/Commandes-optimisation/commandes-optimisation.jsx';
import NettoyageDisque from './components/Nettoyage-disque/nettoyage-disque.jsx';
import DesinstallationApplication from './components/Desinstallation-application/desinstallation-application.jsx';
import ConnexionVPN from './components/Connexion-vpn/connexion-vpn.jsx';
import ResultatHotspotVPN from './components/Connexion-vpn/resultat-hotpost-vpn.jsx';
import SystemInfo from './components/Navbar/systeminfo.jsx';

function App() {

  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <div className="container-components">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/systeme-informations" element={<SystemInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/optimiser-pc" element={<OptimiserPc />} />
          <Route path="/commandes-optimisation" element={<CommandesOptimisation />} />
          <Route path="/nettoyage-disque" element={<NettoyageDisque />} />
          <Route path="/desinstallation-applications" element={<DesinstallationApplication />} />
          <Route path="/connexion-vpn" element={<ConnexionVPN />} />
          <Route path="/resultat-hotpost-vpn" element={<ResultatHotspotVPN />} />
        </Routes>
        </div>

      </BrowserRouter>
    </main>

  );
}

export default App;
