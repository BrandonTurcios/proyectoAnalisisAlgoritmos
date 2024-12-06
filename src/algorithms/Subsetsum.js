
  //Esta funcion suma todo los elementos dentro de un arreglo
  function sum(subset) {
    
    let sum = 0;
    for (let i = 0; i < subset.length; i++) {
      sum += subset[i];
    }
    return sum;
  }

  //Esta funcion me todos los posibles sets dnetro de un set,
  // el tamano delm arrelgo "res" es 2^N
  //Este algoritmo se ejecuta en O(N* 2^N )
  function calcSubset(A, res, subset, index) {
    res.push(sum(subset));
    for (let i = index; i < A.length; i++) {
      subset.push(A[i]);
      calcSubset(A, res, subset, i + 1);
      subset.pop();
    }
  }
  //Nuestra funcion para obtener los sets.
  function subsets(A) {
    const subset = [];
    const res = [];
    let index = 0;
    calcSubset(A, res, subset, index);
    return res;
    //retornamos una lista de tamano 2^N
  }
  
  function main() {

    //para resolver el algoritmo de la suma de un subconjunto sera
    const array = [ -4, -82, -62, -21, 16, 44, 26, 33, -32, -70, 55, 51, -25];
    //1. Dividir el arrelgo en 2 partes
    let half = Math.ceil(array.length / 2);

    //2. Ordernar el lado izquiero de mayor a menor
    let arrayDes=array.slice(0,half);
    //3. Ordernar el lado derecho de menor a mayor
    let arrayAsc=array.slice(half);
  
    //Obtencion todas las sumas posibles con cada elemento.
     arrayAsc = subsets(arrayAsc);
     arrayDes = subsets(arrayDes);

  
     //Ordenamientos //reemplazar con QuickSort quickSort(arrayAsc,0,arrayAsc.length-1)
     arrayDes.sort((a, b) => b - a);
     arrayAsc.sort((a, b) => a - b);

     console.log(arrayAsc);
     console.log(arrayDes);



   
     let sum=1;
     let s=0; // Necesitamos encontrar dos sumas de subjuntos que sumadas de s
     let indexA=0; //inidce para arreglo izquierdo
     let indexB=0; //indice para arreglo derecho
   

     /* Luego de tener ambas listas ordendas el algorimos
     empezamos evaluando una suma entre elementos de ambas listas hasta encontar s*/
     while(indexA<arrayDes.length && indexB<arrayAsc.length){
         
         sum=arrayDes[indexA]+arrayAsc[indexB];
         console.log(sum)
         //si la suma es mayor a s
         if( sum> s){
            //movemos el indice del arreglo izquierdo un paso.
             indexA++;
        // si la suma es menor a s
         }else if (sum< s){
             //movemos el indice del arreglo derecho un paso.
             indexB++;
         }else{
            //una vez la encontremos terminamos el algoritmo
             break;
             
         }
     }
    
    console.log(sum)
  
  
  }
  
  main();
  