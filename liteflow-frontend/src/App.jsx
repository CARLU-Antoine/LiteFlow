import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/navbar.jsx';
import OptimiserPc from './components/Optimiser-pc/optimiser-pc.jsx';
import CommandesOptimisation from './components/Commandes-optimisation/commandes-optimisation.jsx';
import './App.css';

function App() {

  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <div className="container-components">
        <Routes>
          <Route path="/optimiser-pc" element={<OptimiserPc />} />
          <Route path="/commandes-optimisation" element={<CommandesOptimisation />} />

        </Routes>
        </div>

      </BrowserRouter>
    </main>

  );
}

export default App;
