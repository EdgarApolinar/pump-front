import React, {useState} from 'react';
import './Header.css';
import Login from '../Login';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, removeAuthToken } from '../../utils/auth';
import { NavLink } from 'react-router-dom';

const Header = () => {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const handleLoginSuccess = async (userData) => {
    console.log('Usuario autenticado:', userData);
    // Redirigir o actualizar estado global
    navigate('/'); // Ejemplo de redirección
    window.location.reload();
  };


  const guestMenu = [
    {
      name: 'Inicio',
      path: '/'
    },
    {
      name: 'Resultados',
      submenu: [
        { name: 'League Test', path: '/clandestina' },
        { name: 'Clandestina', path: '/clandestina-main' },
        // { name: 'Ropa', path: '/productos/ropa' },
        // { name: 'Hogar', path: '/productos/hogar' }
      ]
    },
    // {
    //   name: 'Servicios',
    //   submenu: [
    //     { name: 'Consultoría', path: '/servicios/consultoria' },
    //     { name: 'Desarrollo', path: '/servicios/desarrollo' },
    //     { name: 'Soporte', path: '/servicios/soporte' }
    //   ]
    // },
    {
      name: 'Contacto',
      path: '/contacto'
    },
    {
      name: 'Ramdom',
      path: '/ramdom'
    }
  ];

  const authMenu = [
    {
      name: 'Inicio',
      path: '/'
    },
    {
      name: 'Liga',
      submenu: [
        { name: 'Clandestina', path: '/clandestina-main' }
        // { name: 'Ropa', path: '/productos/ropa' },
        // { name: 'Hogar', path: '/productos/hogar' }
      ]
    },
    {
      name: 'Servicios',
      submenu: [
        { name: 'Admi Canciones', path: '/song-admi' },
        { name: 'Admi Semana Canciones', path: '/week-songs-admi' },
        { name: 'Admi Usuario semana', path: '/user-week-admin' },
      ]
    },
    {
      name: 'Contacto',
      path: '/contacto'
    },
    {
      name: 'Ramdom',
      path: '/ramdom'
    }
  ];

  const currentMenu = isLoggedIn ? authMenu : guestMenu;

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/'); // Redirige a la página principal
    window.location.reload(); // Opcional: refresca para actualizar el estado
  };

    return (
      
      <header className="header">
        {/* <div className="logo">Mi Sitio</div> */}
        <img 
          src={process.env.PUBLIC_URL + '/assets/logo.png'} 
          alt="Logo de la empresa" 
          className="logo-image"
        />
        {/* <nav className="navigation">
          <a href="/">Inicio</a>
          <a href="/about">Acerca de</a>
          <a href="/contact">Contacto</a>
          <a href="/ramdom">Ramdom</a>
        </nav> */}
        
        <nav className="main-nav">
          {/* Botón de hamburguesa solo visible en móvil */}
          <button 
            className={`hamburger ${isOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        <ul className={`nav-list ${isOpen ? 'active' : ''}`}>
          {currentMenu.map((item, index) => (
            <li 
              key={index} 
              className={`nav-item ${item.submenu ? 'has-submenu' : ''} `}
              onMouseEnter={() => item.submenu && toggleSubmenu(item.name)}
              onMouseLeave={() => item.submenu && toggleSubmenu(null)}
            >
              {item.path ? (
                <NavLink to={item.path} className={`nav-link ${isOpen ? 'active' : ''}` }  >
                  {item.name}
                </NavLink>
              ) : (
                <button 
                  className={`nav-link `}
                  onClick={() => toggleSubmenu(item.name)}
                  aria-expanded={openSubmenu === item.name}
                  aria-haspopup="true"
                >
                  {item.name}
                </button>
              )}
              
              {item.submenu && (
                <ul 
                  className={`submenu ${openSubmenu === item.name ? 'open' : ''}`}
                  aria-hidden={openSubmenu !== item.name}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex} className="submenu-item">
                      <NavLink 
                        to={subItem.path} 
                        className="submenu-link"
                        onClick={() => setOpenSubmenu(null)}
                      >
                        {subItem.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          ) : (
            <button onClick={() => setIsLoginOpen(true)} className="login-button">
              Iniciar Sesión
            </button>
            )
          }
        </div>
        {/* <Button onClick={() => setIsLoginOpen(true)}>
          Iniciar Sesión
        </Button> */}
      
        <Login 
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLoginSuccess}
        />
      </header>
    );
  };
  
  export default Header;