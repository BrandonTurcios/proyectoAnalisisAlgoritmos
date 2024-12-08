import Grafo from "../Grafo";
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

const Page4 = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]); 
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); 
  const [nodeId, setNodeId] = useState(1);
  const [clique, setClique] = useState([]);
  const [history, setHistory] = useState([]);
  const [graph, setGraph] = useState(new Grafo(0));

  const addNode = () => {
    const newNode = {
      id: `${nodeId}`,
      data: { label: `Nodo ${nodeId}` }, 
      position: { x: Math.random() * 20, y: Math.random() * 20 },
    };

    setHistory((prevHistory) => [...prevHistory, { nodes, edges }]); 
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNodeId(nodeId + 1);
      

    // Actualiza la instancia del grafo
    setGraph((prevGraph) => {
      const updatedGraph = new Grafo(prevGraph.V + 1);
      updatedGraph.adj = [...prevGraph.adj, []]; // Agrega espacio para el nuevo nodo
      return updatedGraph;
    });

    notification.success({
      message: "Nodo agregado",
      description: `Nodo ${nodeId} agregado correctamente.`,
    });
  };

  const addRandomNodes = () => {
    const count = parseInt(prompt("¿Cuántos nodos deseas agregar?"), 10);
  
    if (isNaN(count) || count <= 0) {
      notification.error({
        message: "Número inválido",
        description: "Por favor, introduce un número válido mayor a 0.",
      });
      return;
    }
  
    const newNodes = [];
    const newEdges = [];
    let updatedGraph;
  
    setGraph((prevGraph) => {
      // Crea una copia del grafo anterior y agrega nuevos nodos
      updatedGraph = new Grafo(prevGraph.V + count);
      updatedGraph.adj = [...prevGraph.adj, ...Array.from({ length: count }, () => [])];
  
      // Genera nodos aleatorios
      for (let i = 0; i < count; i++) {
        const id = `${nodeId + i}`;
        newNodes.push({
          id,
          data: { label: `Nodo ${id}` },
          position: { x: Math.random() * 800, y: Math.random() * 600 },
        });
      }
  
      // Genera conexiones aleatorias
      newNodes.forEach((node, index) => {
        const source = parseInt(node.id, 10);
        const connections = Math.floor(Math.random() * count); // Conexiones aleatorias
        for (let j = 0; j < connections; j++) {
          const targetIndex = Math.floor(Math.random() * count);
          if (index !== targetIndex) {
            const target = parseInt(newNodes[targetIndex].id, 10);
            const edgeExists = updatedGraph.adj[source]?.includes(target);
  
            if (!edgeExists) {
              // Agrega la arista al grafo y a React Flow
              updatedGraph.addEdge(source, target);
              newEdges.push({
                id: `e${source}-${target}`,
                source: node.id,
                target: newNodes[targetIndex].id,
                type: "straight",
              });
            }
          }
        }
      });
  
      return updatedGraph; // Retorna el grafo actualizado
    });
  
    // Actualiza los estados de React Flow
    setHistory((prevHistory) => [...prevHistory, { nodes, edges }]);
    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    setNodeId(nodeId + count);
  
    notification.success({
      message: "Nodos agregados",
      description: `${count} nodos agregados con conexiones aleatorias.`,
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
  

      
      setGraph((prevGraph) => {
        const source = parseInt(params.source, 10);
        const target = parseInt(params.target, 10);
        console.log("source:", source, "target:", target, "V:", prevGraph.V);
        if (source > prevGraph.V || target > prevGraph.V) {
          notification.error({
            message: "Error al agregar arista",
            description: "Uno o ambos nodos no existen en el grafo.",
          });
          return prevGraph;
        }
  
        const updatedGraph = new Grafo(prevGraph.V);
        updatedGraph.adj = [...prevGraph.adj];
        updatedGraph.addEdge(source, target); // Agrega la arista
        return updatedGraph;
      });
  
      notification.success({
        message: "Arista agregada",
        description: `Conexión establecida entre ${params.source} y ${params.target}.`,
      });
    },
    [edges, nodes, setEdges, setHistory]
  );
  

  const findMaxClique = (x, matrix, currentClique = []) => {
    let maxClique = [...currentClique];  // Inicia con el clique actual
    maxClique.push(x);  // Agrega el nodo actual al clique
  
    // Buscar vecinos del nodo x
    let lista = [];
    for (let i = 0; i < nodes.length; i++) {
      if (matrix[x][i]) {
        lista.push(i);
      }
    }
  
    // Verificar si cada nodo en lista es parte de un clique mayor
    for (let i = 0; i < lista.length; i++) {
      let isClique = true;
  
      // Verificar si todos los nodos de maxClique son vecinos del nodo lista[i]
      for (let j = 0; j < maxClique.length; j++) {
        if (!matrix[lista[i]][maxClique[j]]) {
          isClique = false;
          break;
        }
      }
  
      // Si es vecino de todos los nodos en el clique actual, agregamos el nodo
      if (isClique) {
        // Llamada recursiva con el nuevo clique
        const newClique = findMaxClique(lista[i], matrix, maxClique);
        
        // Si el nuevo clique es más grande, actualizamos maxClique
        if (newClique.length > maxClique.length) {
          maxClique = [...newClique];
        }
      }
    }
  
    return maxClique;  // Retorna el clique máximo encontrado
  };

  const findClique = () => {
    const inicio = performance.now();
    
    // Crear matriz de adyacencia
    const matrix = Array.from({ length: nodes.length }, () =>
      Array(nodes.length).fill(false)
    );
  
    nodes.forEach((node, i) => {
      edges.forEach(({ source, target }) => {
        if (node.id === source || node.id === target) {
          const sourceIndex = nodes.findIndex((n) => n.id === source);
          const targetIndex = nodes.findIndex((n) => n.id === target);
          matrix[sourceIndex][targetIndex] = true;
          matrix[targetIndex][sourceIndex] = true;
        }
      });
    });
  
    let maxClique = [];
  
    // Usar findMaxClique para encontrar el clique máximo
    for (let i = 0; i < nodes.length; i++) {
      const currentClique = findMaxClique(i, matrix);  // Buscar clique máximo empezando desde el nodo i
      if (currentClique.length > maxClique.length) {
        for(let j = 0; j < currentClique.length; j++){
          currentClique[j] = currentClique[j] + 1;
        }
        maxClique = [...currentClique];  // Actualizar el clique máximo encontrado
      }
    }
  
    // Resultado final
    setClique(maxClique);
    
    const fin = performance.now();
    notification.success({
      message: "Clique máximo encontrado",
      description: `Clique: ${maxClique.join(", ")} (Tamaño: ${maxClique.length}) (Tiempo del proceso: ${(fin - inicio).toFixed(2)} ms)`,
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
    setNodeId(1); // Reinicia el ID de los nodos
    setGraph(new Grafo(0)); // Reinicia el grafo
    notification.success({ message: "Grafo vaciado" });
  };

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button type="primary" onClick={addNode} style={{ marginRight: "10px" }}>
          Agregar Nodo
        </Button>
        <Button type="primary" onClick={addRandomNodes} style={{ marginRight: "10px" }}>
          Agregar Nodos Aleatorios
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
            Size del clique:{" "}
            <span style={{ color: "green" }}>{clique.length}</span>
          </h3>
        ) : (
          <h3>No se encontró un clique.</h3>
        )}
      </div>
    </div>
  );
};

export default Page4;