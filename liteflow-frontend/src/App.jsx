import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/navbar.jsx';
import CommandesOptimisation from './components/Commandes-optimisation/commandes-optimisation.jsx';
import './App.css';

function App() {

  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <div className="container-components">
        <Routes>
          <Route path="/optimiser-pc" element={<CommandesOptimisation />} />
        </Routes>
        </div>

      </BrowserRouter>
    </main>

  );
}

export default App;
