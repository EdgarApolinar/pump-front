import React, { useMemo } from 'react';
import MainLayout from '../components/MainLayout';
import fetchTable from '../services/TablesApi';
import DataTable from '../components/Table/DataTable';
import { formatNumber } from '../utils/format-number';

const Clandestina = () => {

    const ImageCell = React.memo(({ imageName }) => {
        const imageUrl = useMemo(() => {
          console.log('Generando URL para:', imageName); // Solo debería aparecer una vez por imagen
          return `/Quality/${imageName}.png`;
        }, [imageName]);
      
        return (
          <img 
            src={imageUrl}
            alt=""
            className="table-image"
            onError={(e) => {
              e.target.src = '/logo512.png';
            }}
            loading="lazy"
          />
        );
      });

      const ImageCellRating = React.memo(({ imageName }) => {
        const imageUrl = useMemo(() => {
          console.log('Generando URL para:', imageName); // Solo debería aparecer una vez por imagen
          return `/Quality/${imageName}.png`;
        }, [imageName]);
      
        return (
          <img 
            src={imageUrl}
            alt=""
            className="table-image"
            onError={(e) => {
              e.target.src = '/logo512.png';
            }}
            loading="lazy"
          />
        );
      });

    const columns = [
        { 
          key: 'name', 
          title: 'Apodo', 
          //sortable: true,
          //render: (value, row) => `${row.firstName} ${row.lastName}`
        },
        { 
          key: 'score', 
          title: 'Score', 
          //sortable: true,
          render: (value) => formatNumber(value, {
            decimals: 0,
            thousandSeparator: ','
          })
        },
        { 
          key: 'level', 
          title: 'Nivel',
          dataIndex: 'level',
          render: (imageName) => <ImageCellRating imageName={imageName} />
        },
        {
          key: 'rating', 
          title: 'Clasificacion',
          dataIndex: 'rating',
          render: (imageName) => <ImageCell imageName={imageName} />
        },
        { 
          key: 'points', 
          title: 'Puntos', 
          //sortable: true,
        },

      ];

     // Function to fetch data from API
  const fetchUserData = async (params) => {
    const response = await fetchTable({"weekSongId": 2});
    
    console.log("de pagina");

    return {
      data: response.result.items,
      total: response.result.totalCounts
    };
  };

  const handleRowClick = (user) => {
    console.log('User selected:', user);
    // Navigate to user detail or open modal
  };

  return (
    <MainLayout>
      <section className="hero-section">
        <h1>Clandestina</h1>
        <p>Semana</p>
        <div className='col-md-6'>Nombre rola</div><div className='col-md-6'>Nivel</div>
      </section>
      
      <section className="features-section">
        {/* Contenido de la página */}
        <div className="page-container">
            <DataTable
                columns={columns}
                fetchData={fetchUserData}
                onRowClick={handleRowClick}
                initialSortField="name"
                itemsPerPage={15}
            />
        </div>
      </section>
    </MainLayout>
  );
};

export default Clandestina;