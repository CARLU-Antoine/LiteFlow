import { NavLink } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-header">
 
      <NavLink
      to="/systeme-informations" id='btn-information-systeme'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"/></svg>
      </NavLink>

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
