import React, { useState } from 'react';
import { Form, Input, Select, Button, List, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Option } = Select;

const Agregar_semanas_canciones = () => {
  const [form] = Form.useForm();
  const [cancionesSeleccionadas, setCancionesSeleccionadas] = useState([]);
  const [cancionSeleccionada, setCancionSeleccionada] = useState(null);

  // Datos de ejemplo para el select de canciones
  const cancionesDisponibles = [
    { id: 1, nombre: "Canción 1" },
    { id: 2, nombre: "Canción 2" },
    { id: 3, nombre: "Canción 3" },
    { id: 4, nombre: "Canción 4" },
    { id: 5, nombre: "Canción 5" },
  ];

  const agregarCancion = () => {
    if (cancionSeleccionada && !cancionesSeleccionadas.some(c => c.id === cancionSeleccionada)) {
      const cancion = cancionesDisponibles.find(c => c.id === cancionSeleccionada);
      setCancionesSeleccionadas([...cancionesSeleccionadas, cancion]);
      setCancionSeleccionada(null);
    }
  };

  const eliminarCancion = (id) => {
    setCancionesSeleccionadas(cancionesSeleccionadas.filter(c => c.id !== id));
  };

  const handleSubmit = (values) => {
    const datosCompletos = {
      ...values,
      canciones: cancionesSeleccionadas
    };
    console.log('Datos enviados:', datosCompletos);
    // Aquí iría tu lógica para enviar los datos al backend
  };

  return (
    <MainLayout>
    <Card title="Registro Semanal" style={{ maxWidth: 600, margin: '20px auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Semana"
          name="semana"
          rules={[{ required: true, message: 'Por favor ingresa el número de semana' }]}
        >
          <Input type="number" min={1} placeholder="Ej: 1" />
        </Form.Item>

        <Form.Item label="Canciones">
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <Select
              style={{ flex: 1 }}
              placeholder="Selecciona una canción"
              value={cancionSeleccionada}
              onChange={setCancionSeleccionada}
            >
              {cancionesDisponibles.map(cancion => (
                <Option key={cancion.id} value={cancion.id}>
                  {cancion.nombre}
                </Option>
              ))}
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={agregarCancion}
              style={{ marginLeft: 8 }}
            >
              Agregar
            </Button>
          </div>

          <List
            bordered
            dataSource={cancionesSeleccionadas}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => eliminarCancion(item.id)}
                  />
                ]}
              >
                {item.nombre}
              </List.Item>
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" block>
            Registrar
          </Button>
        </Form.Item>
      </Form>
    </Card>
    </MainLayout>
  );
};

export default Agregar_semanas_canciones;