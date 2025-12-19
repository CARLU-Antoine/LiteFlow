import { NavLink } from 'react-router-dom';
import logo from '../../assets/liteflow.svg';
import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <img id="btn-logo-home" src={logo} alt="LiteFlow logo" />
        <h1 className="navbar-title">LiteFlow</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/optimiser-pc"
            className={({ isActive }) =>
              isActive ? 'navbar-item actif' : 'navbar-item'
            }
          >
            Optimiser le pc
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/nettoyage-disque"
            className={({ isActive }) =>
              isActive ? 'navbar-item actif' : 'navbar-item'
            }
          >
            Nettoyage disque
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/desinstallation-applications"
            className={({ isActive }) =>
              isActive ? 'navbar-item actif' : 'navbar-item'
            }
          >
            Désinstallation applications
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/connexion-vpn-telephones"
            className={({ isActive }) =>
              isActive ? 'navbar-item actif' : 'navbar-item'
            }
          >
            Connexion VPN pour les téléphones
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
