import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/navbar.jsx';
import OptimiserPc from './components/Optimiser-pc/optimiser-pc.jsx';
import CommandesOptimisation from './components/Commandes-optimisation/commandes-optimisation.jsx';
import NettoyageDisque from './components/Nettoyage-disque/nettoyage-disque.jsx';
import DesinstallationApplication from './components/Desinstallation-application/desinstallation-application.jsx';
import './App.css';

function App() {

  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <div className="container-components">
        <Routes>
          <Route path="/" element={<OptimiserPc />} />
          <Route path="/optimiser-pc" element={<OptimiserPc />} />
          <Route path="/commandes-optimisation" element={<CommandesOptimisation />} />
          <Route path="/nettoyage-disque" element={<NettoyageDisque />} />
          <Route path="/desinstallation-applications" element={<DesinstallationApplication />} />
        </Routes>
        </div>

      </BrowserRouter>
    </main>

  );
}

export default App;
