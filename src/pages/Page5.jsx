import React, { useState } from "react";
import { Input, Button, Typography, Table } from "antd";
import { isSubsetSum } from "../algorithmExact/subsetExact";

const { Title } = Typography;

const SubsetSumPage = () => {
  const [array, setArray] = useState([]);
  const [targetSum, setTargetSum] = useState(0); // Nuevo estado para la suma objetivo
  const [result, setResult] = useState();

  const handleInputChange = (e) => {
    const value = e.target.value;
    const parsedArray = value.split(",").map((num) => parseInt(num.trim(), 10));
    setArray(parsedArray);
  };

  const handleRunAlgorithm = () => {
    const inicio = performance.now();
    const output = isSubsetSum(array, targetSum); // Usa el valor especificado por el usuario
    const fin = performance.now();
    console.log("El tiempo es: ")
    console.log(fin - inicio);
    setResult(output);
  };


  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Subset Sum Algorithm</Title>
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
          <strong>Resultado :</strong> {result === true ? "Se encontro el valor" : "Not Found"}
        </p>
        
      </div>
    </div>
  );
};

export default SubsetSumPage;