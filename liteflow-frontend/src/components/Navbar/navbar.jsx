import { NavLink } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-header">
      <div className="container-icon-optimiser-pc">
        <svg
          id="svg-eclair"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path d="M434.8 54.1C446.7 62.7 451.1 78.3 445.7 91.9L367.3 288L512 288C525.5 288 537.5 296.4 542.1 309.1C546.7 321.8 542.8 336 532.5 344.6L244.5 584.6C233.2 594 217.1 594.5 205.2 585.9C193.3 577.3 188.9 561.7 194.3 548.1L272.7 352L128 352C114.5 352 102.5 343.6 97.9 330.9C93.3 318.2 97.2 304 107.5 295.4L395.5 55.4C406.8 46 422.9 45.5 434.8 54.1z"/>
        </svg>
        <h1 className="navbar-title">LiteFlow</h1>
      </div>
      
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'navbar-item actif' : 'navbar-item'
            }
          >
            Dashboard
          </NavLink>
        </li>
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
            to="/connexion-vpn"
            className={({ isActive }) =>
              isActive ? 'navbar-item actif' : 'navbar-item'
            }
          >
            Connexion VPN
          </NavLink>
        </li>
      </ul>
    </nav>
    
  );
}

export default Navbar;
