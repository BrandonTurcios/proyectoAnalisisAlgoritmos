import React, { useState } from "react";
import { Input, Button, Typography, Table } from "antd";
import { mainAlgorithm } from "../algorithms/Subsetsum";

const { Title } = Typography;

const SubsetSumPage = () => {
  const [array, setArray] = useState([]);
  const [targetSum, setTargetSum] = useState(0); // Nuevo estado para la suma objetivo
  const [result, setResult] = useState({
    arrayAsc: [],
    arrayDes: [],
    sum: null,
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    const parsedArray = value.split(",").map((num) => parseInt(num.trim(), 10));
    setArray(parsedArray);
  };

  const handleRunAlgorithm = () => {
    const inicio = performance.now();
    const output = mainAlgorithm(array, targetSum); // Usa el valor especificado por el usuario
    const fin = performance.now();
    console.log("El tiempo es: ");
    console.log(fin - inicio);
    setResult(output);
  };

  const columns = [
    {
      title: "Ascendente (arrayAsc)",
      dataIndex: "arrayAsc",
      key: "arrayAsc",
      render: (value) => value.join(", "),
    },
    {
      title: "Descendente (arrayDes)",
      dataIndex: "arrayDes",
      key: "arrayDes",
      render: (value) => value.join(", "),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Subset Sum Algorithm Aproximado</Title>
      <Input
        placeholder="Enter an array of numbers separated by commas (e.g., -4,-82,16,44)"
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <Input
        placeholder="Enter target sum (e.g., 10)"
        onChange={(e) => setTargetSum(parseInt(e.target.value, 10))}
        style={{ marginBottom: 20 }}
        type="number"
      />
      <Button type="primary" onClick={handleRunAlgorithm} style={{ marginBottom: 20 }}>
        Run Algorithm
      </Button>
      <div>
        <Title level={4}>Results</Title>
        <p>
          <strong>Sum Found:</strong> {result.sum !== null ? result.sum : "Not Found"}
        </p>
        <Table
          dataSource={[
            {
              key: "1",
              arrayAsc: result.arrayAsc,
              arrayDes: result.arrayDes,
            },
          ]}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default SubsetSumPage;
