// src/services/mockUserService.js
export const fetchUsers = async (params = {}) => {
    // Datos de usuario de ejemplo
    const mockUsers = [
      { id: 1, name: 'name',  score : 925566, nivel : 'sss', role: 'test role', puntos: 14 },
    //   { id: 2, name: 'María García', email: 'maria@example.com', status: 'active' },
    //   { id: 3, name: 'Carlos López', email: 'carlos@example.com', status: 'inactive' },
    //   { id: 4, name: 'Ana Martínez', email: 'ana@example.com', status: 'pending' },
    //   { id: 5, name: 'Pedro Sánchez', email: 'pedro@example.com', status: 'active' }
    ];
  
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 1500));
  
    return {
      success: true,
      users: mockUsers,
      total: mockUsers.length
    };
  };