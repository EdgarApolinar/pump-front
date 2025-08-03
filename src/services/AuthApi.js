// src/services/authAPI.js
const apiUrl = process.env.REACT_APP_API_URL;

const API_BASE_URL = `${apiUrl}/api/Auth`; // Reemplaza con tu URL real
//const API_BASE_URL = 'https://localhost:7055/api/Auth'; // Reemplaza con tu URL real

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la autenticación');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};