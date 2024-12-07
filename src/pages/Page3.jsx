import React, { useState } from "react";
import { Form, Input, Button, Table, InputNumber, Typography, Divider } from "antd";
import "./Page3.css";

const { Title } = Typography;

const Page3 = () => {
  const [items, setItems] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [result, setResult] = useState(null);

  const addItem = (values) => {
    setItems([...items, { ...values, key: items.length }]);
  };

  const solveKnapsack = () => {
    const valores = items.map((item) => item.value);
    const pesos = items.map((item) => item.weight);
    const n = items.length;
    const resultados = new Array(n).fill(0);

    maximize(pesos, valores, resultados, n, capacity);

    const selectedItems = items.filter((_, index) => resultados[index] === 1);
    const unselectedItems = items.filter((_, index) => resultados[index] === 0);
    const maxValue = selectedItems.reduce((sum, item) => sum + item.value, 0);
    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);

    setResult({ maxValue, totalWeight, selectedItems, unselectedItems });
  };

  const maximize = (pesos, valores, resultados, n, capacidad) => {
    const z = new Array(n);
    for (let i = 0; i < n; i++) {
      z[i] = valores[i] / pesos[i];
    }
    let pesoTotal = 0;
    while (pesoTotal <= capacidad) {
      const indice = findMax(z);
      if (z[indice] === 0) break;

      resultados[indice] = 1;
      z[indice] = 0;
      pesoTotal += pesos[indice];

      if (pesoTotal > capacidad) {
        pesoTotal -= pesos[indice];
        resultados[indice] = 0;
      }
    }
  };
  const findMax = (array) => {
    let max = -1;
    let indice = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
        indice = i;
      }
    }
    return indice;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Problema Knapsack</Title>

      <Form layout="inline" onFinish={addItem}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Nombre es requerido" }]}
        >
          <Input placeholder="Nombre del artículo" />
        </Form.Item>
        <Form.Item
          name="weight"
          rules={[{ required: true, message: "Peso es requerido" }]}
        >
          <InputNumber placeholder="Peso" min={1} />
        </Form.Item>
        <Form.Item
          name="value"
          rules={[{ required: true, message: "Valor es requerido" }]}
        >
          <InputNumber placeholder="Valor" min={1} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Agregar
          </Button>
        </Form.Item>
      </Form>
      <Table
        style={{ marginTop: "20px" }}
        dataSource={items}
        columns={[
          { title: "Nombre", dataIndex: "name", key: "name" },
          { title: "Peso", dataIndex: "weight", key: "weight" },
          { title: "Valor", dataIndex: "value", key: "value" },
        ]}
        pagination={false}
      />

      <div style={{ marginTop: "20px" }}>
        <InputNumber
          placeholder="Capacidad máxima"
          value={capacity}
          onChange={setCapacity}
          min={1}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={solveKnapsack}>
          Resolver
        </Button>
      </div>
      {result && (
        <>
          <Divider />
          <Title level={3}>Resultado</Title>
          <p>Valor Máximo: {result.maxValue}</p>
          <p>Peso Total: {result.totalWeight}/{capacity}</p>

          <div className="knapsack">
            <div className="knapsack-container">
              <Title level={4}>Mochila</Title>
              {result.selectedItems.map((item, index) => (
                <div key={index} className="item">
                  {item.name} (Peso: {item.weight}, Valor: {item.value})
                </div>
              ))}
            </div>
            <div className="outside-container">
              <Title level={4}>Fuera de la Mochila</Title>
              {result.unselectedItems.map((item, index) => (
                <div key={index} className="item outside">
                  {item.name} (Peso: {item.weight}, Valor: {item.value})
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page3;
