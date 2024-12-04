import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import { Button, notification } from "antd";

const Page1 = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]); 
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); 
  const [nodeId, setNodeId] = useState(1);
  const [clique, setClique] = useState([]);
  const [history, setHistory] = useState([]); 

  const addNode = () => {
    const newNode = {
      id: `${nodeId}`,
      data: { label: `Nodo ${nodeId}` }, 
      position: { x: Math.random() * 20, y: Math.random() * 20 },
    };

    setHistory((prevHistory) => [...prevHistory, { nodes, edges }]); 
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNodeId(nodeId + 1);

    notification.success({
      message: "Nodo agregado",
      description: `Nodo ${nodeId} agregado correctamente.`,
    });
  };

  const onConnect = useCallback(
    (params) => {
      const edgeExists = edges.some(
        (edge) =>
          (edge.source === params.source && edge.target === params.target) ||
          (edge.source === params.target && edge.target === params.source)
      );

      if (edgeExists) {
        notification.warning({
          message: "Arista duplicada",
          description: "Ya existe una conexión entre estos nodos.",
        });
        return;
      }

      setHistory((prevHistory) => [...prevHistory, { nodes, edges }]); 
      setEdges((prevEdges) => addEdge(params, prevEdges));

      notification.success({
        message: "Arista agregada",
        description: `Conexión establecida entre ${params.source} y ${params.target}.`,
      });
    },
    [edges, nodes]
  );

  const isClique = (subset, adjacencyList) => {
    for (let i = 0; i < subset.length; i++) {
      for (let j = i + 1; j < subset.length; j++) {
        if (!adjacencyList[subset[i]].includes(subset[j])) {
          return false;
        }
      }
    }
    return true;
  };

  const generateSubsets = (arr) => {
    const subsets = [];
    const backtrack = (current, index) => {
      if (index === arr.length) {
        subsets.push([...current]);
        return;
      }
      current.push(arr[index]);
      backtrack(current, index + 1);
      current.pop();
      backtrack(current, index + 1);
    };
    backtrack([], 0);
    return subsets;
  };

  const findClique = () => {
    const adjacencyList = {};
    nodes.forEach((node) => {
      adjacencyList[node.id] = [];
    });

    edges.forEach(({ source, target }) => {
      adjacencyList[source].push(target);
      adjacencyList[target].push(source);
    });

    const subsets = generateSubsets(nodes.map((node) => node.id));
    let maxClique = [];

    subsets.forEach((subset) => {
      if (isClique(subset, adjacencyList) && subset.length > maxClique.length) {
        maxClique = subset;
      }
    });

    setClique(maxClique);
    notification.success({
      message: "Clique encontrado",
      description: maxClique.length
        ? `Clique máximo: ${maxClique.join(", ")}`
        : "No se encontró un clique.",
    });
  };

  // Deshacer la última acción
  const undo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setNodes(lastState.nodes);
      setEdges(lastState.edges);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      notification.info({ message: "Acción deshecha" });
    } else {
      notification.warning({ message: "No hay acciones para deshacer" });
    }
  };

  // Vaciar el grafo
  const clearGraph = () => {
    setHistory((prevHistory) => [...prevHistory, { nodes, edges }]);
    setNodes([]);
    setEdges([]);
    setClique([]);
    notification.success({ message: "Grafo vaciado" });
  };

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button type="primary" onClick={addNode} style={{ marginRight: "10px" }}>
          Agregar Nodo
        </Button>
        <Button type="primary" onClick={findClique} style={{ marginRight: "10px" }}>
          Calcular Clique
        </Button>
        <Button type="default" onClick={undo} style={{ marginRight: "10px" }}>
          Deshacer
        </Button>
        <Button type="default" onClick={clearGraph}>
          Vaciar Grafo
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect} 
        fitView
        style={{ width: "100%", height: "80%" }}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
      <div>
        {clique.length > 0 ? (
          <h3>
            Clique Encontrado:{" "}
            <span style={{ color: "green" }}>{clique.join(", ")}</span>
          </h3>
        ) : (
          <h3>No se encontró un clique.</h3>
        )}
      </div>
    </div>
  );
};

export default Page1;
