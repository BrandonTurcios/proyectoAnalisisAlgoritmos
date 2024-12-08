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
      position: { x: Math.random() * 200, y: Math.random() * 200 },
    };

    setHistory((prevHistory) => [...prevHistory, { nodes, edges }]);
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNodeId(nodeId + 1);

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

    for (let i = 0; i < count; i++) {
      const id = `${nodeId + i}`;
      newNodes.push({
        id,
        data: { label: `Nodo ${id}` },
        position: { x: Math.random() * 800, y: Math.random() * 600 },
      });
    }

    newNodes.forEach((node, index) => {
      const connections = Math.floor(Math.random() * count);
      for (let j = 0; j < connections; j++) {
        const targetIndex = Math.floor(Math.random() * newNodes.length);
        if (index !== targetIndex) {
          newEdges.push({
            id: `e${node.id}-${newNodes[targetIndex].id}`,
            source: node.id,
            target: newNodes[targetIndex].id,
            type: "straight",
          });
        }
      }
    });

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
      const newEdge = { ...params, type: "straight" }; // Asegura que el tipo de borde sea recto

      const edgeExists = edges.some(
        (edge) =>
          (edge.source === newEdge.source && edge.target === newEdge.target) ||
          (edge.source === newEdge.target && edge.target === newEdge.source)
      );

      if (edgeExists) {
        notification.warning({
          message: "Arista duplicada",
          description: "Ya existe una conexión entre estos nodos.",
        });
        return;
      }

      setHistory((prevHistory) => [...prevHistory, { nodes, edges }]);
      setEdges((prevEdges) => addEdge(newEdge, prevEdges));

      notification.success({
        message: "Arista agregada",
        description: `Conexión establecida entre ${newEdge.source} y ${newEdge.target}.`,
      });
    },
    [edges, nodes, setEdges, setHistory]
  );

  const bronKerbosch = (R, P, X, graph) => {
    let cliques = [];
    if (P.size === 0 && X.size === 0) {
      cliques.push([...R]);  //Accion de 1 valor por if
    }

    for (let v of P) {
      let newR = new Set(R);
      newR.add(v);
      let newP = new Set([...P].filter((x) => graph.get(v).has(x)));
      let newX = new Set([...X].filter((x) => graph.get(v).has(x)));
      /*const setIter = newX.keys();
      for(let i = 0; i < newX.size; i++){
        console.log("El newX: ",setIter.next().value);
      }*/
      cliques = cliques.concat(bronKerbosch(newR, newP, newX, graph));  //Recursividad de bron-kerbosch y se concatena junto a clique
      P.delete(v);
      X.add(v);
    }


    return cliques;
  };

  const findClique = () => {
    const inicio = performance.now();
    const graph = new Map();

    nodes.forEach((node) => {
      graph.set(node.id, new Set()); //crea nodo junto con su lista para la adyacencia
    });
    edges.forEach(({ source, target }) => {
      graph.get(source).add(target);
      graph.get(target).add(source); // Define las aristas del grafo
    });

    const vertices = new Set(graph.keys()); //Guarda los nodos junto con sus conexiones
    const allCliques = bronKerbosch(new Set(), vertices, new Set(), graph); //Llama a la funcion de bronKerbosch
    const maxClique = allCliques.reduce(
      (max, clique) => (clique.length > max.length ? clique : max),
      []
    );

    setClique(maxClique);
    const fin = performance.now();
    notification.success({
      message: "Clique encontrado",
      description: maxClique.length
        ? `Clique máximo: ${maxClique.join(", ")} (${maxClique.length} nodos) (Tiempo del proceso= ${fin - inicio} ms)`
        : "No se encontró un clique.",
    });
    
  };

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

export default Page1;
