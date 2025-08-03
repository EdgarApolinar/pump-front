import React, { useMemo, useState, useEffect, useCallback, use } from 'react';
import { Table, Select, Button, Spin, Row, Col, Card, message, Image, Input, Space, Modal, Form, InputNumber } from 'antd';
import MainLayout from '../components/MainLayout';
import DataTable from '../components/Table/DataTable';
import { songServices } from '../services/SongServices'
import 'antd/dist/reset.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const SongsAdmin = () => {

    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingAddLevels, setLoadingAddLevels] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [selectedPrimary, setSelectedPrimary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenSong, setIsModalOpenSong] = useState(false);
    const [pageDefault, setPageDefault] = useState(null); 
    const [form] = Form.useForm();
    const [onFinish] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [singleValue, setSingleValue] = useState([]);
    const [doubleValue, setDoubleValue] = useState([]);
    const [songTitle, setSongTitle] = useState ("");
    const [songId, setSongId] = useState (null);

    const ImageCell = React.memo(({ imageName }) => {
        const imageUrl = useMemo(() => {
            //console.log('Generando URL para:', imageName); // Solo debería aparecer una vez por imagen
            return `https://piugame.com/data/song_img/${imageName}.png`;
        }, [imageName]);
        
        return (
            // <img 
            // src={imageUrl}
            // alt=""
            // className="table-image"
            // onError={(e) => {
            //     e.target.src = '/logo512.png';
            // }}
            // loading="lazy"
            // />
             <Image.PreviewGroup
                preview={{
                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                }}
            >
                {/* <Image width={200} src={`${process.env.PUBLIC_URL}/songs/${imageNameSong}.png`}  /> */}
                <Image width={200} src={`https://piugame.com/data/song_img/${imageName}.png`}  />
                {/* <Image
                width={100}
                src={`${process.env.PUBLIC_URL}/level/${imageName}.png`}
                /> */}
            </Image.PreviewGroup>
        );
    });
    
    const columns = [
    { 
        key: 'name', 
        title: 'Titulo', 
        //sortable: true,
        //render: (value, row) => `${row.firstName} ${row.lastName}`
    },
    {
        key: 'piuCode', 
        title: 'Imagen',
        dataIndex: 'rating',
        render: (imageName) => <ImageCell imageName={imageName} />
    },
    ];

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

    const fetchSongsData = useCallback (async (params) => {

        setTableLoading(true);
    
        params.partName = selectedPrimary

        try{
          //console.log(selectedPrimary);
          const response = await songServices.get(params);
    
          const res = {
            data: response.songs,
            total: response.total
          };
          return res;
        } catch (error) {
          message.error('Error al cargar los datos');
          console.error('Error fetching table data:', error);
          return { data: [], total: 0 };
        } finally {
          setTableLoading(false);
          setSearchTriggered(false);
        }
      },[searchTriggered]);
    
    const handleRowClick = async (song) => {

        try {

            setLoadingAddLevels(true);

            const response = await songServices.getSongLevels(song.id);
            
            setSingleValue(response.singles);
            setDoubleValue(response.doubles);
            
        } catch(error){
            console.error('Error fetching table data:', error);
        } finally{
            setSongTitle(song.name);
            setSongId(song.id);
            showModalSong();
            setLoadingAddLevels(false);
        }

        
    // Navigate to user detail or open modal
    };

    useEffect(() => {
        onFinish.setFieldsValue({Singles : singleValue, Dobles : doubleValue});
        console.log("add nivel")
    }, [singleValue, doubleValue]);

    const handleSearch = () => {
         setSearchTriggered(true);
    };

    const handleInputChange = (e) => {
        setSelectedPrimary (e.target.value);
    };

    const handleClear = () => {
        setSelectedPrimary(null);
        setSearchTriggered(true);
        setPageDefault(1);
    };


    //**************modal song ************/
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        //setIsModalOpen(false);

        form.
            validateFields()
            .then(values => {
                setLoadingAdd(true);
                console.log('values :', values);
                return songServices.Add(values);
                
            })
            .then(response =>{
                console.log('response :', response);
                msuccess('Canción Agregada correctamente');
                form.resetFields();
                setIsModalOpen(false);
            })
            .catch(error =>{
                console.log(error);
                merror(error.error)
                //message.error(`Error: ${error.message || 'Error al guardar'}`, 10);
            })
            .finally(() => {
            setLoadingAdd(false);
            });
        };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const showModalSong = () => {
        setIsModalOpenSong(true);
    };

    const handleOkSong = async () => {

        onFinish
            .validateFields()
            .then(values => {
                console.log('Datos enviados:', values); // Arreglo de números

                return songServices.setSongLevels({singles: values.Singles, doubles: values.Dobles, idSong : songId});
            })
            .then(response => {
                console.log('response :', response);
                msuccess('Resgistro Exitoso');
                setIsModalOpenSong(false);

                //form.resetFields();
                //setIsModalOpen(false);
            }).catch(error =>{
                console.log(error);
                merror(error.error)
                //message.error(`Error: ${error.message || 'Error al guardar'}`, 10);
            }).finally(() => {
            //setLoadingAdd(false);
            });
        
    };

    const handleCancelSong = () =>{
        setIsModalOpenSong(false);
        setSingleValue([]);
        setDoubleValue([]);

    };


    // const onFinish = (values) => {
    // console.log('Datos enviados:', values); // Arreglo de números
    // alert(`Números ingresados: ${values.numbers.join(', ')}`);
    // }

    return(
        <MainLayout>
            {contextHolder}
            <section className="hero-section">
                <h1>Administracion de canciones</h1>
            </section>
            <section>
                <Card title="Búsqueda" style={{ margin: '20px' }}>
                <Spin spinning={loading}>
                    <Row gutter={16}>
                    <Col span={10}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input 
                                placeholder="Nombre de Canción"
                                value={selectedPrimary}
                                onChange={handleInputChange}
                            />
                            <Button 
                                type="primary"
                                onClick={handleSearch}
                            >Buscar</Button>
                        </Space.Compact>
                    </Col>
                    <Col span={3}>
                        <Button 
                            onClick={handleClear}
                            // disabled={!selectedPrimary}
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
                            // disabled={!selectedPrimary}
                            //block
                        >
                        Agregar nueva canción
                    </Button>
                    </Col>
                    
                    {/* <Col span={9}>
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
                    </Col> */}
                    </Row>
                </Spin>
                </Card>
            </section>

            <section className="features-section">
                {/* Contenido de la página */}
                <div className="page-container">
                    <DataTable
                        columns={columns}
                        fetchData={fetchSongsData}
                        onRowClick={handleRowClick}
                        initialSortField="name"
                        itemsPerPage={15}
                        initialPage={1}
                    />
                </div>
            </section>
            <Modal 
                title="Agregar Canción" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText = 'Agregar'
                cancelText = 'Salir'
                confirmLoading={loadingAdd}>
                
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nombre"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="piucode"
                        label="Código"
                        rules={[{ required: true, message: 'Por favor ingresa el código' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
                
            </Modal>
            <Modal 
                title= {`Agregar Nivel(es) - ${songTitle}`}
                open={isModalOpenSong} 
                onOk={handleOkSong} 
                onCancel={handleCancelSong}
                okText = 'Registrar'
                cancelText = 'Salir'
                confirmLoading={loadingAddLevels}>
                
                <Form form={onFinish} initialValue={{Singles : singleValue, Dobles : doubleValue}} autoComplete="off">
                    <h2>Singles</h2>
                    <Form.List name="Singles" >
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={name}
                                rules={[{ required: true, message: 'Ingresa un número' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                        const singles = getFieldValue('Singles') || [];
                                        if (singles.filter(v => v === value).length > 1) {
                                            return Promise.reject('Este número ya está registrado');
                                        }
                                        return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <InputNumber placeholder="Single" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button 
                            type="dashed" 
                            onClick={() => add()} 
                            block 
                            icon={<PlusOutlined />}
                            >
                            Agregar single
                            </Button>
                        </Form.Item>
                        </>
                    )}
                    </Form.List>
                    <h2>Dobles</h2>
                    <Form.List name="Dobles">
                    {(fields, { add, remove }) => (                        
                        <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={name}
                                rules={[{ required: true, message: 'Ingresa un número' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                        const dobles = getFieldValue('Dobles') || [];
                                        if (dobles.filter(v => v === value).length > 1) {
                                            return Promise.reject('Este número ya está registrado');
                                        }
                                        return Promise.resolve();
                                        },
                                    }),

                                ]}
                            >
                            <InputNumber placeholder="Doble" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button 
                            type="dashed" 
                            onClick={() => add()} 
                            block 
                            icon={<PlusOutlined />}
                            >
                            Agregar doble
                            </Button>
                        </Form.Item>
                        </>
                    )}
                    </Form.List>
                    {/* <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Enviar
                    </Button>
                    </Form.Item> */}
                </Form>                
            </Modal>
        </MainLayout>
    )
}

export default SongsAdmin;