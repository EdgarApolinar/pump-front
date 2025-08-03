import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login } from '../../services/AuthApi';
import './Login.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Resetear el estado cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setCredentials({ userName: '', password: '' });
      setErrors({});
      setLoginError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // if (!credentials.email) {
    //   newErrors.email = 'El email es requerido';
    // } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
    //   newErrors.email = 'Email no válido';
    // }
    
    // if (!credentials.password) {
    //   newErrors.password = 'La contraseña es requerida';
    // } else if (credentials.password.length < 6) {
    //   newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (validate()) {
      setIsLoading(true);
      try {
       // Llamada a la API real
       const response = await login(credentials);
       console.log(response.result);
       // Guardar token en localStorage/sessionStorage
       localStorage.setItem('authToken', response.result.token);
       localStorage.setItem('refreshToken', response.result.refreshToken);
       // Ejecutar callback de éxito
       onLogin(response.user);
        onClose(); // Cerrar modal si el login es exitoso
      } catch (error) {
        setLoginError(error.message || 'Error al iniciar sesión');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        <div className="modal-content">
          <h2>Iniciar Sesión</h2>
          
          {loginError && <div className="error-message">{loginError}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userName">Email</label>
              <input
                //type="email"
                id="userName"
                name="userName"
                value={credentials.userName}
                onChange={handleChange}
                className={errors.userName ? 'error' : ''}
              />
              {errors.userName && <span className="error-text">{errors.userName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="login-links">
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            <a href="/register">Crear una cuenta</a>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
};

export default LoginModal;