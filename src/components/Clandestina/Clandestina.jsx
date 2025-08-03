// src/pages/UsersPage.jsx
import React from 'react';
import DataTable from '../Table/DataTable';
//import { render } from '@testing-library/react';
import { formatNumber } from '../../utils/format-number';
//import { fetchUsers } from '../services/userService';
import { fetchUsers } from '../../services/mockUserService';

const Clandestina = () => {
  // Column configuration
  const sepa = 2;
  const song  ="Nombre_Cancion";
  const level = "S/DLevel"
  const columns = [
    { 
      key: 'name', 
      title: 'Apodo', 
      sortable: true,
      //render: (value, row) => `${row.firstName} ${row.lastName}`
    },
    { 
      key: 'score', 
      title: 'Score', 
      sortable: true,
      render: (value) => formatNumber(value, {
        decimals: 0,
        thousandSeparator: ','
      })
    },
    { 
      key: 'nivel', 
      title: 'Nivel',
      render: (value) => {
        // Normalizar el nombre para que coincida con el archivo
        const imageName = value.toLowerCase().replace(/\s+/g, '-') + '.png';
        const imagePath = process.env.PUBLIC_URL + `/public/Quality/${imageName}`;
        const defaultImage = process.env.PUBLIC_URL + '/public/logo192.png';
        
        console.log(process.env.PUBLIC_URL);

        return (
          <div className="nivel">
            <img 
              src={imagePath} 
              onError={(e) => {
                e.target.src = defaultImage; // Fallback si la imagen no existe
              }}
              alt={`Foto de ${value}`}
              className="nivel"
            />
            <span className="nivel">{value}</span>
          </div>
        );
      }
    },
    { 
      key: 'puntos', 
      title: 'Puntos', 
      sortable: true,
      //render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Function to fetch data from API
  const fetchUserData = async (params) => {

    try {
        const response = await fetchUsers({
          page: 1,
          pageSize: 10,
          sortField: 'name',
          sortDirection: 'asc'
        });
        return {
            data: response.users,
            total: response.totalCount
          };
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    // const response = await fetchUsers({
    //   page: params.page,
    //   limit: params.pageSize,
    //   sort: params.sortField,
    //   order: params.sortDirection
    // }); 
  };

  const handleRowClick = (user) => {
    console.log('User selected:', user);
    // Navigate to user detail or open modal
  };

  return (
    
    <div className="page-container">
        <h1>Semana {sepa}</h1>
      <div className="Sepa">
        <h1>{song} {level}</h1>
      </div>
      <DataTable
        columns={columns}
        fetchData={fetchUserData}
        onRowClick={handleRowClick}
        initialSortField="name"
        itemsPerPage={15}
      />
    </div>
  );
};

export default Clandestina;
