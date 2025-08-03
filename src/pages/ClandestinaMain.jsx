import React, { useMemo, useState, useEffect, useCallback, use } from 'react';
import MainLayout from '../components/MainLayout';
import fetchTable from '../services/TablesApi';
import DataTable from '../components/Table/DataTable';
import { formatNumber } from '../utils/format-number';
import { leagueService } from '../services/LeagueService'
import { Table, Select, Button, Spin, Row, Col, Card, message, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/OverlayImage.css'
const { Option } = Select;

const ClandestinaMain = () => {

    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableDetailLoading, setTableDetailLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showTableDetails, setShowTableDetails] = useState(false);
    const [data, setData] = useState([]);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [searchDetailTriggered, setSearchDetailTriggered] = useState(false);

    // Estados para los filtros
    //const [leagueOptions, setleagueOptions] = useState([]);
    const [primaryOptions, setPrimaryOptions] = useState([]);
    const [secondaryOptions, setSecondaryOptions] = useState([]);
    //const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedPrimary, setSelectedPrimary] = useState(null);
    const [selectedSecondary, setSelectedSecondary] = useState(null);

    const [imageName, setImageName] = useState('default');
    const [imageNameSong, setImageNameSong] = useState('default');
    
    const ImageCell = React.memo(({ position }) => {

        const shouldShowImage = useMemo(() => {
            // Verificar si el valor es numérico
            const numericValue = Number(position);
            if (isNaN(numericValue)) return false;
        
            // Condiciones para mostrar imagen (ejemplo: valores entre 1 y 10)
            return numericValue >= 1 && numericValue <= 3;
        }, [position]);

        // Generar URL de imagen solo si es necesario
        const imageUrl = useMemo(() => {
            if (!shouldShowImage) return null;
            return `/Quality/${position}.png`;
        }, [position, shouldShowImage]);
      
        if (shouldShowImage) {
            return (
              <img 
                src={imageUrl}
                alt={`Ícono para valor ${position}`}
                className="table-image"
                onError={(e) => {
                  e.target.src = '/logo512.png';
                }}
                loading="lazy"
              />
            );
        }

        // Mostrar solo el valor numérico si no cumple las condiciones
        return (
            <span className="numeric-value">
                {position}°
            </span>
        );
      });

    //   const ImageCellRating = React.memo(({ imageName }) => {
    //     const imageUrl = useMemo(() => {
    //       console.log('Generando URL para:', imageName); // Solo debería aparecer una vez por imagen
    //       return `/Quality/${imageName}.png`;
    //     }, [imageName]);
      
    //     return (
    //       <img 
    //         src={imageUrl}
    //         alt=""
    //         className="table-image"
    //         onError={(e) => {
    //           e.target.src = '/logo512.png';
    //         }}
    //         loading="lazy"
    //       />
    //     );
    //   });

    const DynamicStars = ({ count }) => {
      // Asegurarnos que count sea un número válido (mayor o igual a 0)
      const starCount = Math.max(0, Number(count) || 0);
  
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap'}}>
          {Array.from({ length: starCount }).map((_, index) => (
            <span key={index} style={{ color: 'gold', marginRight: '2px' }}>★</span>
          ))}
        </div>
      );
    };

    const columns = [
        { 
            key: 'position', 
            title: 'Posición', 
            //sortable: true,
            render: (position) => <ImageCell position={position} />
        },
        { 
            key: 'name', 
            title: 'Apodo', 
          //sortable: true,
          //render: (value, row) => `${row.firstName} ${row.lastName}`
        },
        { 
          key: 'points', 
          title: 'Puntos', 
          //sortable: true,
        //   render: (value) => formatNumber(value, {
        //     decimals: 0,
        //     thousandSeparator: ','
        //   })
        },
        { 
          key: 'pgs', 
          title: 'PG',
          render: (pgs) => <DynamicStars count={pgs} />      
        }
      ];

  //   // Cargar opciones primarias al montar el componente
  // useEffect(() => {
  //     const fetchLeagueOptions = async () => {
  //       setLoading(true);
  //       //setTableLoading (true);
  //       try {
  //         // Simular llamada API
  //         const response = await leagueService.AllLeague();
  //         const result = await response;
  //         setleagueOptions(result);
  //       } catch (error) {
  //         console.error('Error fetching primary options:', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchLeagueOptions(); 
  // }, []);

useEffect(() => {
  
    const fetchPrimaryOptions = async () => {
      setLoading(true);
      //setTableLoading (true);
      try {
        // Simular llamada API
        const response = await leagueService.AllWeek({league: null});
        const result = await response;
        setPrimaryOptions(result);
      } catch (error) {
        console.error('Error fetching primary options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryOptions();
    
}, []);

  // Cargar opciones secundarias cuando se selecciona una opción primaria
  useEffect(() => {
    if (selectedPrimary) {
      const fetchSecondaryOptions = async () => {
        setLoading(true);
        setSecondaryOptions([]); // Resetear opciones secundarias
        setSelectedSecondary(null); // Resetear selección secundaria
        setTableDetailLoading(true); // activar la nueva busqueda
        try {
          // Simular llamada API con el parámetro del primer select
          const response = await leagueService.songWeek({week:selectedPrimary})
          const result = await response;
          setSecondaryOptions(result.items);
          //setShowTable(false);
        } catch (error) {
          console.error('Error fetching secondary options:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSecondaryOptions();
    }
  }, [selectedPrimary]);

  // Detectar cambios en los selects y ejecutar búsqueda automática
  useEffect(() => {
    setShowTableDetails(false);
    setSearchDetailTriggered(false);
    setImageName(null)
  }, [selectedSecondary]);

     // Function to fetch data from API
  const fetchUserData = useCallback (async (params) => {
    if(!selectedPrimary){      
      return { data: [], total: 0 };
    }

    setTableLoading(true);

    try{
      const response = await leagueService.ClandestinaMain({"week": selectedPrimary, league : null});

      const res = {
        data: response.items,
        total: response.items.length
      };
      return res;
    } catch (error) {
      message.error('Error al cargar los datos');
      console.error('Error fetching table data:', error);
      return { data: [], total: 0 };
    } finally {
      setTableLoading(false);
    }
  },[searchTriggered]);

  const handleRowClick = (user) => {
    console.log('User selected:', user);

    // Navigate to user detail or open modal
  };

  const handleSearch = () => {
    if (!selectedPrimary) {
      message.warning('Por favor seleccione almenos el primer filtro');
      return;
    }

    if(selectedPrimary && !selectedSecondary ){
      setShowTable(true);
      setShowTableDetails(false);
      setSearchTriggered(true);
      setSearchDetailTriggered(false);
      return;
    }

    if(selectedPrimary && selectedSecondary){
       setShowTable(false);
       setShowTableDetails(true);
       setSearchTriggered(false);
       setSearchDetailTriggered(true);
       return;
    }
        
  };

  const handleClear = () =>{
    setSelectedSecondary(null); // Resetear selección secundaria
    setSelectedPrimary(null); //
    //setSelectedLeague(null);
    setShowTable(false);
    setShowTableDetails(false);
    setSearchTriggered(false);
    setSearchDetailTriggered(false);
  }


  const columnsSong = [
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
    render: (imageName) => <ImageCellAll imageName={imageName} />
  },
  { 
    key: 'points', 
    title: 'Puntos', 
    //sortable: true,
  },

];

const ImageCellAll = React.memo(({ imageName }) => {
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

     // Function to fetch data from API
const fetchUserDataSongDetails = useCallback( async (params) => {

  if(!selectedPrimary && !selectedSecondary){      
      return { data: [], total: 0 };
  }

  setTableDetailLoading(true);

  try
  {
    const response = await leagueService.songWeekDetail({"weekId": selectedPrimary, "songLevelId": selectedSecondary });

      const res = {
        data: response.items,
        total: response.items.length
      };

      setImageName(response.isSingle ? 's_bg':'d_bg');
      //setImageNameSong(response.idSong);
      setImageNameSong(response.piuCode);
      console.log(imageName);
      console.log(process.env.PUBLIC_URL)
      return res;
  } catch (error) {
      message.error('Error al cargar los datos');
      console.error('Error fetching table data:', error);
      return { data: [], total: 0 };
     } finally {
      setTableDetailLoading(false);
    }
  },[searchDetailTriggered]);




  return (
    <MainLayout>
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="hero-icon" />          
        </h1>
      </section>
      <section>
         <Card title="Búsqueda por semana" style={{ margin: '20px' }}>
          <Spin spinning={loading}>
            <Row gutter={16}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Seleccione una opción principal"
                  onChange={(value) => setSelectedPrimary(value)}
                  value={selectedPrimary}
                  // disabled={!selectedLeague}
                  loading={loading}
                >
                  {primaryOptions.map(option => (
                    <Option key={option.id} value={option.id}>
                      Semana {option.id}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col span={9}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Seleccione una opción secundaria"
                  onChange={(value) => setSelectedSecondary(value)}
                  value={selectedSecondary}
                  disabled={!selectedPrimary}
                  loading={loading}
                >
                  {secondaryOptions.map(option => (
                    <Option key={option.idSongLevel} value={option.idSongLevel}>
                      {option.songName} {option.isSingle ? "S": "D"}{option.level}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col span={3}>
                <Button 
                  type="primary" 
                  onClick={handleSearch}
                  disabled={!selectedPrimary}
                  icon={<SearchOutlined />}
                  block
                >
                  Buscar
                </Button>
              </Col>

              <Col span={3}>
                <Button 
                  onClick={handleClear}
                  disabled={!selectedPrimary}
                  block
                >
                  Limpiar
                </Button>
              </Col>
            </Row>
          </Spin>
        </Card>
      </section>
      { showTable && ( 
        
        <section className="features-section">
        {/* Contenido de la página */}
        <div className="page-container">
            <DataTable
                columns={columns}
                fetchData={fetchUserData}
                onRowClick={handleRowClick}
                initialSortField="name"
                itemsPerPage={15}
                loading={tableLoading}
                // Añadir esta prop para prevenir carga automática
                manualPagination={true}
            />
        </div>
      </section>
      )}
      { showTableDetails && 
            
        <section className="features-section">
          {/* Contenido de la página */}
          <div className="imagen-cen">
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              {/* <Image width={200} src={`${process.env.PUBLIC_URL}/songs/${imageNameSong}.png`}  /> */}
              <Image width={200} src={`https://piugame.com/data/song_img/${imageNameSong}.png`}  />
              {/* <Image
                width={100}
                src={`${process.env.PUBLIC_URL}/level/${imageName}.png`}
              /> */}
            </Image.PreviewGroup>
          </div>
          <div className="page-container">
            <DataTable
              columns={columnsSong}
              fetchData={fetchUserDataSongDetails}
              onRowClick={handleRowClick}
              initialSortField="name"
              itemsPerPage={15}
              loading={tableDetailLoading}
              manualPagination={true}
            />
          </div>
        </section>
      }
    </MainLayout>
  );
};

export default ClandestinaMain;