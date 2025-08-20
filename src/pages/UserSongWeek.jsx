import React, { useMemo, useState, useEffect, useCallback, use } from 'react';
import MainLayout from '../components/MainLayout';
import { Table, Select, Button, Spin, Row, Col, Card, message, Image, Input, Space, Modal, Form, InputNumber, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { leagueService } from '../services/LeagueService'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { WeekSongServices } from '../services/WeekSongService';
import '../css/UserSongWeek.css'

const { Option } = Select;
const UserSongWeek = () =>{
    const [form] = Form.useForm();
    const [formAddScore] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingAddScore, setloadingAddScore] = useState(false);
    const [selectedPrimary, setSelectedPrimary] = useState(null);
    const [primaryOptions, setPrimaryOptions] = useState([]);
    const [userSongAddScoreOptions, setUserSongAddScoreOptions] = useState([]);
    const [userSongAddScore, setUserSongAddScore] = useState(null);
    const [opcionesSelect, setOpcionesSelect] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [titleUserAdd, setTitleUserAdd] = useState(null);
    const [IdUserAdd, setIdUserAdd] = useState(null);

    const [isModalOpenAddScore, setIsModalOpenAddScore] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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

    useEffect(() => {
      if(isModalOpen){
        const fetchUserOptions = async () => {
          setLoading(true);
          //setTableLoading (true);
          try {
            // Simular llamada API
            const response = await WeekSongServices.getUsers();
            const result = await response;
            setOpcionesSelect(result.users);
          } catch (error) {
            console.error('Error fetching primary options:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserOptions();
      }
        
    }, [isModalOpen]);

  // Obtener los valores actuales del formulario
  const items = Form.useWatch('users', form) || [];

  // Función para filtrar las opciones disponibles
  const getAvailableOptions = (currentIndex) => {
    return opcionesSelect.filter(opcion => 
      items[currentIndex]?.idUser === opcion.id ||
      !items.some((item, index) => index !== currentIndex && item?.idUser === opcion.id)
    );
  };

    const handleSearch = () => {
      console.log(selectedPrimary);

      const fetchUserComplete = async () => {
          setLoadingTable(true);
          try {
            // Simular llamada API
            const response = await WeekSongServices.getUserStatusWeek(selectedPrimary);
            //const result = await response;
            console.log(response);
            setDataTable(response.users);
            setViewTable(true);
          } catch (error) {
            console.error('Error fetching primary options:', error);
            merror("Error al consultar datos")
          } finally {
            setLoadingTable(false);
          }
        };

      fetchUserComplete();
    
    };

    const SearchOulLined = () => {

    };

    const handleClear = () => {

    }

    const onFinish = () => {

    }
    
    const handleOk = () => {
      form.
        validateFields()
        .then(values => {
            setLoadingAdd(true);
            console.log('values :', values);
            return WeekSongServices.setUserSongLevels(values);            
        })
        .then(response =>{
            console.log('response :', response);
            msuccess(response.succesMessage || 'Canción Agregada correctamente');
            form.resetFields();
            //setIsModalOpen(false);
        })
        .catch(error =>{
            console.log(error);
            merror(error.error)
            //message.error(`Error: ${error.message || 'Error al guardar'}`, 10);
        })
         .finally(() => {
         setLoadingAdd(false);
         });
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    }
    
     const showModal = () => {



      form.setFieldsValue({
        week: selectedPrimary, // "week" es el `name` del Form.Item
      });
      setIsModalOpen(true);        
    }

    // Sincroniza el valor cuando `otraVariable` cambie
  // useEffect(() => {
  //   form.setFieldsValue({
  //     week: selectedPrimary, // "week" es el `name` del Form.Item
  //   });
  // }, [selectedPrimary]);

  const onRowClick = async (e) => {
    console.log(e);

    if(e.isComplete !== 'Registro completo') {
      //merror("agregar cambios")
      setIsModalOpenAddScore(true);
      setTitleUserAdd(e.name);
      setIdUserAdd(e.id);
      setloadingAddScore(true);
          //setTableLoading (true);
          try {
            // Simular llamada API
            const response = await WeekSongServices.getSongStatusWeek(e.id, selectedPrimary);
            const result = await response;
            setUserSongAddScoreOptions(result);
          } catch (error) {
            console.error('Error fetching primary options:', error);
          } finally {
            setloadingAddScore(false);
          }
    } else{
      msuccess('Sin cambios por agregar');
    }
  }

  // useEffect(() => {
  //     if(isModalOpenAddScore){
  //       const fetchUserSongAddOptions = async () => {
  //         setloadingAddScore(true);
  //         //setTableLoading (true);
  //         try {
  //           // Simular llamada API
  //           const response = await WeekSongServices.getUserStatusWeek();
  //           const result = await response;
  //           setUserSongAddScoreOptions(result.users);
  //         } catch (error) {
  //           console.error('Error fetching primary options:', error);
  //         } finally {
  //           setloadingAddScore(false);
  //         }
  //       };
    
  //       fetchUserSongAddOptions();
  //     }
        
  //   }, [isModalOpenAddScore]);

  const columns = [
    { title: 'Nickname', dataIndex: 'name', key: 'name' },
    { title: 'Completo', dataIndex: 'isComplete', key: 'isComplete' },
  ];
  const [dataTable, setDataTable] = useState([]);
  const [viewTable, setViewTable] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const handleOkAddScore = () => {
    setloadingAddScore(true);
    formAddScore
    .validateFields()
    .then(values => {
      values.idUser = IdUserAdd;
      console.log(values);
      return WeekSongServices.setScoreUser(values);
    })
    .then(response =>{
      console.log(response);
      msuccess(response.succesMessage);
      formAddScore.resetFields();
      setTitleUserAdd(null);
      setIdUserAdd(null);
      setUserSongAddScore(null);
      setIsModalOpenAddScore(false);
      handleSearch();



    })
    .catch(error => {
      merror(error.error || "Llena los campos requeridos");
    }).finally(() =>{
      setloadingAddScore(false);
    })
  }

  const handleCancelAddScore = () => {
    setIsModalOpenAddScore(false);
    formAddScore.resetFields();
    setUserSongAddScore(null);

  }

  // Manejar expansión de filas
  const handleExpand = (expanded, record) => {
    console.log(expanded)
    console.log(record)
    console.log(expandedRowKeys)
    if (expanded) {
      setExpandedRowKeys([record.id]); // Solo expande la fila clicada
    } else {
      setExpandedRowKeys([]); // Cierra todas
    }
  };

  return(
    <MainLayout>
      {contextHolder}
      <section className="hero-section">
          <h1>Administracion de usuarios a semanas </h1>
      </section>
      <section>
        <Card title="Búsqueda por sepa" style={{ margin: '20px' }}>
          <Spin spinning={loading}>
            <Row gutter={16}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Seleccione una opción"
                  onChange={(value) => setSelectedPrimary(value)}
                  value={selectedPrimary}
                  // disabled={!selectedLeague}
                  loading={loading}
                >
                    {primaryOptions.map(option => (
                    <Option key={option.id} value={option.id}>
                        Sepa {option.id}
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
                  Ver Usuarios
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
              <Col span={4}>
                <Button 
                    onClick={showModal}
                    color="cyan"
                    variant='solid'                    
                    disabled={!selectedPrimary}
                    //block
                >
                  Agregar Usuario a Semana
                </Button>
              </Col>
            </Row>
          </Spin>
        </Card>
      </section>
      <section>
      { viewTable &&
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {onRowClick(record)}, // click row
              onDoubleClick: (event) => {}, // double click row
              onContextMenu: (event) => {}, // right button click row
              onMouseEnter: (event) => {}, // mouse enter row
              onMouseLeave: (event) => {}, // mouse leave row
            };
          }}
          columns={columns}
          loading = {loadingTable}
          
          expandable={{
            expandedRowRender: record => <p style={{ margin: 0 }}>{record.inComplete}</p>,
            rowExpandable: record => record.isComplete === 'InComplete',
            
          }}
          dataSource={dataTable}
        />
      }
      </section>
        <Modal 
          title="Agregar usuarios a semana" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText = 'Guardar'
          cancelText = 'Salir'
          confirmLoading={loadingAdd}
        >
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
            <h2>Semana</h2>
            <Form
              form={form}
              name="dynamic_form_nest_item"
              onFinish={onFinish}
              autoComplete="off"
            >
              {/* Lista dinámica */}
              <Form.Item 
                name="week"
                rules={[{ required: true, message: 'Por favor ingrese semana' }]}
              >
                <Select 
                  placeholder="Seleccione una opción" 
                  style={{ width: 200 }}
                  disabled = {true}
                  //defaultValue={selectedPrimary}
              >
                  {primaryOptions.map(opcion => (
                  <Option key={opcion.id} value={opcion.id}>
                      Semana {opcion.id}
                  </Option>
                  ))}
              </Select>
              </Form.Item>
              <Form.List name="users">
                {(fields, { add, remove }) => (
                  
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Space
                        key={key}
                        style={{ 
                          display: 'flex', 
                          marginBottom: 16,
                          alignItems: 'flex-start',
                          gap: 16
                        }}
                        align="baseline"
                      >
                        {/* Campo Select */}
                        <Form.Item
                          {...restField}
                          name={[name, 'idUser']}
                          rules={[{ required: true, message: 'Seleccione una opción' }]}
                        >
                          <Select 
                            showSearch
                            filterOption={true}
                            placeholder="Seleccione una opción"
                            optionFilterProp="children"
                            style={{ width: 200 }}
                          >
                            {getAvailableOptions(index).map(opcion => (
                              <Option key={opcion.id} value={opcion.id}>
                                {opcion.userName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {/* Botón para eliminar */}
                        <MinusCircleOutlined 
                          onClick={() => remove(name)} 
                          style={{ color: 'red', fontSize: '16px', marginTop: '8px' }}
                        />
                      </Space>
                    ))}

                    {/* Botón para agregar nuevo elemento */}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        style={{ marginTop: '16px' }}
                      >
                        Agregar Usuario
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              {/* Botón de envío */}
              {/* <Form.Item>
                <Button type="primary" htmlType="submit">
                  Enviar Formulario
                </Button>
              </Form.Item> */}
            </Form>
          </div>
        </Modal>
        <Modal 
          title={`Agregar Score ${titleUserAdd}`} 
          open={isModalOpenAddScore} 
          onOk={handleOkAddScore} 
          onCancel={handleCancelAddScore}
          okText = 'Registrar'
          cancelText = 'Salir'
          confirmLoading={loadingAddScore}
        >
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
            <h2>Formulario Dinámico</h2>
            <Form
              form={formAddScore}
              name="dynamic_form_nest_item"
              //onFinish={onFinish}
              autoComplete="off"
            >
              {/* Lista dinámica */}
              <Form.Item 
                name="song"
                rules={[{ required: true, message: 'Por favor selecciona cancion' }]}
              >
                <Select 
                  placeholder="Seleccione una opción" 
                  style={{ width: 200 }}
                  onChange={(value) => 
                    { const song = userSongAddScoreOptions.find(x => x.idSongWeekUser === value);
                      console.log(song);
                      console.log(value);
                      setUserSongAddScore(song.piuCode)}}
              >
                  {userSongAddScoreOptions.map(opcion => (
                  <Option key={opcion.idSongWeekUser} value={opcion.idSongWeekUser}>
                      {opcion.songName}
                  </Option>
                  ))}
              </Select>
              </Form.Item>
              {userSongAddScore && <div                
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(https://piugame.com/data/song_img/${userSongAddScore}.png)`,//`url(${card.imageUrl})`, // Asume que la API devuelve imageUrl
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
              {/* Input numérico */}
                <Form.Item                  
                  label="Score"
                  name="score"
                  className="custom-oxanium-label-blue"
                  style={{
                    width: '50%',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white'
                  }}
                  labelCol={{
                    style: {
                       width: '45%',
                      padding: 0,
                      textAlign: 'left' 
                    }
                  }}
                  rules={[{ required: true, message: 'Por favor ingrese cantidad de perfects' },
                  {
                    type: 'number',
                    max: 1000000,
                    message: 'El valor no puede ser mayor a 1,000,000'}
    
                  ]}
                >
                  <InputNumber style={{ width: '100%', marginLeft: '10px', textAlign: 'center' }} 
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')} 
                    placeholder="Score"  max={1000000} />
                </Form.Item>
              {/* Input numérico */}
                <Form.Item                  
                  label="Perfects"
                  name="perfects"
                  className="custom-oxanium-label-blue"
                  style={{
                    width: '50%',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white'
                  }}
                  labelCol={{
                    style: {
                      width: '45%',
                      padding: 0,
                      textAlign: 'left' 
                    }
                  }}
                  rules={[{ required: true, message: 'Por favor ingrese cantidad de perfects' }]}
                >
                  <Input style={{ width: '100%', marginLeft: '10px', textAlign: 'center' }} type="number" placeholder="Perfects" />
                </Form.Item>
                <Form.Item
                  label="Greats"
                  name="greats"
                  className="custom-oxanium-label-green"
                  style={{
                    width: '50%',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white'
                  }}
                  labelCol={{
                    style: {
                      width: '45%',
                      padding: 0,
                      textAlign: 'left' 
                    }
                  }}
                  rules={[{ required: true, message: 'Por favor ingrese cantidad de greats' }]}
                >
                  <Input style={{ width: '100%', marginLeft: '10px', textAlign: 'center' }} type="number" placeholder="Greats" />
                </Form.Item>
                <Form.Item
                  label="Goods"
                  name="goods"
                  className="custom-oxanium-label-yellow"
                  style={{
                    width: '50%',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white'
                  }}
                  labelCol={{
                    style: {
                      width: '45%',
                      padding: 0,
                      textAlign: 'left' 
                    }
                  }}
                  rules={[{ required: true, message: 'Por favor ingrese cantidad de goods' }]}
                >
                  <Input style={{ width: '100%', marginLeft: '10px', textAlign: 'center' }} type="number" placeholder="Goods" />
                </Form.Item>
                <Form.Item
                  label="Bads"
                  name="bads"
                  className="custom-oxanium-label-red"
                  style={{
                    width: '50%',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white'
                  }}
                  labelCol={{
                    style: {
                     width: '45%',
                      padding: 0,
                      textAlign: 'left',
                      display: 'inline-block',     // Para que el fondo no ocupe toda la línea
                    }
                  }}
                  rules={[{ required: true, message: 'Por favor ingrese cantidad de bads' }]}
                >
                  <Input style={{ width: '100%', marginLeft: '10px', textAlign: 'center' }} type="number" placeholder="Bads" />
                </Form.Item>
                <Form.Item
                  label="Miss"
                  name="miss"
                  className="custom-oxanium-label-red-2"
                  style={{
                    width: '50%',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '10px',
                    color: 'white'
                  }}
                  labelCol={{
                    style: {
                      width: '45%',
                      padding: 0,
                      textAlign: 'left', 
                      display: 'inline-block',     // Para que el fondo no ocupe toda la línea
                    }
                  }}
                  rules={[{ required: true, message: 'Por favor ingrese cantidad de Miss' }]}
                >
                  <Input style={{ width: '100%', marginLeft: '10px', textAlign: 'center' }} type="number" placeholder="Miss" />
                </Form.Item>
                <Form.Item
                  label="Pass"
                  name="isPass"
                  className="custom-oxanium-label-red-2"
                  valuePropName="checked"  // Necesario para Switch
                  style={{ width: '45%', margin: '0 auto' }}
                  labelCol={{
                    style: {
                      width: '45%',
                      padding: 0,
                      textAlign: 'left',
                      display: 'inline-block',     // Para que el fondo no ocupe toda la línea
                    }
                  }}
                >
                  <Switch  style={{ marginLeft: '30%'}} />
                </Form.Item>
              </div>
              }
            </Form>
          </div>
        </Modal>
    </MainLayout>
  );
};

export default UserSongWeek;