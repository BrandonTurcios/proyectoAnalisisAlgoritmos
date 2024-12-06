class Grafo {
    constructor(V) {
        this.V = V;
        this.adj = Array.from({ length: V }, () => []);
    }

    addEdge(source, target) {
        // Valida que los nodos sean válidos
        if (!this.adj[source]) this.adj[source] = [];
        if (!this.adj[target]) this.adj[target] = [];
    
        // Agrega las conexiones
        this.adj[source].push(target);
        this.adj[target].push(source); // Solo si el grafo es no dirigido
      }

    clique(n) {
        const clique = [];
        const estado = Array.from({ length: n }, (_, i) => i);

        console.log("ESTADO:");
        estado.forEach((val) => console.log(val));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    let flag = false;
                    for (const x of this.adj[i]) {
                        if (x === j) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        clique.push(j);
                    }
                }
            }
        }

        console.log("Clique:", clique.join(" "));
    }

    printGraph() {
        for (let i = 0; i < this.V; i++) {
            console.log(`Nodo ${i}: ${this.adj[i].join(" ")}`);
        }
    }
}

export default Grafo;
