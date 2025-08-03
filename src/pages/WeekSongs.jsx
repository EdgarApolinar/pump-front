import React, { useMemo, useState, useEffect, useCallback, use } from 'react';
import MainLayout from '../components/MainLayout';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Table, Select, Button, Spin, Row, Col, Card,Flex, message, Image, Input, Space, Modal, Form, InputNumber } from 'antd';
import { leagueService } from '../services/LeagueService';
import { songServices } from '../services/SongServices';
import { WeekSongServices } from '../services/WeekSongService';
import { render } from '@testing-library/react';
import '../css/CardComponent.css'
const { Option } = Select;

const WeekSongs = () =>{

  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [primaryOptions, setPrimaryOptions] = useState([]);
  const [cancionOptions, setCancionOptions] = useState([]);
  const [secundaryOptions, setSecundaryOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedCancion, setSelectedCancion] = useState(null);
  const [selectedNivel, setSelectedNivel] = useState(null);
  const [levelOptions, setLevelOptions] = useState([]);

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

  useEffect(() => {
      fetchPrimaryOptions();    
  }, []);
  
  useEffect(() => {
    if(selectedPrimary){
      setLoading(true);
      const fetchData = async () => {
        try {
          // Ejemplo de llamada a API - reemplaza con tu endpoint real
          const response = await WeekSongServices.getByWeek({week: selectedPrimary})
          //const data = await response.json();
          console.log(response)
          setCardsData(response);

        } catch (err) {
          setError(err.message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedPrimary]);


  useEffect(() => {
    if(isModalOpen){
      setLoading(true);
      const fetchData = async () => {
        try {
          // Ejemplo de llamada a API - reemplaza con tu endpoint real
          const response = await songServices.get({})
          //const data = await response.json();
          console.log(response)
          setCancionOptions(response.songs);

        } catch (err) {
          setError(err.message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isModalOpen]);
  
  useEffect(() => {
    if(selectedCancion){
      setLoading(true);
      const fetchData = async () => {
        try {
          // Ejemplo de llamada a API - reemplaza con tu endpoint real
          const response = await songServices.getSongLevelsSelect(selectedCancion)
          //const data = await response.json();
          console.log(response)
          setLevelOptions(response.niveles);
          setSelectedNivel(null);

        } catch (err) {
          setError(err.message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedCancion]);
  

  const handleSearch = () =>{

  };

  const handleClear = () => {

  };

  const handleOk = () => {
    form.
      validateFields()
      .then(values => {
          setLoadingAdd(true);
          console.log('values :', values);
          return WeekSongServices.add(values);
      })
      .then(response =>{
        console.log(response);
        form.resetFields();
        msuccess('Semana Creada');
        fetchPrimaryOptions();
        setIsModalOpen(false);        
      })
      .catch(error =>{
        console.log(error);
        merror( error.error || 'Formulario incompleto')
        return;
        //message.error(`Error: ${error.message || 'Error al guardar'}`, 10);
      }) 
     .finally(() =>{
      //   msuccess('Semana Creada');
      setLoadingAdd(false);
      //   setIsModalOpen(false);
      });
  }

  const msuccess = (message) => {
        messageApi.open({
        type: 'success',
            content: `${message}`,//'Canción Agregada correctamente',
        });
    };

  const merror = (message) => {
    messageApi.open({
      type: 'error',
      content: `${message}`,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);

  }

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  }

  const showModalEdit = () => {
    
  }

  const getSubcategorias = (value) => {
    console.log(value);

    return [];
  }

  return (
    <MainLayout>
      {contextHolder}
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="hero-icon" />          
        </h1>
      </section>
      <section>
        <Card title="Búsqueda por semana" style={{ margin: '20px' }}>
        <Spin spinning={loading}>
          <Row gutter={16}>
            <Col span={8}>
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
            
            <Col span={3}>
              <Button 
                  onClick={showModal}
                  color="cyan"
                  variant='solid'
                  // disabled={!selectedPrimary}
                  //block
              >
                Agregar semana
              </Button>
            </Col>
            <Col span={3}>
              <Button 
                  onClick={showModalEdit}
                  color="cyan"
                  variant='solid'
                  // disabled={!selectedPrimary}
                  //block
              >
                Editar semana
              </Button>
            </Col>
          </Row>
        </Spin>
      </Card>
      </section>
      <div className="cards-container" >
        {cardsData.map((card, index) => (
          <div 
            key={index} 
            className="card"
            style={{
              backgroundImage: `url(https://piugame.com/data/song_img/${card.piuSongCode}.png)`,//`url(${card.imageUrl})`, // Asume que la API devuelve imageUrl
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Imagen superpuesta */}
            {card.isSingle && (
              <div className="card-image-top">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/s_bg.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>            
            )}
            {card.isSingle && (
              <div className="card-image-bottom">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/s_text.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>            
            )}
            {card.isSingle && (
              <div className="card-image-bottom-n">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/s_num_${card.number2}.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>            
            )}
            {card.isSingle && (
              <div className="card-image-bottom-n2">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/s_num_${card.number1}.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>            
            )}
            {!card.isSingle && (
              <div className="card-image-top">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/d_bg.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>
            )}
            {!card.isSingle && (
              <div className="card-image-bottom">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/d_text.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>            
            )}
            {!card.isSingle && (
              <div className="card-image-bottom-n">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/d_num_${card.number2}.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>            
            )}
            {!card.isSingle && (
              <div className="card-image-bottom-n2">
                <img 
                  src= {`https://piugame.com/l_img/stepball/full/d_num_${card.number1}.png`}
                  alt={card.isSingle || 'Imagen superior'} 
                />
              </div>            
            )}

            <div className="card-content">
              <h3>{card.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        title="Agregar semana y canciones" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText = 'Registrar'
        cancelText = 'Salir'
        confirmLoading={loadingAdd}>
        
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
          <h2></h2>
        <Form
          form={form}
          name="dynamic_form"
          autoComplete="off"
          onFinish={(values) => {
            console.log('Valores del formulario:', values);
            alert('Formulario enviado: ' + JSON.stringify(values, null, 2));
          }}
        >
        {/* Input numérico */}
        <Form.Item
          label="Semana"
          name="week"
          rules={[{ required: true, message: 'Por favor ingrese semana' }]}
        >
          <Input type="number" placeholder="Ingrese un número" />
        </Form.Item>

        {/* Sección dinámica para agregar múltiples selects */}
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  {/* Primer select (categoría) */}
                  <Form.Item
                    {...restField}
                    name={[name, 'song']}
                    rules={[{ required: true, message: 'Seleccione una canción' }]}
                  >
                    <Select
                      placeholder="Seleccione canción"
                      style={{ width: 180 }}
                      onChange={(value) => setSelectedCancion(value)}
                      value={selectedCancion}
                    >
                      {cancionOptions.map(cancion => (
                        <Option key={cancion.id} value={cancion.id}>
                          {cancion.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Segundo select (subcategoría) - depende del primero */}
                  <Form.Item
                    {...restField}
                    name={[name, 'level']}
                    rules={[{ required: true, message: 'Seleccione un nivel' }]}
                  >
                    <Select
                      placeholder="Seleccione nivel"
                      style={{ width: 180 }}
                      onChange={(value) => setSelectedNivel(value)}
                      value={selectedNivel}
                      disabled={!selectedCancion}
                      //loading={loading}
                    >
                      { levelOptions.map(nivel => (
                          <Option key={nivel.idSongLevel} value={nivel.idSongLevel}>
                            {nivel.level}
                          </Option>
                        )
                      )}
                    </Select>
                  </Form.Item>

                  {/* Botón para eliminar este conjunto */}
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              {/* Botón para agregar nuevo conjunto */}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Agregar canción
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Botón de enviar */}
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item> */}
      </Form>
    </div>
                      
      </Modal>
    </MainLayout>
  );
}

export default WeekSongs;
