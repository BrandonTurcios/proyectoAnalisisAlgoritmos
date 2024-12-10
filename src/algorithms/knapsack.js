function main() {
    //Para resolver el problema de knapsack necesitamos dos cosas primero el precio , y el valor

    /*valor de los objetos*/
    const valores = [20, 10, 30, 6]; 
    /*peso de los objetos*/
    const pesos = [5, 3, 4, 3];

    //nuestra mochila tiene un peso limitado:
    const mochila = 14;
    //
    const n = valores.length;
    //necsitamo agregar los resultados para cada elemento en un arreglo.
    //este arreglo alamacena 0 o 1 en cada posicion.
    const resultados = new Array(n).fill(0);

    
    //knapasack como objetivo llevar los objetos con mas valor dentro de la mochila
    //sin superar el  limite de peso
    // buscamos maximizar el valor dentro de la mochila.
    maximize(pesos, valores, resultados, n, mochila);
    //Maximze nos regresara un arrgelo con la solucion mas optima

    resultados.forEach(res => console.log(res));
}

function maximize(pesos, valores, resultados, n, capacidad) {
    /*pesos, valores y resultado son dos arreglos
      n es simplemente la cantidad de elementos disponibles para agregar a la mochila*/
    const z = new Array(n);
    // z es un nuevo arreglo en el que se almazena la razon valores/peso

    for (let i = 0; i < n; i++) {
        z[i] = valores[i] / pesos[i];
    }

    let pesoTotal = 0;
    /*El algoritmo necesita agregar a la mochila los elementos que brinden mas valor pero que pesen menos.
    Entonces simplemente ira agregando valores de mayor a menor hasta que la mochial se llene, cuando un valor se agrega a la mochila
    su valor en el arreglo "resultados" se vueleve 1, estos se hace que la mochila se llena*/
    while (pesoTotal <= capacidad) {
        const indice = findMax(z);
        resultados[indice] = 1; // Cambiamos el valor a 1
        z[indice] = 0; // si un elemento dentro de z se inserta en la mochila ya no lo podemos escoger.
        pesoTotal += pesos[indice];
        //si por alguna razon hemos excedido el peos de mochila debemos remover el elemento.
        if (pesoTotal > capacidad) {
            pesoTotal -= pesos[indice];
            z[indice]=0;
            resultados[indice] = 0; // Revertimos la decisión.
            
        }
        if((n-1)==indice){
            break;
        }
    }
}
/*Esta funcion puede ser reemplazada por un sort que almacena
 una tupla valor y posicion original en el arreglo, para hacer q
 ue el algorimto funcione.*/
function findMax(array) {
    //
    let max = array[0];
    let indice = 0;

    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
            //intentamos encontrar el maximo dentro de un arreglo pero solo retornaremos su posicion.
            indice = i;
        }
    }
    return indice;
}

// Ejecutar el programa
main();
