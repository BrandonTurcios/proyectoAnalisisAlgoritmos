import React, { useState } from "react";
import { Form, Input, Button, Table, InputNumber, Typography, Divider, message } from "antd";
import { kSack } from "../algorithms/knapsackExacto.js"; // Importamos la nueva función
import "./Page3.css";

const { Title } = Typography;

const Page3Exacto = () => {
  const [items, setItems] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [randomCount, setRandomCount] = useState(0);
  const [result, setResult] = useState(null);

  const addItem = (values) => {
    if (values.weight <= 0 || values.value <= 0) {
      message.error("Peso y Valor deben ser mayores a 0.");
      return;
    }

    if (items.some((item) => item.name === values.name)) {
      message.error("El nombre del artículo debe ser único.");
      return;
    }

    setItems([...items, { ...values, key: items.length }]);
    message.success("Artículo agregado con éxito.");
  };

  const addRandomItems = () => {
    if (randomCount <= 0) {
      message.error("La cantidad debe ser mayor a 0.");
      return;
    }

    const randomItems = Array.from({ length: randomCount }, (_, i) => ({
      name: `Item ${items.length + i + 1}`,
      weight: Math.floor(Math.random() * 100) + 1,
      value: Math.floor(Math.random() * 200) + 1,
      key: items.length + i,
    }));

    setItems([...items, ...randomItems]);
    message.success(`${randomCount} artículos aleatorios agregados.`);
  };

  const solveKnapsack = () => {
    if (items.length === 0) {
      message.warning("Agregar al menos un item antes de resolver.");
      return;
    }
  
    if (capacity <= 0) {
      message.error("La capacidad debe ser mayor a 0.");
      return;
    }
  
    const valores = items.map((item) => item.value);
    const pesos = items.map((item) => item.weight);
  
    const startTime = performance.now(); // Inicio del tiempo
  
    // Llamada a kSack para resolver el problema de la mochila
    const maxValue = kSack(capacity, pesos, valores);
  
    const endTime = performance.now(); // Fin del tiempo
  
    // Ahora, reconstruir qué elementos se seleccionaron
    let W = capacity;
    const selectedItems = [];
    let memo = Array.from({ length: items.length + 1 }, () => Array(W + 1).fill(0));
  
    // Llenar la tabla de memoria (programación dinámica)
    for (let i = 1; i <= items.length; i++) {
      for (let w = 0; w <= W; w++) {
        if (items[i - 1].weight <= w) {
          memo[i][w] = Math.max(memo[i - 1][w], items[i - 1].value + memo[i - 1][w - items[i - 1].weight]);
        } else {
          memo[i][w] = memo[i - 1][w];
        }
      }
    }
  
    // Reconstruir los artículos seleccionados
    let w = W;
    for (let i = items.length; i > 0; i--) {
      if (memo[i][w] !== memo[i - 1][w]) {
        selectedItems.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
    }
  
    // Verificar si el peso total excede la capacidad
    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
    
    if (totalWeight > capacity) {
      // Si excede la capacidad, eliminamos ítems hasta que el peso se ajuste
      selectedItems.sort((a, b) => b.value - a.value); // Opcionalmente ordenar por valor
      let adjustedWeight = 0;
      const finalSelectedItems = [];
  
      for (let item of selectedItems) {
        if (adjustedWeight + item.weight <= capacity) {
          finalSelectedItems.push(item);
          adjustedWeight += item.weight;
        }
      }
  
      // Actualizamos la lista de seleccionados
      selectedItems.length = 0;
      selectedItems.push(...finalSelectedItems);
    }
  
    const executionTime = (endTime - startTime).toFixed(2); // Tiempo de ejecución
  
    setResult({
      maxValue,
      totalWeight: selectedItems.reduce((sum, item) => sum + item.weight, 0),
      selectedItems,
      unselectedItems: items.filter(item => !selectedItems.includes(item)),
      executionTime,
    });
  };
  

  const reset = () => {
    setItems([]);
    setCapacity(0);
    setRandomCount(0);
    setResult(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Problema Knapsack</Title>

      <Form layout="inline" onFinish={addItem}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[
            { required: true, message: "Nombre es requerido" },
            { max: 50, message: "El nombre no puede exceder 50 caracteres." },
          ]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>
        <Form.Item
          label="Peso"
          name="weight"
          rules={[
            { required: true, message: "Peso es requerido" },
            {
              type: "number",
              min: 1,
              message: "El peso debe ser un número mayor o igual a 1.",
            },
          ]}
        >
          <InputNumber placeholder="Peso" min={1} />
        </Form.Item>
        <Form.Item
          label="Valor"
          name="value"
          rules={[
            { required: true, message: "Valor es requerido" },
            {
              type: "number",
              min: 1,
              message: "El valor debe ser un número mayor o igual a 1.",
            },
          ]}
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
          onChange={(value) => {
            if (value > 0) {
              setCapacity(value);
            } else {
              message.error("La capacidad debe ser mayor a 0.");
            }
          }}
          min={1}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <InputNumber
          placeholder="Cantidad de ítems aleatorios"
          value={randomCount}
          onChange={(value) => {
            if (value >= 0) {
              setRandomCount(value);
            } else {
              message.error("La cantidad debe ser un número positivo.");
            }
          }}
          min={0}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={addRandomItems} style={{ marginRight: "10px" }}>
          Agregar Aleatorios
        </Button>
        <Button type="primary" onClick={solveKnapsack} style={{ marginRight: "10px" }}>
          Resolver
        </Button>
        <Button onClick={reset} danger>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Divider />
          <Title level={3}>Resultado</Title>
          <p>Valor Máximo: {result.maxValue}</p>
          <p>
            Peso Total: {result.totalWeight}/{capacity}
          </p>
          <p>Tiempo de Ejecución: {result.executionTime} ms</p>

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

export default Page3Exacto;