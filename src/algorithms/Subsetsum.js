
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
  
  export function mainAlgorithm(array, s) {
    let half = Math.ceil(array.length / 2);
  
    let arrayDes = array.slice(0, half);
    let arrayAsc = array.slice(half);
  
    arrayAsc = subsets(arrayAsc);
    arrayDes = subsets(arrayDes);
  
    arrayDes.sort((a, b) => b - a);
    arrayAsc.sort((a, b) => a - b);
    console.log(arrayAsc);
    console.log(arrayDes);

  
    let sum=1;
    // Necesitamos encontrar dos sumas de subjuntos que sumadas de s
    let indexA=0; //inidce para arreglo izquierdo
    let indexB=0; //indice para arreglo derecho
  
    while(indexA<arrayDes.length && indexB<arrayAsc.length){
         
      sum=arrayDes[indexA]+arrayAsc[indexB];
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
  if(sum!==s){
    sum=null;
  }
  console.log('El valor de la suma es: ')
  console.log(sum)
  
    return { arrayAsc, arrayDes, sum };
  }
  